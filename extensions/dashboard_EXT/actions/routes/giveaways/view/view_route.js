'use strict';

let giveawayUtils = null;
try {
  giveawayUtils = require('../../../../tools/giveaway_utils');
} catch (error) {
  console.warn('[Giveaways View Route] Giveaway utils not available:', error.message);
}

module.exports = {
  init: async (DBM, Dashboard) => {
    // No additional API endpoints needed - using existing ones
  },

  run: async (DBM, req, res, Dashboard) => {
    const basePath = req.basePath || '';
    const user = req.user || null;
    const giveawayId = req.params.id;

    if (!user) {
      return res.redirect(`${basePath}/auth/discord`);
    }

    if (!giveawayId) {
      return res.redirect(`${basePath}/giveaways`);
    }

    // Get giveaway
    let giveaway = null;
    if (giveawayUtils && giveawayUtils.isGiveawaySystemAvailable()) {
      try {
        giveaway = giveawayUtils.getGiveawayById(giveawayId);
      } catch (error) {
        console.warn('[Giveaways View Route] Error loading giveaway:', error.message);
      }
    }

    if (!giveaway) {
      return res.redirect(`${basePath}/giveaways`);
    }

    // Get user's servers
    let userServers = [];
    try {
      if (user.guilds && Array.isArray(user.guilds)) {
        userServers = user.guilds.filter((g) => g && (g.permissions & 0x20) === 0x20);
      }
    } catch (error) {
      console.warn('[Giveaways View Route] Error getting user servers:', error.message);
    }

    // Check if user has access to this giveaway's server
    const hasAccess = userServers.some((server) => server.id === giveaway.serverId);
    if (!hasAccess) {
      return res.redirect(`${basePath}/giveaways`);
    }

    const seo = Dashboard.settings.seo || {};
    const navItems = Dashboard.settings.navItems || [];
    const footer = Dashboard.settings.footer || {};

    return {
      navItems,
      footer,
      seo: {
        title: `Giveaway: ${giveaway.prize || giveaway.name || 'View'} - ${
          seo.defaultTitle || 'News Targeted Bot Dashboard'
        }`,
        description: `View and manage giveaway: ${giveaway.prize || giveaway.name || 'Giveaway'}`,
        keywords: seo.defaultKeywords,
        image: seo.defaultImage,
        canonical: seo.canonicalBase ? `${seo.canonicalBase.replace(/\/$/, '')}/giveaways/${giveawayId}` : null,
      },
      client: DBM.Bot.bot,
      user,
      giveaway,
      giveawaySystemAvailable: giveawayUtils ? giveawayUtils.isGiveawaySystemAvailable() : false,
    };
  },
};
