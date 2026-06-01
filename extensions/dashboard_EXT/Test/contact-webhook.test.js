#!/usr/bin/env node
/*
 * Contact Webhook Delivery Test
 */

const assert = require('assert');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

let fetchImpl = global.fetch;
if (!fetchImpl) {
  const nodeFetch = require('node-fetch');
  fetchImpl = nodeFetch.default || nodeFetch;
}

const contactRoute = require('../actions/routes/contact/contact_route');
const csrfProtection = require('../security/csrf');

async function createWebhookReceiver() {
  const app = express();
  app.use(express.json({ limit: '256kb' }));

  let lastPayload = null;
  const server = await new Promise((resolve) => {
    const httpServer = app.listen(0, () => resolve(httpServer));
  });

  app.post('/contact-webhook', (req, res) => {
    lastPayload = req.body;
    res.status(204).end();
  });

  const address = server.address();
  return {
    url: `http://127.0.0.1:${address.port}/contact-webhook`,
    close: () =>
      new Promise((resolve) => {
        server.close(() => resolve());
      }),
    getPayload: () => lastPayload,
  };
}

async function run() {
  const webhook = await createWebhookReceiver();

  const dashboardApp = express();
  dashboardApp.use(cookieParser('test-secret'));
  dashboardApp.use(
    session({
      secret: 'test-session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
      },
    }),
  );
  dashboardApp.use(bodyParser.json({ limit: '256kb' }));
  dashboardApp.use(bodyParser.urlencoded({ extended: true }));
  dashboardApp.use(csrfProtection.generateTokenMiddleware());
  dashboardApp.use(csrfProtection.verifyTokenMiddleware());

  dashboardApp.get('/csrf-token', (req, res) => {
    res.status(200).json({
      token: req.csrfToken || res.locals.csrfToken,
    });
  });

  const Dashboard = {
    app: dashboardApp,
    secureConfig: {
      get: (key) => {
        if (key === 'contactWebhook') {
          return webhook.url;
        }
        if (key === 'mail') {
          return {};
        }
        return null;
      },
    },
    settings: {
      mail: {},
      seo: {},
      footer: {},
      navItems: [],
      supportServer: 'https://discord.gg/nx9Kzrk',
      cookieConsent: {},
    },
  };

  await contactRoute.init({}, Dashboard);

  const server = await new Promise((resolve) => {
    const httpServer = dashboardApp.listen(0, () => resolve(httpServer));
  });

  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  let cookieJar = '';

  async function httpRequest(method, route, body) {
    const url = `${baseUrl}${route}`;
    const headers = {};
    if (body) {
      headers['Content-Type'] = 'application/json';
    }
    if (cookieJar) {
      headers.Cookie = cookieJar;
    }

    const response = await fetchImpl(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      redirect: 'manual',
    });

    let setCookieValues = [];
    if (typeof response.headers.getSetCookie === 'function') {
      setCookieValues = response.headers.getSetCookie();
    } else if (typeof response.headers.raw === 'function') {
      setCookieValues = response.headers.raw()['set-cookie'] || [];
    } else {
      const singleCookie = response.headers.get('set-cookie');
      if (singleCookie) {
        setCookieValues = [singleCookie];
      }
    }

    if (setCookieValues.length > 0) {
      cookieJar = setCookieValues.map((value) => value.split(';')[0]).join('; ');
    }

    const text = await response.text();
    let json = {};
    if (text) {
      try {
        json = JSON.parse(text);
      } catch {
        json = {};
      }
    }

    return {
      status: response.status,
      ok: response.ok,
      json,
    };
  }

  const tokenResponse = await httpRequest('GET', '/csrf-token');
  assert.strictEqual(tokenResponse.status, 200, 'Expected 200 from /csrf-token');
  const csrfToken = tokenResponse.json.token;
  if (!csrfToken) {
    throw new Error('Failed to obtain CSRF token for test');
  }

  const validPayload = {
    name: 'Webhook Tester',
    email: 'webhook.tester@example.com',
    subject: 'Integration Check',
    message: 'This is a test message for the Discord webhook queue.',
    _csrf: csrfToken,
  };

  const invalidResponse = await httpRequest('POST', '/contact', { ...validPayload, subject: '' });
  assert.strictEqual(invalidResponse.status, 400, 'Invalid subject should return HTTP 400');
  assert.strictEqual(invalidResponse.json.success, false);
  assert(
    invalidResponse.json.error && invalidResponse.json.error.includes('Subject'),
    'Response should mention missing subject',
  );

  const successResponse = await httpRequest('POST', '/contact', validPayload);
  assert.strictEqual(successResponse.status, 200, 'Valid contact submission should return HTTP 200');
  assert.strictEqual(successResponse.json.success, true);

  await new Promise((resolve) => setTimeout(resolve, 500));

  const deliveredPayload = webhook.getPayload();
  assert(deliveredPayload, 'Webhook payload should be delivered');
  assert(Array.isArray(deliveredPayload.embeds), 'Webhook payload should include embeds');
  assert.strictEqual(
    deliveredPayload.embeds[0].fields[0].value,
    validPayload.name,
    'Webhook payload should contain the submitted name',
  );

  Dashboard.secureConfig.get = (key) => {
    if (key === 'contactWebhook') {
      return '';
    }
    if (key === 'mail') {
      return {};
    }
    return null;
  };

  const unavailableResponse = await httpRequest('POST', '/contact', validPayload);
  assert.strictEqual(unavailableResponse.status, 503, 'Missing webhook should return 503');
  assert.strictEqual(unavailableResponse.json.success, false);
  assert(unavailableResponse.json.error && unavailableResponse.json.error.includes('temporarily unavailable'));

  server.close();
  await webhook.close();

  console.log('✅ Contact webhook delivery test passed');
}

run().catch((error) => {
  console.error('❌ Contact webhook delivery test failed');
  console.error(error);
  process.exit(1);
});
