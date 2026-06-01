'use strict';

/**
 * Giveaway Slash Command Handler Action
 * Handles /giveaway slash command interactions
 * Compatible with DBM action system
 */

module.exports = {
  name: 'Giveaway Slash Command MOD',
  section: 'Giveaway',
  meta: {
    version: '1.0.0',
    preciseCheck: true,
    author: 'News Targeted',
    authorUrl: 'https://newstargeted.com',
  },

  subtitle(data, presets) {
    return 'Handle giveaway slash command';
  },

  fields: ['Interaction:', 'Store Result As:'],

  html(data, presets) {
    return `
        <div>
            <p>This action handles /giveaway slash command interactions. Use this in an "Interaction Create" event.</p>
            <p><strong>Note:</strong> Make sure the giveaway command is registered in commands.json</p>
        </div>
        <div style="padding: 8px; background: rgba(128, 128, 128, 0.2); border-radius: 4px;">
            ${presets.getVariableField(data, 'varName', 'Interaction', 'Interaction')}
            <br>
            ${presets.variableField(data, 'varName2', 'Store Result As', 'Text')}
        </div>
        `;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const Mods = this.getMods();
    const giveawayCommands = Mods.require('./extensions/dashboard_EXT/tools/giveaway_commands');
    const giveawayUtils = Mods.require('./extensions/dashboard_EXT/tools/giveaway_utils');

    if (!giveawayUtils || !giveawayUtils.isGiveawaySystemAvailable()) {
      this.callNextAction(cache);
      return;
    }

    const interaction = await this.getVariableFromData(data.varName, data.varName, cache);
    if (!interaction || !interaction.isCommand || !interaction.isCommand()) {
      this.callNextAction(cache);
      return;
    }

    // Check if it's the giveaway command
    if (interaction.commandName !== 'giveaway') {
      this.callNextAction(cache);
      return;
    }

    const subcommand = interaction.options?.getSubcommand(false);
    const options = interaction.options ? Array.from(interaction.options.data.values()) : [];

    try {
      const result = await giveawayCommands.executeGiveawayCommand(DBM, interaction, subcommand, options);
      if (data.varName2) {
        this.storeValue(result, 1, data.varName2, cache);
      }
    } catch (error) {
      console.error('[Giveaway Slash Command] Error:', error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: 'An error occurred while processing the command.', ephemeral: true });
      }
    }

    this.callNextAction(cache);
  },

  mod() {},
};
