import type { Action } from '../typings/globals';

const action: Action<'prefix'> = {
  name: 'Change Global Prefix',
  section: 'Bot Client Control',

  subtitle() {
    return 'Change Prefix';
  },

  fields: ['prefix'],

  html() {
    return `
  <div>
    Change Prefix to:<br>
    <textarea id="prefix" class="round" style="width: 40%; resize: none;" type="textarea" rows="1" cols="20"></textarea><br><br>
  </div>`;
  },

  init() {},

  action(this, cache) {
    const data = cache.actions[cache.index];

    try {
      const prefix = this.evalMessage(data.prefix, cache);
      if (prefix) {
        this.getDBM().Files.data.settings.tag = prefix;
        this.getDBM().Files.saveData('settings', () => console.log(`Prefix changed to ${prefix}`));
      } else {
        console.log(`${prefix} is not valid! Try again!`);
      }
    } catch (err) {
      console.log(`ERROR! ${err.stack || err}`);
    }
    this.callNextAction(cache);
  },

  mod() {},
};

module.exports = action;
