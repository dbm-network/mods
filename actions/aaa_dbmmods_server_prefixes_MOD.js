/* eslint-disable func-names */

module.exports = {
  name: 'Mods',
  section: '#DBM Mods',
  displayName: 'Dependencies',

  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadUrl: 'https://github.com/dbm-network/mods/blob/master/actions/aaa_dbmmods_server_prefixes_MOD.js',
  },

  html() {
    return `
    <div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
      <p>
        <u>DBM Mods Server Prefixes:</u><br><br>
        This isn't an action, but it is required for server prefixes.<br><br>
        <bCreate action wont do anything</b>
      </p>
    </div>`;
  },

  mod(DBM) {
    const { QuickDB } = require('quick.db');
    const db = new QuickDB();

    // --- Redefine Bot.populateTagRegex ---
    // This function needs to accept tag and allowPrefixSpace parameters now
    DBM.Bot.populateTagRegex = function (tag, allowPrefixSpace) {
      // Only re-populate if the tag or allowPrefixSpace has changed
      if (this.tagRegex && this._currentTag === tag && this._currentAllowPrefixSpace === allowPrefixSpace) {
        return this.tagRegex;
      }

      this.tagRegex = this.generateTagRegex(tag, allowPrefixSpace);
      this._currentTag = tag; // Store the current tag
      this._currentAllowPrefixSpace = allowPrefixSpace; // Store the current allowPrefixSpace
      return this.tagRegex;
    };

    // --- Redefine Bot.checkTag ---
    // This is the core logic for fetching the per-server prefix
    DBM.Bot.checkTag = async function (content, msg) {
      // Made async and added msg parameter
      let tag;
      if (msg.guild) {
        // If it's a guild message
        // Fetch the prefix from quick.db
        const guildPrefix = await db.get(`servers.${msg.guild.id}.prefix`);
        // Use the guild-specific prefix if found, otherwise fall back to the default tag from settings
        tag = guildPrefix || DBM.Files.data.settings.tag;
      } else {
        // For direct messages (DMs)
        tag = DBM.Files.data.settings.tag; // Always use the default tag from settings
      }

      const allowPrefixSpace = DBM.Files.data.settings.allowPrefixSpace === 'true';

      // Regenerate tagRegex with the potentially new tag
      this.populateTagRegex(tag, allowPrefixSpace);

      const separator = DBM.Files.data.settings.separator || '\\s+';

      if (content.startsWith(tag)) {
        if (allowPrefixSpace && this.tagRegex.test(content)) {
          content = content.replace(this.tagRegex, '');
          return content.split(new RegExp(separator))[0];
        }
        content = content.split(new RegExp(separator))[0];
        return content.substring(tag.length);
      }
      return null;
    };

    // --- Redefine Bot.checkCommand ---
    // This needs to be async and call the (now async) checkTag
    DBM.Bot.checkCommand = async function (msg) {
      if (!this._hasTextCommands) return false;
      let command = await this.checkTag(msg.content, msg); // Pass msg and await the result
      if (!command) return false;
      if (!this._caseSensitive) {
        command = command.toLowerCase();
      }
      const cmd = this.$cmds[command];
      if (cmd) {
        DBM.Actions.preformActionsFromMessage(msg, cmd);
        return true;
      }
      return false;
    };

    // --- Redefine Bot.onMessage ---
    // This needs to be async and call the (now async) checkCommand
    DBM.Bot.onMessage = async function (msg) {
      if (msg.author.bot) return;
      try {
        if (!msg.guild) {
          // For DMs, use the default prefix logic
          if (!(await this.checkCommand(msg))) {
            // Await checkCommand for DMs too
            this.onAnyMessage(msg);
          }
          return;
        }
        // For guild messages, check command with async prefix
        const commandHandled = await this.checkCommand(msg);
        if (!commandHandled) {
          this.onAnyMessage(msg);
        }
      } catch (e) {
        console.error(e);
      }
    };

    console.log('DBM Mods Server Prefixes loaded successfully!');

    // You might not need module.exports for simple mod files if DBM just executes them directly,
    // but some DBM setups use it. If your mod doesn't seem to work, try adding an empty export:
    // module.exports = {};
  },
};
