'use strict';

/**
 * Giveaway End Embed Action
 * Ends a giveaway and selects winners
 * Compatible with DBM action system
 */

module.exports = {
  name: 'Giveaway End Embed MOD',
  section: 'Giveaway',
  meta: {
    version: '1.0.0',
    preciseCheck: true,
    author: 'News Targeted',
    authorUrl: 'https://newstargeted.com',
  },

  subtitle(data, presets) {
    return `End giveaway: ${presets.getVariableText(data.message, data.varName)}`;
  },

  fields: ['Message:', 'End Embed Color:', 'Store Winners As:'],

  html(data, presets) {
    return `
        <div>
            <p>This action ends a giveaway, selects winners, and updates the embed.</p>
        </div>
        <div style="padding: 8px; background: rgba(128, 128, 128, 0.2); border-radius: 4px;">
            ${presets.getVariableField(data, 'varName', 'Message', 'Message')}
            <br>
            <label>End Embed Color (hex):</label>
            <input id="color" class="round" type="text" value="#f04747" placeholder="#f04747" style="width: 100%;">
            <br>
            ${presets.variableField(data, 'varName2', 'Store Winners As', 'List')}
        </div>
        `;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const Mods = this.getMods();
    const giveawayUtils = Mods.require('./extensions/dashboard_EXT/tools/giveaway_utils');

    if (!giveawayUtils || !giveawayUtils.isGiveawaySystemAvailable()) {
      this.callNextAction(cache);
      return;
    }

    const message = await this.getMessageFromData(data.varName, data.varName, cache);
    if (!message || !message.guild) {
      this.callNextAction(cache);
      return;
    }

    const color = this.evalMessage(data.color, cache) || '#f04747';

    // Find giveaway
    const giveaways = giveawayUtils.getServerGiveaways(message.guild.id);
    const giveaway = giveaways.find((g) => g.messageId === message.id);

    if (!giveaway || giveaway.ended) {
      this.callNextAction(cache);
      return;
    }

    // Select winners
    const entries = giveaway.entries || [];
    const winnerCount = Math.min(giveaway.winners || 1, entries.length);
    const winners = [];
    const entriesCopy = [...entries];

    for (let i = 0; i < winnerCount; i++) {
      if (entriesCopy.length === 0) break;
      const randomIndex = Math.floor(Math.random() * entriesCopy.length);
      winners.push(entriesCopy.splice(randomIndex, 1)[0]);
    }

    // Update giveaway
    giveaway.ended = true;
    giveaway.endedAt = Date.now();
    giveaway.winnerIds = winners;
    giveawayUtils.saveGiveaway(giveaway);

    // Create end embed
    const winnerMentions = winners.length > 0 ? winners.map((id) => `<@${id}>`).join(', ') : 'No entries!';

    const embed = {
      title: '🎉 GIVEAWAY ENDED 🎉',
      description: `**${giveaway.prize || giveaway.name}**\n\n**Winner(s):** ${winnerMentions}\n\nCongratulations!`,
      color: parseInt(color.replace('#', ''), 16),
      timestamp: new Date().toISOString(),
      footer: {
        text: `Ended`,
      },
    };

    try {
      await message.edit({ embeds: [embed] });

      // Store winners
      if (data.varName2) {
        this.storeValue(winners, 2, data.varName2, cache);
      }
    } catch (error) {
      console.error('[Giveaway End Embed] Error:', error);
    }

    this.callNextAction(cache);
  },

  mod() {},
};
