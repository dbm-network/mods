'use strict';

/**
 * Giveaway Event Handlers
 * These events handle giveaway reactions, auto-ending, and scheduled starts
 */

const giveawayUtils = require('./giveaway_utils');
let giveawayEmbed = null;
try {
  giveawayEmbed = require('./giveaway_embed');
} catch (error) {
  console.warn('[Giveaway Events] Giveaway embed generator not available:', error.message);
}

/**
 * Initialize giveaway event handlers
 * This should be called from DBM event mod
 */
function initializeGiveawayEvents(DBM) {
  if (!giveawayUtils || !giveawayUtils.isGiveawaySystemAvailable()) {
    return; // Giveaway system not available
  }

  const { Bot } = DBM;

  // Handle reaction adds for giveaway entries
  if (Bot && Bot.bot) {
    // Only register if not already registered
    if (!Bot.bot._giveawayEventsRegistered) {
      Bot.bot.on('messageReactionAdd', async (reaction, user) => {
        if (user.bot) return; // Ignore bot reactions

        try {
          await handleGiveawayReaction(reaction, user, true);
        } catch (error) {
          console.error('[Giveaway Events] Error handling reaction add:', error);
        }
      });

      // Handle reaction removes (un-entry)
      Bot.bot.on('messageReactionRemove', async (reaction, user) => {
        if (user.bot) return;

        try {
          await handleGiveawayReaction(reaction, user, false);
        } catch (error) {
          console.error('[Giveaway Events] Error handling reaction remove:', error);
        }
      });

      Bot.bot._giveawayEventsRegistered = true;
    }

    // Recover active giveaways on startup (sync reactions from Discord)
    // Wait for bot to be ready before recovering
    if (Bot.bot.readyAt) {
      // Bot is already ready, recover immediately
      setTimeout(() => recoverActiveGiveaways(DBM), 5000); // Wait 5 seconds for full initialization
    } else {
      // Bot not ready yet, wait for ready event
      Bot.bot.once('ready', () => {
        setTimeout(() => recoverActiveGiveaways(DBM), 5000);
      });
    }
  }

  // Auto-end giveaways check (runs every minute)
  setInterval(() => {
    checkAndEndGiveaways(DBM);
  }, 60000); // Check every minute

  // Scheduled giveaway starts check (runs every minute)
  setInterval(() => {
    checkScheduledGiveaways(DBM);
  }, 60000);
}

/**
 * Handle giveaway reaction (entry/un-entry)
 */
async function handleGiveawayReaction(reaction, user, isAdd) {
  if (!giveawayUtils || !giveawayUtils.isGiveawaySystemAvailable()) {
    return;
  }

  const message = reaction.message;
  if (!message || !message.guild) {
    return;
  }

  const giveaways = giveawayUtils.getServerGiveaways(message.guild.id);
  const giveaway = giveaways.find((g) => g.messageId === message.id && !g.ended);

  if (!giveaway) {
    return; // Not a giveaway message
  }

  // Check if reaction matches the giveaway's emoji
  const giveawayEmoji = giveaway.reactionEmoji || '🎉';
  const reactionEmojiName = reaction.emoji.name || reaction.emoji.toString();
  const reactionEmojiString = reaction.emoji.toString();

  // Support both custom and default emojis
  const emojiMatches =
    reactionEmojiName === giveawayEmoji ||
    reactionEmojiString === giveawayEmoji ||
    (giveawayEmoji === '🎉' && (reactionEmojiName === '🎉' || reactionEmojiString === '🎉'));

  if (!emojiMatches) {
    return; // Not the correct emoji
  }

  if (isAdd) {
    // Add entry
    if (!giveaway.entries) {
      giveaway.entries = [];
    }
    if (!giveaway.entries.includes(user.id)) {
      giveaway.entries.push(user.id);
      giveawayUtils.saveGiveaway(giveaway);

      // TODO: Check requirements and send confirmation/denial DM if configured
      // TODO: Update embed with new entry count
    }
  } else if (giveaway.entries && giveaway.entries.includes(user.id)) {
    // Remove entry
    giveaway.entries = giveaway.entries.filter((id) => id !== user.id);
    giveawayUtils.saveGiveaway(giveaway);

    // TODO: Send removal DM if configured
    // TODO: Update embed with new entry count
  }
}

/**
 * Check and auto-end giveaways that have reached their end time
 */
async function checkAndEndGiveaways(DBM) {
  if (!giveawayUtils || !giveawayUtils.isGiveawaySystemAvailable()) {
    return;
  }

  try {
    const allGiveaways = giveawayUtils.getAllGiveaways();
    const now = Date.now();

    for (const giveaway of allGiveaways) {
      if (giveaway.ended || !giveaway.endTime) {
        continue;
      }

      // Check if giveaway should end
      if (giveaway.endTime <= now) {
        await endGiveaway(DBM, giveaway);
      }
    }
  } catch (error) {
    console.error('[Giveaway Events] Error checking giveaways:', error);
  }
}

/**
 * End a giveaway and select winners
 */
async function endGiveaway(DBM, giveaway) {
  if (!giveaway || giveaway.ended) {
    return;
  }

  giveaway.ended = true;
  giveaway.endedAt = Date.now();

  // Select winners
  const entries = giveaway.entries || [];
  if (entries.length === 0) {
    giveaway.winnerIds = [];
    giveawayUtils.saveGiveaway(giveaway);
    await updateGiveawayMessage(DBM, giveaway, []);
    return;
  }

  const winnerCount = Math.min(giveaway.winners || 1, entries.length);
  const winners = [];
  const entriesCopy = [...entries];

  // Random selection
  for (let i = 0; i < winnerCount; i++) {
    const randomIndex = Math.floor(Math.random() * entriesCopy.length);
    winners.push(entriesCopy.splice(randomIndex, 1)[0]);
  }

  giveaway.winnerIds = winners;
  giveawayUtils.saveGiveaway(giveaway);

  // Update message with end embed
  await updateGiveawayMessage(DBM, giveaway, winners);

  // Get server settings
  const serverSettings = giveawayUtils.getServerSettings(giveaway.serverId);

  // Add winner role if configured
  if (winners.length > 0) {
    const winnerRoleId = giveaway.winnerRole || serverSettings.winnerRole;
    if (winnerRoleId) {
      try {
        const bot = DBM.Bot && DBM.Bot.bot ? DBM.Bot.bot : null;
        if (bot) {
          const guild = bot.guilds.cache.get(giveaway.serverId);
          if (guild) {
            const winnerRole = guild.roles.cache.get(winnerRoleId);
            if (winnerRole) {
              for (const winnerId of winners) {
                try {
                  const member = await guild.members.fetch(winnerId).catch(() => null);
                  if (member && !member.roles.cache.has(winnerRoleId)) {
                    await member.roles.add(winnerRole);
                    console.log(`[Giveaway Events] Added winner role to ${member.user.tag}`);
                  }
                } catch (error) {
                  console.error(`[Giveaway Events] Error adding winner role to ${winnerId}:`, error.message);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('[Giveaway Events] Error assigning winner roles:', error);
      }
    }
  }

  // DM winners if configured
  const shouldDmWinners = giveaway.dmWinners !== undefined ? giveaway.dmWinners : serverSettings.dmGiveawayWinners;
  if (shouldDmWinners && winners.length > 0) {
    try {
      const bot = DBM.Bot && DBM.Bot.bot ? DBM.Bot.bot : null;
      if (bot) {
        // Get host mention if pingHostInDm is enabled
        let hostMention = '';
        if (giveaway.pingHostInDm && giveaway.hostedBy) {
          const hostMatch = giveaway.hostedBy.match(/<@!?(\d+)>/);
          if (hostMatch) {
            hostMention = `\n\nHost: <@${hostMatch[1]}>`;
          }
        }

        // Use custom DM message if provided, otherwise use default
        const defaultDmMessage = `🎉 **Congratulations!** 🎉\n\nYou won the giveaway: **${
          giveaway.prize || giveaway.name
        }**\n\nPlease contact the giveaway host to claim your prize!`;
        const dmMessageText = (giveaway.dmMessage || defaultDmMessage) + hostMention;

        const dmMessageType = giveaway.dmMessageType || 'normal';

        for (const winnerId of winners) {
          try {
            const user = await bot.users.fetch(winnerId).catch(() => null);
            if (user) {
              if (dmMessageType === 'embed') {
                // Send as embed
                const embed = {
                  title: '🎉 Congratulations! 🎉',
                  description: `You won the giveaway: **${
                    giveaway.prize || giveaway.name
                  }**\n\nPlease contact the giveaway host to claim your prize!${hostMention}`,
                  color: parseInt(
                    (giveaway.embedColor || serverSettings.defaultEmbedColor || '#338ac4').replace('#', ''),
                    16,
                  ),
                  timestamp: new Date().toISOString(),
                  footer: {
                    text: 'Giveaway Winner',
                  },
                };
                await user.send({ embeds: [embed] }).catch(() => {
                  console.log(`[Giveaway Events] Could not DM winner ${user.tag} (DMs may be disabled)`);
                });
              } else {
                // Send as normal message
                await user.send(dmMessageText).catch(() => {
                  console.log(`[Giveaway Events] Could not DM winner ${user.tag} (DMs may be disabled)`);
                });
              }
            }
          } catch (error) {
            console.error(`[Giveaway Events] Error DMing winner ${winnerId}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.error('[Giveaway Events] Error sending winner DMs:', error);
    }
  }

  // DM host if configured
  const shouldDmHost = giveaway.dmHost !== undefined ? giveaway.dmHost : serverSettings.dmGiveawayHost;
  if (shouldDmHost) {
    try {
      const bot = DBM.Bot && DBM.Bot.bot ? DBM.Bot.bot : null;
      if (bot && giveaway.hostedBy) {
        // Try to extract user ID from hostedBy (could be mention, ID, or text)
        const hostMatch = giveaway.hostedBy.match(/<@!?(\d+)>/);
        const hostId = hostMatch ? hostMatch[1] : null;

        if (hostId) {
          try {
            const hostUser = await bot.users.fetch(hostId).catch(() => null);
            if (hostUser) {
              const winnerMentions = winners.length > 0 ? winners.map((id) => `<@${id}>`).join(', ') : 'No entries!';
              const dmMessage = `📢 **Giveaway Ended**\n\nThe giveaway **${
                giveaway.prize || giveaway.name
              }** has ended!\n\n**Winner(s):** ${winnerMentions}`;
              await hostUser.send(dmMessage).catch(() => {
                console.log(`[Giveaway Events] Could not DM host ${hostUser.tag} (DMs may be disabled)`);
              });
            }
          } catch (error) {
            console.error(`[Giveaway Events] Error DMing host ${hostId}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.error('[Giveaway Events] Error sending host DM:', error);
    }
  }

  // TODO: Create winner thread if configured

  console.log(`[Giveaway Events] Ended giveaway ${giveaway.id}, selected ${winners.length} winner(s)`);
}

/**
 * Update giveaway message with end embed
 */
async function updateGiveawayMessage(DBM, giveaway, winners) {
  try {
    const bot = DBM.Bot && DBM.Bot.bot ? DBM.Bot.bot : null;
    if (!bot || !giveaway.messageId || !giveaway.channelId) {
      return;
    }

    const channel = bot.channels.cache.get(giveaway.channelId);
    if (!channel) {
      return;
    }

    const message = await channel.messages.fetch(giveaway.messageId).catch(() => null);
    if (!message) {
      return;
    }

    // Get server settings
    const serverSettings = giveawayUtils.getServerSettings(giveaway.serverId);

    // Get host mention if pingHostInServer is enabled
    let hostMention = '';
    if (giveaway.pingHostInServer && giveaway.hostedBy) {
      const hostMatch = giveaway.hostedBy.match(/<@!?(\d+)>/);
      if (hostMatch) {
        hostMention = `\n\nHost: <@${hostMatch[1]}>`;
      }
    }

    const serverMessageType = giveaway.serverMessageType || 'normal';

    if (serverMessageType === 'embed') {
      // Generate end embed using new embed generator
      const embed = giveawayEmbed
        ? giveawayEmbed.generateGiveawayEndEmbed(giveaway, winners, serverSettings)
        : {
            title: '🎉 GIVEAWAY ENDED 🎉',
            description: `**${giveaway.prize || giveaway.name}**\n\n**Winner(s):** ${
              winners.length > 0 ? winners.map((id) => `<@${id}>`).join(', ') : 'No entries!'
            }\n\nCongratulations!${hostMention}`,
            color: parseInt(
              (giveaway.endEmbedColor || serverSettings.defaultEndEmbedColor || '#f04747').replace('#', ''),
              16,
            ),
            timestamp: new Date().toISOString(),
            footer: {
              text: `Ended`,
            },
          };

      await message.edit({ embeds: [embed] });
    } else {
      // Send as normal message
      const winnerMentions = winners.length > 0 ? winners.map((id) => `<@${id}>`).join(', ') : 'No entries!';
      const endMessage = `🎉 **GIVEAWAY ENDED** 🎉\n\n**${
        giveaway.prize || giveaway.name
      }**\n\n**Winner(s):** ${winnerMentions}\n\nCongratulations!${hostMention}`;
      await message.edit({ content: endMessage, embeds: [] });
    }
  } catch (error) {
    console.error('[Giveaway Events] Error updating giveaway message:', error);
  }
}

/**
 * Check and start scheduled giveaways
 */
async function checkScheduledGiveaways(DBM) {
  if (!giveawayUtils || !giveawayUtils.isGiveawaySystemAvailable()) {
    return;
  }

  try {
    const allGiveaways = giveawayUtils.getAllGiveaways();
    const now = Date.now();

    for (const giveaway of allGiveaways) {
      if (giveaway.ended || !giveaway.scheduled || !giveaway.scheduledStart) {
        continue;
      }

      // Check if scheduled giveaway should start
      if (giveaway.scheduledStart <= now && !giveaway.started) {
        await startScheduledGiveaway(DBM, giveaway);
      }
    }
  } catch (error) {
    console.error('[Giveaway Events] Error checking scheduled giveaways:', error);
  }
}

/**
 * Start a scheduled giveaway
 */
async function startScheduledGiveaway(DBM, giveaway) {
  if (!giveaway) {
    return;
  }

  try {
    const { Bot } = DBM;
    if (!Bot || !Bot.bot) {
      console.error('[Giveaway Events] Bot not available to start scheduled giveaway');
      return;
    }

    const guild = Bot.bot.guilds.cache.get(giveaway.serverId);
    if (!guild) {
      console.error(`[Giveaway Events] Guild ${giveaway.serverId} not found`);
      return;
    }

    const channel = guild.channels.cache.get(giveaway.channelId);
    if (!channel) {
      console.error(`[Giveaway Events] Channel ${giveaway.channelId} not found`);
      return;
    }

    // Calculate end time from duration if not set
    if (giveaway.duration && !giveaway.endTime) {
      const durationMs = parseDuration(giveaway.duration);
      if (durationMs > 0) {
        giveaway.endTime = Date.now() + durationMs;
      }
    }

    // Get server settings
    const serverSettings = giveawayUtils.getServerSettings(giveaway.serverId);

    // Merge giveaway settings with server defaults
    if (!giveaway.embedColor) {
      giveaway.embedColor = serverSettings.defaultEmbedColor;
    }
    if (!giveaway.endEmbedColor) {
      giveaway.endEmbedColor = serverSettings.defaultEndEmbedColor;
    }
    if (!giveaway.hostedBy && serverSettings.defaultHost) {
      giveaway.hostedBy = serverSettings.defaultHost;
    }
    if (!giveaway.extraEntries && Object.keys(serverSettings.defaultExtraEntries).length > 0) {
      giveaway.extraEntries = serverSettings.defaultExtraEntries;
    }
    if (!giveaway.winnerRole && serverSettings.winnerRole) {
      giveaway.winnerRole = serverSettings.winnerRole;
    }

    // Generate embed using new embed generator
    const embed = giveawayEmbed
      ? giveawayEmbed.generateGiveawayEmbed(giveaway, serverSettings, 0)
      : {
          title: '🎉 GIVEAWAY 🎉',
          description: `**${giveaway.prize}**\n\nReact with ${
            giveaway.reactionEmoji || '🎉'
          } to enter!\n\n**Winners:** ${giveaway.winners}\n**Ends:** <t:${Math.floor(giveaway.endTime / 1000)}:R>`,
          color: parseInt((giveaway.embedColor || '#338ac4').replace('#', ''), 16),
          timestamp: new Date().toISOString(),
          footer: {
            text: giveaway.hostedBy ? `Hosted by: ${giveaway.hostedBy}` : 'Giveaway',
          },
        };

    // Send message with notification role ping if configured
    let messageContent = null;
    if (giveaway.notificationRole) {
      messageContent = `<@&${giveaway.notificationRole}>`;
    }

    // Post message to Discord
    const message = await channel.send({
      content: messageContent,
      embeds: [embed],
    });
    giveaway.messageId = message.id;
    giveaway.started = true;
    giveaway.scheduled = false;
    giveaway.status = 'active';
    giveaway.createdAt = Date.now();

    // Add reaction
    const emoji = giveaway.reactionEmoji || '🎉';
    await message.react(emoji);

    // Send create message if provided
    const createMessage = giveaway.createMessage || serverSettings.defaultCreateMessage;
    if (createMessage) {
      await channel.send(createMessage);
    }

    // Save updated giveaway
    giveawayUtils.saveGiveaway(giveaway);

    console.log(`[Giveaway Events] Started scheduled giveaway ${giveaway.id} in channel ${channel.name}`);
  } catch (error) {
    console.error(`[Giveaway Events] Error starting scheduled giveaway ${giveaway.id}:`, error);
  }
}

/**
 * Recover active giveaways on bot startup
 * Syncs reactions from Discord messages to ensure entries are tracked after restart
 */
async function recoverActiveGiveaways(DBM) {
  if (!giveawayUtils || !giveawayUtils.isGiveawaySystemAvailable()) {
    return;
  }

  try {
    const { Bot } = DBM;
    if (!Bot || !Bot.bot || !Bot.bot.readyAt) {
      console.log('[Giveaway Events] Bot not ready, skipping recovery');
      return;
    }

    const bot = Bot.bot;
    const allGiveaways = giveawayUtils.getAllGiveaways();
    const activeGiveaways = allGiveaways.filter((g) => !g.ended && g.messageId && g.status === 'active');

    if (activeGiveaways.length === 0) {
      console.log('[Giveaway Events] No active giveaways to recover');
      return;
    }

    console.log(`[Giveaway Events] Recovering ${activeGiveaways.length} active giveaway(s)...`);

    let recoveredCount = 0;
    let errorCount = 0;

    for (const giveaway of activeGiveaways) {
      try {
        const guild = bot.guilds.cache.get(giveaway.serverId);
        if (!guild) {
          console.log(`[Giveaway Events] Guild ${giveaway.serverId} not found for giveaway ${giveaway.id}`);
          continue;
        }

        const channel = guild.channels.cache.get(giveaway.channelId);
        if (!channel) {
          console.log(`[Giveaway Events] Channel ${giveaway.channelId} not found for giveaway ${giveaway.id}`);
          continue;
        }

        // Fetch the message
        const message = await channel.messages.fetch(giveaway.messageId).catch(() => null);
        if (!message) {
          console.log(`[Giveaway Events] Message ${giveaway.messageId} not found for giveaway ${giveaway.id}`);
          continue;
        }

        // Get the giveaway emoji
        const giveawayEmoji = giveaway.reactionEmoji || '🎉';

        // Find the reaction for this giveaway's emoji
        const reaction = message.reactions.cache.find((r) => {
          const emojiName = r.emoji.name || r.emoji.toString();
          const emojiString = r.emoji.toString();
          return (
            emojiName === giveawayEmoji ||
            emojiString === giveawayEmoji ||
            (giveawayEmoji === '🎉' && (emojiName === '🎉' || emojiString === '🎉'))
          );
        });

        if (!reaction) {
          console.log(`[Giveaway Events] No reaction found for emoji ${giveawayEmoji} on giveaway ${giveaway.id}`);
          continue;
        }

        // Fetch all users who reacted (handles partial reactions)
        const users = await reaction.users.fetch().catch(() => null);
        if (!users) {
          console.log(`[Giveaway Events] Could not fetch users for reaction on giveaway ${giveaway.id}`);
          continue;
        }

        // Sync entries with current reactions
        if (!giveaway.entries) {
          giveaway.entries = [];
        }

        const beforeCount = giveaway.entries.length;
        const botUserIds = new Set();

        // Collect all user IDs from reactions (excluding bots)
        users.forEach((user) => {
          if (!user.bot) {
            botUserIds.add(user.id);
          }
        });

        // Add missing entries
        botUserIds.forEach((userId) => {
          if (!giveaway.entries.includes(userId)) {
            giveaway.entries.push(userId);
          }
        });

        // Remove entries that no longer have reactions
        giveaway.entries = giveaway.entries.filter((userId) => botUserIds.has(userId));

        const afterCount = giveaway.entries.length;
        const added = afterCount - beforeCount;

        if (added !== 0 || beforeCount !== afterCount) {
          giveawayUtils.saveGiveaway(giveaway);
          console.log(
            `[Giveaway Events] Recovered giveaway ${giveaway.id}: ${
              added > 0 ? '+' : ''
            }${added} entries (${beforeCount} → ${afterCount})`,
          );
          recoveredCount++;
        } else {
          console.log(`[Giveaway Events] Giveaway ${giveaway.id} already synced (${afterCount} entries)`);
        }
      } catch (error) {
        console.error(`[Giveaway Events] Error recovering giveaway ${giveaway.id}:`, error);
        errorCount++;
      }
    }

    console.log(`[Giveaway Events] Recovery complete: ${recoveredCount} recovered, ${errorCount} errors`);
  } catch (error) {
    console.error('[Giveaway Events] Error during giveaway recovery:', error);
  }
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
  initializeGiveawayEvents,
  handleGiveawayReaction,
  checkAndEndGiveaways,
  endGiveaway,
  checkScheduledGiveaways,
  startScheduledGiveaway,
  recoverActiveGiveaways,
};
