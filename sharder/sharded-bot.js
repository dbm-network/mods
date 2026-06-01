// Made by themondon
// Some code by General Wrex
const version = '1.5.0';

// Include discord.js and original check
const { version: djsVersion, ShardingManager } = require('discord.js');

const requiredDjsVersion = '14.26.2';
if (requiredDjsVersion.localeCompare(djsVersion, { numeric: true, sensitivity: 'base' }) > 0) {
  console.log(
    `This version of Discord Bot Maker requires discord.js ${requiredDjsVersion}+.
It is currently ${djsVersion}.
Please use "Project > Module Manager" and "Project > Reinstall Node Modules" to update to discord.js ${requiredDjsVersion}.\n\n`,
  );
  throw new Error(`Need discord.js ${requiredDjsVersion} to run!!!`);
}

console.log('-'.repeat(50));
console.log("TheMonDon's DBM Bot Sharder");
console.log(`Version: ${version}`);
console.log(
  "Available Arguments: '--shard_count=[number]' (default: auto), '--startup=./[bot_file]' (default: ./bot.js), '--timeout=[number]' (default: 60000; use -1 to disable)",
);
console.log('-'.repeat(50));

const DEFAULT_STARTUP = './bot.js';
const ENV_TOKEN_KEYS = ['DBM_SHARD_TOKEN', 'DISCORD_TOKEN', 'DBM_TOKEN', 'BOT_TOKEN', 'TOKEN'];

let totalShards = 'auto';
let startup = DEFAULT_STARTUP;
let timeout = 60000;
let cliToken;

function getArgs() {
  const args = {};
  process.argv.slice(2, process.argv.length).forEach((arg) => {
    if (arg.slice(0, 2) === '--') {
      const longArg = arg.split('=');
      const longArgFlag = longArg[0].slice(2, longArg[0].length);
      const longArgValue = longArg.length > 1 ? longArg[1] : true;
      args[longArgFlag] = longArgValue;
    } else if (arg[0] === '-') {
      const flags = arg.slice(1, arg.length).split('');
      flags.forEach((flag) => {
        args[flag] = true;
      });
    }
  });
  return args;
}

const args = getArgs();
if (args.shard_count) {
  totalShards = parseInt(args.shard_count, 10);
}
if (args.startup) {
  startup = args.startup;
  console.log(`Using bot file: ${startup}`);
}
if (args.timeout) {
  timeout = parseInt(args.timeout, 10);
  if (Number.isNaN(timeout)) {
    throw new Error('The shard spawn timeout you passed could not be parsed.');
  }
  console.log(`Shard spawn timeout: ${timeout}`);
}
if (args.token) {
  cliToken = args.token;
  console.log('Using token from command line (--token).');
}

console.log(`Starting the DBM Bot with ${totalShards === 'auto' ? 'automatic' : totalShards} shards...`);

// dbms' encryption system
const crypto = require('crypto');
let passwordExport;
try {
  passwordExport = require('discord-bot-maker');
} catch {
  passwordExport = undefined;
}

const resolveSecretCandidates = (secret) => {
  const candidates = [];
  if (!secret) return candidates;

  if (typeof secret === 'string') {
    const utf8Buf = Buffer.from(secret, 'utf8');
    if (utf8Buf.length >= 16) {
      candidates.push({ algorithm: 'aes-128-ofb', key: utf8Buf.slice(0, 16), iv: utf8Buf.slice(0, 16) });
    }
    try {
      const hexBuf = Buffer.from(secret, 'hex');
      if (hexBuf.length >= 16) {
        const key = hexBuf.slice(0, 16);
        const iv = hexBuf.slice(hexBuf.length - 16);
        candidates.push({ algorithm: 'aes-128-ofb', key, iv });
      }
    } catch {
      // ignore invalid hex conversion
    }
  } else if (typeof secret === 'object' && secret) {
    const algorithm = secret.algorithm || 'aes-128-ofb';
    const encoding = secret.encoding || 'hex';
    try {
      const key = secret.key ? Buffer.from(secret.key, encoding) : undefined;
      const iv = secret.iv ? Buffer.from(secret.iv, encoding) : undefined;
      if (key && iv) {
        candidates.push({ algorithm, key, iv });
      }
    } catch {
      // ignore invalid buffer creation
    }
  }

  return candidates;
};

const tryDecryptSettings = (raw) => {
  const candidates = resolveSecretCandidates(passwordExport);
  for (const candidate of candidates) {
    try {
      const decipher = crypto.createDecipheriv(candidate.algorithm, candidate.key, candidate.iv);
      let decrypted = decipher.update(raw, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch {
      // continue to next candidate
    }
  }
  return null;
};

const safeParseJSON = (raw) => {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const { existsSync, readFileSync } = require('fs');
const { join } = require('path');

const settingsPaths = [join(process.cwd(), 'data', 'settings.json'), join(process.cwd(), 'settings.json')];

let settingsLoadedFrom;

const loadSettings = () => {
  for (const candidatePath of settingsPaths) {
    if (!existsSync(candidatePath)) continue;

    const raw = readFileSync(candidatePath, 'utf8').trim();
    if (!raw) continue;

    let parsed = null;
    if (raw.startsWith('{') || raw.startsWith('[')) {
      parsed = safeParseJSON(raw);
    }

    if (!parsed) {
      const decrypted = tryDecryptSettings(raw);
      if (decrypted) {
        parsed = safeParseJSON(decrypted);
      }
    }

    if (!parsed) continue;

    settingsLoadedFrom = candidatePath;
    return parsed;
  }

  return null;
};

const settings = loadSettings();
if (!settings && args.debug) {
  console.warn('Settings file could not be located or parsed.');
}

const resolveToken = () => {
  if (cliToken) return cliToken;

  for (const key of ENV_TOKEN_KEYS) {
    if (process.env[key]) {
      console.log(`Using token from environment variable ${key}.`);
      return process.env[key];
    }
  }

  if (settings?.token) {
    if (settingsLoadedFrom) {
      console.log(`Using token from ${settingsLoadedFrom}.`);
    }
    return settings.token;
  }

  return null;
};

const token = resolveToken();

if (!token) {
  console.error(
    "Token must be supplied. Provide it via '--token', an environment variable (DISCORD_TOKEN / DBM_SHARD_TOKEN), or inside 'data/settings.json'.",
  );
  process.exit(1);
}

const manager = new ShardingManager(startup, {
  // for ShardingManager options see:
  // https://discord.js.org/#/docs/main/stable/class/ShardingManager
  totalShards,
  token,
});

manager.on('shardCreate', (shard) => {
  shard.on('reconnecting', () => {
    console.log(`Shard [${shard.id}] is reconnecting`);
  });
  shard.on('spawn', () => {
    console.log(`Shard [${shard.id}] spawned`);
  });
  shard.on('ready', () => {
    console.log(`Shard [${shard.id}] is ready`);
  });
  shard.on('death', () => {
    console.log(`Shard [${shard.id}] died`);
  });
  shard.on('error', (err) => {
    console.error(`Error in Shard [${shard.id}]: `, err);
  });
});

manager.spawn({ amount: totalShards, delay: 15500, timeout }).catch(console.error);
