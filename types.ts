/******************************************************
 * Discord Bot Maker Data Types
 ******************************************************/

import type { Bot, Actions, ActionsCache } from './bot';

//---------------------------------------------------------------------
// * Editor Types
// The types for the JSON data loaded from the Discord Bot Maker editor.
//---------------------------------------------------------------------

export type EditorData = {
  commands: Command[];
  events: Event[];
  settings: Settings;
};

export type SaveData = {
  serverVars: Record<string, any>;
  globalVars: Record<string, any>;
  players: Record<string, any>;
  servers: Record<string, any>;
  messages: Record<string, any>;
};

export type Command = {
  _id: string;

  name: string;
  comType: string;

  description: string;
  restriction: string;

  requiredPermissions: string[];
  permissions: string; // deprecated
  permissions2: string; // deprecated
  defer: CommandDeferType;

  actions: Action[];

  _aliases?: string[];
  _timeRestriction?: number;
};

export type Event = {
  name: string;
  _id: string;
  'event-type': string;
  temp?: string;
  temp2?: string;
  actions: Action[];
};

export type Action = {
  name: string;
};

export type Settings = {
  // Bot Settings
  ownerId: string;
  token: string;

  // Bot Settings 2
  invalidButtonText: string;
  invalidSelectText: string;
  invalidUserText: string;

  autoDeafen: StringBoolean;
  mutableVolume: StringBoolean;

  // Slash Command Options
  slashType: SlashCommandInitializationType;
  slashServers: string;
  ignoreCommandScopeErrors: boolean;
  clearUnlistedServers: boolean;

  autoResponseText: string;
  noDescriptionText: string;
  invalidPermissionsText: string;
  invalidCooldownText: string;

  // Text Command Options
  tag: string;
  separator: string;
  case: StringBoolean;
  allowPrefixSpace: StringBoolean;
};

export enum StringBoolean {
  True = 'true',
  False = 'false',
}

export enum CommandDeferType {
  Manual = 'manual',
  PublicDefer = 'defer',
  EphemeralDefer = 'ephemeral',
}

export enum SlashCommandInitializationType {
  Global = '2_global',
  Limited = '2_limited',
}

//---------------------------------------------------------------------
// * Common Data Structure Types
// Data structure types for the editor types.
//---------------------------------------------------------------------

export type CommandList = Command[];
export type CommandMap = Record<string, Command>;

export type ActionList = Action[];
export type ActionMap = Record<string, Action>;

//---------------------------------------------------------------------
// * `ActionMod` type
// The type of objects exported from "action" modules.
//---------------------------------------------------------------------

export type ActionMod = {
  //---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  //---------------------------------------------------------------------

  name: string;

  //---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  //---------------------------------------------------------------------

  section: string;

  //---------------------------------------------------------------------
  // Requires Audio Libraries (optional)
  //
  // If 'true', this action requires audio libraries to run.
  //---------------------------------------------------------------------

  requiresAudioLibraries?: true;

  //---------------------------------------------------------------------
  // Command Only (optional)
  //
  // If this is 'true', then this will only be available for commands.
  //---------------------------------------------------------------------

  commandOnly?: boolean;

  //---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  //---------------------------------------------------------------------

  subtitle: (data: any, presets: any) => string;

  //---------------------------------------------------------------------
  // Action Meta Data
  //
  // Helps check for updates and provides info if a custom mod.
  // If this is a third-party mod, please set "author" and "authorUrl".
  //
  // It's highly recommended "preciseCheck" is set to false for third-party mods.
  // This will make it so the patch version (0.0.X) is not checked.
  //---------------------------------------------------------------------

  meta: {
    version: string;
    preciseCheck: boolean;
    author: string | null;
    authorUrl: string | null;
    downloadUrl: string | null;
  };

  //---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  //---------------------------------------------------------------------

  fields: string[];

  //---------------------------------------------------------------------
  // Command HTML
  //
  // This function returns a string containing the HTML used for
  // editing actions.
  //
  // The "isEvent" parameter will be true if this action is being used
  // for an event. Due to their nature, events lack certain information,
  // so edit the HTML to reflect this.
  //---------------------------------------------------------------------

  html: (isEvent: boolean, data: any) => string;

  //---------------------------------------------------------------------
  // Action Editor Pre-Init Code (optional)
  //
  // Before the fields from existing data in this action are applied
  // to the user interface, this function is called if it exists.
  // The existing data is provided, and a modified version can be
  // returned. The returned version will be used if provided.
  // This is to help provide compatibility with older versions of the action.
  //
  // The "formatters" argument contains built-in functions for formatting
  // the data required for official DBM action compatibility.
  //---------------------------------------------------------------------

  preInit?: (data: any, formatters: any) => void;

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //
  // When the HTML is first applied to the action editor, this code
  // is also run. This helps add modifications or setup reactionary
  // functions for the DOM elements.
  //---------------------------------------------------------------------

  init: () => void;

  //---------------------------------------------------------------------
  // Action Bot Function
  //
  // This is the function for the action within the Bot's Action class.
  // Keep in mind event calls won't have access to the "msg" parameter,
  // so be sure to provide checks for variable existence.
  //---------------------------------------------------------------------

  action: (this: typeof Actions, cache: ActionsCache) => void | Promise<void>;

  //---------------------------------------------------------------------
  // Action Bot Mod Init (optional)
  //
  // An optional function for action mods. Upon the bot's initialization,
  // each command/event's actions are iterated through. This is to
  // initialize responses to interactions created within actions
  // (e.g. buttons and select menus for Send Message).
  //
  // If an action provides inputs for more actions within, be sure
  // to call the `this.prepareActions` function to ensure all actions are
  // recursively iterated through.
  //---------------------------------------------------------------------

  modInit?: (this: typeof Bot, data: any) => void;

  //---------------------------------------------------------------------
  // Action Bot Mod
  //
  // Upon initialization of the bot, this code is run. Using the bot's
  // DBM namespace, one can add/modify existing functions if necessary.
  // In order to reduce conflicts between mods, be sure to alias
  // functions you wish to overwrite.
  //---------------------------------------------------------------------
  mod: () => void;
};
