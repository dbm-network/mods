'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/** Current extension menu name (must match nt_ai_bridge_EXT.js `name`). */
const EXTENSION_DISPLAY_NAME = 'NT AI Bridge';

/** Alternate saved extension title (same customData keys). */
const LEGACY_EXTENSION_NAMES = ['NT AI Ask Bridge'];

const EXTENSION_FIELD_KEYS = ['ntAiBridgeUrl', 'ntAiBridgeSecret', 'ntAiAskThumbnailUrl'];

/**
 * Merge customData from current + alternate extension title blocks (non-empty fields).
 * Later names in the chain override earlier for the same key.
 */
function getExtensionOverlay(settingsRoot) {
  if (!settingsRoot || typeof settingsRoot !== 'object') {
    return {};
  }
  const chain = LEGACY_EXTENSION_NAMES.concat([EXTENSION_DISPLAY_NAME]);
  const merged = {};
  try {
    for (let c = 0; c < chain.length; c++) {
      const extName = chain[c];
      const block = settingsRoot[extName];
      const data = block && block.customData && block.customData[extName];
      if (!data || typeof data !== 'object') {
        continue;
      }
      for (let i = 0; i < EXTENSION_FIELD_KEYS.length; i++) {
        const k = EXTENSION_FIELD_KEYS[i];
        const v = String(data[k] == null ? '' : data[k]).trim();
        if (v) {
          merged[k] = v;
        }
      }
    }
    return merged;
  } catch (_) {
    return {};
  }
}

function readSettingsBase() {
  try {
    const g = global.DBM && global.DBM.Files && global.DBM.Files.data && global.DBM.Files.data.settings;
    if (g && typeof g === 'object') {
      return g;
    }
  } catch (_) {}
  try {
    if (typeof Files !== 'undefined' && Files.data && Files.data.settings && typeof Files.data.settings === 'object') {
      return Files.data.settings;
    }
  } catch (_) {}
  const filePath = path.join(process.cwd(), 'data', 'settings.json');
  if (!fs.existsSync(filePath)) {
    return {};
  }
  let raw = fs.readFileSync(filePath, 'utf8');
  let password = '';
  try {
    password = require('discord-bot-maker');
  } catch (_) {}
  if (password && String(password).length > 0) {
    try {
      const decipher = crypto.createDecipher('aes-128-ofb', String(password));
      raw = decipher.update(raw, 'hex', 'utf8') + decipher.final('utf8');
    } catch (_e) {
      console.error('[nt_ai_bridge] settings decrypt failed');
      return {};
    }
  }
  try {
    const data = JSON.parse(raw);
    return data && typeof data === 'object' ? data : {};
  } catch (_e) {
    console.error('[nt_ai_bridge] settings JSON parse failed');
    return {};
  }
}

function getNtAiSettings() {
  const base = readSettingsBase();
  const overlay = getExtensionOverlay(base);
  if (!overlay || Object.keys(overlay).length === 0) {
    return base;
  }
  return Object.assign({}, base, overlay);
}

module.exports = {
  getNtAiSettings,
  /** @deprecated use getNtAiSettings */
  getNtAskSettings: getNtAiSettings,
  EXTENSION_DISPLAY_NAME,
  EXTENSION_FIELD_KEYS,
  LEGACY_EXTENSION_NAMES,
};
