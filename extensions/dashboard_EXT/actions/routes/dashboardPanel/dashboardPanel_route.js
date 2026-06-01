const disabledCommandsManager = require('../../../tools/disabled-commands-manager');
const serverPrefixManager = require('../../../tools/server-prefix-manager');
// Use dynamic require for version compatibility (supports both v13 and v14)
let ChannelType;
try {
  const DiscordJS = require('discord.js');
  ChannelType = DiscordJS.ChannelType;
} catch (e) {
  // Fallback if ChannelType not available
  ChannelType = null;
}

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
    Dashboard.app.post('/api/:serverID/execute/:command', async (req, res) => {
      const basePath = req.basePath || '';

      if (!req.user) {
        return res.redirect(`${basePath}/dashboard/@me`);
      }

      const commandName = (req.params.command || '').toLowerCase().replace(/ /g, '_');
      const command = Dashboard.Actions.mods.get(commandName);

      if (!command || !commandName) {
        console.warn(`[DashboardPanel] Unknown dashboard mod requested: ${commandName}`);
        return res.redirect(`${basePath}/dashboard/@me/servers/${req.params.serverID}`);
      }

      if (!command.dashboardMod) {
        console.warn(
          `[DashboardPanel] Attempt to execute admin-only mod "${commandName}" from server dashboard by user ${
            req.user?.id || 'unknown'
          }`,
        );
        req.user.commandExecuted = 'This module is only available from the admin panel.';
        return res.redirect(`${basePath}/dashboard/@me/servers/${req.params.serverID}`);
      }

      if (disabledCommandsManager.isModDisabled(command.name || commandName)) {
        req.user.commandExecuted = 'This dashboard module has been disabled by the bot owner.';
        return res.redirect(`${basePath}/dashboard/@me/servers/${req.params.serverID}`);
      }

      try {
        const commandPath = require('path').join(__dirname, '../../mods', commandName, command.scriptFile);
        const resolvedPath = require.resolve(commandPath);

        if (require.cache[resolvedPath]) {
          delete require.cache[resolvedPath];
        }

        const commandModule = require(resolvedPath);

        if (!commandModule?.run || typeof commandModule.run !== 'function') {
          console.error(`[DashboardPanel] Invalid dashboard mod: ${commandName} at ${commandPath}`);
          req.user.commandExecuted = 'Command module is invalid or missing a run() function.';
        } else {
          req.user.commandRan = true;

          const guildId = req.params.serverID;
          const fallbackGuild = DBM?.Bot?.bot?.guilds?.cache?.get(guildId);
          let guild = fallbackGuild;

          if (!guild && guildId) {
            try {
              guild = await DBM.Bot.bot.guilds.fetch(guildId);
            } catch (guildError) {
              console.warn(`[DashboardPanel] Unable to fetch guild ${guildId}:`, guildError?.message || guildError);
            }
          }

          if (!req.body || typeof req.body !== 'object') {
            req.body = {};
          }

          if (!req.body.server && guildId) {
            req.body.server = guildId;
          }

          if (!req.body.serverType) {
            req.body.serverType = 'id';
          }

          if (!req.body.channelType) {
            req.body.channelType = 'id';
          }

          const result = await Promise.resolve(commandModule.run(DBM, req, res, Dashboard, guild));

          req.user.commandExecuted = result || 'Command executed successfully.';
        }
      } catch (error) {
        console.error('[DashboardPanel] Error executing dashboard mod:', {
          command: commandName,
          error,
        });
        req.user.commandExecuted = 'An unexpected error occurred while executing the command. Please review the logs.';
      }

      return res.redirect(`${basePath}/dashboard/@me/servers/${req.params.serverID}`);
    });
  },
  // ----------------------------------------------------------------------------------

  run: (DBM, req, res, Dashboard) => {
    const server = DBM.Bot.bot.guilds.cache.get(req.params.serverID);
    if (!server) {
      res.redirect(
        `https://discord.com/oauth2/authorize?client_id=${DBM.Bot.bot.user.id}&scope=bot&permissions=2146958591&guild_id=${req.params.serverID}`,
      );
      return {
        skipRender: true,
      };
    }
    console.log(server.memberCount);
    const owners = normalizeOwnerIds(Dashboard.settings.ownerIds || Dashboard.settings.owner);
    if (!owners.includes(String(req.user.id))) {
      res.redirect('/dashboard/@me');
      return {
        skipRender: true,
      };
    }

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

    const mainPrefix =
      DBM?.Files?.data?.settings?.tag && DBM.Files.data.settings.tag.trim().length
        ? DBM.Files.data.settings.tag.trim()
        : Dashboard.settings?.botSettings?.commandPrefix || serverPrefixManager.DEFAULT_PREFIX;

    // Get server prefix - this works with both dashboard integration and server_prefixes_EXT.js
    // Both use the same serverSettings.json file, so they're automatically compatible
    let serverPrefix = serverPrefixManager.getPrefix(server.id, mainPrefix);

    // Use compatibility module to check extension's in-memory storage if available
    try {
      const compatibilityModule = require('../../../tools/server-prefix-compatibility');
      if (compatibilityModule && compatibilityModule.getPrefix) {
        serverPrefix = compatibilityModule.getPrefix(server.id, mainPrefix);
      }
    } catch (error) {
      // Compatibility module not available or error, fall back to file-based prefix
      // If server_prefixes_EXT.js is loaded, it may have set guild.prefix directly
      try {
        const bot = DBM.Bot && DBM.Bot.bot ? DBM.Bot.bot : null;
        if (bot && bot.guilds) {
          const guild = bot.guilds.cache.get(server.id);
          if (guild && guild.prefix && guild.prefix !== mainPrefix) {
            // Extension has set a custom prefix, use that
            serverPrefix = guild.prefix;
          }
        }
      } catch (botError) {
        // Fall back to file-based prefix if extension check fails
      }
    }

    const slashCommands = Array.isArray(DBM?.Files?.data?.commands)
      ? DBM.Files.data.commands
          .filter((cmd) => cmd && String(cmd.comType) === '4')
          .map((cmd) => ({
            _id: cmd._id,
            name: cmd.name,
            description: cmd.description || 'No description provided.',
            parameters: cmd.parameters || [],
          }))
          .slice(0, 100)
      : [];

    // Check if giveaway system is available
    let giveawaySystemAvailable = false;
    const giveawayData = {
      giveaways: { active: [], scheduled: [], ended: [] },
      templates: [],
      settings: null,
      userServers: [],
      defaultSettings: {},
    };

    try {
      // Path: dashboardPanel/ -> routes/ -> actions/ -> dashboard_EXT/ -> tools/
      const giveawayUtilsPath = require('path').join(__dirname, '..', '..', '..', 'tools', 'giveaway_utils');
      const giveawayUtils = require(giveawayUtilsPath);
      if (giveawayUtils && typeof giveawayUtils.isGiveawaySystemAvailable === 'function') {
        giveawaySystemAvailable = giveawayUtils.isGiveawaySystemAvailable();
        console.log('[DashboardPanel] Giveaway system available check:', giveawaySystemAvailable);

        if (giveawaySystemAvailable) {
          try {
            // Get giveaways for this server
            const allGiveaways = giveawayUtils.getServerGiveaways(server.id);
            const now = Date.now();

            giveawayData.giveaways.active = allGiveaways.filter(
              (g) => g && !g.ended && (!g.endTime || g.endTime > now) && g.status !== 'ended',
            );
            giveawayData.giveaways.scheduled = allGiveaways.filter(
              (g) => g && (g.status === 'scheduled' || (g.scheduledStart && g.scheduledStart > now)),
            );
            giveawayData.giveaways.ended = allGiveaways
              .filter((g) => g && (g.ended || g.status === 'ended' || (g.endTime && g.endTime <= now)))
              .slice(0, 10); // Limit to 10 most recent

            // Get templates for this server
            giveawayData.templates = giveawayUtils.getServerTemplates(server.id);

            // Get settings for this server
            giveawayData.settings = giveawayUtils.getServerSettings(server.id);
            giveawayData.defaultSettings = giveawayUtils.getDefaultSettings();

            // Get user's servers for create form
            if (req.user && req.user.guilds && Array.isArray(req.user.guilds)) {
              giveawayData.userServers = req.user.guilds.filter(
                (g) => g && (g.permissions & 0x20) === 0x20, // MANAGE_GUILD
              );
            }
          } catch (error) {
            console.warn('[DashboardPanel] Error loading giveaway data:', error.message);
            giveawaySystemAvailable = false;
          }
        }
      }
    } catch (error) {
      // Giveaway system not available, continue normally
      console.warn('[DashboardPanel] Giveaway system check failed:', error.message);
      giveawaySystemAvailable = false;
    }

    console.log('[DashboardPanel] Final giveawaySystemAvailable:', giveawaySystemAvailable, 'Server ID:', server?.id);

    // Load server settings (leveling, giveaway toggles)
    let serverSettings = {};
    try {
      const serverSettingsManager = require('../../../tools/server-settings-manager');
      serverSettings = serverSettingsManager.getServerSettings(server.id);
    } catch (error) {
      console.warn('[DashboardPanel] Error loading server settings:', error.message);
      serverSettings = { levelingEnabled: false, giveawayEnabled: false };
    }

    const pathModule = require('path');

    return {
      user: req.user,
      settings: Dashboard.settings,
      client: DBM.Bot.bot,
      theme: Dashboard.settings.theme,
      mods: panelMods,
      sections,
      extensions,
      commandData: req.user.commandExecuted,
      path: pathModule,
      dirname: __dirname,
      server,
      commands: DBM.Files.data.commands,
      ownerIds: owners,
      isOwner: true,
      disabledMods: Array.from(disabledModKeys),
      mainPrefix,
      serverPrefix,
      serverChannels: mapServerChannels(server),
      slashCommands,
      commandDispatcher: {
        mode: 'prefix',
      },
      giveawaySystemAvailable,
      giveawayData,
      serverSettings,
      csrfToken: req.csrfToken || res.locals.csrfToken || null,
    };
  },
};

function mapServerChannels(server) {
  try {
    if (!server?.channels?.cache?.size) {
      return [];
    }

    const allowedTypes = new Set([
      ChannelType.GuildText,
      ChannelType.GuildAnnouncement,
      ChannelType.PublicThread,
      ChannelType.PrivateThread,
      ChannelType.AnnouncementThread,
      ChannelType.GuildForum,
      ChannelType.GuildVoice,
      ChannelType.GuildStageVoice,
    ]);

    return Array.from(server.channels.cache.values())
      .filter((channel) => {
        if (!channel) return false;
        if (typeof channel.isTextBased === 'function') {
          return channel.isTextBased();
        }
        return allowedTypes.has(channel.type);
      })
      .sort((a, b) => {
        const aPos = typeof a.rawPosition === 'number' ? a.rawPosition : a.position || 0;
        const bPos = typeof b.rawPosition === 'number' ? b.rawPosition : b.position || 0;
        return aPos - bPos;
      })
      .slice(0, 150)
      .map((channel) => ({
        id: channel.id,
        name: channel.name || `${channel.type} ${channel.id}`,
        type: channel.type,
        isThread: typeof channel.isThread === 'function' ? channel.isThread() : false,
      }));
  } catch (error) {
    console.error('[DashboardPanel] Failed to map server channels:', error.message);
    return [];
  }
}
