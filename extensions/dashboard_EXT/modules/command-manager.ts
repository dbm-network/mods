/******************************************************
 * DBM-Compatible Command Manager
 * Enhanced for @nt3/ Dashboard
 * Version 2.2.0
 ******************************************************/

import * as djs from 'discord.js';
import * as dbm from '../types.ts';

export interface DBMCommand {
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

export interface DBMCommandParameter {
  name: string;
  description: string;
  type: string;
  required: boolean;
  choices?: { name: string; value: string }[];
  minValue?: number;
  maxValue?: number;
  minLength?: number;
  maxLength?: number;
}

export interface DBMCommandContext {
  message?: djs.Message;
  interaction?: djs.ChatInputCommandInteraction | djs.ContextMenuCommandInteraction;
  member?: djs.GuildMember;
  guild?: djs.Guild;
  channel?: djs.TextChannel | djs.DMChannel;
  author?: djs.User;
  args?: string[];
  prefix?: string;
  commandName?: string;
  isSlash?: boolean;
  isPrefix?: boolean;
}

@dbm.DBMExport()
export class CommandManager {
  private static commands: Map<string, DBMCommand> = new Map();
  private static aliases: Map<string, string> = new Map();
  private static cooldowns: Map<string, Map<string, number>> = new Map();
  private static serverPrefixes: Map<string, string> = new Map();

  // Command registration
  static registerCommand(command: DBMCommand): void {
    if (!command.name) {
      console.error('Command name is required!');
      return;
    }

    // Store command
    this.commands.set(command.name.toLowerCase(), command);

    // Register aliases
    if (command._aliases && Array.isArray(command._aliases)) {
      command._aliases.forEach((alias) => {
        this.aliases.set(alias.toLowerCase(), command.name.toLowerCase());
      });
    }

    // Initialize cooldown map for this command
    if (command.cooldown && command.cooldown > 0) {
      this.cooldowns.set(command.name.toLowerCase(), new Map());
    }

    console.log(`Registered command: ${command.name}`);
  }

  static unregisterCommand(commandName: string): void {
    const command = this.commands.get(commandName.toLowerCase());
    if (command) {
      this.commands.delete(commandName.toLowerCase());
      this.cooldowns.delete(commandName.toLowerCase());

      // Remove aliases
      for (const [alias, cmdName] of this.aliases.entries()) {
        if (cmdName === commandName.toLowerCase()) {
          this.aliases.delete(alias);
        }
      }

      console.log(`Unregistered command: ${commandName}`);
    }
  }

  static getCommand(commandName: string): DBMCommand | undefined {
    const normalizedName = commandName.toLowerCase();
    return this.commands.get(normalizedName) || this.commands.get(this.aliases.get(normalizedName) || '');
  }

  static getAllCommands(): DBMCommand[] {
    return Array.from(this.commands.values());
  }

  // Prefix command handling
  static async handlePrefixCommand(message: djs.Message, prefix: string): Promise<boolean> {
    if (message.author.bot) return false;

    const content = message.content.trim();
    if (!content.startsWith(prefix)) return false;

    const args = content.slice(prefix.length).trim().split(/\s+/);
    const commandName = args[0].toLowerCase();
    const command = this.getCommand(commandName);

    if (!command || !command.prefixCommand) return false;

    // Check restrictions
    if (!this.checkRestrictions(command, message)) return false;

    // Check cooldown
    if (!this.checkCooldown(command, message.author.id)) return false;

    // Create context
    const context: DBMCommandContext = {
      message,
      member: message.member || undefined,
      guild: message.guild || undefined,
      channel: message.channel as djs.TextChannel | djs.DMChannel,
      author: message.author,
      args: args.slice(1),
      prefix,
      commandName,
      isPrefix: true,
    };

    // Execute command
    await this.executeCommand(command, context);
    return true;
  }

  // Slash command handling
  static async handleSlashCommand(interaction: djs.ChatInputCommandInteraction): Promise<boolean> {
    if (!interaction.isChatInputCommand()) return false;

    let commandName = interaction.commandName;

    // Handle subcommands
    const group = interaction.options.getSubcommandGroup(false);
    if (group) {
      commandName += ` ${group}`;
    }

    const sub = interaction.options.getSubcommand(false);
    if (sub) {
      commandName += ` ${sub}`;
    }

    const command = this.getCommand(commandName);
    if (!command || !(command.slashCommand || String(command.comType) === '4')) return false;

    // Check restrictions
    if (!this.checkRestrictions(command, interaction)) return false;

    // Check cooldown
    if (!this.checkCooldown(command, interaction.user.id)) return false;

    // Create context
    const context: DBMCommandContext = {
      interaction,
      member: (interaction.member as djs.GuildMember) || undefined,
      guild: interaction.guild || undefined,
      channel: interaction.channel as djs.TextChannel | djs.DMChannel,
      author: interaction.user,
      commandName,
      isSlash: true,
    };

    // Execute command
    await this.executeCommand(command, context);
    return true;
  }

  // Context menu command handling
  static async handleContextMenuCommand(interaction: djs.ContextMenuCommandInteraction): Promise<boolean> {
    if (!interaction.isContextMenuCommand()) return false;

    const commandName = interaction.commandName;
    const command = this.getCommand(commandName);

    if (!command || !command.slashCommand) return false;

    // Check restrictions
    if (!this.checkRestrictions(command, interaction)) return false;

    // Check cooldown
    if (!this.checkCooldown(command, interaction.user.id)) return false;

    // Create context
    const context: DBMCommandContext = {
      interaction,
      member: (interaction.member as djs.GuildMember) || undefined,
      guild: interaction.guild || undefined,
      channel: interaction.channel as djs.TextChannel | djs.DMChannel,
      author: interaction.user,
      commandName,
      isSlash: true,
    };

    // Execute command
    await this.executeCommand(command, context);
    return true;
  }

  // Command execution
  private static async executeCommand(command: DBMCommand, context: DBMCommandContext): Promise<void> {
    try {
      // Set cooldown
      if (command.cooldown && command.cooldown > 0) {
        this.setCooldown(command.name, context.author!.id, command.cooldown);
      }

      // Execute actions
      if (command.actions && command.actions.length > 0) {
        await this.executeActions(command.actions, context);
      }
    } catch (error) {
      console.error(`Error executing command ${command.name}:`, error);

      const errorMessage = 'An error occurred while executing this command.';
      if (context.isSlash && context.interaction) {
        if (context.interaction.replied || context.interaction.deferred) {
          await context.interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
          await context.interaction.reply({ content: errorMessage, ephemeral: true });
        }
      } else if (context.message) {
        await context.message.reply(errorMessage);
      }
    }
  }

  // Action execution (DBM compatible)
  private static async executeActions(actions: any[], context: DBMCommandContext): Promise<void> {
    for (const action of actions) {
      try {
        await this.executeAction(action, context);
      } catch (error) {
        console.error(`Error executing action ${action.name}:`, error);
      }
    }
  }

  private static async executeAction(action: any, context: DBMCommandContext): Promise<void> {
    // This would integrate with the existing DBM Actions system
    // For now, we'll handle basic message sending
    if (action.name === 'Send Message') {
      await this.handleSendMessageAction(action, context);
    }
    // Add more action handlers as needed
  }

  private static async handleSendMessageAction(action: any, context: DBMCommandContext): Promise<void> {
    const message = this.processMessageTemplate(action.message, context);

    if (context.isSlash && context.interaction) {
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

  // Template processing (DBM compatible)
  private static processMessageTemplate(template: string, context: DBMCommandContext): string {
    if (!template) return '';

    let processed = template;

    // Replace common DBM variables
    processed = processed.replace(/\${member}/g, context.member?.displayName || context.author?.username || 'Unknown');
    processed = processed.replace(/\${author}/g, context.author?.username || 'Unknown');
    processed = processed.replace(/\${server}/g, context.guild?.name || 'DM');
    processed = processed.replace(/\${channel}/g, context.channel?.toString() || 'Unknown');

    // Handle slash command parameters
    if (context.isSlash && context.interaction) {
      processed = this.processSlashParameters(processed, context.interaction);
    }

    return processed;
  }

  private static processSlashParameters(template: string, interaction: djs.ChatInputCommandInteraction): string {
    let processed = template;

    // Replace slashParams() calls
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

  // Restriction checking
  private static checkRestrictions(command: DBMCommand, context: djs.Message | djs.BaseInteraction): boolean {
    // Check DM/Server restrictions
    if (command.serverOnly && !(context as any).guild) {
      return false;
    }

    if (command.dmOnly && (context as any).guild) {
      return false;
    }

    // Check permissions
    if (command.permissions && command.permissions !== 'NONE') {
      if (!this.hasPermission(command.permissions, context)) {
        return false;
      }
    }

    return true;
  }

  private static hasPermission(permission: string, context: djs.Message | djs.BaseInteraction): boolean {
    const member = (context as any).member;
    if (!member || !member.permissions) return false;

    // Map DBM permission names to Discord.js permissions
    const permissionMap: Record<string, string> = {
      ADMINISTRATOR: 'Administrator',
      MANAGE_GUILD: 'ManageGuild',
      MANAGE_CHANNELS: 'ManageChannels',
      MANAGE_ROLES: 'ManageRoles',
      MANAGE_MESSAGES: 'ManageMessages',
      KICK_MEMBERS: 'KickMembers',
      BAN_MEMBERS: 'BanMembers',
      MENTION_EVERYONE: 'MentionEveryone',
      USE_EXTERNAL_EMOJIS: 'UseExternalEmojis',
      MANAGE_NICKNAMES: 'ManageNicknames',
      MANAGE_WEBHOOKS: 'ManageWebhooks',
      MANAGE_EMOJIS: 'ManageEmojisAndStickers',
    };

    const discordPermission = permissionMap[permission] || permission;
    return member.permissions.has(discordPermission as any);
  }

  // Cooldown management
  private static checkCooldown(command: DBMCommand, userId: string): boolean {
    if (!command.cooldown || command.cooldown <= 0) return true;

    const cooldownMap = this.cooldowns.get(command.name.toLowerCase());
    if (!cooldownMap) return true;

    const now = Date.now();
    const userCooldown = cooldownMap.get(userId);

    if (userCooldown && now < userCooldown) {
      return false;
    }

    return true;
  }

  private static setCooldown(commandName: string, userId: string, cooldownSeconds: number): void {
    const cooldownMap = this.cooldowns.get(commandName.toLowerCase());
    if (cooldownMap) {
      cooldownMap.set(userId, Date.now() + cooldownSeconds * 1000);
    }
  }

  // Server prefix management
  static setServerPrefix(guildId: string, prefix: string): void {
    this.serverPrefixes.set(guildId, prefix);
  }

  static getServerPrefix(guildId: string): string | undefined {
    return this.serverPrefixes.get(guildId);
  }

  static removeServerPrefix(guildId: string): void {
    this.serverPrefixes.delete(guildId);
  }

  // Command validation
  static validateCommand(command: DBMCommand): string[] {
    const errors: string[] = [];

    if (!command.name) {
      errors.push('Command name is required');
    }

    if (command.name && !/^[a-z0-9_-]+$/i.test(command.name)) {
      errors.push('Command name can only contain letters, numbers, underscores, and dashes');
    }

    if (command.cooldown && command.cooldown < 0) {
      errors.push('Cooldown must be a positive number');
    }

    if (command.parameters) {
      for (const param of command.parameters) {
        if (!param.name) {
          errors.push('Parameter name is required');
        }
        if (!param.description) {
          errors.push('Parameter description is required');
        }
      }
    }

    return errors;
  }

  // Statistics
  static getCommandStats(): { total: number; slash: number; prefix: number; withCooldown: number } {
    const commands = this.getAllCommands();
    return {
      total: commands.length,
      slash: commands.filter((cmd) => cmd.slashCommand).length,
      prefix: commands.filter((cmd) => cmd.prefixCommand).length,
      withCooldown: commands.filter((cmd) => cmd.cooldown && cmd.cooldown > 0).length,
    };
  }
}
