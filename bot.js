/******************************************************
 * Discord Bot Maker Bot
 * Version 2.1.7
 * Robert Borghese
 * Modified for discord.js@14.14.1 by DBM Mods Community
 * https://github.com/dbm-network
 * Backwards compatible with discord.js@13.14.0+
 ******************************************************/

const DBM = {};
DBM.version = '2.1.7';

const DiscordJS = (DBM.DiscordJS = require('discord.js'));
const EPHEMERAL_FLAG =
  typeof DiscordJS.MessageFlags !== 'undefined' && DiscordJS.MessageFlags.Ephemeral !== undefined
    ? DiscordJS.MessageFlags.Ephemeral
    : 64;

// Support both v13 and v14 - Updated for 13.14.0 and 14.24.2
const majorVersion = parseInt(DiscordJS.version.split('.')[0], 10);
const minorVersion = parseInt(DiscordJS.version.split('.')[1] || '0', 10);
const patchVersion = parseInt(DiscordJS.version.split('.')[2] || '0', 10);
const isV13 = majorVersion === 13;
const isV14 = majorVersion === 14;

// Version compatibility helpers
DBM.getDiscordJSVersion = function () {
  return DiscordJS.version;
};
DBM.getDiscordJSMajorVersion = function () {
  return majorVersion;
};
DBM.isDiscordJSv13 = function () {
  return isV13;
};
DBM.isDiscordJSv14 = function () {
  return isV14;
};
DBM.isDiscordJSv13_14_0 = function () {
  return isV13 && minorVersion >= 14;
};
DBM.isDiscordJSv14_24_2 = function () {
  return isV14 && (minorVersion > 24 || (minorVersion === 24 && patchVersion >= 2));
};

const requiredDjsVersion = isV14 ? '14.24.2' : '13.14.0';

// v14 Compatibility: MessageEmbed was replaced with EmbedBuilder
if (isV14 && !DiscordJS.MessageEmbed) {
  DiscordJS.MessageEmbed = DiscordJS.EmbedBuilder;
  // Also add compatibility for addField (v14 uses addFields with array)
  if (DiscordJS.EmbedBuilder && !DiscordJS.EmbedBuilder.prototype.addField) {
    DiscordJS.EmbedBuilder.prototype.addField = function (name, value, inline) {
      // Validate and truncate field values to prevent errors
      const maxLength = 1024;
      const safeName = String(name || '\u200B').substring(0, 256);
      const safeValue = String(value || '\u200B').substring(0, maxLength);
      return this.addFields({ name: safeName, value: safeValue, inline: inline === true || inline === 'true' });
    };
  }
}

// v14 Compatibility: MessageAttachment was replaced with Attachment
if (isV14 && !DiscordJS.MessageAttachment) {
  DiscordJS.MessageAttachment = DiscordJS.Attachment;
}

// Version checking - support 13.14.0+ and 14.24.2+
const versionCheck = isV14
  ? '14.24.2'.localeCompare(DiscordJS.version, { numeric: true, sensitivity: 'base' }) > 0
  : '13.14.0'.localeCompare(DiscordJS.version, { numeric: true, sensitivity: 'base' }) > 0;

if (versionCheck) {
  console.log(
    `This version of Discord Bot Maker requires discord.js ${requiredDjsVersion}+.
It is currently ${DiscordJS.version}.
Please use "Project > Module Manager" and "Project > Reinstall Node Modules" to update to discord.js ${requiredDjsVersion}.\n\n`,
  );
  throw new Error(`Need discord.js ${requiredDjsVersion} to run!!!`);
}

const noop = () => void 0;

//---------------------------------------------------------------------
//#region Output Messages
// Gathered all the output messages in single place for easier translation.
//---------------------------------------------------------------------

const MsgType = {
  MISSING_ACTION: 0,
  DATA_PARSING_ERROR: 1,
  MISSING_ACTIONS: 2,

  DUPLICATE_SLASH_COMMAND: 3,
  INVALID_SLASH_NAME: 4,
  DUPLICATE_USER_COMMAND: 5,
  DUPLICATE_MESSAGE_COMMAND: 6,
  DUPLICATE_SLASH_PARAMETER: 7,
  INVALID_SLASH_PARAMETER_NAME: 8,
  INVALID_SLASH_COMMAND_SERVER_ID: 9,
  DUPLICATE_BUTTON_ID: 10,
  DUPLICATE_SELECT_ID: 11,
  TOO_MANY_SPACES_SLASH_NAME: 12,
  SUB_COMMAND_ALREADY_EXISTS: 13,
  SUB_COMMAND_GROUP_ALREADY_EXISTS: 14,

  MISSING_APPLICATION_COMMAND_ACCESS: 100,
  MISSING_MUSIC_MODULES: 101,

  MUTABLE_VOLUME_DISABLED: 200,
  MUTABLE_VOLUME_NOT_IN_CHANNEL: 201,
  ERROR_GETTING_YT_INFO: 202,
  ERROR_CREATING_AUDIO: 203,

  MISSING_MEMBER_INTENT_FIND_USER_ID: 300,
  CANNOT_FIND_USER_BY_ID: 301,

  SERVER_MESSAGE_INTENT_REQUIRED: 400,
  CHANNEL_PARTIAL_REQUIRED: 401,
};

function PrintError(type) {
  const { format } = require('node:util');
  const { error, warn } = console;

  switch (type) {
    case MsgType.MISSING_ACTION: {
      error(format('%s does not exist!', arguments[1]));
      break;
    }
    case MsgType.DATA_PARSING_ERROR: {
      error(format('There was issue parsing %s!', arguments[1]));
      break;
    }
    case MsgType.MISSING_ACTIONS: {
      error(
        format(
          '[Missing Actions]\nPlease copy the "Actions" folder from the Discord Bot Maker directory to this bot\'s directory: \n%s',
          arguments[1],
        ),
      );
      break;
    }

    case MsgType.DUPLICATE_SLASH_COMMAND: {
      warn(
        format(
          '[Duplicate Slash Command]\nSlash command with name "%s" already exists!\nThis duplicate will be ignored.\n',
          arguments[1],
        ),
      );
      break;
    }
    case MsgType.TOO_MANY_SPACES_SLASH_NAME: {
      warn(
        format(
          '[Too Many Spaces in Slash Name]\nSlash command with name "%s" has too many spaces!\nSlash command names may only contain a maximum of three different words.\n',
          arguments[1],
        ),
      );
      break;
    }
    case MsgType.SUB_COMMAND_ALREADY_EXISTS: {
      warn(
        format(
          '[Sub-Command Already Exists]\nSlash command with name "%s" cannot exist.\nIt requires the creation of a "sub-command group" called "%s",\nbut there\'s already a command with that name.',
          arguments[1],
          arguments[2],
        ),
      );
      break;
    }
    case MsgType.SUB_COMMAND_GROUP_ALREADY_EXISTS: {
      warn(
        format(
          '[Sub-Command Group Already Exists]\nSlash command with name "%s" cannot exist.\nThere is already a "sub-command group" with that name.\nThe "sub-command group" exists because of a command named something like: "%s _____"',
          arguments[1],
          arguments[1],
        ),
      );
      break;
    }
    case MsgType.INVALID_SLASH_NAME: {
      error(
        format(
          '[Invalid Slash Command Name]\nSlash command has invalid name: "%s".\nSlash command names cannot have spaces and must only contain letters, numbers, underscores, and dashes!\nThis command will be ignored.',
          arguments[1],
        ),
      );
      break;
    }
    case MsgType.DUPLICATE_USER_COMMAND: {
      warn(
        format(
          '[Duplicate User Command]\nUser command with name "%s" already exists!\nThis duplicate will be ignored.\n',
          arguments[1],
        ),
      );
      break;
    }
    case MsgType.DUPLICATE_MESSAGE_COMMAND: {
      warn(
        format(
          '[Duplicate Message Command]\nMessage command with name "%s" already exists!\nThis duplicate will be ignored.\n',
          arguments[1],
        ),
      );
      break;
    }
    case MsgType.DUPLICATE_SLASH_PARAMETER: {
      warn(
        format(
          '[Duplicate Slash Command]\nSlash command "%s" parameter #%d ("%s") has a name that\'s already being used!\nThis duplicate will be ignored.\n',
          arguments[1],
          arguments[2],
          arguments[3],
        ),
      );
      break;
    }
    case MsgType.INVALID_SLASH_PARAMETER_NAME: {
      error(
        format(
          '[Invalid Slash Parameter Name]\nSlash command "%s" parameter #%d has invalid name: "%s".\nSlash command parameter names cannot have spaces and must only contain letters, numbers, underscores, and dashes!\nThis parameter will be ignored.\n',
          arguments[1],
          arguments[2],
          arguments[3],
        ),
      );
      break;
    }
    case MsgType.INVALID_SLASH_COMMAND_SERVER_ID: {
      error(
        format('Invalid Server ID "%s" listed in "Slash Command Options -> Server IDs for Slash Commands"!\n'),
        arguments[1],
      );
      break;
    }
    case MsgType.DUPLICATE_BUTTON_ID: {
      warn(
        format(
          'Button interaction with unique id "%s" already exists!\nThis duplicate will be ignored.\n',
          arguments[1],
        ),
      );
      break;
    }
    case MsgType.DUPLICATE_SELECT_ID: {
      warn(
        format(
          'Select menu interaction with unique id "%s" already exists!\nThis duplicate will be ignored.\n',
          arguments[1],
        ),
      );
      break;
    }

    case MsgType.MISSING_APPLICATION_COMMAND_ACCESS: {
      warn(
        format(
          'Slash commands cannot be provided to server: %s (ID: %s).\nPlease re-invite the bot to this server using the invite link found in "Settings -> Bot Settings".\nAlternatively, you can switch to using Global Slash Commands in "Settings -> Slash Command Settings -> Slash Command Creation Preference". However, please note global commands take a long time to update (~1 hour).',
          arguments[1],
          arguments[2],
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
      warn(format('Error getting YouTube info.\n%s', arguments[1]));
    }

    case MsgType.ERROR_CREATING_AUDIO: {
      warn(format('Error creating audio resource.\n%s', arguments[1]));
    }

    case MsgType.MISSING_MEMBER_INTENT_FIND_USER_ID: {
      warn(
        ' - DBM Warning - \nFind User (by Name/ID) may freeze or error because\nthe bot has not enabled the Server Member Events Intent.',
      );
    }
    case MsgType.CANNOT_FIND_USER_BY_ID: {
      warn(format('[Cannot Find User by ID]\nCannot find user by id: %s', arguments[1]));
    }

    case MsgType.SERVER_MESSAGE_INTENT_REQUIRED: {
      warn(
        format(
          '[Message Content Intent Required]\n%s commands found that require the "Message Content" intent.\nThese commands require the bot to be able to read messages from Discord servers.\nTo enable this behavior, first ensure the "MESSAGE CONTENT INTENT" is enabled in the "Bot" section on the Discord Developer Portal (the same page you got your bot token from).\nSecondly, in Discord Bot Maker, select Extensions -> Bot Intents from the title menu bar, and in this dialog, make sure "Message Content" is checked.',
          arguments[1],
        ),
      );
      break;
    }
    case MsgType.CHANNEL_PARTIAL_REQUIRED: {
      warn(
        format(
          '[Channel Partial Required]\n%s commands are set to "DMs Only", but the Channel partial is not enabled.\nTo allow the bot to read messages from DMs, do the following: In Discord Bot Maker, on the title menu bar, go to Extensions -> Bot Partials.\nIn the dialog that appears, select "Custom" and then make sure "Channel (Enables DMs)" is checked.',
          arguments[1],
        ),
      );
    }
  }
}

function GetActionErrorText(location, index, dataName) {
  return 'Error with the ' + location + (dataName ? ` - Action #${index} (${dataName})` : '');
}

//#endregion

//---------------------------------------------------------------------
//#region Bot
// Contains functions for controlling the bot.
//---------------------------------------------------------------------

const Bot = (DBM.Bot = {});

Bot.$slash = {}; // Slash commands
Bot.$user = {}; // User commands
Bot.$msge = {}; // Message commands

Bot.$button = {}; // Button interactions
Bot.$select = {}; // Select interactions

Bot.$cmds = {}; // Normal commands
Bot.$icds = []; // Includes word commands
Bot.$regx = []; // Regular Expression commands
Bot.$anym = []; // Any message commands

Bot.$other = {}; // Manual commands

Bot.$evts = {}; // Events

Bot.bot = null;
Bot.applicationCommandData = [];

// Compatibility layer for Intents (v14 uses IntentsBitField, v13 uses Intents)
const Intents = isV14 ? DiscordJS.IntentsBitField.Flags : DiscordJS.Intents.FLAGS;

// MESSAGE_CONTENT not defined in v13
if (!isV14 && typeof Intents.MESSAGE_CONTENT === 'undefined') {
  Intents.MESSAGE_CONTENT = 1 << 15;
}

// GuildModeration is v14 name, GUILD_BANS is v13 name
const GuildModeration = isV14 ? Intents.GuildModeration : Intents.GUILD_BANS;

Bot.PRIVILEGED_INTENTS = Intents.GuildMembers | Intents.GuildPresences | Intents.MessageContent;

Bot.NON_PRIVILEGED_INTENTS =
  Intents.Guilds |
  GuildModeration |
  Intents.GuildEmojisAndStickers |
  Intents.GuildIntegrations |
  Intents.GuildWebhooks |
  Intents.GuildInvites |
  Intents.GuildVoiceStates |
  Intents.GuildMessages |
  Intents.GuildMessageReactions |
  Intents.GuildMessageTyping |
  Intents.DirectMessages |
  Intents.DirectMessageReactions |
  Intents.DirectMessageTyping;

Bot.ALL_INTENTS = Bot.PRIVILEGED_INTENTS | Bot.NON_PRIVILEGED_INTENTS;

// Store Intents reference for later use
Bot._Intents = Intents;
Bot._isV14 = isV14;

Bot.init = function () {
  // Add global error handlers for unhandled promise rejections
  process.on('unhandledRejection', (error, promise) => {
    // Log the error but don't crash the bot
    if (error && error.message) {
      // Filter out known non-critical errors
      const errorMessage = error.message || String(error);
      const errorCode = error.code || '';
      const errorName = error.name || '';

      // Skip logging known non-critical errors
      if (
        errorCode === 'FetchOwnerId' ||
        errorMessage.includes('FetchOwnerId') ||
        errorMessage.includes("Couldn't resolve the guild ownerId")
      ) {
        // This is a known issue when bot can't fetch owner (e.g., owner left, no permissions)
        return;
      }

      if (errorMessage.includes('customData') && errorMessage.includes('undefined')) {
        // This is usually a configuration issue, not critical
        console.warn('[Unhandled Rejection] Configuration issue:', errorMessage);
        return;
      }

      // Handle JSON parsing errors from fetch/undici - these are usually from invalid API responses
      if (
        errorName === 'SyntaxError' &&
        errorMessage.includes('JSON') &&
        (errorMessage.includes('Unexpected') || errorMessage.includes('non-whitespace'))
      ) {
        // This happens when an API returns non-JSON content but we try to parse it as JSON
        // Log but don't crash - the response might be HTML error page or plain text
        console.warn('[Unhandled Rejection] JSON parsing error (likely non-JSON API response):', errorMessage);
        return;
      }

      // Log other errors
      console.error('[Unhandled Rejection]', errorMessage);
      if (error.stack) {
        console.error('[Stack]', error.stack.split('\n').slice(0, 5).join('\n'));
      }
    }
    // Handle Discord API Missing Access errors gracefully
    if (
      error &&
      (error.code === 50001 ||
        error.message === 'Missing Access' ||
        (error.constructor && error.constructor.name === 'DiscordAPIError' && error.code === 50001))
    ) {
      // These are expected when bot doesn't have permissions - don't crash
      return; // Silently ignore Missing Access errors
    }
    // Log other unhandled rejections but don't crash
    console.error('[Unhandled Rejection]', error);
  });
  // Load commands first so _textCommandCount / _hasTextCommands exist before initBot() → intents().
  // Otherwise Message Content is never merged and guild msg.content stays empty (discord.js v14).
  this.reformatData();
  this.initBot();
  this.setupBot();
  this.checkForCommandErrors();
  this.initEvents();
  this.login();
};

Bot.initBot = function () {
  const options = this.makeClientOptions();
  options.intents = this.intents();
  if (this.usePartials()) {
    options.partials = this.partials();
  }
  this.hasMemberIntents = (options.intents & this._Intents.GuildMembers) !== 0;
  this.hasMessageContentIntents = (options.intents & this._Intents.MessageContent) !== 0;
  this.bot = new DiscordJS.Client(options);
};

Bot.makeClientOptions = function () {
  return {};
};

Bot.intents = function () {
  // Check if custom intents are specified in settings
  const customIntents = Files.data.settings?.['Bot Intents']?.customData?.['Bot Intents']?.intents;
  let base;
  if (customIntents !== undefined && customIntents !== null) {
    base = customIntents;
  } else {
    base = this.NON_PRIVILEGED_INTENTS;
  }
  // Prefix / includes / regex / any-message commands need message text in guilds.
  // Discord treats Message Content as privileged; without it, msg.content is empty (especially on v14).
  const textCmdCount = typeof this._textCommandCount === 'number' ? this._textCommandCount : 0;
  if (textCmdCount > 0 && this._Intents && this._Intents.MessageContent) {
    const mc = this._Intents.MessageContent;
    if ((base & mc) !== mc) {
      base |= mc;
    }
  }
  return base;
};

Bot.usePartials = function () {
  return false;
};

Bot.partials = function () {
  return [];
};

Bot.setupBot = function () {
  this.bot.on('raw', this.onRawData);
};

Bot.onRawData = function (packet) {
  if (packet.t !== 'MESSAGE_REACTION_ADD' || packet.t !== 'MESSAGE_REACTION_REMOVE') return;

  const client = Bot.bot;
  const channel = client.channels.resolve(packet.d.channel_id);
  if (channel?.messages.cache.has(packet.d.message_id)) return;

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
};

Bot.reformatData = function () {
  this.reformatCommands();
  this.reformatEvents();
};

Bot.reformatCommands = function () {
  const data = Files.data.commands;
  if (!data) return;
  this._hasTextCommands = false;
  this._textCommandCount = 0;
  this._dmTextCommandCount = 0;
  this._caseSensitive = Files.data.settings.case === 'true';
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
};

Bot.createApiJsonFromCommand = function (com, name) {
  const result = {
    name: name ?? com.name,
    description: this.generateSlashCommandDescription(com),
  };
  // Use v14 enums if available, fallback to strings for v13
  const ApplicationCommandType = isV14 ? DiscordJS.ApplicationCommandType : null;
  switch (com.comType) {
    case '4': {
      result.type = ApplicationCommandType
        ? ApplicationCommandType.ChatInput
        : DiscordJS.Constants.ApplicationCommandTypes.CHAT_INPUT;
      break;
    }
    case '5': {
      result.type = ApplicationCommandType
        ? ApplicationCommandType.User
        : DiscordJS.Constants.ApplicationCommandTypes.USER;
      break;
    }
    case '6': {
      result.type = ApplicationCommandType
        ? ApplicationCommandType.Message
        : DiscordJS.Constants.ApplicationCommandTypes.MESSAGE;
      break;
    }
  }
  if (com.comType === '4' && com.parameters && Array.isArray(com.parameters)) {
    result.options = this.validateSlashCommandParameters(com.parameters, result.name);
  }
  return result;
};

Bot.mergeSubCommandIntoCommandData = function (names, data) {
  // Use v14 enums if available, fallback to v13 constants
  const ApplicationCommandOptionType = isV14
    ? DiscordJS.ApplicationCommandOptionType
    : DiscordJS.Constants.ApplicationCommandOptionTypes;
  const subCommandType = isV14 ? ApplicationCommandOptionType.Subcommand : 'SUB_COMMAND';
  const subCommandGroupType = isV14 ? ApplicationCommandOptionType.SubcommandGroup : 'SUB_COMMAND_GROUP';

  data.type = subCommandType;

  const baseName = names[0];
  let baseCommand = this.applicationCommandData.find((data) => data.name === baseName) ?? null;
  if (baseCommand === null) {
    baseCommand = {
      name: baseName,
      description: this.getNoDescriptionText(),
      options: [],
    };
    this.applicationCommandData.push(baseCommand);
  }

  if (names.length === 2) {
    if (!baseCommand.options) {
      baseCommand.options = [];
    }
    if (baseCommand.options.find((d) => d.name === data.name && d.type === subCommandGroupType)) {
      PrintError(MsgType.SUB_COMMAND_GROUP_ALREADY_EXISTS, names.join(' '));
    } else {
      baseCommand.options.push(data);
    }
  } else if (names.length >= 3) {
    if (!baseCommand.options) {
      baseCommand.options = [];
    }

    const groupName = names[1];
    let baseGroup = baseCommand.options.find((option) => option.name === groupName) ?? null;
    if (baseGroup === null) {
      baseGroup = {
        name: groupName,
        description: this.getNoDescriptionText(),
        type: subCommandGroupType,
        options: [],
      };
      baseCommand.options.push(baseGroup);
    } else if (baseGroup.type === subCommandType) {
      PrintError(MsgType.SUB_COMMAND_ALREADY_EXISTS, names.join(' '), `${names[0]} ${names[1]}`);
      return;
    }

    baseGroup.options.push(data);
  }
};

Bot.validateSlashCommandName = function (name) {
  if (!name) {
    return false;
  }

  const names = name
    .split(/\s+/)
    .map((name) => this.validateSlashCommandParameterName(name))
    .filter((name) => typeof name === 'string');

  return names.length > 0 ? names : false;
};

Bot.validateSlashCommandParameterName = function (name) {
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
};

Bot.generateSlashCommandDescription = function (com) {
  const desc = com.description;
  if (com.comType !== '4') {
    return '';
  }
  return this.validateSlashCommandDescription(desc);
};

Bot.validateSlashCommandDescription = function (desc) {
  if (desc?.length > 100) {
    return desc.substring(0, 100);
  }
  return desc || this.getNoDescriptionText();
};

Bot.getNoDescriptionText = function () {
  return Files.data.settings.noDescriptionText ?? '(no description)';
};

Bot.validateSlashCommandParameters = function (parameters, commandName) {
  const requireParams = [];
  const optionalParams = [];
  const existingNames = {};
  // Use v14 enums if available, fallback to v13 constants
  const ApplicationCommandOptionType = isV14
    ? DiscordJS.ApplicationCommandOptionType
    : DiscordJS.Constants.ApplicationCommandOptionTypes;

  for (let i = 0; i < parameters.length; i++) {
    const paramsData = parameters[i];
    const name = this.validateSlashCommandParameterName(paramsData.name);
    if (name) {
      if (!existingNames[name]) {
        existingNames[name] = true;
        paramsData.name = name;
        paramsData.description = this.validateSlashCommandDescription(paramsData.description);
        switch (paramsData.type) {
          case 'STRING':
            paramsData.type = ApplicationCommandOptionType.String;
            break;
          case 'INTEGER':
            paramsData.type = ApplicationCommandOptionType.Integer;
            break;
          case 'NUMBER':
            paramsData.type = ApplicationCommandOptionType.Number;
            break;
          case 'BOOLEAN':
            paramsData.type = ApplicationCommandOptionType.Boolean;
            break;
          case 'USER':
            paramsData.type = ApplicationCommandOptionType.User;
            break;
          case 'CHANNEL':
            paramsData.type = ApplicationCommandOptionType.Channel;
            break;
          case 'ROLE':
            paramsData.type = ApplicationCommandOptionType.Role;
            break;
          case 'ATTACHMENT':
            paramsData.type = ApplicationCommandOptionType.Attachment;
            break;
        }
        if (paramsData.required) {
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
};

Bot.reformatEvents = function () {
  const data = Files.data.events;
  if (!data) return;
  for (let i = 0; i < data.length; i++) {
    const com = data[i];
    if (com) {
      this.prepareActions(com.actions);
      const type = com['event-type'];
      if (!this.$evts[type]) this.$evts[type] = [];
      this.$evts[type].push(com);
    }
  }
};

Bot.prepareActions = function (actions) {
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
};

Bot.registerButtonInteraction = function (interactionId, data) {
  if (interactionId) {
    if (!this.$button[interactionId]) {
      this.$button[interactionId] = data;
    } else {
      PrintError(MsgType.DUPLICATE_BUTTON_ID, interactionId);
    }
  }
};

Bot.registerSelectMenuInteraction = function (interactionId, data) {
  if (interactionId) {
    if (!this.$select[interactionId]) {
      this.$select[interactionId] = data;
    } else {
      PrintError(MsgType.DUPLICATE_SELECT_ID, interactionId);
    }
  }
};

Bot.checkForCommandErrors = function () {
  if (this._textCommandCount > 0 && !this.hasMessageContentIntents) {
    PrintError(MsgType.SERVER_MESSAGE_INTENT_REQUIRED, this._textCommandCount);
  }
  if (this._dmTextCommandCount > 0 && (!this.usePartials() || !this.partials().includes('CHANNEL'))) {
    PrintError(MsgType.CHANNEL_PARTIAL_REQUIRED, this._dmTextCommandCount);
  }
};

Bot.initEvents = function () {
  // v14 uses "clientReady" instead of "ready" to avoid deprecation warning
  // Extensions that use "ready" will still work as clientReady is emitted before ready
  if (isV14) {
    this.bot.on('clientReady', this.onReady.bind(this));
  } else {
    this.bot.on('ready', this.onReady.bind(this));
  }
  this.bot.on('guildCreate', this.onServerJoin.bind(this));
  this.bot.on('messageCreate', this.onMessage.bind(this));
  this.bot.on('interactionCreate', this.onInteraction.bind(this));
  Events.registerEvents(this.bot);
};

Bot.login = function () {
  if (!Files.data.settings.token) {
    console.error('[Bot Login] ERROR: No token found in settings.json! Bot cannot connect to Discord.');
    return;
  }
  console.log('[Bot Login] Attempting to connect to Discord...');
  this.bot.login(Files.data.settings.token).catch((err) => {
    console.error('[Bot Login] Failed to connect to Discord:', err.message || err);
    if (err.code === 50035) {
      console.error('[Bot Login] Invalid token format. Please check your bot token in settings.json');
    } else if (err.code === 4014) {
      console.error('[Bot Login] Invalid token. Please verify your bot token in the Discord Developer Portal.');
    }
  });
};

Bot.onReady = function () {
  process.send?.('BotReady');
  console.log('Bot is ready!'); // Tells editor to start!
  this.restoreVariables();
  this.registerApplicationCommands();
  this.preformInitialization();
};

Bot.restoreVariables = function () {
  Files.restoreServerVariables();
  Files.restoreGlobalVariables();
};

Bot.registerApplicationCommands = function () {
  let slashType = Files.data.settings.slashType ?? 'auto';

  if (slashType === 'auto') {
    const serverCount = this.bot.guilds.cache.size;
    if (serverCount <= 15) {
      slashType = 'all';
    } else {
      slashType = 'global';
    }
  }

  this._slashCommandCreateType = slashType;
  this._slashCommandServerList = Files.data.settings?.slashServers?.split?.(/[\n\r]+/) ?? [];

  switch (slashType) {
    case 'all': {
      this.setAllServerCommands(this.applicationCommandData);
      this.setGlobalCommands([]);
      break;
    }
    case 'global': {
      this.setAllServerCommands([], false);
      this.setGlobalCommands(this.applicationCommandData);
      break;
    }
    case 'manual': {
      this.setCertainServerCommands(this.applicationCommandData, this._slashCommandServerList);
      this.setGlobalCommands([]);
      break;
    }
    case 'manualglobal': {
      this.setCertainServerCommands(this.applicationCommandData, this._slashCommandServerList);
      this.setGlobalCommands(this.applicationCommandData);
      break;
    }
  }
};

Bot.onServerJoin = function (guild) {
  this.initializeCommandsForNewServer(guild);
};

Bot.initializeCommandsForNewServer = function (guild) {
  switch (this._slashCommandCreateType) {
    case 'all':
    case 'manual':
    case 'manualglobal': {
      if (this._slashCommandCreateType === 'all' || this._slashCommandServerList.includes(guild.id)) {
        this.setCommandsForServer(guild, this.applicationCommandData, true);
      }
      break;
    }
  }
};

Bot.shouldPrintAnyMissingAccessError = function () {
  return !(Files.data.settings.ignoreCommandScopeErrors ?? false);
};

Bot.clearUnspecifiedServerCommands = function () {
  return Files.data.settings.clearUnlistedServers ?? false;
};

/**
 * Discord rejects bulk application command updates (50240) if the payload would remove
 * a PRIMARY_ENTRY_POINT (Activities) command. Merge those from the existing registration
 * so new slash commands (e.g. /ask) can sync.
 */
Bot.mergeFetchedPrimaryEntryPoints = function (baseCommands, existingCollection) {
  const merged = Array.isArray(baseCommands) ? [...baseCommands] : [];
  if (!existingCollection || typeof existingCollection.forEach !== 'function') {
    return merged;
  }
  const ApplicationCommandType = isV14 ? DiscordJS.ApplicationCommandType : null;
  const entryPointType =
    ApplicationCommandType && ApplicationCommandType.PrimaryEntryPoint !== undefined
      ? ApplicationCommandType.PrimaryEntryPoint
      : 4;
  existingCollection.forEach((cmd) => {
    if (!cmd) {
      return;
    }
    const t = cmd.type;
    if (t === entryPointType || t === 4) {
      const dup = merged.some((c) => c && c.name === cmd.name && c.type === t);
      if (!dup) {
        try {
          merged.push(typeof cmd.toJSON === 'function' ? cmd.toJSON() : cmd);
        } catch (e) {
          console.warn('[Discord API] Could not serialize entry point command:', e?.message || e);
        }
      }
    }
  });
  return merged;
};

Bot.setGlobalCommands = function (commands) {
  const appCmds = this.bot.application?.commands;
  if (!appCmds?.set) {
    return;
  }

  const applySet = (payload) => {
    appCmds
      .set(payload)
      .then(function () {})
      .catch(function (err) {
        if (err.code === 50240) {
          console.warn(
            '[Discord API] Entry Point command cannot be removed in bulk update. This is normal for some bot configurations.',
          );
          return;
        }
        if (err.code === 50001) {
          console.warn(
            '[Discord API] Missing access to update global commands. Bot may not have required permissions.',
          );
          return;
        }
        console.error('[Discord API Error]', err.code || err.message || err);
      });
  };

  const base = Array.isArray(commands) ? commands : [];

  if (typeof appCmds.fetch === 'function') {
    appCmds
      .fetch()
      .then((existing) => {
        applySet(Bot.mergeFetchedPrimaryEntryPoints(base, existing));
      })
      .catch((fetchErr) => {
        console.warn(
          '[Discord API] Could not fetch existing global commands to preserve entry points; registering without merge.',
          fetchErr?.message || fetchErr,
        );
        applySet(base);
      });
  } else {
    applySet(base);
  }
};

Bot.setCommandsForServer = function (guild, commands, printMissingAccessError) {
  const gCmds = guild?.commands;
  if (!gCmds?.set) {
    return;
  }

  const applyGuildSet = (payload) => {
    gCmds
      .set(payload)
      .then(function () {})
      .catch((err) => {
        if (err.code === 50001) {
          if (this.shouldPrintAnyMissingAccessError() && printMissingAccessError) {
            PrintError(MsgType.MISSING_APPLICATION_COMMAND_ACCESS, guild.name, guild.id);
          }
        } else if (err.code === 50240) {
          console.warn(
            `[Discord API] Entry Point command cannot be removed in bulk update for ${guild.name}. This is normal for some bot configurations.`,
          );
        } else {
          console.error('[Discord API Error]', err.code || err.message || err);
        }
      });
  };

  const base = Array.isArray(commands) ? commands : [];

  if (typeof gCmds.fetch === 'function') {
    gCmds
      .fetch()
      .then((existing) => {
        applyGuildSet(Bot.mergeFetchedPrimaryEntryPoints(base, existing));
      })
      .catch((fetchErr) => {
        if (fetchErr?.code === 50001 || fetchErr?.message === 'Missing Access') {
          if (process.env.DEBUG_DISCORD_ERRORS === 'true') {
            console.warn(
              `[Discord API] Could not fetch guild commands for ${guild.name} (Missing Access); registering without merge.`,
            );
          }
        } else {
          console.warn(
            `[Discord API] Could not fetch guild commands for ${guild.name} to preserve entry points; registering without merge.`,
            fetchErr?.message || fetchErr,
          );
        }
        applyGuildSet(base);
      });
  } else {
    applyGuildSet(base);
  }
};

Bot.setAllServerCommands = function (commands, printMissingAccessError = true) {
  this.bot.guilds.cache.forEach((key, value) => {
    this.bot.guilds
      .fetch(key)
      .then((guild) => {
        this.setCommandsForServer(guild, commands, printMissingAccessError);
      })
      .catch(function (err) {
        console.error(err);
      });
  });
};

Bot.setCertainServerCommands = function (commands, serverIdList) {
  if (this.clearUnspecifiedServerCommands()) {
    this.bot.guilds.cache.forEach((key, value) => {
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
};

Bot.preformInitialization = function () {
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
};

Bot.onMessage = function (msg) {
  if (msg.author?.bot) return;
  const self = this;
  const run = function (m) {
    try {
      if (!self.checkCommand(m)) {
        self.onAnyMessage(m);
      }
    } catch (e) {
      console.error(e);
    }
  };
  // With Partials.Message enabled (Bot Partials), messageCreate can deliver a partial Message
  // where body fields are missing until fetch() — prefix commands see no text otherwise.
  if (msg.partial && typeof msg.fetch === 'function') {
    msg
      .fetch()
      .then(function (full) {
        run.call(self, full);
      })
      .catch(function () {
        run.call(self, msg);
      });
    return;
  }
  run.call(this, msg);
};

Bot.checkCommand = function (msg) {
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
};

Bot.escapeRegExp = function (text) {
  return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

Bot.generateTagRegex = function (tag, allowPrefixSpace) {
  return new RegExp(`^${this.escapeRegExp(tag)}${allowPrefixSpace ? '\\s*' : ''}`);
};

Bot.populateTagRegex = function () {
  if (this.tagRegex) return;
  const tag = Files.data.settings.tag;
  const allowPrefixSpace = Files.data.settings.allowPrefixSpace === 'true';
  this.tagRegex = this.generateTagRegex(tag, allowPrefixSpace);
  return this.tagRegex;
};

Bot.checkTag = function (content) {
  const allowPrefixSpace = Files.data.settings.allowPrefixSpace === 'true';
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
};

Bot.onAnyMessage = function (msg) {
  this.checkIncludes(msg);
  this.checkRegExps(msg);
  if (!msg.author.bot) {
    if (this.$evts['2']) {
      Events.callEvents('2', 1, 0, 2, false, '', msg);
    }
    const anym = this.$anym;
    for (let i = 0; i < anym.length; i++) {
      if (anym[i]) {
        Actions.preformActionsFromMessage(msg, anym[i]);
      }
    }
  }
};

Bot.checkIncludes = function (msg) {
  const text = msg.content;
  if (!text) return;
  const icds = this.$icds;
  const icds_len = icds.length;
  for (let i = 0; i < icds_len; i++) {
    if (!icds[i]?.name) continue;
    if (icds[i]._aliases) {
      const words = [icds[i].name].concat(icds[i]._aliases);
      if (text.match(new RegExp('\\b(?:' + words.join('|') + ')\\b', 'i'))) {
        Actions.preformActionsFromMessage(msg, icds[i]);
      }
    } else if (text.match(new RegExp('\\b' + icds[i].name + '\\b', 'i'))) {
      Actions.preformActionsFromMessage(msg, icds[i]);
    }
  }
};

Bot.checkRegExps = function (msg) {
  const text = msg.content;
  if (!text) return;
  const regx = this.$regx;
  const regx_len = regx.length;
  for (let i = 0; i < regx_len; i++) {
    if (regx[i]?.name) {
      if (text.match(new RegExp(regx[i].name, 'i'))) {
        Actions.preformActionsFromMessage(msg, regx[i]);
      } else if (regx[i]._aliases) {
        const aliases = regx[i]._aliases;
        const aliases_len = aliases.length;
        for (let j = 0; j < aliases_len; j++) {
          if (text.match(new RegExp('\\b' + aliases[j] + '\\b', 'i'))) {
            Actions.preformActionsFromMessage(msg, regx[i]);
            break;
          }
        }
      }
    }
  }
};

Bot.onInteraction = function (interaction) {
  // v14 uses isChatInputCommand, v13 uses isCommand (v14 also supports isCommand for compatibility)
  const isCommand = isV14 ? interaction.isChatInputCommand?.() ?? interaction.isCommand?.() : interaction.isCommand();
  const isContextMenu = isV14
    ? interaction.isContextMenuCommand?.() ?? interaction.isContextMenu?.()
    : interaction.isContextMenu();

  if (isCommand) {
    this.onSlashCommandInteraction(interaction);
  } else if (isContextMenu) {
    this.onContextMenuInteraction(interaction);
  } else if (interaction.isModalSubmit()) {
    Actions.checkModalSubmitResponses(interaction);
  } else {
    // Use v14 enums if available, fallback to v13 constants
    const ComponentType = isV14 ? DiscordJS.ComponentType : DiscordJS.Constants.MessageComponentTypes;
    const buttonType = isV14 ? ComponentType.Button : ComponentType.BUTTON;
    const selectType = isV14 ? ComponentType.StringSelect : ComponentType.SELECT_MENU;

    if (interaction.component?.type === buttonType) {
      interaction._button = interaction.component;
    } else if (interaction.component?.type === selectType) {
      interaction._select = interaction.component;
    }
    if (!Actions.checkTemporaryInteractionResponses(interaction)) {
      if (interaction.isButton()) {
        this.onButtonInteraction(interaction);
      } else {
        // v14 uses isStringSelectMenu, v13 uses isSelectMenu (v14 also supports isSelectMenu for compatibility)
        const isSelect = isV14
          ? interaction.isStringSelectMenu?.() ?? interaction.isSelectMenu?.()
          : interaction.isSelectMenu();
        if (isSelect) {
          this.onSelectMenuInteraction(interaction);
        }
      }
    }
  }
};

Bot.onSlashCommandInteraction = function (interaction) {
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
    Actions.preformActionsFromInteraction(interaction, this.$slash[interactionName], true);
  }
};

Bot.onContextMenuInteraction = function (interaction) {
  // v14 uses isUserContextMenuCommand, v13 uses isUserContextMenu (v14 also supports isUserContextMenu for compatibility)
  const isUserMenu = isV14
    ? interaction.isUserContextMenuCommand?.() ?? interaction.isUserContextMenu?.()
    : interaction.isUserContextMenu();
  const isMessageMenu = isV14
    ? interaction.isMessageContextMenuCommand?.() ?? interaction.isMessageContextMenu?.()
    : interaction.isMessageContextMenu();

  if (isUserMenu) {
    this.onUserContextMenuInteraction(interaction);
  } else if (isMessageMenu) {
    this.onMessageContextMenuInteraction(interaction);
  }
};

Bot.onUserContextMenuInteraction = function (interaction) {
  const interactionName = interaction.commandName;
  if (this.$user[interactionName]) {
    if (interaction.guild) {
      interaction.guild.members
        .fetch(interaction.targetId)
        .then((member) => {
          interaction._targetMember = member;
          Actions.preformActionsFromInteraction(interaction, this.$user[interactionName], true);
        })
        .catch(console.error);
    } else {
      interaction._targetMember = interaction.targetUser;
      Actions.preformActionsFromInteraction(interaction, this.$user[interactionName], true);
    }
  }
};

Bot.onMessageContextMenuInteraction = function (interaction) {
  const interactionName = interaction.commandName;
  if (this.$msge[interactionName]) {
    const msg = interaction.targetMessage;
    if (!(msg instanceof DiscordJS.Message) && interaction.channel) {
      interaction.channel.messages
        .fetch(interaction.targetId)
        .then((message) => {
          interaction._targetMessage = message;
          Actions.preformActionsFromInteraction(interaction, this.$msge[interactionName], true);
        })
        .catch(console.error);
    } else {
      interaction._targetMessage = msg;
      Actions.preformActionsFromInteraction(interaction, this.$msge[interactionName], true);
    }
  }
};

Bot.onButtonInteraction = function (interaction) {
  const interactionId = interaction.customId;
  if (this.$button[interactionId]) {
    Actions.preformActionsFromInteraction(interaction, this.$button[interactionId]);
  } else {
    const response = Actions.getInvalidButtonResponseText();
    if (response) {
      interaction.reply({ content: response, flags: EPHEMERAL_FLAG });
    }
  }
};

Bot.onSelectMenuInteraction = function (interaction) {
  const interactionId = interaction.customId;
  if (this.$select[interactionId]) {
    Actions.preformActionsFromSelectInteraction(interaction, this.$select[interactionId]);
  } else {
    const response = Actions.getInvalidSelectResponseText();
    if (response) {
      interaction.reply({ content: response, flags: EPHEMERAL_FLAG });
    }
  }
};

//#endregion

//---------------------------------------------------------------------
//#region Actions
// Contains functions for bot actions.
//---------------------------------------------------------------------

const Actions = (DBM.Actions = {});

Actions.actionsLocation = null;
Actions.eventsLocation = null;
Actions.extensionsLocation = null;

Actions.server = {};
Actions.global = {};

Actions.timeStamps = [];

const ActionsCache = (Actions.ActionsCache = class ActionsCache {
  constructor(actions, server, options = {}) {
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
      // /ask (nt_ai_bridge) must editReply itself; never replace AI output with generic success.
      const autoName = this.meta?.name != null ? String(this.meta.name).toLowerCase() : '';
      if (autoName === 'ask') {
        return;
      }
      if (!this.interaction.replied) {
        const replyData = {
          flags: EPHEMERAL_FLAG,
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
    } else if (interaction) {
      if (interaction.message) {
        return interaction.message;
      } else if (interaction._targetMessage) {
        return interaction._targetMessage;
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
      result += ', Button' + (this.interaction._button ? ` "${this.interaction._button.label}"` : '');
    } else if (this.interaction?.isSelectMenu()) {
      result += ', Select Menu' + (this.interaction._select ? ` "${this.interaction._select.placeholder}"` : '');
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
});

Actions.exists = function (action) {
  if (!action) return false;
  return typeof this[action] === 'function';
};

Actions.getLocalFile = function (url) {
  return require('node:path').join(process.cwd(), url);
};

Actions.getDBM = function () {
  return DBM;
};

Actions.callListFunc = function (list, funcName, args) {
  return new Promise((resolve) => {
    const max = list.length;
    let curr = 0;
    function callItem() {
      if (curr === max) {
        resolve.apply(this, arguments);
        return;
      }
      const item = list[curr++];
      if (typeof item?.[funcName] === 'function') {
        item[funcName].apply(item, args).then(callItem).catch(callItem);
      } else {
        callItem();
      }
    }
    callItem();
  });
};

Actions.getActionVariable = function (name, defaultValue) {
  if (this[name] === undefined && defaultValue !== undefined) {
    this[name] = defaultValue;
  }
  return this[name];
};

Actions.getSlashParameter = function (interaction, name, defaultValue) {
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
};

Actions._letterEmojis = '🇦 🇧 🇨 🇩 🇪 🇫 🇬 🇭 🇮 🇯 🇰 🇱 🇲 🇳 🇴 🇵 🇶 🇷 🇸 🇹 🇺 🇻 🇼 🇽 🇾 🇿'.split(' ');

Actions.convertTextToEmojis = function (text, useRegional = true) {
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
};

Actions.getFlagEmoji = function (flagName) {
  if (flagName.startsWith('flag_')) {
    flagName = flagName.substring(5);
  }
  flagName = flagName.toUpperCase();
  return this._letterEmojis[flagName.charCodeAt(0) - 65] + this._letterEmojis[flagName.charCodeAt(1) - 65];
};

Actions.getCustomEmoji = function (nameOrId) {
  return Bot.bot.emojis.cache.get(nameOrId) ?? Bot.bot.emojis.cache.find((e) => e.name === nameOrId);
};

Actions.eval = function (content, cache, logError = true) {
  if (!content) return false;
  const DBM = this.getDBM();
  const tempVars = this.getActionVariable.bind(cache.temp);
  let serverVars = null;
  if (cache.server) {
    serverVars = this.getActionVariable.bind(this.server[cache.server.id]);
  }
  const globalVars = this.getActionVariable.bind(this.global);
  const slashParams = this.getSlashParameter.bind(this, cache.interaction);
  const customEmoji = this.getCustomEmoji.bind(this);
  const msg = cache.msg;
  const interaction = cache.interaction;
  const button = interaction?._button ?? '';
  const select = interaction?._select ?? '';
  const server = cache.server;
  const client = DBM.Bot.bot;
  const bot = DBM.Bot.bot;
  // v14: server.me is deprecated, use server.members.me instead
  const me = isV14 ? server?.members?.me ?? null : server?.me ?? null;
  let user = '',
    member = '',
    channel = '',
    mentionedUser = '',
    mentionedChannel = '',
    defaultChannel = '';
  if (msg) {
    user = msg.author;
    member = msg.member;
    channel = msg.channel;
    mentionedUser = msg.mentions.users.first() ?? '';
    mentionedChannel = msg.mentions.channels.first() ?? '';
  }
  if (interaction) {
    user = interaction.user;
    member = interaction.member;
    channel = interaction.channel;
    if (interaction.options) {
      mentionedUser = interaction.options.resolved?.users?.first?.() ?? '';
      mentionedChannel = interaction.options.resolved?.channels?.first?.() ?? '';
    }
  }
  if (server) {
    defaultChannel = server.getDefaultChannel();
  }
  try {
    return eval(content);
  } catch (e) {
    if (logError) console.error(e);
    return false;
  }
};

Actions.evalMessage = function (content, cache) {
  if (!content) return '';
  if (!content.match(/\$\{.*\}/im)) return content;
  return this.eval('`' + content.replace(/`/g, '\\`') + '`', cache);
};

Actions.evalIfPossible = function (content, cache) {
  this.__cachedText ??= {};
  if (content in this.__cachedText) return content;
  let result = this.eval(content, cache, false);
  if (result === false) result = this.evalMessage(content, cache);
  if (result === false) {
    this.__cachedText[content] = true;
    result = content;
  }
  return result;
};

Actions.initMods = function () {
  this.modInitReferences = {};
  const fs = require('node:fs');
  const path = require('node:path');
  this.modDirectories().forEach((dir) => {
    fs.readdirSync(dir).forEach((file) => {
      if (!/\.js/i.test(file)) return;
      const action = require(path.join(dir, file));
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
};

Actions.modDirectories = function () {
  const result = [this.actionsLocation];
  if (Files.verifyDirectory(Actions.eventsLocation)) {
    result.push(this.eventsLocation);
  }
  if (Files.verifyDirectory(Actions.extensionsLocation)) {
    result.push(this.extensionsLocation);
  }
  return result;
};

Actions.preformActionsFromMessage = function (msg, cmd) {
  if (this.checkConditions(msg.guild, msg.member, msg.author, cmd) && this.checkTimeRestriction(msg.author, msg, cmd)) {
    this.invokeActions(msg, cmd.actions, cmd);
  }
};

Actions.preformActionsFromInteraction = function (interaction, cmd, meta = null, initialTempVars = null) {
  const invalidPermissions = this.getInvalidPermissionsResponse();
  const invalidCooldown = this.getInvalidCooldownResponse();
  if (this.checkConditions(interaction.guild, interaction.member, interaction.user, cmd)) {
    const timeRestriction = this.checkTimeRestriction(interaction.user, interaction, cmd, true);
    if (timeRestriction === true) {
      this.invokeInteraction(interaction, cmd.actions, initialTempVars, meta === true ? cmd : meta);
    } else if (invalidCooldown) {
      const { format } = require('node:util');
      const content = typeof timeRestriction === 'string' ? format(invalidCooldown, timeRestriction) : invalidCooldown;
      interaction.reply({ content: content, flags: EPHEMERAL_FLAG });
    }
  } else if (invalidPermissions) {
    interaction.reply({ content: invalidPermissions, flags: EPHEMERAL_FLAG });
  }
};

Actions.preformActionsFromSelectInteraction = function (interaction, select, meta = null, initialTempVars = null) {
  const tempVars = initialTempVars ?? {};
  if (typeof select.tempVarName === 'string') {
    const values = interaction.values;
    tempVars[select.tempVarName] = !values || values.length === 0 ? 0 : values.length === 1 ? values[0] : values;
  }
  this.preformActionsFromInteraction(interaction, select, meta, tempVars);
};

Actions.checkConditions = function (guild, member, user, cmd) {
  const isServer = Boolean(guild && member);
  const restriction = parseInt(cmd.restriction, 10);
  switch (restriction) {
    case 0:
    case 1: {
      if (isServer) {
        return this.checkPermissions(member, cmd.permissions) && this.checkPermissions(member, cmd.permissions2);
      }
      return restriction === 0;
    }
    case 2:
      return isServer && guild.ownerId === member.id;
    case 3:
      return !isServer;
    case 4:
      return Files.data.settings.ownerId && user.id === Files.data.settings.ownerId;
    default:
      return true;
  }
};

Actions.checkTimeRestriction = function (user, msgOrInteraction, cmd, returnTimeString = false) {
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
      Events.callEvents('38', 1, 3, 2, false, '', msgOrInteraction?.member, timeString);
      return returnTimeString ? timeString : false;
    }
  }
};

Actions.generateTimeString = function (milliseconds) {
  let remaining = milliseconds;
  const times = [];

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
};

Actions.checkPermissions = function (member, permissions) {
  if (!permissions) return true;
  if (!member) return false;
  if (permissions === 'NONE') return true;
  if (member.guild?.ownerId === member.id) return true;
  return member.permissions.has(permissions);
};

Actions.invokeActions = function (msg, actions, cmd = null) {
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
};

Actions.invokeInteraction = function (interaction, actions, initialTempVars, meta = null) {
  const cacheData = {
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
};

Actions.invokeEvent = function (event, server, temp) {
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
};

Actions.callNextAction = function (cache) {
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
};

Actions.endActions = function (cache) {
  cache.callback?.();
  cache.onCompleted?.();
};

Actions.getInvalidButtonResponseText = function () {
  return Files.data.settings.invalidButtonText ?? 'Button response no longer valid.';
};

Actions.getInvalidSelectResponseText = function () {
  return Files.data.settings.invalidSelectText ?? 'Select menu response no longer valid.';
};

Actions.getDefaultResponseText = function () {
  return Files.data.settings.autoResponseText ?? 'Command successfully run!';
};

Actions.getInvalidPermissionsResponse = function () {
  return Files.data.settings.invalidPermissionsText ?? 'Invalid permissions!';
};

Actions.getInvalidUserResponse = function () {
  return Files.data.settings.invalidUserText ?? 'Invalid user!';
};

Actions.getInvalidCooldownResponse = function () {
  return Files.data.settings.invalidCooldownText ?? 'Must wait %s before using this action.';
};

Actions.getErrorString = function (data, cache) {
  const location = cache.toString();
  return GetActionErrorText(location, cache.index + 1, data?.name);
};

Actions.displayError = function (data, cache, err) {
  // Handle Discord API Missing Access errors gracefully - don't log as errors
  if (
    err &&
    (err.code === 50001 ||
      err.message === 'Missing Access' ||
      (err.constructor && err.constructor.name === 'DiscordAPIError' && err.code === 50001))
  ) {
    // Missing Access is expected when bot doesn't have permissions in a channel
    // Only log at debug level, not as an error
    if (process.env.DEBUG_DISCORD_ERRORS === 'true') {
      console.warn('[Discord API] Missing Access - Bot does not have permission to perform this action');
    }
    return; // Don't log or process Missing Access errors
  }

  if (!data) data = cache.actions[cache.index];
  const dbm = this.getErrorString(data, cache);
  console.error(dbm + ':\n' + (err.stack ?? err));
  Events.onError(dbm, err.stack ?? err, cache);

  const interaction = cache?.interaction?.__originalInteraction ?? cache?.interaction;
  if (interaction && typeof interaction.editReply === 'function' && interaction.deferred && !interaction.replied) {
    const msg =
      err && err.message && String(err.message).includes('429')
        ? 'Image service is temporarily rate limited. Please try again in a moment.'
        : 'Something went wrong.';
    interaction.editReply({ content: msg }).catch(() => {});
  }
};

Actions.getParameterFromInteraction = function (interaction, name) {
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
};

Actions.getParameterFromParameterData = function (option) {
  if (option == null || typeof option !== 'object') {
    return null;
  }
  const t = option.type;
  if (isV14 && DiscordJS.ApplicationCommandOptionType) {
    const A = DiscordJS.ApplicationCommandOptionType;
    if (t === A.String || t === A.Integer || t === A.Boolean || t === A.Number) {
      return option.value;
    }
    if (t === A.User) {
      return option.member ?? option.user;
    }
    if (t === A.Channel) {
      return option.channel;
    }
    if (t === A.Role) {
      return option.role;
    }
    if (t === A.Mentionable) {
      return option.member ?? option.channel ?? option.role ?? option.user;
    }
    if (t === A.Attachment) {
      return option.attachment?.url ?? '';
    }
  }
  switch (t) {
    case 'STRING':
    case 'INTEGER':
    case 'BOOLEAN':
    case 'NUMBER': {
      return option.value;
    }
    case 'USER': {
      return option.member ?? option.user;
    }
    case 'CHANNEL': {
      return option.channel;
    }
    case 'ROLE': {
      return option.role;
    }
    case 'MENTIONABLE': {
      return option.member ?? option.channel ?? option.role ?? option.user;
    }
    case 'ATTACHMENT': {
      return option.attachment?.url ?? '';
    }
    default: {
      return null;
    }
  }
};

Actions.findMemberOrUserFromName = async function (name, server) {
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
};

Actions.findMemberOrUserFromID = async function (id, server) {
  if (!Bot.hasMemberIntents) {
    PrintError(MsgType.MISSING_MEMBER_INTENT_FIND_USER_ID);
  }
  if (id) {
    const result = await Bot.bot.users.fetch(id);
    if (result) {
      return result;
    }
  } else {
    PrintError(MsgType.CANNOT_FIND_USER_BY_ID, id);
  }
  return null;
};

Actions.getTargetFromVariableOrParameter = function (varType, varName, cache) {
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
};

Actions.getSendTargetFromData = async function (typeData, varNameData, cache) {
  return await this.getSendTarget(parseInt(typeData, 10), this.evalMessage(varNameData, cache), cache);
};

Actions.getSendTarget = async function (type, varName, cache) {
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
      const result = Bot.bot.channels.cache.find((channel) => channel.name === searchValue);
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
};

Actions.getSendReplyTarget = async function (type, varName, cache) {
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
};

Actions.getMemberFromData = async function (typeData, varNameData, cache) {
  return await this.getMember(parseInt(typeData, 10), this.evalMessage(varNameData, cache), cache);
};

Actions.getMember = async function (type, varName, cache) {
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
};

Actions.getMessageFromData = async function (typeData, varNameData, cache) {
  return await this.getMessage(parseInt(typeData, 10), this.evalMessage(varNameData, cache), cache);
};

Actions.getMessage = async function (type, varName, cache) {
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
};

Actions.getServerFromData = async function (typeData, varNameData, cache) {
  return await this.getServer(parseInt(typeData, 10), this.evalMessage(varNameData, cache), cache);
};

Actions.getServer = async function (type, varName, cache) {
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
};

Actions.getRoleFromData = async function (typeData, varNameData, cache) {
  return await this.getRole(parseInt(typeData, 10), this.evalMessage(varNameData, cache), cache);
};

Actions.getRole = async function (type, varName, cache) {
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
};

Actions.getChannelFromData = async function (typeData, varNameData, cache) {
  return await this.getChannel(parseInt(typeData, 10), this.evalMessage(varNameData, cache), cache);
};

Actions.getChannel = async function (type, varName, cache) {
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
      const result = Bot.bot.channels.cache.find((channel) => channel.name === searchValue);
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
};

Actions.getVoiceChannelFromData = async function (typeData, varNameData, cache) {
  return await this.getVoiceChannel(parseInt(typeData, 10), this.evalMessage(varNameData, cache), cache);
};

Actions.getVoiceChannel = async function (type, varName, cache) {
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
      const result = Bot.bot.channels.cache.find((channel) => channel.name === searchValue);
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
};

Actions.getAnyChannel = async function (type, varName, cache) {
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
};

Actions.getListFromData = async function (typeData, varNameData, cache) {
  return await this.getList(parseInt(typeData, 10), this.evalMessage(varNameData, cache), cache);
};

Actions.getList = async function (type, varName, cache) {
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
};

Actions.getVariable = function (type, varName, cache) {
  return this.getTargetFromVariableOrParameter(type - 1, varName, cache);
};

Actions.storeValue = function (value, type, varName, cache) {
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
};

Actions.executeResults = function (result, data, cache) {
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
};

Actions.executeSubActionsThenNextAction = function (actions, cache) {
  return this.executeSubActions(actions, cache, () => this.callNextAction(cache));
};

Actions.executeSubActions = function (actions, cache, callback = null) {
  if (!actions) {
    callback?.();
    return false;
  }
  const newCache = this.generateSubCache(cache, actions);
  newCache.callback = () => callback?.();
  this.callNextAction(newCache);
  return true;
};

Actions.generateSubCache = function (cache, actions) {
  return ActionsCache.extend(cache, actions);
};

Actions.generateButton = function (button, cache) {
  const style = button.url ? 'LINK' : button.type;
  // Use v14 enums if available, fallback to v13 constants
  const ComponentType = isV14 ? DiscordJS.ComponentType : DiscordJS.Constants.MessageComponentTypes;
  const ButtonStyle = isV14 ? DiscordJS.ButtonStyle : DiscordJS.Constants.MessageButtonStyles;

  const buttonData = {
    type: ComponentType.Button,
    label: this.evalMessage(button.name, cache),
    style: this.convertStringButtonStyleToEnum(style, ButtonStyle),
  };
  if (button.url) {
    buttonData.url = this.evalMessage(button.url, cache);
  } else {
    buttonData.customId = this.evalMessage(button.id, cache);
  }
  if (button.emoji) {
    buttonData.emoji = this.evalMessage(button.emoji, cache);
  }
  return buttonData;
};

Actions.convertStringButtonStyleToEnum = function (style, ButtonStyle) {
  switch (style) {
    case 'PRIMARY':
      return ButtonStyle.Primary;
    case 'SECONDARY':
      return ButtonStyle.Secondary;
    case 'SUCCESS':
      return ButtonStyle.Success;
    case 'DANGER':
      return ButtonStyle.Danger;
    case 'LINK':
      return ButtonStyle.Link;
    default:
      return ButtonStyle.Primary;
  }
};

Actions.generateSelectMenu = function (select, cache) {
  // Use v14 enums if available, fallback to v13 constants
  const ComponentType = isV14 ? DiscordJS.ComponentType : DiscordJS.Constants.MessageComponentTypes;

  const selectData = {
    type: isV14 ? ComponentType.StringSelect : ComponentType.SELECT_MENU,
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
};

Actions.generateTextInput = function (textInput, defaultCustomId, cache) {
  // Use v14 enums if available, fallback to v13 constants
  const ComponentType = isV14 ? DiscordJS.ComponentType : DiscordJS.Constants.MessageComponentTypes;
  const TextInputStyle = isV14 ? DiscordJS.TextInputStyle : DiscordJS.Constants.TextInputStyles;

  const inputTextData = {
    type: ComponentType.TextInput,
    customId: !!textInput.id ? textInput.id : defaultCustomId,
    label: this.evalMessage(textInput.name, cache),
    placeholder: this.evalMessage(textInput.placeholder, cache),
    minLength: parseInt(this.evalMessage(textInput.minLength, cache), 10) ?? 0,
    maxLength: parseInt(this.evalMessage(textInput.maxLength, cache), 10) ?? 100,
    style: this.convertStringTextInputStyleToEnum(textInput.style, TextInputStyle),
    required: Boolean(textInput.required) === true,
  };
  return inputTextData;
};

Actions.convertStringTextInputStyleToEnum = function (style, TextInputStyle) {
  switch (style) {
    case 'PARAGRAPH':
      return TextInputStyle.Paragraph;
    case 'SHORT':
      return TextInputStyle.Short;
    default:
      return TextInputStyle.Short;
  }
};

Actions.addButtonToActionRowArray = function (array, rowText, buttonData, cache) {
  // Use v14 enums if available, fallback to v13 constants
  const ComponentType = isV14 ? DiscordJS.ComponentType : DiscordJS.Constants.MessageComponentTypes;
  const buttonType = isV14 ? ComponentType.Button : ComponentType.BUTTON;

  let row = 0;
  // Handle empty string, null, undefined, or whitespace-only strings
  if (!rowText || (typeof rowText === 'string' && rowText.trim() === '')) {
    let found = false;
    for (let i = 0; i < array.length; i++) {
      if (array[i].length < 5) {
        if (array[i].length === 0 || array[i][0]?.type === buttonType) {
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
    const parsedRow = parseInt(String(rowText).trim(), 10);
    if (isNaN(parsedRow) || parsedRow < 1 || parsedRow > 5) {
      this.displayError(null, cache, 'Invalid action row: "' + rowText + '". Must be a number between 1 and 5.');
      return;
    }
    row = parsedRow - 1;
  }
  if (row >= 0 && row < 5) {
    while (array.length <= row + 1) {
      array.push([]);
    }
    if (array[row].length >= 5) {
      this.displayError(null, cache, 'Action row #' + (row + 1) + ' exceeded the maximum of 5 buttons!');
    } else {
      array[row].push(buttonData);
    }
  } else {
    this.displayError(null, cache, 'Invalid action row: "' + rowText + '". Must be between 1 and 5.');
  }
};

Actions.addSelectToActionRowArray = function (array, rowText, selectData, cache) {
  let row = 0;
  // Handle empty string, null, undefined, or whitespace-only strings
  if (!rowText || (typeof rowText === 'string' && rowText.trim() === '')) {
    if (array.length !== 0) {
      row = array.length - 1;
      if (array[row].length >= 1) {
        row++;
      }
    }
  } else {
    const parsedRow = parseInt(String(rowText).trim(), 10);
    if (isNaN(parsedRow) || parsedRow < 1 || parsedRow > 5) {
      this.displayError(null, cache, `Invalid action row: '${rowText}'. Must be a number between 1 and 5.`);
      return;
    }
    row = parsedRow - 1;
  }
  if (row >= 0 && row < 5) {
    while (array.length <= row + 1) {
      array.push([]);
    }
    if (array[row].length >= 1) {
      this.displayError(
        null,
        cache,
        `Action row #${row + 1} cannot have a select menu when there are any buttons on it!`,
      );
    } else {
      array[row].push(selectData);
    }
  } else {
    this.displayError(null, cache, `Invalid action row: '${rowText}'. Must be between 1 and 5.`);
  }
};

Actions.addTextInputToActionRowArray = function (array, rowText, textInput, cache) {
  let row = 0;
  // Handle empty string, null, undefined, or whitespace-only strings
  if (!rowText || (typeof rowText === 'string' && rowText.trim() === '')) {
    if (array.length !== 0) {
      row = array.length - 1;
      if (array[row].length >= 1) {
        row++;
      }
    }
  } else {
    const parsedRow = parseInt(String(rowText).trim(), 10);
    if (isNaN(parsedRow) || parsedRow < 1 || parsedRow > 5) {
      this.displayError(null, cache, `Invalid action row: '${rowText}'. Must be a number between 1 and 5.`);
      return;
    }
    row = parsedRow - 1;
  }
  if (row >= 0 && row < 5) {
    while (array.length <= row + 1) {
      array.push([]);
    }
    if (array[row].length >= 1) {
      this.displayError(
        null,
        cache,
        `Action row #${row + 1} cannot have a text input when there are any buttons on it!`,
      );
    } else {
      array[row].push(textInput);
    }
  } else {
    this.displayError(null, cache, `Invalid action row: '${rowText}'. Must be between 1 and 5.`);
  }
};

Actions.checkTemporaryInteractionResponses = function (interaction) {
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
            interaction.reply({ content: invalidUserText, flags: EPHEMERAL_FLAG });
          }
        }
        return true;
      }
    }
  }
  return false;
};

Actions.registerTemporaryInteraction = function (messageId, time, customId, userId, multi, interactionCallback) {
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

  this._temporaryInteractions[messageId].push({ customId, userId, callback, uniqueId });
  if (time > 0) {
    require('node:timers').setTimeout(removeInteraction, time).unref();
  }
};

Actions.removeTemporaryInteraction = function (messageId, uniqueOrCustomId) {
  const interactions = this._temporaryInteractions?.[messageId];
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
};

Actions.clearTemporaryInteraction = function (messageId, customId) {
  if (this._temporaryInteractions?.[messageId]) {
    this.removeTemporaryInteraction(messageId, customId);
  }
};

Actions.clearAllTemporaryInteractions = function (messageId) {
  if (this._temporaryInteractions?.[messageId]) {
    this._temporaryInteractions[messageId] = null;
    delete this._temporaryInteractions[messageId];
  }
};

Actions.registerModalSubmitResponses = function (interactionId, callback) {
  this._temporaryInteractions ??= {};
  this._temporaryInteractions[interactionId] = callback;

  // clear up interaction after a while
  require('node:timers')
    .setTimeout(() => {
      this.clearAllTemporaryInteractions(interactionId);
    }, 60 * 60 * 1000)
    .unref();
};

Actions.checkModalSubmitResponses = function (interaction) {
  const interactionId = interaction.customId;
  if (this._temporaryInteractions?.[interactionId]) {
    this._temporaryInteractions[interactionId](interaction);
    this.clearAllTemporaryInteractions(interactionId);
  }
};

//#endregion

//---------------------------------------------------------------------
//#region Events
// Handles the various events that occur.
//---------------------------------------------------------------------

const Events = (DBM.Events = {});

let $evts = null;

Events.generateData = function () {
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
};

Events.data = Events.generateData();

Events.registerEvents = function (bot) {
  $evts = Bot.$evts;
  for (let i = 0; i < this.data.length; i++) {
    const d = this.data[i];
    if (d.length > 0 && $evts[String(i)]) {
      bot.on(d[0], this.callEvents.bind(this, String(i), d[1], d[2], d[3], !!d[4], d[5]));
    }
  }
  if ($evts['28']) bot.on('messageReactionAdd', this.onReaction.bind(this, '28'));
  if ($evts['29']) bot.on('messageReactionRemove', this.onReaction.bind(this, '29'));
  if ($evts['34']) bot.on('typingStart', this.onTyping.bind(this, '34'));
};

Events.callEvents = function (id, temp1, temp2, server, mustServe, condition, arg1, arg2) {
  if (mustServe && ((temp1 > 0 && !arg1.guild) || (temp2 > 0 && !arg2.guild))) return;
  if (condition && !condition(arg1, arg2)) return;
  const events = $evts[id];
  if (!events) return;
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const temp = {};
    if (event.temp) temp[event.temp] = this.getObject(temp1, arg1, arg2);
    if (event.temp2) temp[event.temp2] = this.getObject(temp2, arg1, arg2);
    Actions.invokeEvent(event, this.getObject(server, arg1, arg2), temp);
  }
};

Events.getObject = function (id, arg1, arg2) {
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
};

Events.onInitialization = function (bot) {
  const events = $evts['1'];
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    for (const server of bot.guilds.cache.values()) {
      Actions.invokeEvent(event, server, {});
    }
  }
};

Events.onInitializationOnce = function (bot) {
  const events = $evts['48'];
  const server = bot.guilds.cache.first();
  for (let i = 0; i < events.length; i++) {
    Actions.invokeEvent(events[i], server, {});
  }
};

Events.setupIntervals = function (bot) {
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
};

Events.onReaction = function (id, reaction, user) {
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
};

Events.onTyping = function (id, channel, user) {
  const events = $evts[id];
  if (!events) return;
  const server = channel.guild;
  const member = server?.members.resolve(user);
  if (!member) return;
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const temp = {};
    if (event.temp) temp[event.temp] = channel;
    if (event.temp2) temp[event.temp2] = member;
    Actions.invokeEvent(event, server, temp);
  }
};

Events.onError = function (text, text2, cache) {
  const events = $evts['37'];
  if (!events) return;
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const temp = {};
    if (event.temp) temp[event.temp] = text;
    if (event.temp2) temp[event.temp2] = text2;
    Actions.invokeEvent(event, cache.server, temp);
  }
};

//#endregion

//---------------------------------------------------------------------
//#region Images
// Contains functions for image management.
//---------------------------------------------------------------------

const Images = (DBM.Images = {});

Images.JIMP = null;
Images._jimpRoot = null;
try {
  const jimpMod = require('jimp');
  Images._jimpRoot = jimpMod;
  Images.JIMP =
    jimpMod && jimpMod.Jimp && typeof jimpMod.Jimp.read === 'function'
      ? jimpMod.Jimp
      : jimpMod && typeof jimpMod.read === 'function'
      ? jimpMod
      : null;
} catch {}

Images.getImage = function (url) {
  const Jimp = Images.JIMP;
  if (!Jimp || typeof Jimp.read !== 'function') {
    return Promise.reject(new Error('JIMP is not available. Install jimp or check compatibility.'));
  }
  if (!url.startsWith('http')) url = Actions.getLocalFile(url);
  return Jimp.read(url);
};

Images.getFont = function (url) {
  const root = Images._jimpRoot;
  if (!root || typeof root.loadFont !== 'function') {
    return Promise.reject(new Error('JIMP loadFont is not available. Install jimp or check compatibility.'));
  }
  return root.loadFont(Actions.getLocalFile(url));
};

Images.isImage = function (obj) {
  if (!Images.JIMP) {
    return false;
  }
  return obj instanceof Images.JIMP;
};

Images.createBuffer = function (image) {
  const mime = (Images._jimpRoot && Images._jimpRoot.JimpMime && Images._jimpRoot.JimpMime.png) || 'image/png';
  return Promise.resolve(image.getBuffer(mime));
};

Images.drawImageOnImage = function (img1, img2, x, y) {
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
};

//#endregion

//---------------------------------------------------------------------
//#region Files
// Contains functions for file management.
//---------------------------------------------------------------------

const Files = (DBM.Files = {});

// Lets extensions loaded via require() (e.g. nt_ai_bridge) read live settings via global.DBM.Files.
try {
  global.DBM = DBM;
} catch (_) {}

Files.data = {};
Files.writers = {};
Files.crypto = require('node:crypto');
Files.dataFiles = [
  'commands.json',
  'events.json',
  'settings.json',
  'players.json',
  'servers.json',
  'messages.json',
  'serverVars.json',
  'globalVars.json',
];

Files.startBot = function () {
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
};

Files.verifyDirectory = function (dir) {
  return typeof dir === 'string' && require('node:fs').existsSync(dir);
};

Files.readData = function (callback) {
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
};

Files.saveData = function (file, callback) {
  const path = require('node:path');
  const data = this.data[file];
  if (!this.writers[file]) {
    const fstorm = require('fstorm');
    this.writers[file] = fstorm(path.join(process.cwd(), 'data', file + '.json'));
  }
  this.writers[file].write(this.encrypt(JSON.stringify(data)), () => callback?.());
};

Files.initEncryption = function () {
  try {
    this.password = require('discord-bot-maker');
  } catch {
    this.password = '';
  }
};

Files.encrypt = function (text) {
  if (this.password.length === 0) return text;
  const cipher = this.crypto.createCipher('aes-128-ofb', this.password);
  return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
};

Files.decrypt = function (text) {
  if (this.password.length === 0) return text;
  const decipher = this.crypto.createDecipher('aes-128-ofb', this.password);
  return decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
};

Files.convertItem = function (item) {
  if (Array.isArray(item)) {
    const result = [];
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
};

Files.saveServerVariable = function (serverId, varName, item) {
  this.data.serverVars[serverId] ??= {};
  const strItem = this.convertItem(item);
  if (strItem !== null) {
    this.data.serverVars[serverId][varName] = strItem;
  }
  this.saveData('serverVars');
};

Files.restoreServerVariables = function () {
  const keys = Object.keys(this.data.serverVars);
  for (let i = 0; i < keys.length; i++) {
    const varNames = Object.keys(this.data.serverVars[keys[i]]);
    for (let j = 0; j < varNames.length; j++) {
      this.restoreVariable(this.data.serverVars[keys[i]][varNames[j]], 2, varNames[j], keys[i]);
    }
  }
};

Files.saveGlobalVariable = function (varName, item) {
  const strItem = this.convertItem(item);
  if (strItem !== null) {
    this.data.globalVars[varName] = strItem;
  }
  this.saveData('globalVars');
};

Files.restoreGlobalVariables = function () {
  const keys = Object.keys(this.data.globalVars);
  for (let i = 0; i < keys.length; i++) {
    this.restoreVariable(this.data.globalVars[keys[i]], 3, keys[i]);
  }
};

Files.restoreVariable = function (value, type, varName, serverId) {
  const cache = {};
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
};

Files.restoreValue = function (value, bot) {
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
      const result = [];
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
};

Files.restoreMember = function (value, bot) {
  const split = value.split('_');
  const memId = split[0].slice(4);
  const serverId = split[1].slice(2);
  const server = bot.guilds.get(serverId);
  if (server) {
    return server.members.resolve(memId);
  }
  return null;
};

Files.restoreMessage = function (value, bot) {
  const split = value.split('_');
  const msgId = split[0].slice(4);
  const channelId = split[1].slice(2);
  const channel = bot.channels.resolve(channelId);
  if (channel) {
    return channel.messages.fetch(msgId);
  }
  return null;
};

Files.restoreTextChannel = function (value, bot) {
  const channelId = value.slice(3);
  return bot.channels.resolve(channelId);
};

Files.restoreVoiceChannel = function (value, bot) {
  const channelId = value.slice(3);
  return bot.channels.resolve(channelId);
};

Files.restoreRole = function (value, bot) {
  const split = value.split('_');
  const roleId = split[0].slice(2);
  const serverId = split[1].slice(2);
  const server = bot.guilds.resolve(serverId);
  if (server?.roles) {
    return server.roles.resolve(roleId);
  }
  return null;
};

Files.restoreServer = function (value, bot) {
  const serverId = value.slice(2);
  return bot.guilds.resolve(serverId);
};

Files.restoreEmoji = function (value, bot) {
  const emojiId = value.slice(2);
  return bot.emojis.resolve(emojiId);
};

Files.restoreUser = function (value, bot) {
  const userId = value.slice(4);
  return bot.users.resolve(userId);
};

Files.initEncryption();

//#endregion

//---------------------------------------------------------------------
//#region Audio
// Contains functions for voice channel stuff.
//---------------------------------------------------------------------

const Audio = (DBM.Audio = {});
const { setTimeout } = require('node:timers/promises');

Audio.checkIfHasDependency = function (key) {
  if (!Audio.packageJson) {
    const path = require('node:path');
    Audio.packageJson = require('node:fs').readFileSync(path.join(__dirname, 'package.json'));
    Audio.packageJson = JSON.parse(Audio.packageJson).dependencies;
    if (!Audio.packageJson) {
      Audio.packageJson = 1;
    }
  }
  if (Audio.packageJson !== 1) {
    return !!Audio.packageJson[key];
  }
  return false;
};

Audio.ytdl = null;
try {
  Audio.ytdl = require('ytdl-core');
} catch (e) {
  Audio.ytdl = null;
  if (Audio.checkIfHasDependency('ytdl-core')) {
    console.error(e);
  }
}

Audio.voice = null;
try {
  Audio.voice = require('@discordjs/voice');
} catch (e) {
  Audio.voice = null;
  if (Audio.checkIfHasDependency('@discordjs/voice')) {
    console.error(e);
  }
}

Audio.rawYtdl = null;
try {
  Audio.rawYtdl = require('youtube-dl-exec').exec;
} catch (e) {
  Audio.rawYtdl = null;
  if (Audio.checkIfHasDependency('youtube-dl-exec')) {
    console.error(e);
  }
}

Audio.Subscription = class {
  /** @param {import('@discordjs/voice').VoiceConnection} voiceConnection */
  constructor(voiceConnection) {
    this.voiceConnection = voiceConnection;
    this.audioPlayer = Audio.voice.createAudioPlayer();
    this.queue = [];
    this.volume = 0.5;
    this.bitrate = 96;

    this.voiceConnection.on('stateChange', async (_, newState) => {
      if (newState.status === Audio.voice.VoiceConnectionStatus.Disconnected) {
        if (
          newState.reason === Audio.voice.VoiceConnectionDisconnectReason.WebSocketClose &&
          newState.closeCode === 4014
        ) {
          try {
            // Probably moved voice channel
            await Audio.voice.entersState(this.voiceConnection, Audio.voice.VoiceConnectionStatus.Connecting, 5_000);
          } catch {
            // Probably removed from voice channel
            if (this.voiceConnection.state.status !== Audio.voice.VoiceConnectionStatus.Destroyed) {
              this.voiceConnection.destroy();
            }
          }
        } else if (this.voiceConnection.rejoinAttempts < 5) {
          await setTimeout((this.voiceConnection.rejoinAttempts + 1) * 5_000);
          this.voiceConnection.rejoin();
        } else {
          this.voiceConnection.destroy();
        }
      } else if (newState.status === Audio.voice.VoiceConnectionStatus.Destroyed) {
        this.stop();
      } else if (
        !this.readyLock &&
        (newState.status === Audio.voice.VoiceConnectionStatus.Connecting ||
          newState.status === Audio.voice.VoiceConnectionStatus.Signalling)
      ) {
        this.readyLock = true;
        try {
          await Audio.voice.entersState(this.voiceConnection, Audio.voice.VoiceConnectionStatus.Ready, 20_000);
        } catch {
          if (this.voiceConnection.state.status !== Audio.voice.VoiceConnectionStatus.Destroyed) {
            this.voiceConnection.destroy();
          }
        } finally {
          this.readyLock = false;
        }
      }
    });

    this.audioPlayer.on('stateChange', (oldState, newState) => {
      if (
        newState.status === Audio.voice.AudioPlayerStatus.Idle &&
        oldState.status !== Audio.voice.AudioPlayerStatus.Idle
      ) {
        void this.processQueue();
      }
    });

    this.audioPlayer.on('error', console.error);

    voiceConnection.subscribe(this.audioPlayer);
  }

  enqueue(track, beginning = false) {
    if (beginning) this.queue.unshift(track);
    else this.queue.push(track);
    void this.processQueue();
  }

  stop() {
    this.queueLock = true;
    this.queue = [];
    this.audioPlayer.stop(true);
  }

  async processQueue() {
    if (this.queueLock || this.audioPlayer.state.status !== Audio.voice.AudioPlayerStatus.Idle) {
      return;
    }

    if (this.queue.length === 0) {
      const leaveVoiceTimeout = Files.data.settings.leaveVoiceTimeout ?? '0';
      let seconds = parseInt(leaveVoiceTimeout, 10);

      if (isNaN(seconds) || seconds < 0) seconds = 0;
      if (leaveVoiceTimeout === '' || !isFinite(seconds)) return;

      require('node:timers')
        .setTimeout(async () => {
          let guild = null;
          try {
            guild = await Bot.bot.guilds.resolve(this.voiceConnection.joinConfig.guildId);
          } catch (e) {
            console.error(e);
          }
          if (guild) {
            Audio.disconnectFromVoice(guild);
          }
        }, seconds * 1e3)
        .unref();
      return;
    }

    this.queueLock = true;

    const nextTrack = this.queue.shift();
    try {
      const resource = await nextTrack.createAudioResource();
      if (Audio.inlineVolume && typeof resource?.volume?.volume === 'number') {
        resource.volume.volume = this.volume ?? 0.5;
      }
      // resource.encoder.setBitrate(this.bitrate * 1e3);
      this.audioPlayer.play(resource);
      this.queueLock = false;
    } catch (e) {
      if (e.toString().includes('opus.node')) {
        console.warn(`-- DBM Error Note --
If you're seeing an error here, it's likely that the version of
NodeJS/NPM or the operating system used to install @discordjs/opus
is different from the NodeJS/NPM/OS running this bot.
Try deleting "node_modules" and running "npm install" to resolve the issue.
`);
      }
      console.error(e);
      this.queueLock = false;
      return this.processQueue();
    }
  }
};

Audio.Track = class {
  /**
   * @param {Object} options
   * @param {String} options.url
   * @param {String} options.title
   */
  constructor({ url, title }) {
    this.url = url;
    this.title = title;
  }

  createAudioResource() {
    return new Promise((resolve, reject) => {
      const child = Audio.rawYtdl(
        this.url,
        {
          o: '-',
          q: '',
          f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
          r: '100K',
        },
        { stdio: ['ignore', 'pipe', 'ignore'] },
      );
      if (!child.stdout) {
        reject(new Error('Got not stdout from child'));
        return;
      }
      const stream = child.stdout;
      const onError = (error) => {
        if (!child.killed) child.kill();
        stream.resume();
        reject(error);
      };
      child
        .once('spawn', () =>
          Audio.voice
            .demuxProbe(stream)
            .then((probe) =>
              resolve(
                Audio.voice.createAudioResource(probe.stream, {
                  metadata: this,
                  inlineVolume: !!Audio.inlineVolume,
                  inputType: probe.type,
                }),
              ),
            )
            .catch(onError),
        )
        .catch(onError);
    });
  }

  static async from(url) {
    let info = null;
    try {
      info = await Audio.ytdl.getInfo(url);
    } catch (e) {
      PrintError(MsgType.ERROR_GETTING_YT_INFO, e.stack.toString());
    }
    return new Audio.Track({ title: info?.videoDetails?.title ?? '', url });
  }
};

Audio.BasicTrack = class {
  /**
   * @param {Object} options
   * @param {String} options.url
   */
  constructor({ url }) {
    this.url = url;
  }

  createAudioResource() {
    return Audio.voice.createAudioResource(this.url, {
      inlineVolume: !!Audio.inlineVolume,
      inputType: Audio.voice.StreamType.Arbitrary,
    });
  }
};

Audio.subscriptions = new Map();

Audio.connectToVoice = function (voiceChannel) {
  if (!Audio.voice || !Audio.rawYtdl || !Audio.ytdl) {
    return PrintError(MsgType.MISSING_MUSIC_MODULES);
  }

  Audio.inlineVolume ??= (Files.data.settings.mutableVolume ?? 'true') === 'true';

  var existingSubscription = this.subscriptions.get(voiceChannel?.guild?.id);
  if (existingSubscription) {
    const status = existingSubscription.voiceConnection?.state?.status;
    if (status === Audio.voice.VoiceConnectionStatus.Disconnected) {
      existingSubscription.voiceConnection.destroy();
      existingSubscription = null;
    } else if (status === Audio.voice.VoiceConnectionStatus.Destroyed) {
      existingSubscription = null;
    }

    if (existingSubscription?.voiceConnection?.joinConfig?.channelId === voiceChannel.id) {
      return;
    }
  }

  const subscription = new this.Subscription(
    this.voice.joinVoiceChannel({
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      channelId: voiceChannel.id,
      guildId: voiceChannel.guildId,
      selfDeaf: (Files.data.settings.autoDeafen ?? 'true') === 'true',
    }),
  );

  this.subscriptions.set(voiceChannel.guildId, subscription);

  return subscription;
};

Audio.getSubscription = function (guild) {
  const subscription = this.subscriptions.get(guild?.id);
  if (!subscription) {
    const voiceChannel = guild?.me?.voice?.channel;
    if (voiceChannel) {
      return this.connectToVoice(voiceChannel);
    }
  }
  return subscription;
};

Audio.disconnectFromVoice = function (guild) {
  if (!guild) return;
  const subscription = this.getSubscription(guild);
  if (!subscription) return;
  subscription.voiceConnection.destroy();
  this.subscriptions.delete(guild?.id);
};

Audio.setVolume = function (volume, guild) {
  if (Audio.inlineVolume === false) return PrintError(MsgType.MUTABLE_VOLUME_DISABLED);
  if (!guild) return;
  const subscription = this.getSubscription(guild);
  if (!subscription) return PrintError(MsgType.MUTABLE_VOLUME_NOT_IN_CHANNEL);
  subscription.volume = volume;
  if (subscription.audioPlayer.state.status === this.voice.AudioPlayerStatus.Playing) {
    subscription.audioPlayer.state.resource.volume.volume = volume;
  }
};

Audio.addAudio = async function (info, guild, isQueue) {
  if (!guild) return;
  if (isQueue) {
    Audio.addToQueue(info, guild);
  } else {
    Audio.playImmediately(info, guild);
  }
};

Audio.addToQueue = async function ([type, options, url], guild) {
  if (!guild) return;
  const id = guild.id;
  const subscription = this.getSubscription(guild);
  if (!subscription) return;
  if (typeof options.volume !== 'undefined') this.setVolume(options.volume, guild);
  if (typeof options.bitrate !== 'undefined') subscription.bitrate = options.bitrate;
  let track = null;
  try {
    track = await this.getTrack(url, type);
  } catch (e) {
    PrintError(MsgType.ERROR_CREATING_AUDIO, e.stack.toString());
  }
  if (track !== null) {
    subscription.enqueue(track);
  }
};

Audio.playImmediately = async function ([type, options, url], guild) {
  if (!guild) return;
  const subscription = this.getSubscription(guild);
  if (!subscription) return;
  if (typeof options.volume !== 'undefined') this.setVolume(options.volume, guild);
  if (typeof options.bitrate !== 'undefined') subscription.bitrate = options.bitrate;
  let track = null;
  try {
    track = await this.getTrack(url, type);
  } catch (e) {
    PrintError(MsgType.ERROR_CREATING_AUDIO, e.stack.toString());
  }
  if (track !== null) {
    subscription.enqueue(track, true);
  }
  subscription.audioPlayer.stop(true);
};

Audio.clearQueue = function (cache) {
  if (!cache.server) return;
  const subscription = this.getSubscription(cache.server);
  if (!subscription) return;
  subscription.queue = [];
};

Audio.getTrack = function (url, type) {
  switch (type) {
    case 'file':
      return new this.BasicTrack({ url: Actions.getLocalFile(url) });
    case 'url':
      return new this.BasicTrack({ url });
    case 'yt':
      return this.Track.from(url);
  }
};

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
        const ChannelType = isV14 ? DiscordJS.ChannelType : null;
        const textType = isV14 ? ChannelType.GuildText : 'GUILD_TEXT';
        const newsType = isV14 ? ChannelType.GuildAnnouncement : 'GUILD_NEWS';
        if (
          c
            .permissionsFor(DBM.Bot.bot.user)
            ?.has(
              isV14 ? DiscordJS.PermissionsBitField.Flags.SendMessages : DiscordJS.Permissions.FLAGS.SEND_MESSAGES,
            ) &&
          (c.type === textType || c.type === newsType)
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
        const ChannelType = isV14 ? DiscordJS.ChannelType : null;
        const voiceType = isV14 ? ChannelType.GuildVoice : 'GUILD_VOICE';
        if (
          c
            .permissionsFor(DBM.Bot.bot.user)
            ?.has(
              isV14 ? DiscordJS.PermissionsBitField.Flags.SendMessages : DiscordJS.Permissions.FLAGS.SEND_MESSAGES,
            ) &&
          c.type === voiceType
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
