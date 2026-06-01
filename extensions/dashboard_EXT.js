const fs = require('fs');
const path = require('path');
const util = require('util');

const DASHBOARD_LOG_DIR = path.resolve(__dirname, '../../../logs');
const DASHBOARD_ERROR_LOG = path.join(DASHBOARD_LOG_DIR, 'dashboard.newstargeted.com.error_log');
const duplicateWarningCache = new Set();

const originalConsoleError = console.error.bind(console);
const originalConsoleWarn = console.warn.bind(console);

function serializeLogArgs(args) {
  return args
    .map((arg) => {
      if (typeof arg === 'string') {
        return arg;
      }
      if (arg instanceof Error) {
        return `${arg.stack || arg.message}`;
      }
      try {
        return util.inspect(arg, { depth: 5, colors: false });
      } catch (inspectError) {
        return `[unserializable:${inspectError.message}]`;
      }
    })
    .join(' ');
}

function appendDashboardLog(level, args) {
  try {
    if (!fs.existsSync(DASHBOARD_LOG_DIR)) {
      fs.mkdirSync(DASHBOARD_LOG_DIR, { recursive: true, mode: 0o755 });
    }

    const timestamp = new Date().toISOString();
    const message = serializeLogArgs(args);
    const line = `[${timestamp}] [${level}] ${message}\n`;

    fs.appendFile(DASHBOARD_ERROR_LOG, line, { encoding: 'utf8' }, (err) => {
      if (err) {
        originalConsoleError('Unable to append dashboard log:', err);
      }
    });
  } catch (loggingError) {
    originalConsoleError('Dashboard logging failure:', loggingError);
  }
}

if (!global.__NT_CANARY_LOGGER__) {
  global.__NT_CANARY_LOGGER__ = true;

  console.error = (...args) => {
    originalConsoleError(...args);
    appendDashboardLog('ERROR', args);
  };

  console.warn = (...args) => {
    const messageKey = serializeLogArgs(args);
    if (messageKey.includes('already exists!')) {
      if (duplicateWarningCache.has(messageKey)) {
        return;
      }
      duplicateWarningCache.add(messageKey);
    }
    originalConsoleWarn(...args);
    appendDashboardLog('WARN', args);
  };

  process.on('unhandledRejection', (reason, promise) => {
    appendDashboardLog('UNHANDLED_REJECTION', [reason, { promise }]);
    originalConsoleError('Unhandled promise rejection:', reason);
  });

  process.on('uncaughtException', (error) => {
    appendDashboardLog('UNCAUGHT_EXCEPTION', [error]);
    originalConsoleError('Uncaught exception:', error);
  });
}

let resolvedFetch = typeof global.fetch === 'function' ? global.fetch.bind(global) : null;
const fetchModulePromise = resolvedFetch
  ? Promise.resolve(resolvedFetch)
  : import('node-fetch')
      .then((module) => {
        const fetchFn = module.default || module;
        if (typeof fetchFn !== 'function') {
          throw new Error('node-fetch did not export a function');
        }
        return fetchFn;
      })
      .catch((error) => {
        appendDashboardLog('ERROR', ['Failed to initialize fetch polyfill:', error]);
        return null;
      });

const fetchProxy = (...args) => {
  if (resolvedFetch) {
    return resolvedFetch(...args);
  }
  return fetchModulePromise.then((fetchFn) => {
    if (!fetchFn) {
      throw new Error('Fetch polyfill failed to load.');
    }
    resolvedFetch = fetchFn;
    return fetchFn(...args);
  });
};

const enforceFetchProxy = () => {
  if (global.fetch !== fetchProxy) {
    global.fetch = fetchProxy;
  }
};

enforceFetchProxy();
setInterval(enforceFetchProxy, 60000);

try {
  const { EmbedBuilder } = require('discord.js');
  if (EmbedBuilder && !EmbedBuilder.prototype.__ntRandomColorPatch) {
    const originalSetColor = EmbedBuilder.prototype.setColor;
    EmbedBuilder.prototype.setColor = function patchedSetColor(color) {
      if (typeof color === 'string' && color.toUpperCase() === 'RANDOM') {
        const randomColor = Math.floor(Math.random() * 0xffffff);
        return originalSetColor.call(this, randomColor);
      }
      return originalSetColor.call(this, color);
    };
    EmbedBuilder.prototype.__ntRandomColorPatch = true;
  }
} catch (embedError) {
  appendDashboardLog('WARN', ['Unable to apply EmbedBuilder color patch:', embedError.message]);
}

module.exports = {
  /*
        - Author: Great Plains Modding
        - Version: 1.1.1
        - GitHub: https://github.com/greatplainsmodding
        - Description: Contains multiple stuff needed for my mods / extensions / events.
    */

  authors: ['Great Plains Modding'],
  version: '1.1.1',
  changeLog: '',
  shortDescription: 'Discord Bot Maker Dashboard.',
  longDescription: '',
  requiredNodeModules: [],

  // ---------------------------------------------------------------------
  // Editor Extension Name
  //
  // This is the name of the editor extension displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Bot Dashboard',

  // ---------------------------------------------------------------------
  // Is Command Extension
  //
  // Must be true to appear in "command" context menu.
  // This means each "command" will hold its own copy of this data.
  // ---------------------------------------------------------------------

  isCommandExtension: false,

  // ---------------------------------------------------------------------
  // Is Event Extension
  //
  // Must be true to appear in "event" context menu.
  // This means each "event" will hold its own copy of this data.
  // ---------------------------------------------------------------------

  isEventExtension: false,

  // ---------------------------------------------------------------------
  // Is Editor Extension
  //
  // Must be true to appear in the main editor context menu.
  // This means there will only be one copy of this data per project.
  // ---------------------------------------------------------------------

  isEditorExtension: true,

  // ---------------------------------------------------------------------
  // Extension Fields
  //
  // These are the fields for the extension. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the command's/event's JSON data.
  // ---------------------------------------------------------------------

  fields: ['port', 'clientSecret', 'callbackURLs', 'owner', 'supportServer'],

  // ---------------------------------------------------------------------
  // Default Fields
  //
  // The default values of the fields.
  // ---------------------------------------------------------------------

  defaultFields: {
    port: (() => {
      try {
        const config = require(require('path').join(__dirname, 'dashboard_EXT', 'config.json'));
        return config.port || 3000;
      } catch {
        return 3000;
      }
    })(),
    clientSecret: (() => {
      try {
        const config = require(require('path').join(__dirname, 'dashboard_EXT', 'config.json'));
        return config.clientSecret || '';
      } catch {
        return '';
      }
    })(),
    callbackURLs: (() => {
      try {
        const config = require(require('path').join(__dirname, 'dashboard_EXT', 'config.json'));
        return config.callbackURLs || [];
      } catch {
        return [];
      }
    })(),
    owner: (() => {
      try {
        const config = require(require('path').join(__dirname, 'dashboard_EXT', 'config.json'));
        // Convert ownerIds array to comma-separated string for the form
        if (Array.isArray(config.ownerIds) && config.ownerIds.length > 0) {
          return config.ownerIds.join(', ');
        }
        // Fallback to owner if ownerIds doesn't exist
        if (Array.isArray(config.owner)) {
          return config.owner.join(', ');
        }
        return config.owner || '';
      } catch {
        return '';
      }
    })(),
    supportServer: (() => {
      try {
        const config = require(require('path').join(__dirname, 'dashboard_EXT', 'config.json'));
        return config.supportServer || '';
      } catch {
        return '';
      }
    })(),
  },

  // ---------------------------------------------------------------------
  // Extension Dialog Size
  //
  // Returns the size of the extension dialog.
  // ---------------------------------------------------------------------

  size() {
    return {
      width: 700,
      height: 620,
    };
  },

  // ---------------------------------------------------------------------
  // Extension HTML
  //
  // This function returns a string containing the HTML used for
  // the context menu dialog.
  // ---------------------------------------------------------------------

  html(data) {
    try {
      return `
            <div class="ui cards" style="margin: 0; padding: 0; width: 100%;">
                <div class="card" style="margin: 0; padding: 0; width: 100%; background-color: #36393e; color: #e3e5e8;">
                    <div class="content" style="padding-top:15px;">
                        <img class="right floated ui image" src="https://avatars1.githubusercontent.com/u/46289624" style="height: 100px;">
                        <div class="header" style="background-color: #36393e; color: #e3e5e8; font-size: 28px;">
                            <u>Discord Bot Dashboard</u>
                    </div>
                    <div class="meta" style="background-color: #36393e; color: #e3e5e8; font-size: 14px; width: 100%;">
                        <li>Created By: <a onclick="require('child_process').execSync('start https://github.com/greatplainsmodding')"> Great Plains Modding</a></li>
                        <li>DBM Network: <a onclick="require('child_process').execSync('start https://discord.gg/3QxkZPK')"> Join Server</a></li>
                        <li>Extension Version: 1.0.9</li>
                    </div>
                    <div class="description" style="background-color: #36393e; color: #e3e5e8">
                        <hr>
                        <div class="field" style="width: 100%">
                            <div class="field" style="width: 100%">
                                Port:<br>
                                <input type="text" value="${
                                  data.port
                                }" class="round" style="padding-bottom: 3px;" id="port"><br>
                                clientSecret:<br>
                                <input type="text" value="${data.clientSecret}" class="round" id="clientSecret"><br>
                                Callback URLs (one per line):<br>
                                <textarea class="round" id="callbackURLs" rows="3" style="width: 100%; resize: vertical;">${
                                  Array.isArray(data.callbackURLs)
                                    ? data.callbackURLs.join('\n')
                                    : data.callbackURLs || ''
                                }</textarea><br>
                                Owner ID:<br>
                                <input type="text" value="${data.owner}" class="round" id="owner"><br>
                                supportServer:<br>
                                <input type="text" value="${data.supportServer}" class="round" id="supportServer"><br>
                            </div>
                        </div><br>
                    </div>
                </div>
            </div>
            `;
    } catch (error) {
      return error;
    }
  },

  // ---------------------------------------------------------------------
  // Extension Dialog Init Code
  //
  // When the HTML is first applied to the extension dialog, this code
  // is also run. This helps add modifications or setup reactionary
  // functions for the DOM elements.
  // ---------------------------------------------------------------------

  init(DBM) {},

  // ---------------------------------------------------------------------
  // Extension Dialog Close Code
  //
  // When the dialog is closed, this is called. Use it to save the data.
  // ---------------------------------------------------------------------

  close(document, data) {
    data.port = String(document.getElementById('port').value);
    data.clientSecret = String(document.getElementById('clientSecret').value);
    const callbackURLsText = String(document.getElementById('callbackURLs').value);
    data.callbackURLs = callbackURLsText.split('\n').filter((url) => url.trim() !== '');
    data.callbackURL = data.callbackURLs[0] || `http://localhost:${data.port}/dashboard/callback`;

    // Handle owner ID(s) - can be single ID or comma-separated list
    const ownerInput = String(document.getElementById('owner').value).trim();
    const ownerIds = ownerInput
      .split(/[,\s]+/)
      .filter((id) => id.trim() !== '')
      .map((id) => id.trim());

    data.supportServer = String(document.getElementById('supportServer').value);

    try {
      const fs = require('fs');
      const path = require('path');

      // Correct path: __dirname is the extension directory, so dashboard_EXT is a subdirectory
      const dashboardConfigPath = path.join(__dirname, 'dashboard_EXT', 'config.json');

      // Load existing config to preserve all fields
      let existingConfig = {};
      if (fs.existsSync(dashboardConfigPath)) {
        try {
          existingConfig = JSON.parse(fs.readFileSync(dashboardConfigPath, 'utf8'));
        } catch (parseError) {
          console.warn('[Dashboard Extension] Failed to parse existing config.json:', parseError.message);
          existingConfig = {};
        }
      }

      // Merge: Update only the fields that can be changed from the extension dialog
      // Preserve all other fields (tokenSecret, sessionSecret, navItems, footer, seo, etc.)
      const updatedConfig = {
        ...existingConfig, // Preserve all existing fields
        port: parseInt(data.port, 10) || existingConfig.port || 3000,
        clientSecret: data.clientSecret || existingConfig.clientSecret || '',
        callbackURLs: data.callbackURLs.length > 0 ? data.callbackURLs : existingConfig.callbackURLs || [],
        ownerIds: ownerIds.length > 0 ? ownerIds : existingConfig.ownerIds || [],
        supportServer: data.supportServer || existingConfig.supportServer || '',
      };

      // Ensure callbackURL is set (use first from callbackURLs if not explicitly set)
      if (!updatedConfig.callbackURL && updatedConfig.callbackURLs.length > 0) {
        updatedConfig.callbackURL = updatedConfig.callbackURLs[0];
      }

      // Preserve critical fields that should never be overwritten
      if (existingConfig.tokenSecret) {
        updatedConfig.tokenSecret = existingConfig.tokenSecret;
      }
      if (existingConfig.sessionSecret) {
        updatedConfig.sessionSecret = existingConfig.sessionSecret;
      }
      if (existingConfig.jwtSecret) {
        updatedConfig.jwtSecret = existingConfig.jwtSecret;
      }

      // Write updated config with proper formatting
      const settings = JSON.stringify(updatedConfig, null, 4);
      fs.writeFileSync(dashboardConfigPath, settings, 'utf8');

      console.log('[Dashboard Extension] Successfully updated config.json with new clientSecret and ownerIds');
    } catch (error) {
      const errorPath = path.join(__dirname, 'dashboard-errors.txt');
      const errorMessage = `[${new Date().toISOString()}] Dashboard extension save error:\n${
        error.stack || error.message
      }\n\n`;
      require('fs').appendFileSync(errorPath, errorMessage, 'utf8');
      console.error('[Dashboard Extension] Failed to save config.json:', error.message);
    }
  },

  // ---------------------------------------------------------------------
  // Extension On Load
  //
  // If an extension has a function for "load", it will be called
  // whenever the editor loads data.
  //
  // The "DBM" parameter is the global variable. Store loaded data within it.
  // ---------------------------------------------------------------------

  load(DBM, projectLoc) {},

  // ---------------------------------------------------------------------
  // Extension On Save
  //
  // If an extension has a function for "save", it will be called
  // whenever the editor saves data.
  //
  // The "data" parameter contains all data. Use this to modify
  // the data that is saved. The properties correspond to the
  // data file names:
  //
  //  - data.commands
  //  - data.settings
  // etc...
  // ---------------------------------------------------------------------

  save(DBM, data, projectLoc) {},

  // ---------------------------------------------------------------------
  // Editor Extension Bot Mod
  //
  // Upon initialization of the bot, this code is run. Using the bot's
  // DBM namespace, one can add/modify existing functions if necessary.
  // In order to reduce conflictions between mods, be sure to alias
  // functions you wish to overwrite.
  //
  // This is absolutely necessary for editor extensions since it
  // allows us to setup modifications for the necessary functions
  // we want to change.
  //
  // The client object can be retrieved from: `const bot = DBM.Bot.bot;`
  // Classes can be retrieved also using it: `const { Actions, Event } = DBM;`
  // ---------------------------------------------------------------------

  async mod(DBM) {
    DBM.require = function (packageName) {
      const localModulePath = path.join(__dirname, 'dashboard_EXT', 'node_modules', packageName);
      try {
        return require(localModulePath);
      } catch (localError) {
        try {
          return require(packageName);
        } catch (fallbackError) {
          console.warn(
            `⚠️ Unable to load module "${packageName}" from dashboard extension paths.`,
            fallbackError.message,
          );
          throw fallbackError;
        }
      }
    };
    /** ****************************************************
     * DBM Dashboard
     * Version 1.0.5
     * Great PLains Modding
     ******************************************************/

    const Dashboard = {};
    Dashboard.version = '1.1.5';
    const chalk = require('chalk').default || require('chalk');

    // Tools collection
    Dashboard.tools = Dashboard.tools || {};
    try {
      const contactWebhookTester = require('./dashboard_EXT/tools/contact-webhook-tester');
      Dashboard.tools.contactWebhookTester = contactWebhookTester;
    } catch (toolError) {
      console.warn('⚠️ Unable to load contact webhook tester tool:', toolError.message);
    }

    // ----------------------------------------------------------------------------------
    // Check for great plains modding dependencies //
    // ----------------------------------------------------------------------------------

    Dashboard.checkActions = async function () {
      try {
        // Use built-in fetch if available, otherwise use node-fetch
        let fetch;
        try {
          fetch = globalThis.fetch || require('node:fetch');
        } catch (e) {
          fetch = require('node-fetch');
          fetch = fetch.default || fetch;
        }

        const modsResponse = await fetch(
          'https://api.github.com/repos/greatplainsmodding/DBM-Dashboard-Mods/git/trees/master',
        );
        if (!modsResponse.ok) {
          if (modsResponse.status === 404) {
            return;
          }
          console.warn('[Dashboard] Failed to fetch mods list:', modsResponse.status, modsResponse.statusText);
          return;
        }
        let modsData;
        try {
          modsData = await modsResponse.json();
        } catch (jsonError) {
          console.warn('[Dashboard] Failed to parse mods JSON response:', jsonError.message);
          return;
        }
        const modsFetched = modsData.tree;
        if (!modsFetched) return;
        for (const mod of modsFetched) {
          const filePath = require('path').join(__dirname, 'dashboard_EXT', 'actions', 'mods', mod.path);
          if (!require('fs').existsSync(filePath)) {
            console.log(chalk.yellow(`(DBM Dashboard) ~ Auto Mod Install: ${mod.path}`));
            const modResponse = await fetch(mod.url);
            if (!modResponse.ok) {
              console.warn('[Dashboard] Failed to fetch mod data for', mod.path, ':', modResponse.status);
              continue;
            }
            let modData;
            try {
              modData = await modResponse.json();
            } catch (jsonError) {
              console.warn('[Dashboard] Failed to parse mod JSON for', mod.path, ':', jsonError.message);
              continue;
            }
            const fetchedMod = modData.tree;
            require('fs').mkdirSync(require('path').join(__dirname, 'dashboard_EXT', 'actions', 'mods', mod.path));
            for (const file of fetchedMod) {
              const filePath = require('path').join(__dirname, 'dashboard_EXT', 'actions', 'mods', mod.path, file.path);
              if (!require('fs').existsSync(filePath)) {
                const fileResponse = await fetch(
                  `https://raw.githubusercontent.com/greatplainsmodding/DBM-Dashboard-Mods/master/${mod.path}/${file.path}`,
                );
                const modFile = await fileResponse.text();
                require('fs').writeFileSync(filePath, modFile);
                console.log(chalk.green(`Successfully downloaded ${file.path}`));
              }
            }
          }
        }
      } catch (error) {
        console.log(chalk.red(error));
      }
    };

    // ----------------------------------------------------------------------------------
    // require needed modules //
    const resolveDashboardModule = (moduleName) => {
      try {
        return require(path.join(__dirname, 'dashboard_EXT', 'node_modules', moduleName));
      } catch (localError) {
        return require(moduleName);
      }
    };

    const markedExport = resolveDashboardModule('marked');
    const marked =
      typeof markedExport === 'function' ? markedExport : markedExport?.marked || markedExport?.parse || markedExport;
    const sanitizeHtml = resolveDashboardModule('sanitize-html');

    const express = DBM.require('express');
    const bodyParser = DBM.require('body-parser');
    const cookieParser = DBM.require('cookie-parser');
    DBM.require('ejs');
    const Strategy = DBM.require('passport-discord');
    const session = DBM.require('express-session');
    const passport = DBM.require('passport');
    const compression = DBM.require('compression');
    const figlet = DBM.require('figlet');
    require('url');

    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    const renderMarkdown = (source) => {
      if (!source || typeof source !== 'string') {
        return '';
      }
      const markedParser =
        typeof marked === 'function'
          ? marked
          : marked && typeof marked.parse === 'function'
          ? marked.parse.bind(marked)
          : null;
      const rawHtml = markedParser ? markedParser(source) : source;
      return sanitizeHtml(rawHtml, {
        allowedTags: [
          'p',
          'br',
          'strong',
          'em',
          'ul',
          'ol',
          'li',
          'blockquote',
          'code',
          'pre',
          'a',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'hr',
        ],
        allowedAttributes: {
          a: ['href', 'title', 'target', 'rel'],
          code: ['class'],
        },
        transformTags: {
          a: (tagName, attribs) => ({
            tagName,
            attribs: Object.assign({}, attribs, {
              rel: attribs.rel || 'noopener',
              target: attribs.target || '_blank',
            }),
          }),
        },
      });
    };

    const issueAdminCsrfToken = (req, Dashboard) => {
      if (!Dashboard || !Dashboard.csrfProtection) {
        return null;
      }

      const csrf = Dashboard.csrfProtection;
      let token = null;

      if (req.session && req.sessionID && typeof csrf.getTokenForSession === 'function') {
        try {
          token = csrf.getTokenForSession(req.sessionID, {
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
          console.warn('[Admin] Unable to issue session CSRF token:', error.message);
        }
      }

      if (!token && typeof csrf.createStatelessTokenFromRequest === 'function') {
        token = csrf.createStatelessTokenFromRequest(req);
      }

      return token;
    };

    // Load our enhanced modules (commented out for now as they're TypeScript)
    // const CommandManager = require('./modules/command-manager');
    // const DBMActionHandler = require('./modules/dbm-action-handler');
    // const DBMIntegration = require('./modules/dbm-integration');
    // const WebDashboard = require('./modules/web-dashboard');

    Dashboard.app = express();
    Dashboard.app.locals.renderMarkdown = renderMarkdown;
    Dashboard.app.use((req, res, next) => {
      res.locals.renderMarkdown = renderMarkdown;
      next();
    });
    // ----------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------
    Dashboard.Actions = {};
    // Load configuration directly from config.json (config.php acts as the secret store)
    console.log('📂 Loading dashboard configuration from config.json...');
    const normalizeNavItems = (navItems = []) => {
      return (Array.isArray(navItems) ? navItems : []).map((item = {}) => {
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
      });
    };

    const normalizeFooter = (footer = {}) => {
      const normalizeLink = (link = {}) => {
        const href = typeof link.href === 'string' ? link.href.trim() : '';
        if (href === '/settings') {
          return {
            label: 'Admin',
            href: '/admin',
            requiresOwner: true,
          };
        }
        if (href === '/admin') {
          return {
            label: link.label || 'Admin',
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

      const footerTitle = footer.title || 'News Targeted Bot';
      const footerTagline = footer.tagline || 'Professional Discord Bot Dashboard by News Targeted';
      const footerCopyright = footer.copyright || `© ${new Date().getFullYear()} News Targeted`;

      return Object.assign({}, footer, {
        title: footerTitle,
        titleHtml: renderMarkdown(footerTitle),
        tagline: footerTagline,
        taglineHtml: renderMarkdown(footerTagline),
        cols: Array.isArray(footer.cols) ? footer.cols.map(normalizeColumn) : [],
        social: Array.isArray(footer.social) ? footer.social : [],
        copyright: footerCopyright,
        copyrightHtml: renderMarkdown(footerCopyright),
      });
    };

    const persistNormalizedConfig = (Dashboard, secureConfig) => {
      try {
        const fs = require('fs');
        const configPath = require('path').join(__dirname, 'dashboard_EXT', 'config.json');
        let baseConfig = null;

        if (secureConfig && typeof secureConfig.getRawConfig === 'function') {
          baseConfig = secureConfig.getRawConfig({ includeSecrets: true });
        }

        if (!baseConfig || typeof baseConfig !== 'object' || Object.keys(baseConfig).length === 0) {
          if (fs.existsSync(configPath)) {
            baseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
          } else {
            baseConfig = {};
          }
        }

        const mergedConfig = Object.assign({}, baseConfig);

        if (Array.isArray(Dashboard.settings.navItems)) {
          mergedConfig.navItems = Dashboard.settings.navItems;
        }
        if (Dashboard.settings.footer && typeof Dashboard.settings.footer === 'object') {
          mergedConfig.footer = Dashboard.settings.footer;
        }
        if (typeof Dashboard.settings.footerText === 'string') {
          mergedConfig.footerText = Dashboard.settings.footerText;
        }
        if (typeof Dashboard.settings.introText === 'string') {
          mergedConfig.introText = Dashboard.settings.introText;
        }
        if (typeof Dashboard.settings.supportServer === 'string') {
          mergedConfig.supportServer = Dashboard.settings.supportServer;
        }
        if (typeof Dashboard.settings.clientId === 'string') {
          mergedConfig.clientId = Dashboard.settings.clientId;
        }
        if (typeof Dashboard.settings.clientSecret === 'string' && Dashboard.settings.clientSecret.length > 0) {
          mergedConfig.clientSecret = Dashboard.settings.clientSecret;
        }
        if (Array.isArray(Dashboard.settings.callbackURLs)) {
          mergedConfig.callbackURLs = Dashboard.settings.callbackURLs;
        }

        fs.writeFileSync(configPath, JSON.stringify(mergedConfig, null, 4));
      } catch (error) {
        console.warn('[Dashboard] Unable to persist normalized configuration:', error);
      }
    };

    const BOT_STATUS_OPTIONS = [
      { value: 'online', label: 'Online' },
      { value: 'idle', label: 'Idle' },
      { value: 'dnd', label: 'Do Not Disturb' },
      { value: 'invisible', label: 'Invisible' },
    ];

    const BOT_LANGUAGE_OPTIONS = [
      { value: 'en', label: 'English' },
      { value: 'no', label: 'Norwegian' },
      { value: 'es', label: 'Spanish' },
      { value: 'fr', label: 'French' },
      { value: 'de', label: 'German' },
    ];

    const BOT_TIMEZONE_OPTIONS = [
      { value: 'UTC', label: 'UTC' },
      { value: 'Europe/Oslo', label: 'Europe/Oslo' },
      { value: 'America/New_York', label: 'America/New_York' },
      { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
    ];

    const BOT_MODERATION_LEVEL_OPTIONS = [
      { value: 'lenient', label: 'Lenient' },
      { value: 'balanced', label: 'Balanced' },
      { value: 'strict', label: 'Strict' },
    ];

    const BOT_AUTO_DISCONNECT_OPTIONS = [
      { value: 'enabled', label: 'Enabled' },
      { value: 'disabled', label: 'Disabled' },
    ];

    const BOT_DEBUG_LOGGING_OPTIONS = [
      { value: 'off', label: 'Off' },
      { value: 'warn', label: 'Warnings' },
      { value: 'verbose', label: 'Verbose' },
    ];

    const BOT_TWO_FACTOR_OPTIONS = [
      { value: 'optional', label: 'Optional' },
      { value: 'required', label: 'Required' },
    ];

    const expectsJsonResponse = (req) => {
      const accepts = typeof req.headers.accept === 'string' ? req.headers.accept.toLowerCase() : '';
      return req.xhr || accepts.includes('application/json') || accepts.includes('text/json');
    };

    Dashboard.settings = require(require('path').join(__dirname, 'dashboard_EXT', 'config.json'));
    Dashboard.settings.navItems = normalizeNavItems(Dashboard.settings.navItems);
    Dashboard.settings.footer = normalizeFooter(Dashboard.settings.footer);
    Dashboard.settings.footerTextHtml = renderMarkdown(Dashboard.settings.footerText || '');
    persistNormalizedConfig(Dashboard, null);
    console.log('✅ Loaded dashboard configuration from config.json');
    Dashboard.Actions.modsLocation = require('path').join(__dirname, 'dashboard_EXT', 'actions', 'mods');
    Dashboard.Actions.routeLocation = require('path').join(__dirname, 'dashboard_EXT', 'actions', 'routes');
    Dashboard.Actions.extensionLocation = require('path').join(__dirname, 'dashboard_EXT', 'actions', 'extensions');

    Dashboard.Actions.mods = new Map();
    Dashboard.Actions.extensions = new Map();
    // ----------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------

    Dashboard.storeData = function (fileName, dataName, data) {
      if (!fileName) return console.log('storeData("fileName", "dataName", "data")');
      if (!dataName) return console.log('storeData("fileName", "dataName", "data")');

      try {
        if (!require('fs').existsSync(require('path').join(__dirname, 'dashboard_EXT'))) {
          require('fs').mkdirSync(require('path').join(__dirname, 'dashboard_EXT'));
        }
        const path = require('path').join(__dirname, 'dashboard_EXT', `${fileName}.json`);
        if (!require('fs').existsSync(path)) {
          let data = {};
          data = JSON.stringify(data);
          require('fs').writeFileSync(path, data);
        }

        let jsonFile = require(require('path').join(__dirname, 'dashboard_EXT', `${fileName}.json`));
        jsonFile[dataName] = data;
        jsonFile = JSON.stringify(jsonFile);
        require('fs').writeFileSync(path, jsonFile, 'utf8');
        return jsonFile;
      } catch (error) {
        console.log(error);
      }
    };

    Dashboard.retrieveData = function (fileName, dataName) {
      try {
        if (!require('fs').existsSync(require('path').join(__dirname, 'dashboard_EXT'))) {
          require('fs').mkdirSync(require('path').join(__dirname, 'dashboard_EXT'));
        }
        const path = require('path').join(__dirname, 'dashboard_EXT', `${fileName}.json`);
        if (!require('fs').existsSync(path)) {
          let data = {};
          data = JSON.stringify(data);
          require('fs').writeFileSync(path, data);
        }
        const jsonFile = require(require('path').join(__dirname, 'dashboard_EXT', `${fileName}.json`));
        return jsonFile[dataName];
      } catch (error) {
        console.error(error);
      }
    };

    Dashboard.retrieveFile = function (fileName) {
      try {
        if (!require('fs').existsSync(require('path').join(__dirname, 'dashboard_EXT'))) {
          require('fs').mkdirSync(require('path').join(__dirname, 'dashboard_EXT'));
        }
        const path = require('path').join(__dirname, 'dashboard_EXT', `${fileName}.json`);
        if (!require('fs').existsSync(path)) {
          let data = {};
          data = JSON.stringify(data);
          require('fs').writeFileSync(path, data);
          return {};
        }
        const jsonFile = require(require('path').join(__dirname, 'dashboard_EXT', `${fileName}.json`));
        return jsonFile;
      } catch (error) {
        console.error(error);
      }
    };

    Dashboard.loadMods = function () {
      require('fs')
        .readdirSync(Dashboard.Actions.modsLocation)
        .forEach((dir) => {
          const modData = require(require('path').join(Dashboard.Actions.modsLocation, dir, '__resource.json'));
          Dashboard.Actions.mods.set(dir, modData);

          if (modData.cssFiles) {
            modData.cssFiles.forEach((cssFile) => {
              Dashboard.app.get(`/${modData.name}/css/${cssFile}`, function (req, res) {
                res.setHeader('Content-Type', 'text/css');
                res.sendFile(require('path').join(__dirname, 'dashboard_EXT', 'actions', 'mods', dir, cssFile));
              });
            });
          }
        });
    };

    Dashboard.loadRoutes = async function () {
      try {
        if (!require('fs').existsSync(Dashboard.Actions.routeLocation)) {
          console.warn('[Dashboard] Routes directory does not exist:', Dashboard.Actions.routeLocation);
          return;
        }

        // Recursively find all __resource.json files
        function findRouteResources(dir, basePath = '') {
          const resources = [];
          try {
            const entries = require('fs').readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
              const fullPath = require('path').join(dir, entry.name);
              const relativePath = basePath ? require('path').join(basePath, entry.name) : entry.name;

              if (entry.isDirectory()) {
                // Recursively search subdirectories
                resources.push(...findRouteResources(fullPath, relativePath));
              } else if (entry.name === '__resource.json') {
                // Found a resource file
                resources.push({
                  resourcePath: fullPath,
                  routePath: dir,
                  relativePath,
                });
              }
            }
          } catch (error) {
            console.warn(`[Dashboard] Error reading directory ${dir}:`, error.message);
          }
          return resources;
        }

        const routeResources = findRouteResources(Dashboard.Actions.routeLocation);
        console.log(`[Dashboard] Found ${routeResources.length} route resources`);

        for (const routeInfo of routeResources) {
          try {
            const routePath = routeInfo.routePath;
            const resourcePath = routeInfo.resourcePath;
            if (!require('fs').existsSync(resourcePath)) {
              console.warn(`[Dashboard] Route resource file not found: ${resourcePath}`);
              continue;
            }
            const routeData = require(resourcePath);
            console.log(
              `[Dashboard] Loading route: ${routeData.name} at ${routeData.routeURL || 'API-only (no routeURL)'}`,
            );

            // Handle API-only routes (no routeURL) - just load init function
            if (!routeData.routeURL) {
              if (routeData.scriptFiles && Array.isArray(routeData.scriptFiles)) {
                for (const file of routeData.scriptFiles) {
                  try {
                    const filePath = require('path').join(routePath, file);
                    if (require('fs').existsSync(filePath)) {
                      const fileData = require(filePath);
                      if (fileData.init && typeof fileData.init === 'function') {
                        try {
                          if (fileData.init.constructor.name === 'AsyncFunction') {
                            await fileData.init(DBM, Dashboard);
                          } else {
                            fileData.init(DBM, Dashboard);
                          }
                        } catch (initError) {
                          console.warn(`[Dashboard] Error in route init for ${routeData.name}:`, initError.message);
                        }
                      }
                    }
                  } catch (fileError) {
                    console.warn(
                      `[Dashboard] Failed to load init for ${file} in ${routeInfo.relativePath}:`,
                      fileError.message,
                    );
                  }
                }
              }
              continue; // Skip to next route - this is API-only
            }

            if (routeData.isCustom) {
              for (const file of routeData.scriptFiles) {
                try {
                  require(require('path').join(routePath, file));
                } catch (error) {
                  console.warn(`[Dashboard] Failed to load custom route file ${file}:`, error.message);
                }
              }
            } else {
              for (const file of routeData.scriptFiles) {
                try {
                  const filePath = require('path').join(routePath, file);
                  if (!require('fs').existsSync(filePath)) {
                    console.warn(`[Dashboard] Route file not found: ${filePath}`);
                    continue;
                  }
                  const fileData = require(filePath);
                  if (fileData.init && typeof fileData.init === 'function') {
                    try {
                      if (fileData.init.constructor.name === 'AsyncFunction') {
                        await fileData.init(DBM, Dashboard);
                      } else {
                        fileData.init(DBM, Dashboard);
                      }
                    } catch (initError) {
                      console.warn(`[Dashboard] Error in route init for ${routeData.name}:`, initError.message);
                    }
                  }
                  // Calculate webFile path relative to route directory
                  // Only calculate if webFile is defined
                  let webFile = null;
                  if (routeData.webFile) {
                    // webFile is relative to the route directory, resolve it from routePath
                    webFile = require('path').resolve(routePath, routeData.webFile);
                    // Normalize the path to handle ../
                    webFile = require('path').normalize(webFile);
                  }

                  // Only register web routes if webFile is defined
                  if (!webFile) {
                    continue; // Skip web route registration for API-only routes
                  }

                  if (routeData.cssFiles) {
                    routeData.cssFiles.forEach((cssFile) => {
                      Dashboard.app.get(`/${routeData.name}/css/${cssFile}`, function (req, res) {
                        res.setHeader('Content-Type', 'text/css');
                        const cssFilePath = require('path').join(routePath, cssFile);
                        res.sendFile(cssFilePath);
                      });
                    });
                  }
                  if (routeData.loginRequired) {
                    console.log(`[Dashboard] Registering protected route: ${routeData.routeURL}`);
                    Dashboard.app.get(routeData.routeURL, Dashboard.checkAuth, async function (req, res) {
                      let renderData = {};
                      try {
                        // Handle both async and sync route handlers
                        if (fileData.run.constructor.name === 'AsyncFunction') {
                          renderData = (await fileData.run(DBM, req, res, Dashboard)) || {};
                        } else {
                          renderData = fileData.run(DBM, req, res, Dashboard) || {};
                        }
                      } catch (error) {
                        console.error(`[Route ${routeData.name}] Error in route handler:`, error);
                        renderData = {};
                      }
                      // Don't set giveawaySystemAvailable in baseData - let route handler set it
                      // This prevents conflicts when route handler has its own giveaway logic
                      const baseData = {
                        navItems: Dashboard.settings.navItems,
                        footer: Dashboard.settings.footer,
                        footerTextHtml: Dashboard.settings.footerTextHtml,
                        seoDefaults: Dashboard.settings.seo,
                        cookieConsent: Dashboard.settings.cookieConsent,
                        supportServer: Dashboard.settings.supportServer,
                        settings: Dashboard.settings,
                        client: DBM.Bot.bot,
                        user: req.user,
                        currentPath: req.originalUrl,
                        isOwner: req.user ? (Dashboard.settings.ownerIds || []).includes(req.user.id) : false,
                      };
                      // Merge baseData first, then renderData (renderData overrides baseData)
                      renderData = Object.assign({}, baseData, renderData);

                      // If route handler didn't set giveawaySystemAvailable, check it here as fallback
                      if (typeof renderData.giveawaySystemAvailable === 'undefined') {
                        try {
                          const giveawayUtils = require(require('path').join(
                            __dirname,
                            'dashboard_EXT',
                            'tools',
                            'giveaway_utils',
                          ));
                          renderData.giveawaySystemAvailable = giveawayUtils.isGiveawaySystemAvailable();
                        } catch (error) {
                          renderData.giveawaySystemAvailable = false;
                        }
                      }
                      if (renderData.skipRender) return;

                      // Check if webFile exists before trying to render
                      if (!webFile) {
                        console.warn(`[Dashboard] Route ${routeData.name} has no webFile defined. Skipping render.`);
                        return res.status(404).send('Route not found');
                      }

                      res.render(webFile, {
                        data: renderData,
                      });
                    });
                  } else {
                    console.log(`[Dashboard] Registering public route: ${routeData.routeURL}`);
                    Dashboard.app.get(routeData.routeURL, async function (req, res) {
                      let renderData = {};
                      try {
                        // Handle both async and sync route handlers
                        if (fileData.run.constructor.name === 'AsyncFunction') {
                          renderData = (await fileData.run(DBM, req, res, Dashboard)) || {};
                        } else {
                          renderData = fileData.run(DBM, req, res, Dashboard) || {};
                        }
                      } catch (error) {
                        console.error(`[Route ${routeData.name}] Error in route handler:`, error);
                        renderData = {};
                      }
                      // Don't set giveawaySystemAvailable in baseData - let route handler set it
                      const baseData = {
                        navItems: Dashboard.settings.navItems,
                        footer: Dashboard.settings.footer,
                        footerTextHtml: Dashboard.settings.footerTextHtml,
                        seoDefaults: Dashboard.settings.seo,
                        cookieConsent: Dashboard.settings.cookieConsent,
                        supportServer: Dashboard.settings.supportServer,
                        settings: Dashboard.settings,
                        client: DBM.Bot.bot,
                        user: req.user,
                        currentPath: req.originalUrl,
                        isOwner: req.user ? (Dashboard.settings.ownerIds || []).includes(req.user.id) : false,
                      };
                      // Merge baseData first, then renderData (renderData overrides baseData)
                      renderData = Object.assign({}, baseData, renderData);

                      // If route handler didn't set giveawaySystemAvailable, check it here as fallback
                      if (typeof renderData.giveawaySystemAvailable === 'undefined') {
                        try {
                          const giveawayUtils = require(require('path').join(
                            __dirname,
                            'dashboard_EXT',
                            'tools',
                            'giveaway_utils',
                          ));
                          renderData.giveawaySystemAvailable = giveawayUtils.isGiveawaySystemAvailable();
                        } catch (error) {
                          renderData.giveawaySystemAvailable = false;
                        }
                      }

                      // Check if webFile exists before trying to render
                      if (!webFile) {
                        console.warn(`[Dashboard] Route ${routeData.name} has no webFile defined. Skipping render.`);
                        return res.status(404).send('Route not found');
                      }

                      res.render(webFile, {
                        data: renderData,
                      });
                    });
                  }
                } catch (fileError) {
                  console.warn(
                    `[Dashboard] Failed to load route file ${file} in ${routeInfo.relativePath}:`,
                    fileError.message,
                  );
                }
              }
            }
          } catch (routeError) {
            console.warn(`[Dashboard] Failed to load route ${routeInfo.relativePath}:`, routeError.message);
          }
        }
      } catch (error) {
        console.error('[Dashboard] Error loading routes:', error.message);
      }
    };

    Dashboard.loadExtensions = function () {
      require('fs')
        .readdirSync(Dashboard.Actions.extensionLocation)
        .forEach((dir) => {
          const extensionData = require(require('path').join(
            Dashboard.Actions.extensionLocation,
            dir,
            '__resource.json',
          ));
          Dashboard.Actions.extensions.set(dir, extensionData);

          if (extensionData.cssFiles) {
            extensionData.cssFiles.forEach((cssFile) => {
              Dashboard.app.get(`/${extensionData.name}/css/${cssFile}`, function (req, res) {
                res.setHeader('Content-Type', 'text/css');
                res.sendFile(require('path').join(__dirname, 'dashboard_EXT', 'actions', 'mods', dir, cssFile));
              });
            });
          }

          extensionData.scriptFiles.forEach((file) => {
            const extensionFile = require(require('path').join(Dashboard.Actions.extensionLocation, dir, file));
            extensionFile.init(DBM, Dashboard);
          });
        });
    };

    Dashboard.checkAuth = function (req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      // Store the original URL the user was trying to access
      const originalUrl = req.originalUrl || req.url || '/';
      if (req.session) {
        req.session.returnTo = originalUrl;
      }
      const basePath = req.basePath || '';
      res.redirect(`${basePath}/login`);
    };

    Dashboard.randomString = function () {
      let string = '';
      const randomChar = 'abcdefghijklmnopqrstuvwxyz0123456789';
      for (var i = 0; i < 50; i++) {
        string += randomChar.charAt(Math.floor(Math.random() * randomChar.length));
      }
      return string;
    };

    Dashboard.verifyConfig = function () {
      const errors = [];
      let settings = Dashboard.settings;
      const hasSecureConfig = Dashboard.secureConfig && typeof Dashboard.secureConfig.get === 'function';
      const secureClientSecret = hasSecureConfig ? Dashboard.secureConfig.get('clientSecret') : null;
      const secureCallbackList = hasSecureConfig ? Dashboard.secureConfig.get('callbackURLs') : null;

      if (!settings.clientSecret && secureClientSecret) {
        settings.clientSecret = secureClientSecret;
      }

      if (
        !settings.callbackURL ||
        typeof settings.callbackURL !== 'string' ||
        settings.callbackURL.trim().length === 0
      ) {
        if (Array.isArray(settings.callbackURLs) && settings.callbackURLs.length > 0) {
          settings.callbackURL = settings.callbackURLs[0];
        } else if (Array.isArray(secureCallbackList) && secureCallbackList.length > 0) {
          settings.callbackURL = secureCallbackList[0];
        }
      }

      if (settings.runSetup) {
        Dashboard.app.get('/', (req, res) => {
          res.render('setup', {
            config: Dashboard.settings,
          });
        });

        Dashboard.app.use(
          bodyParser.urlencoded({
            extended: true,
          }),
        );

        Dashboard.app.post('/setup', (req, res) => {
          console.log(req.body);
        });
        console.log(require('chalk').red('Please navigate to http://localhost:3000 to complete the setup.'));
        return errors;
      }
      if (!settings.port) errors.push('Invalid port, please check your config.');
      if (!settings.tokenSecret) {
        const filePath = require('path').join(__dirname, 'dashboard_EXT', 'config.json');
        settings.tokenSecret = Dashboard.randomString();
        settings = JSON.stringify(settings);
        require('fs').writeFileSync(filePath, settings, 'utf8');
      }
      if (!settings.clientSecret) {
        console.warn('[Dashboard] Client secret is missing; owner login will be disabled until configured.');
      }
      if (!settings.callbackURL) {
        const fallbackCallback =
          secureCallbackList && secureCallbackList.length > 0
            ? secureCallbackList[0]
            : `http://localhost:${settings.port || 3000}/dashboard/callback`;
        settings.callbackURL = fallbackCallback;
        if (!fallbackCallback) {
          console.warn('[Dashboard] Callback URL is missing; using http://localhost/dashboard/callback as fallback.');
        }
      }
      return errors;
    };

    Dashboard.appSettings = function () {
      // Load secure configuration
      const secureConfig = require('./dashboard_EXT/security/config');
      const securityMiddleware = require('./dashboard_EXT/security/middleware');
      const configChecker = require('./dashboard_EXT/security/config-checker');
      const csrfProtection = require('./dashboard_EXT/security/csrf');
      const inputValidator = require('./dashboard_EXT/security/validation');
      const configProtection = require('./dashboard_EXT/security/config-protection');

      // Initialize secure configuration protection
      configProtection.initializeProtection();

      // Run security check
      const securityCheckResult = configChecker.runSecurityCheck();
      if (!securityCheckResult) {
        const issues = configChecker.checkConfigSecurity();
        const hasErrors = issues.some((issue) => issue.level === 'error');
        if (hasErrors) {
          console.error(
            '❌ Security check failed with errors. Please fix the issues above before starting the dashboard.',
          );
          process.exit(1);
        } else {
          console.warn('⚠️ Security check has warnings, but continuing...');
        }
      }

      // Set secure configuration
      Dashboard.settings = secureConfig.getAll();
      Dashboard.settings.navItems = normalizeNavItems(Dashboard.settings.navItems);
      Dashboard.settings.footer = normalizeFooter(Dashboard.settings.footer);
      Dashboard.settings.footerTextHtml = renderMarkdown(Dashboard.settings.footerText || '');
      persistNormalizedConfig(Dashboard, Dashboard.secureConfig);
      Dashboard.secureConfig = secureConfig;
      Dashboard.csrfProtection = csrfProtection;
      Dashboard.inputValidator = inputValidator;
      Dashboard.configProtection = configProtection;
      Dashboard.settings.clientId = secureConfig.get('clientId') || '';
      Dashboard.settings.clientSecret = secureConfig.get('clientSecret') || '';
      Dashboard.settings.callbackURLs = secureConfig.get('callbackURLs') || [];

      // Configure Express with security
      Dashboard.app.set('view engine', 'ejs');
      Dashboard.app.set('trust proxy', 1); // Trust first proxy for accurate IP addresses

      // Set basePath for templates (always empty for root path)
      Dashboard.app.use((req, res, next) => {
        res.locals.basePath = '';
        req.basePath = '';
        next();
      });

      // Secure configuration protection middleware (MUST be first)
      const configProtectionMiddleware = configProtection.getAllProtectionMiddleware();
      configProtectionMiddleware.forEach((middleware) => {
        Dashboard.app.use(middleware);
      });

      // Compression middleware (should be early in the stack)
      Dashboard.app.use(
        compression({
          filter: (req, res) => {
            // Don't compress if client doesn't support it
            if (req.headers['x-no-compression']) {
              return false;
            }
            // Compress all text-based content
            const contentType = res.getHeader('content-type') || '';
            return /text|javascript|json|css|xml|svg|font/.test(contentType);
          },
          level: 6, // Balance between compression and CPU usage
          threshold: 1024, // Only compress responses larger than 1KB
        }),
      );

      // Security middleware
      const { rateLimiter, securityHeaders, conditionalHsts, logRequest, handleError } =
        securityMiddleware.getAllMiddleware();

      Dashboard.app.use(securityHeaders);
      Dashboard.app.use(conditionalHsts);
      Dashboard.app.use(rateLimiter);
      Dashboard.app.use(logRequest);

      // Session configuration prerequisites (must run before CSRF)
      Dashboard.app.use(
        cookieParser(secureConfig.get('tokenSecret'), {
          secure: secureConfig.isProduction(),
          httpOnly: true,
          sameSite: 'strict',
        }),
      );

      Dashboard.app.use(
        session({
          secret: secureConfig.get('sessionSecret'),
          resave: false,
          saveUninitialized: false,
          cookie: {
            secure: secureConfig.isProduction(), // Secure cookies in production (HTTPS only)
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            sameSite: 'lax', // Changed from 'strict' to 'lax' for OAuth redirects
          },
          name: 'dashboard.sid', // Don't use default session name
        }),
      );

      // Body parsing with size limits and validation (needed by CSRF verifier)
      Dashboard.app.use(
        bodyParser.urlencoded({
          extended: true,
          limit: '10mb',
          verify: (req, res, buf) => {
            // Check for malicious content in request body
            const body = buf.toString();
            if (inputValidator.detectSQLInjection(body) || inputValidator.detectXSS(body)) {
              console.warn(`Potentially malicious request body from ${req.ip}`);
              return res.status(400).json({ error: 'Invalid request' });
            }
          },
        }),
      );
      Dashboard.app.use(
        bodyParser.json({
          limit: '10mb',
          verify: (req, res, buf) => {
            // Check for malicious content in JSON body
            const body = buf.toString();
            if (inputValidator.detectSQLInjection(body) || inputValidator.detectXSS(body)) {
              console.warn(`Potentially malicious JSON body from ${req.ip}`);
              return res.status(400).json({ error: 'Invalid request' });
            }
          },
        }),
      );

      // CSRF protection (requires session + parsed bodies)
      Dashboard.app.use(csrfProtection.generateTokenMiddleware());
      Dashboard.app.use(csrfProtection.verifyTokenMiddleware());

      Dashboard.app.use((req, res, next) => {
        const baseUrl = Dashboard.resolveBaseUrl(req);
        res.locals.baseUrl = baseUrl;
        res.locals.contactUrl = `${baseUrl}/contact`;
        next();
      });

      // Static files with proper cache headers and security
      const staticOptions = {
        maxAge: 31536000000, // 1 year in milliseconds
        etag: true,
        lastModified: true,
        setHeaders: (res, path) => {
          // Set proper cache headers for static assets
          const ext = require('path').extname(path).toLowerCase();
          const staticExtensions = [
            '.css',
            '.js',
            '.png',
            '.jpg',
            '.jpeg',
            '.gif',
            '.ico',
            '.svg',
            '.woff',
            '.woff2',
            '.ttf',
            '.eot',
            '.webp',
          ];

          if (staticExtensions.includes(ext)) {
            // Long-term caching for static assets with versioning
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
          } else {
            // Shorter cache for HTML and other files
            res.setHeader('Cache-Control', 'public, max-age=3600');
            res.setHeader('Expires', new Date(Date.now() + 3600000).toUTCString());
          }
        },
      };
      Dashboard.app.use(express.static(require('path').join(__dirname, 'dashboard_EXT', 'public'), staticOptions));
      Dashboard.app.get('/favicon.ico', (req, res, next) => {
        try {
          const bot = DBM.Bot && DBM.Bot.bot ? DBM.Bot.bot : null;
          const user = bot && bot.user ? bot.user : null;
          const avatarId = user && user.avatar ? user.avatar : null;
          const avatarExt = avatarId && avatarId.startsWith('a_') ? 'gif' : 'png';
          const fallbackIndex = user && typeof user.discriminator !== 'undefined' ? Number(user.discriminator) % 5 : 0;
          const avatarUrl =
            user && user.id
              ? avatarId
                ? `https://cdn.discordapp.com/avatars/${user.id}/${avatarId}.${avatarExt}?size=128`
                : `https://cdn.discordapp.com/embed/avatars/${fallbackIndex}.png`
              : 'https://cdn.discordapp.com/embed/avatars/0.png';

          if (!avatarUrl) {
            return next();
          }

          return res.redirect(302, avatarUrl);
        } catch (error) {
          console.warn('[Dashboard] Unable to proxy favicon:', error);
          return next();
        }
      });
      // Shared static files (CSS, JS, etc.) with long-term caching
      Dashboard.app.use(
        '/shared',
        express.static(require('path').join(__dirname, 'dashboard_EXT', 'views', 'shared'), staticOptions),
      );
      Dashboard.app.set('views', require('path').join(__dirname, 'dashboard_EXT', 'views'));

      Dashboard.app.use(passport.initialize());
      Dashboard.app.use(passport.session());

      // Error handling
      Dashboard.app.use(handleError);
    };

    Dashboard.passport = function () {
      passport.serializeUser(function (user, done) {
        // Only serialize necessary user data, not sensitive information
        const safeUser = {
          id: user.id,
          username: user.username,
          discriminator: user.discriminator,
          avatar: user.avatar,
          guilds: Array.isArray(user.guilds) ? user.guilds : [],
        };
        done(null, safeUser);
      });

      passport.deserializeUser(function (obj, done) {
        done(null, obj);
      });

      // Use secure configuration
      const clientID = Dashboard.secureConfig.get('clientId') || DBM.Bot.bot.user.id;
      const clientSecret = Dashboard.secureConfig.get('clientSecret');
      const callbackURLs = Dashboard.secureConfig.get('callbackURLs') || [];
      // Prefer HTTPS domain callback URL for production (matches Discord redirects)
      const callbackURL =
        callbackURLs.find((url) => url.includes('dashboard.newstargeted.com') && url.includes('https://')) ||
        callbackURLs.find((url) => url.includes('dashboard.newstargeted.com')) ||
        callbackURLs[0] ||
        `http://localhost:${Dashboard.secureConfig.get('port') || 3000}/dashboard/callback`;

      if (!clientID) {
        console.error(chalk.red('[Dashboard] ❌ Client ID is missing. OAuth authentication will not work.'));
      }
      if (!clientSecret) {
        console.error(chalk.red('[Dashboard] ❌ Client secret is missing. OAuth authentication will not work.'));
      }

      console.log(
        chalk.cyan(
          `[Dashboard] Initializing OAuth with Client ID: ${clientID ? `${clientID.substring(0, 10)}...` : 'MISSING'}`,
        ),
      );
      console.log(chalk.cyan(`[Dashboard] Using callback URL: ${callbackURL}`));

      passport.use(
        new Strategy(
          {
            clientID,
            clientSecret,
            callbackURL,
            scope: Dashboard.scopes,
          },
          (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => {
              // Validate profile data
              if (!profile || !profile.id) {
                return done(new Error('Invalid profile data'), null);
              }

              // Log authentication attempt
              console.log(`[OAuth] Authentication successful for user: ${profile.username} (${profile.id})`);

              return done(null, profile);
            });
          },
        ),
      );
    };

    Dashboard.resolveCallbackURL = function (req) {
      const hasSecureConfig = Dashboard.secureConfig && typeof Dashboard.secureConfig.get === 'function';
      const callbacksConfig = hasSecureConfig ? Dashboard.secureConfig.get('callbackURLs') : [];
      const callbacks = Array.isArray(callbacksConfig) ? callbacksConfig.filter(Boolean) : [];
      const configuredFallback = hasSecureConfig ? Dashboard.secureConfig.get('callbackURL') : null;
      const fallback =
        configuredFallback ||
        (callbacks.length ? callbacks[0] : `http://localhost:${Dashboard.settings.port || 3000}/dashboard/callback`);

      if (!req || !req.headers) {
        return fallback;
      }

      const forwardedHost = (req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
      const hostHeader = forwardedHost || '';
      const hostname = hostHeader.split(':')[0].toLowerCase();
      const headerPort = hostHeader.split(':')[1] || '';
      let protocol = 'http';

      if (req.secure) {
        protocol = 'https';
      } else if (req.headers['x-forwarded-proto']) {
        protocol = req.headers['x-forwarded-proto'].split(',')[0].trim().toLowerCase();
      } else if (typeof req.protocol === 'string') {
        protocol = req.protocol.toLowerCase();
      }

      const normalizePort = (proto, port) => {
        if (port) {
          return port;
        }
        return proto === 'https' ? '443' : '80';
      };

      if (hostname && callbacks.length) {
        const hostMatches = callbacks.filter((urlString) => {
          try {
            const parsed = new URL(urlString);
            return parsed.hostname.toLowerCase() === hostname && parsed.protocol.replace(':', '') === protocol;
          } catch (error) {
            console.warn('[Dashboard.resolveCallbackURL] Invalid callback URL skipped:', urlString, error.message);
            return false;
          }
        });

        if (hostMatches.length) {
          const portMatch = hostMatches.find((urlString) => {
            try {
              const parsed = new URL(urlString);
              const parsedPort = normalizePort(parsed.protocol.replace(':', ''), parsed.port);
              const expectedPort = normalizePort(protocol, headerPort);
              return parsedPort === expectedPort;
            } catch {
              return false;
            }
          });

          if (portMatch) {
            console.log(`[OAuth] Using standard callback URL: ${portMatch}`);
            return portMatch;
          }

          return hostMatches[0];
        }

        const hostnameOnlyMatch = callbacks.find((urlString) => {
          try {
            const parsed = new URL(urlString);
            return parsed.hostname.toLowerCase() === hostname;
          } catch {
            return false;
          }
        });

        if (hostnameOnlyMatch) {
          return hostnameOnlyMatch;
        }
      }

      return fallback;
    };

    Dashboard.resolveBaseUrl = function (req) {
      if (!req || !req.headers) {
        return `http://localhost:${Dashboard.settings.port || 3000}`;
      }

      const forwardedProto = req.headers['x-forwarded-proto'];
      const forwardedHost = req.headers['x-forwarded-host'];
      const protocol = forwardedProto
        ? forwardedProto.split(',')[0].trim().toLowerCase()
        : req.secure
        ? 'https'
        : req.protocol || 'http';
      const hostHeader = forwardedHost || req.headers.host || 'localhost';
      return `${protocol}://${hostHeader}`;
    };

    Dashboard.generateDiscordOAuthURL = function (callbackURL, req = null) {
      const effectiveCallback = callbackURL || Dashboard.resolveCallbackURL(req);
      try {
        console.log(`[OAuth] Using redirect URI: ${effectiveCallback}`);
      } catch (logError) {
        console.warn('[OAuth] Unable to log redirect URI:', logError.message);
      }
      const clientID = Dashboard.secureConfig.get('clientId') || DBM.Bot.bot.user.id;
      const scopes = ['identify', 'guilds'].join('%20');
      const redirectURI = encodeURIComponent(effectiveCallback);
      return `https://discord.com/oauth2/authorize?response_type=code&redirect_uri=${redirectURI}&scope=${scopes}&client_id=${clientID}`;
    };

    Dashboard.loginRoute = function () {
      // Discord OAuth routes
      Dashboard.app.get('/login', (req, res, next) => {
        const callbackURL = Dashboard.resolveCallbackURL(req);
        passport.authenticate('discord', {
          scope: Dashboard.scopes,
          callbackURL,
        })(req, res, next);
      });

      Dashboard.app.get(
        '/dashboard/callback',
        (req, res, next) => {
          const callbackURL = Dashboard.resolveCallbackURL(req);
          const basePath = req.basePath || '';

          console.log(`[OAuth Callback] Received callback with code: ${req.query.code ? 'present' : 'missing'}`);
          console.log(`[OAuth Callback] Using callback URL: ${callbackURL}`);
          console.log(`[OAuth Callback] Request URL: ${req.originalUrl}`);
          console.log(`[OAuth Callback] Request headers:`, {
            host: req.headers.host,
            'x-forwarded-host': req.headers['x-forwarded-host'],
            'x-forwarded-proto': req.headers['x-forwarded-proto'],
            'x-forwarded-for': req.headers['x-forwarded-for'],
          });

          // Check if code is present and not expired
          if (!req.query.code) {
            console.error('[OAuth Callback] No authorization code provided');
            return res.redirect(`${basePath}/?error=${encodeURIComponent('No authorization code provided')}`);
          }

          // Validate client secret is configured
          const clientSecret = Dashboard.secureConfig.get('clientSecret');
          if (!clientSecret) {
            console.error('[OAuth Callback] Client secret is missing');
            return res
              .status(500)
              .send(
                'OAuth configuration error: Client secret is missing. Please configure it in the dashboard settings.',
              );
          }

          passport.authenticate('discord', {
            failureRedirect: `${basePath}/?error=auth_failed`,
            callbackURL,
          })(req, res, (err) => {
            if (err) {
              console.error('[OAuth Callback] Authentication error:', err.message);
              console.error('[OAuth Callback] Error code:', err.code || 'unknown');
              console.error('[OAuth Callback] Full error:', err);
              if (err.oauthError) {
                console.error('[OAuth Callback] OAuth error:', err.oauthError);

                // Check if it's a rate limit error
                let oauthErrorData = null;
                try {
                  if (typeof err.oauthError.data === 'string') {
                    oauthErrorData = JSON.parse(err.oauthError.data);
                  } else if (err.oauthError.data) {
                    oauthErrorData = err.oauthError.data;
                  }
                } catch (parseError) {
                  // Ignore parse errors
                }

                if (oauthErrorData && oauthErrorData.message && oauthErrorData.message.includes('rate limits')) {
                  console.error('[OAuth Callback] Discord rate limit detected. Please wait a moment and try again.');
                  return res.redirect(
                    `${basePath}/?error=${encodeURIComponent(
                      'Discord API rate limit reached. Please wait a moment and try logging in again.',
                    )}`,
                  );
                }
              }

              // Provide more helpful error messages
              let errorMessage = err.message || 'auth_failed';
              if (err.code === 'invalid_grant' || err.message.includes('Invalid "code"')) {
                errorMessage = 'The authorization code has expired or is invalid. Please try logging in again.';
              } else if (err.message.includes('redirect_uri_mismatch')) {
                errorMessage = 'Callback URL mismatch. Please check your Discord OAuth settings.';
              } else if (err.message.includes('Failed to fetch the user profile')) {
                // Check if it's a rate limit issue
                if (err.oauthError && err.oauthError.data) {
                  try {
                    const errorData =
                      typeof err.oauthError.data === 'string' ? JSON.parse(err.oauthError.data) : err.oauthError.data;
                    if (errorData.message && errorData.message.includes('rate limits')) {
                      errorMessage = 'Discord API rate limit reached. Please wait a moment and try logging in again.';
                    } else {
                      errorMessage =
                        'Failed to fetch user profile from Discord. This may be due to temporary Discord API issues. Please try again in a moment.';
                    }
                  } catch (e) {
                    errorMessage = 'Failed to fetch user profile from Discord. Please try again in a moment.';
                  }
                } else {
                  errorMessage = 'Failed to fetch user profile from Discord. Please try again in a moment.';
                }
              }

              return res.redirect(`${basePath}/?error=${encodeURIComponent(errorMessage)}`);
            }
            next();
          });
        },
        function (req, res) {
          try {
            req.user.commandExecuted;
            const basePath = req.basePath || '';

            // Check if there's a stored return URL from before login
            let redirectUrl = `${basePath}/dashboard/@me`; // Default redirect

            if (req.session && req.session.returnTo) {
              // Use the stored return URL
              redirectUrl = req.session.returnTo;
              // Ensure it has the correct basePath if needed
              if (basePath && !redirectUrl.startsWith(basePath)) {
                // If the stored URL doesn't have basePath, add it
                // But only if it's not already an absolute URL
                if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
                  redirectUrl = basePath + redirectUrl;
                }
              }
              // Clean up the session
              delete req.session.returnTo;
            }

            console.log(`[OAuth Callback] Authentication successful, redirecting to: ${redirectUrl}`);
            res.redirect(redirectUrl);
          } catch (error) {
            console.error('[OAuth Callback] Error in callback handler:', error);
            const basePath = req.basePath || '';
            res.redirect(`${basePath}/?error=${encodeURIComponent(error.message || 'callback_error')}`);
          }
        },
      );

      // Database authentication routes
      const handleLogout = (req, res) => {
        const basePath = req.basePath || '';
        const wantsJsonExplicit =
          req.xhr ||
          req.headers['x-requested-with'] === 'XMLHttpRequest' ||
          (req.headers.accept && req.headers.accept.toLowerCase().includes('application/json')) ||
          (req.headers['content-type'] && req.headers['content-type'].includes('application/json'));
        const redirectTarget =
          typeof req.query?.redirect === 'string' && req.query.redirect.startsWith('/')
            ? basePath + req.query.redirect
            : `${basePath}/`;

        req.logout((err) => {
          if (err) {
            console.error('❌ Logout error:', err.message);
            if (wantsJsonExplicit) {
              return res.status(500).json({ success: false, message: 'Logout failed' });
            }
            return res.redirect(303, `${redirectTarget}?logout=error`);
          }

          if (req.session) {
            req.session.destroy(() => {});
          }

          if (wantsJsonExplicit) {
            return res.json({ success: true, message: 'Logout successful' });
          }
          return res.redirect(303, redirectTarget);
        });
      };

      Dashboard.app.post('/auth/logout', handleLogout);
      Dashboard.app.get('/auth/logout', handleLogout);

      // Alias for Discord OAuth (backward compatibility)
      Dashboard.app.get('/auth/discord', (req, res, next) => {
        const callbackURL = Dashboard.resolveCallbackURL(req);
        passport.authenticate('discord', {
          scope: Dashboard.scopes,
          callbackURL,
        })(req, res, next);
      });

      // Main dashboard route (protected)
      Dashboard.app.get('/dashboard', Dashboard.checkAuth, async (req, res) => {
        try {
          const user = req.user || null;

          // Get enhanced bot statistics
          let botStats = {
            servers: 0,
            users: 0,
            commands: 0,
            uptime: '0s',
            ping: 0,
            status: 'offline',
          };

          // Try to get bot instance
          let bot = null;
          if (typeof DBM !== 'undefined' && DBM.Bot && DBM.Bot.bot) {
            bot = DBM.Bot.bot;
          } else if (global.DBM && global.DBM.Bot && global.DBM.Bot.bot) {
            bot = global.DBM.Bot.bot;
          } else if (Dashboard.Bot && Dashboard.Bot.bot) {
            bot = Dashboard.Bot.bot;
          } else if (global.Bot && global.Bot.bot) {
            bot = global.Bot.bot;
          }

          if (bot && bot.readyAt) {
            const guilds = bot.guilds.cache;
            botStats = {
              servers: guilds.size,
              users: guilds.reduce((acc, guild) => acc + guild.memberCount, 0),
              commands: DBM.Files && DBM.Files.data && DBM.Files.data.commands ? DBM.Files.data.commands.length : 0,
              uptime: Math.floor(process.uptime()),
              ping: bot.ws.ping,
              status: 'online',
            };
          }

          res.render('dashboard/index', {
            data: {
              client: {
                user: {
                  username: 'News Targeted Bot',
                  displayAvatarURL: () => 'https://cdn.discordapp.com/embed/avatars/0.png',
                },
              },
              user,
              settings: Dashboard.settings,
              botStats,
            },
          });
        } catch (error) {
          console.error('❌ Dashboard page error:', error.message);
          res.status(500).send('Internal server error');
        }
      });

      // Commands route (protected)
      Dashboard.app.get('/commands', async (req, res) => {
        try {
          const user = req.user || null;
          const files = DBM.Files && DBM.Files.data ? DBM.Files.data : {};

          const rawCommands = Array.isArray(files.commands) ? files.commands.filter(Boolean) : [];
          const rawEvents = Array.isArray(files.events) ? files.events.filter(Boolean) : [];

          const typeMap = {
            0: { key: 'prefix', label: 'Prefix Command' },
            1: { key: 'includes-word', label: 'Includes Word' },
            2: { key: 'regex', label: 'Regular Expression' },
            3: { key: 'any-message', label: 'Any Message' },
            4: { key: 'slash', label: 'Slash Command' },
            5: { key: 'user-menu', label: 'User Menu Command' },
            6: { key: 'message-menu', label: 'Message Menu Command' },
          };

          const commands = rawCommands.map((cmd, index) => {
            const typeId = Number(cmd?.comType);
            const typeMeta = typeMap[typeId] || { key: 'other', label: 'Other Command' };
            const primaryName = cmd && cmd.name ? cmd.name : `Command ${index + 1}`;
            const aliases = Array.isArray(cmd?._aliases) ? cmd._aliases : [];
            const category = cmd && cmd.category ? cmd.category : 'General';
            const restriction = typeof cmd?.restriction !== 'undefined' ? String(cmd.restriction) : '0';

            return {
              id: cmd?._id || `cmd-${index}`,
              name: primaryName,
              description: cmd?.description || 'No description provided.',
              typeKey: typeMeta.key,
              typeLabel: typeMeta.label,
              restriction,
              permissions: cmd?.permissions || 'None',
              aliases,
              category,
              parameters: Array.isArray(cmd?.parameters) ? cmd.parameters : [],
              actions: Array.isArray(cmd?.actions) ? cmd.actions.length : 0,
            };
          });

          const commandStats = {
            total: commands.length,
            slash: commands.filter((command) => command.typeKey === 'slash').length,
            prefix: commands.filter((command) => command.typeKey === 'prefix').length,
            categories: [...new Set(commands.map((command) => command.category))],
          };

          const commandTypes = [...new Set(commands.map((command) => `${command.typeKey}|${command.typeLabel}`))]
            .map((entry) => {
              const [key, label] = entry.split('|');
              return { key, label };
            })
            .sort((a, b) => a.label.localeCompare(b.label));

          const events = rawEvents.map((event, index) => ({
            id: event?._id || `event-${index}`,
            name: event?.name || `Event ${index + 1}`,
            trigger: event?.['event-type'] || 'custom',
            description: event?.description || 'Event handler configured in DBM.',
            actions: Array.isArray(event?.actions) ? event.actions.length : 0,
          }));

          const ownerConfig = Dashboard.settings.ownerIds || Dashboard.settings.owner || [];
          const ownerList = Array.isArray(ownerConfig)
            ? ownerConfig
            : String(ownerConfig || '')
                .split(',')
                .map((id) => id.trim())
                .filter(Boolean);
          const isOwner = user ? ownerList.includes(user.id) : false;

          const client =
            DBM.Bot && DBM.Bot.bot
              ? DBM.Bot.bot
              : {
                  user: {
                    id: '000000000000000000',
                    username: 'News Targeted Bot',
                    avatar: null,
                    displayAvatarURL: () => 'https://cdn.discordapp.com/embed/avatars/0.png',
                  },
                };

          const baseData = {
            navItems: Dashboard.settings.navItems,
            footer: Dashboard.settings.footer,
            seoDefaults: Dashboard.settings.seo,
            cookieConsent: Dashboard.settings.cookieConsent,
            supportServer: Dashboard.settings.supportServer,
            settings: Dashboard.settings,
            client,
            user,
            currentPath: req.originalUrl,
            isOwner,
            contactUrl: res.locals.contactUrl || '/contact',
          };

          res.render('commands/index', {
            data: Object.assign({}, baseData, {
              commands,
              commandStats,
              commandTypes,
              categories: commandStats.categories,
              events,
              eventsCount: events.length,
              seo: {
                title: `Commands - ${Dashboard.settings.seo?.defaultTitle || 'News Targeted Bot Dashboard'}`,
                description:
                  'Review every prefix, slash, context menu, and automation command configured in your News Targeted Bot project.',
              },
            }),
          });
        } catch (error) {
          console.error('❌ Commands page error:', error.message);
          res.status(500).send('Internal server error');
        }
      });

      // Admin route (owner access)
      Dashboard.app.get('/settings', Dashboard.checkAuth, (req, res) => {
        const basePath = req.basePath || '';
        return res.redirect(301, `${basePath}/admin`);
      });

      // Admin changelog management route
      Dashboard.app.get('/admin/changelog', Dashboard.checkAuth, async (req, res) => {
        try {
          const user = req.user || null;
          const isOwner = user && (Dashboard.settings.ownerIds || []).includes(user.id);

          if (!isOwner) {
            return res.redirect('/admin');
          }

          const fs = require('fs');
          const path = require('path');
          const changelogPath = path.join(__dirname, 'dashboard_EXT', 'data', 'changelog.json');

          let changelogData = { entries: [], metadata: {} };
          if (fs.existsSync(changelogPath)) {
            changelogData = JSON.parse(fs.readFileSync(changelogPath, 'utf8'));
          }

          const baseData = {
            navItems: Dashboard.settings.navItems,
            footer: Dashboard.settings.footer,
            footerTextHtml: Dashboard.settings.footerTextHtml,
            seoDefaults: Dashboard.settings.seo,
            cookieConsent: Dashboard.settings.cookieConsent,
            supportServer: Dashboard.settings.supportServer,
            settings: Dashboard.settings,
            client: DBM.Bot.bot,
            user,
            currentPath: req.originalUrl,
            isOwner: true,
            changelog: changelogData,
          };

          res.render('admin/changelog', {
            data: Object.assign({}, baseData, {
              seo: {
                title: `Changelog Management - ${
                  Dashboard.settings.seo?.defaultTitle || 'News Targeted Bot Dashboard'
                }`,
                description: 'Manage changelog entries for the News Targeted Bot Dashboard.',
                keywords: Dashboard.settings.seo?.defaultKeywords,
                image: Dashboard.settings.seo?.defaultImage,
                canonical: baseData.seoDefaults?.canonicalBase
                  ? `${baseData.seoDefaults.canonicalBase.replace(/\/$/, '')}${req.originalUrl}`
                  : undefined,
              },
            }),
          });
        } catch (error) {
          console.error('❌ Admin changelog page error:', error.message);
          res.status(500).send('Internal server error');
        }
      });

      Dashboard.app.get('/admin', Dashboard.checkAuth, async (req, res) => {
        try {
          const user = req.user || null;
          const ownerConfig = Dashboard.settings.ownerIds || Dashboard.settings.owner || [];
          const ownerList = Array.isArray(ownerConfig)
            ? ownerConfig
            : String(ownerConfig || '')
                .split(',')
                .map((id) => id.trim())
                .filter(Boolean);
          const isOwner = user ? ownerList.includes(user.id) : false;

          if (!isOwner) {
            const basePath = req.basePath || '';
            return res.redirect(`${basePath}/dashboard/@me`);
          }

          const client =
            DBM.Bot && DBM.Bot.bot
              ? DBM.Bot.bot
              : {
                  user: {
                    username: 'News Targeted Bot',
                    displayAvatarURL: () => 'https://cdn.discordapp.com/embed/avatars/0.png',
                  },
                };

          const csrfToken = req.csrfToken || res.locals.csrfToken || null;

          // Read actual prefix from DBM settings.json file
          let actualPrefix = '!';
          try {
            const settingsPath = path.join(__dirname, '..', '..', 'data', 'settings.json');
            if (fs.existsSync(settingsPath)) {
              const settingsData = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
              actualPrefix = settingsData.tag || settingsData.commandPrefix || '!';
            } else if (DBM && DBM.Files && DBM.Files.data && DBM.Files.data.settings) {
              actualPrefix = DBM.Files.data.settings.tag || DBM.Files.data.settings.commandPrefix || '!';
            }
          } catch (error) {
            console.warn('[Admin] Error reading prefix from settings.json:', error.message);
          }

          const botSettings = {
            ...(Dashboard.settings.botSettings || {}),
            commandPrefix: actualPrefix,
          };

          // Get OAuth client ID from config, secureConfig, or bot's user ID (OAuth uses bot's user ID as client ID)
          let oauthClientId =
            Dashboard.settings.clientId || (Dashboard.secureConfig && Dashboard.secureConfig.get('clientId')) || '';

          // If still empty, try to get from bot's user ID (OAuth strategy uses this)
          if (!oauthClientId && client && client.user && client.user.id) {
            oauthClientId = String(client.user.id);
          }

          // Fallback: try reading from settings.json
          if (!oauthClientId) {
            try {
              const settingsPath = path.join(__dirname, '..', '..', 'data', 'settings.json');
              if (fs.existsSync(settingsPath)) {
                const settingsData = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
                oauthClientId = settingsData.client || settingsData.clientId || '';
              }
            } catch (error) {
              // Ignore error, already tried
            }
          }

          const siteSettings = {
            introText: Dashboard.settings.introText || '',
            footerText: Dashboard.settings.footerText || '',
            supportServer: Dashboard.settings.supportServer || '',
            footer: Dashboard.settings.footer || {},
            contactWebhook:
              Dashboard.secureConfig && typeof Dashboard.secureConfig.get === 'function'
                ? Dashboard.secureConfig.get('contactWebhook') || ''
                : '',
            oauth: {
              clientId: oauthClientId,
              clientSecret:
                Dashboard.settings.clientSecret ||
                (Dashboard.secureConfig && Dashboard.secureConfig.get('clientSecret')) ||
                '',
              callbackURLs: Array.isArray(Dashboard.settings.callbackURLs)
                ? Dashboard.settings.callbackURLs
                : (Dashboard.secureConfig && Dashboard.secureConfig.get('callbackURLs')) || [],
            },
          };
          const optionSets = {
            statusPresences: BOT_STATUS_OPTIONS,
            languages: BOT_LANGUAGE_OPTIONS,
            timezones: BOT_TIMEZONE_OPTIONS,
            moderationLevels: BOT_MODERATION_LEVEL_OPTIONS,
            autoDisconnect: BOT_AUTO_DISCONNECT_OPTIONS,
            debugLogging: BOT_DEBUG_LOGGING_OPTIONS,
            twoFactor: BOT_TWO_FACTOR_OPTIONS,
          };

          // Load leaderboard config
          let leaderboardConfig = {
            enabled: false,
            database: {
              host: 'localhost',
              user: '',
              password: '',
              database: '',
            },
            tablesCreated: false,
          };
          try {
            const configFile = path.join(__dirname, 'dashboard_EXT', 'config.json');
            if (fs.existsSync(configFile)) {
              const fullConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));
              if (fullConfig.leaderboard) {
                leaderboardConfig = fullConfig.leaderboard;
              }
            }
          } catch (error) {
            console.warn('[Admin] Error loading leaderboard config:', error.message);
          }

          // Check if giveaway system is available
          let giveawaySystemAvailable = false;
          try {
            const giveawayUtilsPath = path.join(__dirname, 'dashboard_EXT', 'tools', 'giveaway_utils');
            const giveawayUtils = require(giveawayUtilsPath);
            if (giveawayUtils && typeof giveawayUtils.isGiveawaySystemAvailable === 'function') {
              giveawaySystemAvailable = giveawayUtils.isGiveawaySystemAvailable();
            }
          } catch (error) {
            // Giveaway system not available, continue normally
          }

          const baseData = {
            navItems: Dashboard.settings.navItems,
            footer: Dashboard.settings.footer,
            footerTextHtml: Dashboard.settings.footerTextHtml,
            seoDefaults: Dashboard.settings.seo,
            cookieConsent: Dashboard.settings.cookieConsent,
            supportServer: Dashboard.settings.supportServer,
            settings: Dashboard.settings,
            oauth: siteSettings.oauth,
            botSettings,
            siteSettings,
            optionSets,
            client,
            user,
            currentPath: req.originalUrl,
            isOwner,
            contactUrl: res.locals.contactUrl || '/contact',
            csrfToken,
            leaderboardConfig,
            giveawaySystemAvailable,
          };

          const botUpdatedParam = typeof req.query.botUpdated === 'string' ? req.query.botUpdated : null;
          const siteUpdatedParam =
            typeof req.query.siteUpdated === 'string'
              ? req.query.siteUpdated
              : typeof req.query.updated === 'string'
              ? req.query.updated
              : null;
          const alerts = {
            botUpdated: botUpdatedParam,
            siteUpdated: siteUpdatedParam,
            botError: botUpdatedParam === '0' ? 'Unable to save bot settings.' : null,
            siteError: siteUpdatedParam === '0' ? 'Unable to save site settings.' : null,
          };
          const requestedTab =
            typeof req.query.tab === 'string' && req.query.tab.toLowerCase() === 'site' ? 'site' : 'bot';
          let activeAdminTab = requestedTab;
          if (siteUpdatedParam) {
            activeAdminTab = 'site';
          }
          if (alerts.siteError) {
            activeAdminTab = 'site';
          }

          res.render('settings/index', {
            data: Object.assign({}, baseData, {
              seo: {
                title: `Admin Control Center - ${
                  Dashboard.settings.seo?.defaultTitle || 'News Targeted Bot Dashboard'
                }`,
                description: 'Manage bot configuration and site presentation from a unified admin workspace.',
              },
              alerts,
              activeAdminTab,
            }),
          });
        } catch (error) {
          console.error('❌ Admin page error:', error.message);
          res.status(500).send('Internal server error');
        }
      });

      Dashboard.app.post('/admin/bot-settings', Dashboard.checkAuth, async (req, res) => {
        try {
          const user = req.user || null;
          const ownerConfig = Dashboard.settings.ownerIds || Dashboard.settings.owner || [];
          const ownerList = Array.isArray(ownerConfig)
            ? ownerConfig
            : String(ownerConfig || '')
                .split(',')
                .map((id) => id.trim())
                .filter(Boolean);
          const isOwner = user ? ownerList.includes(user.id) : false;

          if (!isOwner) {
            return res.status(403).send('Forbidden');
          }

          const sanitize = (value, fallback = '') => {
            if (typeof value !== 'string') {
              return fallback;
            }
            const trimmed = value.trim();
            return trimmed.length > 0 ? trimmed : fallback;
          };

          const clampNumber = (value, fallback, min, max) => {
            const parsed = parseInt(value, 10);
            if (Number.isFinite(parsed)) {
              return Math.min(Math.max(parsed, min), max);
            }
            return fallback;
          };

          const validStatuses = ['online', 'idle', 'dnd', 'invisible'];
          const validAutoModLevels = ['lenient', 'balanced', 'strict'];
          const validAutoDisconnect = ['enabled', 'disabled'];
          const validDebugLogging = ['off', 'warn', 'verbose'];

          const botSettings = {
            commandPrefix: sanitize(req.body.commandPrefix, '!'),
            status: {
              presence: validStatuses.includes(req.body.statusPresence) ? req.body.statusPresence : 'online',
              activity: sanitize(req.body.statusActivity, 'Watching over servers'),
            },
            language: sanitize(req.body.language, 'en'),
            timezone: sanitize(req.body.timezone, 'UTC'),
            statusRefreshInterval: clampNumber(req.body.statusRefresh, 5, 1, 60),
            moderation: {
              auditLogChannel: sanitize(req.body.moderationAuditLogChannel, '#moderation-logs'),
              autoModLevel: validAutoModLevels.includes(req.body.moderationAutoModLevel)
                ? req.body.moderationAutoModLevel
                : 'balanced',
              muteRole: sanitize(req.body.moderationMuteRole, 'Muted'),
            },
            music: {
              defaultVolume: clampNumber(req.body.musicDefaultVolume, 60, 0, 100),
              autoDisconnect: validAutoDisconnect.includes(req.body.musicAutoDisconnect)
                ? req.body.musicAutoDisconnect
                : 'enabled',
            },
            security: {
              twoFactorRequired: req.body.securityTwoFactorRequired === 'required' ? 'required' : 'optional',
              sessionTimeout: clampNumber(req.body.securitySessionTimeout, 60, 5, 240),
            },
            advanced: {
              webhookProxy: sanitize(req.body.advancedWebhookProxy, ''),
              debugLogging: validDebugLogging.includes(req.body.advancedDebugLogging)
                ? req.body.advancedDebugLogging
                : 'off',
            },
          };

          const fs = require('fs');
          const path = require('path');
          const configPath = path.join(__dirname, 'dashboard_EXT', 'config.json');
          let rawConfig = {};

          if (Dashboard.secureConfig && typeof Dashboard.secureConfig.getRawConfig === 'function') {
            rawConfig = Dashboard.secureConfig.getRawConfig({ includeSecrets: true }) || {};
          }

          if (!rawConfig || Object.keys(rawConfig).length === 0) {
            if (fs.existsSync(configPath)) {
              rawConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            } else {
              rawConfig = {};
            }
          }

          rawConfig.botSettings = botSettings;

          fs.writeFileSync(configPath, JSON.stringify(rawConfig, null, 4));

          if (Dashboard.secureConfig && typeof Dashboard.secureConfig.loadConfig === 'function') {
            try {
              Dashboard.secureConfig.loadConfig();
              Dashboard.settings = Dashboard.secureConfig.getAll();
              Dashboard.settings.navItems = normalizeNavItems(Dashboard.settings.navItems);
              Dashboard.settings.footer = normalizeFooter(Dashboard.settings.footer);
              Dashboard.settings.footerTextHtml = renderMarkdown(Dashboard.settings.footerText || '');
              Dashboard.settings.clientId = Dashboard.secureConfig.get('clientId') || rawConfig.clientId || '';
              Dashboard.settings.clientSecret =
                Dashboard.secureConfig.get('clientSecret') || rawConfig.clientSecret || '';
              Dashboard.settings.callbackURLs =
                Dashboard.secureConfig.get('callbackURLs') || rawConfig.callbackURLs || [];
              Dashboard.settings.botSettings = botSettings;
              persistNormalizedConfig(Dashboard, Dashboard.secureConfig);
            } catch (reloadError) {
              console.error('❌ Bot settings reload error:', reloadError.message);
              persistNormalizedConfig(Dashboard, Dashboard.secureConfig);
            }
          } else {
            Dashboard.settings.clientId = rawConfig.clientId || Dashboard.settings.clientId || '';
            Dashboard.settings.clientSecret = rawConfig.clientSecret || Dashboard.settings.clientSecret || '';
            Dashboard.settings.callbackURLs = rawConfig.callbackURLs || Dashboard.settings.callbackURLs || [];
            Dashboard.settings.botSettings = botSettings;
            persistNormalizedConfig(Dashboard, Dashboard.secureConfig);
          }

          const nextToken = issueAdminCsrfToken(req, Dashboard);

          if (expectsJsonResponse(req)) {
            return res.json({
              success: true,
              message: 'Bot settings updated successfully.',
              settings: botSettings,
              csrf: nextToken,
            });
          }

          const basePath = req.basePath || '';
          return res.redirect(`${basePath}/admin?botUpdated=1`);
        } catch (error) {
          console.error('❌ Bot settings save error:', error);
          const nextToken = issueAdminCsrfToken(req, Dashboard);
          const basePath = req.basePath || '';
          if (expectsJsonResponse(req)) {
            return res.status(400).json({
              success: false,
              message: error.message || 'Unable to save bot settings.',
              csrf: nextToken,
            });
          }
          return res.redirect(`${basePath}/admin?botUpdated=0`);
        }
      });

      const handleSiteSettingsSubmission = (req, res) => {
        try {
          const user = req.user || null;
          const ownerConfig = Dashboard.settings.ownerIds || Dashboard.settings.owner || [];
          const ownerList = Array.isArray(ownerConfig)
            ? ownerConfig.map((id) => String(id).trim()).filter(Boolean)
            : String(ownerConfig || '')
                .split(',')
                .map((id) => id.trim())
                .filter(Boolean);
          const isOwner = user ? ownerList.includes(String(user.id)) : false;

          if (!isOwner) {
            return res.status(403).send('Forbidden');
          }

          const fs = require('fs');
          const path = require('path');
          const configPath = path.join(__dirname, 'dashboard_EXT', 'config.json');
          let raw = {};

          if (Dashboard.secureConfig && typeof Dashboard.secureConfig.getRawConfig === 'function') {
            raw = Dashboard.secureConfig.getRawConfig({ includeSecrets: true }) || {};
          }

          if (!raw || Object.keys(raw).length === 0) {
            if (fs.existsSync(configPath)) {
              raw = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            } else {
              raw = {};
            }
          }

          const normalizeString = (value, fallback = '') => {
            if (typeof value !== 'string') {
              return fallback;
            }
            const trimmed = value.trim();
            return trimmed.length > 0 ? trimmed : fallback;
          };

          const parseTextareaList = (value, fallback = []) => {
            if (typeof value !== 'string') {
              return Array.isArray(fallback) ? fallback : [];
            }
            const list = value
              .split(/\r?\n/)
              .map((entry) => entry.trim())
              .filter(Boolean);
            return list.length > 0 ? list : Array.isArray(fallback) ? fallback : [];
          };

          raw.introText = normalizeString(req.body.introText, raw.introText || '');
          raw.footerText = normalizeString(req.body.footerText, raw.footerText || '');
          raw.supportServer = normalizeString(req.body.supportServer, raw.supportServer || '');
          raw.clientId = normalizeString(req.body.clientId, raw.clientId || '');
          raw.clientSecret = normalizeString(req.body.clientSecret, raw.clientSecret || '');
          raw.callbackURLs = parseTextareaList(req.body.callbackURLs, raw.callbackURLs || []);

          raw.footer = raw.footer || {};
          raw.footer.title = (req.body.footerTitle || raw.footer.title || '').trim();
          raw.footer.tagline = (req.body.footerTagline || raw.footer.tagline || '').trim();
          raw.footer.copyright = (req.body.footerCopyright || raw.footer.copyright || '').trim();

          // Parse markdown format for social links
          const parseSocialLinksMarkdown = (markdown) => {
            if (!markdown || typeof markdown !== 'string' || markdown.trim().length === 0) {
              return [];
            }
            const links = [];
            const lines = markdown
              .split('\n')
              .map((line) => line.trim())
              .filter((line) => line.length > 0);
            for (const line of lines) {
              // Parse format: [Label](URL) icon:icon-name
              const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)(?:\s+icon:(\S+))?/);
              if (linkMatch) {
                const label = linkMatch[1];
                const href = linkMatch[2];
                const icon = linkMatch[3] || 'external-link-alt';
                links.push({ label, href, icon });
              }
            }
            return links;
          };

          // Parse markdown format for footer columns
          const parseFooterColumnsMarkdown = (markdown) => {
            if (!markdown || typeof markdown !== 'string' || markdown.trim().length === 0) {
              return [];
            }
            const columns = [];
            const lines = markdown.split('\n').map((line) => line.trim());
            let currentColumn = null;
            for (const line of lines) {
              // Check for column title: ## Title
              const titleMatch = line.match(/^##\s+(.+)$/);
              if (titleMatch) {
                // Save previous column if exists
                if (currentColumn) {
                  columns.push(currentColumn);
                }
                // Start new column
                currentColumn = {
                  title: titleMatch[1].trim(),
                  links: [],
                };
              } else if (currentColumn && line.startsWith('- [')) {
                // Parse link: - [Label](URL) owner
                const linkMatch = line.match(/^-\s+\[([^\]]+)\]\(([^)]+)\)(?:\s+owner)?/);
                if (linkMatch) {
                  const label = linkMatch[1];
                  const href = linkMatch[2];
                  const isOwner = line.includes(' owner');
                  currentColumn.links.push({
                    label,
                    href,
                    requiresOwner: isOwner,
                  });
                }
              }
            }
            // Don't forget the last column
            if (currentColumn) {
              columns.push(currentColumn);
            }
            return columns;
          };

          // Try to parse as markdown first, fall back to JSON if it fails
          const parseFooterSocial = (value, fallback) => {
            if (!value || value.trim().length === 0) {
              return fallback || [];
            }
            // Check if it looks like JSON (starts with [ or {)
            if (value.trim().startsWith('[') || value.trim().startsWith('{')) {
              try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : fallback || [];
              } catch (e) {
                // Not valid JSON, try markdown
              }
            }
            // Parse as markdown
            return parseSocialLinksMarkdown(value);
          };

          const parseFooterColumns = (value, fallback) => {
            if (!value || value.trim().length === 0) {
              return fallback || [];
            }
            // Check if it looks like JSON (starts with [)
            if (value.trim().startsWith('[')) {
              try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : fallback || [];
              } catch (e) {
                // Not valid JSON, try markdown
              }
            }
            // Parse as markdown
            return parseFooterColumnsMarkdown(value);
          };

          raw.footer.social = parseFooterSocial(req.body.footerSocial, raw.footer.social || []);
          raw.footer.cols = parseFooterColumns(req.body.footerColumns, raw.footer.cols || []);

          // Save contact webhook URL to config.secrets.json for security
          const contactWebhook = normalizeString(req.body.contactWebhook, '');
          const secretsPath = path.join(__dirname, 'dashboard_EXT', 'config.secrets.json');
          let secrets = {};
          if (fs.existsSync(secretsPath)) {
            try {
              secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
            } catch (secretsError) {
              console.warn('[Admin] Unable to parse config.secrets.json, creating new file:', secretsError.message);
              secrets = {};
            }
          }

          // Validate webhook URL if provided
          if (contactWebhook) {
            try {
              const webhookUrl = new URL(contactWebhook.trim());
              if (!/^https:\/\/(ptb\.|canary\.)?discord\.com\/api\/webhooks\//.test(webhookUrl.href)) {
                throw new Error('Contact webhook URL must be a valid Discord webhook URL');
              }
              secrets.contactWebhook = webhookUrl.href;
            } catch (urlError) {
              throw new Error(`Invalid contact webhook URL: ${urlError.message}`);
            }
          } else {
            // Remove webhook if empty
            delete secrets.contactWebhook;
          }

          // Write secrets file
          fs.writeFileSync(secretsPath, JSON.stringify(secrets, null, 4), { mode: 0o600 });

          fs.writeFileSync(configPath, JSON.stringify(raw, null, 4));

          if (Dashboard.secureConfig && typeof Dashboard.secureConfig.loadConfig === 'function') {
            try {
              Dashboard.secureConfig.loadConfig();
              Dashboard.settings = Dashboard.secureConfig.getAll();
              Dashboard.settings.navItems = normalizeNavItems(Dashboard.settings.navItems);
              Dashboard.settings.footer = normalizeFooter(Dashboard.settings.footer);
              Dashboard.settings.footerTextHtml = renderMarkdown(Dashboard.settings.footerText || '');
              Dashboard.settings.clientId = Dashboard.secureConfig.get('clientId') || raw.clientId || '';
              Dashboard.settings.clientSecret = Dashboard.secureConfig.get('clientSecret') || raw.clientSecret || '';
              Dashboard.settings.callbackURLs = Dashboard.secureConfig.get('callbackURLs') || raw.callbackURLs || [];
              Dashboard.settings.introText = raw.introText;
              Dashboard.settings.footerText = raw.footerText;
              Dashboard.settings.supportServer = raw.supportServer;
              persistNormalizedConfig(Dashboard, Dashboard.secureConfig);
            } catch (reloadError) {
              console.error('[Admin] Failed to reload secure configuration after site update:', reloadError.message);
              persistNormalizedConfig(Dashboard, Dashboard.secureConfig);
            }
          } else {
            persistNormalizedConfig(Dashboard, Dashboard.secureConfig);
          }

          Dashboard.settings.introText = raw.introText;
          Dashboard.settings.footerText = raw.footerText;
          Dashboard.settings.supportServer = raw.supportServer;
          Dashboard.settings.clientId = raw.clientId;
          Dashboard.settings.clientSecret = raw.clientSecret;
          Dashboard.settings.callbackURLs = raw.callbackURLs;
          Dashboard.settings.footer = normalizeFooter(raw.footer);
          Dashboard.settings.footerTextHtml = renderMarkdown(Dashboard.settings.footerText || '');

          const nextToken = issueAdminCsrfToken(req, Dashboard);

          if (expectsJsonResponse(req)) {
            return res.json({
              success: true,
              message: 'Site settings updated successfully.',
              settings: {
                introText: raw.introText,
                footerText: raw.footerText,
                supportServer: raw.supportServer,
                footer: Dashboard.settings.footer,
              },
              oauth: {
                clientId: raw.clientId,
                clientSecret: raw.clientSecret,
                callbackURLs: raw.callbackURLs,
              },
              csrf: nextToken,
            });
          }

          const basePath = req.basePath || '';
          return res.redirect(`${basePath}/admin?siteUpdated=1`);
        } catch (error) {
          console.error('[Admin] Failed to update site settings:', error);
          const nextToken = issueAdminCsrfToken(req, Dashboard);
          const basePath = req.basePath || '';
          if (expectsJsonResponse(req)) {
            return res.status(400).json({
              success: false,
              message: error.message || 'Unable to update site settings.',
              csrf: nextToken,
            });
          }
          return res.redirect(`${basePath}/admin?siteUpdated=0`);
        }
      };

      Dashboard.app.post('/admin/site-settings', Dashboard.checkAuth, handleSiteSettingsSubmission);
      Dashboard.app.post('/api/admin/web', Dashboard.checkAuth, handleSiteSettingsSubmission);

      // Changelog API routes
      Dashboard.app.get('/api/changelog', async (req, res) => {
        try {
          const fs = require('fs');
          const path = require('path');
          const changelogPath = path.join(__dirname, 'dashboard_EXT', 'data', 'changelog.json');

          let changelogData = { entries: [], metadata: {} };
          if (fs.existsSync(changelogPath)) {
            changelogData = JSON.parse(fs.readFileSync(changelogPath, 'utf8'));
          }

          res.json({ success: true, data: changelogData });
        } catch (error) {
          console.error('Error reading changelog:', error);
          res.status(500).json({ success: false, message: 'Failed to load changelog' });
        }
      });

      Dashboard.app.post('/api/changelog', Dashboard.checkAuth, async (req, res) => {
        try {
          const isOwner = req.user && (Dashboard.settings.ownerIds || []).includes(req.user.id);
          if (!isOwner) {
            return res.status(403).json({ success: false, message: 'Owner access required' });
          }

          const fs = require('fs');
          const path = require('path');
          const changelogPath = path.join(__dirname, 'dashboard_EXT', 'data', 'changelog.json');

          const { version, date, time, type, title, categories } = req.body;

          if (!version || !date || !type) {
            return res.status(400).json({ success: false, message: 'Missing required fields: version, date, type' });
          }

          let changelogData = { entries: [], metadata: {} };
          if (fs.existsSync(changelogPath)) {
            changelogData = JSON.parse(fs.readFileSync(changelogPath, 'utf8'));
          }

          const newEntry = {
            version,
            date,
            time: time || new Date().toTimeString().slice(0, 5),
            type: type.toLowerCase(),
            title: title || '',
            categories: categories || {},
          };

          // Add to beginning of array (newest first)
          changelogData.entries.unshift(newEntry);
          changelogData.metadata.lastUpdated = new Date().toISOString();

          // Write to file
          fs.writeFileSync(changelogPath, JSON.stringify(changelogData, null, 2), 'utf8');

          res.json({ success: true, message: 'Changelog entry added successfully', data: newEntry });
        } catch (error) {
          console.error('Error saving changelog:', error);
          res.status(500).json({ success: false, message: 'Failed to save changelog entry' });
        }
      });

      Dashboard.app.put('/api/changelog/:version', Dashboard.checkAuth, async (req, res) => {
        try {
          const isOwner = req.user && (Dashboard.settings.ownerIds || []).includes(req.user.id);
          if (!isOwner) {
            return res.status(403).json({ success: false, message: 'Owner access required' });
          }

          const fs = require('fs');
          const path = require('path');
          const changelogPath = path.join(__dirname, 'dashboard_EXT', 'data', 'changelog.json');
          const version = decodeURIComponent(req.params.version);

          let changelogData = { entries: [], metadata: {} };
          if (fs.existsSync(changelogPath)) {
            changelogData = JSON.parse(fs.readFileSync(changelogPath, 'utf8'));
          }

          const entryIndex = changelogData.entries.findIndex((e) => e.version === version);
          if (entryIndex === -1) {
            return res.status(404).json({ success: false, message: 'Changelog entry not found' });
          }

          // Update entry
          const updatedEntry = { ...changelogData.entries[entryIndex], ...req.body };
          changelogData.entries[entryIndex] = updatedEntry;
          changelogData.metadata.lastUpdated = new Date().toISOString();

          fs.writeFileSync(changelogPath, JSON.stringify(changelogData, null, 2), 'utf8');

          res.json({ success: true, message: 'Changelog entry updated successfully', data: updatedEntry });
        } catch (error) {
          console.error('Error updating changelog:', error);
          res.status(500).json({ success: false, message: 'Failed to update changelog entry' });
        }
      });

      Dashboard.app.delete('/api/changelog/:version', Dashboard.checkAuth, async (req, res) => {
        try {
          const isOwner = req.user && (Dashboard.settings.ownerIds || []).includes(req.user.id);
          if (!isOwner) {
            return res.status(403).json({ success: false, message: 'Owner access required' });
          }

          const fs = require('fs');
          const path = require('path');
          const changelogPath = path.join(__dirname, 'dashboard_EXT', 'data', 'changelog.json');
          const version = decodeURIComponent(req.params.version);

          let changelogData = { entries: [], metadata: {} };
          if (fs.existsSync(changelogPath)) {
            changelogData = JSON.parse(fs.readFileSync(changelogPath, 'utf8'));
          }

          const entryIndex = changelogData.entries.findIndex((e) => e.version === version);
          if (entryIndex === -1) {
            return res.status(404).json({ success: false, message: 'Changelog entry not found' });
          }

          changelogData.entries.splice(entryIndex, 1);
          changelogData.metadata.lastUpdated = new Date().toISOString();

          fs.writeFileSync(changelogPath, JSON.stringify(changelogData, null, 2), 'utf8');

          res.json({ success: true, message: 'Changelog entry deleted successfully' });
        } catch (error) {
          console.error('Error deleting changelog:', error);
          res.status(500).json({ success: false, message: 'Failed to delete changelog entry' });
        }
      });

      // Documentation route
      Dashboard.app.get('/docs', async (req, res) => {
        try {
          const user = req.user || null;
          const baseData = {
            navItems: Dashboard.settings.navItems,
            footer: Dashboard.settings.footer,
            footerTextHtml: Dashboard.settings.footerTextHtml,
            seoDefaults: Dashboard.settings.seo,
            cookieConsent: Dashboard.settings.cookieConsent,
            supportServer: Dashboard.settings.supportServer,
            settings: Dashboard.settings,
            client: DBM.Bot.bot,
            user,
            currentPath: req.originalUrl,
            isOwner: user ? (Dashboard.settings.ownerIds || []).includes(user.id) : false,
          };
          res.render('docs/index', {
            data: Object.assign({}, baseData, {
              seo: {
                title: `Documentation - ${Dashboard.settings.seo?.defaultTitle || 'News Targeted Bot Dashboard'}`,
                description: 'Learn how to get the most from the News Targeted Bot dashboard.',
                keywords: Dashboard.settings.seo?.defaultKeywords,
                image: Dashboard.settings.seo?.defaultImage,
                canonical: baseData.seoDefaults?.canonicalBase
                  ? `${baseData.seoDefaults.canonicalBase.replace(/\/$/, '')}${req.originalUrl}`
                  : undefined,
              },
            }),
          });
        } catch (error) {
          console.error('❌ Docs page error:', error.message);
          res.status(500).send('Internal server error');
        }
      });

      // Status route
      Dashboard.app.get('/status', async (req, res) => {
        try {
          const user = req.user || null;
          const baseData = {
            navItems: Dashboard.settings.navItems,
            footer: Dashboard.settings.footer,
            footerTextHtml: Dashboard.settings.footerTextHtml,
            seoDefaults: Dashboard.settings.seo,
            cookieConsent: Dashboard.settings.cookieConsent,
            supportServer: Dashboard.settings.supportServer,
            settings: Dashboard.settings,
            client: DBM.Bot.bot,
            user,
            currentPath: req.originalUrl,
            isOwner: user ? (Dashboard.settings.ownerIds || []).includes(user.id) : false,
          };
          res.render('status/index', {
            data: Object.assign({}, baseData, {
              seo: {
                title: `Status - ${Dashboard.settings.seo?.defaultTitle || 'News Targeted Bot Dashboard'}`,
                description: 'Track real-time health and uptime for the News Targeted Bot services.',
                keywords: Dashboard.settings.seo?.defaultKeywords,
                image: Dashboard.settings.seo?.defaultImage,
                canonical: baseData.seoDefaults?.canonicalBase
                  ? `${baseData.seoDefaults.canonicalBase.replace(/\/$/, '')}${req.originalUrl}`
                  : undefined,
              },
            }),
          });
        } catch (error) {
          console.error('❌ Status page error:', error.message);
          res.status(500).send('Internal server error');
        }
      });

      // Changelog route
      Dashboard.app.get('/changelog', async (req, res) => {
        try {
          const user = req.user || null;
          const fs = require('fs');
          const path = require('path');
          const changelogPath = path.join(__dirname, 'dashboard_EXT', 'data', 'changelog.json');

          let changelogData = { entries: [], metadata: {} };
          if (fs.existsSync(changelogPath)) {
            try {
              changelogData = JSON.parse(fs.readFileSync(changelogPath, 'utf8'));
            } catch (error) {
              console.error('Error reading changelog:', error);
            }
          }

          // Ensure entries are sorted newest to oldest (by date, then time)
          if (changelogData.entries && changelogData.entries.length > 0) {
            changelogData.entries.sort((a, b) => {
              const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
              const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
              return dateB - dateA; // Newest first
            });
          }

          // Pagination settings
          const entriesPerPage = 5;
          const currentPage = Math.max(1, parseInt(req.query.page, 10) || 1);
          const totalEntries = changelogData.entries ? changelogData.entries.length : 0;
          const totalPages = Math.ceil(totalEntries / entriesPerPage);
          const validPage = Math.min(currentPage, Math.max(1, totalPages));

          // Get entries for current page
          const startIndex = (validPage - 1) * entriesPerPage;
          const endIndex = startIndex + entriesPerPage;
          const paginatedEntries = changelogData.entries ? changelogData.entries.slice(startIndex, endIndex) : [];

          const baseData = {
            navItems: Dashboard.settings.navItems,
            footer: Dashboard.settings.footer,
            footerTextHtml: Dashboard.settings.footerTextHtml,
            seoDefaults: Dashboard.settings.seo,
            cookieConsent: Dashboard.settings.cookieConsent,
            supportServer: Dashboard.settings.supportServer,
            settings: Dashboard.settings,
            client: DBM.Bot.bot,
            user,
            currentPath: req.originalUrl,
            isOwner: user ? (Dashboard.settings.ownerIds || []).includes(user.id) : false,
          };
          res.render('changelog/index', {
            data: Object.assign({}, baseData, {
              changelog: {
                ...changelogData,
                entries: paginatedEntries,
              },
              pagination: {
                currentPage: validPage,
                totalPages,
                entriesPerPage,
                totalEntries,
                startIndex: startIndex + 1,
                endIndex: Math.min(startIndex + entriesPerPage, totalEntries),
              },
              seo: {
                title: `Changelog - ${Dashboard.settings.seo?.defaultTitle || 'News Targeted Bot Dashboard'}`,
                description:
                  'Complete version history and changelog for the News Targeted Bot Dashboard. Track all updates, features, and improvements.',
                keywords: `${Dashboard.settings.seo?.defaultKeywords || ''}, changelog, version history, updates`,
                image: Dashboard.settings.seo?.defaultImage,
                canonical: baseData.seoDefaults?.canonicalBase
                  ? `${baseData.seoDefaults.canonicalBase.replace(/\/$/, '')}${req.originalUrl}`
                  : undefined,
              },
            }),
          });
        } catch (error) {
          console.error('❌ Changelog page error:', error.message);
          res.status(500).send('Internal server error');
        }
      });

      // Privacy Policy route
      Dashboard.app.get('/privacy', async (req, res) => {
        try {
          const user = req.user || null;
          const baseData = {
            navItems: Dashboard.settings.navItems,
            footer: Dashboard.settings.footer,
            footerTextHtml: Dashboard.settings.footerTextHtml,
            seoDefaults: Dashboard.settings.seo,
            cookieConsent: Dashboard.settings.cookieConsent,
            supportServer: Dashboard.settings.supportServer,
            settings: Dashboard.settings,
            client: DBM.Bot.bot,
            user,
            currentPath: req.originalUrl,
            isOwner: user ? (Dashboard.settings.ownerIds || []).includes(user.id) : false,
          };
          res.render('legal/privacy', {
            data: Object.assign({}, baseData, {
              seo: {
                title: `Privacy Policy - ${Dashboard.settings.seo?.defaultTitle || 'News Targeted Bot Dashboard'}`,
                description: 'Understand how News Targeted Bot collects and uses information.',
                keywords: Dashboard.settings.seo?.defaultKeywords,
                image: Dashboard.settings.seo?.defaultImage,
                canonical: baseData.seoDefaults?.canonicalBase
                  ? `${baseData.seoDefaults.canonicalBase.replace(/\/$/, '')}${req.originalUrl}`
                  : undefined,
              },
            }),
          });
        } catch (error) {
          console.error('❌ Privacy page error:', error.message);
          res.status(500).send('Internal server error');
        }
      });

      // Terms of Service route
      Dashboard.app.get('/terms', async (req, res) => {
        try {
          const user = req.user || null;
          const baseData = {
            navItems: Dashboard.settings.navItems,
            footer: Dashboard.settings.footer,
            footerTextHtml: Dashboard.settings.footerTextHtml,
            seoDefaults: Dashboard.settings.seo,
            cookieConsent: Dashboard.settings.cookieConsent,
            supportServer: Dashboard.settings.supportServer,
            settings: Dashboard.settings,
            client: DBM.Bot.bot,
            user,
            currentPath: req.originalUrl,
            isOwner: user ? (Dashboard.settings.ownerIds || []).includes(user.id) : false,
          };
          res.render('legal/terms', {
            data: Object.assign({}, baseData, {
              seo: {
                title: `Terms of Service - ${Dashboard.settings.seo?.defaultTitle || 'News Targeted Bot Dashboard'}`,
                description: 'Review the News Targeted Bot terms of service and acceptable use.',
                keywords: Dashboard.settings.seo?.defaultKeywords,
                image: Dashboard.settings.seo?.defaultImage,
                canonical: baseData.seoDefaults?.canonicalBase
                  ? `${baseData.seoDefaults.canonicalBase.replace(/\/$/, '')}${req.originalUrl}`
                  : undefined,
              },
            }),
          });
        } catch (error) {
          console.error('❌ Terms page error:', error.message);
          res.status(500).send('Internal server error');
        }
      });

      // Cookie Policy route
      Dashboard.app.get('/cookies', async (req, res) => {
        try {
          const user = req.user || null;
          const baseData = {
            navItems: Dashboard.settings.navItems,
            footer: Dashboard.settings.footer,
            seoDefaults: Dashboard.settings.seo,
            cookieConsent: Dashboard.settings.cookieConsent,
            supportServer: Dashboard.settings.supportServer,
            settings: Dashboard.settings,
            client: DBM.Bot.bot,
            user,
            currentPath: req.originalUrl,
            isOwner: user ? (Dashboard.settings.ownerIds || []).includes(user.id) : false,
          };
          res.render('legal/cookies', {
            data: Object.assign({}, baseData, {
              seo: {
                title: `Cookie Policy - ${Dashboard.settings.seo?.defaultTitle || 'News Targeted Bot Dashboard'}`,
                description: 'Learn how News Targeted Bot uses cookies and similar technologies.',
                keywords: Dashboard.settings.seo?.defaultKeywords,
                image: Dashboard.settings.seo?.defaultImage,
                canonical: baseData.seoDefaults?.canonicalBase
                  ? `${baseData.seoDefaults.canonicalBase.replace(/\/$/, '')}${req.originalUrl}`
                  : undefined,
              },
            }),
          });
        } catch (error) {
          console.error('❌ Cookie page error:', error.message);
          res.status(500).send('Internal server error');
        }
      });

      // Serve static CSS file with proper cache headers
      Dashboard.app.get('/styles.css', (req, res) => {
        const cssPath = require('path').join(__dirname, 'dashboard_EXT/views/shared/styles.css');
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
        // Set proper cache headers for CSS
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
        res.setHeader('ETag', `"${require('fs').statSync(cssPath).mtime.getTime()}"`);
        res.sendFile(cssPath);
      });

      // API endpoint for live bot statistics
      Dashboard.app.get('/api/stats', async (req, res) => {
        try {
          // Try to get bot from different possible locations
          let bot = null;

          // First try DBM.Bot.bot (most common)
          if (typeof DBM !== 'undefined' && DBM.Bot && DBM.Bot.bot) {
            bot = DBM.Bot.bot;
            console.log('✅ Bot found in DBM.Bot.bot');
          } else if (global.DBM && global.DBM.Bot && global.DBM.Bot.bot) {
            bot = global.DBM.Bot.bot;
            console.log('✅ Bot found in global.DBM.Bot.bot');
          } else if (Dashboard.Bot && Dashboard.Bot.bot) {
            bot = Dashboard.Bot.bot;
            console.log('✅ Bot found in Dashboard.Bot.bot');
          } else if (global.Bot && global.Bot.bot) {
            bot = global.Bot.bot;
            console.log('✅ Bot found in global.Bot.bot');
          }

          if (!bot) {
            console.log('❌ Bot not found in any location, trying alternatives...');
            console.log('DBM available:', typeof DBM !== 'undefined');
            console.log('Dashboard.Bot:', Boolean(Dashboard.Bot));
            console.log('global.DBM:', Boolean(global.DBM));
            console.log('global.Bot:', Boolean(global.Bot));
            console.log(
              'Available globals:',
              Object.keys(global).filter((k) => k.includes('Bot') || k.includes('DBM')),
            );

            // Return fallback data instead of error
            return res.json({
              success: true,
              data: {
                servers: 0,
                users: 0,
                commands: 25,
                uptime: '0s',
                uptimePercent: '0%',
                ping: 0,
                nodeVersion: process.version,
                discordVersion: '14.0.0',
              },
              message: 'Bot not available - using fallback data',
            });
          }

          // Check if bot is ready
          if (!bot.readyAt) {
            console.log('⚠️ Bot not ready yet, using fallback data');
            return res.json({
              success: true,
              data: {
                servers: 0,
                users: 0,
                commands: 0,
                uptime: '0s',
                uptimePercent: '0%',
                ping: 0,
                nodeVersion: process.version,
                discordVersion: require('discord.js').version,
              },
              message: 'Bot not ready yet - using fallback data',
            });
          }

          // Get live bot statistics
          const guilds = bot.guilds.cache;
          const totalGuilds = guilds.size;
          const totalUsers = guilds.reduce((acc, guild) => acc + guild.memberCount, 0);

          // Calculate uptime
          const uptime = process.uptime();
          const uptimeHours = Math.floor(uptime / 3600);
          const uptimeMinutes = Math.floor((uptime % 3600) / 60);
          const uptimeSeconds = Math.floor(uptime % 60);
          const uptimeFormatted = `${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s`;

          // Get ping
          const ping = bot.ws.ping;

          // Get command count from DBM
          let commandCount = 0;
          try {
            if (DBM.Files && DBM.Files.data && DBM.Files.data.commands) {
              commandCount = DBM.Files.data.commands.length || 0;
            }
          } catch (e) {
            commandCount = 25; // fallback
          }

          console.log(`📊 Live stats: ${totalGuilds} servers, ${totalUsers} users, ${ping}ms ping`);

          res.json({
            success: true,
            data: {
              servers: totalGuilds,
              users: totalUsers,
              commands: commandCount,
              uptime: uptimeFormatted,
              uptimePercent: '99.9%', // This could be calculated based on actual uptime tracking
              ping,
              nodeVersion: process.version,
              discordVersion: require('discord.js').version,
            },
          });
        } catch (error) {
          console.error('❌ Stats API error:', error.message);
          res.json({
            success: false,
            message: 'Failed to fetch statistics',
          });
        }
      });

      // API endpoint for DBM commands
      Dashboard.app.get('/api/commands', async (req, res) => {
        try {
          let commands = [];

          // Get commands from DBM data
          if (DBM.Files && DBM.Files.data && DBM.Files.data.commands) {
            commands = DBM.Files.data.commands.map((cmd) => ({
              name: cmd.name || 'Unknown',
              description: cmd.description || 'No description',
              id: cmd._id || 'unknown',
              permissions: cmd.permissions || 'None',
              restriction: cmd.restriction || 'None',
              comType: cmd.comType || 0,
              parameters: cmd.parameters || [],
              aliases: cmd._aliases || [],
              category: cmd.category || 'General',
              cooldown: cmd.cooldown || 0,
              slashCommand: cmd.comType === 4,
              prefixCommand: cmd.comType !== 4,
              actions: cmd.actions ? cmd.actions.length : 0,
            }));
          }

          res.json({
            success: true,
            data: commands,
            count: commands.length,
            categories: [...new Set(commands.map((cmd) => cmd.category))],
            slashCommands: commands.filter((cmd) => cmd.slashCommand).length,
            prefixCommands: commands.filter((cmd) => cmd.prefixCommand).length,
          });
        } catch (error) {
          console.error('❌ Commands API error:', error.message);
          res.json({
            success: false,
            message: 'Failed to fetch commands',
          });
        }
      });

      // API endpoint for specific command details
      // Server settings API
      Dashboard.app.post('/api/server/:serverId/settings', Dashboard.checkAuth, async (req, res) => {
        try {
          const serverId = req.params.serverId;
          const { levelingEnabled, giveawayEnabled } = req.body;

          // Helper function to normalize owner IDs
          function normalizeOwnerIds(ownerConfig) {
            if (Array.isArray(ownerConfig)) {
              return ownerConfig.map((id) => String(id).trim()).filter(Boolean);
            }
            if (typeof ownerConfig === 'string') {
              return ownerConfig
                .split(',')
                .map((id) => id.trim())
                .filter(Boolean);
            }
            if (ownerConfig) {
              return [String(ownerConfig).trim()].filter(Boolean);
            }
            return [];
          }

          // Verify user has permission (must be server admin or bot owner)
          const owners = normalizeOwnerIds(Dashboard.settings.ownerIds || Dashboard.settings.owner);
          const isOwner = req.user && owners.includes(String(req.user.id));

          if (!req.user) {
            return res.status(401).json({ success: false, error: 'Not authenticated' });
          }

          // Check if user has MANAGE_GUILD permission for this server
          let hasPermission = isOwner;
          if (!hasPermission && req.user.guilds) {
            const guild = req.user.guilds.find((g) => g.id === serverId);
            hasPermission = guild && (guild.permissions & 0x20) === 0x20; // MANAGE_GUILD
          }

          if (!hasPermission) {
            return res
              .status(403)
              .json({ success: false, error: 'You do not have permission to modify settings for this server' });
          }

          const serverSettingsManager = require('./dashboard_EXT/tools/server-settings-manager');
          const success = serverSettingsManager.updateServerSettings(serverId, {
            levelingEnabled: levelingEnabled === true,
            giveawayEnabled: giveawayEnabled === true,
          });

          if (success) {
            res.json({ success: true, message: 'Server settings updated successfully' });
          } else {
            res.status(500).json({ success: false, error: 'Failed to save server settings' });
          }
        } catch (error) {
          console.error('[Dashboard] Server settings API error:', error);
          res.status(500).json({ success: false, error: error.message || 'Failed to update server settings' });
        }
      });

      Dashboard.app.get('/api/server/:serverId/settings', Dashboard.checkAuth, async (req, res) => {
        try {
          const serverId = req.params.serverId;
          const serverSettingsManager = require('./dashboard_EXT/tools/server-settings-manager');
          const settings = serverSettingsManager.getServerSettings(serverId);
          res.json({ success: true, data: settings });
        } catch (error) {
          console.error('[Dashboard] Get server settings error:', error);
          res.status(500).json({ success: false, error: error.message || 'Failed to get server settings' });
        }
      });

      // Leaderboard API routes
      Dashboard.app.get('/api/leaderboard', async (req, res) => {
        try {
          const fs = require('fs');
          const path = require('path');
          const mysql = require('mysql2/promise');

          // Check if leaderboard is enabled
          const configFile = path.join(__dirname, 'dashboard_EXT', 'config.json');
          let leaderboardEnabled = false;
          let dbConfig = null;

          if (fs.existsSync(configFile)) {
            const fullConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));
            const leaderboardConfig = fullConfig.leaderboard;
            leaderboardEnabled = leaderboardConfig && leaderboardConfig.enabled === true;
            dbConfig = leaderboardConfig && leaderboardConfig.database;
          }

          if (!leaderboardEnabled || !dbConfig) {
            return res.status(403).json({
              success: false,
              error: 'Leaderboard system is disabled or not configured. Please enable it in the admin panel.',
            });
          }

          // Create database connection
          const connection = await mysql.createConnection({
            host: dbConfig.host || 'localhost',
            user: dbConfig.user || 'news_disco',
            password: dbConfig.password || dbConfig.db_password || '',
            database: dbConfig.database || dbConfig.name || 'news_disco',
          });

          try {
            const serverId = req.query.serverId || null;
            const scope = req.query.scope || (serverId ? 'server' : 'global');
            const includeUsers = req.query.includeUsers === 'true' || req.query.includeUsers === true;
            const page = parseInt(req.query.page, 10) || 1;
            const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100); // User-selectable limit, max 100
            const offset = 0; // Always start from beginning

            // Debug logging
            console.log(
              `[Dashboard] Leaderboard API called: scope=${scope}, includeUsers=${includeUsers}, limit=${limit}, botAvailable=${Boolean(
                DBM && DBM.Bot && DBM.Bot.bot,
              )}`,
            );

            // Get server settings manager to filter by enabled servers
            const serverSettingsManager = require('./dashboard_EXT/tools/server-settings-manager');
            const disabledServers = serverSettingsManager.getServersWithLevelingEnabled(); // Returns null if all enabled, or array of disabled server IDs

            let leaderboard = [];
            let query;
            let params;

            if (scope === 'global' || !serverId) {
              // Global leaderboard - show all servers by default (since default is enabled)
              // Only filter out servers that have explicitly disabled leveling
              if (disabledServers === null || disabledServers.length === 0) {
                // All servers enabled (default), show all data
                query =
                  'SELECT userID, level, xp, serverID FROM LevelingSystem ORDER BY xp DESC, level DESC LIMIT ? OFFSET ?';
                params = [limit, offset];
              } else if (disabledServers.length > 0) {
                // Some servers have disabled leveling, exclude them
                const placeholders = disabledServers.map(() => '?').join(',');
                query = `SELECT userID, level, xp, serverID FROM LevelingSystem WHERE serverID NOT IN (${placeholders}) ORDER BY xp DESC, level DESC LIMIT ? OFFSET ?`;
                params = [...disabledServers, limit, offset];
              } else {
                query =
                  'SELECT userID, level, xp, serverID FROM LevelingSystem ORDER BY xp DESC, level DESC LIMIT ? OFFSET ?';
                params = [limit, offset];
              }
            } else if (!serverSettingsManager.isLevelingEnabled(serverId)) {
              // Server-specific leaderboard - check if server has leveling enabled
              // Server doesn't have leveling enabled, return empty
              query =
                'SELECT userID, level, xp, serverID FROM LevelingSystem WHERE 1=0 ORDER BY xp DESC, level DESC LIMIT ? OFFSET ?';
              params = [limit, offset];
            } else {
              query =
                'SELECT userID, level, xp, serverID FROM LevelingSystem WHERE serverID = ? ORDER BY xp DESC, level DESC LIMIT ? OFFSET ?';
              params = [serverId, limit, offset];
            }

            const [rows] = await connection.execute(query, params);
            let rank = 1;

            if (Array.isArray(rows)) {
              // First, collect all user IDs and server IDs
              const userIds = rows.map((row) => String(row.userID));
              const serverIds = [...new Set(rows.map((row) => String(row.serverID || '')))].filter((id) => id);

              // Fetch user data from Discord if requested
              const userDataMap = new Map();
              const guildDataMap = new Map();

              if (includeUsers && DBM && DBM.Bot && DBM.Bot.bot) {
                try {
                  // Get users and guilds from cache first
                  const bot = DBM.Bot.bot;

                  // First, build a map of userId -> serverId for efficient lookup
                  const userServerMap = new Map();
                  rows.forEach((row) => {
                    const userId = String(row.userID);
                    const serverId = String(row.serverID || '');
                    if (!userServerMap.has(userId)) {
                      userServerMap.set(userId, []);
                    }
                    userServerMap.get(userId).push(serverId);
                  });

                  // Fetch guild names and try to get users from guild members cache first
                  console.log(`[Dashboard] Checking ${serverIds.length} unique guilds, ${userIds.length} unique users`);
                  let guildsFound = 0;
                  let membersFound = 0;

                  for (const serverId of serverIds) {
                    try {
                      const guild = bot.guilds.cache.get(serverId);
                      if (guild) {
                        guildsFound++;
                        guildDataMap.set(serverId, {
                          name: guild.name || null,
                          id: serverId,
                        });

                        // Try to get users from this guild's members cache
                        const members = guild.members.cache;
                        members.forEach((member) => {
                          const userId = String(member.id);
                          if (userIds.includes(userId) && !userDataMap.has(userId)) {
                            membersFound++;
                            const user = member.user;
                            userDataMap.set(userId, {
                              username: user.username || null,
                              discriminator: user.discriminator || null,
                              avatar: user.avatar || null,
                              displayName: member.displayName || user.displayName || user.username || null,
                            });
                          }
                        });
                      }
                    } catch (e) {
                      // Guild not in cache, continue silently
                      console.warn(`[Dashboard] Error checking guild ${serverId}:`, e.message);
                    }
                  }

                  console.log(
                    `[Dashboard] Found ${guildsFound}/${serverIds.length} guilds in cache, ${membersFound} members matched`,
                  );

                  // Process remaining users in batches
                  const remainingUserIds = userIds.filter((id) => !userDataMap.has(id));
                  console.log(
                    `[Dashboard] ${remainingUserIds.length} users not found in guild cache, attempting direct fetch`,
                  );
                  const batchSize = 10;
                  const totalBatches = Math.ceil(remainingUserIds.length / batchSize);

                  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
                    const batchStart = batchIndex * batchSize;
                    const batchEnd = Math.min(batchStart + batchSize, remainingUserIds.length);
                    const batch = remainingUserIds.slice(batchStart, batchEnd);
                    const fetchPromises = [];

                    for (const userId of batch) {
                      try {
                        // Try bot users cache first
                        const user = bot.users.cache.get(userId);

                        if (user) {
                          userDataMap.set(userId, {
                            username: user.username || null,
                            discriminator: user.discriminator || null,
                            avatar: user.avatar || null,
                            displayName: user.displayName || user.username || null,
                          });
                        } else {
                          // Try fetching from guild members if we know which guild they're in
                          const userServers = userServerMap.get(userId) || [];
                          let foundInGuild = false;

                          for (const serverId of userServers) {
                            try {
                              const guild = bot.guilds.cache.get(serverId);
                              if (guild && guild.members.cache.has(userId)) {
                                const member = guild.members.cache.get(userId);
                                if (member && member.user) {
                                  userDataMap.set(userId, {
                                    username: member.user.username || null,
                                    discriminator: member.user.discriminator || null,
                                    avatar: member.user.avatar || null,
                                    displayName:
                                      member.displayName || member.user.displayName || member.user.username || null,
                                  });
                                  foundInGuild = true;
                                  break;
                                }
                              }
                            } catch (e) {
                              // Continue to next guild
                            }
                          }

                          // If not found in guild cache, try direct user fetch
                          if (!foundInGuild) {
                            fetchPromises.push(
                              bot.users
                                .fetch(userId)
                                .then((fetchedUser) => {
                                  if (fetchedUser) {
                                    userDataMap.set(userId, {
                                      username: fetchedUser.username || null,
                                      discriminator: fetchedUser.discriminator || null,
                                      avatar: fetchedUser.avatar || null,
                                      displayName: fetchedUser.displayName || fetchedUser.username || null,
                                    });
                                  }
                                })
                                .catch((fetchError) => {
                                  // User fetch failed, will use fallback
                                  // Only log if it's not a common error (like user not found)
                                  if (
                                    !fetchError.message.includes('Unknown User') &&
                                    !fetchError.message.includes('404') &&
                                    !fetchError.message.includes('50007')
                                  ) {
                                    console.warn(`[Dashboard] Failed to fetch user ${userId}:`, fetchError.message);
                                  }
                                }),
                            );
                          }
                        }
                      } catch (e) {
                        // User not in cache, continue silently
                      }
                    }

                    // Wait for batch to complete before next batch
                    if (fetchPromises.length > 0) {
                      await Promise.allSettled(fetchPromises);
                    }

                    // Small delay between batches to avoid rate limits
                    if (batchIndex < totalBatches - 1) {
                      await new Promise((resolve) => setTimeout(resolve, 100));
                    }
                  }
                } catch (userError) {
                  console.warn('[Dashboard] Error fetching user data:', userError.message);
                }
              }

              // Map rows to leaderboard entries
              leaderboard = rows.map((row) => {
                const userId = String(row.userID);
                const serverId = String(row.serverID || '');
                const entry = {
                  userID: userId,
                  serverID: serverId,
                  level: row.level || 0,
                  xp: row.xp || 0,
                  rank: rank++,
                };

                // Add user data if available
                const userData = userDataMap.get(userId);
                if (userData) {
                  entry.username = userData.username;
                  entry.discriminator = userData.discriminator;
                  entry.avatar = userData.avatar;
                  entry.displayName = userData.displayName;
                } else {
                  // Set defaults so frontend knows user data wasn't found
                  entry.username = null;
                  entry.discriminator = null;
                  entry.avatar = null;
                  entry.displayName = null;
                }

                // Add guild data if available
                const guildData = guildDataMap.get(serverId);
                if (guildData) {
                  entry.guildName = guildData.name;
                } else {
                  entry.guildName = null;
                }

                return entry;
              });

              // Debug logging
              if (includeUsers && leaderboard.length > 0) {
                const usersFound = leaderboard.filter((e) => e.username || e.displayName).length;
                const guildsFound = leaderboard.filter((e) => e.guildName).length;
                console.log(
                  `[Dashboard] Leaderboard: Fetched ${usersFound}/${leaderboard.length} usernames, ${guildsFound}/${leaderboard.length} guild names`,
                );
                if (usersFound === 0 && leaderboard.length > 0) {
                  console.warn(`[Dashboard] No usernames fetched. Sample entry:`, leaderboard[0]);
                }
              }
            }

            await connection.end();

            res.json({
              success: true,
              data: leaderboard,
              scope,
              page,
              limit,
              count: leaderboard.length,
            });
          } catch (dbError) {
            await connection.end();
            throw dbError;
          }
        } catch (error) {
          console.error('[Dashboard] Leaderboard API error:', error);
          res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch leaderboard data',
          });
        }
      });

      Dashboard.app.get('/api/commands/:commandId', async (req, res) => {
        try {
          const commandId = req.params.commandId;
          let command = null;

          if (DBM.Files && DBM.Files.data && DBM.Files.data.commands) {
            command = DBM.Files.data.commands.find((cmd) => cmd._id === commandId);
          }

          if (!command) {
            return res.status(404).json({
              success: false,
              message: 'Command not found',
            });
          }

          res.json({
            success: true,
            data: {
              name: command.name || 'Unknown',
              description: command.description || 'No description',
              id: command._id || 'unknown',
              permissions: command.permissions || 'None',
              restriction: command.restriction || 'None',
              comType: command.comType || 0,
              parameters: command.parameters || [],
              aliases: command._aliases || [],
              category: command.category || 'General',
              cooldown: command.cooldown || 0,
              slashCommand: command.comType === 4,
              prefixCommand: command.comType !== 4,
              actions: command.actions || [],
            },
          });
        } catch (error) {
          console.error('❌ Command details API error:', error.message);
          res.status(500).json({
            success: false,
            message: 'Failed to fetch command details',
          });
        }
      });
    };

    Dashboard.onReady = function () {
      Dashboard.checkActions();
      const port = Dashboard.secureConfig.get('port');

      console.log('-------------------------------------------------------------------------------------------------');
      console.log(
        chalk.yellow(
          figlet.textSync('DBM Dashboard', {
            horizontalLayout: 'full',
          }),
        ),
      );
      console.log('-------------------------------------------------------------------------------------------------');
      console.log(chalk.white('-'), chalk.red('Version:'), chalk.white('1.0.0'));
      console.log(chalk.white('-'), chalk.red('Port:'), chalk.white(port));
      console.log(chalk.white('-'), chalk.red('isBotSharded:'), chalk.white(Dashboard.settings.isBotSharded));
      console.log(chalk.white('-'), chalk.red('Client Secret:'), chalk.white('[SECURED]'));
      console.log(
        chalk.white('-'),
        chalk.red('Callback URLs:'),
        chalk.white(Dashboard.secureConfig.get('callbackURLs').join(', ')),
      );
      console.log(chalk.white('-'), chalk.red('DBM Network:'), chalk.white('https://discord.gg/3QxkZPK'));
      console.log(chalk.white('-'), chalk.red('Security:'), chalk.green('ENABLED'));
      console.log(chalk.white('-'), chalk.red('Rate Limiting:'), chalk.green('ENABLED'));
      console.log(chalk.white('-'), chalk.red('CSRF Protection:'), chalk.green('ENABLED'));
      console.log('-------------------------------------------------------------------------------------------------');
      console.log(
        chalk.white(chalk.green('- Success:'), `Dashboard started on port ${port}. http://localhost:${port}`),
      );
      console.log('-------------------------------------------------------------------------------------------------');
    };
    // ----------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------

    const dashboardOnReady = DBM.Bot.onReady || {};
    DBM.Bot.onReady = async function () {
      Dashboard.scopes = ['identify', 'guilds'];

      const configErrors = Dashboard.verifyConfig();
      if (configErrors.length > 0) {
        console.log(
          '-------------------------------------------------------------------------------------------------',
        );
        console.log(
          chalk.yellow(
            figlet.textSync('DBM Dashboard', {
              horizontalLayout: 'full',
            }),
          ),
        );
        console.log(
          '-------------------------------------------------------------------------------------------------',
        );
        console.log(chalk.white('-'), chalk.red('Version:'), chalk.white('0.0.1'));
        console.log(chalk.white('-'), chalk.red('Port:'), chalk.white(Dashboard.settings.port));
        console.log(chalk.white('-'), chalk.red('isBotSharded:'), chalk.white(Dashboard.settings.isBotSharded));
        console.log(chalk.white('-'), chalk.red('Client Secret:'), chalk.white(Dashboard.settings.clientSecret));
        console.log(chalk.white('-'), chalk.red('Callback Url:'), chalk.white(Dashboard.settings.callbackURL));
        console.log(chalk.white('-'), chalk.red('DBM Network:'), chalk.white('https://discord.gg/3QxkZPK'));
        console.log(chalk.white('-', chalk.grey('Original by: Great Plains Modding')));
        console.log(chalk.white('-', chalk.grey('Version by: Gii and Alex')));
        console.log(
          '-------------------------------------------------------------------------------------------------',
        );
        configErrors.forEach((error) => {
          console.log(chalk.white('- Error:'), chalk.red(error));
        });
        console.log(
          '-------------------------------------------------------------------------------------------------',
        );
        return;
      }

      // Dashboard init
      Dashboard.appSettings();
      Dashboard.passport();
      Dashboard.loginRoute();
      Dashboard.loadMods();

      // Initialize giveaway event handlers if available
      try {
        const giveawayEvents = require(require('path').join(__dirname, 'dashboard_EXT', 'tools', 'giveaway_events'));
        if (giveawayEvents && typeof giveawayEvents.initializeGiveawayEvents === 'function') {
          giveawayEvents.initializeGiveawayEvents(DBM);
          console.log('[Dashboard] Giveaway event handlers initialized');
        }
      } catch (error) {
        // Giveaway events not available, continue normally
      }

      // Load routes and extensions, then start server
      (async () => {
        try {
          await Dashboard.loadRoutes();
          Dashboard.loadExtensions();

          if (!Dashboard.server) {
            const port = Dashboard.secureConfig.get('port') || 3000;
            Dashboard.server = Dashboard.app.listen(port, '0.0.0.0', () => {
              console.log(chalk.green(`[Dashboard] Server successfully bound to port ${port}`));
              Dashboard.onReady();
            });
            Dashboard.server.on('error', (err) => {
              console.error(chalk.red('❌ Dashboard failed to start on port'), port, ':', err.message);
              if (err.code === 'EADDRINUSE') {
                console.error(
                  chalk.red(`Port ${port} is already in use. Please check if another process is using this port.`),
                );
              }
            });
          }
        } catch (error) {
          console.error(chalk.red('[Dashboard] Error during initialization:'), error);
        }
      })();

      dashboardOnReady.apply(this, arguments);
    };
  },
};
