const fs = require('fs');
const path = require('path');

const SERVER_SETTINGS_PATH = path.join(process.cwd(), 'data', 'serverSettings.json');
const DEFAULT_PREFIX = '!';

function ensureStorage() {
  const directory = path.dirname(SERVER_SETTINGS_PATH);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  if (!fs.existsSync(SERVER_SETTINGS_PATH)) {
    fs.writeFileSync(SERVER_SETTINGS_PATH, '{}', { encoding: 'utf8', mode: 0o600 });
  }
}

function readPrefixes() {
  try {
    ensureStorage();
    const raw = fs.readFileSync(SERVER_SETTINGS_PATH, 'utf8');
    if (!raw || !raw.trim()) {
      return {};
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch (error) {
    console.error('[ServerPrefixManager] Failed to read server prefixes:', error.message);
  }
  return {};
}

function writePrefixes(prefixes) {
  try {
    ensureStorage();
    fs.writeFileSync(SERVER_SETTINGS_PATH, JSON.stringify(prefixes, null, 2), { encoding: 'utf8', mode: 0o600 });
    return true;
  } catch (error) {
    console.error('[ServerPrefixManager] Failed to write server prefixes:', error.message);
    return false;
  }
}

function normalizePrefix(input) {
  if (typeof input !== 'string') {
    return null;
  }
  const trimmed = input.trim();
  if (!trimmed || trimmed.length > 10) {
    return null;
  }
  return trimmed;
}

function listPrefixes() {
  return readPrefixes();
}

function getPrefix(guildId, fallbackPrefix = DEFAULT_PREFIX) {
  if (!guildId) {
    return fallbackPrefix;
  }
  const prefixes = readPrefixes();
  const value = prefixes[guildId];
  return typeof value === 'string' && value.length ? value : fallbackPrefix;
}

/**
 * Sync prefix changes to server_prefixes_EXT extension if it's loaded
 * This ensures both systems stay in sync without conflicts
 */
function syncPrefixToExtension(guildId, prefix) {
  try {
    // Use compatibility module if available for better detection
    let compatibilityModule = null;
    try {
      compatibilityModule = require('./server-prefix-compatibility');
    } catch (e) {
      // Compatibility module not available, use direct sync
    }

    if (compatibilityModule && compatibilityModule.syncToExtension) {
      compatibilityModule.syncToExtension(guildId, prefix);
      return;
    }

    // Fallback: Direct sync (original method)
    if (typeof DBM !== 'undefined' && DBM.Bot && DBM.Bot.bot) {
      const bot = DBM.Bot.bot;
      const guild = bot.guilds ? bot.guilds.cache.get(guildId) : null;

      if (guild) {
        if (prefix) {
          // Set the prefix on the guild object (how server_prefixes_EXT stores it)
          guild.prefix = prefix;
        } else {
          // Reset to default prefix (from settings.json or default)
          const defaultPrefix =
            DBM?.Files?.data?.settings?.tag && DBM.Files.data.settings.tag.trim().length
              ? DBM.Files.data.settings.tag.trim()
              : DEFAULT_PREFIX;
          guild.prefix = defaultPrefix;
        }
      }
    }
  } catch (error) {
    // Silently fail - extension might not be loaded, which is fine
    // This is just a sync attempt, not critical
  }
}

function setPrefix(guildId, prefix) {
  const normalized = normalizePrefix(prefix);
  if (!guildId || !normalized) {
    throw new Error('Invalid guild ID or prefix provided.');
  }
  const prefixes = readPrefixes();
  prefixes[guildId] = normalized;
  writePrefixes(prefixes);

  // Sync with server_prefixes_EXT if it's loaded
  syncPrefixToExtension(guildId, normalized);

  return normalized;
}

function removePrefix(guildId) {
  if (!guildId) {
    return false;
  }
  const prefixes = readPrefixes();
  if (Object.prototype.hasOwnProperty.call(prefixes, guildId)) {
    delete prefixes[guildId];
    const result = writePrefixes(prefixes);

    // Sync with server_prefixes_EXT if it's loaded (reset to default)
    syncPrefixToExtension(guildId, null);

    return result;
  }
  return true;
}

/**
 * Reload all prefixes from file (useful when server_prefixes_EXT loads prefixes on startup)
 * This ensures the dashboard reads the same data the extension wrote
 */
function reloadPrefixes() {
  try {
    const prefixes = readPrefixes();

    // Sync all prefixes to extension if loaded
    if (typeof DBM !== 'undefined' && DBM.Bot && DBM.Bot.bot) {
      const bot = DBM.Bot.bot;
      if (bot.guilds && bot.guilds.cache) {
        const defaultPrefix =
          DBM?.Files?.data?.settings?.tag && DBM.Files.data.settings.tag.trim().length
            ? DBM.Files.data.settings.tag.trim()
            : DEFAULT_PREFIX;

        bot.guilds.cache.forEach((guild) => {
          const prefix = prefixes[guild.id];
          guild.prefix = prefix && typeof prefix === 'string' && prefix.length ? prefix : defaultPrefix;
        });
      }
    }

    return prefixes;
  } catch (error) {
    console.error('[ServerPrefixManager] Failed to reload prefixes:', error.message);
    return {};
  }
}

module.exports = {
  DEFAULT_PREFIX,
  normalizePrefix,
  listPrefixes,
  getPrefix,
  setPrefix,
  removePrefix,
  reloadPrefixes,
  syncPrefixToExtension,
};
