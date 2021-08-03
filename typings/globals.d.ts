import * as DiscordJS from 'discord.js';
import * as JIMP from 'jimp';
import * as crypto from 'crypto';
import * as ytdl from 'ytdl-core';

declare interface ActionCache {
  // Properties
  actions: any[];
  index: number;
  temp: Record<string, unknown>;
  server: DBM_GUILD;
  msg: DBM_MESSAGE;
}

// #region Command/Event Structures
declare interface CommandStructure {
  // Properties
  _aliases: string[];
  _id: string;
  name: string;
  permissions: 'NONE' | '??';
  restriction: '1' | '2' | '3';
  actions: unknown[];
}

declare interface EventStructure {
  // Properties
  name: string;
  temp: string;
  ['event-type']: string;
  _id: string;
  actions: Array<Action>;
}
// #endregion Command/Event Structures

declare interface Bot {
  // Properties
  $cmds: Array<CommandStructure>;
  $icds: [];
  $regx: [];
  $anym: [];
  $evts: Array<EventStructure>;
  bot: DiscordJS.Client;

  // methods
  /**
   * Preforms some basic initialization.
   */
  private init(): void;
  /**
   * Creates a new Discord Client and saves it to `DBM.Bot.bot`
   */
  initBot(): void;
  intents(): number;
  setupBot(): void;
  onRawData(packet: any): void;
  reformatData(): void;
  reformatCommands(): void;
  reformatEvents(): void;
  initEvents(): void;
  login(): void;
  onReady(): void;
  restoreVariables(): void;
  preformInitialization(): void;
  onMessage(msg: DiscordJS.Message): void;
  checkCommand(msg: DiscordJS.Message): boolean;
  checkTag(content: string): any;
  onAnyMessage(msg: DiscordJS.Message): void;
  checkIncludes(msg: DiscordJS.Message): void;
  checkRegExps(msg: DiscordJS.Message): void;
}

declare interface Actions {
  // properties
  actionsLocation: string;
  eventsLocation: string;
  extensionsLocation: string;
  server: Record<string, DiscordJS.Guild>;
  global: Record<string, unknown>;
  timeStamps: Array;

  // Methods
  /**
   * Checks if the action method exits in the file.
   * @param action actions function.
   * @returns if the action is a function.
   */
  exists(action: any): boolean;
  /**
   * Gets the path to the local file in the projects folder.
   * @param url path.
   * @returns the path to a file in the project.
   */
  getLocalFile(url: string): string;
  /**
   * Gets the DBM object in case you ever wanted access to stuff outside of the Actions object.
   * @returns DBM object
   */
  getDBM(): DBM;
  /**
   * Change cache index to location of anchor
   * @param id Unique identifier of an anchor
   * @param cache DBM cache object
   */
  anchorJump(id: any, cache: ActionCache): void;
  /**
   * Checks if an anchor exists
   * @param id Unique identifier of an anchor
   * @param cache DBM cache object
   * @returns If anchor exists
   */
  anchorExist(id: any, cache: ActionCache): boolean;
  callListFunc(list: Array, funcName: unknown, args: Array): Promise<any>;
  /**
   * Gets value from actions object
   * @param name Property key
   * @param defaultValue Default return value
   * @returns Value in actions object
   */
  getActionVariable(name: string, defaultValue: any): unknown;
  /**
   * Evaluate javascript in scope of important DBM variables
   * @param content Javascript code
   * @param cache DBM cache object
   * @returns Result of evaluation
   */
  eval(content: string, cache: ActionCache): any;
  /**
   * Replace DBM variable functions with actual value
   * @param content Content to evaluate for DBM variables
   * @param cache DBM cache object
   * @returns Content with DBM variables replaced with their values
   */
  evalMessage(content: string, cache: ActionCache): string;
  /**
   * Initialize mods and add them to actions object
   */
  initMods(): void;
  /**
   * Get mod directories
   * @returns Array containing mod directories
   */
  modDirectories(): Array<eventsLocation | extensionsLocation | actionsLocation>;
  /**
   * Checks and ivokes an action sequence
   * @param msg Message that invoked action sequence
   * @param cmd DBM command object
   */
  preformActions(msg: DiscordJS.Message, cmd: CommandStructure): void;
  /**
   * Checks if command has time restriction
   * @param msg Message that invoked action sequence
   * @param cmd DBM command object
   * @returns User has time restriction
   */
  checkTimeRestriction(msg: DiscordJS.Message, cmd: CommandStructure): boolean;
  /**
   * Generate string formatted into days, hours, minutes, seconds
   * @param milliSeconds Milliseconds until desired time
   * @returns String formatted into days, hours, minutes, seconds remaining
   */
  generateTimeString(milliSeconds: number): string;
  /**
   * Check if member has valid permission
   * @param msg Message that invoked action sequence
   * @param permissions Permission level of DBM command object
   * @returns Member has permissions
   */
  checkPermissions(msg: DiscordJS.Message, permissions: string): any;
  /**
   * Create cache and begin command action sequence
   * @param msg Message that invoked action sequence
   * @param actions Actions array in DBM command object
   */
  invokeActions(msg: DiscordJS.Message, actions: Array<Action>): void;
  /**
   * Create cache and begin event action sequence
   * @param event DBM event object
   * @param server Server to execute event on
   * @param temp DBM event parameters
   */
  invokeEvent(event: EventStructure, server: DiscordJS.Guild, temp: unknown): void;
  /**
   * Invoke the next action in the sequence
   * @param cache DBM cache object
   */
  callNextAction(cache: ActionCache): void;
  /**
   * Get string containing error information
   * @param data Current action raw data
   * @param cache DBM cache object
   * @returns String containing error info including location in action sequence
   */
  getErrorString(data: CommandStructure | EventStructure, cache: ActionCache): string;
  /**
   * Log error string to console
   * @param data Current action raw data
   * @param cache DBM cache object
   * @param err Error message
   */
  displayError(data: CommandStructure | EventStructure, cache: ActionCache, err: string | Error): void;
  /**
   * Get location to send message
   * @param type Channel type from data.sendTargets
   * @param varName Name of channel variable
   * @param cache DBM cache object
   * @returns Location to send message
   */
  getSendTarget(type: number, varName: string, cache: ActionCache): any;
  /**
   * Get member variable
   * @param type Member type from data.members
   * @param varName Name of member variable
   * @param cache DBM cache object
   * @returns User or member object
   */
  getMember(type: number, varName: string, cache: ActionCache): DBM_GUILD_MEMBER | DBM_USER;
  /**
   * Get message variable
   * @param type Message type from data.messages
   * @param varName Name of message variable
   * @param cache DBM cache object
   * @returns Message object
   */
  getMessage(type: number, varName: string, cache: ActionCache): DBM_MESSAGE;
  /**
   * Get mods object from mod dependencies file
   */
  getMods(): Mods;
  /**
   * Get server variable
   * @param type Server type from data.servers
   * @param varName Name of server variable
   * @param cache DBM cache object
   * @returns Guild object
   */
  getServer(type: number, varName: string, cache: ActionCache): DBM_GUILD;
  /**
   * Get role variable
   * @param type Role type from data.roles
   * @param varName Name of role variable
   * @param cache DBM cache object
   * @returns Role object
   */
  getRole(type: number, varName: string, cache: ActionCache): DBM_ROLE;
  /**
   * Get channel variable
   * @param type Channel type from data.channels
   * @param varName Name of channel variable
   * @param cache DBM cache object
   * @returns Channel object
   */
  getChannel(type: number, varName: string, cache: ActionCache): DBM_TEXTCHANNEL;
  /**
   * Get voice channel variable
   * @param type Channel type from data.voiceChannels
   * @param varName Name of voice channel variable
   * @param cache DBM cache object
   * @returns Voice channel object
   */
  getVoiceChannel(type: number, varName: string, cache: ActionCache): DBM_VOICECHANNEL;
  /**
   * Get list variable
   * @param type List type from data.lists
   * @param varName Name of list variable
   * @param cache DBM cache object
   * @returns List variable
   */
  getList(type: number, varName: string, cache: ActionCache): Array;
  /**
   * Get DBM variable
   * @param type Variable type from data.variables
   * @param varName Name of variable
   * @param cache DBM cache object
   * @returns DBM variable value
   */
  getVariable(type: number, varName: string, cache: ActionCache): any;
  /**
   * Store value to DBM variable
   * @param value Value to store to DBM variable
   * @param type Type of variable (1:temp, 2:server, 3:global)
   * @param varName DBM variable name
   * @param cache DBM cache object
   */
  storeValue(value: any, type: number, varName: string, cache: ActionCache): void;
  /**
   * Control action sequence based on execution results
   * @param result Whether the action executed properly
   * @param data Current action raw data
   * @param cache DBM cache object
   */
  executeResults(result: any, data: any, cache: ActionCache): void;
  /**
   * Get value of property on object if it exsts
   * @param obj Object to get values of
   * @param props Properties to search for in object
   * @returns Value of property
   */
  dest(obj: unknown, ...props: Array<any>): any;
}

declare interface Events {
  // Properties
  data: Array;

  // Methods
  registerEvents(bot: DiscordJS.Client): void;
  callEvents(id, temp1, temp2, server, mustServe, condition, arg1, arg2);
  getObject(id, arg1, arg2);
  onInitialization(bot: DiscordJS.Client);
  setupIntervals(bot: DiscordJS.Client);
  onReaction(id, reaction, user);
  onTyping(id, channel, user);
  onError(text, text2, cache);
}

declare interface Images {
  getImage(url: string): Promise<JIMP>;
  getFont(url: string): Promise<Font>;
  createBuffer(image): Promise;
  drawImageOnImage(img1, img2, x: number, y: number): void;
}

declare interface Files {
  // Properties
  data: {
    globals: Record<string, unknown>;
    commands: Record<string, unknown>;
    events: Record<string, unknown>;
    settings: {
      token: string;
      client: string;
      tag: string;
      case: string;
      separator: string;
      ownerId: string;
      modules: Record<string, string[]>;
    };
    players: Record<string, unknown>;
    servers: Record<string, unknown>;
    serverVars: Record<string, unknown>;
    globalVars: Record<string, unknown>;
  };
  writers: unknown;
  crypto: crypto;
  dataFiles: Array<string>;

  // Methods
  startBot(): void;
  verifyDirectory(dir: string): boolean;
  readData(callback: any): void;
  saveData(file: string, callback: any): void;
  initEncryption(): void;
  encrypt(text: string): any;
  decrypt(text: string): any;
  convertItem(item: any): any;
  saveServerVariable(serverID: DiscordJS.Snowflake, varName, item): void;
  restoreServerVariables(): void;
  saveGlobalVariable(varName, item): void;
  restoreGlobalVariables(): void;
  restoreVariable(value: any, type, varName, serverId?: DiscordJS.Snowflake): void;
  restoreValue(value: any, bot: DiscordJS.Client);
  restoreMember(value: any, bot: DiscordJS.Client): DiscordJS.GuildMember;
  restoreMessage(value: any, bot: DiscordJS.Client): DiscordJS.Message;
  restoreTextChannel(value: any, bot: DiscordJS.Client): DiscordJS.Channel;
  restoreVoiceChannel(value: any, bot: DiscordJS.Client): DiscordJS.VoiceChannel;
  restoreRole(value: any, bot: DiscordJS.Client): DiscordJS.Role;
  restoreServer(value: any, bot: DiscordJS.Client): DiscordJS.Guild;
  restoreEmoji(value: any, bot: DiscordJS.Client): DiscordJS.Emoji;
  restoreUser(value: any, bot: DiscordJS.Client): DiscordJS.User;
}

declare interface Audio {
  // Properties
  ytdl: ytdl;
  queue: Array;
  volumes: Array;
  connections: Array;
  dispatchers: Array;

  // Methods
  isConnected(cache);
  isPlaying(cache);
  setVolume(volume, cache);
  connectToVoice(voiceChannel: DiscordJS.VoiceChannel);
  addToQueue(item, cache);
  clearQueue(cache);
  playNext(id, forceSkip: boolean);
  playItem(item, id);
  playFile(url: string, options, id);
  playUrl(url: string, options, id);
  playYt(url: string, options, id);
}

declare interface DBM {
  // Properties
  version: string;
  DiscordJS: DiscordJS;
  Bot: Bot;
  Actions: Actions;
  Events: Events;
  Images: Images;
  Files: Files;
  Audio: Audio;
  Mods: Mods;
  Globals: Globals;
}

declare interface Mods {
  // Methods
  installModule(name);
  require(name);
  checkURL(url);
  getEmoji(type, varName, cache);
  getReaction(type, varName, cache);
  getWebhook(type, varName, cache);
  setupMusic(DBM);
}
declare interface Globals {
  // Methods
  data(name, defaultValue?);
  setData(name, value);
  addData(name, value);
}

declare interface DBM_GUILD_MEMBER extends DiscordJS.GuildMember {
  // Methods
  unban(server: DiscordJS.Guild, reason: string);
  data(name, defaultValue?);
  setData(name, value);
  addData(name, value);
  convertToString(): string;
}

declare interface DBM_USER extends DiscordJS.User {
  // Methods
  data(name, defaultValue?);
  setData(name, value);
  addData(name, value);
  convertToString(): string;
}

declare interface DBM_GUILD extends DiscordJS.Guild {
  // Properties
  tag?: string; // Outdated support for Server Prefix

  // Methods
  getDefaultChannel(): DiscordJS.GuildChannel;
  data(name, defaultValue?);
  setData(name, value);
  addData(name, value);
  convertToString(): string;
}

declare interface DBM_MESSAGE extends DiscordJS.Message {
  // Methods
  convertToString(): string;
}

declare interface DBM_TEXTCHANNEL extends DiscordJS.TextChannel {
  // Methods
  overwritePerms(memberOrRole, permissions, reason);
  convertToString(): string;
}

declare interface DBM_VOICECHANNEL extends DiscordJS.VoiceChannel {
  // Methods
  overwritePerms(memberOrRole, permissions, reason);
  convertToString(): string;
}

declare interface DBM_CATEGORYCHANNEL extends DiscordJS.CategoryChannel {
  // Methods
  overwritePerms(memberOrRole, permissions, reason);
}

declare interface DBM_NEWSCHANNEL extends DiscordJS.NewsChannel {
  // Methods
  overwritePerms(memberOrRole, permissions, reason);
}

declare interface DBM_STORECHANNEL extends DiscordJS.StoreChannel {
  // Methods
  overwritePerms(memberOrRole, permissions, reason);
}

declare interface DBM_ROLE extends DiscordJS.Role {
  // Methods
  convertToString(): string;
}

declare interface DBM_GUILDEMOJI extends DiscordJS.GuildEmoji {
  // Methods
  convertToString(): string;
}

declare interface Action<Fields extends string = string> {
  // Properties
  displayName?: string;
  name: string;
  section: string;
  fields: Fields[];

  // Methods
  subtitle(data: Record<Fields, string>): string;
  html(isEvent?: any, data?): string;
  init(): void;
  action(this: Actions, cache: ActionCache): void;
  variableStorage?(data: Record<Fields, string>, varType: number): Array;
  mod(DBM: DBM): void;
}
