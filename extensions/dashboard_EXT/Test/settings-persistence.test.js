#!/usr/bin/env node
/**
 * Bot & Site Settings Persistence Regression Test
 *
 * Ensures that applying dashboard admin updates keeps sensitive secrets intact
 * while returning the expected JSON-friendly configuration.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '..', 'config.json');

async function run() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error('Expected dashboard config.json to exist for test run');
  }

  const originalConfigContent = fs.readFileSync(CONFIG_PATH, 'utf8');
  const originalConfig = JSON.parse(originalConfigContent || '{}');

  const seededConfig = Object.assign({}, originalConfig, {
    clientSecret: 'test-client-secret',
    tokenSecret: 'test-token-secret',
    sessionSecret: 'test-session-secret',
    database: Object.assign({}, originalConfig.database, {
      password: 'super-secret-password',
      user: 'dbm_user',
      name: 'dbm_dashboard',
    }),
    botSettings: Object.assign({}, originalConfig.botSettings),
  });

  fs.writeFileSync(CONFIG_PATH, JSON.stringify(seededConfig, null, 4));

  let testOutcome = null;

  try {
    delete require.cache[require.resolve('../security/config')];
    const secureConfig = require('../security/config');

    secureConfig.loadConfig();

    const botSettingsPayload = {
      commandPrefix: '?',
      status: {
        presence: 'online',
        activity: 'Testing persistence',
      },
      language: 'en',
      timezone: 'UTC',
      statusRefreshInterval: 5,
      moderation: {
        auditLogChannel: '#moderation-logs',
        autoModLevel: 'balanced',
        muteRole: 'Muted',
      },
      music: {
        defaultVolume: 55,
        autoDisconnect: 'enabled',
      },
      security: {
        twoFactorRequired: 'optional',
        sessionTimeout: 60,
      },
      advanced: {
        webhookProxy: '',
        debugLogging: 'off',
      },
    };

    let rawConfig = secureConfig.getRawConfig({ includeSecrets: true }) || {};
    if (!rawConfig || Object.keys(rawConfig).length === 0) {
      rawConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    }

    const previousSecrets = {
      clientSecret: rawConfig.clientSecret,
      tokenSecret: rawConfig.tokenSecret,
      sessionSecret: rawConfig.sessionSecret,
      databasePassword: rawConfig.database?.password,
    };

    rawConfig.botSettings = botSettingsPayload;
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(rawConfig, null, 4));

    secureConfig.loadConfig();

    const reloadedRaw = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

    assert.strictEqual(
      reloadedRaw.clientSecret,
      previousSecrets.clientSecret,
      'Client secret should be preserved after bot settings update',
    );
    assert.strictEqual(
      reloadedRaw.tokenSecret,
      previousSecrets.tokenSecret,
      'Token secret should be preserved after bot settings update',
    );
    assert.strictEqual(
      reloadedRaw.sessionSecret,
      previousSecrets.sessionSecret,
      'Session secret should be preserved after bot settings update',
    );
    assert.strictEqual(
      reloadedRaw.database.password,
      previousSecrets.databasePassword,
      'Database password should be preserved after bot settings update',
    );

    const sanitized = secureConfig.getAll();
    assert.strictEqual(
      sanitized.botSettings.commandPrefix,
      botSettingsPayload.commandPrefix,
      'Sanitized payload should echo the persisted bot settings',
    );
    assert.strictEqual(
      sanitized.botSettings.status.activity,
      botSettingsPayload.status.activity,
      'Activity string should match the submitted value',
    );

    testOutcome = {
      successPayload: {
        sanitized,
        persisted: reloadedRaw,
      },
    };
  } finally {
    fs.writeFileSync(CONFIG_PATH, originalConfigContent);
  }

  console.log('✅ Bot settings persistence test passed');
  console.log(JSON.stringify(testOutcome.successPayload, null, 2));
}

run().catch((error) => {
  console.error('❌ Bot settings persistence test failed');
  console.error(error);
  process.exit(1);
});
