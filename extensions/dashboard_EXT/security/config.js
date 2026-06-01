// ========================================
// Secure Configuration Loader
// ========================================
// This module handles secure loading of configuration
// and ensures no sensitive data is exposed

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

const SECRETS_FILE_PATH = path.join(__dirname, '../config.secrets.json');
const DBM_SETTINGS_PATH = path.join(__dirname, '../data/settings.json');

class SecureConfig {
  constructor() {
    this.config = {};
    this.rawConfigSnapshot = {};
    this.loadConfig();
  }

  loadConfig() {
    try {
      const configPath = path.join(__dirname, '../config.json');
      let dashboardConfig = {};
      if (fs.existsSync(configPath)) {
        dashboardConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      }
      this.rawConfigSnapshot = JSON.parse(JSON.stringify(dashboardConfig || {}));

      let secretOverrides = {};
      if (fs.existsSync(SECRETS_FILE_PATH)) {
        try {
          secretOverrides = JSON.parse(fs.readFileSync(SECRETS_FILE_PATH, 'utf8'));
        } catch (secretError) {
          console.error('[SecureConfig] Unable to parse config.secrets.json:', secretError.message);
        }
      }

      const resolveValue = (...sources) => {
        for (const source of sources) {
          if (!source && source !== 0) {
            continue;
          }
          if (typeof source === 'string') {
            const trimmed = source.trim();
            if (trimmed.length > 0) {
              return trimmed;
            }
            continue;
          }
          if (typeof source === 'number' && Number.isFinite(source)) {
            return source;
          }
          if (typeof source === 'boolean') {
            return source;
          }
        }
        return null;
      };

      const clientIdSource = resolveValue(dashboardConfig.clientId, secretOverrides.clientId);
      const hstsSourceValue = dashboardConfig.security?.hsts ?? dashboardConfig.hsts;
      const trustProxyHttpsHeader = dashboardConfig.security?.trustProxyHttpsHeader;
      const clientSecretSource = resolveValue(dashboardConfig.clientSecret, secretOverrides.clientSecret);
      const tokenSecretSource = resolveValue(
        dashboardConfig.tokenSecret,
        secretOverrides.tokenSecret,
        secretOverrides.sessionSecret,
      );
      const sessionSecretSource = resolveValue(
        dashboardConfig.sessionSecret,
        secretOverrides.sessionSecret,
        tokenSecretSource,
      );
      const jwtSecretSource = resolveValue(dashboardConfig.jwtSecret, secretOverrides.jwtSecret, tokenSecretSource);
      const portSource = Number.parseInt(resolveValue(dashboardConfig.port, dashboardConfig.serverPort), 10);
      const rateLimitConfig = dashboardConfig.rateLimit || {};
      const rateLimitWindowMs = Number.parseInt(resolveValue(rateLimitConfig.windowMs), 10);
      const rateLimitMaxRequests = Number.parseInt(resolveValue(rateLimitConfig.maxRequests), 10);
      this.runtimeEnvironment = resolveValue(dashboardConfig.environment, dashboardConfig.runtimeEnv) || 'production';

      this.config = {
        botToken: '',
        clientId: clientIdSource || '',
        clientSecret: clientSecretSource || '',
        port: Number.isFinite(portSource) ? portSource : 3000,
        tokenSecret: tokenSecretSource || this.generateSecureSecret(),
        sessionSecret: sessionSecretSource || tokenSecretSource || this.generateSecureSecret(),
        jwtSecret: jwtSecretSource || this.generateSecureSecret(),
        encryptionKey: this.generateEncryptionKey(),
        callbackURLs: this.parseCallbackURLs(dashboardConfig.callbackURLs),
        ownerIds: this.parseOwnerIds(dashboardConfig.owner),
        supportServer: dashboardConfig.supportServer || 'https://discord.gg/nx9Kzrk',
        navItems: this.parseNavItems(dashboardConfig.navItems),
        features: Array.isArray(dashboardConfig.features) ? dashboardConfig.features : [],
        rateLimit: {
          windowMs: Number.isFinite(rateLimitWindowMs) ? rateLimitWindowMs : 900000,
          maxRequests: Number.isFinite(rateLimitMaxRequests) ? rateLimitMaxRequests : 100,
        },
        botSettings: this.parseBotSettings(dashboardConfig.botSettings || {}),
        security: {
          cspPolicy:
            resolveValue(dashboardConfig.security?.cspPolicy, secretOverrides.cspPolicy) || "default-src 'self'",
          hsts: this.parseBoolean(hstsSourceValue, false),
          trustProxyHttpsHeader: this.parseBoolean(trustProxyHttpsHeader, true),
          xssProtection: true,
          noSniff: true,
          frameOptions: 'DENY',
        },
        logging: {
          level: resolveValue(dashboardConfig.logging?.level, secretOverrides.logging?.level) || 'info',
          file: resolveValue(dashboardConfig.logging?.file, secretOverrides.logging?.file) || 'logs/dashboard.log',
        },
        contactWebhook: this.parseContactWebhook(dashboardConfig.contactWebhook || secretOverrides.contactWebhook),
        footer: this.parseFooterConfig(dashboardConfig.footer || {}),
        seo: this.parseSeoConfig(dashboardConfig.seo || {}),
        cookieConsent: this.parseCookieConfig(dashboardConfig.cookieConsent || {}),
      };

      this.validateConfig();
    } catch (error) {
      console.error('[SecureConfig] Error loading configuration:', error);
      throw new Error('Failed to load secure configuration');
    }
  }

  parseBotSettings(botConfig) {
    const safeNumber = (value, fallback, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) => {
      const parsed = parseInt(value, 10);
      if (Number.isFinite(parsed)) {
        return Math.min(Math.max(parsed, min), max);
      }
      return fallback;
    };

    let commandPrefix = null;
    try {
      if (fs.existsSync(DBM_SETTINGS_PATH)) {
        const rawSettings = fs.readFileSync(DBM_SETTINGS_PATH, 'utf8');
        if (rawSettings && rawSettings.trim().length) {
          const parsedSettings = JSON.parse(rawSettings);
          if (parsedSettings && typeof parsedSettings.tag === 'string') {
            const trimmed = parsedSettings.tag.trim();
            if (trimmed.length > 0) {
              commandPrefix = trimmed;
            }
          }
        }
      }
    } catch (error) {
      console.error('[SecureConfig] Unable to read DBM settings for prefix:', error.message);
    }

    if (commandPrefix === null) {
      commandPrefix =
        typeof botConfig.commandPrefix === 'string' && botConfig.commandPrefix.trim().length > 0
          ? botConfig.commandPrefix.trim()
          : '!';
    }

    return {
      commandPrefix,
      status: {
        presence: typeof botConfig.status?.presence === 'string' ? botConfig.status.presence : 'online',
        activity:
          typeof botConfig.status?.activity === 'string' && botConfig.status.activity.trim().length > 0
            ? botConfig.status.activity.trim()
            : 'Watching over servers',
      },
      language: typeof botConfig.language === 'string' ? botConfig.language : 'en',
      timezone: typeof botConfig.timezone === 'string' ? botConfig.timezone : 'UTC',
      statusRefreshInterval: safeNumber(botConfig.statusRefreshInterval, 5, 1, 60),
      moderation: {
        auditLogChannel:
          typeof botConfig.moderation?.auditLogChannel === 'string'
            ? botConfig.moderation.auditLogChannel
            : '#moderation-logs',
        autoModLevel:
          typeof botConfig.moderation?.autoModLevel === 'string' ? botConfig.moderation.autoModLevel : 'balanced',
        muteRole: typeof botConfig.moderation?.muteRole === 'string' ? botConfig.moderation.muteRole : 'Muted',
      },
      music: {
        defaultVolume: safeNumber(botConfig.music?.defaultVolume, 60, 0, 100),
        autoDisconnect: botConfig.music?.autoDisconnect === 'disabled' ? 'disabled' : 'enabled',
      },
      security: {
        twoFactorRequired: botConfig.security?.twoFactorRequired === 'required' ? 'required' : 'optional',
        sessionTimeout: safeNumber(botConfig.security?.sessionTimeout, 60, 5, 240),
      },
      advanced: {
        webhookProxy: typeof botConfig.advanced?.webhookProxy === 'string' ? botConfig.advanced.webhookProxy : '',
        debugLogging: ['off', 'warn', 'verbose'].includes(botConfig.advanced?.debugLogging)
          ? botConfig.advanced.debugLogging
          : 'off',
      },
    };
  }

  parseFooterConfig(footer) {
    const normalizeLink = (link = {}) => {
      const href = typeof link.href === 'string' ? link.href.trim() : '';
      if (href === '/settings') {
        return {
          label: 'Admin',
          href: '/admin',
          requiresOwner: true,
        };
      }
      return {
        label: link.label || 'Link',
        href: href || '/',
        requiresOwner: Boolean(link.requiresOwner),
      };
    };

    const normalizeColumn = (column = {}) => ({
      title: column.title || '',
      links: Array.isArray(column.links) ? column.links.map(normalizeLink) : [],
    });

    return {
      title: footer.title || 'News Targeted Bot',
      tagline: footer.tagline || 'Professional Discord Bot Dashboard',
      cols: Array.isArray(footer.cols) ? footer.cols.map(normalizeColumn) : [],
      social: Array.isArray(footer.social) ? footer.social : [],
      copyright: footer.copyright || `© ${new Date().getFullYear()} News Targeted`,
    };
  }

  parseNavItems(navItems) {
    const normalize = (item = {}) => {
      let link = typeof item.link === 'string' ? item.link : '/';
      let match = typeof item.match === 'string' ? item.match : link || '/';
      let name = item.name || 'Home';
      let requiresOwner = Boolean(item.requiresOwner);

      if (link === '/settings') {
        link = '/admin';
        match = '/admin';
        name = 'Admin';
        requiresOwner = true;
      }

      if (link === '/admin') {
        name = item.name || 'Admin';
        requiresOwner = true;
        match = item.match || '/admin';
      }

      return {
        name,
        link,
        icon: item.icon || '',
        match,
        requiresOwner,
      };
    };

    // Add or filter leaderboard nav item based on enabled state
    let filteredNavItems = Array.isArray(navItems) ? navItems : [];

    try {
      const fs = require('fs');
      const path = require('path');
      const configFile = path.join(__dirname, '../config.json');
      if (fs.existsSync(configFile)) {
        const fullConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));
        const leaderboardConfig = fullConfig.leaderboard;
        const leaderboardEnabled = leaderboardConfig && leaderboardConfig.enabled === true;

        // Check if leaderboard nav item already exists
        const hasLeaderboardNav = filteredNavItems.some((item) => {
          const link = item.link || '';
          return link.includes('/leaderboard');
        });

        if (leaderboardEnabled && !hasLeaderboardNav) {
          // Add leaderboard nav item if enabled and not present
          filteredNavItems.push({
            name: 'Leaderboard',
            link: '/leaderboard',
            icon: 'fas fa-trophy',
            match: '/leaderboard',
            requiresOwner: false,
          });
        } else if (!leaderboardEnabled && hasLeaderboardNav) {
          // Filter out leaderboard nav item if disabled
          filteredNavItems = filteredNavItems.filter((item) => {
            const link = item.link || '';
            return !link.includes('/leaderboard');
          });
        }
      } else if (filteredNavItems.length > 0) {
        // If config doesn't exist, leaderboard is disabled - filter it out
        filteredNavItems = filteredNavItems.filter((item) => {
          const link = item.link || '';
          return !link.includes('/leaderboard');
        });
      }
    } catch (error) {
      // If config doesn't exist or error, leaderboard is disabled - filter it out
      if (filteredNavItems.length > 0) {
        filteredNavItems = filteredNavItems.filter((item) => {
          const link = item.link || '';
          return !link.includes('/leaderboard');
        });
      }
    }

    if (filteredNavItems.length > 0) {
      return filteredNavItems.map(normalize);
    }

    return [
      normalize({ name: 'Home', link: '/', icon: 'fas fa-home' }),
      normalize({ name: 'Dashboard', link: '/dashboard/@me', match: '/dashboard', icon: 'fas fa-tachometer-alt' }),
      normalize({ name: 'Commands', link: '/commands', icon: 'fas fa-terminal' }),
      normalize({ name: 'Status', link: '/status', icon: 'fas fa-chart-line' }),
      normalize({ name: 'Contact', link: '/contact', icon: 'fas fa-envelope' }),
      normalize({ name: 'Settings', link: '/settings', match: '/settings', icon: 'fas fa-cog', requiresOwner: true }),
    ];
  }

  parseSeoConfig(seo) {
    return {
      defaultTitle: seo.defaultTitle || 'News Targeted Bot Dashboard',
      defaultDescription: seo.defaultDescription || 'Manage your Discord bot with ease.',
      defaultKeywords: seo.defaultKeywords || 'discord,bot,dashboard',
      defaultImage: seo.defaultImage || '/images/social-card.png',
      twitterHandle: seo.twitterHandle || '',
      canonicalBase: seo.canonicalBase || '',
    };
  }

  parseCookieConfig(cookieConsent) {
    return {
      enabled: this.parseBoolean(cookieConsent.enabled, true),
      message: cookieConsent.message || 'We use cookies to improve your experience.',
      acceptText: cookieConsent.acceptText || 'Accept',
      declineText: cookieConsent.declineText || 'Decline',
      learnMoreText: cookieConsent.learnMoreText || 'Learn more',
      learnMoreLink: cookieConsent.learnMoreLink || '/privacy',
      durationDays: parseInt(cookieConsent.durationDays, 10) || 180,
    };
  }

  parseContactWebhook(rawWebhook) {
    if (!rawWebhook || typeof rawWebhook !== 'string') {
      return '';
    }

    try {
      const webhookUrl = new URL(rawWebhook.trim());
      if (!/^https:\/\/(ptb\.|canary\.)?discord\.com\/api\/webhooks\//.test(webhookUrl.href)) {
        console.warn(
          '[SecureConfig] Contact webhook does not match the expected Discord webhook pattern. The value will be ignored.',
        );
        return '';
      }
      return webhookUrl.href;
    } catch (error) {
      console.warn('[SecureConfig] Unable to parse contact webhook URL:', error.message);
      return '';
    }
  }

  parseCallbackURLs(urls) {
    if (!urls) {
      return [
        'http://localhost:3000/dashboard/callback',
        'http://127.0.0.1:3000/dashboard/callback',
        'http://207.180.193.210:3000/dashboard/callback',
      ];
    }
    if (Array.isArray(urls)) {
      return urls;
    }
    return urls
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url);
  }

  parseOwnerIds(ids) {
    const normalizeArray = (list) => Array.from(new Set(list.map((id) => id.trim()).filter(Boolean)));

    if (Array.isArray(ids) && ids.length > 0) {
      return normalizeArray(ids);
    }

    if (typeof ids === 'string' && ids.trim().length > 0) {
      return normalizeArray(ids.split(','));
    }

    try {
      const settingsPath = path.join(__dirname, '../data/settings.json');
      if (fs.existsSync(settingsPath)) {
        const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        const ownerValue = settings.ownerId || settings.owner || settings.owners;
        if (Array.isArray(ownerValue)) {
          const parsed = normalizeArray(ownerValue);
          if (parsed.length > 0) {
            return parsed;
          }
        } else if (typeof ownerValue === 'string' && ownerValue.trim()) {
          const parsed = normalizeArray(ownerValue.split(','));
          if (parsed.length > 0) {
            return parsed;
          }
        }
      }
    } catch (error) {
      console.warn('[SecureConfig] Unable to derive owner IDs from data/settings.json:', error.message);
    }

    return ['80357836940382208'];
  }

  generateSecureSecret() {
    return crypto.randomBytes(32).toString('hex');
  }

  generateEncryptionKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  parseBoolean(value, defaultValue = false) {
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (['true', '1', 'yes', 'on'].includes(normalized)) {
        return true;
      }
      if (['false', '0', 'no', 'off'].includes(normalized)) {
        return false;
      }
    }
    if (typeof value === 'number') {
      return value !== 0;
    }
    return defaultValue;
  }

  validateConfig() {
    if (!this.config.clientSecret || typeof this.config.clientSecret !== 'string') {
      console.warn(
        '[SecureConfig] clientSecret is missing. OAuth-based owner login will be disabled until a valid secret is provided.',
      );
      this.config.clientSecret = '';
    }
  }

  get(key) {
    return this.config[key];
  }

  getAll() {
    const sanitized = JSON.parse(JSON.stringify(this.config));
    delete sanitized.botToken;
    delete sanitized.clientSecret;
    delete sanitized.jwtSecret;
    delete sanitized.encryptionKey;
    delete sanitized.contactWebhook;
    return sanitized;
  }

  getRawConfig(options = { includeSecrets: false }) {
    const snapshot = JSON.parse(JSON.stringify(this.rawConfigSnapshot || {}));
    const includeSecrets = Boolean(options && options.includeSecrets);

    if (includeSecrets) {
      snapshot.clientSecret = snapshot.clientSecret || this.config.clientSecret || '';
      snapshot.tokenSecret = snapshot.tokenSecret || this.config.tokenSecret || '';
      snapshot.sessionSecret = snapshot.sessionSecret || this.config.sessionSecret || '';
      snapshot.jwtSecret = snapshot.jwtSecret || this.config.jwtSecret || '';
    } else {
      delete snapshot.clientSecret;
      if (snapshot.tokenSecret) {
        snapshot.tokenSecret = '[redacted]';
      }
      if (snapshot.sessionSecret) {
        snapshot.sessionSecret = '[redacted]';
      }
      if (snapshot.jwtSecret) {
        snapshot.jwtSecret = '[redacted]';
      }
    }

    return snapshot;
  }

  isProduction() {
    return (this.runtimeEnvironment || 'production').toLowerCase() === 'production';
  }

  getClientConfig() {
    return {
      port: this.config.port,
      clientId: this.config.clientId,
      callbackURLs: this.config.callbackURLs,
      supportServer: this.config.supportServer,
      ownerIds: this.config.ownerIds,
      navItems: this.config.navItems,
      features: this.config.features,
      footer: this.config.footer,
      seo: this.config.seo,
      cookieConsent: this.config.cookieConsent,
    };
  }
}

module.exports = new SecureConfig();
