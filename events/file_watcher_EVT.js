module.exports = {
  name: 'File Watcher',
  displayName: 'File Watch Event',
  isEvent: true,

  fields: ['Directory to Watch (Relative to bot directory)', 'Variable Name for Filename'],

  mod(DBM) {
    const { Bot, Actions } = DBM;
    const fs = require('fs');
    const path = require('path');
    DBM.Events = DBM.Events || {};
    const fileWatcher = {};
    DBM.Events.fileWatcher = {};
    fileWatcher.watchers = {};

    fileWatcher.setupWatchers = function setupWatchers() {
      if (!Bot.$evts['File Watcher']) return;

      for (const event of Bot.$evts['File Watcher']) {
        try {
          if (!event.temp || !event.temp2) return;
          const eventName = event.name;
          const watchDir = path.resolve(__dirname, '..', event.temp);
          const variableName = event.temp2;

          const watcher = fs.watch(watchDir, (eventType, filename) => {
            if (eventType === 'rename' && filename) {
              const filePath = path.join(watchDir, filename);
              fs.stat(filePath, (err, stats) => {
                if (err) {
                  console.error(err);
                  return;
                }
                if (stats.isFile()) {
                  const payload = {};
                  payload[variableName] = filename;
                  Actions.invokeEvent(event, null, payload);
                }
              });
            }
          });

          fileWatcher.watchers[eventName] = watcher;
          console.log(`[File Watcher] Event '${eventName}' has been set up for directory '${watchDir}'.`);
        } catch (error) {
          console.error(`Event error: ${error}`);
        }
      }
    };

    const { onReady } = DBM.Bot;
    DBM.Bot.onReady = function fileWatcherOnReady(...params) {
      fileWatcher.setupWatchers();
      onReady.apply(this, params);
    };
  },
};
