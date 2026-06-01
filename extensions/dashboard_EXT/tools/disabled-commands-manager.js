const fs = require('fs');
const path = require('path');

const DISABLED_FILE_PATH = path.join(__dirname, '..', 'disabledCommands.json');

function ensureFile() {
  const directory = path.dirname(DISABLED_FILE_PATH);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  if (!fs.existsSync(DISABLED_FILE_PATH)) {
    fs.writeFileSync(DISABLED_FILE_PATH, JSON.stringify({ mods: {}, metadata: {} }, null, 2), {
      encoding: 'utf8',
      mode: 0o600,
    });
  }
}

function loadState() {
  try {
    ensureFile();
    const raw = fs.readFileSync(DISABLED_FILE_PATH, 'utf8');
    if (!raw || !raw.trim()) {
      return { mods: {}, metadata: {} };
    }
    const parsed = JSON.parse(raw);
    if (!parsed.mods || typeof parsed.mods !== 'object') {
      parsed.mods = {};
    }
    if (!parsed.metadata || typeof parsed.metadata !== 'object') {
      parsed.metadata = {};
    }
    return parsed;
  } catch (error) {
    console.error('[DisabledCommandsManager] Failed to read disabled commands file:', error.message);
    return { mods: {}, metadata: {} };
  }
}

function persistState(state) {
  try {
    ensureFile();
    fs.writeFileSync(DISABLED_FILE_PATH, JSON.stringify(state, null, 2), {
      encoding: 'utf8',
      mode: 0o600,
    });
    return true;
  } catch (error) {
    console.error('[DisabledCommandsManager] Failed to persist disabled commands file:', error.message);
    return false;
  }
}

function normalizeKey(name) {
  return String(name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function listDisabledMods() {
  const state = loadState();
  return Object.entries(state.mods)
    .filter(([, entry]) => Boolean(entry?.disabled))
    .map(([key]) => key);
}

function isModDisabled(name) {
  const key = normalizeKey(name);
  if (!key) {
    return false;
  }
  const state = loadState();
  return Boolean(state.mods?.[key]?.disabled);
}

function setModStatus(name, disabled, actorId = 'system') {
  const key = normalizeKey(name);
  if (!key) {
    throw new Error('Invalid command name provided.');
  }
  const state = loadState();
  if (!state.mods || typeof state.mods !== 'object') {
    state.mods = {};
  }

  const timestamp = new Date().toISOString();
  if (disabled) {
    state.mods[key] = {
      disabled: true,
      updatedAt: timestamp,
      updatedBy: String(actorId || 'system'),
    };
  } else if (state.mods[key]) {
    delete state.mods[key];
  }

  state.metadata = Object.assign({}, state.metadata, {
    updatedAt: timestamp,
    updatedBy: String(actorId || 'system'),
  });

  persistState(state);
  return state.mods[key] || null;
}

module.exports = {
  normalizeKey,
  listDisabledMods,
  isModDisabled,
  setModStatus,
};
