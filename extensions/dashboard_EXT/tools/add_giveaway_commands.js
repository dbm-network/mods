'use strict';

/**
 * Helper script to add giveaway commands to DBM commands.json
 * Run this script to add giveaway slash commands to your bot
 */

const fs = require('fs');
const path = require('path');
const giveawayCommands = require('./giveaway_commands');

const COMMANDS_FILE = path.join(__dirname, '..', '..', '..', 'data', 'commands.json');

function addGiveawayCommands() {
  try {
    // Read existing commands
    let commands = [];
    if (fs.existsSync(COMMANDS_FILE)) {
      const content = fs.readFileSync(COMMANDS_FILE, 'utf8');
      commands = JSON.parse(content);
      if (!Array.isArray(commands)) {
        commands = [null, ...(Array.isArray(commands) ? commands : [])];
      }
    } else {
      commands = [null];
    }

    // Check if giveaway command already exists
    const existingIndex = commands.findIndex(
      (cmd) => cmd && cmd.name && cmd.name.toLowerCase() === 'giveaway' && cmd.comType === 4,
    );

    const giveawayCommand = giveawayCommands.getGiveawaySlashCommand();

    if (existingIndex >= 0) {
      console.log('[Giveaway Commands] Updating existing giveaway command...');
      commands[existingIndex] = giveawayCommand;
    } else {
      console.log('[Giveaway Commands] Adding new giveaway command...');
      commands.push(giveawayCommand);
    }

    // Write back to file
    fs.writeFileSync(COMMANDS_FILE, JSON.stringify(commands, null, 2), 'utf8');
    console.log('[Giveaway Commands] Successfully added giveaway command to commands.json');
    console.log('[Giveaway Commands] Command ID:', giveawayCommand._id);

    return true;
  } catch (error) {
    console.error('[Giveaway Commands] Error adding commands:', error);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  addGiveawayCommands();
}

module.exports = { addGiveawayCommands };
