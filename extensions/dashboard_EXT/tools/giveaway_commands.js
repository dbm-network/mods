'use strict';

/**
 * Giveaway Discord Commands
 * These commands can be added to data/commands.json
 * Format: DBM command structure with actions array
 */

const giveawayUtils = require('./giveaway_utils');

/**
 * Get giveaway slash command structure
 * Returns command object ready to be added to commands.json
 */
function getGiveawaySlashCommand() {
  return {
    name: 'giveaway',
    description: 'Manage giveaways for your server',
    permissions: 'NONE',
    permissions2: 'NONE',
    restriction: '0',
    _id: `giveaway_${Date.now().toString(36)}`,
    comType: 4, // Slash command
    actions: [
      {
        channel: '0',
        varName: '',
        message: '',
        buttons: [],
        selectMenus: [],
        attachments: [],
        embeds: [],
        storage: 0,
        varName2: '',
      },
    ],
    _subCommands: [
      {
        name: 'start',
        description: 'Start a new giveaway',
        type: 1, // Subcommand
        options: [
          {
            name: 'prize',
            description: 'What is being given away',
            type: 3, // String
            required: true,
          },
          {
            name: 'duration',
            description: 'How long the giveaway lasts (e.g., 7d, 2h)',
            type: 3, // String
            required: true,
          },
          {
            name: 'winners',
            description: 'Number of winners',
            type: 4, // Integer
            required: false,
          },
          {
            name: 'channel',
            description: 'Channel to post the giveaway',
            type: 7, // Channel
            required: false,
          },
        ],
      },
      {
        name: 'end',
        description: 'End a giveaway early',
        type: 1,
        options: [
          {
            name: 'message',
            description: 'The giveaway message',
            type: 3, // String
            required: true,
          },
        ],
      },
      {
        name: 'reroll',
        description: 'Reroll winners for a giveaway',
        type: 1,
        options: [
          {
            name: 'message',
            description: 'The giveaway message',
            type: 3,
            required: true,
          },
          {
            name: 'winners',
            description: 'Number of winners to reroll',
            type: 4,
            required: false,
          },
        ],
      },
      {
        name: 'list',
        description: 'List active giveaways in this server',
        type: 1,
      },
      {
        name: 'info',
        description: 'Get information about a giveaway',
        type: 1,
        options: [
          {
            name: 'message',
            description: 'The giveaway message',
            type: 3,
            required: true,
          },
        ],
      },
    ],
  };
}

/**
 * Execute giveaway slash command
 * This would be called from a DBM action or command handler
 */
async function executeGiveawayCommand(DBM, interaction, subcommand, options) {
  try {
    if (!giveawayUtils || !giveawayUtils.isGiveawaySystemAvailable()) {
      return interaction.reply({ content: 'Giveaway system is not available.', ephemeral: true });
    }

    const serverId = interaction.guild?.id;
    if (!serverId) {
      return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
    }

    switch (subcommand) {
      case 'start':
        return handleGiveawayStart(DBM, interaction, options, serverId);
      case 'end':
        return handleGiveawayEnd(DBM, interaction, options, serverId);
      case 'reroll':
        return handleGiveawayReroll(DBM, interaction, options, serverId);
      case 'list':
        return handleGiveawayList(DBM, interaction, serverId);
      case 'info':
        return handleGiveawayInfo(DBM, interaction, options, serverId);
      default:
        return interaction.reply({ content: 'Unknown subcommand.', ephemeral: true });
    }
  } catch (error) {
    console.error('[Giveaway Command] Error:', error);
    return interaction.reply({ content: 'An error occurred while processing the command.', ephemeral: true });
  }
}

async function handleGiveawayStart(DBM, interaction, options, serverId) {
  const prize = options.find((o) => o.name === 'prize')?.value;
  const duration = options.find((o) => o.name === 'duration')?.value;
  const winners = options.find((o) => o.name === 'winners')?.value || 1;
  const channel = options.find((o) => o.name === 'channel')?.channel || interaction.channel;

  if (!prize || !duration) {
    return interaction.reply({ content: 'Prize and duration are required.', ephemeral: true });
  }

  // Parse duration
  const durationMs = parseDuration(duration);
  if (durationMs <= 0) {
    return interaction.reply({ content: 'Invalid duration format. Use: 7d, 2h, 30m, etc.', ephemeral: true });
  }

  const giveaway = {
    id: giveawayUtils.generateId(),
    serverId,
    channelId: channel.id,
    messageId: null, // Will be set when message is posted
    prize,
    winners: parseInt(winners, 10),
    duration,
    endTime: Date.now() + durationMs,
    entries: [],
    ended: false,
    createdAt: Date.now(),
    host: interaction.user.id,
  };

  const saved = giveawayUtils.saveGiveaway(giveaway);
  if (!saved) {
    return interaction.reply({ content: 'Failed to create giveaway.', ephemeral: true });
  }

  // TODO: Post giveaway embed message using DBM actions
  // This would use send_message action or similar

  return interaction.reply({ content: `Giveaway created! ID: ${giveaway.id}`, ephemeral: true });
}

async function handleGiveawayEnd(DBM, interaction, options, serverId) {
  const messageId = options.find((o) => o.name === 'message')?.value;
  if (!messageId) {
    return interaction.reply({ content: 'Message ID is required.', ephemeral: true });
  }

  const giveaways = giveawayUtils.getServerGiveaways(serverId);
  const giveaway = giveaways.find((g) => g.messageId === messageId);

  if (!giveaway) {
    return interaction.reply({ content: 'Giveaway not found.', ephemeral: true });
  }

  if (giveaway.ended) {
    return interaction.reply({ content: 'This giveaway has already ended.', ephemeral: true });
  }

  // End the giveaway
  giveaway.ended = true;
  giveaway.endedAt = Date.now();

  // TODO: Select winners and update message using DBM actions
  giveawayUtils.saveGiveaway(giveaway);

  return interaction.reply({ content: 'Giveaway ended successfully.', ephemeral: true });
}

async function handleGiveawayReroll(DBM, interaction, options, serverId) {
  const messageId = options.find((o) => o.name === 'message')?.value;
  const _winnerCount = options.find((o) => o.name === 'winners')?.value || 1;

  if (!messageId) {
    return interaction.reply({ content: 'Message ID is required.', ephemeral: true });
  }

  const giveaways = giveawayUtils.getServerGiveaways(serverId);
  const giveaway = giveaways.find((g) => g.messageId === messageId);

  if (!giveaway) {
    return interaction.reply({ content: 'Giveaway not found.', ephemeral: true });
  }

  if (!giveaway.ended) {
    return interaction.reply({ content: 'Giveaway must be ended before rerolling.', ephemeral: true });
  }

  // TODO: Reroll winners using DBM actions
  return interaction.reply({ content: 'Winners rerolled successfully.', ephemeral: true });
}

async function handleGiveawayList(DBM, interaction, serverId) {
  const giveaways = giveawayUtils.getServerGiveaways(serverId);
  const activeGiveaways = giveaways.filter((g) => !g.ended && (!g.endTime || g.endTime > Date.now()));

  if (activeGiveaways.length === 0) {
    return interaction.reply({ content: 'No active giveaways in this server.', ephemeral: true });
  }

  const list = activeGiveaways
    .map((g) => `- ${g.prize || 'Unnamed'} (${g.winners} winner(s), ends <t:${Math.floor(g.endTime / 1000)}:R>)`)
    .join('\n');
  return interaction.reply({ content: `**Active Giveaways:**\n${list}`, ephemeral: true });
}

async function handleGiveawayInfo(DBM, interaction, options, serverId) {
  const messageId = options.find((o) => o.name === 'message')?.value;
  if (!messageId) {
    return interaction.reply({ content: 'Message ID is required.', ephemeral: true });
  }

  const giveaways = giveawayUtils.getServerGiveaways(serverId);
  const giveaway = giveaways.find((g) => g.messageId === messageId);

  if (!giveaway) {
    return interaction.reply({ content: 'Giveaway not found.', ephemeral: true });
  }

  const info =
    `**Giveaway: ${giveaway.prize || 'Unnamed'}**\n` +
    `Winners: ${giveaway.winners}\n` +
    `Entries: ${(giveaway.entries && giveaway.entries.length) || 0}\n` +
    `Status: ${giveaway.ended ? 'Ended' : 'Active'}\n${
      giveaway.endTime ? `Ends: <t:${Math.floor(giveaway.endTime / 1000)}:R>` : ''
    }`;

  return interaction.reply({ content: info, ephemeral: true });
}

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

module.exports = {
  getGiveawaySlashCommand,
  executeGiveawayCommand,
};
