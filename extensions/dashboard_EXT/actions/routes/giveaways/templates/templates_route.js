'use strict';

let giveawayUtils = null;
try {
  giveawayUtils = require('../../../../tools/giveaway_utils');
} catch (error) {
  console.warn('[Giveaways Templates Route] Giveaway utils not available:', error.message);
}

module.exports = {
  init: async (DBM, Dashboard) => {
    if (!giveawayUtils) {
      return;
    }

    // Get templates for server
    Dashboard.app.get('/api/giveaways/templates/:serverId', Dashboard.checkAuth, async (req, res) => {
      try {
        if (!giveawayUtils.isGiveawaySystemAvailable()) {
          return res.json({ success: true, data: [] });
        }
        const serverId = req.params.serverId;
        const templates = giveawayUtils.getServerTemplates(serverId);
        res.json({ success: true, data: templates });
      } catch (error) {
        console.error('[Giveaways Templates API] Error getting templates:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch templates' });
      }
    });

    // Get template by ID
    Dashboard.app.get('/api/giveaways/templates/id/:id', Dashboard.checkAuth, async (req, res) => {
      try {
        if (!giveawayUtils.isGiveawaySystemAvailable()) {
          return res.status(404).json({ success: false, error: 'Giveaway system not available' });
        }
        const template = giveawayUtils.getTemplateById(req.params.id);
        if (!template) {
          return res.status(404).json({ success: false, error: 'Template not found' });
        }
        res.json({ success: true, data: template });
      } catch (error) {
        console.error('[Giveaways Templates API] Error getting template:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch template' });
      }
    });

    // Create template
    Dashboard.app.post('/api/giveaways/templates', Dashboard.checkAuth, async (req, res) => {
      try {
        if (!giveawayUtils.isGiveawaySystemAvailable()) {
          giveawayUtils.ensureGiveawayDirectory();
        }
        const template = req.body;
        if (!template.id) {
          template.id = giveawayUtils.generateId();
        }
        template.createdAt = template.createdAt || Date.now();
        const saved = giveawayUtils.saveTemplate(template);
        if (saved) {
          res.json({ success: true, data: template });
        } else {
          res.status(500).json({ success: false, error: 'Failed to save template' });
        }
      } catch (error) {
        console.error('[Giveaways Templates API] Error creating template:', error);
        res.status(500).json({ success: false, error: `Failed to create template: ${error.message}` });
      }
    });

    // Update template
    Dashboard.app.put('/api/giveaways/templates/:id', Dashboard.checkAuth, async (req, res) => {
      try {
        if (!giveawayUtils.isGiveawaySystemAvailable()) {
          return res.status(404).json({ success: false, error: 'Giveaway system not available' });
        }
        const template = giveawayUtils.getTemplateById(req.params.id);
        if (!template) {
          return res.status(404).json({ success: false, error: 'Template not found' });
        }
        Object.assign(template, req.body);
        template.updatedAt = Date.now();
        const saved = giveawayUtils.saveTemplate(template);
        if (saved) {
          res.json({ success: true, data: template });
        } else {
          res.status(500).json({ success: false, error: 'Failed to update template' });
        }
      } catch (error) {
        console.error('[Giveaways Templates API] Error updating template:', error);
        res.status(500).json({ success: false, error: 'Failed to update template' });
      }
    });

    // Delete template
    Dashboard.app.delete('/api/giveaways/templates/:id', Dashboard.checkAuth, async (req, res) => {
      try {
        if (!giveawayUtils.isGiveawaySystemAvailable()) {
          return res.status(404).json({ success: false, error: 'Giveaway system not available' });
        }
        const deleted = giveawayUtils.deleteTemplate(req.params.id);
        if (deleted) {
          res.json({ success: true });
        } else {
          res.status(500).json({ success: false, error: 'Failed to delete template' });
        }
      } catch (error) {
        console.error('[Giveaways Templates API] Error deleting template:', error);
        res.status(500).json({ success: false, error: 'Failed to delete template' });
      }
    });
  },

  run: async (DBM, req, res, Dashboard) => {
    const basePath = req.basePath || '';
    const user = req.user || null;
    const serverId = req.query.serverId || null;

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
        console.warn('[Giveaways Templates Route] Error fetching user servers:', error);
      }
    }

    // Fallback to dashboard
    return res.redirect(`${basePath}/dashboard/@me`);
  },
};
