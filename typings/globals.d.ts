import * as DiscordJS from 'discord.js';
import * as JIMP from 'jimp';
import * as crypto from 'crypto';
import * as ytdl from 'ytdl-core';

declare interface ActionCache {
  actions: Record<string, any>;
  index: number;
  temp: Record<string, unknown>;
  server: DiscordJS.Guild;
  msg: DiscordJS.Message;
}

// #region Command/Event Structures
declare interface CommandStructure {
  name: string;
  permissions: string;
  restriction: string;
  _id: string;
  actions: Array<Action>;
}

declare interface EventStructure {
  name: string;
  temp: string;
  ['event-type']: string;
  _id: string;
  actions: Array<Action>;
}
// #endregion Command/Event Structures

declare interface Bot {
  // Properties
  $cmds: CommandStructure;
  $icds: [];
  $regx: [];
  $anym: [];
  $evts: EventStructure;
  bot: DiscordJS.Client;

  // methods
  /**
   * Preforms some basic initialization.
   */
  init(): void;
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
  server: DiscordJS.Guild;
  global: unknown;
  timeStamps: Array;
  glob: any;
  document: any;

  // Methods
  exists(action: Action): boolean;
  getLocalFile(url: string): string;
  getDBM(): DBM;
  getMods(): Mods;
  anchorJump(id: any, cache: ActionCache): void;
  anchorExist(id: any, cache: ActionCache): boolean;
  callListFunc(list: Array, funcName: unknown, args: Array): Promise<any>;
  getActionVariable(name: string, defaultValue: any): unknown;
  eval(content: string, cache: ActionCache): any;
  evalMessage(content: string, cache: ActionCache): any;
  initMods(): void;
  modDirectories(): Array<eventsLocation | extensionsLocation | actionsLocation>;
  preformActions(msg: DiscordJS.Message, cmd: CommandStructure): any;
  checkTimeRestriction(msg: DiscordJS.Message, cmd: CommandStructure): boolean;
  generateTimeString(miliSeconds: number): string;
  checkPermissions(msg: DiscordJS.Message, permissions: string): any;
  invokeActions(msg: DiscordJS.Message, actions: Array<Action>): void;
  invokeEvent(event: EventStructure, server: DiscordJS.Guild, temp: unknown): void;
  callNextAction(cache: ActionCache): void;
  getErrorString(data: CommandStructure | EventStructure, cache: ActionCache): string;
  displayError(data: CommandStructure | EventStructure, cache: ActionCache, err: string | Error);
  getSendTarget(type: number, varName: string, cache: ActionCache);
  getNumber(type: number, varName: string, cache: ActionCache);
  getMessage(type: number, varName: string, cache: ActionCache);
  getServer(type: number, varName: string, cache: ActionCache);
  getRole(type: number, varName: string, cache: ActionCache);
  getChannel(type: number, varName: string, cache: ActionCache);
  getVoiceChannel(type: number, varName: string, cache: ActionCache);
  getList(type: number, varName: string, cache: ActionCache);
  getVariable(type: number, varName: string, cache: ActionCache);
  storeValue(value: any, type: number, varName: string, cache: ActionCache);
  executeResults(result: any, data: any, cache: ActionCache);
  dest(obj: unknown, ...props: Array<any>);
}

declare interface Events {
  data: Array;
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
  getFont(url: stirng): Promise<Font>;
  createBuffer(image): Promise;
  drawImageOnImage(img1, img2, x: number, y: number): void;
}

declare interface Files {
  data: unknown;
  writers: unknown;
  crypto: crypto;
  dataFiles: Array<string>;
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
  ytdl: ytdl;
  queue: Array;
  volumes: Array;
  connections: Array;
  dispatchers: Array;

  isConnected(cahce);
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
  version: string;
  DiscordJS: DiscordJS;
  Bot: Bot;
  Actions: Actions;
  Events: Events;
  Images: Images;
  Files: Files;
  Audio: Audio;
}

declare interface Mods {
  DBM: DBM | null;
  installModule(moduleName: string): Promise<any>;
  require(moduleName: string): any;
  checkURL(url: string): boolean;
  jsonPath(obj: any, expr: string, arg: any): string | undefined;
  getWebhook(type: number, varName: string, cache: ActionCache): any;
  getReaction(type: number, varName: string, cache: ActionCache): any;
  getEmoji(type: number, varName: string, cache: ActionCache): any;
  setupMusic(DBM: DBM): void;
}

declare interface DBM_GUILD_MEMBER extends DiscordJS.GuildMember {
  unban(server: DiscordJS.Guild, reason: string);
  data(name, defaultValue);
  setData(name, value);
  addData(name, value);
  convertToString(): string;
}

declare interface DBM_USER extends DiscordJS.User {
  data(name, defaultValue);
  setData(name, value);
  addData(name, value);
  convertToString(): string;
}

declare interface DBM_GUILD extends DiscordJS.Guild {
  getDefaultChannel(): DiscordJS.GuildChannel;
  data(name, defaultValue);
  setData(name, value);
  addData(name, value);
  convertToString(): string;
}

declare interface DBM_MESSAGE extends DiscordJS.Message {
  convertToString(): string;
}

declare interface DBM_TEXTCHANNEL extends DiscordJS.TextChannel {
  overwritePerms(memberOrRole, permissions, reason);
  convertToString(): string;
}

declare interface DBM_VOICECHANNEL extends DiscordJS.VoiceChannel {
  overwritePerms(memberOrRole, permissions, reason);
  convertToString(): string;
}

declare interface DBM_CATEGORYCHANNEL extends DiscordJS.CategoryChannel {
  overwritePerms(memberOrRole, permissions, reason);
}

declare interface DBM_NEWSCHANNEL extends DiscordJS.NewsChannel {
  overwritePerms(memberOrRole, permissions, reason);
}

declare interface DBM_STORECHANNEL extends DiscordJS.StoreChannel {
  overwritePerms(memberOrRole, permissions, reason);
}

declare interface DBM_ROLE extends DiscordJS.Role {
  convertToString(): string;
}

declare interface DBM_GUILDEMOJI extends DiscordJS.GuildEmoji {
  convertToString(): string;
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
declare class Action {
  static name: string;
  static section: string;
  static fields: Array<string>;
  static subtitle(data: any): string;
  static html(isEvent?: any, data?): string;
  static init(this: Actions): void;
  static action(this: Actions, cache: ActionCache): void;
  static mod(DBM?: DBM): void;
}
