module.exports = {
  name: 'Server Prefixes',
  isCommandExtension: false,
  isEventExtension: false,
  isEditorExtension: true,

  fields: [],

  defaultFields: {},

  size() {
    return { width: 500, height: 140 };
  },

  html() {
    return `
<div style="float: left; width: 99%; margin-left: auto; margin-right: auto; padding:10px; text-align: center;">
  <h2>Server Prefixes</h2><hr>
  <p>
    Requires <b><a href="#" onclick="require('child_process').execSync('start https://github.com/dbm-network/mods/tree/master/actions')">Control Server Prefix</a></b>
  </p>
</div>`;
  },

  init() {},

  close() {},

  load() {},

  save() {},

  mod(DBM) {
    const fs = require('fs');
    const path = require('path');
    const { ChannelType } = require('discord.js');
    const { Bot, Files, Actions } = DBM;
    const settingsPath = path.join('data', 'serverSettings.json');
    const legacyPrefixesPath = path.join('data', 'serverPrefixes.json');

    /**
     * Core DBM and actions like Store Command Params call Bot.checkTag(message.content) with a
     * string. The per-server override must accept both Message objects and raw content strings.
     */
    const originalCheckTag = Bot.checkTag.bind(Bot);

    const loadPrefixes = function () {
      const client = Bot.bot;
      let merged = {};
      try {
        if (fs.existsSync(settingsPath)) {
          merged = JSON.parse(fs.readFileSync(settingsPath, 'utf8')) || {};
        }
      } catch (e) {
        console.error('[server_prefixes_EXT] serverSettings.json:', e && e.message);
      }
      try {
        if (fs.existsSync(legacyPrefixesPath)) {
          const extra = JSON.parse(fs.readFileSync(legacyPrefixesPath, 'utf8')) || {};
          merged = Object.assign({}, merged, extra);
        }
      } catch (e) {
        console.error('[server_prefixes_EXT] serverPrefixes.json:', e && e.message);
      }

      if (Object.keys(merged).length === 0 && !fs.existsSync(settingsPath)) {
        try {
          fs.writeFileSync(settingsPath, JSON.stringify({}), 'utf8');
        } catch (e) {
          console.error('[server_prefixes_EXT] create serverSettings:', e && e.message);
        }
      }

      client.guilds.cache.forEach((server) => {
        const p = merged[server.id];
        server.prefix = typeof p === 'string' && p.length > 0 ? p : undefined;
      });
      console.log(`[server_prefixes_EXT] Server prefixes loaded (${client.guilds.cache.size} guilds).`);
    };

    Bot.checkTag = function checkTag(msgOrContent) {
      if (typeof msgOrContent === 'string') {
        return originalCheckTag(msgOrContent);
      }
      const msg = msgOrContent;
      if (!msg || typeof msg.content !== 'string') {
        return null;
      }
      /**
       * Mirror core DBM Bot.checkTag(content) for each possible prefix (guild + global + ;/! alternates),
       * using the message's full content — not only the first token. The previous implementation only did
       * firstToken.substring(prefix.length), which broke allowPrefixSpace, multi-char prefixes with spaces,
       * and could yield "" so no command matched.
       */
      const allowPrefixSpace = Files.data.settings.allowPrefixSpace === 'true';
      const separator = Files.data.settings.separator || '\\s+';
      const sepRe = new RegExp(separator);
      const isDm = !msg.guild || msg.channel?.type === ChannelType.DM || msg.channel?.type === ChannelType.GroupDM;
      const globalTag = String(Files.data.settings.tag || '');
      const guildTag =
        !isDm && msg.guild && msg.guild.prefix != null && String(msg.guild.prefix).length > 0
          ? String(msg.guild.prefix)
          : '';

      const candidates = [];
      if (guildTag) {
        candidates.push(guildTag);
      }
      if (globalTag && !candidates.includes(globalTag)) {
        candidates.push(globalTag);
      }
      if (guildTag === ';' && !candidates.includes('!')) {
        candidates.push('!');
      }
      if (guildTag === '!' && !candidates.includes(';')) {
        candidates.push(';');
      }
      if (globalTag === ';' && !candidates.includes('!')) {
        candidates.push('!');
      }
      if (globalTag === '!' && !candidates.includes(';')) {
        candidates.push(';');
      }

      const content = msg.content;
      for (let i = 0; i < candidates.length; i++) {
        const t = candidates[i];
        if (!t || !content.startsWith(t)) {
          continue;
        }
        if (allowPrefixSpace) {
          const tagRe = new RegExp(`^${Bot.escapeRegExp(t)}\\s*`);
          if (tagRe.test(content)) {
            const after = content.replace(tagRe, '');
            const cmd = after.split(sepRe)[0];
            return cmd.length > 0 ? cmd : '';
          }
        }
        const firstToken = content.split(sepRe)[0];
        if (firstToken.startsWith(t)) {
          return firstToken.substring(t.length);
        }
      }
      return null;
    };

    Bot.checkCommand = function checkCommand(msg) {
      let command = this.checkTag(msg);
      if (command) {
        if (!this._caseSensitive) {
          command = command.toLowerCase();
        }
        const cmd = this.$cmds[command];
        if (cmd) {
          Actions.preformActionsFromMessage(msg, cmd);
          return true;
        }
      }
      return false;
    };

    const { onReady } = Bot;
    Bot.onReady = function serverPrefixesOnReady(...params) {
      loadPrefixes();
      onReady.apply(this, params);
    };
  },
};
