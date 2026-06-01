'use strict';

let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (error) {
  console.warn('[contact_route] nodemailer not available, contact form will log submissions only.');
  nodemailer = null;
}
// Use global fetch if available, otherwise fall back to node-fetch
let fetch;
try {
  if (typeof global.fetch === 'function') {
    fetch = global.fetch;
  } else if (typeof globalThis.fetch === 'function') {
    fetch = globalThis.fetch;
  } else {
    const nodeFetch = require('node-fetch');
    fetch = nodeFetch.default || nodeFetch;
  }
} catch (error) {
  console.error('[contact_route] Failed to load fetch:', error.message);
  // Fallback to require if import fails
  try {
    const nodeFetch = require('node-fetch');
    fetch = nodeFetch.default || nodeFetch;
  } catch (e) {
    console.error('[contact_route] node-fetch not available:', e.message);
    throw new Error('Fetch is not available. Please install node-fetch.');
  }
}
const crypto = require('crypto');
const validator = require('validator');

const DISCORD_EMBED_FIELD_LIMIT = 1024;
const MAX_CONTACT_MESSAGE_LENGTH = DISCORD_EMBED_FIELD_LIMIT;
const TRUNCATION_NOTICE = '\n\n*Message truncated to fit Discord limit.*';

let cachedTransport = null;
const webhookQueue = [];
let webhookQueueProcessing = false;
const MAX_WEBHOOK_RETRIES = 3;

function enqueueWebhookJob(job) {
  return new Promise((resolve, reject) => {
    webhookQueue.push({ job, resolve, reject });
    processWebhookQueue().catch((error) => {
      console.error('[contact_route] Unhandled webhook queue error:', error);
    });
  });
}

async function processWebhookQueue() {
  if (webhookQueueProcessing) {
    return;
  }

  webhookQueueProcessing = true;

  while (webhookQueue.length > 0) {
    const { job, resolve, reject } = webhookQueue.shift();
    try {
      const result = await job();
      resolve(result);
    } catch (error) {
      reject(error);
    }
  }

  webhookQueueProcessing = false;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function dispatchWebhook(webhookUrl, payload, attempt = 1) {
  if (!webhookUrl) {
    throw new Error('Missing contact webhook configuration');
  }

  if (!fetch || typeof fetch !== 'function') {
    throw new Error('Fetch function is not available');
  }

  // Create timeout mechanism (compatible with both node-fetch v2 and v3)
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('Webhook request timed out after 10 seconds'));
    }, 10000);
  });

  try {
    const payloadString = JSON.stringify(payload);
    console.log('[contact_route] Sending webhook to:', webhookUrl);
    console.log('[contact_route] Payload size:', payloadString.length, 'bytes');

    // Build fetch options
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NewsTargeted-ContactForm/1.0',
      },
      body: payloadString,
    };

    // Add signal if AbortController is available (node-fetch v3)
    if (typeof AbortController !== 'undefined') {
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 10000);
      fetchOptions.signal = controller.signal;
    }

    // Race between fetch and timeout
    const fetchPromise = fetch(webhookUrl, fetchOptions);
    const response = await Promise.race([fetchPromise, timeoutPromise]);

    const responseText = await response.text();

    if (!response.ok) {
      console.error('[contact_route] Discord webhook error:', response.status);
      console.error('[contact_route] Discord response:', responseText.substring(0, 500));
      const error = new Error(
        `Discord webhook responded with status ${response.status}: ${responseText.substring(0, 200)}`,
      );
      error.status = response.status;
      error.response = responseText;
      throw error;
    }

    console.log('[contact_route] Webhook sent successfully');
    return true;
  } catch (error) {
    if (error.message && error.message.includes('timeout')) {
      throw new Error('Webhook request timed out after 10 seconds');
    }

    if (attempt < MAX_WEBHOOK_RETRIES) {
      console.warn(`[contact_route] Webhook attempt ${attempt} failed, retrying...`, error.message);
      await wait(750 * attempt);
      return dispatchWebhook(webhookUrl, payload, attempt + 1);
    }

    throw error;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

function buildTransport(mailSettings) {
  if (!nodemailer || !mailSettings || !mailSettings.enabled) {
    return null;
  }

  if (
    !mailSettings.transport ||
    !mailSettings.transport.host ||
    !mailSettings.transport.auth ||
    !mailSettings.transport.auth.user ||
    !mailSettings.transport.auth.pass
  ) {
    console.warn(
      '[contact_route] Mail transport is not fully configured. Contact form submissions will be logged but not emailed.',
    );
    return null;
  }

  if (!cachedTransport) {
    cachedTransport = nodemailer.createTransport({
      host: mailSettings.transport.host,
      port: mailSettings.transport.port || 587,
      secure: Boolean(mailSettings.transport.secure),
      auth: {
        user: mailSettings.transport.auth.user,
        pass: mailSettings.transport.auth.pass,
      },
    });
  }

  return cachedTransport;
}

function sanitize(value, options = {}) {
  const { maxLength = 0, allowNewLines = false } = options;

  let result = (value ?? '').toString();
  result = validator.unescape(result);
  result = allowNewLines ? result.replace(/\r\n?/g, '\n') : result.replace(/[\r\n]+/g, ' ');
  result = result.replace(/<[^>]*>/g, '');
  result = result.replace(/[<>]/g, '');
  result = validator.stripLow(result, allowNewLines);
  result = allowNewLines ? result.replace(/[ \t]+\n/g, '\n') : result.replace(/\s{2,}/g, ' ');
  result = result.replace(/\u200B/g, '');
  result = result.trim();

  if (maxLength > 0 && result.length > maxLength) {
    result = result.slice(0, maxLength);
  }

  return result;
}

function buildDiscordMessageField(rawMessage) {
  if (!rawMessage) {
    return {
      value: '_No message provided_',
      truncated: false,
    };
  }

  let message = sanitize(rawMessage, { allowNewLines: true, maxLength: MAX_CONTACT_MESSAGE_LENGTH });
  if (!message) {
    return {
      value: '_No message provided_',
      truncated: false,
    };
  }

  message = message
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/g, ''))
    .join('\n')
    .trim();

  if (!message) {
    return {
      value: '_No message provided_',
      truncated: false,
    };
  }

  if (message.length <= DISCORD_EMBED_FIELD_LIMIT) {
    return {
      value: message,
      truncated: false,
    };
  }

  const availableLength = DISCORD_EMBED_FIELD_LIMIT - TRUNCATION_NOTICE.length - 1;
  const sliceLength = Math.max(availableLength, 0);
  let truncatedMessage = message.slice(0, sliceLength).trimEnd();

  if (truncatedMessage.length === 0 && message.length > 0) {
    truncatedMessage = message
      .slice(0, Math.min(DISCORD_EMBED_FIELD_LIMIT - TRUNCATION_NOTICE.length, message.length))
      .trimEnd();
  }

  const finalMessage = `${truncatedMessage}…${TRUNCATION_NOTICE}`;

  return {
    value:
      finalMessage.length > DISCORD_EMBED_FIELD_LIMIT ? finalMessage.slice(0, DISCORD_EMBED_FIELD_LIMIT) : finalMessage,
    truncated: true,
  };
}

function formatSubmission(payload, context = {}) {
  const { name, email, subject, message } = payload;
  const safeSubject = sanitize(subject || 'No subject', { maxLength: 256 });
  const safeName = sanitize(name || 'Anonymous', { maxLength: 256 });
  const safeEmail = sanitize(email || 'unknown@example.com', { maxLength: 320 });
  const safeMessage = sanitize(message || '', { allowNewLines: true, maxLength: MAX_CONTACT_MESSAGE_LENGTH });
  const hashedEmail = crypto.createHash('sha256').update(safeEmail.toLowerCase()).digest('hex').slice(0, 16);
  const { value: discordMessage, truncated: messageWasTruncated } = buildDiscordMessageField(safeMessage);
  const contactUrl = context.contactUrl ? sanitize(context.contactUrl) : null;

  // Build embed fields array
  const embedFields = [
    {
      name: 'Name',
      value: safeName || 'Not provided',
      inline: true,
    },
    {
      name: 'Email',
      value: safeEmail || 'Not provided',
      inline: true,
    },
    {
      name: 'Message',
      value: discordMessage || '_No message provided_',
    },
  ];

  // Add truncation note if needed
  if (messageWasTruncated) {
    embedFields.push({
      name: 'Note',
      value: 'Original message exceeded Discord embed limits and was truncated.',
    });
  }

  // Build footer text (Discord footer text limit is 2048 characters)
  const footerText = contactUrl ? `Contact Hash: ${hashedEmail}` : `Contact Hash: ${hashedEmail}`;
  const footerTextTruncated = footerText.length > 2048 ? `${footerText.substring(0, 2045)}...` : footerText;

  // Build the embed object (Discord embed limits)
  const embedTitle = (safeSubject || 'Contact Form Submission').substring(0, 256);
  const embedDescription = `New contact form submission from ${safeName || 'Anonymous'}`.substring(0, 4096);

  const embed = {
    title: embedTitle,
    description: embedDescription,
    color: 0x5865f2,
    timestamp: new Date().toISOString(),
    fields: embedFields,
    footer: {
      text: footerTextTruncated.substring(0, 2048),
    },
  };

  // Add URL if provided (must be valid URL)
  if (contactUrl && contactUrl.startsWith('http')) {
    try {
      new URL(contactUrl); // Validate URL
      embed.url = contactUrl;
    } catch (e) {
      // Invalid URL, skip it
    }
  }

  // Build Discord webhook payload
  const discordPayload = {
    username: 'News Targeted Contact Form',
    embeds: [embed],
  };

  return {
    text: `New dashboard contact submission\n\nName: ${safeName}\nEmail: ${safeEmail}\nSubject: ${safeSubject}\n\nMessage:\n${safeMessage}`,
    html: `
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Subject:</strong> ${safeSubject}</p>
            <h4>Message</h4>
            <p style="white-space:pre-line;">${safeMessage}</p>
        `,
    discord: discordPayload,
    hash: hashedEmail,
    subject: safeSubject,
    name: safeName,
  };
}

function issueSessionCsrfToken(req, Dashboard) {
  if (!Dashboard || !Dashboard.csrfProtection) {
    return null;
  }

  let token = null;

  if (req.session && req.sessionID) {
    try {
      token = Dashboard.csrfProtection.getTokenForSession(req.sessionID, {
        ip: req.ip,
        userAgent: req.get ? req.get('User-Agent') : null,
      });

      if (token) {
        if (!Array.isArray(req.session._csrfTokens)) {
          req.session._csrfTokens = [];
        }

        req.session._csrfTokens.push({
          token,
          ts: Date.now(),
        });

        if (req.session._csrfTokens.length > 10) {
          req.session._csrfTokens = req.session._csrfTokens.slice(-10);
        }

        req.session._csrfLastIssued = Date.now();
        req.session.csrfToken = token;

        if (typeof req.session.touch === 'function') {
          req.session.touch();
        }
      }
    } catch (error) {
      console.warn('[contact_route] Unable to issue session CSRF token:', error.message);
    }
  }

  if (!token && typeof Dashboard.csrfProtection.createStatelessTokenFromRequest === 'function') {
    token = Dashboard.csrfProtection.createStatelessTokenFromRequest(req);
  }

  return token;
}

module.exports = {
  buildTransport,
  init: async (DBM, Dashboard) => {
    const limiter = require('express-rate-limit')({
      windowMs: 60 * 1000,
      max: 5,
      standardHeaders: true,
      legacyHeaders: false,
    });

    Dashboard.app.post('/contact', limiter, async (req, res) => {
      try {
        const name = sanitize(req.body.name, { maxLength: 256 });
        const email = sanitize(req.body.email, { maxLength: 320 });
        const subject = sanitize(req.body.subject, { maxLength: 256 });
        const message = sanitize(req.body.message, { allowNewLines: true, maxLength: MAX_CONTACT_MESSAGE_LENGTH });

        if (!name || name.length < 2) {
          const nextToken = issueSessionCsrfToken(req, Dashboard);
          return res.status(400).json({ success: false, error: 'Please provide your name.', csrf: nextToken });
        }

        if (!validator.isEmail(email || '')) {
          const nextToken = issueSessionCsrfToken(req, Dashboard);
          return res
            .status(400)
            .json({ success: false, error: 'Please provide a valid email address.', csrf: nextToken });
        }

        if (!subject || subject.length < 3) {
          const nextToken = issueSessionCsrfToken(req, Dashboard);
          return res
            .status(400)
            .json({ success: false, error: 'Subject must be at least 3 characters long.', csrf: nextToken });
        }

        if (!message || message.length < 10) {
          const nextToken = issueSessionCsrfToken(req, Dashboard);
          return res
            .status(400)
            .json({ success: false, error: 'Message must be at least 10 characters long.', csrf: nextToken });
        }

        const mailSettings = Dashboard.settings.mail || {};

        const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
        const host = req.headers.host || 'localhost:3002';
        const baseUrl = `${protocol}://${host}`.replace(/\/+$/, '');
        const contactPath = ((req.originalUrl || '/contact').split('?')[0] || '/contact').trim() || '/contact';
        const normalizedContactPath = contactPath.startsWith('/') ? contactPath : `/${contactPath}`;
        const contactUrl = `${baseUrl}${normalizedContactPath}`;

        const payload = formatSubmission({ name, email, subject, message }, { contactUrl });

        // Get webhook from secure config (highest priority)
        let contactWebhook = null;
        if (Dashboard.secureConfig && typeof Dashboard.secureConfig.get === 'function') {
          contactWebhook = Dashboard.secureConfig.get('contactWebhook');
          if (contactWebhook) {
            console.log('[contact_route] Found webhook in secureConfig');
          }
        }

        // Fallback to other sources
        if (!contactWebhook) {
          contactWebhook = mailSettings.contactWebhook || Dashboard.settings.contactWebhook || null;
        }

        console.log('[contact_route] Contact webhook configured:', contactWebhook ? 'Yes' : 'No');
        if (contactWebhook) {
          console.log('[contact_route] Webhook URL:', `${contactWebhook.substring(0, 50)}...`);
        }

        if (!contactWebhook || typeof contactWebhook !== 'string' || contactWebhook.trim().length === 0) {
          console.error('[contact_route] Contact webhook is not configured. Submission could not be delivered.');
          const nextToken = issueSessionCsrfToken(req, Dashboard);
          return res
            .status(503)
            .json({ success: false, error: 'Contact form temporarily unavailable.', csrf: nextToken });
        }

        try {
          await enqueueWebhookJob(async () => {
            await dispatchWebhook(contactWebhook, payload.discord);
          });

          console.log(
            `[contact_route] Contact submission queued via webhook: subject="${payload.subject}" name="${payload.name}" hash=${payload.hash}`,
          );

          const nextToken = issueSessionCsrfToken(req, Dashboard);
          return res.json({ success: true, csrf: nextToken });
        } catch (webhookError) {
          console.error('[contact_route] Webhook dispatch failed:', webhookError.message);
          if (webhookError.response) {
            console.error('[contact_route] Discord error response:', webhookError.response);
          }
          const nextToken = issueSessionCsrfToken(req, Dashboard);
          return res.status(502).json({
            success: false,
            error: 'Unable to send your message right now. Please try again later.',
            csrf: nextToken,
          });
        }
      } catch (error) {
        console.error('[contact_route] Failed to process contact form:', error);
        console.error('[contact_route] Error stack:', error.stack);
        const nextToken = issueSessionCsrfToken(req, Dashboard);
        // Always return JSON, never HTML
        if (!res.headersSent) {
          return res.status(500).json({
            success: false,
            error: 'An error occurred while processing your request. Please try again later.',
            csrf: nextToken,
          });
        }
      }
    });
  },

  run: (DBM, req, res, Dashboard) => {
    const seo = Dashboard.settings.seo || {};
    const cookieConsent = Dashboard.settings.cookieConsent || {};
    const footer = Dashboard.settings.footer || {};
    const navItems = Dashboard.settings.navItems || [];
    const mailSettings = Dashboard.settings.mail || {};

    const ownerConfig = Dashboard.settings.ownerIds || Dashboard.settings.owner || [];
    const ownerIds = Array.isArray(ownerConfig)
      ? ownerConfig.map((id) => String(id).trim()).filter(Boolean)
      : String(ownerConfig || '')
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean);
    const currentUserId = req.user && req.user.id ? String(req.user.id) : null;
    const isOwner = currentUserId ? ownerIds.includes(currentUserId) : false;

    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers.host || 'localhost:3002';
    const canonical = seo.canonicalBase
      ? `${seo.canonicalBase.replace(/\/$/, '')}${req.originalUrl}`
      : `${protocol}://${host}${req.originalUrl}`;
    const statelessToken =
      Dashboard.csrfProtection && typeof Dashboard.csrfProtection.createStatelessTokenFromRequest === 'function'
        ? Dashboard.csrfProtection.createStatelessTokenFromRequest(req)
        : null;
    const csrfTokenValue = req.csrfToken || (res.locals && res.locals.csrfToken) || statelessToken;

    return {
      navItems,
      footer,
      mail: mailSettings,
      contact: {
        method: 'discord-webhook',
        responseTime: 'Typically under 24 hours',
        supportServer: Dashboard.settings.supportServer,
      },
      csrfToken: csrfTokenValue,
      supportServer: Dashboard.settings.supportServer,
      seo: {
        title: `Contact - ${seo.defaultTitle || 'News Targeted Bot Dashboard'}`,
        description: 'Get in touch with the News Targeted Bot team directly through the dashboard.',
        keywords: seo.defaultKeywords,
        image: seo.defaultImage,
        canonical,
      },
      cookieConsent,
      client: DBM.Bot.bot,
      user: req.user || null,
      ownerIds,
      isOwner,
    };
  },
};
