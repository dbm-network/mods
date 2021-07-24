/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { Action, ActionCache, Actions, DBM } from '../typings/globals';

const action: Action<'description' | 'jump_to_anchor' | 'color'> = {
  name: 'Jump to Anchor',
  section: 'Other Stuff',
  fields: ['description', 'jump_to_anchor', 'color'],

  subtitle(data) {
    return data.description
      ? `<font color="${data.color}">${data.description}</font>`
      : `Jump to ${
          data.jump_to_anchor
            ? `the "<font color="${data.color}">${data.jump_to_anchor}</font>" anchor in your command if it exists!`
            : 'an anchor!'
        }`;
  },

  html() {
    return `
      <div>
        <p>
          <u>Mod Info:</u><br>
          This mod will jump to the specified anchor point<br>
          without requiring you to edit any other skips or jumps.<br>
          <b>This is sensitive and must be exactly the same as your anchor name.</b>
        </p>
      </div><br>
      <div style="float: left; width: 74%;">
        Jump to Anchor ID:<br>
        <input type="text" class="round" id="jump_to_anchor"><br>
      </div>
      <div style="float: left; width: 24%;">
        Anchor Color:<br>
        <input type="color" id="color"><br>
      </div>
      <div style="float: left; width: 98%;">
        Description:<br>
        <input type="text" class="round" id="description"><br>
      </div>
    `;
  },

  init() {},

  action(this: Actions, cache: ActionCache) {
    const id = this.evalMessage(cache.actions[cache.index].jump_to_anchor, cache);
    this.anchorJump(id, cache);
  },

  mod(DBM: DBM) {
    DBM.Actions.anchorJump = function anchorJump(id, cache) {
      const anchorIndex = cache.actions.findIndex((a: any) => a.name === 'Create Anchor' && a.anchor_id === id);
      if (anchorIndex === -1) throw new Error('There was not an anchor found with that exact anchor ID!');
      cache.index = anchorIndex - 1;
      this.callNextAction(cache);
    };

    DBM.Actions.anchorExist = function anchorExist(id, cache) {
      const anchorIndex = cache.actions.findIndex((a: any) => a.name === 'Create Anchor' && a.anchor_id === id);
      if (anchorIndex === -1) {
        return false;
      }
      return true;
    };
  },
};

module.exports = action;
