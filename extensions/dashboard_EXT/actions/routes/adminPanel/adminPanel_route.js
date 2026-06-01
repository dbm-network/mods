const fs = require('fs');
const path = require('path');
const disabledCommandsManager = require('../../../tools/disabled-commands-manager');

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

module.exports = {
  // ----------------------------------------------------------------------------------
  // Ran when the dashboard if first started
  init: async (DBM, Dashboard) => {
    Dashboard.app.post('/api/admin/execute/:command', (req, res) => {
      const owners = normalizeOwnerIds(Dashboard.settings.ownerIds || Dashboard.settings.owner);
      if (!req.user) return res.redirect('/dashboard/@me');
      if (!owners.includes(String(req.user.id))) {
        res.redirect('/dashboard/@me');
        return {
          skipRender: true,
        };
      }

      const commandName = (req.params.command || '').toLowerCase().replace(/ /g, '_');
      const command = Dashboard.Actions.mods.get(commandName);
      if (command && commandName) {
        const modPath = path.join(__dirname, '../../mods', commandName, command.scriptFile);
        const commandFound = require(modPath);
        if (!commandFound) return res.status(500);
        req.user.commandRan = true;

        if (disabledCommandsManager.isModDisabled(command.name || commandName)) {
          req.user.commandExecuted = 'This dashboard module has been disabled by the bot owner.';
          return res.redirect('/admin');
        }

        req.user.commandExecuted = commandFound.run(DBM, req, res, Dashboard);
        res.redirect('/admin');
      }
    });

    Dashboard.app.post('/api/admin/commands/toggle', (req, res) => {
      const owners = normalizeOwnerIds(Dashboard.settings.ownerIds || Dashboard.settings.owner);
      if (!req.user) return res.redirect('/dashboard/@me');
      if (!owners.includes(String(req.user.id))) {
        res.redirect('/dashboard/@me');
        return {
          skipRender: true,
        };
      }

      const body = req.body || {};
      const rawCommandName = typeof body.commandName === 'string' ? body.commandName : '';
      const action = typeof body.action === 'string' ? body.action.toLowerCase() : '';
      let normalizedKey = disabledCommandsManager.normalizeKey(rawCommandName);

      if (!normalizedKey) {
        return res.redirect('/admin?commandsUpdated=0');
      }

      let command = Dashboard.Actions.mods.get(normalizedKey);
      if (!command) {
        Dashboard.Actions.mods.forEach((mod, key) => {
          if (!command && disabledCommandsManager.normalizeKey(mod.name) === normalizedKey) {
            command = mod;
            normalizedKey = key;
          }
        });
      }

      if (!command) {
        return res.redirect('/admin?commandsUpdated=0');
      }

      const shouldDisable = action === 'disable';

      try {
        disabledCommandsManager.setModStatus(command.name || normalizedKey, shouldDisable, req.user.id);
        const statusParam = shouldDisable ? 'disabled' : 'enabled';
        return res.redirect(
          `/admin?commandsUpdated=1&command=${encodeURIComponent(normalizedKey)}&status=${statusParam}`,
        );
      } catch (error) {
        console.error('[AdminPanel] Failed to update dashboard mod status:', error.message);
        return res.redirect('/admin?commandsUpdated=0');
      }
    });
  },
  // ----------------------------------------------------------------------------------

  run: async (DBM, req, res, Dashboard) => {
    const ownerConfig = Dashboard.settings.ownerIds || Dashboard.settings.owner || [];
    const ownerIds = Array.isArray(ownerConfig)
      ? ownerConfig.map((id) => String(id).trim()).filter(Boolean)
      : String(ownerConfig || '')
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean);
    const currentUserId = req.user && req.user.id ? String(req.user.id) : null;
    const isOwner = currentUserId ? ownerIds.includes(currentUserId) : false;

    if (!isOwner) {
      res.redirect('/dashboard/@me');
      return {
        skipRender: true,
      };
    }

    // Get contact webhook URL from secure config for display
    const contactWebhook =
      Dashboard.secureConfig && typeof Dashboard.secureConfig.get === 'function'
        ? Dashboard.secureConfig.get('contactWebhook') || ''
        : '';

    // Load leaderboard config for admin panel
    let leaderboardConfig = {
      enabled: false,
      database: {
        host: 'localhost',
        user: '',
        database: '',
        password: '',
        passwordSet: false,
      },
      tablesCreated: false,
    };

    try {
      // Load from main config.json
      const configFile = path.join(__dirname, '../../../config.json');
      if (fs.existsSync(configFile)) {
        const fullConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));
        const config = fullConfig.leaderboard || {};
        leaderboardConfig = {
          enabled: config.enabled || false,
          database: {
            host: config.database?.host || 'localhost',
            user: config.database?.user || '',
            database: config.database?.database || '',
            password: '', // Never send password to frontend
            passwordSet: Boolean(config.database?.password && config.database.password.length > 0),
          },
          tablesCreated: config.tablesCreated || false,
        };
      }
    } catch (error) {
      console.error('[AdminPanel] Error loading leaderboard config:', error.message);
      // Use default values already set above
    }

    // Get mods and extensions for admin panel
    const disabledModKeys = new Set(disabledCommandsManager.listDisabledMods());
    const sections = [];
    const panelMods = [];
    Dashboard.Actions.mods.forEach((mod) => {
      if (mod.dashboardMod) {
        const modKey = disabledCommandsManager.normalizeKey(mod.name || mod.sectionID || '');
        if (disabledModKeys.has(modKey)) {
          return;
        }
        panelMods.push(mod);
        sections.push(mod.section);
      }
    });

    const extensions = [];
    Dashboard.Actions.extensions.forEach((extension) => {
      if (extension.dashboardMod) {
        extensions.push(extension);
      }
    });

    // Check if giveaway system is available
    let giveawaySystemAvailable = false;
    try {
      const giveawayUtilsPath = require('path').join(__dirname, '..', '..', '..', 'tools', 'giveaway_utils');
      const giveawayUtils = require(giveawayUtilsPath);
      if (giveawayUtils && typeof giveawayUtils.isGiveawaySystemAvailable === 'function') {
        giveawaySystemAvailable = giveawayUtils.isGiveawaySystemAvailable();
      }
    } catch (error) {
      // Giveaway system not available, continue normally
    }

    return {
      settings: {
        ...Dashboard.settings,
        contactWebhook,
      },
      leaderboardConfig,
      mods: panelMods,
      extensions,
      disabledModKeys: Array.from(disabledModKeys),
      path: require('path'),
      dirname: __dirname,
      req,
      client: DBM.Bot.bot,
      giveawaySystemAvailable,
    };
  },
};
