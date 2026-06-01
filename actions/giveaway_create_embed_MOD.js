'use strict';

/**
 * Giveaway Create Embed Action
 * Creates and sends a giveaway embed message
 * Compatible with DBM action system
 */

module.exports = {
  name: 'Giveaway Create Embed MOD',
  section: 'Giveaway',
  meta: {
    version: '1.0.0',
    preciseCheck: true,
    author: 'News Targeted',
    authorUrl: 'https://newstargeted.com',
  },

  subtitle(data, presets) {
    return `Create giveaway embed: ${data.prize || 'Unnamed'}`;
  },

  fields: [
    'Channel:',
    'Prize/Name:',
    'Duration:',
    'Winners:',
    'Host (optional):',
    'Embed Color:',
    'Create Message (optional):',
    'Store Message As:',
  ],

  html(data, presets) {
    return `
        <div>
            <p>This action creates a giveaway embed message. The message will automatically have a 🎉 reaction added for entries.</p>
        </div>
        <div style="float: left; width: 50%; padding-right: 4px;">
            ${presets.getChannelField(data, 'channel')}
            <br>
            <div style="padding: 8px; background: rgba(128, 128, 128, 0.2); border-radius: 4px;">
                <label>Prize/Name:</label>
                <input id="modifier" class="round" type="text" placeholder="e.g. Discord Nitro" style="width: 100%;">
            </div>
            <br>
            <div style="padding: 8px; background: rgba(128, 128, 128, 0.2); border-radius: 4px;">
                <label>Duration (e.g., 7d, 2h, 30m):</label>
                <input id="duration" class="round" type="text" placeholder="7d" style="width: 100%;">
            </div>
            <br>
            <div style="padding: 8px; background: rgba(128, 128, 128, 0.2); border-radius: 4px;">
                <label>Number of Winners:</label>
                <input id="winners" class="round" type="number" value="1" min="1" max="100" style="width: 100%;">
            </div>
        </div>
        <div style="float: right; width: 50%; padding-left: 4px;">
            <div style="padding: 8px; background: rgba(128, 128, 128, 0.2); border-radius: 4px;">
                <label>Host (optional):</label>
                <input id="host" class="round" type="text" placeholder="User mention, role, or text" style="width: 100%;">
            </div>
            <br>
            <div style="padding: 8px; background: rgba(128, 128, 128, 0.2); border-radius: 4px;">
                <label>Embed Color (hex):</label>
                <input id="color" class="round" type="text" value="#338ac4" placeholder="#338ac4" style="width: 100%;">
            </div>
            <br>
            <div style="padding: 8px; background: rgba(128, 128, 128, 0.2); border-radius: 4px;">
                <label>Create Message (optional):</label>
                <textarea id="createMessage" class="round" rows="3" placeholder="Message sent when giveaway is created" style="width: 100%;"></textarea>
            </div>
            <br>
            ${presets.variableField(data, 'varName', 'Store Message As', 'Message')}
        </div>
        `;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const Mods = this.getMods();
    const giveawayUtils = Mods.require('./extensions/dashboard_EXT/tools/giveaway_utils');

    if (!giveawayUtils || !giveawayUtils.isGiveawaySystemAvailable()) {
      this.storeValue('Giveaway system not available', 1, data.varName, cache);
      this.callNextAction(cache);
      return;
    }

    const channel = await this.getChannelFromData(data.channel, data.varName, cache);
    if (!channel) {
      this.callNextAction(cache);
      return;
    }

    const prize = this.evalMessage(data.prize, cache);
    const duration = this.evalMessage(data.duration, cache);
    const winners = parseInt(this.evalMessage(data.winners, cache) || '1', 10);
    const host = this.evalMessage(data.host, cache) || null;
    const color = this.evalMessage(data.color, cache) || '#338ac4';
    const createMessage = this.evalMessage(data.createMessage, cache) || null;

    // Parse duration
    const durationMs = parseDuration(duration);
    if (durationMs <= 0) {
      this.storeValue('Invalid duration format', 1, data.varName, cache);
      this.callNextAction(cache);
      return;
    }

    // Create giveaway embed
    const embed = {
      title: '🎉 GIVEAWAY 🎉',
      description: `**${prize}**\n\nReact with 🎉 to enter!\n\n**Winners:** ${winners}\n**Ends:** <t:${Math.floor(
        (Date.now() + durationMs) / 1000,
      )}:R>`,
      color: parseInt(color.replace('#', ''), 16),
      timestamp: new Date().toISOString(),
      footer: {
        text: host ? `Hosted by: ${host}` : 'Giveaway',
      },
    };

    try {
      // Send message
      const message = await channel.send({ embeds: [embed] });

      // Add reaction
      await message.react('🎉');

      // Create giveaway record
      const giveaway = {
        id: giveawayUtils.generateId(),
        serverId: channel.guild.id,
        channelId: channel.id,
        messageId: message.id,
        prize,
        winners,
        duration,
        endTime: Date.now() + durationMs,
        entries: [],
        ended: false,
        createdAt: Date.now(),
        host,
        embedColor: color,
        createMessage,
      };

      giveawayUtils.saveGiveaway(giveaway);

      // Store message
      if (data.varName) {
        this.storeValue(message, 1, data.varName, cache);
      }

      // Send create message if provided
      if (createMessage) {
        await channel.send(createMessage);
      }
    } catch (error) {
      console.error('[Giveaway Create Embed] Error:', error);
    }

    this.callNextAction(cache);
  },

  mod() {},
};

function parseDuration(duration) {
  if (!duration || typeof duration !== 'string') {
    return 0;
  }

  const match = duration.match(/^(\d+)([smhd])$/i);
  if (!match) {
    return 0;
  }

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * (multipliers[unit] || 0);
}
