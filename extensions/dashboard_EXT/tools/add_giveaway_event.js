'use strict';

/**
 * Helper script to add giveaway event handler to DBM events.json
 * Run this script to add the giveaway event handler to your bot
 */

const fs = require('fs');
const path = require('path');

const EVENTS_FILE = path.join(__dirname, '..', '..', '..', 'data', 'events.json');

function addGiveawayEvent() {
  try {
    // Read existing events
    let events = [];
    if (fs.existsSync(EVENTS_FILE)) {
      const content = fs.readFileSync(EVENTS_FILE, 'utf8');
      events = JSON.parse(content);
      if (!Array.isArray(events)) {
        events = [];
      }
    }

    // Check if giveaway event already exists
    const existingIndex = events.findIndex((evt) => evt && evt.name && evt.name === 'Giveaway Handler');

    const giveawayEvent = {
      _id: `giveaway_handler_${Date.now().toString(36)}`,
      name: 'Giveaway Handler',
      displayName: 'Giveaway Handler',
      isEvent: true,
      temp: '',
      temp2: '',
      actions: [], // Event doesn't need actions, it handles everything internally
    };

    if (existingIndex >= 0) {
      console.log('[Giveaway Event] Updating existing giveaway event...');
      events[existingIndex] = giveawayEvent;
    } else {
      console.log('[Giveaway Event] Adding new giveaway event...');
      events.push(giveawayEvent);
    }

    // Write back to file
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2), 'utf8');
    console.log('[Giveaway Event] Successfully added giveaway event to events.json');
    console.log('[Giveaway Event] Event ID:', giveawayEvent._id);

    return true;
  } catch (error) {
    console.error('[Giveaway Event] Error adding event:', error);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  addGiveawayEvent();
}

module.exports = { addGiveawayEvent };
