**NOTE: Do not use this unless your bot is in over 2000 guilds, there is no point if its below, it uses more resources, and will probably break commands that you already use**

# DBM Bot Sharding

Allows your bot created by Discord Bot Maker to take advantage of sharding!

## Requirements

- Node.js 18+
- discord.js **14.26.2** or newer (matches the mods repository)
- A valid bot token supplied in one of the following ways:
  - `--token=YOUR_TOKEN_HERE`
  - Environment variable (`DBM_SHARD_TOKEN`, `DISCORD_TOKEN`, `DBM_TOKEN`, `BOT_TOKEN`, or `TOKEN`)
  - `data/settings.json` (encrypted or plain JSON)

## Installation

Download the [ZIP file] and extract the file to your bot folder.

Your Bot folder should look like this:

![shard](https://i.imgur.com/sHqbJjV.png)

## Running

Open a Command Prompt window on the bot folder and run `node sharded-bot.js`. It should look somewhat similar to this:

![node](https://i.imgur.com/AKuzOrR.png)

Optional arguments:

- `--shard_count=[number]` – Defaults to `auto` (discord.js determines the count)
- `--startup=./index.js` – Defaults to `./bot.js`
- `--timeout=[milliseconds]` – Defaults to `60000`, use `-1` to disable spawning timeout
- `--token=YOUR_TOKEN` – Overrides any token discovered in settings or environment variables

If you want to provide a different shard count, add `--shard_count=[number]` after `node sharded-bot.js`; ex. `node sharded-bot.js --shard_count=3`.

To change the bot startup file, add `--startup=./index.js` after `node sharded-bot.js`; ex. `node sharded-bot.js --startup=./index.js`.

**If you want to do anything across shards you will need to use** [`client.shard.broadcastEval()`]

For more information in regards to sharding, check [this guide].

[zip file]: https://dbm-network.github.io/download-git/#/home?url=https://github.com/dbm-network/mods/blob/master/sharder/sharded-bot.js
[this guide]: https://discordjs.guide/sharding/
[`client.shard.broadcasteval()`]: https://discord.js.org/#/docs/main/stable/class/ShardClientUtil?scrollTo=broadcastEval
