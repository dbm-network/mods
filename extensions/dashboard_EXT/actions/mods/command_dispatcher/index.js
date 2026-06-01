const { PermissionFlagsBits } = require('discord.js');
const serverPrefixManager = require('../../../tools/server-prefix-manager');

let CommandManager;

module.exports = {
  async run(DBM, req, res, Dashboard, providedGuild) {
    const bot = DBM?.Bot?.bot;
    if (!bot) {
      return 'Bot client is not ready. Please try again shortly.';
    }

    const input = req?.body || {};
    const mode = input.dispatcherMode === 'slash' ? 'slash' : 'prefix';

    const guildId = String(
      input.server || req?.params?.serverID || req?.params?.guildID || providedGuild?.id || '',
    ).trim();

    if (!guildId) {
      return 'Unable to resolve guild context.';
    }

    const guild = providedGuild || bot.guilds.cache.get(guildId) || (await safeFetch(() => bot.guilds.fetch(guildId)));

    if (!guild) {
      return 'The bot is no longer in that server.';
    }

    try {
      if (mode === 'slash') {
        if (!ensureTsRuntime()) {
          return 'Slash dispatcher is unavailable on this host (TypeScript runtime missing).';
        }
        return await handleSlashDispatch({
          DBM,
          Dashboard,
          guild,
          bot,
          req,
          input,
        });
      }

      return await handlePrefixDispatch({
        DBM,
        Dashboard,
        guild,
        bot,
        input,
      });
    } catch (error) {
      console.error('[CommandDispatcher] Failed to dispatch command:', error);
      const safeMessage = typeof error?.message === 'string' ? error.message : 'Unknown error';
      return `Command dispatch failed (${safeMessage}).`;
    }
  },
};

async function handlePrefixDispatch({ DBM, Dashboard, guild, bot, input }) {
  const channelId = String(input.channelId || '').trim();
  if (!channelId) {
    return 'Select a channel to dispatch the command.';
  }

  const channel = guild.channels.cache.get(channelId) || (await safeFetch(() => guild.channels.fetch(channelId)));

  if (!channel || typeof channel.isTextBased !== 'function' || !channel.isTextBased()) {
    return 'Only text-capable channels can receive commands.';
  }

  const commandName = sanitizeCommandName(input.commandName);
  if (!commandName) {
    return 'Enter a command name (letters, numbers, dashes or underscores).';
  }

  const botMember = guild.members.me || (await safeFetch(() => guild.members.fetch(bot.user.id)));
  if (!botMember) {
    return 'Bot member data is unavailable for this server.';
  }

  const permissions = channel.permissionsFor(botMember);
  if (!permissions?.has(PermissionFlagsBits.SendMessages)) {
    return 'The bot cannot send messages in that channel. Please update permissions.';
  }

  const rawArgs = sanitizeArguments(input.commandArgs);
  const globalPrefix =
    DBM?.Files?.data?.settings?.tag && DBM.Files.data.settings.tag.trim().length
      ? DBM.Files.data.settings.tag.trim()
      : Dashboard?.settings?.botSettings?.commandPrefix || serverPrefixManager.DEFAULT_PREFIX;

  const serverPrefix = serverPrefixManager.getPrefix(guild.id, globalPrefix);

  const payload = `${serverPrefix}${commandName}${rawArgs ? ` ${rawArgs}` : ''}`.trim();

  await channel.send({
    content: payload,
    allowedMentions: { parse: [] },
  });

  console.info('[CommandDispatcher] Prefix command queued', {
    guildId: guild.id,
    channelId: channel.id,
    command: commandName,
  });

  return `Queued \`${payload}\` inside #${channel.name}. The bot will process it as soon as it reads the message.`;
}

async function handleSlashDispatch({ DBM, guild, bot, req, input }) {
  const commandId = String(input.slashCommandId || '').trim();
  if (!commandId) {
    return 'Select a slash command to execute.';
  }

  const dbmCommands = Array.isArray(DBM?.Files?.data?.commands) ? DBM.Files.data.commands.filter(Boolean) : [];

  const commandMeta = dbmCommands.find((cmd) => cmd._id === commandId);
  if (!commandMeta) {
    return 'Slash command definition was not found in your DBM data.';
  }

  // Normalize DBM comType: may be stored as string "4" or number 4
  if (String(commandMeta.comType) !== '4') {
    if (process.env.NODE_ENV !== 'production') {
      console.debug('[CommandDispatcher] Slash guard blocked - meta', {
        id: commandMeta._id,
        name: commandMeta.name,
        comType: commandMeta.comType,
      });
    }
    return 'The selected command is not registered as a slash command.';
  }

  const slashCommand = ensureSlashCommandRegistered(commandMeta);
  if (!isSlashCapable(slashCommand)) {
    return `/${commandMeta.name} is not currently registered inside the running bot. Reload commands and try again.`;
  }

  const visibility = ['ephemeral', 'public'].includes(input.slashVisibility) ? input.slashVisibility : 'auto';

  const preferredChannelId = String(input.slashChannelId || '').trim();
  const responseChannel = await resolveResponseChannel(guild, preferredChannelId);

  const actorMember = await resolveGuildMember(guild, req?.user?.id);
  const interactionOptions = await buildSlashOptions(commandMeta.parameters || [], input, guild, bot);

  const interaction = createDashboardInteraction({
    commandName: commandMeta.name,
    guild,
    bot,
    channel: responseChannel,
    user: actorMember?.user || bot.user,
    member: actorMember || null,
    preferredVisibility: visibility,
    optionsMap: interactionOptions,
  });

  const handled = await ensureCommandManager().handleSlashCommand(interaction);
  if (!handled) {
    return `/${commandMeta.name} could not be executed. Verify the bot has registered this slash command.`;
  }

  return interaction.getSummary(commandMeta.name);
}

function ensureTsRuntime() {
  if (CommandManager) {
    return true;
  }

  try {
    if (!global.__NT_TS_RUNTIME__) {
      require('ts-node').register({
        transpileOnly: true,
        compilerOptions: {
          module: 'CommonJS',
          moduleResolution: 'Node',
        },
      });
      global.__NT_TS_RUNTIME__ = true;
    }

    ({ CommandManager } = require('../../../modules/command-manager.ts'));
    return true;
  } catch (error) {
    console.error('[CommandDispatcher] Unable to bootstrap ts-node runtime:', error);
    return false;
  }
}

function ensureCommandManager() {
  if (!CommandManager) {
    throw new Error('Command manager runtime is not available.');
  }
  return CommandManager;
}

function isSlashCapable(command) {
  if (!command) {
    return false;
  }

  if (command.slashCommand) {
    return true;
  }

  if (typeof command.comType !== 'undefined') {
    return String(command.comType) === '4';
  }

  return false;
}

function ensureSlashCommandRegistered(commandMeta) {
  const manager = ensureCommandManager();
  const command = manager.getCommand(commandMeta.name);

  if (command) {
    if (!command.slashCommand) {
      command.slashCommand = true;
    }
    return command;
  }

  const normalized = {
    name: commandMeta.name,
    description: commandMeta.description || 'Dashboard-triggered slash command',
    permissions: commandMeta.permissions || 'NONE',
    permissions2: commandMeta.permissions2 || 'NONE',
    restriction: commandMeta.restriction || '0',
    _id: commandMeta._id || `dashboard-${Date.now()}`,
    actions: Array.isArray(commandMeta.actions) ? commandMeta.actions : [],
    comType: Number(commandMeta.comType) || 4,
    parameters: Array.isArray(commandMeta.parameters) ? commandMeta.parameters : [],
    _aliases: Array.isArray(commandMeta._aliases) ? commandMeta._aliases : [],
    category: commandMeta.category,
    cooldown: commandMeta.cooldown || 0,
    serverOnly: commandMeta.restriction === '1',
    dmOnly: commandMeta.restriction === '2',
    slashCommand: true,
    prefixCommand: true,
  };

  manager.registerCommand(normalized);
  return normalized;
}

async function buildSlashOptions(parameters, body, guild, bot) {
  const optionMap = {};

  for (const param of parameters) {
    const fieldName = `slashParam_${param.name}`;
    const rawValue = typeof body[fieldName] === 'string' ? body[fieldName].trim() : '';

    if (!rawValue) {
      if (param.required) {
        throw new Error(`Parameter "${param.name}" is required.`);
      }
      continue;
    }

    optionMap[param.name] = await resolveSlashParameter(param, rawValue, guild, bot);
  }

  return optionMap;
}

async function resolveSlashParameter(param, rawValue, guild, bot) {
  const type = String(param.type || 'STRING').toUpperCase();
  const choices = Array.isArray(param.choices) ? param.choices.map((choice) => String(choice.value)) : null;

  switch (type) {
    case 'INTEGER': {
      const value = parseInt(rawValue, 10);
      if (!Number.isFinite(value)) {
        throw new Error(`Parameter "${param.name}" must be an integer.`);
      }
      if (choices && !choices.includes(String(value))) {
        throw new Error(`"${param.name}" must be one of: ${choices.join(', ')}`);
      }
      return { name: param.name, value };
    }
    case 'NUMBER': {
      const value = parseFloat(rawValue);
      if (!Number.isFinite(value)) {
        throw new Error(`Parameter "${param.name}" must be a number.`);
      }
      if (choices && !choices.includes(String(value))) {
        throw new Error(`"${param.name}" must be one of: ${choices.join(', ')}`);
      }
      return { name: param.name, value };
    }
    case 'BOOLEAN': {
      const value = ['true', '1', 'yes', 'on'].includes(rawValue.toLowerCase());
      return { name: param.name, value };
    }
    case 'USER': {
      const member = await resolveGuildMember(guild, rawValue);
      if (!member) {
        throw new Error(`User "${rawValue}" was not found in this guild.`);
      }
      return { name: param.name, value: member.user.id, user: member.user, member };
    }
    case 'CHANNEL': {
      const channel = await resolveAnyChannel(guild, rawValue);
      if (!channel) {
        throw new Error(`Channel "${rawValue}" was not found.`);
      }
      return { name: param.name, value: channel.id, channel };
    }
    case 'ROLE': {
      const role = await resolveRole(guild, rawValue);
      if (!role) {
        throw new Error(`Role "${rawValue}" was not found.`);
      }
      return { name: param.name, value: role.id, role };
    }
    case 'MENTIONABLE': {
      const member = await resolveGuildMember(guild, rawValue);
      if (member) {
        return { name: param.name, value: member.user.id, user: member.user, member };
      }
      const role = await resolveRole(guild, rawValue);
      if (role) {
        return { name: param.name, value: role.id, role };
      }
      throw new Error(`Mentionable "${rawValue}" was not found.`);
    }
    case 'ATTACHMENT': {
      throw new Error(`Attachments can't be supplied from the dashboard for "${param.name}".`);
    }
    case 'STRING':
    default: {
      if (choices && !choices.includes(rawValue)) {
        throw new Error(`"${param.name}" must be one of: ${choices.join(', ')}`);
      }
      return { name: param.name, value: rawValue };
    }
  }
}

async function resolveResponseChannel(guild, channelId) {
  if (!channelId) {
    return findDefaultTextChannel(guild);
  }

  const channel = guild.channels.cache.get(channelId) || (await safeFetch(() => guild.channels.fetch(channelId)));

  if (channel && typeof channel.isTextBased === 'function' && channel.isTextBased()) {
    return channel;
  }

  return findDefaultTextChannel(guild);
}

async function resolveGuildMember(guild, rawId) {
  const id = normalizeSnowflake(rawId);
  if (!id) return null;

  return guild.members.cache.get(id) || (await safeFetch(() => guild.members.fetch(id)));
}

async function resolveAnyChannel(guild, rawId) {
  const id = normalizeSnowflake(rawId);
  if (!id) return null;
  return guild.channels.cache.get(id) || (await safeFetch(() => guild.channels.fetch(id)));
}

async function resolveRole(guild, rawId) {
  const id = normalizeSnowflake(rawId);
  if (!id) return null;
  return guild.roles.cache.get(id) || null;
}

function findDefaultTextChannel(guild) {
  if (guild.systemChannel && guild.systemChannel.isTextBased()) {
    return guild.systemChannel;
  }

  return (
    guild.channels.cache.find((channel) => typeof channel.isTextBased === 'function' && channel.isTextBased()) || null
  );
}

function normalizeSnowflake(value) {
  if (typeof value !== 'string') {
    return '';
  }
  return value.replace(/[<@#!&>]/g, '').trim();
}

class DashboardInteractionOptions {
  constructor(optionsMap) {
    this.map = optionsMap || {};
  }

  get(name) {
    return this.map[name] || null;
  }

  getString(name) {
    const option = this.get(name);
    return option ? String(option.value ?? '') : null;
  }

  getNumber(name) {
    const option = this.get(name);
    const value = option?.value;
    return typeof value === 'number' ? value : null;
  }

  getInteger(name) {
    return this.getNumber(name);
  }

  getBoolean(name) {
    const option = this.get(name);
    if (typeof option?.value === 'boolean') {
      return option.value;
    }
    return null;
  }

  getUser(name) {
    const option = this.get(name);
    return option?.user || null;
  }

  getRole(name) {
    const option = this.get(name);
    return option?.role || null;
  }

  getChannel(name) {
    const option = this.get(name);
    return option?.channel || null;
  }

  getMentionable(name) {
    const option = this.get(name);
    return option?.member || option?.role || option?.user || null;
  }

  getSubcommand(required) {
    if (required) {
      throw new Error('Subcommands are not supported in dashboard executions.');
    }
    return null;
  }

  getSubcommandGroup(required) {
    if (required) {
      throw new Error('Subcommand groups are not supported in dashboard executions.');
    }
    return null;
  }

  get focused() {
    return null;
  }
}

function createDashboardInteraction({
  commandName,
  guild,
  bot,
  channel,
  user,
  member,
  preferredVisibility,
  optionsMap,
}) {
  const state = {
    replied: false,
    deferred: false,
    publicChannel: null,
    outputs: [],
  };

  const options = new DashboardInteractionOptions(optionsMap);

  const deliver = async (payload = {}) => {
    const clonedPayload = { ...payload };
    let targetEphemeral = typeof clonedPayload.ephemeral === 'boolean' ? clonedPayload.ephemeral : undefined;

    if (preferredVisibility === 'ephemeral' && typeof targetEphemeral === 'undefined') {
      targetEphemeral = true;
    } else if (preferredVisibility === 'public' && typeof targetEphemeral === 'undefined') {
      targetEphemeral = false;
    }

    if (targetEphemeral) {
      state.outputs.push(renderPayloadForSummary(clonedPayload));
      return { ephemeral: true };
    }

    const destination = channel || findDefaultTextChannel(guild);
    if (!destination) {
      state.outputs.push(renderPayloadForSummary(clonedPayload));
      return { fallback: true };
    }

    state.publicChannel = destination;

    const sendPayload = { ...clonedPayload };
    delete sendPayload.ephemeral;

    await destination.send(sendPayload);
    return { sent: true };
  };

  const interaction = {
    commandName,
    guild,
    channel: channel || findDefaultTextChannel(guild),
    user,
    member,
    client: bot,
    options,
    replied: state.replied,
    deferred: state.deferred,
    isChatInputCommand() {
      return true;
    },
    isContextMenuCommand() {
      return false;
    },
    isRepliable() {
      return true;
    },
    async reply(payload) {
      await deliver(payload);
      state.replied = true;
    },
    async followUp(payload) {
      await deliver(payload);
    },
    async deferReply() {
      state.deferred = true;
    },
    async editReply(payload) {
      await deliver(payload);
    },
    getSummary(commandLabel) {
      if (state.publicChannel) {
        return `Executed /${commandLabel} and posted responses in #${state.publicChannel.name}.`;
      }

      if (state.outputs.length) {
        const preview = state.outputs.slice(0, 3).join('\n- ');
        return `Executed /${commandLabel} with private output:\n- ${preview}`;
      }

      return `Executed /${commandLabel}.`;
    },
  };

  return interaction;
}

function renderPayloadForSummary(payload) {
  if (payload.content) {
    return payload.content;
  }

  if (Array.isArray(payload.embeds) && payload.embeds.length) {
    const embed = payload.embeds[0];
    const title = embed?.data?.title || embed?.title || 'Embed';
    return `[Embed] ${title}`;
  }

  return '[Command executed]';
}

function sanitizeCommandName(value) {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim().toLowerCase();
  if (!/^[a-z0-9_\-]{1,50}$/.test(trimmed)) {
    return undefined;
  }
  return trimmed;
}

function sanitizeArguments(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/\r/g, '').split(/\s+/).filter(Boolean).join(' ').slice(0, 400);
}

async function safeFetch(fn) {
  try {
    return await fn();
  } catch {
    return null;
  }
}
