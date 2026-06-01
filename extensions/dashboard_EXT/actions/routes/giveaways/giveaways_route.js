'use strict';

let giveawayUtils = null;
try {
  giveawayUtils = require('../../../tools/giveaway_utils');
} catch (error) {
  // Giveaway utils not available, will handle gracefully
  console.warn('[Giveaways Route] Giveaway utils not available:', error.message);
}

module.exports = {
  init: async (DBM, Dashboard) => {
    if (!giveawayUtils) {
      // Giveaway system not available, skip API endpoints
      return;
    }
    // API endpoints for giveaways
    Dashboard.app.get('/api/giveaways/:serverId', Dashboard.checkAuth, async (req, res) => {
      try {
        if (!giveawayUtils || !giveawayUtils.isGiveawaySystemAvailable()) {
          return res.json({ success: true, data: [] });
        }
        const serverId = req.params.serverId;
        const giveaways = giveawayUtils.getServerGiveaways(serverId);
        res.json({ success: true, data: giveaways });
      } catch (error) {
        console.error('[Giveaways API] Error getting giveaways:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch giveaways' });
      }
    });

    Dashboard.app.get('/api/giveaways/id/:id', Dashboard.checkAuth, async (req, res) => {
      try {
        if (!giveawayUtils || !giveawayUtils.isGiveawaySystemAvailable()) {
          return res.status(404).json({ success: false, error: 'Giveaway system not available' });
        }
        const giveaway = giveawayUtils.getGiveawayById(req.params.id);
        if (!giveaway) {
          return res.status(404).json({ success: false, error: 'Giveaway not found' });
        }
        res.json({ success: true, data: giveaway });
      } catch (error) {
        console.error('[Giveaways API] Error getting giveaway:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch giveaway' });
      }
    });

    Dashboard.app.post('/api/giveaways', Dashboard.checkAuth, async (req, res) => {
      try {
        if (!giveawayUtils) {
          return res.status(503).json({ success: false, error: 'Giveaway system not available' });
        }
        if (!giveawayUtils.isGiveawaySystemAvailable()) {
          giveawayUtils.ensureGiveawayDirectory();
        }
        const giveaway = req.body;
        if (!giveaway.id) {
          giveaway.id = giveawayUtils.generateId();
        }
        giveaway.createdAt = giveaway.createdAt || Date.now();
        const saved = giveawayUtils.saveGiveaway(giveaway);
        if (saved) {
          res.json({ success: true, data: giveaway });
        } else {
          res.status(500).json({ success: false, error: 'Failed to save giveaway' });
        }
      } catch (error) {
        console.error('[Giveaways API] Error creating giveaway:', error);
        res.status(500).json({ success: false, error: 'Failed to create giveaway' });
      }
    });

    Dashboard.app.put('/api/giveaways/:id', Dashboard.checkAuth, async (req, res) => {
      try {
        if (!giveawayUtils || !giveawayUtils.isGiveawaySystemAvailable()) {
          return res.status(404).json({ success: false, error: 'Giveaway system not available' });
        }
        const giveaway = giveawayUtils.getGiveawayById(req.params.id);
        if (!giveaway) {
          return res.status(404).json({ success: false, error: 'Giveaway not found' });
        }

        const updateData = req.body;

        // Update basic fields
        if (updateData.prize !== undefined) giveaway.prize = updateData.prize;
        if (updateData.winners !== undefined) giveaway.winners = updateData.winners;
        if (updateData.duration !== undefined) {
          giveaway.duration = updateData.duration;
          // Recalculate end time if duration changed
          if (giveaway.duration && !giveaway.ended) {
            const parseDuration = (duration) => {
              if (!duration || typeof duration !== 'string') return 0;
              const match = duration.match(/^(\d+)([smhd])$/i);
              if (!match) return 0;
              const value = parseInt(match[1], 10);
              const unit = match[2].toLowerCase();
              const multipliers = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
              return value * (multipliers[unit] || 0);
            };
            const durationMs = parseDuration(giveaway.duration);
            if (durationMs > 0 && giveaway.started && giveaway.createdAt) {
              giveaway.endTime = giveaway.createdAt + durationMs;
            }
          }
        }
        if (updateData.channelId !== undefined) giveaway.channelId = updateData.channelId;
        if (updateData.description !== undefined) giveaway.description = updateData.description;
        if (updateData.embedColor !== undefined) giveaway.embedColor = updateData.embedColor;
        if (updateData.reactionEmoji !== undefined) giveaway.reactionEmoji = updateData.reactionEmoji;
        if (updateData.hostedBy !== undefined) giveaway.hostedBy = updateData.hostedBy;
        if (updateData.winnerRole !== undefined) giveaway.winnerRole = updateData.winnerRole;
        if (updateData.dmWinners !== undefined) giveaway.dmWinners = updateData.dmWinners;
        if (updateData.dmHost !== undefined) giveaway.dmHost = updateData.dmHost;
        if (updateData.dmMessage !== undefined) giveaway.dmMessage = updateData.dmMessage;
        if (updateData.dmMessageType !== undefined) giveaway.dmMessageType = updateData.dmMessageType;
        if (updateData.pingHostInDm !== undefined) giveaway.pingHostInDm = updateData.pingHostInDm;
        if (updateData.serverMessageType !== undefined) giveaway.serverMessageType = updateData.serverMessageType;
        if (updateData.pingHostInServer !== undefined) giveaway.pingHostInServer = updateData.pingHostInServer;
        if (updateData.notificationRole !== undefined) giveaway.notificationRole = updateData.notificationRole;
        if (updateData.thumbnail !== undefined) giveaway.thumbnail = updateData.thumbnail;
        if (updateData.image !== undefined) giveaway.image = updateData.image;
        if (updateData.extraEntries !== undefined) giveaway.extraEntries = updateData.extraEntries;
        if (updateData.requirements !== undefined) giveaway.requirements = updateData.requirements;
        if (updateData.isDrop !== undefined) giveaway.isDrop = updateData.isDrop;
        if (updateData.entryConfirmMessage !== undefined) giveaway.entryConfirmMessage = updateData.entryConfirmMessage;
        if (updateData.entryDenyMessage !== undefined) giveaway.entryDenyMessage = updateData.entryDenyMessage;
        if (updateData.entryRemoveMessage !== undefined) giveaway.entryRemoveMessage = updateData.entryRemoveMessage;
        if (updateData.persistEntries !== undefined) giveaway.persistEntries = updateData.persistEntries;
        if (updateData.removeEntriesOnEdit !== undefined) {
          giveaway.removeEntriesOnEdit = updateData.removeEntriesOnEdit;
          // If removeEntriesOnEdit is true, clear entries
          if (updateData.removeEntriesOnEdit && giveaway.entries) {
            giveaway.entries = [];
          }
        }
        if (updateData.createWinnersThread !== undefined) giveaway.createWinnersThread = updateData.createWinnersThread;
        if (updateData.winnersThreadType !== undefined) giveaway.winnersThreadType = updateData.winnersThreadType;
        if (updateData.winnersThreadMessage !== undefined)
          giveaway.winnersThreadMessage = updateData.winnersThreadMessage;
        if (updateData.winnersThreadCloseDuration !== undefined)
          giveaway.winnersThreadCloseDuration = updateData.winnersThreadCloseDuration;
        if (updateData.winnerRoleRemoveDuration !== undefined)
          giveaway.winnerRoleRemoveDuration = updateData.winnerRoleRemoveDuration;

        giveaway.updatedAt = Date.now();
        const saved = giveawayUtils.saveGiveaway(giveaway);
        if (saved) {
          res.json({ success: true, data: giveaway });
        } else {
          res.status(500).json({ success: false, error: 'Failed to update giveaway' });
        }
      } catch (error) {
        console.error('[Giveaways API] Error updating giveaway:', error);
        res.status(500).json({ success: false, error: 'Failed to update giveaway' });
      }
    });

    Dashboard.app.delete('/api/giveaways/:id', Dashboard.checkAuth, async (req, res) => {
      try {
        if (!giveawayUtils || !giveawayUtils.isGiveawaySystemAvailable()) {
          return res.status(404).json({ success: false, error: 'Giveaway system not available' });
        }
        const deleted = giveawayUtils.deleteGiveaway(req.params.id);
        if (deleted) {
          res.json({ success: true });
        } else {
          res.status(500).json({ success: false, error: 'Failed to delete giveaway' });
        }
      } catch (error) {
        console.error('[Giveaways API] Error deleting giveaway:', error);
        res.status(500).json({ success: false, error: 'Failed to delete giveaway' });
      }
    });

    Dashboard.app.post('/api/giveaways/:id/end', Dashboard.checkAuth, async (req, res) => {
      try {
        if (!giveawayUtils || !giveawayUtils.isGiveawaySystemAvailable()) {
          return res.status(404).json({ success: false, error: 'Giveaway system not available' });
        }
        const giveaway = giveawayUtils.getGiveawayById(req.params.id);
        if (!giveaway) {
          return res.status(404).json({ success: false, error: 'Giveaway not found' });
        }

        // Use the giveaway_events.js endGiveaway function for proper handling
        let giveawayEvents = null;
        try {
          giveawayEvents = require('../../../tools/giveaway_events');
        } catch (error) {
          console.warn('[Giveaways API] Giveaway events not available:', error.message);
        }

        if (giveawayEvents && typeof giveawayEvents.endGiveaway === 'function') {
          await giveawayEvents.endGiveaway(DBM, giveaway);
          res.json({ success: true, data: giveaway });
        } else {
          // Fallback: simple end
          giveaway.ended = true;
          giveaway.endedAt = Date.now();
          const saved = giveawayUtils.saveGiveaway(giveaway);
          if (saved) {
            res.json({ success: true, data: giveaway });
          } else {
            res.status(500).json({ success: false, error: 'Failed to end giveaway' });
          }
        }
      } catch (error) {
        console.error('[Giveaways API] Error ending giveaway:', error);
        res.status(500).json({ success: false, error: 'Failed to end giveaway' });
      }
    });
  },

  run: async (DBM, req, res, Dashboard) => {
    const basePath = req.basePath || '';

    // Redirect to server panel - giveaways are now managed per-server
    if (!req.user) {
      return res.redirect(`${basePath}/auth/discord`);
    }

    // Get user's first server with MANAGE_GUILD permission
    const bot = DBM.Bot && DBM.Bot.bot ? DBM.Bot.bot : null;
    let redirectServerId = null;

    if (bot && req.user) {
      try {
        const userServers = bot.guilds.cache
          .filter((guild) => {
            const member = guild.members.cache.get(req.user.id);
            return member && member.permissions.has('MANAGE_GUILD');
          })
          .array();

        if (userServers.length > 0) {
          redirectServerId = userServers[0].id;
        }
      } catch (error) {
        console.warn('[Giveaways Route] Error fetching user servers:', error);
      }
    }

    // Redirect to server panel or dashboard
    if (redirectServerId) {
      return res.redirect(`${basePath}/dashboard/@me/servers/${redirectServerId}`);
    }
    return res.redirect(`${basePath}/dashboard/@me`);
  },
};
