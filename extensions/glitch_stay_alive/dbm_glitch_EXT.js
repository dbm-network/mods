module.exports = {

    /*
        - Author: Great Plains Modding
        - Version: 1.0.0
        - GitHub: https://github.com/greatplainsmodding
        - Description: Contains multiple stuff needed for my mods / extensions / events.
    */

    authors: ["Great Plains Modding"],
    version: "1.0.0",
    changeLog: "Initial Release",
    shortDescription: "Allows you to use glitch without having to overwrite your bot.js file.",
    longDescription: "",
    requiredNodeModules: ["express"],

    //---------------------------------------------------------------------
    // Editor Extension Name
    //
    // This is the name of the editor extension displayed in the editor.
    //---------------------------------------------------------------------

    name: "Glitch Stay Alive",

    //---------------------------------------------------------------------
    // Is Command Extension
    //
    // Must be true to appear in "command" context menu.
    // This means each "command" will hold its own copy of this data.
    //---------------------------------------------------------------------

    isCommandExtension: false,

    //---------------------------------------------------------------------
    // Is Event Extension
    //
    // Must be true to appear in "event" context menu.
    // This means each "event" will hold its own copy of this data.
    //---------------------------------------------------------------------

    isEventExtension: false,

    //---------------------------------------------------------------------
    // Is Editor Extension
    //
    // Must be true to appear in the main editor context menu.
    // This means there will only be one copy of this data per project.
    //---------------------------------------------------------------------

    isEditorExtension: true,

    //---------------------------------------------------------------------
    // Extension Fields
    //
    // These are the fields for the extension. These fields are customized
    // by creating elements with corresponding IDs in the HTML. These
    // are also the names of the fields stored in the command's/event's JSON data.
    //---------------------------------------------------------------------

    fields: ["port"],

    //---------------------------------------------------------------------
    // Default Fields
    //
    // The default values of the fields.
    //---------------------------------------------------------------------

    defaultFields: {
        "port": 8080
    },

    //---------------------------------------------------------------------
    // Extension Dialog Size
    //
    // Returns the size of the extension dialog.
    //---------------------------------------------------------------------

    size: function () {
        return {
            width: 500,
            height: 500
        };
    },

    //---------------------------------------------------------------------
    // Extension HTML
    //
    // This function returns a string containing the HTML used for
    // the context menu dialog.
    //---------------------------------------------------------------------

    html: function (data) {
        try {
            return `
            <div class="ui cards" style="margin: 0; padding: 0; width: 100%;">
                <div class="card" style="margin: 0; padding: 0; width: 100%; background-color: #36393e; color: #e3e5e8;">
                    <div class="content" style="padding-top:15px;">
                        <img class="right floated ui image" src="https://avatars1.githubusercontent.com/u/46289624" style="height: 100px;">
                        <div class="header" style="background-color: #36393e; color: #e3e5e8; font-size: 28px;">
                            <u>Glitch Stay Alive</u>
                    </div>
                    <div class="meta" style="background-color: #36393e; color: #e3e5e8; font-size: 14px; width: 100%;">
                        <li>Created By: <a onclick="require('child_process').execSync('start https://github.com/greatplainsmodding')"> Great Plains Modding</a></li>
                        <li>DBM Network: <a onclick="require('child_process').execSync('start https://discord.gg/3QxkZPK')"> Join Server</a></li>
                        <li>Extension Version: 1.0.0</li>
                    </div>
                    <div class="description" style="background-color: #36393e; color: #e3e5e8">
                        <hr>
                        <div class="field" style="width: 100%">
                            <label style="font-size: 14px;">Express Server Port:</label>
                            <div class="field" style="width: 100%">
                                <input type="text" class="round" id="port" value="${data.port}" style="width: 100%">
                            </div>
                        </div><br>
                        <p style="font-size: 14px;">Keep your awesome Discord bot alive when hosting on <a onclick="require('child_process').execSync('start https://glitch.com')">Glitch</a>. All you need to do is toggle this extension, start your bot, and configure <a onclick="require('child_process').execSync('start https://uptimerobot.com')">Uptime Robot</a>.</p>
                    </div>
                </div>
            </div>
            `
        } catch (error) {
            return error
        }
    },

    //---------------------------------------------------------------------
    // Extension Dialog Init Code
    //
    // When the HTML is first applied to the extension dialog, this code
    // is also run. This helps add modifications or setup reactionary
    // functions for the DOM elements.
    //---------------------------------------------------------------------

    init: function () {

    },

    //---------------------------------------------------------------------
    // Extension Dialog Close Code
    //
    // When the dialog is closed, this is called. Use it to save the data.
    //---------------------------------------------------------------------

    close: function (document, data) {
        data.port = document.getElementById("port").value;
    },

    //---------------------------------------------------------------------
    // Extension On Load
    //
    // If an extension has a function for "load", it will be called
    // whenever the editor loads data.
    //
    // The "DBM" parameter is the global variable. Store loaded data within it.
    //---------------------------------------------------------------------

    load: function (DBM, projectLoc) {},

    //---------------------------------------------------------------------
    // Extension On Save
    //
    // If an extension has a function for "save", it will be called
    // whenever the editor saves data.
    //
    // The "data" parameter contains all data. Use this to modify
    // the data that is saved. The properties correspond to the
    // data file names:
    //
    //  - data.commands
    //  - data.settings
    // etc...
    //---------------------------------------------------------------------

    save: function (DBM, data, projectLoc) {},

    //---------------------------------------------------------------------
    // Editor Extension Bot Mod
    //
    // Upon initialization of the bot, this code is run. Using the bot's
    // DBM namespace, one can add/modify existing functions if necessary.
    // In order to reduce conflictions between mods, be sure to alias
    // functions you wish to overwrite.
    //
    // This is absolutely necessary for editor extensions since it
    // allows us to setup modifications for the necessary functions
    // we want to change.
    //
    // The client object can be retrieved from: `const bot = DBM.Bot.bot;`
    // Classes can be retrieved also using it: `const { Actions, Event } = DBM;`
    //---------------------------------------------------------------------

    mod: function (DBM) {
        const WrexMODS = DBM.Actions.getWrexMods();
        const express = WrexMODS.require('express');
        const settings = require("../data/settings.json");
        let app = express();

        try {
            app.get("/", function (req, res) {
                res.send();
            });

            app.listen(settings["Glitch Stay Alive"].customData["Glitch Stay Alive"].port);
        } catch (error) {

        }
    }

}; // End of module