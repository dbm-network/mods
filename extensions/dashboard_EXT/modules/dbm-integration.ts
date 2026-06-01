/******************************************************
 * DBM Integration Module
 * Enhanced for @nt3/ Dashboard
 * Version 2.2.0
 ******************************************************/

import * as djs from 'discord.js';
import * as dbm from '../types.ts';
import { CommandManager, DBMCommand, DBMCommandParameter } from './command-manager.ts';

export interface DBMCommandData {
  name: string;
  description: string;
  permissions?: string;
  permissions2?: string;
  restriction?: string;
  _id: string;
  actions: any[];
  comType: number;
  parameters?: DBMCommandParameter[];
  _aliases?: string[];
  category?: string;
  cooldown?: number;
  serverOnly?: boolean;
  dmOnly?: boolean;
  slashCommand?: boolean;
  prefixCommand?: boolean;
}

@dbm.DBMExport()
export class DBMIntegration {
  private static commandData: DBMCommandData[] = [];
  private static isInitialized = false;

  // Initialize DBM integration
  static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load commands from DBM data
      await this.loadCommandsFromDBM();

      // Register commands with CommandManager
      this.registerCommands();

      this.isInitialized = true;
      console.log('DBM Integration initialized successfully');
    } catch (error) {
      console.error('Failed to initialize DBM integration:', error);
      throw error;
    }
  }

  // Load commands from DBM data files
  private static async loadCommandsFromDBM(): Promise<void> {
    const fs = require('fs');
    const path = require('path');

    try {
      // Load commands.json
      const commandsPath = path.join(__dirname, '../data/commands.json');
      if (fs.existsSync(commandsPath)) {
        const commandsData = JSON.parse(fs.readFileSync(commandsPath, 'utf8'));
        this.commandData = commandsData.filter((cmd: any) => cmd !== null);
      }

      // Load settings for additional configuration
      const settingsPath = path.join(__dirname, '../data/settings.json');
      if (fs.existsSync(settingsPath)) {
        const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        this.applySettings(settings);
      }
    } catch (error) {
      console.error('Error loading DBM commands:', error);
      throw error;
    }
  }

  // Apply settings to commands
  private static applySettings(settings: any): void {
    // Apply global settings to commands
    this.commandData.forEach((command) => {
      // Set default values based on settings
      if (settings.case === 'false') {
        // Commands are case insensitive by default
      }

      // Apply other settings as needed
    });
  }

  // Register commands with CommandManager
  private static registerCommands(): void {
    this.commandData.forEach((commandData) => {
      const command = this.convertDBMCommand(commandData);
      if (command) {
        CommandManager.registerCommand(command);
      }
    });
  }

  // Convert DBM command format to CommandManager format
  private static convertDBMCommand(data: DBMCommandData): DBMCommand | null {
    if (!data || !data.name) return null;

    const command: DBMCommand = {
      name: data.name,
      description: data.description || 'No description provided',
      permissions: data.permissions,
      permissions2: data.permissions2,
      restriction: data.restriction,
      _id: data._id,
      actions: data.actions || [],
      comType: data.comType,
      parameters: data.parameters || [],
      _aliases: data._aliases || [],
      category: data.category,
      cooldown: data.cooldown,
      serverOnly: data.restriction === '1', // DBM restriction "1" = server only
      dmOnly: data.restriction === '2', // DBM restriction "2" = DM only
      slashCommand: String(data.comType) === '4', // DBM comType 4 = slash command
      prefixCommand: true, // All commands support prefix by default
    };

    // Validate command
    const errors = CommandManager.validateCommand(command);
    if (errors.length > 0) {
      console.warn(`Command ${command.name} has validation errors:`, errors);
    }

    return command;
  }

  // Create slash command data for Discord API
  static createSlashCommandData(command: DBMCommand): djs.SlashCommandBuilder | djs.ContextMenuCommandBuilder {
    if (command.comType === 2) {
      // User context menu command
      return new djs.ContextMenuUserCommandBuilder().setName(command.name).setDMPermission(!command.serverOnly);
    } else if (command.comType === 3) {
      // Message context menu command
      return new djs.ContextMenuMessageCommandBuilder().setName(command.name).setDMPermission(!command.serverOnly);
    } else {
      // Slash command
      const slashCommand = new djs.SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description)
        .setDMPermission(!command.serverOnly);

      // Add parameters
      if (command.parameters) {
        command.parameters.forEach((param) => {
          this.addSlashParameter(slashCommand, param);
        });
      }

      return slashCommand;
    }
  }

  // Add parameter to slash command
  private static addSlashParameter(builder: djs.SlashCommandBuilder, param: DBMCommandParameter): void {
    const type = this.mapDBMTypeToDiscord(param.type);

    switch (type) {
      case 'string':
        const stringOption = new djs.SlashCommandStringOption()
          .setName(param.name)
          .setDescription(param.description)
          .setRequired(param.required);

        if (param.choices) {
          param.choices.forEach((choice) => {
            stringOption.addChoices({ name: choice.name, value: choice.value });
          });
        }

        if (param.minLength) stringOption.setMinLength(param.minLength);
        if (param.maxLength) stringOption.setMaxLength(param.maxLength);

        builder.addStringOption(stringOption);
        break;

      case 'integer':
        const intOption = new djs.SlashCommandIntegerOption()
          .setName(param.name)
          .setDescription(param.description)
          .setRequired(param.required);

        if (param.choices) {
          param.choices.forEach((choice) => {
            intOption.addChoices({ name: choice.name, value: parseInt(choice.value, 10) });
          });
        }

        if (param.minValue) intOption.setMinValue(param.minValue);
        if (param.maxValue) intOption.setMaxValue(param.maxValue);

        builder.addIntegerOption(intOption);
        break;

      case 'number':
        const numberOption = new djs.SlashCommandNumberOption()
          .setName(param.name)
          .setDescription(param.description)
          .setRequired(param.required);

        if (param.choices) {
          param.choices.forEach((choice) => {
            numberOption.addChoices({ name: choice.name, value: parseFloat(choice.value) });
          });
        }

        if (param.minValue) numberOption.setMinValue(param.minValue);
        if (param.maxValue) numberOption.setMaxValue(param.maxValue);

        builder.addNumberOption(numberOption);
        break;

      case 'boolean':
        builder.addBooleanOption(
          new djs.SlashCommandBooleanOption()
            .setName(param.name)
            .setDescription(param.description)
            .setRequired(param.required),
        );
        break;

      case 'user':
        builder.addUserOption(
          new djs.SlashCommandUserOption()
            .setName(param.name)
            .setDescription(param.description)
            .setRequired(param.required),
        );
        break;

      case 'channel':
        builder.addChannelOption(
          new djs.SlashCommandChannelOption()
            .setName(param.name)
            .setDescription(param.description)
            .setRequired(param.required),
        );
        break;

      case 'role':
        builder.addRoleOption(
          new djs.SlashCommandRoleOption()
            .setName(param.name)
            .setDescription(param.description)
            .setRequired(param.required),
        );
        break;

      case 'mentionable':
        builder.addMentionableOption(
          new djs.SlashCommandMentionableOption()
            .setName(param.name)
            .setDescription(param.description)
            .setRequired(param.required),
        );
        break;

      case 'attachment':
        builder.addAttachmentOption(
          new djs.SlashCommandAttachmentOption()
            .setName(param.name)
            .setDescription(param.description)
            .setRequired(param.required),
        );
        break;
    }
  }

  // Map DBM parameter types to Discord.js types
  private static mapDBMTypeToDiscord(dbmType: string): string {
    const typeMap: Record<string, string> = {
      STRING: 'string',
      INTEGER: 'integer',
      NUMBER: 'number',
      BOOLEAN: 'boolean',
      USER: 'user',
      CHANNEL: 'channel',
      ROLE: 'role',
      MENTIONABLE: 'mentionable',
      ATTACHMENT: 'attachment',
    };

    return typeMap[dbmType] || 'string';
  }

  // Get all slash command data for registration
  static getAllSlashCommandData(): (djs.SlashCommandBuilder | djs.ContextMenuCommandBuilder)[] {
    const commands = CommandManager.getAllCommands();
    return commands.filter((cmd) => cmd.slashCommand).map((cmd) => this.createSlashCommandData(cmd));
  }

  // Handle DBM action execution
  static async executeDBMActions(actions: any[], context: any): Promise<void> {
    for (const action of actions) {
      try {
        await this.executeDBMAction(action, context);
      } catch (error) {
        console.error(`Error executing DBM action ${action.name}:`, error);
      }
    }
  }

  private static async executeDBMAction(action: any, context: any): Promise<void> {
    // This integrates with the existing DBM Actions system
    // For now, we'll handle basic actions

    switch (action.name) {
      case 'Send Message':
        await this.handleSendMessageAction(action, context);
        break;
      case 'Store Member Info':
        await this.handleStoreMemberInfoAction(action, context);
        break;
      case 'Generate Random Number':
        await this.handleGenerateRandomNumberAction(action, context);
        break;
      // Add more action handlers as needed
      default:
        console.log(`Unhandled DBM action: ${action.name}`);
    }
  }

  private static async handleSendMessageAction(action: any, context: any): Promise<void> {
    const message = this.processDBMMessageTemplate(action.message, context);

    if (context.interaction) {
      const options: djs.InteractionReplyOptions = {
        content: message,
        ephemeral: action.ephemeral || false,
      };

      if (action.file) {
        options.files = [{ attachment: action.file }];
      }

      if (context.interaction.replied || context.interaction.deferred) {
        await context.interaction.followUp(options);
      } else {
        await context.interaction.reply(options);
      }
    } else if (context.message) {
      const options: djs.MessageReplyOptions = {
        content: message,
      };

      if (action.file) {
        options.files = [{ attachment: action.file }];
      }

      await context.message.reply(options);
    }
  }

  private static async handleStoreMemberInfoAction(action: any, context: any): Promise<void> {
    // Store member information in tempVars or similar
    const member = action.member === '5' ? context.member : action.member === '0' ? context.author : null;

    if (member) {
      // Store member info based on action.info value
      // This would integrate with DBM's variable system
      console.log(`Storing member info: ${action.info} for ${member.displayName || member.username}`);
    }
  }

  private static async handleGenerateRandomNumberAction(action: any, context: any): Promise<void> {
    const min = action.min || 1;
    const max = action.max || 100;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    // Store in tempVars or similar
    console.log(`Generated random number: ${randomNumber} (${min}-${max})`);
  }

  // Process DBM message templates
  private static processDBMMessageTemplate(template: string, context: any): string {
    if (!template) return '';

    let processed = template;

    // Replace DBM variables
    processed = processed.replace(/\${member}/g, context.member?.displayName || context.author?.username || 'Unknown');
    processed = processed.replace(/\${author}/g, context.author?.username || 'Unknown');
    processed = processed.replace(/\${server}/g, context.guild?.name || 'DM');
    processed = processed.replace(/\${channel}/g, context.channel?.toString() || 'Unknown');

    // Handle tempVars
    processed = processed.replace(/\${tempVars\("([^"]+)"\)}/g, (match, varName) => {
      // This would get the value from DBM's tempVars system
      return `{${varName}}`;
    });

    // Handle slashParams
    if (context.interaction) {
      processed = this.processSlashParams(processed, context.interaction);
    }

    return processed;
  }

  private static processSlashParams(template: string, interaction: djs.ChatInputCommandInteraction): string {
    let processed = template;

    processed = processed.replace(/\${slashParams\("([^"]+)"\)}/g, (match, paramName) => {
      const option = interaction.options.get(paramName);
      if (option) {
        if (option.user) return option.user.toString();
        if (option.member) return option.member.toString();
        if (option.role) return option.role.toString();
        if (option.channel) return option.channel.toString();
        return String(option.value);
      }
      return match;
    });

    return processed;
  }

  // Reload commands from DBM data
  static async reloadCommands(): Promise<void> {
    this.isInitialized = false;
    await this.initialize();
  }

  // Get command statistics
  static getStats(): any {
    return {
      totalCommands: this.commandData.length,
      slashCommands: this.commandData.filter((cmd) => cmd.comType === 4).length,
      contextMenuCommands: this.commandData.filter((cmd) => cmd.comType === 2 || cmd.comType === 3).length,
      withParameters: this.commandData.filter((cmd) => cmd.parameters && cmd.parameters.length > 0).length,
      withCooldown: this.commandData.filter((cmd) => cmd.cooldown && cmd.cooldown > 0).length,
    };
  }
}
