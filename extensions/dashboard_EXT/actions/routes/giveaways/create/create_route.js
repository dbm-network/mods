'use strict';

const serverPrefixManager = require('../../../../tools/server-prefix-manager');
// Use dynamic require for version compatibility (supports both v13 and v14)
let ChannelType;
try {
  const DiscordJS = require('discord.js');
  ChannelType = DiscordJS.ChannelType;
} catch (e) {
  // Fallback if ChannelType not available
  ChannelType = null;
}

let giveawayUtils = null;
let giveawayEmbed = null;
try {
  giveawayUtils = require('../../../../tools/giveaway_utils');
  giveawayEmbed = require('../../../../tools/giveaway_embed');
} catch (error) {
  // Giveaway utils not available, will handle gracefully
  console.warn('[Giveaways Create Route] Giveaway utils not available:', error.message);
}

module.exports = {
  init: async (DBM, Dashboard) => {
    // Server channels endpoint (needed for giveaway creation)
    Dashboard.app.get('/api/servers/:serverId/channels', Dashboard.checkAuth, async (req, res) => {
      try {
        const serverId = req.params.serverId;
        console.log('[Giveaways Create API] Channels request for server:', serverId);

        const bot = DBM.Bot && DBM.Bot.bot ? DBM.Bot.bot : null;

        if (!bot) {
          console.error('[Giveaways Create API] Bot not available');
          return res.status(503).json({ success: false, error: 'Bot not available' });
        }

        console.log('[Giveaways Create API] Bot user ID:', bot.user.id);
        console.log('[Giveaways Create API] Bot guilds in cache:', bot.guilds.cache.size);

        // Try to get guild from cache first
        let guild = bot.guilds.cache.get(serverId);
        console.log('[Giveaways Create API] Guild in cache:', Boolean(guild));

        if (!guild) {
          // Try to fetch the guild if not in cache
          console.log('[Giveaways Create API] Guild not in cache, attempting fetch...');
          try {
            guild = await bot.guilds.fetch(serverId);
            console.log('[Giveaways Create API] Successfully fetched guild:', guild.name);
          } catch (fetchError) {
            console.error('[Giveaways Create API] Error fetching guild:', fetchError);
            console.error('[Giveaways Create API] Error details:', fetchError.message, fetchError.code);
            return res
              .status(404)
              .json({ success: false, error: `Server not found or bot not in server: ${fetchError.message}` });
          }
        } else {
          console.log('[Giveaways Create API] Using cached guild:', guild.name);
        }

        // Check if user has access to this server
        const user = req.user;
        if (!user || !user.guilds) {
          return res.status(403).json({ success: false, error: 'Access denied' });
        }

        const userGuild = user.guilds.find((g) => g.id === serverId);
        if (!userGuild || !(userGuild.permissions & 0x20)) {
          // MANAGE_GUILD
          return res.status(403).json({ success: false, error: 'Insufficient permissions' });
        }

        // Get bot member to check permissions
        let botMember = guild.members.cache.get(bot.user.id);
        if (!botMember) {
          console.warn('[Giveaways Create API] Bot member not in cache, attempting fetch...');
          try {
            botMember = await guild.members.fetch(bot.user.id);
          } catch (memberError) {
            console.warn(
              '[Giveaways Create API] Could not fetch bot member (may timeout on large servers):',
              memberError.message,
            );
            // Continue without bot member - will include all channels
          }
        }

        // Check if bot has Administrator permission (bypasses all channel permissions)
        let botHasAdmin = false;
        if (botMember) {
          try {
            botHasAdmin = botMember.permissions.has('Administrator');
            console.log('[Giveaways Create API] Bot has Administrator:', botHasAdmin);
          } catch (permError) {
            console.warn('[Giveaways Create API] Error checking bot permissions:', permError.message);
          }
        }

        console.log('[Giveaways Create API] Guild channels in cache:', guild.channels.cache.size);

        // Check what channel types we have
        const channelTypes = {};
        guild.channels.cache.forEach((ch) => {
          const typeName = typeof ch.type === 'number' ? ch.type : ch.type?.toString() || 'unknown';
          channelTypes[typeName] = (channelTypes[typeName] || 0) + 1;
        });
        console.log('[Giveaways Create API] Channel types in cache:', channelTypes);
        console.log('[Giveaways Create API] ChannelType.GuildText value:', ChannelType?.GuildText);
        console.log(
          '[Giveaways Create API] Text channels (type 0):',
          guild.channels.cache.filter((c) => c.type === 0).size,
        );
        console.log(
          '[Giveaways Create API] Text channels (ChannelType.GuildText):',
          guild.channels.cache.filter((c) => c.type === ChannelType?.GuildText).size,
        );
        console.log(
          '[Giveaways Create API] Text-based channels:',
          guild.channels.cache.filter((c) => typeof c.isTextBased === 'function' && c.isTextBased()).size,
        );

        // Get channels from cache - support multiple Discord.js versions
        let channels = guild.channels.cache.filter((channel) => {
          // Check if it's a text channel - support multiple methods
          const channelType = channel.type;
          const isTextChannel =
            channelType === 0 || // Old Discord.js (numeric)
            channelType === 'GUILD_TEXT' || // String type (Discord.js v13+)
            channelType === 'GUILD_NEWS' || // News/Announcement channels
            channelType === ChannelType?.GuildText || // Enum (if available)
            channelType === ChannelType?.GuildAnnouncement || // Enum (if available)
            (typeof channel.isTextBased === 'function' && channel.isTextBased()); // Modern method

          if (!isTextChannel) {
            return false;
          }

          // If bot has Administrator, include all channels
          if (botHasAdmin) {
            return true;
          }

          // Otherwise check ViewChannel permission
          if (botMember) {
            try {
              const perms = channel.permissionsFor(botMember);
              const canView = perms && perms.has('ViewChannel');
              if (!canView) {
                console.log(`[Giveaways Create API] Bot cannot view channel: ${channel.name} (${channel.id})`);
              }
              return canView;
            } catch (permError) {
              // If permission check fails, include the channel
              console.warn(`[Giveaways Create API] Permission check failed for ${channel.name}:`, permError.message);
              return true;
            }
          }

          // If we can't check permissions, include it
          return true;
        });

        console.log('[Giveaways Create API] Filtered channels count:', channels.size);

        // If no channels found, try fetching channels
        if (channels.size === 0) {
          console.warn('[Giveaways Create API] No channels in cache, attempting to fetch all channels...');
          try {
            // Fetch all channels
            const fetchedChannels = await guild.channels.fetch();
            console.log(`[Giveaways Create API] Fetched ${fetchedChannels.size} total channels`);

            // Filter again after fetch
            channels = fetchedChannels.filter((channel) => {
              // Check if it's a text channel - support multiple methods
              const channelType = channel.type;
              const isTextChannel =
                channelType === 0 || // Old Discord.js (numeric)
                channelType === 'GUILD_TEXT' || // String type (Discord.js v13+)
                channelType === 'GUILD_NEWS' || // News/Announcement channels
                channelType === ChannelType?.GuildText || // Enum (if available)
                channelType === ChannelType?.GuildAnnouncement || // Enum (if available)
                (typeof channel.isTextBased === 'function' && channel.isTextBased()); // Modern method

              if (!isTextChannel) return false;
              if (botHasAdmin) return true;
              if (botMember) {
                try {
                  const perms = channel.permissionsFor(botMember);
                  return perms && perms.has('ViewChannel');
                } catch (permError) {
                  return true;
                }
              }
              return true;
            });

            console.log(`[Giveaways Create API] After fetch, found ${channels.size} text channels bot can view`);
          } catch (fetchError) {
            console.error('[Giveaways Create API] Error fetching channels:', fetchError);
            // If fetch fails, try returning all text channels without permission check as fallback
            console.warn(
              '[Giveaways Create API] Attempting fallback: return all text channels without permission check',
            );
            channels = guild.channels.cache.filter((channel) => {
              const channelType = channel.type;
              return (
                channelType === 0 ||
                channelType === 'GUILD_TEXT' ||
                channelType === 'GUILD_NEWS' ||
                channelType === ChannelType?.GuildText ||
                channelType === ChannelType?.GuildAnnouncement ||
                (typeof channel.isTextBased === 'function' && channel.isTextBased())
              );
            });
            console.log(`[Giveaways Create API] Fallback found ${channels.size} text channels`);
          }
        }

        const channelList = Array.from(channels.values())
          .map((channel) => ({
            id: channel.id,
            name: channel.name,
            type: channel.type,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        console.log(`[Giveaways Create API] Returning ${channelList.length} text channels for server ${serverId}`);

        // Disable caching for this endpoint to ensure fresh data
        res.set({
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        });

        res.json({ success: true, data: channelList });
      } catch (error) {
        console.error('[Giveaways Create API] Error getting channels:', error);
        res.status(500).json({ success: false, error: `Failed to fetch channels: ${error.message}` });
      }
    });

    // Server roles endpoint (needed for giveaway creation)
    // Server prefix management endpoints
    Dashboard.app.post('/api/servers/:serverId/prefix', Dashboard.checkAuth, async (req, res) => {
      try {
        const serverId = req.params.serverId;
        const { prefix } = req.body;

        if (!serverId) {
          return res.status(400).json({ success: false, error: 'Server ID is required' });
        }

        // Verify user has permission to manage this server
        const user = req.user;
        if (!user || !user.guilds) {
          return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const userGuild = user.guilds.find((g) => g.id === serverId);
        if (!userGuild) {
          return res.status(403).json({ success: false, error: 'You do not have access to this server' });
        }

        // Check if user is admin or has manage server permission
        const hasPermission = userGuild.permissions === '0' || (parseInt(userGuild.permissions, 10) & 0x20) === 0x20; // MANAGE_GUILD permission

        if (!hasPermission) {
          return res
            .status(403)
            .json({ success: false, error: 'You do not have permission to manage server settings' });
        }

        if (!prefix || typeof prefix !== 'string' || prefix.trim().length === 0) {
          return res.status(400).json({ success: false, error: 'Prefix is required' });
        }

        if (prefix.length > 10) {
          return res.status(400).json({ success: false, error: 'Prefix cannot be longer than 10 characters' });
        }

        const normalizedPrefix = serverPrefixManager.normalizePrefix(prefix.trim());
        if (!normalizedPrefix) {
          return res.status(400).json({ success: false, error: 'Invalid prefix format' });
        }

        serverPrefixManager.setPrefix(serverId, normalizedPrefix);

        // syncPrefixToExtension is now called automatically by setPrefix
        // This ensures compatibility with server_prefixes_EXT.js if it's loaded

        res.json({
          success: true,
          prefix: normalizedPrefix,
          message: 'Server prefix updated successfully',
        });
      } catch (error) {
        console.error('[ServerPrefix] Error updating server prefix:', error);
        res.status(500).json({ success: false, error: 'Failed to update server prefix' });
      }
    });

    Dashboard.app.delete('/api/servers/:serverId/prefix', Dashboard.checkAuth, async (req, res) => {
      try {
        const serverId = req.params.serverId;

        if (!serverId) {
          return res.status(400).json({ success: false, error: 'Server ID is required' });
        }

        // Verify user has permission to manage this server
        const user = req.user;
        if (!user || !user.guilds) {
          return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const userGuild = user.guilds.find((g) => g.id === serverId);
        if (!userGuild) {
          return res.status(403).json({ success: false, error: 'You do not have access to this server' });
        }

        // Check if user is admin or has manage server permission
        const hasPermission = userGuild.permissions === '0' || (parseInt(userGuild.permissions, 10) & 0x20) === 0x20; // MANAGE_GUILD permission

        if (!hasPermission) {
          return res
            .status(403)
            .json({ success: false, error: 'You do not have permission to manage server settings' });
        }

        serverPrefixManager.removePrefix(serverId);

        // syncPrefixToExtension is now called automatically by removePrefix
        // This ensures compatibility with server_prefixes_EXT.js if it's loaded

        res.json({
          success: true,
          message: 'Server prefix reset to default successfully',
        });
      } catch (error) {
        console.error('[ServerPrefix] Error resetting server prefix:', error);
        res.status(500).json({ success: false, error: 'Failed to reset server prefix' });
      }
    });

    Dashboard.app.get('/api/servers/:serverId/roles', Dashboard.checkAuth, async (req, res) => {
      try {
        const serverId = req.params.serverId;
        const bot = DBM.Bot && DBM.Bot.bot ? DBM.Bot.bot : null;

        if (!bot) {
          return res.status(503).json({ success: false, error: 'Bot not available' });
        }

        const guild = bot.guilds.cache.get(serverId);
        if (!guild) {
          return res.status(404).json({ success: false, error: 'Server not found' });
        }

        // Check if user has access to this server
        const user = req.user;
        if (!user || !user.guilds) {
          return res.status(403).json({ success: false, error: 'Access denied' });
        }

        const userGuild = user.guilds.find((g) => g.id === serverId);
        if (!userGuild || !(userGuild.permissions & 0x20)) {
          // MANAGE_GUILD
          return res.status(403).json({ success: false, error: 'Insufficient permissions' });
        }

        const roles = guild.roles.cache
          .filter((role) => !role.managed && role.id !== guild.id) // Exclude managed roles and @everyone
          .map((role) => ({
            id: role.id,
            name: role.name,
            color: role.hexColor,
            position: role.position,
          }))
          .sort((a, b) => b.position - a.position); // Sort by position (highest first)

        res.json({ success: true, data: Array.from(roles.values()) });
      } catch (error) {
        console.error('[Giveaways Create API] Error getting roles:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch roles' });
      }
    });

    if (!giveawayUtils) {
      // Giveaway system not available, skip API endpoints
      return;
    }
    // Create giveaway endpoint
    Dashboard.app.post('/api/giveaways/create', Dashboard.checkAuth, async (req, res) => {
      try {
        // Always ensure directory exists - this will create it if needed
        if (!giveawayUtils) {
          return res.status(503).json({ success: false, error: 'Giveaway system not available' });
        }
        if (!giveawayUtils.isGiveawaySystemAvailable()) {
          giveawayUtils.ensureGiveawayDirectory();
        }

        const giveaway = req.body;

        // Validate required fields
        if (!giveaway.serverId || !giveaway.channelId || !giveaway.prize) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields: serverId, channelId, and prize are required',
          });
        }

        // Generate ID if not provided
        if (!giveaway.id) {
          giveaway.id = giveawayUtils.generateId();
        }

        // Set timestamps
        giveaway.createdAt = Date.now();
        giveaway.ended = false;

        // Set default values
        if (!giveaway.winners || giveaway.winners < 1) {
          giveaway.winners = 1;
        }
        if (!giveaway.duration) {
          giveaway.duration = '7d'; // Default 7 days
        }

        // Calculate end time from duration
        if (giveaway.duration && !giveaway.endTime) {
          const durationMs = parseDuration(giveaway.duration);
          if (durationMs > 0) {
            giveaway.endTime = Date.now() + durationMs;
          }
        }

        // Initialize entries array
        if (!giveaway.entries) {
          giveaway.entries = [];
        }

        // Handle extra entries (convert to object if needed)
        if (giveaway.extraEntries && typeof giveaway.extraEntries === 'object') {
          // Already in correct format
        } else {
          giveaway.extraEntries = null;
        }

        // Handle requirements (ensure proper structure)
        if (giveaway.requirements && typeof giveaway.requirements === 'object') {
          // Already in correct format
        } else {
          giveaway.requirements = null;
        }

        // Handle DM options (convert boolean strings if needed)
        if (typeof giveaway.dmWinners === 'string') {
          giveaway.dmWinners = giveaway.dmWinners === 'true' || giveaway.dmWinners === 'on';
        }
        if (typeof giveaway.dmHost === 'string') {
          giveaway.dmHost = giveaway.dmHost === 'true' || giveaway.dmHost === 'on';
        }

        // Handle DM message
        if (giveaway.dmMessage && typeof giveaway.dmMessage === 'string' && giveaway.dmMessage.trim()) {
          giveaway.dmMessage = giveaway.dmMessage.trim();
        } else {
          giveaway.dmMessage = null;
        }

        // Handle notification role
        if (
          giveaway.notificationRole &&
          typeof giveaway.notificationRole === 'string' &&
          giveaway.notificationRole.trim()
        ) {
          giveaway.notificationRole = giveaway.notificationRole.trim();
        } else {
          giveaway.notificationRole = null;
        }

        // Handle new fields
        giveaway.isDrop = req.body.isDrop === true || req.body.isDrop === 'true' || req.body.isDrop === 'on';
        giveaway.dmMessageType = req.body.dmMessageType || 'normal';
        giveaway.pingHostInDm =
          req.body.pingHostInDm === true || req.body.pingHostInDm === 'true' || req.body.pingHostInDm === 'on';
        giveaway.serverMessageType = req.body.serverMessageType || 'normal';
        giveaway.pingHostInServer =
          req.body.pingHostInServer === true ||
          req.body.pingHostInServer === 'true' ||
          req.body.pingHostInServer === 'on';
        giveaway.entryConfirmMessage = req.body.entryConfirmMessage || null;
        giveaway.entryDenyMessage = req.body.entryDenyMessage || null;
        giveaway.entryRemoveMessage = req.body.entryRemoveMessage || null;
        giveaway.persistEntries =
          req.body.persistEntries === true || req.body.persistEntries === 'true' || req.body.persistEntries === 'on';
        giveaway.removeEntriesOnEdit =
          req.body.removeEntriesOnEdit === true ||
          req.body.removeEntriesOnEdit === 'true' ||
          req.body.removeEntriesOnEdit === 'on';
        giveaway.createWinnersThread =
          req.body.createWinnersThread === true ||
          req.body.createWinnersThread === 'true' ||
          req.body.createWinnersThread === 'on';
        giveaway.winnersThreadType = req.body.winnersThreadType || 'public';
        giveaway.winnersThreadMessage = req.body.winnersThreadMessage || null;
        giveaway.winnersThreadCloseDuration = req.body.winnersThreadCloseDuration || null;
        giveaway.winnerRoleRemoveDuration = req.body.winnerRoleRemoveDuration || null;

        // Check if giveaway is scheduled
        const isScheduled = giveaway.scheduled && giveaway.scheduledStart && giveaway.scheduledStart > Date.now();

        if (isScheduled) {
          // Mark as scheduled but don't post yet
          giveaway.started = false;
          giveaway.status = 'scheduled';
          console.log(
            `[Giveaways Create API] Giveaway ${giveaway.id} scheduled for ${new Date(
              giveaway.scheduledStart,
            ).toISOString()}`,
          );
        } else {
          // Post giveaway message to Discord immediately
          let messageId = null;
          try {
            const bot = DBM.Bot && DBM.Bot.bot ? DBM.Bot.bot : null;
            if (bot) {
              const guild = bot.guilds.cache.get(giveaway.serverId);
              if (guild) {
                const channel = guild.channels.cache.get(giveaway.channelId);
                if (channel) {
                  // Get server settings for defaults
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
                        } to enter!\n\n**Winners:** ${giveaway.winners}\n**Ends:** <t:${Math.floor(
                          giveaway.endTime / 1000,
                        )}:R>`,
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

                  const message = await channel.send({
                    content: messageContent,
                    embeds: [embed],
                  });
                  messageId = message.id;
                  giveaway.messageId = messageId;
                  giveaway.started = true;
                  giveaway.status = 'active';

                  // Add reaction
                  const emoji = giveaway.reactionEmoji || '🎉';
                  await message.react(emoji);

                  // Send create message if provided
                  const createMessage = giveaway.createMessage || serverSettings.defaultCreateMessage;
                  if (createMessage) {
                    await channel.send(createMessage);
                  }
                }
              }
            }
          } catch (error) {
            console.error('[Giveaways Create API] Error posting to Discord:', error);
            // Continue even if Discord posting fails - giveaway is still saved
          }
        }

        // Save giveaway
        const saved = giveawayUtils.saveGiveaway(giveaway);
        if (saved) {
          res.json({ success: true, data: giveaway });
        } else {
          res.status(500).json({ success: false, error: 'Failed to save giveaway' });
        }
      } catch (error) {
        console.error('[Giveaways Create API] Error creating giveaway:', error);
        res.status(500).json({ success: false, error: `Failed to create giveaway: ${error.message}` });
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
        console.warn('[Giveaways Create Route] Error fetching user servers:', error);
      }
    }

    // Fallback to dashboard
    return res.redirect(`${basePath}/dashboard/@me`);
  },
};

/**
 * Parse duration string (e.g., "7d", "2h", "30m") to milliseconds
 * @param {string} duration - Duration string
 * @returns {number} Duration in milliseconds
 */
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
