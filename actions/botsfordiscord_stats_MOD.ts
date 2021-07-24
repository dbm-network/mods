import type { Action, ActionCache, Actions } from '../typings/globals';

export class SendStatsToBFD implements Action {
  static section = 'Other Stuff';
  static fields = ['BFDToken', 'ClientID', 'info'];

  subtitle() {
    return 'Send server count to BFD!';
  }

  html() {
    return `
<div>
  <p>
    <u>Send Server Stats To BFD</u><br>
    This will send your bot server count to Bots For Discord
  </p>
</div>
<div id="modinfo">
<div style="float: left; width: 99%; padding-top: 8px;">
  Your BFD token:<br>
  <input id="BFDToken" class="round" type="text"><br>
  Your bot ID:<br>
  <input id="ClientID" class="round" type="text">
  <br>Please make sure you don't put this action on a short interval - it can cause 429 (rate limit) errors!
</div><br>`;
  }

  init() {}

  action(this: Actions, cache: ActionCache) {
    const data = cache.actions[cache.index];
    const token = this.evalMessage(data.BFDToken, cache);
    const clientID = this.evalMessage(data.ClientID, cache);
    const Mods = this.getMods();
    const BFD = Mods.require('bfd-api');
    const bfd = new BFD(token);
    bfd.postCount(this.getDBM().Bot.bot.guilds.cache.size, clientID);
    this.callNextAction(cache);
  }

  mod() {}
}

Object.defineProperty(SendStatsToBFD, 'name', { value: 'Send Stats to BFD' });
