'use strict';

let giveawayUtils = null;
try {
  giveawayUtils = require('../../../../tools/giveaway_utils');
} catch (error) {
  console.warn('[Giveaways Settings Route] Giveaway utils not available:', error.message);
}

module.exports = {
  init: async (DBM, Dashboard) => {
    if (!giveawayUtils) {
      return;
    }

    // Get settings for server
    Dashboard.app.get('/api/giveaways/settings/:serverId', Dashboard.checkAuth, async (req, res) => {
      try {
        if (!giveawayUtils.isGiveawaySystemAvailable()) {
          return res.json({ success: true, data: giveawayUtils.getDefaultSettings() });
        }
        const serverId = req.params.serverId;
        const settings = giveawayUtils.getServerSettings(serverId);
        res.json({ success: true, data: settings });
      } catch (error) {
        console.error('[Giveaways Settings API] Error getting settings:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch settings' });
      }
    });

    // Update settings
    Dashboard.app.put('/api/giveaways/settings/:serverId', Dashboard.checkAuth, async (req, res) => {
      try {
        if (!giveawayUtils.isGiveawaySystemAvailable()) {
          giveawayUtils.ensureGiveawayDirectory();
        }
        const serverId = req.params.serverId;
        const settings = req.body;
        const saved = giveawayUtils.saveServerSettings(serverId, settings);
        if (saved) {
          res.json({ success: true, data: giveawayUtils.getServerSettings(serverId) });
        } else {
          res.status(500).json({ success: false, error: 'Failed to save settings' });
        }
      } catch (error) {
        console.error('[Giveaways Settings API] Error updating settings:', error);
        res.status(500).json({ success: false, error: 'Failed to update settings' });
      }
    });
  },

  run: async (DBM, req, res, Dashboard) => {
    const basePath = req.basePath || '';
    const user = req.user || null;
    const serverId = req.query.serverId || req.query.server || null;

    if (!user) {
      return res.redirect(`${basePath}/auth/discord`);
    }

    // Redirect to server panel if serverId is provided
    if (serverId) {
      return res.redirect(`${basePath}/dashboard/@me/servers/${serverId}`);
    }

    // If no serverId, redirect to first available server
    const bot = DBM.Bot && DBM.Bot.bot ? DBM.Bot.bot : null;
    let redirectServerId = null;

    if (bot) {
      try {
        const userServers = bot.guilds.cache
          .filter((guild) => {
            const member = guild.members.cache.get(user.id);
            return member && member.permissions.has('MANAGE_GUILD');
          })
          .array();

        if (userServers.length > 0) {
          redirectServerId = userServers[0].id;
          return res.redirect(`${basePath}/dashboard/@me/servers/${redirectServerId}`);
        }
      } catch (error) {
        console.warn('[Giveaways Settings Route] Error fetching user servers:', error);
      }
    }

    // Fallback to dashboard
    return res.redirect(`${basePath}/dashboard/@me`);
  },
};
