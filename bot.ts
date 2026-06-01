/******************************************************
 * Discord Bot Maker Bot
 * Version 2.2.0
 * Robert Borghese
 ******************************************************/

//---------------------------------------------------------------------
// Imports
//---------------------------------------------------------------------
import * as djs from 'discord.js';
import * as dbm from './types';

//---------------------------------------------------------------------
// Globals
//---------------------------------------------------------------------
const DBM: any = {};
DBM.version = '2.2.0';

const DiscordJS = require('discord.js');
DBM.DiscordJS = DiscordJS;

const noop = () => void 0;

//---------------------------------------------------------------------
// Check Discord.JS version - Support both v13.14.0 and v14.24.2
//---------------------------------------------------------------------
// Support both v13 and v14
const majorVersion = parseInt(DiscordJS.version.split('.')[0], 10);
const minorVersion = parseInt(DiscordJS.version.split('.')[1] || '0', 10);
const patchVersion = parseInt(DiscordJS.version.split('.')[2] || '0', 10);
const isV13 = majorVersion === 13;
const isV14 = majorVersion === 14;

// Version compatibility helpers
DBM.getDiscordJSVersion = () => DiscordJS.version;
DBM.getDiscordJSMajorVersion = () => majorVersion;
DBM.isDiscordJSv13 = () => isV13;
DBM.isDiscordJSv14 = () => isV14;
DBM.isDiscordJSv13_14_0 = () => isV13 && minorVersion >= 14;
DBM.isDiscordJSv14_24_2 = () => isV14 && (minorVersion > 24 || (minorVersion === 24 && patchVersion >= 2));

// v14 Compatibility: MessageEmbed was replaced with EmbedBuilder
if (isV14 && !DiscordJS.MessageEmbed) {
  DiscordJS.MessageEmbed = DiscordJS.EmbedBuilder;
  // Also add compatibility for addField (v14 uses addFields with array)
  if (DiscordJS.EmbedBuilder && !DiscordJS.EmbedBuilder.prototype.addField) {
    DiscordJS.EmbedBuilder.prototype.addField = function (name: string, value: string, inline?: boolean | string) {
      const inlineBool = inline === true || (typeof inline === 'string' && inline === 'true');
      return this.addFields({ name, value, inline: inlineBool });
    };
  }
}

// Version checking - support 13.14.0+ and 14.24.2+
const requiredDjsVersion = isV14 ? '14.24.2' : '13.14.0';

// Helper function to compare versions
function compareVersions(version1: string, version2: string): number {
  const v1parts = version1.split('.').map(Number);
  const v2parts = version2.split('.').map(Number);
  for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
    const v1part = v1parts[i] || 0;
    const v2part = v2parts[i] || 0;
    if (v1part < v2part) return -1;
    if (v1part > v2part) return 1;
  }
  return 0;
}

const requiredVersion = isV14 ? '14.24.2' : '13.14.0';
const versionCheck = compareVersions(DiscordJS.version, requiredVersion) < 0;

if (versionCheck) {
  console.log(
    `This version of Discord Bot Maker requires discord.js ${requiredDjsVersion}+.
It is currently ${DiscordJS.version}.
Please use "Project > Module Manager" and "Project > Reinstall Node Modules" to update to discord.js ${requiredDjsVersion}.\n\n`,
  );
  throw new Error(`Need discord.js ${requiredDjsVersion} to run!!!`);
}

//---------------------------------------------------------------------
// This decorator stores the target in DBM or the object as an argument.
//---------------------------------------------------------------------
export function DBMExport(container: any = DBM) {
  return function internalDecorator(classObject, context: ClassDecoratorContext) {
    if (context.name) {
      container[context.name] = classObject;
    }
    return classObject;
  };
}

//---------------------------------------------------------------------
//#region Output Messages
// Gathered all the output messages in single place for easier translation.
//---------------------------------------------------------------------

export enum MsgType {
  MISSING_ACTION,
  DATA_PARSING_ERROR,
  MISSING_ACTIONS,

  DUPLICATE_SLASH_COMMAND,
  INVALID_SLASH_NAME,
  DUPLICATE_USER_COMMAND,
  DUPLICATE_MESSAGE_COMMAND,
  DUPLICATE_SLASH_PARAMETER,
  INVALID_SLASH_PARAMETER_NAME,
  INVALID_SLASH_COMMAND_SERVER_ID,
  DUPLICATE_BUTTON_ID,
  DUPLICATE_SELECT_ID,
  TOO_MANY_SPACES_SLASH_NAME,
  SUB_COMMAND_ALREADY_EXISTS,
  SUB_COMMAND_GROUP_ALREADY_EXISTS,

  MISSING_APPLICATION_COMMAND_ACCESS,
  MISSING_MUSIC_MODULES,

  MUTABLE_VOLUME_DISABLED,
  MUTABLE_VOLUME_NOT_IN_CHANNEL,
  ERROR_GETTING_YT_INFO,
  ERROR_CREATING_AUDIO,

  MISSING_MEMBER_INTENT_FIND_USER_ID,
  CANNOT_FIND_USER_BY_ID,

  SERVER_MESSAGE_INTENT_REQUIRED,
  CHANNEL_PARTIAL_REQUIRED,
}

export function PrintError(type: MsgType, ...args: any[]) {
  const { format } = require('node:util');
  const { error, warn } = console;

  switch (type) {
    case MsgType.MISSING_ACTION: {
      error(format('%s does not exist!', args[0]));
      break;
    }
    case MsgType.DATA_PARSING_ERROR: {
      error(format('There was issue parsing %s!', args[0]));
      break;
    }
    case MsgType.MISSING_ACTIONS: {
      error(
        format(
          '[Missing Actions]\nPlease copy the "Actions" folder from the Discord Bot Maker directory to this bot\'s directory: \n%s',
          args[0],
        ),
      );
      break;
    }

    case MsgType.DUPLICATE_SLASH_COMMAND: {
      warn(
        format(
          '[Duplicate Slash Command]\nSlash command with name "%s" already exists!\nThis duplicate will be ignored.\n',
          args[0],
        ),
      );
      break;
    }
    case MsgType.TOO_MANY_SPACES_SLASH_NAME: {
      warn(
        format(
          '[Too Many Spaces in Slash Name]\nSlash command with name "%s" has too many spaces!\nSlash command names may only contain a maximum of three different words.\n',
          args[0],
        ),
      );
      break;
    }
    case MsgType.SUB_COMMAND_ALREADY_EXISTS: {
      warn(
        format(
          '[Sub-Command Already Exists]\nSlash command with name "%s" cannot exist.\nIt requires the creation of a "sub-command group" called "%s",\nbut there\'s already a command with that name.',
          args[0],
          args[1],
        ),
      );
      break;
    }
    case MsgType.SUB_COMMAND_GROUP_ALREADY_EXISTS: {
      warn(
        format(
          '[Sub-Command Group Already Exists]\nSlash command with name "%s" cannot exist.\nThere is already a "sub-command group" with that name.\nThe "sub-command group" exists because of a command named something like: "%s _____"',
          args[0],
          args[0],
        ),
      );
      break;
    }
    case MsgType.INVALID_SLASH_NAME: {
      error(
        format(
          '[Invalid Slash Command Name]\nSlash command has invalid name: "%s".\nSlash command names cannot have spaces and must only contain letters, numbers, underscores, and dashes!\nThis command will be ignored.',
          args[0],
        ),
      );
      break;
    }
    case MsgType.DUPLICATE_USER_COMMAND: {
      warn(
        format(
          '[Duplicate User Command]\nUser command with name "%s" already exists!\nThis duplicate will be ignored.\n',
          args[0],
        ),
      );
      break;
    }
    case MsgType.DUPLICATE_MESSAGE_COMMAND: {
      warn(
        format(
          '[Duplicate Message Command]\nMessage command with name "%s" already exists!\nThis duplicate will be ignored.\n',
          args[0],
        ),
      );
      break;
    }
    case MsgType.DUPLICATE_SLASH_PARAMETER: {
      warn(
        format(
          '[Duplicate Slash Command]\nSlash command "%s" parameter #%d ("%s") has a name that\'s already being used!\nThis duplicate will be ignored.\n',
          args[0],
          args[1],
          args[2],
        ),
      );
      break;
    }
    case MsgType.INVALID_SLASH_PARAMETER_NAME: {
      error(
        format(
          '[Invalid Slash Parameter Name]\nSlash command "%s" parameter #%d has invalid name: "%s".\nSlash command parameter names cannot have spaces and must only contain letters, numbers, underscores, and dashes!\nThis parameter will be ignored.\n',
          args[0],
          args[1],
          args[2],
        ),
      );
      break;
    }
    case MsgType.INVALID_SLASH_COMMAND_SERVER_ID: {
      error(
        format('Invalid Server ID "%s" listed in "Slash Command Options -> Server IDs for Slash Commands"!\n'),
        args[0],
      );
      break;
    }
    case MsgType.DUPLICATE_BUTTON_ID: {
      warn(
        format('Button interaction with unique id "%s" already exists!\nThis duplicate will be ignored.\n', args[0]),
      );
      break;
    }
    case MsgType.DUPLICATE_SELECT_ID: {
      warn(
        format(
          'Select menu interaction with unique id "%s" already exists!\nThis duplicate will be ignored.\n',
          args[0],
        ),
      );
      break;
    }

    case MsgType.MISSING_APPLICATION_COMMAND_ACCESS: {
      warn(
        format(
          'Slash commands cannot be provided to server: %s (ID: %s).\nPlease re-invite the bot to this server using the invite link found in "Settings -> Bot Settings".\nAlternatively, you can switch to using Global Slash Commands in "Settings -> Slash Command Settings -> Slash Command Creation Preference". However, please note global commands take a long time to update (~1 hour).',
          args[0],
          args[1],
        ),
      );
      break;
    }

    case MsgType.MISSING_MUSIC_MODULES: {
      warn(
        format(
          'Could not load audio-related Node modules.\nPlease run "File -> Music Capabilities -> Update Music Libraries" to ensure they are installed.',
        ),
      );
      break;
    }

    case MsgType.MUTABLE_VOLUME_DISABLED: {
      warn(format('[Mutable Volume Disabled]\nTried setting volume but "Mutable Volume" is disabled.'));
      break;
    }
    case MsgType.MUTABLE_VOLUME_NOT_IN_CHANNEL: {
      warn(format('[Mutable Volume Not in Channel]\nTried setting volume but the bot is not in a voice channel.'));
      break;
    }

    case MsgType.ERROR_GETTING_YT_INFO: {
      warn(format('Error getting YouTube info.\n%s', args[0]));
    }

    case MsgType.ERROR_CREATING_AUDIO: {
      warn(format('Error creating audio resource.\n%s', args[0]));
    }

    case MsgType.MISSING_MEMBER_INTENT_FIND_USER_ID: {
      warn(
        ' - DBM Warning - \nFind User (by Name/ID) may freeze or error because\nthe bot has not enabled the Server Member Events Intent.',
      );
    }
    case MsgType.CANNOT_FIND_USER_BY_ID: {
      warn(format('[Cannot Find User by ID]\nCannot find user by id: %s', args[0]));
    }

    case MsgType.SERVER_MESSAGE_INTENT_REQUIRED: {
      warn(
        format(
          '[Message Content Intent Required]\n%s commands found that require the "Message Content" intent.\nThese commands require the bot to be able to read messages from Discord servers.\nTo enable this behavior, first ensure the "MESSAGE CONTENT INTENT" is enabled in the "Bot" section on the Discord Developer Portal (the same page you got your bot token from).\nSecondly, in Discord Bot Maker, select Extensions -> Bot Intents from the title menu bar, and in this dialog, make sure "Message Content" is checked.',
          args[0],
        ),
      );
      break;
    }
    case MsgType.CHANNEL_PARTIAL_REQUIRED: {
      warn(
        format(
          '[Channel Partial Required]\n%s commands are set to "DMs Only", but the Channel partial is not enabled.\nTo allow the bot to read messages from DMs, do the following: In Discord Bot Maker, on the title menu bar, go to Extensions -> Bot Partials.\nIn the dialog that appears, select "Custom" and then make sure "Channel (Enables DMs)" is checked.',
          args[0],
        ),
      );
    }
  }
}

function GetActionErrorText(location: string, index: number, dataName: string | null) {
  return 'Error with the ' + location + (dataName ? ` - Action #${index} (${dataName})` : '');
}

//#endregion

//---------------------------------------------------------------------
//#region Bot
// Contains functions for controlling the bot.
//---------------------------------------------------------------------

@DBMExport()
export class Bot {
  // GLOBALS
  static $slash: dbm.CommandMap = {}; // Slash commands
  static $user: dbm.CommandMap = {}; // User commands
  static $msge: dbm.CommandMap = {}; // Message commands

  static $button: dbm.CommandMap = {}; // Button interactions
  static $select: dbm.CommandMap = {}; // Select interactions

  static $cmds: dbm.CommandMap = {}; // Normal commands
  static $icds: dbm.CommandList = []; // Includes word commands
  static $regx: dbm.CommandList = []; // Regular Expression commands
  static $anym: dbm.CommandList = []; // Any message commands

  static $other: dbm.ActionMap = {}; // Manual commands

  static $evts: Record<string, dbm.Event[]> = {}; // Events

  static bot: djs.Client;
  static applicationCommandData: djs.ApplicationCommandData[] = [];
  static tagRegex: RegExp;

  // LOCALS
  static hasMemberIntents: boolean;
  static hasMessageContentIntents: boolean;

  static _hasTextCommands: boolean;
  static _textCommandCount: number;
  static _dmTextCommandCount: number;
  static _caseSensitive: boolean;

  static _slashCommandCreateType: dbm.SlashCommandInitializationType;
  static _slashCommandServerList: string[];

  // CONSTANTS
  static PRIVILEGED_INTENTS: djs.GatewayIntentBits =
    djs.IntentsBitField.Flags.GuildMembers |
    djs.IntentsBitField.Flags.GuildPresences |
    djs.IntentsBitField.Flags.MessageContent;

  static NON_PRIVILEGED_INTENTS: djs.GatewayIntentBits =
    DiscordJS.IntentsBitField.Flags.Guilds |
    DiscordJS.IntentsBitField.Flags.GuildBans |
    DiscordJS.IntentsBitField.Flags.GuildEmojisAndStickers |
    DiscordJS.IntentsBitField.Flags.GuildIntegrations |
    DiscordJS.IntentsBitField.Flags.GuildWebhooks |
    DiscordJS.IntentsBitField.Flags.GuildInvites |
    DiscordJS.IntentsBitField.Flags.GuildVoiceStates |
    DiscordJS.IntentsBitField.Flags.GuildMessages |
    DiscordJS.IntentsBitField.Flags.GuildMessageReactions |
    DiscordJS.IntentsBitField.Flags.GuildMessageTyping |
    DiscordJS.IntentsBitField.Flags.DirectMessages |
    DiscordJS.IntentsBitField.Flags.DirectMessageReactions |
    DiscordJS.IntentsBitField.Flags.DirectMessageTyping;

  static ALL_INTENTS: djs.GatewayIntentBits = Bot.PRIVILEGED_INTENTS | Bot.NON_PRIVILEGED_INTENTS;

  static init(): void {
    this.initBot();
    this.setupBot();
    this.reformatData();
    this.checkForCommandErrors();
    this.initEvents();
    this.login();
  }

  static initBot(): void {
    const options: Partial<djs.ClientOptions> = this.makeClientOptions();
    options.intents = this.intents();
    if (this.usePartials()) {
      options.partials = this.partials();
    }
    this.hasMemberIntents = (options.intents & DiscordJS.IntentsBitField.Flags.GuildMembers) !== 0;
    this.hasMessageContentIntents = (options.intents & DiscordJS.IntentsBitField.Flags.MessageContent) !== 0;
    this.bot = new DiscordJS.Client(options);
  }

  static makeClientOptions(): Partial<djs.ClientOptions> {
    return {};
  }

  static intents(): djs.GatewayIntentBits {
    return this.NON_PRIVILEGED_INTENTS;
  }

  static usePartials(): boolean {
    return false;
  }

  static partials(): djs.Partials[] {
    return [];
  }

  static setupBot() {
    this.bot.on('raw', this.onRawData);
  }

  static onRawData(packet) {
    if (packet.t !== 'MESSAGE_REACTION_ADD' || packet.t !== 'MESSAGE_REACTION_REMOVE') return;

    const client = Bot.bot;
    const channel: djs.Channel = client.channels.resolve(packet.d.channel_id);
    if (channel instanceof djs.TextChannel) {
      if (channel?.messages.cache.has(packet.d.message_id)) {
        return;
      }

      channel.messages
        .fetch(packet.d.message_id)
        .then((message) => {
          const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
          const reaction = message.reactions.resolve(emoji);
          if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, client.users.resolve(packet.d.user_id));
          }
          if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            client.emit('messageReactionRemove', reaction, client.users.resolve(packet.d.user_id));
          }
        })
        .catch(noop);
    }
  }

  static reformatData() {
    this.reformatCommands();
    this.reformatEvents();
  }

  static reformatCommands() {
    const data = Files.data.commands;
    if (!data) return;
    this._hasTextCommands = false;
    this._textCommandCount = 0;
    this._dmTextCommandCount = 0;
    this._caseSensitive = Files.data.settings.case === dbm.StringBoolean.True;
    for (let i = 0; i < data.length; i++) {
      const com = data[i];
      if (com) {
        this.prepareActions(com.actions);

        if (com.comType <= '3') {
          this._textCommandCount++;
          if (com.restriction === '3') {
            this._dmTextCommandCount++;
          }
        }

        switch (com.comType) {
          case '0': {
            this._hasTextCommands = true;
            if (this._caseSensitive) {
              this.$cmds[com.name] = com;
              if (com._aliases) {
                const aliases = com._aliases;
                for (let j = 0; j < aliases.length; j++) {
                  this.$cmds[aliases[j]] = com;
                }
              }
            } else {
              this.$cmds[com.name.toLowerCase()] = com;
              if (com._aliases) {
                const aliases = com._aliases;
                for (let j = 0; j < aliases.length; j++) {
                  this.$cmds[aliases[j].toLowerCase()] = com;
                }
              }
            }
            break;
          }
          case '1': {
            this.$icds.push(com);
            break;
          }
          case '2': {
            this.$regx.push(com);
            break;
          }
          case '3': {
            this.$anym.push(com);
            break;
          }
          case '4': {
            const names = this.validateSlashCommandName(com.name);
            if (names) {
              if (names.length > 3) {
                PrintError(MsgType.TOO_MANY_SPACES_SLASH_NAME, com.name);
              } else {
                const keyName = names.join(' ');
                if (this.$slash[keyName]) {
                  PrintError(MsgType.DUPLICATE_SLASH_COMMAND, keyName);
                } else {
                  this.$slash[keyName] = com;
                  if (names.length === 1) {
                    this.applicationCommandData.push(this.createApiJsonFromCommand(com, keyName));
                  } else {
                    this.mergeSubCommandIntoCommandData(
                      names,
                      this.createApiJsonFromCommand(com, names[names.length - 1]),
                    );
                  }
                }
              }
            } else {
              PrintError(MsgType.INVALID_SLASH_NAME, com.name);
            }
            break;
          }
          case '5': {
            const name = com.name;
            if (this.$user[name]) {
              PrintError(MsgType.DUPLICATE_USER_COMMAND, name);
            } else {
              this.$user[name] = com;
              this.applicationCommandData.push(this.createApiJsonFromCommand(com, name));
            }
            break;
          }
          case '6': {
            const name = com.name;
            if (this.$msge[name]) {
              PrintError(MsgType.DUPLICATE_MESSAGE_COMMAND, name);
            } else {
              this.$msge[name] = com;
              this.applicationCommandData.push(this.createApiJsonFromCommand(com, name));
            }
            break;
          }
          default: {
            this.$other[com._id] = com;
            break;
          }
        }
      }
    }
  }

  static createApiJsonFromCommand(com, name): djs.ApplicationCommandData {
    const result: Partial<djs.ChatInputApplicationCommandData> = {
      name: name ?? com.name,
      description: this.generateSlashCommandDescription(com),
    };
    switch (com.comType) {
      case '4': {
        result.type = DiscordJS.ApplicationCommandType.ChatInput;
        break;
      }
      case '5': {
        result.type = DiscordJS.ApplicationCommandType.User;
        break;
      }
      case '6': {
        result.type = DiscordJS.ApplicationCommandType.Message;
        break;
      }
    }
    if (com.comType === '4' && com.parameters && Array.isArray(com.parameters)) {
      result.options = this.validateSlashCommandParameters(com.parameters, result.name);
    }
    return result as djs.ChatInputApplicationCommandData;
  }

  static mergeSubCommandIntoCommandData(names, data) {
    data.type = DiscordJS.ApplicationCommandOptionType.Subcommand;

    const baseName = names[0];
    let baseCommand: djs.ApplicationCommandData | null =
      this.applicationCommandData.find((data) => data.name === baseName) ?? null;
    if (baseCommand === null) {
      baseCommand = {
        name: baseName,
        description: this.getNoDescriptionText(),
        options: [],
      };
      this.applicationCommandData.push(baseCommand);
    }

    if (baseCommand.type !== djs.ApplicationCommandType.ChatInput) {
      return;
    }

    const chatCommand = baseCommand as djs.ChatInputApplicationCommandData;

    if (names.length === 2) {
      if (!chatCommand.options) {
        chatCommand.options = [];
      }
      if (
        chatCommand.options.find(
          (d) => d.name === data.name && d.type === DiscordJS.ApplicationCommandOptionType.SubcommandGroup,
        )
      ) {
        PrintError(MsgType.SUB_COMMAND_GROUP_ALREADY_EXISTS, names.join(' '));
      } else {
        chatCommand.options.push(data);
      }
    } else if (names.length >= 3) {
      if (!chatCommand.options) {
        chatCommand.options = [];
      }

      const groupName = names[1];
      let baseGroup: djs.ApplicationCommandOptionData | null =
        chatCommand.options.find((option) => option.name === groupName) ?? null;
      if (baseGroup === null) {
        baseGroup = {
          name: groupName,
          description: this.getNoDescriptionText(),
          type: DiscordJS.ApplicationCommandOptionType.SubcommandGroup,
          options: [],
        };
        chatCommand.options.push(baseGroup);
      } else if (baseGroup.type === DiscordJS.ApplicationCommandOptionType.Subcommand) {
        PrintError(MsgType.SUB_COMMAND_ALREADY_EXISTS, names.join(' '), `${names[0]} ${names[1]}`);
        return;
      }

      (baseGroup as djs.APIApplicationCommandSubcommandOption).options?.push(data);
    }
  }

  static validateSlashCommandName(name) {
    if (!name) {
      return false;
    }

    const names = name
      .split(/\s+/)
      .map((name) => this.validateSlashCommandParameterName(name))
      .filter((name) => typeof name === 'string');

    return names.length > 0 ? names : false;
  }

  static validateSlashCommandParameterName(name) {
    if (!name) {
      return false;
    }
    if (name.length > 32) {
      name = name.substring(0, 32);
    }
    if (name.match(/^[\p{L}\w-]{1,32}$/iu)) {
      return name.toLowerCase();
    }
    return false;
  }

  static generateSlashCommandDescription(com) {
    const desc = com.description;
    if (com.comType !== '4') {
      return '';
    }
    return this.validateSlashCommandDescription(desc);
  }

  static validateSlashCommandDescription(desc: string): string {
    if (desc?.length > 100) {
      return desc.substring(0, 100);
    }
    return desc || this.getNoDescriptionText();
  }

  static getNoDescriptionText() {
    return Files.data.settings.noDescriptionText ?? '(no description)';
  }

  static validateSlashCommandParameters(parameters, commandName): djs.ApplicationCommandOptionData[] {
    const requireParams: djs.ApplicationCommandOptionData[] = [];
    const optionalParams: djs.ApplicationCommandOptionData[] = [];
    const existingNames = {};
    for (let i = 0; i < parameters.length; i++) {
      const paramsData: djs.ApplicationCommandOptionData = parameters[i];
      const name = this.validateSlashCommandParameterName(paramsData.name);
      if (name) {
        if (!existingNames[name]) {
          existingNames[name] = true;
          paramsData.name = name;
          paramsData.description = this.validateSlashCommandDescription(paramsData.description);
          paramsData.type = this.convertStringCommandParamTypeToEnum(paramsData.type);
          if ((paramsData as djs.BaseApplicationCommandOptionsData).required) {
            requireParams.push(paramsData);
          } else {
            optionalParams.push(paramsData);
          }
        } else {
          PrintError(MsgType.DUPLICATE_SLASH_PARAMETER, commandName, i + 1, name);
        }
      } else {
        PrintError(MsgType.INVALID_SLASH_PARAMETER_NAME, commandName, i + 1, paramsData.name);
      }
    }
    return requireParams.concat(optionalParams);
  }

  static convertStringCommandParamTypeToEnum(paramTypeStr) {
    const optionType = DiscordJS.ApplicationCommandOptionType;
    switch (paramTypeStr) {
      case 'SUB_COMMAND':
        return optionType.Subcommand;
      case 'SUB_COMMAND_GROUP':
        return optionType.SubcommandGroup;
      case 'INTEGER':
        return optionType.Integer;
      case 'STRING':
        return optionType.String;
      case 'BOOLEAN':
        return optionType.Boolean;
      case 'USER':
        return optionType.User;
      case 'CHANNEL':
        return optionType.Channel;
      case 'ROLE':
        return optionType.Role;
      case 'MENTIONABLE':
        return optionType.Mentionable;
      case 'NUMBER':
        return optionType.Number;
      case 'ATTACHMENT':
        return optionType.Attachment;
    }
    return 0;
  }

  static reformatEvents() {
    const data: dbm.Event[] = Files.data.events;
    if (!data) return;
    for (let i = 0; i < data.length; i++) {
      const event: dbm.Event = data[i];
      if (event) {
        this.prepareActions(event.actions);
        const type: string = event['event-type'];
        if (!this.$evts[type]) this.$evts[type] = [];
        this.$evts[type].push(event);
      }
    }
  }

  static prepareActions(actions) {
    if (actions) {
      const customData = {};
      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        if (action?.name && Actions.modInitReferences[action.name]) {
          Actions.modInitReferences[action.name].call(this, action, customData, i);
        }
      }
      if (Object.keys(customData).length > 0) {
        actions._customData = customData;
      }
    }
  }

  static registerButtonInteraction(interactionId, data) {
    if (interactionId) {
      if (!this.$button[interactionId]) {
        this.$button[interactionId] = data;
      } else {
        PrintError(MsgType.DUPLICATE_BUTTON_ID, interactionId);
      }
    }
  }

  static registerSelectMenuInteraction(interactionId, data) {
    if (interactionId) {
      if (!this.$select[interactionId]) {
        this.$select[interactionId] = data;
      } else {
        PrintError(MsgType.DUPLICATE_SELECT_ID, interactionId);
      }
    }
  }

  static checkForCommandErrors() {
    if (this._textCommandCount > 0 && !this.hasMessageContentIntents) {
      PrintError(MsgType.SERVER_MESSAGE_INTENT_REQUIRED, this._textCommandCount);
    }
    if (
      this._dmTextCommandCount > 0 &&
      (!this.usePartials() || !this.partials().includes(DiscordJS.Partials.Channel))
    ) {
      PrintError(MsgType.CHANNEL_PARTIAL_REQUIRED, this._dmTextCommandCount);
    }
  }

  static initEvents() {
    this.bot.on('ready', this.onReady.bind(this));
    this.bot.on('guildCreate', this.onServerJoin.bind(this));
    this.bot.on('messageCreate', this.onMessage.bind(this));
    this.bot.on('interactionCreate', this.onInteraction.bind(this));
    Events.registerEvents(this.bot);
  }

  static login() {
    this.bot.login(Files.data.settings.token);
  }

  static onReady() {
    process.send?.('BotReady');
    console.log('Bot is ready!'); // Tells editor to start!
    this.restoreVariables();
    this.registerApplicationCommands();
    this.preformInitialization();
  }

  static restoreVariables() {
    Files.restoreServerVariables();
    Files.restoreGlobalVariables();
  }

  static registerApplicationCommands() {
    let slashType: dbm.SlashCommandInitializationType =
      Files.data.settings.slashType ?? dbm.SlashCommandInitializationType.Global;

    this._slashCommandCreateType = slashType;
    this._slashCommandServerList = Files.data.settings?.slashServers?.split?.(/[\n\r]+/) ?? [];

    switch (slashType) {
      case dbm.SlashCommandInitializationType.Limited: {
        this.setCertainServerCommands(this.applicationCommandData, this._slashCommandServerList);
        break;
      }
      default: {
        this.setGlobalCommands(this.applicationCommandData);
        break;
      }
    }
  }

  static onServerJoin(guild) {
    this.initializeCommandsForNewServer(guild);
  }

  static initializeCommandsForNewServer(guild) {
    switch (this._slashCommandCreateType) {
      case dbm.SlashCommandInitializationType.Limited: {
        if (this._slashCommandServerList.includes(guild.id)) {
          this.setCommandsForServer(guild, this.applicationCommandData, true);
        }
        break;
      }
    }
  }

  static shouldPrintAnyMissingAccessError() {
    return !(Files.data.settings.ignoreCommandScopeErrors ?? false);
  }

  static clearUnspecifiedServerCommands() {
    return Files.data.settings.clearUnlistedServers ?? false;
  }

  static setGlobalCommands(commands: djs.ApplicationCommandData[]) {
    this.bot.application?.commands
      ?.set?.(commands)
      .then(function () {})
      .catch(function (err) {
        console.error(err);
      });
  }

  static setCommandsForServer(guild, commands: djs.ApplicationCommandData[], printMissingAccessError) {
    if (guild?.commands?.set) {
      guild.commands
        .set(commands)
        .then(function () {})
        .catch((err) => {
          if (err.code === 50001) {
            if (this.shouldPrintAnyMissingAccessError() && printMissingAccessError) {
              PrintError(MsgType.MISSING_APPLICATION_COMMAND_ACCESS, guild.name, guild.id);
            }
          } else {
            console.error(err);
          }
        });
    }
  }

  /**
   * @deprecated DBM no longer has option for setting all slash commands for all servers. Use global commands instead.
   */
  static setAllServerCommands(commands: djs.ApplicationCommandData[], printMissingAccessError = true) {
    this.bot.guilds.cache.forEach((value: djs.Guild, key: string, map: Map<string, djs.Guild>) => {
      this.bot.guilds
        .fetch(key)
        .then((guild) => {
          this.setCommandsForServer(guild, commands, printMissingAccessError);
        })
        .catch(function (err) {
          console.error(err);
        });
    });
  }

  static setCertainServerCommands(commands: djs.ApplicationCommandData[], serverIdList) {
    if (this.clearUnspecifiedServerCommands()) {
      this.bot.guilds.cache.forEach((value: djs.Guild, key: string, map: Map<string, djs.Guild>) => {
        this.bot.guilds
          .fetch(key)
          .then((guild) => {
            if (serverIdList.includes(guild.id)) {
              this.setCommandsForServer(guild, commands, true);
            } else {
              this.setCommandsForServer(guild, [], true);
            }
          })
          .catch(function (err) {
            console.error(err);
          });
      });
    } else {
      for (let i = 0; i < serverIdList.length; i++) {
        this.bot.guilds
          .fetch(serverIdList[i])
          .then((guild) => {
            this.setCommandsForServer(guild, commands, true);
          })
          .catch(function (err) {
            PrintError(MsgType.INVALID_SLASH_COMMAND_SERVER_ID, serverIdList[i]);
          });
      }
    }
  }

  static preformInitialization() {
    const bot = this.bot;
    if (this.$evts['1']) {
      Events.onInitialization(bot);
    }
    if (this.$evts['48']) {
      Events.onInitializationOnce(bot);
    }
    if (this.$evts['3']) {
      Events.setupIntervals(bot);
    }
  }

  static onMessage(msg) {
    if (msg.author.bot) return;
    try {
      if (!this.checkCommand(msg)) {
        this.onAnyMessage(msg);
      }
    } catch (e) {
      console.error(e);
    }
  }

  static checkCommand(msg) {
    if (!this._hasTextCommands) return false;
    let command = this.checkTag(msg.content);
    if (!command) return false;
    if (!this._caseSensitive) {
      command = command.toLowerCase();
    }
    const cmd = this.$cmds[command];
    if (cmd) {
      Actions.preformActionsFromMessage(msg, cmd);
      return true;
    }
    return false;
  }

  static escapeRegExp(text) {
    return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  static generateTagRegex(tag, allowPrefixSpace): RegExp {
    return new RegExp(`^${this.escapeRegExp(tag)}${allowPrefixSpace ? '\\s*' : ''}`);
  }

  static populateTagRegex() {
    if (this.tagRegex) return;
    const tag = Files.data.settings.tag;
    const allowPrefixSpace = Files.data.settings.allowPrefixSpace === dbm.StringBoolean.True;
    this.tagRegex = this.generateTagRegex(tag, allowPrefixSpace);
    return this.tagRegex;
  }

  static checkTag(content) {
    const allowPrefixSpace = Files.data.settings.allowPrefixSpace === dbm.StringBoolean.True;
    const tag = Files.data.settings.tag;
    this.populateTagRegex();
    const separator = Files.data.settings.separator || '\\s+';
    if (content.startsWith(tag)) {
      if (allowPrefixSpace && this.tagRegex.test(content)) {
        content = content.replace(this.tagRegex, '');
        return content.split(new RegExp(separator))[0];
      } else {
        content = content.split(new RegExp(separator))[0];
        return content.substring(tag.length);
      }
    }
    return null;
  }

  static onAnyMessage(msg: djs.Message) {
    this.checkIncludes(msg);
    this.checkRegExps(msg);
    if (!msg.author.bot) {
      if (this.$evts['2']) {
        Events.callEvents('2', 1, 0, 2, false, null, msg);
      }
      const anym = this.$anym;
      for (let i = 0; i < anym.length; i++) {
        if (anym[i]) {
          Actions.preformActionsFromMessage(msg, anym[i]);
        }
      }
    }
  }

  static checkIncludes(msg: djs.Message) {
    const text = msg.content;
    if (!text) return;
    const icds = this.$icds;
    const icds_len = icds.length;
    for (let i = 0; i < icds_len; i++) {
      if (!icds[i]?.name) continue;
      if (icds[i]._aliases) {
        const words = [icds[i].name].concat(icds[i]._aliases!);
        if (text.match(new RegExp('\\b(?:' + words.join('|') + ')\\b', 'i'))) {
          Actions.preformActionsFromMessage(msg, icds[i]);
        }
      } else if (text.match(new RegExp('\\b' + icds[i].name + '\\b', 'i'))) {
        Actions.preformActionsFromMessage(msg, icds[i]);
      }
    }
  }

  static checkRegExps(msg) {
    const text = msg.content;
    if (!text) return;
    const regx = this.$regx;
    const regx_len = regx.length;
    for (let i = 0; i < regx_len; i++) {
      if (regx[i]?.name) {
        if (text.match(new RegExp(regx[i].name, 'i'))) {
          Actions.preformActionsFromMessage(msg, regx[i]);
        } else if (regx[i]._aliases) {
          const aliases: string[] = regx[i]._aliases!;
          const aliases_len: number = aliases.length;
          for (let j = 0; j < aliases_len; j++) {
            if (text.match(new RegExp('\\b' + aliases[j] + '\\b', 'i'))) {
              Actions.preformActionsFromMessage(msg, regx[i]);
              break;
            }
          }
        }
      }
    }
  }

  static async onInteraction(interaction: djs.BaseInteraction) {
    if (interaction.isChatInputCommand()) {
      await this.onSlashCommandInteraction(interaction);
    } else if (interaction.isContextMenuCommand()) {
      await this.onContextMenuInteraction(interaction);
    } else if (interaction.isModalSubmit()) {
      Actions.checkModalSubmitResponses(interaction);
    } else if (interaction.isMessageComponent()) {
      if (interaction.component?.type === DiscordJS.ComponentType.Button) {
        (interaction as any)._button = interaction.component;
      } else if (interaction.component?.type === DiscordJS.ComponentType.SelectMenu) {
        (interaction as any)._select = interaction.component;
      }
      if (!Actions.checkTemporaryInteractionResponses(interaction)) {
        if (interaction.isButton()) {
          await this.onButtonInteraction(interaction);
        } else if (interaction.isStringSelectMenu()) {
          await this.onSelectMenuInteraction(interaction);
        }
      }
    }
  }

  static async onSlashCommandInteraction(interaction: djs.ChatInputCommandInteraction) {
    let interactionName = interaction.commandName;

    const group = interaction.options.getSubcommandGroup(false);
    if (group) {
      interactionName += ' ' + group;
    }

    const sub = interaction.options.getSubcommand(false);
    if (sub) {
      interactionName += ' ' + sub;
    }

    if (this.$slash[interactionName]) {
      await Actions.preformActionsFromInteraction(interaction, this.$slash[interactionName], true);
    }
  }

  static async onContextMenuInteraction(interaction: djs.ContextMenuCommandInteraction) {
    if (interaction.isUserContextMenuCommand()) {
      await this.onUserContextMenuInteraction(interaction);
    } else if (interaction.isMessageContextMenuCommand()) {
      await this.onMessageContextMenuInteraction(interaction);
    }
  }

  static async onUserContextMenuInteraction(interaction: djs.UserContextMenuCommandInteraction) {
    const interactionName = interaction.commandName;
    if (this.$user[interactionName]) {
      if (interaction.guild) {
        const member = await interaction.guild.members.fetch(interaction.targetId);
        (interaction as any)._targetMember = member;
        await Actions.preformActionsFromInteraction(interaction, this.$user[interactionName], true);
      } else {
        (interaction as any)._targetMember = interaction.targetUser;
        await Actions.preformActionsFromInteraction(interaction, this.$user[interactionName], true);
      }
    }
  }

  static async onMessageContextMenuInteraction(interaction: djs.MessageContextMenuCommandInteraction) {
    const interactionName = interaction.commandName;
    if (this.$msge[interactionName]) {
      const msg = interaction.targetMessage;
      if (!(msg instanceof DiscordJS.Message) && interaction.channel) {
        const message = await interaction.channel.messages.fetch(interaction.targetId);
        (interaction as any)._targetMessage = message;
        await Actions.preformActionsFromInteraction(interaction, this.$msge[interactionName], true);
      } else {
        (interaction as any)._targetMessage = msg;
        await Actions.preformActionsFromInteraction(interaction, this.$msge[interactionName], true);
      }
    }
  }

  static async onButtonInteraction(interaction: djs.ButtonInteraction) {
    const interactionId = interaction.customId;
    if (this.$button[interactionId]) {
      await Actions.preformActionsFromInteraction(interaction, this.$button[interactionId]);
    } else {
      const response = Actions.getInvalidButtonResponseText();
      if (response) {
        interaction.reply({ content: response, ephemeral: true });
      }
    }
  }

  static onSelectMenuInteraction(interaction: djs.StringSelectMenuInteraction) {
    const interactionId = interaction.customId;
    if (this.$select[interactionId]) {
      Actions.preformActionsFromSelectInteraction(interaction, this.$select[interactionId]);
    } else {
      const response = Actions.getInvalidSelectResponseText();
      if (response) {
        interaction.reply({ content: response, ephemeral: true });
      }
    }
  }
}

//#endregion

//---------------------------------------------------------------------
//#region Actions
// Contains functions for bot actions.
//---------------------------------------------------------------------

@DBMExport()
export class Actions {
  static actionsLocation: string | null = null;
  static eventsLocation: string | null = null;
  static extensionsLocation: string | null = null;

  static server = {};
  static global = {};

  static timeStamps: Record<string, Date>[] = [];

  static modInitReferences: Record<string, Function> = {};

  static _letterEmojis = '🇦 🇧 🇨 🇩 🇪 🇫 🇬 🇭 🇮 🇯 🇰 🇱 🇲 🇳 🇴 🇵 🇶 🇷 🇸 🇹 🇺 🇻 🇼 🇽 🇾 🇿'.split(' ');

  static __cachedText: Record<string, boolean> | undefined;

  static _temporaryInteractionIdMax: number;
  static _temporaryInteractions: Record<
    string,
    { customId: string; userId: string; callback: Function; uniqueId: string }[] | Function
  >;

  static exists(action) {
    if (!action) return false;
    return typeof this[action] === 'function';
  }

  static getLocalFile(url) {
    return require('node:path').join(process.cwd(), url);
  }

  static getDBM() {
    return DBM;
  }

  static async callListFunc(list, funcName, args) {
    let result: any[] = [];

    const len = list.length;
    for (let i = 0; i < len; i++) {
      const item = list[i];
      if (typeof item?.[funcName] === 'function') {
        try {
          result.push(await item[funcName].apply(item, args));
        } catch (e) {}
      }
    }

    return result;
  }

  static getActionVariable(name, defaultValue) {
    if (this[name] === undefined && defaultValue !== undefined) {
      this[name] = defaultValue;
    }
    return this[name];
  }

  static getSlashParameter(interaction, name, defaultValue) {
    if (!interaction) {
      return defaultValue ?? null;
    }

    if (interaction.__originalInteraction) {
      const result = this.getParameterFromInteraction(interaction.__originalInteraction, name);
      if (result !== null) {
        return result;
      }
    }

    const result = this.getParameterFromInteraction(interaction, name);
    if (result !== null) {
      return result;
    }

    return defaultValue !== undefined ? defaultValue : result;
  }

  static convertTextToEmojis(text, useRegional = true) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const code = text.toUpperCase().charCodeAt(i) - 65;
      if (code >= 0 && code <= 26) {
        result += useRegional ? ':regional_indicator_' + text[i].toLowerCase() + ':' : '\\' + this._letterEmojis[code];
      } else {
        result += text[i];
      }
    }
    return result;
  }

  static getFlagEmoji(flagName: string): string {
    if (flagName.startsWith('flag_')) {
      flagName = flagName.substring(5);
    }
    flagName = flagName.toUpperCase();
    return this._letterEmojis[flagName.charCodeAt(0) - 65] + this._letterEmojis[flagName.charCodeAt(1) - 65];
  }

  static getCustomEmoji(nameOrId: string): djs.GuildEmoji | undefined {
    return Bot.bot.emojis.cache.get(nameOrId) ?? Bot.bot.emojis.cache.find((e) => e.name === nameOrId);
  }

  static eval(content: string, cache: ActionsCache, logError: boolean = true) {
    if (!content) return false;
    const DBM = this.getDBM();
    const tempVars = this.getActionVariable.bind(cache.temp);
    let serverVars: Function | null = null;
    if (cache.server) {
      serverVars = this.getActionVariable.bind(this.server[cache.server.id]);
    }
    const globalVars = this.getActionVariable.bind(this.global);
    const slashParams = this.getSlashParameter.bind(this, cache.interaction);
    const customEmoji = this.getCustomEmoji.bind(this);
    const msg = cache.msg;
    const interaction = cache.interaction;
    const button = (interaction as any)?._button ?? '';
    const select = (interaction as any)?._select ?? '';
    const server = cache.server;
    const client = DBM.Bot.bot;
    const bot = DBM.Bot.bot;
    const me = server?.members?.me ?? null;
    let user: djs.User | string = '',
      member: djs.GuildMember | djs.APIInteractionGuildMember | string = '',
      channel: djs.Channel | string = '',
      mentionedUser: djs.User | string = '',
      mentionedChannel: djs.Channel | string = '',
      defaultChannel = '';
    if (msg) {
      user = msg.author;
      member = msg.member ?? '';
      channel = msg.channel;
      mentionedUser = msg.mentions.users.first() ?? '';
      mentionedChannel = msg.mentions.channels.first() ?? '';
    }
    if (interaction) {
      user = interaction.user;
      member = interaction.member ?? 'null';
      channel = interaction.channel ?? 'null';
      if (interaction instanceof djs.ChatInputCommandInteraction && interaction.options) {
        mentionedUser = interaction.options.resolved?.users?.first?.() ?? '';
        mentionedChannel = interaction.options.resolved?.channels?.first?.() ?? '';
      }
    }
    if (server) {
      defaultChannel = (server as any).getDefaultChannel();
    }
    try {
      return eval(content);
    } catch (e) {
      if (logError) console.error(e);
      return false;
    }
  }

  static evalMessage(content: string, cache: ActionsCache): any {
    if (!content) return '';
    if (!content.match(/\$\{.*\}/im)) return content;
    return this.eval('`' + content.replace(/`/g, '\\`') + '`', cache);
  }

  static evalIfPossible(content: string, cache: ActionsCache): any {
    this.__cachedText ??= {};
    if (content in this.__cachedText) return content;
    let result = this.eval(content, cache, false);
    if (result === false) result = this.evalMessage(content, cache);
    if (result === false) {
      this.__cachedText[content] = true;
      result = content;
    }
    return result;
  }

  static initMods() {
    this.modInitReferences = {};
    const fs = require('node:fs');
    const path = require('node:path');
    this.modDirectories().forEach((dir) => {
      fs.readdirSync(dir).forEach((file) => {
        if (!/\.(?:js|ts)$/i.test(file)) {
          return;
        }
        let action = require(path.join(dir, file));
        if (action.default) {
          action = action.default;
        }
        if (action.action) {
          this[action.name] = action.action;
        }
        if (action.modInit) {
          this.modInitReferences[action.name] = action.modInit;
        }
        if (action.mod) {
          try {
            action.mod(DBM);
          } catch (e) {
            console.error(e);
          }
        }
      });
    });
  }

  static modDirectories(): string[] {
    const result: string[] = [this.actionsLocation!];
    if (Files.verifyDirectory(this.eventsLocation)) {
      result.push(this.eventsLocation!);
    }
    if (Files.verifyDirectory(this.extensionsLocation)) {
      result.push(this.extensionsLocation!);
    }
    return result;
  }

  static async preformActionsFromMessage(msg: djs.Message, cmd) {
    if (
      (await this.checkConditions(msg.guild, msg.member, msg.author, cmd)) &&
      this.checkTimeRestriction(msg.author, msg, cmd)
    ) {
      this.invokeActions(msg, cmd.actions, cmd);
    }
  }

  static async preformActionsFromInteraction(
    interaction: djs.CommandInteraction | djs.MessageComponentInteraction,
    cmd: dbm.Command,
    passMeta: boolean = false,
    initialTempVars: Record<string, any> | null = null,
  ) {
    // Check command conditions
    const passesConditions = await this.checkConditions(interaction.guild, interaction.member, interaction.user, cmd);
    if (!passesConditions) {
      const invalidPermissions = this.getInvalidPermissionsResponse();
      if (invalidPermissions) {
        interaction.reply({ content: invalidPermissions, ephemeral: true });
      }
      return;
    }

    // Check command cooldown
    const invalidCooldown = this.getInvalidCooldownResponse();
    const timeRestriction = this.checkTimeRestriction(interaction.user, interaction, cmd, true);
    if (timeRestriction !== true) {
      if (!invalidCooldown) {
        return;
      }
      const { format } = require('node:util');
      const content = typeof timeRestriction === 'string' ? format(invalidCooldown, timeRestriction) : invalidCooldown;
      interaction.reply({ content: content, ephemeral: true });
      return;
    }

    // Defer command
    if (cmd.defer !== dbm.CommandDeferType.Manual) {
      await interaction.deferReply({
        ephemeral: cmd.defer === dbm.CommandDeferType.EphemeralDefer,
      });
    }

    this.invokeInteraction(interaction, cmd.actions, initialTempVars, passMeta ? cmd : null);
  }

  static preformActionsFromSelectInteraction(
    interaction: djs.StringSelectMenuInteraction,
    select,
    passMeta: boolean = false,
    initialTempVars: Record<string, any> | null = null,
  ) {
    const tempVars = initialTempVars ?? {};
    if (typeof select.tempVarName === 'string') {
      const values = interaction.values;
      tempVars[select.tempVarName] = !values || values.length === 0 ? 0 : values.length === 1 ? values[0] : values;
    }
    this.preformActionsFromInteraction(interaction, select, passMeta, tempVars);
  }

  static async checkConditions(
    guild: djs.Guild | null,
    member: djs.GuildMember | djs.APIGuildMember | null,
    user: djs.User,
    cmd: dbm.Command,
  ): Promise<boolean> {
    // If a `djs.APIGuildMember`, convert to `djs.GuildMember` (or null if impossible).
    if (member !== null && !(member instanceof djs.GuildMember)) {
      if (member.user?.id) {
        member = (await guild?.members.fetch(member.user?.id)) ?? null;
      } else {
        member = null;
      }
    }

    const isServer = guild !== null && member !== null;
    const restriction = parseInt(cmd.restriction, 10);
    switch (restriction) {
      case 0:
      case 1: {
        if (isServer) {
          if (Array.isArray(cmd.requiredPermissions)) {
            return this.checkPermissions(
              member!,
              cmd.requiredPermissions
                .map((str) => this.convertPermissionStringToResolvable(str))
                .filter(function (p: djs.PermissionResolvable | null): p is djs.PermissionResolvable {
                  return p !== null;
                }),
            );
          }

          // deprecated implementation for compatibility
          return (
            this.checkPermissionString(member!, cmd.permissions) &&
            this.checkPermissionString(member!, cmd.permissions2)
          );
        }
        return restriction === 0;
      }
      case 2:
        return isServer && guild!.ownerId === member!.id;
      case 3:
        return !isServer;
      case 4:
        return !!Files.data.settings.ownerId && user.id === Files.data.settings.ownerId;
      default:
        return true;
    }
  }

  static checkPermissionString(member: djs.GuildMember, permissionString: string): boolean {
    if (permissionString && permissionString !== 'NONE') {
      const resolvable = this.convertPermissionStringToResolvable(permissionString);
      if (resolvable !== null) {
        return this.checkPermissions(member, resolvable);
      }
    }
    return true;
  }

  static checkPermissions(member: djs.GuildMember, permissions: djs.PermissionResolvable): boolean {
    if (!permissions) return true;
    if (!member) return false;
    if (member.guild?.ownerId === member.id) return true;
    return member.permissions.has(permissions);
  }

  static convertPermissionStringToResolvable(permissionName: string): djs.PermissionResolvable | null {
    switch (permissionName) {
      case 'CREATE_INSTANT_INVITE':
        return djs.PermissionFlagsBits.CreateInstantInvite;
      case 'KICK_MEMBERS':
        return djs.PermissionFlagsBits.KickMembers;
      case 'BAN_MEMBERS':
        return djs.PermissionFlagsBits.BanMembers;
      case 'ADMINISTRATOR':
        return djs.PermissionFlagsBits.Administrator;
      case 'MANAGE_CHANNELS':
        return djs.PermissionFlagsBits.ManageChannels;
      case 'MANAGE_GUILD':
        return djs.PermissionFlagsBits.ManageGuild;
      case 'ADD_REACTIONS':
        return djs.PermissionFlagsBits.AddReactions;
      case 'VIEW_AUDIT_LOG':
        return djs.PermissionFlagsBits.ViewAuditLog;
      case 'PRIORITY_SPEAKER':
        return djs.PermissionFlagsBits.PrioritySpeaker;
      case 'STREAM':
        return djs.PermissionFlagsBits.Stream;
      case 'VIEW_CHANNEL':
        return djs.PermissionFlagsBits.ViewChannel;
      case 'SEND_MESSAGES':
        return djs.PermissionFlagsBits.SendMessages;
      case 'SEND_TTS_MESSAGES':
        return djs.PermissionFlagsBits.SendTTSMessages;
      case 'MANAGE_MESSAGES':
        return djs.PermissionFlagsBits.ManageMessages;
      case 'EMBED_LINKS':
        return djs.PermissionFlagsBits.EmbedLinks;
      case 'ATTACH_FILES':
        return djs.PermissionFlagsBits.AttachFiles;
      case 'READ_MESSAGE_HISTORY':
        return djs.PermissionFlagsBits.ReadMessageHistory;
      case 'MENTION_EVERYONE':
        return djs.PermissionFlagsBits.MentionEveryone;
      case 'USE_EXTERNAL_EMOJIS':
        return djs.PermissionFlagsBits.UseExternalEmojis;
      case 'VIEW_GUILD_INSIGHTS':
        return djs.PermissionFlagsBits.ViewGuildInsights;
      case 'CONNECT':
        return djs.PermissionFlagsBits.Connect;
      case 'SPEAK':
        return djs.PermissionFlagsBits.Speak;
      case 'MUTE_MEMBERS':
        return djs.PermissionFlagsBits.MuteMembers;
      case 'DEAFEN_MEMBERS':
        return djs.PermissionFlagsBits.DeafenMembers;
      case 'MOVE_MEMBERS':
        return djs.PermissionFlagsBits.MoveMembers;
      case 'USE_VAD':
        return djs.PermissionFlagsBits.UseVAD;
      case 'CHANGE_NICKNAME':
        return djs.PermissionFlagsBits.ChangeNickname;
      case 'MANAGE_NICKNAMES':
        return djs.PermissionFlagsBits.ManageNicknames;
      case 'MANAGE_ROLES':
        return djs.PermissionFlagsBits.ManageRoles;
      case 'MANAGE_WEBHOOKS':
        return djs.PermissionFlagsBits.ManageWebhooks;
      case 'MANAGE_EMOJIS_AND_STICKERS':
        return djs.PermissionFlagsBits.ManageEmojisAndStickers;
      case 'MANAGE_GUILD_EXPRESSIONS':
        return djs.PermissionFlagsBits.ManageGuildExpressions;
      case 'USE_APPLICATION_COMMANDS':
        return djs.PermissionFlagsBits.UseApplicationCommands;
      case 'REQUEST_TO_SPEAK':
        return djs.PermissionFlagsBits.RequestToSpeak;
      case 'MANAGE_EVENTS':
        return djs.PermissionFlagsBits.ManageEvents;
      case 'MANAGE_THREADS':
        return djs.PermissionFlagsBits.ManageThreads;
      case 'CREATE_PUBLIC_THREADS':
        return djs.PermissionFlagsBits.CreatePublicThreads;
      case 'CREATE_PRIVATE_THREADS':
        return djs.PermissionFlagsBits.CreatePrivateThreads;
      case 'USE_EXTERNAL_STICKERS':
        return djs.PermissionFlagsBits.UseExternalStickers;
      case 'SEND_MESSAGES_IN_THREADS':
        return djs.PermissionFlagsBits.SendMessagesInThreads;
      case 'USE_EMBEDDED_ACTIVITIES':
        return djs.PermissionFlagsBits.UseEmbeddedActivities;
      case 'MODERATE_MEMBERS':
        return djs.PermissionFlagsBits.ModerateMembers;
      case 'VIEW_CREATOR_MONETIZATION_ANALYTICS':
        return djs.PermissionFlagsBits.ViewCreatorMonetizationAnalytics;
      case 'USE_SOUNDBOARD':
        return djs.PermissionFlagsBits.UseSoundboard;
      case 'USE_EXTERNAL_SOUNDS':
        return djs.PermissionFlagsBits.UseExternalSounds;
      case 'SEND_VOICE_MESSAGES':
        return djs.PermissionFlagsBits.SendVoiceMessages;
    }
    return null;
  }

  static checkTimeRestriction(user, msgOrInteraction, cmd: dbm.Command, returnTimeString = false) {
    if (!cmd._timeRestriction) return true;
    if (!user) return false;
    const mid = user.id;
    const cid = cmd._id;
    if (!this.timeStamps[cid]) {
      this.timeStamps[cid] = [];
      this.timeStamps[cid][mid] = Date.now();
      return true;
    } else if (!this.timeStamps[cid][mid]) {
      this.timeStamps[cid][mid] = Date.now();
      return true;
    } else {
      const time = Date.now();
      const diff = time - this.timeStamps[cid][mid];
      if (cmd._timeRestriction <= Math.floor(diff / 1000)) {
        this.timeStamps[cid][mid] = time;
        return true;
      } else {
        const remaining = cmd._timeRestriction - Math.floor(diff / 1000);
        const timeString = this.generateTimeString(remaining);
        Events.callEvents('38', 1, 3, 2, false, null, msgOrInteraction?.member, timeString);
        return returnTimeString ? timeString : false;
      }
    }
  }

  static generateTimeString(milliseconds) {
    let remaining = milliseconds;
    const times: string[] = [];

    const days = Math.floor(remaining / 60 / 60 / 24);
    if (days > 0) {
      remaining -= days * 60 * 60 * 24;
      times.push(days + (days === 1 ? ' day' : ' days'));
    }
    const hours = Math.floor(remaining / 60 / 60);
    if (hours > 0) {
      remaining -= hours * 60 * 60;
      times.push(hours + (hours === 1 ? ' hour' : ' hours'));
    }
    const minutes = Math.floor(remaining / 60);
    if (minutes > 0) {
      remaining -= minutes * 60;
      times.push(minutes + (minutes === 1 ? ' minute' : ' minutes'));
    }
    const seconds = Math.floor(remaining);
    if (seconds > 0) {
      remaining -= seconds;
      times.push(seconds + (seconds === 1 ? ' second' : ' seconds'));
    }

    let result = '';
    if (times.length === 1) {
      result = times[0];
    } else if (times.length === 2) {
      result = times[0] + ' and ' + times[1];
    } else if (times.length === 3) {
      result = times[0] + ', ' + times[1] + ', and ' + times[2];
    } else if (times.length === 4) {
      result = times[0] + ', ' + times[1] + ', ' + times[2] + ', and ' + times[3];
    }
    return result;
  }

  static invokeActions(msg, actions, cmd: any = null) {
    if (actions.length > 0) {
      this.callNextAction(
        new ActionsCache(actions, msg.guild, {
          msg,
          meta: {
            name: cmd?.name,
            isEvent: false,
          },
        }),
      );
    }
  }

  static invokeInteraction(
    interaction: djs.CommandInteraction | djs.MessageComponentInteraction,
    actions,
    initialTempVars,
    meta: { name: string } | null = null,
  ) {
    const cacheData: any = {
      interaction,
      temp: initialTempVars || {},
    };
    if (meta) {
      cacheData.meta = {
        name: meta?.name,
        isEvent: false,
      };
    }

    const cache = new ActionsCache(actions, interaction.guild, cacheData);
    this.callNextAction(cache);
  }

  static invokeEvent(event, server, temp) {
    const actions = event.actions;
    if (actions.length > 0) {
      const cache = new ActionsCache(actions, server, {
        temp: { ...temp },
        meta: {
          name: event.name,
          isEvent: true,
        },
      });
      this.callNextAction(cache);
    }
  }

  static callNextAction(cache) {
    cache.index++;
    const index = cache.index;
    const actions = cache.actions;
    const act = actions[index];
    if (!act) {
      this.endActions(cache);
      return;
    }
    if (this.exists(act.name)) {
      try {
        this[act.name](cache);
      } catch (e) {
        this.displayError(act, cache, e);
      }
    } else {
      PrintError(MsgType.MISSING_ACTION, act.name);
      this.callNextAction(cache);
    }
  }

  static endActions(cache: ActionsCache) {
    cache.callback?.();
    cache.onCompleted?.();
  }

  static getInvalidButtonResponseText() {
    return Files.data.settings.invalidButtonText ?? 'Button response no longer valid.';
  }

  static getInvalidSelectResponseText() {
    return Files.data.settings.invalidSelectText ?? 'Select menu response no longer valid.';
  }

  static getDefaultResponseText() {
    return Files.data.settings.autoResponseText ?? 'Command successfully run!';
  }

  static getInvalidPermissionsResponse() {
    return Files.data.settings.invalidPermissionsText ?? 'Invalid permissions!';
  }

  static getInvalidUserResponse() {
    return Files.data.settings.invalidUserText ?? 'Invalid user!';
  }

  static getInvalidCooldownResponse() {
    return Files.data.settings.invalidCooldownText ?? 'Must wait %s before using this action.';
  }

  static getErrorString(data: { name: string } | null, cache: ActionsCache) {
    const location = cache.toString();
    return GetActionErrorText(location, cache.index + 1, data?.name ?? null);
  }

  static displayError(data, cache, err) {
    if (err.code === 10062) {
      console.log(
        'NOTE! The error below is caused because your Discord bot took too long to respond.\n' +
          'To fix this, set the "Command Defer" option on your command to "Defer At Start" or ' +
          '"Defer Secretly" to let Discord know your bot needs more time to process the command.',
      );
    }
    if (!data) data = cache.actions[cache.index];
    const dbm = this.getErrorString(data, cache);
    console.error(dbm + ':\n' + (err.stack ?? err));
    Events.onError(dbm, err.stack ?? err, cache);
  }

  static getParameterFromInteraction(interaction, name) {
    if (interaction.__originalInteraction) {
      const result = this.getParameterFromInteraction(interaction.__originalInteraction, name);
      if (result !== null) {
        return result;
      }
    }
    if (interaction?.options?.get) {
      const option = interaction.options.get(name.toLowerCase());
      return this.getParameterFromParameterData(option);
    }
    return null;
  }

  static getParameterFromParameterData(option) {
    if (typeof option === 'object') {
      // ApplicationCommandOptionType
      // https://discord-api-types.dev/api/discord-api-types-v10/enum/ApplicationCommandOptionType
      switch (option?.type) {
        case DiscordJS.ApplicationCommandOptionType.String:
        case DiscordJS.ApplicationCommandOptionType.Integer:
        case DiscordJS.ApplicationCommandOptionType.Boolean:
        case DiscordJS.ApplicationCommandOptionType.Number: {
          return option.value;
        }
        case DiscordJS.ApplicationCommandOptionType.User: {
          return option.member ?? option.user;
        }
        case DiscordJS.ApplicationCommandOptionType.Channel: {
          return option.channel;
        }
        case DiscordJS.ApplicationCommandOptionType.Role: {
          return option.role;
        }
        case DiscordJS.ApplicationCommandOptionType.Mentionable: {
          return option.member ?? option.channel ?? option.role ?? option.user;
        }
        case DiscordJS.ApplicationCommandOptionType.Attachment: {
          return option.attachment?.url ?? '';
        }
      }
    }
    return null;
  }

  static async findMemberOrUserFromName(name, server) {
    if (!Bot.hasMemberIntents) {
      PrintError(MsgType.MISSING_MEMBER_INTENT_FIND_USER_ID);
    }
    const user = Bot.bot.users.cache.find((user) => user.username === name);
    if (user) {
      const result = await server.members.fetch(user);
      if (result) {
        return result;
      }
    } else if (server) {
      const allMembers = await server.members.fetch();
      const member = allMembers.find((user) => user.username === name);
      if (member) {
        return member;
      }
    }
    return null;
  }

  static async findMemberOrUserFromID(id, server) {
    if (!Bot.hasMemberIntents) {
      PrintError(MsgType.MISSING_MEMBER_INTENT_FIND_USER_ID);
      return null;
    }
    if (!id) {
      PrintError(MsgType.CANNOT_FIND_USER_BY_ID, id);
      return null;
    }

    if (server) {
      const member = await server.members.fetch(id).catch(noop);
      if (member) {
        return member;
      }
    }

    const user = await Bot.bot.users.fetch(id).catch(noop);
    if (user) {
      return user;
    }
    return null;
  }

  static getTargetFromVariableOrParameter(varType, varName, cache) {
    switch (varType) {
      case 0:
        return cache.temp[varName];
      case 1:
        const server = cache.server;
        if (server && this.server[server.id]) {
          return this.server[server.id][varName];
        }
        break;
      case 2:
        return this.global[varName];
      case 3:
        const interaction = cache.interaction;
        const result = this.getParameterFromInteraction(interaction, varName);
        if (result !== null) {
          return result;
        }
        break;
      default:
        break;
    }
    return null;
  }

  static async getSendTargetFromData(typeData, varNameData, cache) {
    return await this.getSendTarget(parseInt(typeData, 10), this.evalMessage(varNameData, cache), cache);
  }

  static async getSendTarget(type, varName, cache) {
    const { interaction, msg, server } = cache;
    switch (type) {
      case 0:
        if (interaction) {
          return interaction.channel;
        } else if (msg) {
          return msg.channel;
        }
        break;
      case 1:
        if (interaction) {
          return interaction.user;
        } else if (msg) {
          return msg.author;
        }
        break;
      case 2: {
        const users = interaction?.options?.resolved?.users ?? msg?.mentions?.users;
        if (users?.size) {
          return users.first();
        }
        break;
      }
      case 3: {
        const channels = interaction?.options?.resolved?.channels ?? msg?.mentions?.channels;
        if (channels?.size) {
          return channels.first();
        }
        break;
      }
      case 4:
        if (server) {
          return server.getDefaultChannel();
        }
        break;
      case 9:
        if (interaction?._targetMember) {
          return interaction._targetMember;
        }
        break;
      case 10:
        if (server) {
          return server.publicUpdatesChannel;
        }
        break;
      case 11:
        if (server) {
          return server.rulesChannel;
        }
        break;
      case 12:
        if (server) {
          return server.systemChannel;
        }
        break;
      case 100: {
        const searchValue = this.evalMessage(varName, cache);
        const result = await this.findMemberOrUserFromName(searchValue, cache.server);
        if (result) {
          return result;
        }
        break;
      }
      case 101: {
        const searchValue = this.evalMessage(varName, cache);
        const result = await this.findMemberOrUserFromID(searchValue, cache.server);
        if (result) {
          return result;
        }
        break;
      }
      case 102: {
        const searchValue = this.evalMessage(varName, cache);
        const result = Bot.bot.channels.cache.find(
          (channel: djs.Channel) => (channel as djs.GuildChannel).name === searchValue,
        );
        if (result) {
          return result;
        }
        break;
      }
      case 103: {
        const searchValue = this.evalMessage(varName, cache);
        const result = Bot.bot.channels.cache.get(searchValue);
        if (result) {
          return result;
        }
        break;
      }
      default:
        return this.getTargetFromVariableOrParameter(type - 5, varName, cache);
    }
    return null;
  }

  static async getSendReplyTarget(type, varName, cache) {
    const { interaction, msg, server } = cache;
    switch (type) {
      case 13:
        const msg = cache.getMessage();
        if (msg) {
          return msg;
        }
        break;
      default:
        return await this.getSendTarget(type, varName, cache);
    }
    return null;
  }

  static async getMemberFromData(typeData, varNameData, cache) {
    return await this.getMember(parseInt(typeData, 10), this.evalMessage(varNameData, cache), cache);
  }

  static async getMember(type, varName, cache) {
    const { interaction, msg } = cache;
    switch (type) {
      case 0: {
        const members = interaction?.options?.resolved?.members ?? msg?.mentions?.members;
        if (members?.size) {
          return members.first();
        }
        break;
      }
      case 1:
        if (interaction) {
          return interaction.member ?? interaction.user;
        } else if (msg) {
          return msg.member ?? msg.author;
        }
        break;
      case 6:
        if (interaction?._targetMember) {
          return interaction._targetMember;
        }
        break;
      case 100: {
        const searchValue = this.evalMessage(varName, cache);
        const result = await this.findMemberOrUserFromName(searchValue, cache.server);
        if (result) {
          return result;
        }
        break;
      }
      case 101: {
        const searchValue = this.evalMessage(varName, cache);
        const result = await this.findMemberOrUserFromID(searchValue, cache.server);
        if (result) {
          return result;
        }
        break;
      }
      default:
        return this.getTargetFromVariableOrParameter(type - 2, varName, cache);
    }
    return null;
  }

  static async getMessageFromData(typeData, varNameData, cache) {
    return await this.getMessage(parseInt(typeData, 10), this.evalMessage(varNameData, cache), cache);
  }

  static async getMessage(type, varName, cache) {
    switch (type) {
      case 0:
        const msg = cache.getMessage();
        if (msg) {
          return msg;
        }
        break;
      default:
        return this.getTargetFromVariableOrParameter(type - 1, varName, cache);
    }
    return null;
  }

  static async getServerFromData(typeData, varNameData, cache) {
    return await this.getServer(parseInt(typeData, 10), this.evalMessage(varNameData, cache), cache);
  }

  static async getServer(type, varName, cache) {
    const server = cache.server;
    switch (type) {
      case 0:
        if (server) {
          return server;
        }
        break;
      case 100: {
        const searchValue = this.evalMessage(varName, cache);
        const result = Bot.bot.guilds.cache.find((guild) => guild.name === searchValue);
        if (result) {
          return result;
        }
        break;
      }
      case 101: {
        const searchValue = this.evalMessage(varName, cache);
        const result = Bot.bot.guilds.cache.get(searchValue);
        if (result) {
          return result;
        }
        break;
      }
      default:
        return this.getTargetFromVariableOrParameter(type - 1, varName, cache);
    }
    return null;
  }

  static async getRoleFromData(typeData, varNameData, cache) {
    return await this.getRole(parseInt(typeData, 10), this.evalMessage(varNameData, cache), cache);
  }

  static async getRole(type, varName, cache) {
    const { interaction, msg, server } = cache;
    switch (type) {
      case 0: {
        const roles = interaction?.options?.resolved?.roles ?? msg?.mentions?.roles;
        if (roles?.size) {
          return roles.first();
        }
        break;
      }
      case 1: {
        const member = interaction?.member ?? msg?.member;
        if (member?.roles?.cache?.size) {
          return msg.member.roles.cache.first();
        }
        break;
      }
      case 2: {
        if (server?.roles?.cache?.size) {
          return server.roles.cache.first();
        }
        break;
      }
      case 100: {
        if (server) {
          const searchValue = this.evalMessage(varName, cache);
          const result = server.roles.cache.find((role) => role.name === searchValue);
          if (result) {
            return result;
          }
        }
        break;
      }
      case 101: {
        if (server) {
          const searchValue = this.evalMessage(varName, cache);
          const result = server.roles.cache.get(searchValue);
          if (result) {
            return result;
          }
        }
        break;
      }
      default:
        return this.getTargetFromVariableOrParameter(type - 3, varName, cache);
    }
    return null;
  }

  static async getChannelFromData(typeData, varNameData, cache) {
    return await this.getChannel(parseInt(typeData, 10), this.evalMessage(varNameData, cache), cache);
  }

  static async getChannel(type, varName, cache) {
    const { interaction, msg, server } = cache;
    switch (type) {
      case 0:
        if (interaction) {
          return interaction.channel;
        } else if (msg) {
          return msg.channel;
        }
        break;
      case 1: {
        const channels = interaction?.options?.resolved?.channels ?? msg?.mentions?.channels;
        if (channels?.size) {
          return channels.first();
        }
        break;
      }
      case 2:
        if (server) {
          return server.getDefaultChannel();
        }
        break;
      case 7:
        if (server) {
          return server.publicUpdatesChannel;
        }
        break;
      case 8:
        if (server) {
          return server.rulesChannel;
        }
        break;
      case 9:
        if (server) {
          return server.systemChannel;
        }
        break;
      case 100: {
        const searchValue = this.evalMessage(varName, cache);
        const result = Bot.bot.channels.cache.find(
          (channel: djs.Channel) => (channel as djs.GuildChannel).name === searchValue,
        );
        if (result) {
          return result;
        }
        break;
      }
      case 101: {
        const searchValue = this.evalMessage(varName, cache);
        const result = Bot.bot.channels.cache.get(searchValue);
        if (result) {
          return result;
        }
        break;
      }
      default:
        return this.getTargetFromVariableOrParameter(type - 3, varName, cache);
    }
    return null;
  }

  static async getVoiceChannelFromData(typeData, varNameData, cache) {
    return await this.getVoiceChannel(parseInt(typeData, 10), this.evalMessage(varNameData, cache), cache);
  }

  static async getVoiceChannel(type, varName, cache) {
    const { interaction, msg, server } = cache;
    switch (type) {
      case 0: {
        const member = interaction?.member ?? msg?.member;
        if (member) {
          return member.voice?.channel;
        }
        break;
      }
      case 1: {
        const members = interaction?.options?.resolved?.members ?? msg?.mentions?.members;
        if (members?.size) {
          const member = members.first();
          if (member) {
            return member.voice?.channel;
          }
        }
        break;
      }
      case 2:
        if (server) {
          return server.getDefaultVoiceChannel();
        }
        break;
      case 7:
        if (server) {
          return server.afkChannel;
        }
        break;
      case 100: {
        const searchValue = this.evalMessage(varName, cache);
        const result = Bot.bot.channels.cache.find(
          (channel: djs.Channel) => (channel as djs.GuildChannel).name === searchValue,
        );
        if (result) {
          return result;
        }
        break;
      }
      case 101: {
        const searchValue = this.evalMessage(varName, cache);
        const result = Bot.bot.channels.cache.get(searchValue);
        if (result) {
          return result;
        }
        break;
      }
      default:
        return this.getTargetFromVariableOrParameter(type - 3, varName, cache);
    }
    return null;
  }

  static async getAnyChannel(type, varName, cache) {
    switch (type) {
      case 10:
        return await this.getVoiceChannel(0, varName, cache);
      case 11:
        return await this.getVoiceChannel(1, varName, cache);
      case 12:
        return await this.getVoiceChannel(7, varName, cache);
      case 13:
        return await this.getVoiceChannel(2, varName, cache);
      default:
        return await this.getChannel(type, varName, cache);
    }
    return null;
  }

  static async getListFromData(typeData, varNameData, cache) {
    return await this.getList(parseInt(typeData, 10), this.evalMessage(varNameData, cache), cache);
  }

  static async getList(type, varName, cache) {
    const { interaction, msg, server } = cache;
    switch (type) {
      case 0:
        if (server) {
          return [...server.members.cache.values()];
        }
        break;
      case 1:
        if (server) {
          return [...server.channels.cache.values()];
        }
        break;
      case 2:
        if (server) {
          return [...server.roles.cache.values()];
        }
        break;
      case 3:
        if (server) {
          return [...server.emojis.cache.values()];
        }
        break;
      case 4:
        return [...Bot.bot.guilds.cache.values()];
      case 5: {
        const members = interaction?.options?.resolved?.members ?? msg?.mentions?.members;
        if (members?.size) {
          return [...members.first().roles.cache.values()];
        }
        break;
      }
      case 6: {
        const member = interaction?.member ?? msg?.member;
        if (member) {
          return [...member.roles.cache.values()];
        }
        break;
      }
      default:
        return this.getTargetFromVariableOrParameter(type - 7, varName, cache);
    }
  }

  static getVariable(type, varName, cache) {
    return this.getTargetFromVariableOrParameter(type - 1, varName, cache);
  }

  static storeValue(value, type, varName, cache) {
    const server = cache.server;
    switch (type) {
      case 1:
        cache.temp[varName] = value;
        break;
      case 2:
        if (server) {
          this.server[server.id] ??= {};
          this.server[server.id][varName] = value;
        }
        break;
      case 3:
        this.global[varName] = value;
        break;
      default:
        break;
    }
  }

  static executeResults(result, data, cache) {
    const type = parseInt(result ? data.iftrue : data.iffalse, 10);
    switch (type) {
      case 0: {
        this.callNextAction(cache);
        break;
      }
      case 1: {
        this.endActions(cache);
        break;
      }
      case 2: {
        const val = parseInt(this.evalMessage(result ? data.iftrueVal : data.iffalseVal, cache), 10);
        const index = Math.max(val - 1, 0);
        if (cache.actions[index]) {
          cache.index = index - 1;
          this.callNextAction(cache);
        }
        break;
      }
      case 3: {
        const amount = parseInt(this.evalMessage(result ? data.iftrueVal : data.iffalseVal, cache), 10);
        const index2 = cache.index + amount + 1;
        if (cache.actions[index2]) {
          cache.index = index2 - 1;
          this.callNextAction(cache);
        }
        break;
      }
      case 4: {
        const anchorName = this.evalMessage(result ? data.iftrueVal : data.iffalseVal, cache);
        cache.goToAnchor(anchorName);
        break;
      }
      case 99: {
        this.executeSubActionsThenNextAction(result ? data.iftrueActions : data.iffalseActions, cache);
        break;
      }
      default:
        break;
    }
  }

  static executeSubActionsThenNextAction(actions, cache) {
    return this.executeSubActions(actions, cache, () => this.callNextAction(cache));
  }

  static executeSubActions(actions, cache, callback: (() => void) | null = null) {
    if (!actions) {
      callback?.();
      return false;
    }
    const newCache = this.generateSubCache(cache, actions);
    newCache.callback = () => callback?.();
    this.callNextAction(newCache);
    return true;
  }

  static generateSubCache(cache, actions) {
    return ActionsCache.extend(cache, actions);
  }

  static generateButton(button, cache) {
    const style = button.url ? DiscordJS.ButtonStyle.Link : this.convertStringButtonStyleToEnum(button.type);
    const buttonData: djs.APIButtonComponentBase<djs.ButtonStyle> = {
      type: DiscordJS.ComponentType.Button,
      label: this.evalMessage(button.name, cache),
      style,
    };
    if (button.url) {
      (buttonData as djs.APIButtonComponentWithURL).url = this.evalMessage(button.url, cache);
    } else {
      (buttonData as djs.APIButtonComponentWithCustomId).custom_id = this.evalMessage(button.id, cache);
    }
    if (button.emoji) {
      buttonData.emoji = this.evalMessage(button.emoji, cache);
    }
    return buttonData;
  }

  static convertStringButtonStyleToEnum(style) {
    switch (style) {
      case 'PRIMARY':
        return DiscordJS.ButtonStyle.Primary;
      case 'SECONDARY':
        return DiscordJS.ButtonStyle.Secondary;
      case 'SUCCESS':
        return DiscordJS.ButtonStyle.Success;
      case 'DANGER':
        return DiscordJS.ButtonStyle.Danger;
      case 'LINK':
        return DiscordJS.ButtonStyle.Link;
    }
    return DiscordJS.ButtonStyle.Primary;
  }

  static generateSelectMenu(select, cache) {
    const selectData = {
      type: DiscordJS.ComponentType.SelectMenu,
      customId: this.evalMessage(select.id, cache),
      placeholder: this.evalMessage(select.placeholder, cache),
      minValues: parseInt(this.evalMessage(select.min, cache), 10) ?? 1,
      maxValues: parseInt(this.evalMessage(select.max, cache), 10) ?? 1,
      options: select.options.map((option, index) => {
        option.label = this.evalMessage(option.label, cache) || 'No Label';
        option.description = this.evalMessage(option.description, cache) || '';
        option.value = this.evalMessage(option.value, cache) || index.toString();
        return option;
      }),
    };
    return selectData;
  }

  static generateTextInput(textInput, defaultCustomId, cache) {
    const inputTextData = {
      type: DiscordJS.ComponentType.TextInput,
      customId: !!textInput.id ? textInput.id : defaultCustomId,
      label: this.evalMessage(textInput.name, cache),
      placeholder: this.evalMessage(textInput.placeholder, cache),
      minLength: parseInt(this.evalMessage(textInput.minLength, cache), 10) ?? 0,
      maxLength: parseInt(this.evalMessage(textInput.maxLength, cache), 10) ?? 100,
      style: this.convertStringTextInputStyleToEnum(textInput.style),
      required: textInput.required === dbm.StringBoolean.True,
    };
    return inputTextData;
  }

  static convertStringTextInputStyleToEnum(style) {
    switch (style) {
      case 'PARAGRAPH':
        return DiscordJS.TextInputStyle.Paragraph;
      case 'SHORT':
        return DiscordJS.TextInputStyle.Short;
    }
    return DiscordJS.TextInputStyle.Short;
  }

  static addButtonToActionRowArray(array, rowText, buttonData, cache) {
    let row = 0;
    if (!rowText) {
      let found = false;
      for (let i = 0; i < array.length; i++) {
        if (array[i].length < 5) {
          if (array[i].length === 0 || array[i][0]?.type === DiscordJS.ComponentType.Button) {
            found = true;
            row = i;
            break;
          }
        }
      }
      if (!found && array.length !== 0) {
        row = array.length - 1;
        if (array[row].length >= 5) {
          row++;
        }
      }
    } else {
      row = parseInt(rowText, 10) - 1;
    }
    if (row >= 0 && row < 5) {
      while (array.length <= row + 1) {
        array.push([]);
      }
      if (array[row].length >= 5) {
        this.displayError(null, cache, 'Action row #' + row + ' exceeded the maximum of 5 buttons!');
      } else {
        array[row].push(buttonData);
      }
    } else {
      this.displayError(null, cache, 'Invalid action row: "' + rowText + '".');
    }
  }

  static addSelectToActionRowArray(array, rowText, selectData, cache) {
    let row = 0;
    if (!rowText) {
      if (array.length !== 0) {
        row = array.length - 1;
        if (array[row].length >= 5) {
          row++;
        }
      }
    } else {
      row = parseInt(rowText, 10) - 1;
    }
    if (row >= 0 && row < 5) {
      while (array.length <= row + 1) {
        array.push([]);
      }
      if (array[row].length >= 1) {
        this.displayError(
          null,
          cache,
          `Action row #${row} cannot have a select menu when there are any buttons on it!`,
        );
      } else {
        array[row].push(selectData);
      }
    } else {
      this.displayError(null, cache, `Invalid action row: '${rowText}'.`);
    }
  }

  static addTextInputToActionRowArray(array, rowText, textInput, cache) {
    let row = 0;
    if (!rowText) {
      if (array.length !== 0) {
        row = array.length - 1;
        if (array[row].length >= 5) {
          row++;
        }
      }
    } else {
      row = parseInt(rowText, 10) - 1;
    }
    if (row >= 0 && row < 5) {
      while (array.length <= row + 1) {
        array.push([]);
      }
      if (array[row].length >= 1) {
        this.displayError(null, cache, `Action row #${row} cannot have a text input when there are any buttons on it!`);
      } else {
        array[row].push(textInput);
      }
    } else {
      this.displayError(null, cache, `Invalid action row: '${rowText}'.`);
    }
  }

  static checkTemporaryInteractionResponses(interaction) {
    const customId = interaction.customId;
    const messageId = interaction.message?.id;
    if (this._temporaryInteractions?.[messageId]) {
      const interactions = this._temporaryInteractions[messageId];
      for (let i = 0; i < interactions.length; i++) {
        const interData = interactions[i];
        const usersMatch = !interData.userId || interData.userId === interaction.user.id;
        if (interData.customId === customId) {
          if (usersMatch) {
            interData.callback?.(interaction);
          } else {
            const invalidUserText = this.getInvalidUserResponse();
            if (invalidUserText) {
              interaction.reply({ content: invalidUserText, ephemeral: true });
            }
          }
          return true;
        }
      }
    }
    return false;
  }

  static registerTemporaryInteraction(messageId, time, customId, userId, multi, interactionCallback) {
    this._temporaryInteractionIdMax ??= 0;
    this._temporaryInteractions ??= {};
    this._temporaryInteractions[messageId] ??= [];

    const uniqueId = this._temporaryInteractionIdMax++;
    let removed = false;

    const removeInteraction = () => {
      if (!removed) removed = true;
      else return;
      this.removeTemporaryInteraction(messageId, uniqueId);
    };

    const callback = (interaction) => {
      interactionCallback?.(interaction);
      if (!multi) {
        removeInteraction();
      }
    };

    (this._temporaryInteractions[messageId] as any).push({ customId, userId, callback, uniqueId });
    if (time > 0) {
      require('node:timers').setTimeout(removeInteraction, time).unref();
    }
  }

  static removeTemporaryInteraction(messageId, uniqueOrCustomId) {
    const interactions = this._temporaryInteractions?.[messageId] as { uniqueId: string; customId: string }[];
    if (interactions) {
      let i = 0;
      for (; i < interactions.length; i++) {
        if (
          (typeof uniqueOrCustomId === 'string' && interactions[i].customId === uniqueOrCustomId) ||
          interactions[i].uniqueId === uniqueOrCustomId
        ) {
          break;
        }
      }
      if (i < interactions.length) interactions.splice(i, 1);
    }
  }

  static clearTemporaryInteraction(messageId, customId) {
    if (this._temporaryInteractions?.[messageId]) {
      this.removeTemporaryInteraction(messageId, customId);
    }
  }

  static clearAllTemporaryInteractions(messageId) {
    if (this._temporaryInteractions?.[messageId]) {
      delete this._temporaryInteractions[messageId];
    }
  }

  static registerModalSubmitResponses(interactionId, callback) {
    this._temporaryInteractions ??= {};
    this._temporaryInteractions[interactionId] = callback;

    // clear up interaction after a while
    require('node:timers')
      .setTimeout(() => {
        this.clearAllTemporaryInteractions(interactionId);
      }, 60 * 60 * 1000)
      .unref();
  }

  static checkModalSubmitResponses(interaction: djs.ModalSubmitInteraction) {
    const interactionId = interaction.customId;
    if (this._temporaryInteractions?.[interactionId]) {
      (this._temporaryInteractions[interactionId] as Function)(interaction);
      this.clearAllTemporaryInteractions(interactionId);
    }
  }
}

//#endregion

//---------------------------------------------------------------------
//#region Actions Cache
// The `cache` object passed around while processing actions.
//---------------------------------------------------------------------

type ActionsCacheMeta = { isEvent: boolean; name: string };

@DBMExport(Actions)
export class ActionsCache {
  actions: dbm.Action[] & { _customData: any };
  server: djs.Guild;
  index: number;
  temp: object;
  msg: djs.Message | null;
  interaction: djs.CommandInteraction | djs.MessageComponentInteraction | null;
  isSubCache: boolean;
  meta: ActionsCacheMeta;

  callback: Function | undefined;

  constructor(actions, server, options: any = {}) {
    this.actions = actions;
    this.server = server;
    this.index = options.index ?? -1;
    this.temp = options.temp ?? {};
    this.msg = options.msg ?? null;
    this.interaction = options.interaction ?? null;
    this.isSubCache = options.isSubCache ?? false;
    this.meta = options.meta ?? { isEvent: false, name: '' };
  }

  onCompleted() {
    if (!this.isSubCache) {
      this.onMainCacheCompleted();
    }
  }

  onMainCacheCompleted() {
    if (this.interaction) {
      if (!this.interaction.replied) {
        const replyData = {
          ephemeral: true,
          content: Actions.getDefaultResponseText(),
        };
        if (this.interaction.deferred) {
          this.interaction.editReply(replyData).catch((err) => Actions.displayError(null, this, err));
        } else {
          this.interaction.reply(replyData).catch((err) => Actions.displayError(null, this, err));
        }
      }
    }
  }

  getUser() {
    return this.interaction?.user ?? this.msg?.author;
  }

  getMessage() {
    const { msg, interaction } = this;
    if (msg) {
      return msg;
    } else if (interaction && interaction instanceof djs.MessageComponentInteraction) {
      if (interaction.message) {
        return interaction.message;
      } else if ((interaction as any)._targetMessage) {
        return (interaction as any)._targetMessage;
      }
    }
    return null;
  }

  goToAnchor(anchorName) {
    const index = this.actions?._customData?.anchors?.[anchorName];
    if (typeof index === 'number' && this.actions[index]) {
      this.index = index - 1;
      Actions.callNextAction(this);
    }
  }

  toString() {
    let result = `${this.meta.isEvent ? 'Event' : 'Command'} "${this.meta.name}"`;
    if (this.interaction?.isButton()) {
      const b = (this.interaction as any)._button;
      result += ', Button' + (b ? ` "${b.label}"` : '');
    } else if (this.interaction?.isStringSelectMenu()) {
      const s = (this.interaction as any)._select;
      result += ', Select Menu' + (s ? ` "${s.placeholder}"` : '');
    }
    return result;
  }

  static extend(other, actions) {
    return new ActionsCache(actions, other.server, {
      isSubCache: true,
      temp: other.temp,
      msg: other.msg,
      interaction: other.interaction,
      meta: other.meta,
    });
  }
}

//#endregion

//---------------------------------------------------------------------
//#region Events
// Handles the various events that occur.
//---------------------------------------------------------------------

let $evts: Record<string, dbm.Event[]> = {};

@DBMExport()
export class Events {
  static data = Events.generateData();

  static generateData(): ([string, number, number, number, boolean?, Function?] | [])[] {
    return [
      [],
      [],
      [],
      [],
      ['guildCreate', 0, 0, 1],
      ['guildDelete', 0, 0, 1],
      ['guildMemberAdd', 1, 0, 2],
      ['guildMemberRemove', 1, 0, 2],
      ['channelCreate', 1, 0, 2, true, (arg1) => arg1.type === 'GUILD_TEXT'],
      ['channelDelete', 1, 0, 2, true, (arg1) => arg1.type === 'GUILD_TEXT'],
      ['roleCreate', 1, 0, 2],
      ['roleDelete', 1, 0, 2],
      ['guildBanAdd', 200, 0, 2],
      ['guildBanRemove', 200, 0, 2],
      ['channelCreate', 1, 0, 2, true, (arg1) => arg1.type === 'GUILD_VOICE'],
      ['channelDelete', 1, 0, 2, true, (arg1) => arg1.type === 'GUILD_VOICE'],
      ['emojiCreate', 1, 0, 2],
      ['emojiDelete', 1, 0, 2],
      ['messageDelete', 1, 0, 2, true],
      ['guildUpdate', 1, 3, 3],
      ['guildMemberUpdate', 1, 3, 4],
      ['presenceUpdate', 1, 3, 4],
      ['voiceStateUpdate', 1, 3, 4],
      ['channelUpdate', 1, 3, 4, true],
      ['channelPinsUpdate', 1, 0, 2, true],
      ['roleUpdate', 1, 3, 4],
      ['messageUpdate', 1, 3, 4, true, (arg1, arg2) => !!arg2.content],
      ['emojiUpdate', 1, 3, 4],
      [],
      [],
      ['messageReactionRemoveAll', 1, 0, 2, true],
      ['guildMemberAvailable', 1, 0, 2],
      ['guildMembersChunk', 1, 0, 3],
      ['guildMemberSpeaking', 1, 3, 2],
      [],
      [],
      ['guildUnavailable', 1, 0, 1],
      [],
      [],
      ['channelCreate', 1, 0, 2, true, (arg1) => arg1.type !== 'GUILD_TEXT' && arg1.type !== 'GUILD_VOICE'],
      ['channelDelete', 1, 0, 2, true, (arg1) => arg1.type !== 'GUILD_TEXT' && arg1.type !== 'GUILD_VOICE'],
      ['stickerCreate', 1, 0, 2, true],
      ['stickerDelete', 1, 0, 2, true],
      ['threadCreate', 1, 0, 2, true],
      ['threadDelete', 1, 0, 2, true],
      ['stickerUpdate', 1, 3, 4, true],
      ['threadUpdate', 1, 3, 4, true],
      ['threadMemberUpdate', 1, 3, 100, true],
      [],
      ['inviteCreate', 1, 0, 2],
      ['inviteDelete', 1, 0, 2],
    ];
  }

  static registerEvents(bot: djs.Client) {
    $evts = Bot.$evts;
    for (let i = 0; i < this.data.length; i++) {
      const d: any[] = this.data[i];
      if (d.length > 0 && $evts[String(i)]) {
        bot.on(d[0], this.callEvents.bind(this, String(i), d[1], d[2], d[3], !!d[4], d[5]));
      }
    }
    if ($evts['28']) bot.on('messageReactionAdd', this.onReaction.bind(this, '28'));
    if ($evts['29']) bot.on('messageReactionRemove', this.onReaction.bind(this, '29'));
    if ($evts['34']) bot.on('typingStart', this.onTyping.bind(this, '34'));
  }

  static callEvents(
    id: string,
    temp1: number,
    temp2: number,
    objectExtractorType: number,
    mustServe: boolean,
    condition: Function | null,
    arg1: any,
    arg2: any | null = null,
  ) {
    if (mustServe && ((temp1 > 0 && !arg1.guild) || (temp2 > 0 && !arg2.guild))) return;
    if (condition && !condition(arg1, arg2)) return;
    const events = $evts[id];
    if (!events) return;
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const temp = {};
      if (event.temp) temp[event.temp] = this.getObject(temp1, arg1, arg2);
      if (event.temp2) temp[event.temp2] = this.getObject(temp2, arg1, arg2);
      Actions.invokeEvent(event, this.getObject(objectExtractorType, arg1, arg2), temp);
    }
  }

  static getObject(id, arg1, arg2) {
    switch (id) {
      case 1:
        return arg1;
      case 2:
        return arg1.guild;
      case 3:
        return arg2;
      case 4:
        return arg2.guild;
      case 100:
        return arg1.guildMember.guild;
      case 200:
        return arg1.user;
    }
  }

  static onInitialization(bot) {
    const events = $evts['1'];
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      for (const server of bot.guilds.cache.values()) {
        Actions.invokeEvent(event, server, {});
      }
    }
  }

  static onInitializationOnce(bot) {
    const events = $evts['48'];
    const server = bot.guilds.cache.first();
    for (let i = 0; i < events.length; i++) {
      Actions.invokeEvent(events[i], server, {});
    }
  }

  static setupIntervals(bot) {
    const events = $evts['3'];
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const time = event.temp ? parseFloat(event.temp) : 60;
      setInterval(() => {
        for (const server of bot.guilds.cache.values()) {
          Actions.invokeEvent(event, server, {});
        }
      }, time * 1e3).unref();
    }
  }

  static onReaction(id, reaction, user) {
    const events = $evts[id];
    if (!events) return;
    const server = reaction.message?.guild;
    const member = server?.members.resolve(user);
    if (!member) return;
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const temp = {};
      if (event.temp) temp[event.temp] = reaction;
      if (event.temp2) temp[event.temp2] = member;
      Actions.invokeEvent(event, server, temp);
    }
  }

  static onTyping(id: string, typing: djs.Typing) {
    const events = $evts[id];
    if (!events) return;
    const server = (typing.channel as any).guild;
    const member = server?.members.resolve(typing.user);
    if (!member) return;
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const temp = {};
      if (event.temp) temp[event.temp] = typing.channel;
      if (event.temp2) temp[event.temp2] = member;
      Actions.invokeEvent(event, server, temp);
    }
  }

  static onError(text, text2, cache) {
    const events = $evts['37'];
    if (!events) return;
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const temp = {};
      if (event.temp) temp[event.temp] = text;
      if (event.temp2) temp[event.temp2] = text2;
      Actions.invokeEvent(event, cache.server, temp);
    }
  }
}

//#endregion

//---------------------------------------------------------------------
//#region Images
// Contains functions for image management.
//---------------------------------------------------------------------

@DBMExport()
export class Images {
  static JIMP: typeof import('jimp') | null = null;

  static {
    this.JIMP = null;
    try {
      this.JIMP = require('jimp');
    } catch {}
  }

  static getImage(url: string): Promise<import('jimp')> {
    if (!url.startsWith('http')) url = Actions.getLocalFile(url);
    return this.JIMP!.read(url);
  }

  static getFont(url: string): Promise<import('@jimp/plugin-print').Font> {
    return this.JIMP!.loadFont(Actions.getLocalFile(url));
  }

  static isImage(obj: any): boolean {
    if (!Images.JIMP) {
      return false;
    }
    return obj instanceof Images.JIMP;
  }

  static createBuffer(image: import('jimp')): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      image.getBuffer(this.JIMP!.MIME_PNG, function (err, buffer) {
        if (err) {
          reject(err);
        } else {
          resolve(buffer);
        }
      });
    });
  }

  static drawImageOnImage(img1: import('jimp'), img2: import('jimp'), x: number, y: number) {
    for (let i = 0; i < img2.bitmap.width; i++) {
      for (let j = 0; j < img2.bitmap.height; j++) {
        const pos = i * (img2.bitmap.width * 4) + j * 4;
        const pos2 = (i + y) * (img1.bitmap.width * 4) + (j + x) * 4;
        const target = img1.bitmap.data;
        const source = img2.bitmap.data;
        for (let k = 0; k < 4; k++) {
          target[pos2 + k] = source[pos + k];
        }
      }
    }
  }
}

//#endregion

//---------------------------------------------------------------------
//#region Files
// Contains functions for file management.
//---------------------------------------------------------------------

@DBMExport()
export class Files {
  // @ts-ignore
  static data: dbm.EditorData & dbm.SaveData = {};

  static writers = {};
  static crypto = require('node:crypto');
  static dataFiles = [
    'commands.json',
    'events.json',
    'settings.json',
    'players.json',
    'servers.json',
    'messages.json',
    'serverVars.json',
    'globalVars.json',
  ];

  static #password: string;

  static {
    Files.initEncryption();
  }

  static startBot() {
    const path = require('node:path');
    Actions.actionsLocation = path.join(__dirname, 'actions');
    Actions.eventsLocation = path.join(__dirname, 'events');
    Actions.extensionsLocation = path.join(__dirname, 'extensions');
    if (this.verifyDirectory(Actions.actionsLocation)) {
      Actions.initMods();
      this.readData(Bot.init.bind(Bot));
    } else {
      PrintError(MsgType.MISSING_ACTIONS, Actions.actionsLocation);
    }
  }

  static verifyDirectory(dir: string | null | undefined) {
    return typeof dir === 'string' && require('node:fs').existsSync(dir);
  }

  static readData(callback: Function) {
    const fs = require('node:fs');
    const path = require('node:path');
    let max = this.dataFiles.length;
    let cur = 0;
    for (let i = 0; i < max; i++) {
      const filePath = path.join(process.cwd(), 'data', this.dataFiles[i]);
      const filename = this.dataFiles[i].slice(0, -5);

      const setData = (data) => {
        this.data[filename] = data;
        if (++cur === max) {
          callback();
        }
      };

      if (!fs.existsSync(filePath)) {
        setData({});
      } else {
        fs.readFile(filePath, (_error, content) => {
          let data;
          try {
            if (typeof content !== 'string' && content.toString) content = content.toString();
            data = JSON.parse(this.decrypt(content));
          } catch {
            PrintError(MsgType.DATA_PARSING_ERROR, this.dataFiles[i]);
            return;
          }
          setData(data);
        });
      }
    }
  }

  static saveData(file: string, callback: Function | null = null) {
    const path = require('node:path');
    const data = this.data[file];
    if (!this.writers[file]) {
      const fstorm = require('fstorm');
      this.writers[file] = fstorm(path.join(process.cwd(), 'data', file + '.json'));
    }
    this.writers[file].write(this.encrypt(JSON.stringify(data)), () => callback?.());
  }

  static initEncryption() {
    try {
      this.#password = require('discord-bot-maker');
    } catch {
      this.#password = '';
    }
  }

  static encrypt(text: string): string {
    if (this.#password.length === 0) return text;
    const cipher = this.crypto.createCipher('aes-128-ofb', this.#password);
    return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
  }

  static decrypt(text: string): string {
    if (this.#password.length === 0) return text;
    const decipher = this.crypto.createDecipher('aes-128-ofb', this.#password);
    return decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
  }

  static convertItem(item: any[] | { convertToString: () => string }): any {
    if (Array.isArray(item)) {
      const result: any[] = [];
      const length = item.length;
      for (let i = 0; i < length; i++) {
        result[i] = this.convertItem(item[i]);
      }
      return result;
    } else if (typeof item !== 'object') {
      let result = '';
      try {
        result = JSON.stringify(item);
      } catch {}
      if (result !== '{}') {
        return item;
      }
    } else if (item.convertToString) {
      return item.convertToString();
    }
    return null;
  }

  static saveServerVariable(serverId, varName, item) {
    this.data.serverVars[serverId] ??= {};
    const strItem = this.convertItem(item);
    if (strItem !== null) {
      this.data.serverVars[serverId][varName] = strItem;
    }
    this.saveData('serverVars');
  }

  static restoreServerVariables() {
    const keys = Object.keys(this.data.serverVars);
    for (let i = 0; i < keys.length; i++) {
      const varNames = Object.keys(this.data.serverVars[keys[i]]);
      for (let j = 0; j < varNames.length; j++) {
        this.restoreVariable(this.data.serverVars[keys[i]][varNames[j]], 2, varNames[j], keys[i]);
      }
    }
  }

  static saveGlobalVariable(varName, item) {
    const strItem = this.convertItem(item);
    if (strItem !== null) {
      this.data.globalVars[varName] = strItem;
    }
    this.saveData('globalVars');
  }

  static restoreGlobalVariables() {
    const keys = Object.keys(this.data.globalVars);
    for (let i = 0; i < keys.length; i++) {
      this.restoreVariable(this.data.globalVars[keys[i]], 3, keys[i]);
    }
  }

  static restoreVariable(value, type, varName: string, serverId: string | null = null) {
    const cache: any = {};
    if (serverId) {
      cache.server = { id: serverId };
    }
    if (typeof value === 'string' || Array.isArray(value)) {
      this.restoreValue(value, Bot.bot)
        .then((finalValue) => {
          if (finalValue) {
            Actions.storeValue(finalValue, type, varName, cache);
          }
        })
        .catch(noop);
    } else {
      Actions.storeValue(value, type, varName, cache);
    }
  }

  static restoreValue(value, bot) {
    return new Promise((resolve, reject) => {
      if (typeof value === 'string') {
        if (value.startsWith('mem-')) {
          return resolve(this.restoreMember(value, bot));
        } else if (value.startsWith('msg-')) {
          return this.restoreMessage(value, bot).then(resolve).catch(reject);
        } else if (value.startsWith('tc-')) {
          return resolve(this.restoreTextChannel(value, bot));
        } else if (value.startsWith('vc-')) {
          return resolve(this.restoreVoiceChannel(value, bot));
        } else if (value.startsWith('r-')) {
          return resolve(this.restoreRole(value, bot));
        } else if (value.startsWith('s-')) {
          return resolve(this.restoreServer(value, bot));
        } else if (value.startsWith('e-')) {
          return resolve(this.restoreEmoji(value, bot));
        } else if (value.startsWith('usr-')) {
          return resolve(this.restoreUser(value, bot));
        }
        resolve(value);
      } else if (Array.isArray(value)) {
        const result: any[] = [];
        const length = value.length;
        let curr = 0;
        for (let i = 0; i < length; i++) {
          this.restoreValue(value[i], bot)
            .then((item) => {
              result[i] = item;
              if (++curr >= length) {
                resolve(result);
              }
            })
            .catch(() => {
              if (++curr >= length) {
                resolve(result);
              }
            });
        }
      } else {
        resolve(value);
      }
    });
  }

  static restoreMember(value, bot) {
    const split = value.split('_');
    const memId = split[0].slice(4);
    const serverId = split[1].slice(2);
    const server = bot.guilds.get(serverId);
    if (server) {
      return server.members.resolve(memId);
    }
    return null;
  }

  static restoreMessage(value, bot) {
    const split = value.split('_');
    const msgId = split[0].slice(4);
    const channelId = split[1].slice(2);
    const channel = bot.channels.resolve(channelId);
    if (channel) {
      return channel.messages.fetch(msgId);
    }
    return null;
  }

  static restoreTextChannel(value, bot) {
    const channelId = value.slice(3);
    return bot.channels.resolve(channelId);
  }

  static restoreVoiceChannel(value, bot) {
    const channelId = value.slice(3);
    return bot.channels.resolve(channelId);
  }

  static restoreRole(value, bot) {
    const split = value.split('_');
    const roleId = split[0].slice(2);
    const serverId = split[1].slice(2);
    const server = bot.guilds.resolve(serverId);
    if (server?.roles) {
      return server.roles.resolve(roleId);
    }
    return null;
  }

  static restoreServer(value, bot) {
    const serverId = value.slice(2);
    return bot.guilds.resolve(serverId);
  }

  static restoreEmoji(value, bot) {
    const emojiId = value.slice(2);
    return bot.emojis.resolve(emojiId);
  }

  static restoreUser(value, bot) {
    const userId = value.slice(4);
    return bot.users.resolve(userId);
  }
}

//#endregion

//---------------------------------------------------------------------
//#region Audio
// Contains functions for voice channel stuff.
//---------------------------------------------------------------------

let packageJson: Record<string, string> | number | null = null;
function checkIfHasDependency(key: string): boolean {
  if (!packageJson) {
    const { join } = require('node:path');
    const { readFileSync } = require('node:fs');
    try {
      const packageJsonText: string = readFileSync(join(__dirname, 'package.json'));
      packageJson = JSON.parse(packageJsonText).dependencies;
    } catch (e: any) {
      packageJson = 1;
    }
  }
  if (packageJson !== 1) {
    return !!packageJson![key];
  }
  return false;
}

// Load `Audio` class if the correct dependencies exist.
if (checkIfHasDependency('@discordjs/voice') && checkIfHasDependency('discord-player')) {
  const botAudioTs = require('node:path').join(__dirname, 'bot_audio.ts');
  require(botAudioTs);
}

//#endregion

//---------------------------------------------------------------------
//#region Custom structures
//---------------------------------------------------------------------

//---------------------------------------------------------------------
// GuildMember
//---------------------------------------------------------------------

Reflect.defineProperty(DiscordJS.GuildMember.prototype, 'unban', {
  value(server, reason) {
    return server.bans.remove(this.id, reason);
  },
});

Reflect.defineProperty(DiscordJS.GuildMember.prototype, 'data', {
  value(name, defaultValue) {
    return DiscordJS.User.prototype.data.apply(this, arguments);
  },
});

Reflect.defineProperty(DiscordJS.GuildMember.prototype, 'setData', {
  value(name, value) {
    return DiscordJS.User.prototype.setData.apply(this, arguments);
  },
});

Reflect.defineProperty(DiscordJS.GuildMember.prototype, 'addData', {
  value(name, value) {
    return DiscordJS.User.prototype.addData.apply(this, arguments);
  },
});

Reflect.defineProperty(DiscordJS.GuildMember.prototype, 'subData', {
  value(name, value) {
    return DiscordJS.User.prototype.subData.apply(this, arguments);
  },
});

Reflect.defineProperty(DiscordJS.GuildMember.prototype, 'clearData', {
  value(name) {
    return DiscordJS.User.prototype.clearData.apply(this, arguments);
  },
});

Reflect.defineProperty(DiscordJS.GuildMember.prototype, 'convertToString', {
  value() {
    return `mem-${this.id}_s-${this.guild.id}`;
  },
});

//---------------------------------------------------------------------
// User
//---------------------------------------------------------------------

Reflect.defineProperty(DiscordJS.User.prototype, 'data', {
  value(name, defaultValue) {
    const id = this.id;
    const data = Files.data.players;
    if (data[id] === undefined) {
      if (defaultValue === undefined) {
        return null;
      } else {
        data[id] = {};
      }
    }
    if (data[id][name] === undefined && defaultValue !== undefined) {
      data[id][name] = defaultValue;
    }
    return data[id][name];
  },
});

Reflect.defineProperty(DiscordJS.User.prototype, 'setData', {
  value(name, value) {
    const id = this.id;
    const data = Files.data.players;
    if (data[id] === undefined) {
      data[id] = {};
    }
    data[id][name] = value;
    Files.saveData('players');
  },
});

Reflect.defineProperty(DiscordJS.User.prototype, 'addData', {
  value(name, value) {
    const id = this.id;
    const data = Files.data.players;
    if (data[id] === undefined) {
      data[id] = {};
    }
    if (data[id][name] === undefined) {
      this.setData(name, value);
    } else {
      this.setData(name, this.data(name) + value);
    }
  },
});

Reflect.defineProperty(DiscordJS.User.prototype, 'subData', {
  value(name, value) {
    const id = this.id;
    const data = Files.data.players;
    if (data[id] === undefined) {
      data[id] = {};
    }
    if (data[id][name] === undefined) {
      this.setData(name, value);
    } else {
      this.setData(name, this.data(name) - value);
    }
  },
});

Reflect.defineProperty(DiscordJS.User.prototype, 'clearData', {
  value(name) {
    const id = this.id;
    const data = Files.data.players;
    if (data[id] !== undefined) {
      if (typeof name === 'string') {
        if (data[id][name] !== undefined) {
          delete data[id][name];
          Files.saveData('players');
        }
      } else {
        delete data[id];
        Files.saveData('players');
      }
    }
  },
});

Reflect.defineProperty(DiscordJS.User.prototype, 'convertToString', {
  value() {
    return `usr-${this.id}`;
  },
});

//---------------------------------------------------------------------
// Guild
//---------------------------------------------------------------------

Reflect.defineProperty(DiscordJS.Guild.prototype, 'getDefaultChannel', {
  value() {
    let channel = this.channels.resolve(this.id);
    if (!channel) {
      [...this.channels.cache.values()].forEach((c) => {
        if (
          c.permissionsFor(DBM.Bot.bot.user)?.has(DiscordJS.PermissionsBitField.Flags.SendMessages) &&
          (c.type === DiscordJS.ChannelType.GuildText || c.type === DiscordJS.ChannelType.GuildAnnouncement)
        ) {
          if (!channel || channel.position > c.position) {
            channel = c;
          }
        }
      });
    }
    return channel;
  },
});

Reflect.defineProperty(DiscordJS.Guild.prototype, 'getDefaultVoiceChannel', {
  value() {
    let channel = this.channels.resolve(this.id);
    if (!channel) {
      [...this.channels.cache.values()].forEach((c) => {
        if (
          c.permissionsFor(DBM.Bot.bot.user)?.has(DiscordJS.PermissionsBitField.Flags.SendMessages) &&
          c.type === DiscordJS.ChannelType.GuildVoice
        ) {
          if (!channel || channel.position > c.position) {
            channel = c;
          }
        }
      });
    }
    return channel;
  },
});

Reflect.defineProperty(DiscordJS.Guild.prototype, 'data', {
  value(name, defaultValue) {
    const id = this.id;
    const data = Files.data.servers;
    if (data[id] === undefined) {
      if (defaultValue === undefined) {
        return null;
      } else {
        data[id] = {};
      }
    }
    if (data[id][name] === undefined && defaultValue !== undefined) {
      data[id][name] = defaultValue;
    }
    return data[id][name];
  },
});

Reflect.defineProperty(DiscordJS.Guild.prototype, 'setData', {
  value(name, value) {
    const id = this.id;
    const data = Files.data.servers;
    if (data[id] === undefined) {
      data[id] = {};
    }
    data[id][name] = value;
    Files.saveData('servers');
  },
});

Reflect.defineProperty(DiscordJS.Guild.prototype, 'addData', {
  value(name, value) {
    const id = this.id;
    const data = Files.data.servers;
    if (data[id] === undefined) {
      data[id] = {};
    }
    if (data[id][name] === undefined) {
      this.setData(name, value);
    } else {
      this.setData(name, this.data(name) + value);
    }
  },
});

Reflect.defineProperty(DiscordJS.Guild.prototype, 'subData', {
  value(name, value) {
    const id = this.id;
    const data = Files.data.servers;
    if (data[id] === undefined) {
      data[id] = {};
    }
    if (data[id][name] === undefined) {
      this.setData(name, value);
    } else {
      this.setData(name, this.data(name) - value);
    }
  },
});

Reflect.defineProperty(DiscordJS.Guild.prototype, 'clearData', {
  value(name) {
    const id = this.id;
    const data = Files.data.servers;
    if (data[id] !== undefined) {
      if (typeof name === 'string') {
        if (data[id][name] !== undefined) {
          delete data[id][name];
          Files.saveData('servers');
        }
      } else {
        delete data[id];
        Files.saveData('servers');
      }
    }
  },
});

Reflect.defineProperty(DiscordJS.Guild.prototype, 'convertToString', {
  value() {
    return `s-${this.id}`;
  },
});

//---------------------------------------------------------------------
// Message
//---------------------------------------------------------------------

Reflect.defineProperty(DiscordJS.Message.prototype, 'data', {
  value(name, defaultValue) {
    const id = this.id;
    const data = Files.data.messages;
    if (data[id] === undefined) {
      if (defaultValue === undefined) {
        return null;
      } else {
        data[id] = {};
      }
    }
    if (data[id][name] === undefined && defaultValue !== undefined) {
      data[id][name] = defaultValue;
    }
    return data[id][name];
  },
});

Reflect.defineProperty(DiscordJS.Message.prototype, 'setData', {
  value(name, value) {
    const id = this.id;
    const data = Files.data.messages;
    if (data[id] === undefined) {
      data[id] = {};
    }
    data[id][name] = value;
    Files.saveData('messages');
  },
});

Reflect.defineProperty(DiscordJS.Message.prototype, 'addData', {
  value(name, value) {
    const id = this.id;
    const data = Files.data.messages;
    if (data[id] === undefined) {
      data[id] = {};
    }
    if (data[id][name] === undefined) {
      this.setData(name, value);
    } else {
      this.setData(name, this.data(name) + value);
    }
  },
});

Reflect.defineProperty(DiscordJS.Message.prototype, 'subData', {
  value(name, value) {
    const id = this.id;
    const data = Files.data.messages;
    if (data[id] === undefined) {
      data[id] = {};
    }
    if (data[id][name] === undefined) {
      this.setData(name, value);
    } else {
      this.setData(name, this.data(name) - value);
    }
  },
});

Reflect.defineProperty(DiscordJS.Message.prototype, 'clearData', {
  value(name) {
    const id = this.id;
    const data = Files.data.messages;
    if (data[id] !== undefined) {
      if (typeof name === 'string') {
        if (data[id][name] !== undefined) {
          delete data[id][name];
          Files.saveData('messages');
        }
      } else {
        delete data[id];
        Files.saveData('messages');
      }
    }
  },
});

Reflect.defineProperty(DiscordJS.Message.prototype, 'convertToString', {
  value() {
    return `msg-${this.id}_c-${this.channel.id}`;
  },
});

//---------------------------------------------------------------------
// TextChannel
//---------------------------------------------------------------------

Reflect.defineProperty(DiscordJS.TextChannel.prototype, 'startThread', {
  value(options) {
    return this.threads.create(options);
  },
});

Reflect.defineProperty(DiscordJS.TextChannel.prototype, 'convertToString', {
  value() {
    return `tc-${this.id}`;
  },
});

//---------------------------------------------------------------------
// VoiceChannel
//---------------------------------------------------------------------

Reflect.defineProperty(DiscordJS.VoiceChannel.prototype, 'convertToString', {
  value() {
    return `vc-${this.id}`;
  },
});

//---------------------------------------------------------------------
// Role
//---------------------------------------------------------------------

Reflect.defineProperty(DiscordJS.Role.prototype, 'convertToString', {
  value() {
    return `r-${this.id}_s-${this.guild.id}`;
  },
});

//---------------------------------------------------------------------
// Emoji
//---------------------------------------------------------------------

Reflect.defineProperty(DiscordJS.GuildEmoji.prototype, 'convertToString', {
  value() {
    return `e-${this.id}`;
  },
});

//#endregion

//---------------------------------------------------------------------
// Start Bot
//---------------------------------------------------------------------

Files.startBot();

//---------------------------------------------------------------------
// Export DBM namespace
//---------------------------------------------------------------------

export default DBM;
