const { ChannelType, EmbedBuilder, PermissionFlagsBits, resolveColor } = require('discord.js');

module.exports = {
  async run(DBM, req, res, Dashboard, providedGuild) {
    try {
      const bot = DBM?.Bot?.bot;
      if (!bot) {
        return 'Bot client is not ready. Please try again in a few seconds.';
      }

      const input = req?.body || {};
      const guildId = String(
        input.server || req?.params?.serverID || req?.params?.guildID || providedGuild?.id || '',
      ).trim();

      if (!guildId) {
        return 'Unable to determine which guild to target.';
      }

      const guild =
        providedGuild || bot.guilds.cache.get(guildId) || (await safeFetch(() => bot.guilds.fetch(guildId)));

      if (!guild) {
        return 'I could not locate that guild. Please make sure the bot is still in the server.';
      }

      const channelId = String(input.channelId || input.channel || '').trim();
      if (!channelId) {
        return 'Select a text channel to publish the snapshot.';
      }

      const channel = guild.channels.cache.get(channelId) || (await safeFetch(() => guild.channels.fetch(channelId)));

      if (!channel || !isTextChannel(channel)) {
        return 'The selected channel does not support text/embeds.';
      }

      const botMember = guild.members.me || (await safeFetch(() => guild.members.fetch(bot.user.id)));
      if (!botMember) {
        return 'Bot member information is unavailable in this guild.';
      }

      const perms = channel.permissionsFor(botMember);
      if (!perms?.has(PermissionFlagsBits.SendMessages)) {
        return 'The bot is missing permission to send messages in that channel.';
      }
      if (!perms?.has(PermissionFlagsBits.EmbedLinks)) {
        return 'The bot is missing permission to send embeds in that channel.';
      }

      const headline = sanitizeText(input.headline, 120) || `Status update · ${guild.name}`;
      const body = sanitizeMultiline(input.message, 900) || 'Fresh snapshot generated from the NT Canary dashboard.';
      const accent = parseColor(input.accentColor);
      const includeStats = String(input.includeStats ?? 'on').toLowerCase() !== 'off';
      const mentionRole = sanitizeSnowflake(input.pingRole);

      const embed = new EmbedBuilder()
        .setTitle(headline)
        .setDescription(body)
        .setTimestamp(new Date())
        .setColor(accent ?? 0x5865f2)
        .setFooter({
          text: `Requested by ${req?.user?.username || 'dashboard'}`,
          iconURL: req?.user?.avatar
            ? `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png?size=64`
            : undefined,
        });

      if (includeStats) {
        collectStats(guild).forEach((field) => embed.addFields(field));
      }

      const content = mentionRole ? `<@&${mentionRole}>` : undefined;

      await channel.send({
        content,
        embeds: [embed],
        allowedMentions: mentionRole ? { roles: [mentionRole] } : { parse: [] },
      });

      console.info('[ServerSnapshot] Snapshot delivered', {
        guildId: guild.id,
        channelId: channel.id,
        user: req?.user?.id || 'unknown',
      });

      return `Published a snapshot to #${channel.name}.`;
    } catch (error) {
      console.error('[ServerSnapshot] Failed to post snapshot:', error);
      const safeMessage = typeof error?.message === 'string' ? error.message : 'Unknown error';
      return `We could not post the snapshot (${safeMessage}).`;
    }
  },
};

function sanitizeText(value, max = 200) {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim().replace(/\s+/g, ' ');
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

function sanitizeMultiline(value, max = 1200) {
  if (typeof value !== 'string') return undefined;
  const cleaned = value.replace(/\r/g, '').trim();
  if (!cleaned) return undefined;
  return cleaned.slice(0, max);
}

function sanitizeSnowflake(value) {
  if (typeof value !== 'string' && typeof value !== 'number') return undefined;
  const normalized = String(value).trim();
  if (!/^\d{17,20}$/.test(normalized)) return undefined;
  return normalized;
}

function parseColor(value) {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim();
  if (!normalized) return undefined;

  if (normalized.toUpperCase() === 'RANDOM') {
    return Math.floor(Math.random() * 0xffffff);
  }

  try {
    if (/^#?[0-9A-F]{6}$/i.test(normalized)) {
      return resolveColor(normalized.startsWith('#') ? normalized : `#${normalized}`);
    }
    return resolveColor(normalized);
  } catch {
    return undefined;
  }
}

function isTextChannel(channel) {
  if (!channel) return false;
  if (typeof channel.isTextBased === 'function') {
    return channel.isTextBased();
  }
  const supported = new Set([
    ChannelType.GuildText,
    ChannelType.GuildAnnouncement,
    ChannelType.PublicThread,
    ChannelType.PrivateThread,
    ChannelType.AnnouncementThread,
    ChannelType.GuildForum,
  ]);
  return supported.has(channel.type);
}

function collectStats(guild) {
  const channels = guild.channels?.cache || new Map();
  const roles = guild.roles?.cache?.size ?? 0;

  const textChannels = Array.from(channels.values()).filter((ch) => ch?.type === ChannelType.GuildText).length;
  const voiceChannels = Array.from(channels.values()).filter(
    (ch) => ch?.type === ChannelType.GuildVoice || ch?.type === ChannelType.GuildStageVoice,
  ).length;

  return [
    {
      name: 'Members',
      value: formatNumber(guild.memberCount ?? 0),
      inline: true,
    },
    {
      name: 'Text Channels',
      value: formatNumber(textChannels),
      inline: true,
    },
    {
      name: 'Voice Channels',
      value: formatNumber(voiceChannels),
      inline: true,
    },
    {
      name: 'Roles',
      value: formatNumber(roles),
      inline: true,
    },
  ];
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return '0';
  }
  return new Intl.NumberFormat('en-US').format(value);
}

async function safeFetch(fn) {
  try {
    return await fn();
  } catch {
    return null;
  }
}
