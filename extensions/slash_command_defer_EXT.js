/**
 * DBM Extension: Slash Command Defer Helper
 *
 * Provides a global helper for slash commands that need deferReply() to avoid
 * "The application did not respond" errors. Use as first action in commands
 * that run DB queries or slow operations.
 *
 * Usage in DBM Run Script (first action of slash command):
 *   if (typeof deferSlashIfNeeded === 'function') deferSlashIfNeeded(cache);
 *
 * Or add "Start Thinking" / "Respond to Slash Command" (defer) as first action.
 *
 * IMPORTANT: Must export `{ mod: function }` — Actions.initMods() only invokes
 * `action.mod(DBM)`; a bare `module.exports = function` is never called.
 *
 * For nt-main: dashboard.newstargeted.com/nt/extensions/
 */
'use strict';

module.exports = {
  name: 'Slash Command Defer Helper',

  mod(DBM) {
    const Bot = DBM.Bot;
    if (!Bot) return;

    /**
     * @param {object} cache - DBM Actions cache
     * @param {{ ephemeral?: boolean }} [opts] - default ephemeral true; use { ephemeral: false } for public follow-ups (e.g. /ask)
     */
    Bot.deferSlashIfNeeded = function (cache, opts) {
      try {
        const msg = cache.msg || cache.interaction;
        const interaction = msg?.interaction || msg;
        if (interaction && typeof interaction.deferReply === 'function') {
          if (!interaction.replied && !interaction.deferred) {
            const ephemeral =
              opts && Object.prototype.hasOwnProperty.call(opts, 'ephemeral') ? Boolean(opts.ephemeral) : true;
            return interaction.deferReply({ ephemeral });
          }
        }
      } catch (e) {
        console.error('[Slash Defer] Error:', e.message);
      }
      return Promise.resolve();
    };

    if (typeof global !== 'undefined') {
      global.deferSlashIfNeeded = Bot.deferSlashIfNeeded;
    }
    console.log('[Slash Command Defer EXT] Loaded – use deferSlashIfNeeded(cache) or Start Thinking as first action.');
  },
};
