// Made by TheMonDon#1721
// Some code by General Wrex
const version = '1.2';

// Include discord.js and original check
const { version: djsVersion, ShardingManager } = require('discord.js');
if (djsVersion < '12.0.0') {
  console.log(
    'This version of Discord Bot Maker requires Discord.JS v12.\nPlease use "Project > Module Manager" and "Project > Reinstall Node Modules" to update to Discord.JS v12.',
  );
  throw new Error('Need Discord.JS v12 to Run!!!');
}

console.log('-'.repeat(50));
console.log("TheMonDon's DBM Bot Sharder");
console.log(`Version: ${version}`);
console.log(
  "Available Arguments: '--shard_count=[number]' (default: auto), '--startup=./[bot_file]' (default: ./bot.js), '--timeout=[number]' (default: 30000; use -1 to disable)",
);
console.log('-'.repeat(50));

let totalShards = 'auto';
let startup = './bot.js';
let timeout = 30000;

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
  if (Number.isNaN(timeout)) throw new Error('The shard spawn timeout you passed could not be parsed.');
  console.log(`Shard spawn timeout: ${timeout}`);
}

console.log(`Starting the DBM Bot with ${totalShards === 'auto' ? 'automatic' : totalShards} shards...`);

// dbms' encryption system
const crypto = require('crypto');
let password = '';
let token;

try {
  password = require('discord-bot-maker');
} catch {}

const decrypt = (text) => {
  if (password.length === 0) return text;
  const decipher = crypto.createDecipheriv('aes-128-ofb', password);
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};

const { existsSync, readFileSync } = require('fs');
const { join } = require('path');
const filePath = join(process.cwd(), 'data', 'settings.json');

if (existsSync(filePath)) {
  const content = readFileSync(filePath).toString();
  try {
    token = JSON.parse(decrypt(content)).token;
  } catch (err) {
    console.error('There was issue parsing settings.json! ', err.stack || err);
  }
} else {
  console.error('Could not find the settings.json file');
}

if (!token) {
  console.error("Token must be supplied in 'settings.json' in the data folder, double check your bot settings!");
}

const manager = new ShardingManager(startup, {
  // for ShardingManager options see:
  // https://discord.js.org/#/docs/main/stable/class/ShardingManager
  totalShards,
  token,
});

manager.on('shardCreate', (shard) => console.log(`Shard ${shard.id} launched`));

manager.spawn(totalShards, 5500, timeout);
