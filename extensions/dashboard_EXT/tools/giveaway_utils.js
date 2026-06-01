'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Giveaway System Utilities
 * Handles all file operations with backward compatibility
 * Dashboard will function normally even if giveaway files don't exist
 */

// Calculate path: from tools/ -> dashboard_EXT/ -> data/giveaways
// Store giveaway data within the extension directory for better organization
const GIVEAWAY_BASE_PATH = path.join(__dirname, '..', 'data', 'giveaways');
const GIVEAWAY_FILES = {
  giveaways: path.join(GIVEAWAY_BASE_PATH, 'giveaways.json'),
  templates: path.join(GIVEAWAY_BASE_PATH, 'templates.json'),
  settings: path.join(GIVEAWAY_BASE_PATH, 'settings.json'),
};

/**
 * Check if giveaway system is available
 * @returns {boolean}
 */
function isGiveawaySystemAvailable() {
  try {
    return fs.existsSync(GIVEAWAY_BASE_PATH);
  } catch (error) {
    return false;
  }
}

/**
 * Ensure giveaway directory exists (lazy initialization)
 * @returns {boolean} True if directory exists or was created
 */
function ensureGiveawayDirectory() {
  try {
    if (!fs.existsSync(GIVEAWAY_BASE_PATH)) {
      fs.mkdirSync(GIVEAWAY_BASE_PATH, { recursive: true });
    }
    return true;
  } catch (error) {
    console.warn('[Giveaway Utils] Failed to create giveaway directory:', error.message);
    return false;
  }
}

/**
 * Safely read a JSON file, returning default value if file doesn't exist or is invalid
 * @param {string} filePath - Path to JSON file
 * @param {*} defaultValue - Default value to return if file doesn't exist
 * @returns {*} Parsed JSON or default value
 */
function safeReadJSON(filePath, defaultValue = null) {
  try {
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content || content.trim() === '') {
      return defaultValue;
    }
    return JSON.parse(content);
  } catch (error) {
    console.warn(`[Giveaway Utils] Failed to read ${filePath}:`, error.message);
    return defaultValue;
  }
}

/**
 * Safely write a JSON file, creating directory if needed
 * @param {string} filePath - Path to JSON file
 * @param {*} data - Data to write
 * @returns {boolean} True if write was successful
 */
function safeWriteJSON(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`[Giveaway Utils] Failed to write ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Get all giveaways for a server
 * @param {string} serverId - Discord server ID
 * @returns {Array} Array of giveaways
 */
function getServerGiveaways(serverId) {
  if (!isGiveawaySystemAvailable()) {
    return [];
  }
  const allGiveaways = safeReadJSON(GIVEAWAY_FILES.giveaways, []);
  if (!Array.isArray(allGiveaways)) {
    return [];
  }
  return allGiveaways.filter((g) => g && g.serverId === serverId) || [];
}

/**
 * Get all giveaways (all servers)
 * @returns {Array} Array of all giveaways
 */
function getAllGiveaways() {
  if (!isGiveawaySystemAvailable()) {
    return [];
  }
  const giveaways = safeReadJSON(GIVEAWAY_FILES.giveaways, []);
  return Array.isArray(giveaways) ? giveaways : [];
}

/**
 * Get a specific giveaway by ID
 * @param {string} giveawayId - Giveaway ID
 * @returns {Object|null} Giveaway object or null
 */
function getGiveawayById(giveawayId) {
  if (!isGiveawaySystemAvailable()) {
    return null;
  }
  const giveaways = getAllGiveaways();
  return giveaways.find((g) => g && g.id === giveawayId) || null;
}

/**
 * Save a giveaway (create or update)
 * @param {Object} giveaway - Giveaway object
 * @returns {boolean} True if saved successfully
 */
function saveGiveaway(giveaway) {
  if (!giveaway || !giveaway.id) {
    return false;
  }
  ensureGiveawayDirectory();
  const giveaways = getAllGiveaways();
  const index = giveaways.findIndex((g) => g && g.id === giveaway.id);
  if (index >= 0) {
    giveaways[index] = giveaway;
  } else {
    giveaways.push(giveaway);
  }
  return safeWriteJSON(GIVEAWAY_FILES.giveaways, giveaways);
}

/**
 * Delete a giveaway
 * @param {string} giveawayId - Giveaway ID
 * @returns {boolean} True if deleted successfully
 */
function deleteGiveaway(giveawayId) {
  if (!isGiveawaySystemAvailable()) {
    return false;
  }
  const giveaways = getAllGiveaways();
  const filtered = giveaways.filter((g) => g && g.id !== giveawayId);
  return safeWriteJSON(GIVEAWAY_FILES.giveaways, filtered);
}

/**
 * Get templates for a server
 * @param {string} serverId - Discord server ID
 * @returns {Array} Array of templates
 */
function getServerTemplates(serverId) {
  if (!isGiveawaySystemAvailable()) {
    return [];
  }
  const allTemplates = safeReadJSON(GIVEAWAY_FILES.templates, []);
  if (!Array.isArray(allTemplates)) {
    return [];
  }
  return allTemplates.filter((t) => t && t.serverId === serverId) || [];
}

/**
 * Get a template by ID
 * @param {string} templateId - Template ID
 * @returns {Object|null} Template object or null
 */
function getTemplateById(templateId) {
  if (!isGiveawaySystemAvailable()) {
    return null;
  }
  const templates = safeReadJSON(GIVEAWAY_FILES.templates, []);
  if (!Array.isArray(templates)) {
    return null;
  }
  return templates.find((t) => t && t.id === templateId) || null;
}

/**
 * Save a template
 * @param {Object} template - Template object
 * @returns {boolean} True if saved successfully
 */
function saveTemplate(template) {
  if (!template || !template.id) {
    return false;
  }
  ensureGiveawayDirectory();
  const templates = safeReadJSON(GIVEAWAY_FILES.templates, []);
  const index = templates.findIndex((t) => t && t.id === template.id);
  if (index >= 0) {
    templates[index] = template;
  } else {
    templates.push(template);
  }
  return safeWriteJSON(GIVEAWAY_FILES.templates, templates);
}

/**
 * Delete a template
 * @param {string} templateId - Template ID
 * @returns {boolean} True if deleted successfully
 */
function deleteTemplate(templateId) {
  if (!isGiveawaySystemAvailable()) {
    return false;
  }
  const templates = safeReadJSON(GIVEAWAY_FILES.templates, []);
  const filtered = templates.filter((t) => t && t.id !== templateId);
  return safeWriteJSON(GIVEAWAY_FILES.templates, filtered);
}

/**
 * Get server giveaway settings
 * @param {string} serverId - Discord server ID
 * @returns {Object} Settings object with defaults
 */
function getServerSettings(serverId) {
  if (!isGiveawaySystemAvailable()) {
    return getDefaultSettings();
  }
  const allSettings = safeReadJSON(GIVEAWAY_FILES.settings, {});
  if (!allSettings || typeof allSettings !== 'object') {
    return getDefaultSettings();
  }
  return Object.assign({}, getDefaultSettings(), allSettings[serverId] || {});
}

/**
 * Save server giveaway settings
 * @param {string} serverId - Discord server ID
 * @param {Object} settings - Settings object
 * @returns {boolean} True if saved successfully
 */
function saveServerSettings(serverId, settings) {
  if (!serverId) {
    return false;
  }
  ensureGiveawayDirectory();
  let allSettings = safeReadJSON(GIVEAWAY_FILES.settings, {});
  if (!allSettings || typeof allSettings !== 'object') {
    allSettings = {};
  }
  allSettings[serverId] = Object.assign({}, getDefaultSettings(), settings);
  return safeWriteJSON(GIVEAWAY_FILES.settings, allSettings);
}

/**
 * Get default giveaway settings
 * @returns {Object} Default settings object
 */
function getDefaultSettings() {
  return {
    // Bot settings
    prefix: '!',
    language: 'en',

    // Role management (max 5 each)
    creatorRoles: [], // Roles that can create/schedule giveaways only
    managerRoles: [], // Roles that can access all giveaway commands and dashboard

    // DM settings
    dmGiveawayHost: false, // DM host when giveaway ends
    dmGiveawayWinners: false, // DM winners when they win

    // Winner role
    winnerRole: null, // Role to add to winners when giveaway ends

    // Captcha
    showCaptcha: false, // Show captcha when entering giveaways (FEATURED)

    // Public giveaways
    publicGiveaways: false, // List giveaways in public page
    publicChannel: null, // Channel for public giveaway invites

    // Default extra entries (role-based, 1-100 or 250 with premium)
    defaultExtraEntries: {}, // { roleId: entryCount }

    // Default template
    defaultTemplate: null, // Template ID to auto-copy into new giveaways

    // Default embed colors
    defaultEmbedColor: '#338ac4',
    defaultEndEmbedColor: '#f04747',

    // Default host
    defaultHost: null, // Default host for all giveaways (user mention, role mention, text, etc.)

    // Create message
    defaultCreateMessage:
      'To enter click the 🎉 below!\nRequirements: N/A\nIf you win the giveaway, you have 24 hours to claim the reward.',

    // Leveling
    leveling: false, // Track levels in server
    levelUpChannel: null, // Channel for level up messages (null = same channel as message)

    // Logger
    logger: false, // Log all bot activities
    loggerChannel: null, // Channel for logs

    // Message counter
    messageCounter: false, // Count daily/weekly/monthly/total messages
    messageCounterBlacklist: [], // Channel IDs to blacklist from message counter
  };
}

/**
 * Generate a unique ID for giveaways/templates
 * @returns {string} Unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

module.exports = {
  isGiveawaySystemAvailable,
  ensureGiveawayDirectory,
  safeReadJSON,
  safeWriteJSON,
  getServerGiveaways,
  getAllGiveaways,
  getGiveawayById,
  saveGiveaway,
  deleteGiveaway,
  getServerTemplates,
  getTemplateById,
  saveTemplate,
  deleteTemplate,
  getServerSettings,
  saveServerSettings,
  getDefaultSettings,
  generateId,
  GIVEAWAY_BASE_PATH,
  GIVEAWAY_FILES,
};
