/******************************************************
 * DBM Action Handler Module
 * Enhanced for @nt3/ Dashboard
 * Version 2.2.0
 ******************************************************/

import * as djs from 'discord.js';
import * as dbm from '../types.ts';

export interface DBMActionContext {
  message?: djs.Message;
  interaction?: djs.BaseInteraction;
  member?: djs.GuildMember;
  guild?: djs.Guild;
  channel?: djs.TextChannel | djs.DMChannel;
  author?: djs.User;
  args?: string[];
  tempVars?: Record<string, any>;
  serverVars?: Record<string, any>;
  globalVars?: Record<string, any>;
}

@dbm.DBMExport()
export class DBMActionHandler {
  private static tempVars: Map<string, Record<string, any>> = new Map();
  private static serverVars: Map<string, Record<string, any>> = new Map();
  private static globalVars: Record<string, any> = {};

  // Execute DBM actions
  static async executeActions(actions: any[], context: DBMActionContext): Promise<void> {
    if (!actions || !Array.isArray(actions)) return;

    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      if (!action || !action.name) continue;

      try {
        await this.executeAction(action, context);
      } catch (error) {
        console.error(`Error executing action ${action.name} (${i + 1}/${actions.length}):`, error);
      }
    }
  }

  // Execute single DBM action
  private static async executeAction(action: any, context: DBMActionContext): Promise<void> {
    const actionName = action.name.toLowerCase().replace(/\s+/g, '_');

    switch (actionName) {
      case 'send_message':
        await this.handleSendMessage(action, context);
        break;
      case 'store_member_info':
        await this.handleStoreMemberInfo(action, context);
        break;
      case 'generate_random_number':
        await this.handleGenerateRandomNumber(action, context);
        break;
      case 'multi_check_variable':
        await this.handleMultiCheckVariable(action, context);
        break;
      case 'disable_buttons_and_selects':
        await this.handleDisableButtonsAndSelects(action, context);
        break;
      case 'create_embed_message':
        await this.handleCreateEmbedMessage(action, context);
        break;
      case 'add_embed_field':
        await this.handleAddEmbedField(action, context);
        break;
      case 'send_embed_message':
        await this.handleSendEmbedMessage(action, context);
        break;
      case 'wait':
        await this.handleWait(action, context);
        break;
      case 'end_action_sequence':
        await this.handleEndActionSequence(action, context);
        break;
      default:
        console.log(`Unhandled DBM action: ${action.name}`);
    }
  }

  // Send Message Action
  private static async handleSendMessage(action: any, context: DBMActionContext): Promise<void> {
    const message = this.processTemplate(action.message, context);
    const options: any = {
      content: message,
      reply: action.reply || false,
      ephemeral: action.ephemeral || false,
      tts: action.tts || false,
    };

    if (action.file) {
      options.files = [{ attachment: action.file }];
    }

    if (action.buttons && action.buttons.length > 0) {
      options.components = this.createActionRowComponents(action.buttons);
    }

    if (action.selectMenus && action.selectMenus.length > 0) {
      if (!options.components) options.components = [];
      action.selectMenus.forEach((menu: any) => {
        options.components.push(this.createSelectMenuComponent(menu));
      });
    }

    if (context.interaction) {
      if (context.interaction.replied || context.interaction.deferred) {
        await context.interaction.followUp(options);
      } else {
        await context.interaction.reply(options);
      }
    } else if (context.message) {
      if (options.reply) {
        await context.message.reply(options);
      } else {
        await context.message.channel.send(options);
      }
    }
  }

  // Store Member Info Action
  private static async handleStoreMemberInfo(action: any, context: DBMActionContext): Promise<void> {
    const member = this.getMemberFromAction(action, context);
    if (!member) return;

    const info = this.getMemberInfo(member, action.info);
    const varName = action.varName2 || action.varName;

    if (varName) {
      this.setTempVar(context, varName, info);
    }
  }

  // Generate Random Number Action
  private static async handleGenerateRandomNumber(action: any, context: DBMActionContext): Promise<void> {
    const min = parseInt(action.min, 10) || 1;
    const max = parseInt(action.max, 10) || 100;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    const varName = action.varName2 || action.varName;
    if (varName) {
      this.setTempVar(context, varName, randomNumber);
    }
  }

  // Multi Check Variable Action
  private static async handleMultiCheckVariable(action: any, context: DBMActionContext): Promise<void> {
    const varName = action.varName2 || action.varName;
    const value = this.getTempVar(context, varName);

    if (action.branches && Array.isArray(action.branches)) {
      for (const branch of action.branches) {
        if (this.checkCondition(value, branch.comparison, branch.value)) {
          if (branch.actions && Array.isArray(branch.actions)) {
            await this.executeActions(branch.actions, context);
          }
          break;
        }
      }
    }
  }

  // Disable Buttons and Selects Action
  private static async handleDisableButtonsAndSelects(action: any, context: DBMActionContext): Promise<void> {
    // This would disable components in a message
    // Implementation depends on how components are stored
    console.log('Disabling buttons and selects');
  }

  // Create Embed Message Action
  private static async handleCreateEmbedMessage(action: any, context: DBMActionContext): Promise<void> {
    const embed = new djs.EmbedBuilder();

    if (action.title) embed.setTitle(this.processTemplate(action.title, context));
    if (action.description) embed.setDescription(this.processTemplate(action.description, context));
    if (action.color) embed.setColor(action.color);
    if (action.thumbnail) embed.setThumbnail(action.thumbnail);
    if (action.image) embed.setImage(action.image);
    if (action.footer) embed.setFooter({ text: this.processTemplate(action.footer, context) });
    if (action.timestamp) embed.setTimestamp();

    const varName = action.varName2 || action.varName;
    if (varName) {
      this.setTempVar(context, varName, embed);
    }
  }

  // Add Embed Field Action
  private static async handleAddEmbedField(action: any, context: DBMActionContext): Promise<void> {
    const varName = action.varName2 || action.varName;
    const embed = this.getTempVar(context, varName);

    if (embed && embed instanceof djs.EmbedBuilder) {
      embed.addFields({
        name: this.processTemplate(action.name, context),
        value: this.processTemplate(action.value, context),
        inline: action.inline || false,
      });
    }
  }

  // Send Embed Message Action
  private static async handleSendEmbedMessage(action: any, context: DBMActionContext): Promise<void> {
    const varName = action.varName2 || action.varName;
    const embed = this.getTempVar(context, varName);

    if (!embed || !(embed instanceof djs.EmbedBuilder)) return;

    const options: any = {
      embeds: [embed],
      reply: action.reply || false,
      ephemeral: action.ephemeral || false,
    };

    if (context.interaction) {
      if (context.interaction.replied || context.interaction.deferred) {
        await context.interaction.followUp(options);
      } else {
        await context.interaction.reply(options);
      }
    } else if (context.message) {
      if (options.reply) {
        await context.message.reply(options);
      } else {
        await context.message.channel.send(options);
      }
    }
  }

  // Wait Action
  private static async handleWait(action: any, context: DBMActionContext): Promise<void> {
    const time = parseInt(action.time, 10) || 1000;
    await new Promise((resolve) => setTimeout(resolve, time));
  }

  // End Action Sequence Action
  private static async handleEndActionSequence(action: any, context: DBMActionContext): Promise<void> {
    // This would stop the action sequence
    // Implementation depends on how sequences are managed
    console.log('Ending action sequence');
  }

  // Helper methods
  private static processTemplate(template: string, context: DBMActionContext): string {
    if (!template) return '';

    let processed = template;

    // Replace common DBM variables
    processed = processed.replace(/\${member}/g, context.member?.displayName || context.author?.username || 'Unknown');
    processed = processed.replace(/\${author}/g, context.author?.username || 'Unknown');
    processed = processed.replace(/\${server}/g, context.guild?.name || 'DM');
    processed = processed.replace(/\${channel}/g, context.channel?.toString() || 'Unknown');

    // Handle tempVars
    processed = processed.replace(/\${tempVars\("([^"]+)"\)}/g, (match, varName) => {
      const value = this.getTempVar(context, varName);
      return value !== undefined ? String(value) : match;
    });

    // Handle slashParams
    if (context.interaction && context.interaction.isChatInputCommand()) {
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

  private static getMemberFromAction(action: any, context: DBMActionContext): djs.GuildMember | djs.User | null {
    switch (action.member) {
      case '0':
        return context.author || null;
      case '1':
        return context.member || null;
      case '2':
        return context.member || null;
      case '3':
        return context.member || null;
      case '4':
        return context.member || null;
      case '5':
        return context.member || null;
      default:
        return context.member || context.author || null;
    }
  }

  private static getMemberInfo(member: djs.GuildMember | djs.User, infoType: string): any {
    if (!member) return null;

    const infoMap: Record<string, () => any> = {
      '1': () => member.id,
      '2': () => member.username,
      '3': () => member.displayName || member.username,
      '4': () => member.hexColor || '#000000',
      '5': () => member.user?.bot || false,
      '6': () => member.user?.createdAt || new Date(),
      '7': () => member.user?.avatarURL() || member.user?.defaultAvatarURL,
      '8': () => member.user?.discriminator || '0000',
      '9': () => member.user?.tag || 'Unknown#0000',
      '10': () => member.user?.presence?.status || 'offline',
      '11': () => member.user?.presence?.activities || [],
      '12': () => member.user?.presence?.clientStatus || {},
      '13': () => member.user?.flags || 0,
      '14': () => member.user?.premiumType || 0,
      '15': () => member.user?.locale || 'en-US',
      '16': () => member.user?.avatarURL() || member.user?.defaultAvatarURL,
      '17': () => member.user?.bannerURL() || null,
      '18': () => member.user?.accentColor || null,
      '19': () => member.user?.createdTimestamp || 0,
      '20': () => member.user?.defaultAvatarURL || '',
      '21': () => member.user?.displayAvatarURL() || '',
      '22': () => member.user?.createdAt || new Date(),
    };

    const getter = infoMap[infoType];
    return getter ? getter() : null;
  }

  private static checkCondition(value: any, comparison: string, expectedValue: any): boolean {
    switch (comparison) {
      case '1':
        return value === expectedValue;
      case '2':
        return value !== expectedValue;
      case '3':
        return value > expectedValue;
      case '4':
        return value < expectedValue;
      case '5':
        return value >= expectedValue;
      case '6':
        return value <= expectedValue;
      case '7':
        return String(value).includes(String(expectedValue));
      case '8':
        return !String(value).includes(String(expectedValue));
      case '9':
        return String(value).startsWith(String(expectedValue));
      case '10':
        return String(value).endsWith(String(expectedValue));
      default:
        return false;
    }
  }

  private static createActionRowComponents(buttons: any[]): djs.ActionRowBuilder<djs.ButtonBuilder>[] {
    const rows: djs.ActionRowBuilder<djs.ButtonBuilder>[] = [];

    for (let i = 0; i < buttons.length; i += 5) {
      const row = new djs.ActionRowBuilder<djs.ButtonBuilder>();
      const buttonGroup = buttons.slice(i, i + 5);

      buttonGroup.forEach((button: any) => {
        const buttonBuilder = new djs.ButtonBuilder().setCustomId(button.id).setLabel(button.name);

        if (button.emoji) {
          buttonBuilder.setEmoji(button.emoji);
        }

        if (button.url) {
          buttonBuilder.setURL(button.url);
          buttonBuilder.setStyle(djs.ButtonStyle.Link);
        } else {
          const styleMap: Record<string, djs.ButtonStyle> = {
            PRIMARY: djs.ButtonStyle.Primary,
            SECONDARY: djs.ButtonStyle.Secondary,
            SUCCESS: djs.ButtonStyle.Success,
            DANGER: djs.ButtonStyle.Danger,
          };
          buttonBuilder.setStyle(styleMap[button.type] || djs.ButtonStyle.Primary);
        }

        row.addComponents(buttonBuilder);
      });

      rows.push(row);
    }

    return rows;
  }

  private static createSelectMenuComponent(menu: any): djs.ActionRowBuilder<djs.StringSelectMenuBuilder> {
    const selectMenu = new djs.StringSelectMenuBuilder()
      .setCustomId(menu.id)
      .setPlaceholder(menu.placeholder || 'Select an option');

    if (menu.options && Array.isArray(menu.options)) {
      menu.options.forEach((option: any) => {
        selectMenu.addOptions({
          label: option.label,
          description: option.description,
          value: option.value,
          emoji: option.emoji,
          default: option.default || false,
        });
      });
    }

    return new djs.ActionRowBuilder<djs.StringSelectMenuBuilder>().addComponents(selectMenu);
  }

  // Variable management
  private static setTempVar(context: DBMActionContext, varName: string, value: any): void {
    if (!context.tempVars) {
      context.tempVars = {};
    }
    context.tempVars[varName] = value;
  }

  private static getTempVar(context: DBMActionContext, varName: string): any {
    return context.tempVars?.[varName];
  }

  private static setServerVar(guildId: string, varName: string, value: any): void {
    if (!this.serverVars.has(guildId)) {
      this.serverVars.set(guildId, {});
    }
    this.serverVars.get(guildId)![varName] = value;
  }

  private static getServerVar(guildId: string, varName: string): any {
    return this.serverVars.get(guildId)?.[varName];
  }

  private static setGlobalVar(varName: string, value: any): void {
    this.globalVars[varName] = value;
  }

  private static getGlobalVar(varName: string): any {
    return this.globalVars[varName];
  }
}
