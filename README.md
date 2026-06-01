<p align="center">
  <a title="DBM Mods" href="https://discord.gg/djcvWRpgHm" target="_blank">
    <img width="80" height="80" alt="DBM-Mods" src="https://github.com/user-attachments/assets/95f2a9da-e476-42f7-bb5b-4c0a9f0c71c7" />
  </a>
</p>
<p align="center">
  <a title="Contributors" href="https://github.com/dbm-network/mods/contributors" target="_blank">
    <img src="https://img.shields.io/github/contributors/dbm-network/mods.svg?style=flat-square" alt="Contributors" />
  </a>
  <a title="Release" href="https://github.com/dbm-network/mods/releases" target="_blank">
    <img src="https://img.shields.io/github/release/dbm-network/mods.svg?style=flat-square" alt="Latest Release" />
  </a>
  <a title="License" href="https://github.com/dbm-network/mods/blob/master/LICENSE.md" target="_blank">
    <img src="https://img.shields.io/github/license/dbm-network/mods.svg?style=flat-square" alt="License" />
  </a>
</p>

[DBM Mods](https://discord.gg/djcvWRpgHm) is a community driven open source project meant to modify, extend, and improve [Discord Bot Maker](https://store.steampowered.com/app/682130/Discord_Bot_Maker/).

## Compatibility

- **Node.js:** 22.x+ (`package.json` engines: `>=22 <27`; CI runs on **22**, **24** (LTS), and **25** (Current); Node **26** is omitted from CI until `actions/setup-node` provides it reliably)
- **DBM Versions:** 1.7, 2.2.0
- **Discord.js Version:** 14.26.2
- **Total Actions:** 515
- **Total Events:** 47
- **Total Extensions:** Includes dashboard, command info, server prefixes, topgg, pastebin, and more

### Dashboard leaderboard database (MySQL / MariaDB)

If you use the **dashboard** extension with the **leaderboard** feature, create the tables from [`sql/leveling_system_schema.sql`](sql/leveling_system_schema.sql):

1. Copy `sql/leveling_system_schema.sql` to your **DBM bot project root** (next to `bot.js`), keeping the path `sql/leveling_system_schema.sql`.
2. In `extensions/dashboard_EXT/config.json`, set `leaderboard.database` (`host`, `user`, `password`, `database`). Do not commit real credentials.
3. In the dashboard admin UI, use the leaderboard database setup (or run the SQL manually in MySQL).

This repository has been fully updated to support Discord.js v14.26.2 with all deprecated methods replaced (EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionFlagsBits, etc.). All files are English-only and follow DBM best practices.

# Downloads

This repository is not meant to be downloaded or cloned. Please follow the installation guide below.

1.  Download the package you need:

| Package    |                                                        Download Link                                                         |
| ---------- | :--------------------------------------------------------------------------------------------------------------------------: |
| Actions    |  [Download](https://dbm-network.github.io/download-git/#/home?url=https://github.com/dbm-network/mods/tree/master/actions)   |
| Events     |   [Download](https://dbm-network.github.io/download-git/#/home?url=https://github.com/dbm-network/mods/tree/master/events)   |
| Extensions | [Download](https://dbm-network.github.io/download-git/#/home?url=https://github.com/dbm-network/mods/tree/master/extensions) |

2.  In the top bar of Discord Bot Maker, click Project → Open Directory of your corresponding package (e.g. Open Actions Directory)
3.  Extract the contents of the .zip file into the folder you just opened
    (Overwrite existing files if asked)

To install extensions you need to move the .js file from the extension folder and place it directly into the extensions folder for your project.

**You will need to repeat this process for all of your projects**
