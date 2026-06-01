const {
    ChannelType,
    EmbedBuilder,
    Colors,
    PermissionFlagsBits,
    resolveColor
} = require("discord.js");

const validator = require("validator");

const SAFE_MAX_TITLE = 256;
const SAFE_MAX_AUTHOR = 256;
const SAFE_MAX_DESCRIPTION = 4000;
const SAFE_MAX_FOOTER = 2048;

function cleanString(value, { maxLength = 1024, allowNewLines = false } = {}) {
    if (typeof value !== "string") {
        return undefined;
    }

    let sanitized = value.trim();
    if (!allowNewLines) {
        sanitized = sanitized.replace(/[\r\n]+/g, " ");
    } else {
        sanitized = sanitized.replace(/\r/g, "");
    }

    // Remove non-printable characters except basic punctuation/newlines
    sanitized = sanitized.replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "");

    if (sanitized.length > maxLength) {
        sanitized = sanitized.slice(0, maxLength);
    }

    return sanitized.length ? sanitized : undefined;
}

function cleanUrl(value) {
    if (typeof value !== "string") {
        return undefined;
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return undefined;
    }

    if (!validator.isURL(trimmed, { require_protocol: true })) {
        return undefined;
    }

    return trimmed;
}

function parseColor(input) {
    if (typeof input !== "string") {
        return undefined;
    }

    const normalized = input.trim();
    if (!normalized) {
        return undefined;
    }

    if (normalized.toUpperCase() === "RANDOM") {
        return Colors.Random;
    }

    try {
        if (/^#?[0-9A-F]{6}$/i.test(normalized)) {
            const hex = normalized.startsWith("#") ? normalized : `#${normalized}`;
            return resolveColor(hex);
        }

        return resolveColor(normalized);
    } catch {
        return undefined;
    }
}

function ensureTextChannel(channel) {
    if (!channel) return false;
    const supportedTypes = new Set([
        ChannelType.GuildText,
        ChannelType.GuildAnnouncement,
        ChannelType.PublicThread,
        ChannelType.PrivateThread,
        ChannelType.AnnouncementThread
    ]);

    return typeof channel.isTextBased === "function"
        ? channel.isTextBased() && supportedTypes.has(channel.type)
        : supportedTypes.has(channel.type);
}

module.exports = {
    /**
     * Executes the Send Embed Message dashboard mod.
     * @param {import("discord.js")} DBM
     */
    async run(DBM, req, res, Dashboard, server) {
        try {
            const bot = DBM?.Bot?.bot;
            if (!bot) {
                console.error("[SendEmbedMessage] Discord client unavailable.");
                return "Bot client is not ready. Please try again later.";
            }

            const input = req?.body || {};

            const guildIdentifier =
                input.server ||
                req?.params?.serverID ||
                req?.params?.serverId ||
                req?.params?.guildID ||
                req?.params?.guildId;

            const guildType = input.serverType || "id";

            const resolvedGuild = await resolveGuild({
                bot,
                providedGuild: server,
                guildType,
                guildIdentifier
            });

            if (!resolvedGuild) {
                console.warn("[SendEmbedMessage] Guild resolution failed", {
                    providedGuild: Boolean(server),
                    guildIdentifier,
                    guildType
                });
                return "Unable to locate the requested server. Verify the guild ID or name.";
            }

            const targetChannel = await resolveChannel({
                guild: resolvedGuild,
                channelType: input.channelType,
                channelIdentifier: input.channel
            });

            if (!targetChannel) {
                return "Unable to locate the requested channel. Verify the channel ID or name.";
            }

            if (!ensureTextChannel(targetChannel)) {
                return "The selected channel does not support text messages or embeds.";
            }

            const botMember = resolvedGuild.members.me || (await resolvedGuild.members.fetch(bot.user.id));
            const perms = targetChannel.permissionsFor(botMember);
            if (!perms?.has(PermissionFlagsBits.SendMessages)) {
                return "The bot is missing permission to send messages in the selected channel.";
            }
            if (!perms.has(PermissionFlagsBits.EmbedLinks)) {
                return "The bot is missing permission to send embeds in the selected channel.";
            }

            const embed = buildEmbed(input);

            await targetChannel.send({
                embeds: [embed],
                allowedMentions: { parse: [] }
            });

            console.info(
                "[SendEmbedMessage] Embed delivered",
                {
                    guildId: resolvedGuild.id,
                    channelId: targetChannel.id,
                    authorId: req?.user?.id || "unknown"
                }
            );

            return `Successfully sent the embed to #${targetChannel.name} in ${resolvedGuild.name}.`;
        } catch (error) {
            const safeMessage = typeof error?.message === "string" ? error.message : String(error);
            const sanitizedMessage = safeMessage.replace(/\s+/g, " ").slice(0, 180);

            console.error("[SendEmbedMessage] Failed to send embed:", {
                error: safeMessage,
                server: req?.params?.serverID || req?.params?.serverId || req?.body?.server,
                channel: req?.body?.channel,
                user: req?.user?.id || "unknown"
            });

            return `We couldn't send the embed (Discord responded: ${sanitizedMessage || "Unknown error"}). Please verify permissions and try again.`;
        }
    }
};

async function resolveGuild({ bot, providedGuild, guildType, guildIdentifier }) {
    if (providedGuild) {
        return providedGuild;
    }

    if (!guildIdentifier) {
        return undefined;
    }

    const safeIdentifier = guildIdentifier.toString().trim();
    if (!safeIdentifier) {
        return undefined;
    }

    const guildCache = bot.guilds?.cache;

    if (!guildType || guildType === "id") {
        const cachedGuild = getFromCache(guildCache, safeIdentifier);
        if (cachedGuild) {
            return cachedGuild;
        }
        return await bot.guilds.fetch(safeIdentifier).catch(() => undefined);
    }

    const lowerName = safeIdentifier.toLowerCase();
    return findInCache(guildCache, (guild) => guild?.name && guild.name.toLowerCase() === lowerName);
}

async function resolveChannel({ guild, channelType, channelIdentifier }) {
    if (!channelIdentifier) {
        return undefined;
    }

    const trimmed = channelIdentifier.toString().trim();
    if (!trimmed) {
        return undefined;
    }

    const channelCache = guild.channels?.cache;

    if (!channelType || channelType === "id") {
        const cachedChannel = getFromCache(channelCache, trimmed);
        if (cachedChannel) {
            return cachedChannel;
        }
        return await guild.channels.fetch(trimmed).catch(() => undefined);
    }

    const lowerName = trimmed.toLowerCase();
    return findInCache(channelCache, (channel) => channel?.name && channel.name.toLowerCase() === lowerName);
}

function buildEmbed(input) {
    const embed = new EmbedBuilder();

    const color = parseColor(input.color);
    if (color) {
        embed.setColor(color);
    }

    const title = cleanString(input.title, { maxLength: SAFE_MAX_TITLE });
    if (title) {
        embed.setTitle(title);
    }

    const url = cleanUrl(input.url);
    if (url) {
        embed.setURL(url);
    }

    const authorName = cleanString(input.author, { maxLength: SAFE_MAX_AUTHOR });
    const authorIcon = cleanUrl(input.authorpic);
    if (authorName) {
        const authorOptions = { name: authorName };
        if (authorIcon) {
            authorOptions.iconURL = authorIcon;
        }
        embed.setAuthor(authorOptions);
    }

    const description = cleanString(input.description, { maxLength: SAFE_MAX_DESCRIPTION, allowNewLines: true });
    if (description) {
        embed.setDescription(description);
    }

    const thumbnail = cleanUrl(input.thumb);
    if (thumbnail) {
        embed.setThumbnail(thumbnail);
    }

    const image = cleanUrl(input.image);
    if (image) {
        embed.setImage(image);
    }

    const footerText = cleanString(input.footer, { maxLength: SAFE_MAX_FOOTER });
    const footerIcon = cleanUrl(input.footerurl);
    if (footerText || footerIcon) {
        embed.setFooter({
            text: footerText || " ",
            iconURL: footerIcon
        });
    }

    embed.setTimestamp(new Date());

    return embed;
}

function getFromCache(cache, key) {
    if (!cache || !key) {
        return undefined;
    }

    if (typeof cache.get === "function") {
        const direct = cache.get(key);
        if (direct) {
            return direct;
        }
    }

    if (cache instanceof Map) {
        return cache.get(key);
    }

    if (Array.isArray(cache)) {
        return cache.find((item) => item?.id === key || item?.name === key);
    }

    if (typeof cache === "object") {
        return cache[key];
    }

    return undefined;
}

function findInCache(cache, predicate) {
    if (!cache || typeof predicate !== "function") {
        return undefined;
    }

    if (typeof cache.find === "function") {
        return cache.find(predicate);
    }

    if (cache instanceof Map) {
        for (const value of cache.values()) {
            if (predicate(value)) {
                return value;
            }
        }
        return undefined;
    }

    if (Array.isArray(cache)) {
        return cache.find(predicate);
    }

    if (typeof cache === "object") {
        return Object.values(cache).find(predicate);
    }

    return undefined;
}
