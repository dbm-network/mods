'use strict';

/**
 * Giveaway Embed Generator
 * Creates Discord embeds for giveaways with all Giveaway Boat features
 */

const giveawayUtils = require('./giveaway_utils');

/**
 * Generate giveaway embed (active)
 * @param {Object} giveaway - Giveaway object
 * @param {Object} settings - Server settings (optional)
 * @param {number} entryCount - Current entry count (optional)
 * @returns {Object} Discord embed object
 */
function generateGiveawayEmbed(giveaway, settings = null, entryCount = null) {
  if (!giveaway) {
    return null;
  }

  const serverSettings =
    settings ||
    (giveaway.serverId ? giveawayUtils.getServerSettings(giveaway.serverId) : giveawayUtils.getDefaultSettings());

  // Get entry count
  const entries = entryCount !== null ? entryCount : (giveaway.entries && giveaway.entries.length) || 0;

  // Build description
  let description = `**${giveaway.prize || giveaway.name || 'Unnamed Giveaway'}**\n\n`;
  description += `Click ${giveaway.reactionEmoji || '🎉'} button to enter!\n\n`;

  // Winners
  description += `**Winners:** ${giveaway.winners || 1}\n`;

  // Hosted by
  const host = giveaway.hostedBy || serverSettings.defaultHost || null;
  if (host) {
    description += `**Hosted by:** ${host}\n`;
  }

  // Ends timer
  if (giveaway.endTime) {
    const endTimestamp = Math.floor(giveaway.endTime / 1000);
    description += `**Ends:** <t:${endTimestamp}:R> (<t:${endTimestamp}:F>)\n`;
  }

  // Extra entries section
  const extraEntries = giveaway.extraEntries || serverSettings.defaultExtraEntries || {};
  const extraEntriesList = Object.keys(extraEntries).filter((roleId) => extraEntries[roleId] > 0);
  if (extraEntriesList.length > 0) {
    description += `\n**Extra Entries:**\n`;
    for (const roleId of extraEntriesList) {
      const entryCount = extraEntries[roleId];
      description += `<@&${roleId}>: ${entryCount} entry${entryCount !== 1 ? 's' : ''}\n`;
    }
  }

  // Requirements section
  if (giveaway.requirements) {
    description += `\n**Requirements:**\n`;

    // Message requirements
    if (giveaway.requirements.messages) {
      const msgReq = giveaway.requirements.messages;
      if (msgReq.daily) {
        description += `• ${msgReq.daily} messages today\n`;
      }
      if (msgReq.weekly) {
        description += `• ${msgReq.weekly} messages this week\n`;
      }
      if (msgReq.monthly) {
        description += `• ${msgReq.monthly} messages this month\n`;
      }
      if (msgReq.total) {
        description += `• ${msgReq.total} total messages\n`;
      }
    }

    // Role requirements
    if (giveaway.requirements.roles && giveaway.requirements.roles.length > 0) {
      for (const roleId of giveaway.requirements.roles) {
        description += `• Must have role: <@&${roleId}>\n`;
      }
    }

    // Custom requirements
    if (giveaway.requirements.custom) {
      description += `• ${giveaway.requirements.custom}\n`;
    }
  }

  // Winner role
  const winnerRole = giveaway.winnerRole || serverSettings.winnerRole;
  if (winnerRole) {
    description += `\n**Winners will get the role:** <@&${winnerRole}>\n`;
  }

  // Embed color
  const embedColor = giveaway.embedColor || serverSettings.defaultEmbedColor || '#338ac4';

  // Create embed
  const embed = {
    title: '🎉 GIVEAWAY 🎉',
    description,
    color: parseInt(embedColor.replace('#', ''), 16),
    timestamp: new Date().toISOString(),
    footer: {
      text: `Entries: ${entries}`,
    },
  };

  // Add thumbnail if provided
  if (giveaway.thumbnail) {
    embed.thumbnail = { url: giveaway.thumbnail };
  }

  // Add image if provided
  if (giveaway.image) {
    embed.image = { url: giveaway.image };
  }

  return embed;
}

/**
 * Generate giveaway end embed
 * @param {Object} giveaway - Giveaway object
 * @param {Array} winners - Array of winner user IDs
 * @param {Object} settings - Server settings (optional)
 * @returns {Object} Discord embed object
 */
function generateGiveawayEndEmbed(giveaway, winners = [], settings = null) {
  if (!giveaway) {
    return null;
  }

  const serverSettings =
    settings ||
    (giveaway.serverId ? giveawayUtils.getServerSettings(giveaway.serverId) : giveawayUtils.getDefaultSettings());

  // Build winner mentions
  let winnerMentions = 'No entries!';
  if (winners && winners.length > 0) {
    winnerMentions = winners.map((id) => `<@${id}>`).join(', ');
  }

  // Build description
  let description = `**${giveaway.prize || giveaway.name || 'Unnamed Giveaway'}**\n\n`;
  description += `**Winner(s):** ${winnerMentions}\n\n`;
  description += `Congratulations! 🎉\n\n`;

  // Add winner role info if configured
  const winnerRole = giveaway.winnerRole || serverSettings.winnerRole;
  if (winnerRole && winners.length > 0) {
    description += `**Winners have been given the role:** <@&${winnerRole}>\n`;
  }

  // Embed color
  const endColor = giveaway.endEmbedColor || serverSettings.defaultEndEmbedColor || '#f04747';

  // Create embed
  const embed = {
    title: '🎉 GIVEAWAY ENDED 🎉',
    description,
    color: parseInt(endColor.replace('#', ''), 16),
    timestamp: new Date().toISOString(),
    footer: {
      text: `Ended`,
    },
  };

  return embed;
}

/**
 * Calculate total entries for a user (including extra entries from roles)
 * @param {string} userId - User ID
 * @param {Object} giveaway - Giveaway object
 * @param {Object} member - Discord member object (optional, for role checking)
 * @param {Object} settings - Server settings (optional)
 * @returns {number} Total entry count for user
 */
function calculateUserEntries(userId, giveaway, member = null, settings = null) {
  if (!giveaway || !giveaway.entries) {
    return 0;
  }

  // Base entry (1 if user reacted)
  let totalEntries = giveaway.entries.includes(userId) ? 1 : 0;

  if (totalEntries === 0) {
    return 0; // User hasn't entered
  }

  // Get extra entries
  const serverSettings =
    settings ||
    (giveaway.serverId ? giveawayUtils.getServerSettings(giveaway.serverId) : giveawayUtils.getDefaultSettings());
  const extraEntries = giveaway.extraEntries || serverSettings.defaultExtraEntries || {};

  // Add extra entries from roles
  if (member && member.roles) {
    for (const roleId of member.roles.cache.keys()) {
      if (extraEntries[roleId]) {
        totalEntries += extraEntries[roleId];
      }
    }
  }

  return totalEntries;
}

module.exports = {
  generateGiveawayEmbed,
  generateGiveawayEndEmbed,
  calculateUserEntries,
};
