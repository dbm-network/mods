'use strict';

/**
 * Lightweight helper to send a diagnostic payload to the configured contact webhook.
 * Can be required by other modules or executed directly via `node contact-webhook-tester.js`.
 */

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const fetch = require('node-fetch');

const secureConfig = require('../security/config');

function getContactWebhookUrl(overrideUrl) {
  const configured =
    overrideUrl ||
    secureConfig.get('contactWebhook') ||
    secureConfig.get('mail')?.contactWebhook ||
    secureConfig.getAll().contactWebhook ||
    null;

  if (!configured) {
    throw new Error('Contact webhook URL is not configured.');
  }

  return configured;
}

function normalizeContactFields(details = {}) {
  const subject = (details.subject || 'Webhook Diagnostic (Contact Form)').toString().trim();
  const name = (details.name || details.actor || 'Dashboard Tester').toString().trim();
  const email = (details.email || 'diagnostics@newstargeted.com').toString().trim().toLowerCase();
  const messageLines = [
    details.message || 'Automated diagnostic payload issued to verify webhook connectivity and permissions.',
    '',
    `Environment: ${details.environment || (secureConfig.isProduction() ? 'production' : 'development')}`,
    `Runner: ${details.actor || 'CLI Diagnostic Runner'}`,
  ];
  const message = messageLines.filter(Boolean).join('\n');

  return {
    subject,
    name,
    email,
    message,
  };
}

function buildDiagnosticPayload(details = {}) {
  const fields = normalizeContactFields(details);
  const timestamp = new Date().toISOString();
  const hashedEmail = crypto.createHash('sha256').update(fields.email).digest('hex').slice(0, 16);

  const embed = {
    title: `Contact: ${fields.subject.slice(0, 256)}`,
    color: 0x5865f2,
    timestamp,
    fields: [
      {
        name: 'Name',
        value: fields.name.slice(0, 256) || 'Anonymous',
        inline: true,
      },
      {
        name: 'Email',
        value: fields.email.slice(0, 320) || 'unknown@example.com',
        inline: true,
      },
      {
        name: 'Message',
        value: `\`\`\`\n${fields.message.slice(0, 900)}\n\`\`\``,
      },
    ],
    footer: {
      text: `Contact Hash • ${hashedEmail}`,
    },
  };

  return {
    hash: hashedEmail,
    payload: {
      username: details.username || 'News Targeted Contact Form',
      embeds: [embed],
    },
  };
}

async function sendDiagnosticPayload(options = {}) {
  const webhookUrl = getContactWebhookUrl(options.webhookUrl);
  const { payload, hash } = buildDiagnosticPayload(options);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || 10000);

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Discord webhook responded with ${response.status}: ${text}`);
    }

    return {
      success: true,
      hash,
      webhookUrl,
    };
  } catch (error) {
    throw new Error(`Failed to dispatch diagnostic webhook: ${error.message}`);
  } finally {
    clearTimeout(timeout);
  }
}

if (require.main === module) {
  let overrides = {};
  const payloadPath = process.argv[2];
  if (payloadPath) {
    try {
      const resolvedPath = path.resolve(process.cwd(), payloadPath);
      overrides = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
    } catch (error) {
      console.warn(`⚠️ Unable to read payload overrides from ${payloadPath}: ${error.message}`);
    }
  }

  sendDiagnosticPayload(overrides)
    .then((result) => {
      console.log(
        JSON.stringify(
          {
            success: true,
            hash: result.hash,
            target: result.webhookUrl,
          },
          null,
          2,
        ),
      );
    })
    .catch((error) => {
      console.error(
        JSON.stringify(
          {
            success: false,
            error: error.message,
          },
          null,
          2,
        ),
      );
      process.exitCode = 1;
    });
}

module.exports = {
  sendDiagnosticPayload,
  buildDiagnosticPayload,
};
