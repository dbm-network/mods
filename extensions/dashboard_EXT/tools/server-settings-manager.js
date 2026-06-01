// ========================================
// Server Settings Manager
// ========================================
// Manages per-server settings for leveling and giveaway systems

const fs = require('fs');
const path = require('path');

const SETTINGS_FILE = path.join(__dirname, '../data/server-settings.json');

// Default settings for a server
const DEFAULT_SETTINGS = {
  levelingEnabled: true, // Enabled by default - servers appear in public leaderboard
  giveawayEnabled: false,
};

// Load all server settings
function loadSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const content = fs.readFileSync(SETTINGS_FILE, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('[ServerSettings] Error loading settings:', error.message);
  }
  return {};
}

// Save all server settings
function saveSettings(settings) {
  try {
    // Ensure directory exists
    const dir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 4), 'utf8');
    return true;
  } catch (error) {
    console.error('[ServerSettings] Error saving settings:', error.message);
    return false;
  }
}

// Get settings for a specific server
function getServerSettings(serverId) {
  const settings = loadSettings();
  const serverIdStr = String(serverId);

  if (settings[serverIdStr]) {
    return {
      ...DEFAULT_SETTINGS,
      ...settings[serverIdStr],
    };
  }

  return { ...DEFAULT_SETTINGS };
}

// Update settings for a specific server
function updateServerSettings(serverId, updates) {
  const settings = loadSettings();
  const serverIdStr = String(serverId);

  if (!settings[serverIdStr]) {
    settings[serverIdStr] = { ...DEFAULT_SETTINGS };
  }

  settings[serverIdStr] = {
    ...settings[serverIdStr],
    ...updates,
    lastUpdated: Date.now(),
  };

  return saveSettings(settings);
}

// Check if leveling is enabled for a server
// Also checks DBM tempVars for levelsystem toggle (global setting)
function isLevelingEnabled(serverId) {
  // First check DBM tempVars if available (Discord /toggle command)
  // This is a global setting, so we check it first
  try {
    // Try to access DBM tempVars through the global scope
    const globalDBM =
      typeof DBM !== 'undefined' ? DBM : typeof global !== 'undefined' && global.DBM ? global.DBM : null;

    if (globalDBM && globalDBM.Files && globalDBM.Files.data) {
      // Check if tempVars exists and has levelsystem
      const tempVars = globalDBM.Files.data.tempVars || {};

      // Check for levelsystem in tempVars (can be "On", "Off", "1", "0", true, false, or number 1/0)
      if (tempVars.levelsystem !== undefined && tempVars.levelsystem !== null) {
        const levelSystemValue = String(tempVars.levelsystem).toLowerCase().trim();

        // If it's explicitly "off", "0", or "false", return false
        if (levelSystemValue === 'off' || levelSystemValue === '0' || levelSystemValue === 'false') {
          return false;
        }

        // If it's "on", "1", or "true", return true
        if (levelSystemValue === 'on' || levelSystemValue === '1' || levelSystemValue === 'true') {
          return true;
        }

        // Also check if it's a number
        const numValue = Number(tempVars.levelsystem);
        if (!isNaN(numValue)) {
          return numValue !== 0;
        }
      }
    }
  } catch (e) {
    // If DBM tempVars check fails, fall through to dashboard settings
    console.warn('[ServerSettings] Error checking DBM tempVars:', e.message);
  }

  // Fall back to dashboard settings
  const serverSettings = getServerSettings(serverId);
  return serverSettings.levelingEnabled === true;
}

// Check if giveaway is enabled for a server
function isGiveawayEnabled(serverId) {
  const serverSettings = getServerSettings(serverId);
  return serverSettings.giveawayEnabled === true;
}

// Get all servers with leveling enabled
// Since default is now true, this returns:
// - All servers that explicitly have levelingEnabled: true
// - Returns null if we should show ALL servers (default enabled, no explicit disables)
function getServersWithLevelingEnabled() {
  const settings = loadSettings();
  const disabledServers = [];

  // Find servers that have explicitly disabled leveling
  for (const [serverId, serverSettings] of Object.entries(settings)) {
    if (serverSettings && serverSettings.levelingEnabled === false) {
      disabledServers.push(serverId);
    }
  }

  // If no servers have explicitly disabled, return null to indicate "all servers" (default enabled)
  // If some servers have disabled, we'll need to filter them out
  // For now, return null to show all (caller will handle filtering if needed)
  return disabledServers.length === 0 ? null : disabledServers;
}

// Get all servers with giveaway enabled
function getServersWithGiveawayEnabled() {
  const settings = loadSettings();
  const enabledServers = [];

  for (const [serverId, serverSettings] of Object.entries(settings)) {
    if (serverSettings && serverSettings.giveawayEnabled === true) {
      enabledServers.push(serverId);
    }
  }

  return enabledServers;
}

module.exports = {
  getServerSettings,
  updateServerSettings,
  isLevelingEnabled,
  isGiveawayEnabled,
  getServersWithLevelingEnabled,
  getServersWithGiveawayEnabled,
  loadSettings,
  saveSettings,
};
