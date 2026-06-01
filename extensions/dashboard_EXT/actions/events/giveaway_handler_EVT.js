'use strict';

/**
 * Giveaway Event Handler
 * DBM Event mod for handling giveaway reactions and auto-ending
 */

module.exports = {
  name: 'Giveaway Handler',
  displayName: 'Giveaway Handler',
  isEvent: true,

  fields: ['Event Type:', 'Reaction Emoji (for reaction events):'],

  mod(DBM) {
    const { Bot } = DBM;

    // Try to load giveaway events
    let giveawayEvents = null;
    try {
      giveawayEvents = require('../../tools/giveaway_events');
    } catch (error) {
      console.warn('[Giveaway Handler Event] Giveaway events not available:', error.message);
      return; // Giveaway system not available, skip event registration
    }

    // Initialize giveaway event handlers
    const { onReady } = Bot;
    Bot.onReady = function giveawayHandlerOnReady(...params) {
      try {
        if (giveawayEvents) {
          giveawayEvents.initializeGiveawayEvents(DBM);
          console.log('[Giveaway Handler] Giveaway event handlers initialized');
        }
      } catch (error) {
        console.error('[Giveaway Handler] Error initializing events:', error);
      }
      onReady.apply(this, ...params);
    };
  },
};
