/**
 * Server Prefix Compatibility Module
 *
 * Ensures compatibility between:
 * 1. Dashboard integrated server prefix management
 * 2. server_prefixes_EXT.js extension
 *
 * Both systems use the same data file (data/serverSettings.json),
 * so they're naturally compatible. This module adds synchronization
 * to ensure changes from one system are reflected in the other.
 */

const serverPrefixManager = require('./server-prefix-manager');

/**
 * Check if server_prefixes_EXT.js extension is loaded
 */
function isExtensionLoaded() {
  try {
    if (typeof DBM !== 'undefined' && DBM.Bot && DBM.Bot.bot) {
      const bot = DBM.Bot.bot;
      // Check if Bot.checkTag has been modified by the extension
      // The extension overrides Bot.checkTag to use guild.prefix
      if (bot && typeof bot.checkTag === 'function') {
        // Check if it's the extension's version (uses guild.prefix)
        const checkTagSource = bot.checkTag.toString();
        if (checkTagSource.includes('guild.prefix') || checkTagSource.includes('server.prefix')) {
          return true;
        }
      }
    }
  } catch (error) {
    // Extension not loaded or error checking
  }
  return false;
}

/**
 * Sync a prefix change to the extension's in-memory storage
 * This ensures the extension's Bot.checkTag function uses the updated prefix
 */
function syncToExtension(guildId, prefix) {
  try {
    if (!isExtensionLoaded()) {
      // Extension not loaded, nothing to sync
      return true;
    }

    const bot = DBM.Bot && DBM.Bot.bot ? DBM.Bot.bot : null;
    if (!bot || !bot.guilds) {
      return false;
    }

    const guild = bot.guilds.cache.get(guildId);
    if (!guild) {
      return false;
    }

    if (prefix) {
      // Set custom prefix
      guild.prefix = prefix;
    } else {
      // Reset to default
      const defaultPrefix =
        DBM?.Files?.data?.settings?.tag && DBM.Files.data.settings.tag.trim().length
          ? DBM.Files.data.settings.tag.trim()
          : serverPrefixManager.DEFAULT_PREFIX;
      guild.prefix = defaultPrefix;
    }

    return true;
  } catch (error) {
    console.warn('[ServerPrefixCompatibility] Failed to sync to extension:', error.message);
    return false;
  }
}

/**
 * Reload all prefixes from file and sync to extension
 * Useful when the extension loads prefixes on bot ready
 */
function reloadAndSync() {
  try {
    const prefixes = serverPrefixManager.listPrefixes();
    const defaultPrefix =
      DBM?.Files?.data?.settings?.tag && DBM.Files.data.settings.tag.trim().length
        ? DBM.Files.data.settings.tag.trim()
        : serverPrefixManager.DEFAULT_PREFIX;

    if (isExtensionLoaded()) {
      const bot = DBM.Bot && DBM.Bot.bot ? DBM.Bot.bot : null;
      if (bot && bot.guilds && bot.guilds.cache) {
        bot.guilds.cache.forEach((guild) => {
          const prefix = prefixes[guild.id];
          guild.prefix = prefix && typeof prefix === 'string' && prefix.length ? prefix : defaultPrefix;
        });
      }
    }

    return prefixes;
  } catch (error) {
    console.error('[ServerPrefixCompatibility] Failed to reload and sync:', error.message);
    return {};
  }
}

/**
 * Get prefix for a guild, checking both file and extension's in-memory storage
 * This ensures we always get the most up-to-date prefix
 */
function getPrefix(guildId, fallbackPrefix) {
  // First check the file (source of truth)
  let prefix = serverPrefixManager.getPrefix(guildId, fallbackPrefix);

  // If extension is loaded, also check its in-memory storage
  // This handles cases where extension loaded prefixes but file wasn't updated yet
  if (isExtensionLoaded()) {
    try {
      const bot = DBM.Bot && DBM.Bot.bot ? DBM.Bot.bot : null;
      if (bot && bot.guilds) {
        const guild = bot.guilds.cache.get(guildId);
        if (guild && guild.prefix && guild.prefix !== fallbackPrefix) {
          // Extension has a custom prefix set, use that
          prefix = guild.prefix;
        }
      }
    } catch (error) {
      // Fall back to file-based prefix
    }
  }

  return prefix;
}

module.exports = {
  isExtensionLoaded,
  syncToExtension,
  reloadAndSync,
  getPrefix,
};
