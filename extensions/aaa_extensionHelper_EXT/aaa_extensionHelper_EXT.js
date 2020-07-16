/**
 * DBM Extension Helper
 * (put your name if you contrib)
 * Great Plains Modding, General Wrex
 * @class extensionHelper
 */

const extension = class Extension {
    constructor() {
        // This is the name of the editor extension displayed in the editor.
        this.name = "DBM Extension Helper",

        // these variables will be used by a custom installer (Optional, but nice to have)
        this.authors = ["Great Plains Moddng", "GeneralWrex"];
        this.version = "1.0.0";
        this.changeLog = [{
            v: "1.0.0",
            desc: "Initial Version"
        }];

        this.shortDescription = "Extension Helper";
        this.longDescription = "";
        this.requiredNodeModules = [""];
        // these variables will be used by a custom installer	  

        // Must be true to appear in "command" context menu.
        // This means each "command" will hold its own copy of this data.
        this.isCommandExtension = false;

        // Must be true to appear in "event" context menu.
        // This means each "event" will hold its own copy of this data.
        this.isEventExtension = false;

        // Must be true to appear in the main editor context menu.
        // This means there will only be one copy of this data per project.
        this.isEditorExtension = false;

        // These are the fields for the extension. These fields are customized
        // by creating elements with corresponding IDs in the HTML. These
        // are also the names of the fields stored in the command's/event's JSON data.
        this.fields = [""];

        // The default values of the fields.
        this.defaultFields = {};

    };

    /**
     * Extension Dialog Size
     *
     * @returns {*} The size of the extension dialog.
     */

    size () {
        return {
            width: 500,
            height: 550
        };
    };

    /**
     * Extension HTML
     * 
     * @param {*} data
     * @returns {string} A string containing the HTML used for the context menu dialog.
     */

    html (data) {
        return `
		`
    };

    /**
     * Extension Dialog Init Code
     * 
     * When the HTML is first applied to the extension dialog, this code
     * is also run. This helps add modifications or setup reactionary
     * functions for the DOM elements.
     */

    init (document, data) {

    };

    /**
     * Extension Dialog Close Code
     * 
     * When the dialog is closed, this is called. Use it to save the data.
     *
     * @param {*} document
     * @param {*} data
     */

    close (document, data) {

    };

    /**
     * Editor Extension Bot Mod
     *
     * Upon initialization of the bot, this code is run. Using the bots
     * DBM namespace, one can add/modify existing functions if necessary.
     * In order to reduce conflicts between mods, be sure to alias  //hover over the word
     * functions you wish to overwrite.
     * 
     * This is absolutely necessary for editor extensions since it
     * allows us to setup modifications for the necessary functions
     * we want to change.
     * 
     * The client object can be retrieved from: `const bot = DBM.Bot.bot;`
     * Classes can be retrieved also using it: `const { Actions, Event } = DBM;`
     * @param {*} DBM
     */

    mod (DBM) {
        const extensionHelper = {};

        extensionHelper.log = {};

        // Logging Shit
        extensionHelper.log.error = function (message) {
            console.log("\x1b[31m" + message, "\x1b[0m");
        };

        extensionHelper.log.success = function (message) {
            console.log("\x1b[32m" + message, "\x1b[0m");
        };

        extensionHelper.log.warn = function (message) {
            console.log("\x1b[33m" + message, "\x1b[0m");
        };

        // Auto module installer
        extensionHelper.requireModule = async function (packageName, projectName) {
            try {
                const nodeModulesPath = await require("path").join(__dirname, "aaa_extensionHelper_EXT", projectName, "node_modules", packageName);
                return await require(nodeModulesPath);
            } catch (e) {
                extensionHelper.log.warn("(aaa_extensionHelper_EXT Auto Module Installer) ~ Installing " + packageName);

                if (!require("fs").existsSync(require("path").join(__dirname, "aaa_extensionHelper_EXT"))) {
                    require("fs").mkdirSync(require("path").join(__dirname, "aaa_extensionHelper_EXT"));
                };

                if (!require("fs").existsSync(require("path").join(__dirname, "aaa_extensionHelper_EXT", projectName))) {
                    require("fs").mkdirSync(require("path").join(__dirname, "aaa_extensionHelper_EXT", projectName));
                };

                if (!require("fs").existsSync(require("path").join(__dirname, "aaa_extensionHelper_EXT", projectName, "node_modules"))) {
                    require("fs").mkdirSync(require("path").join(__dirname, "aaa_extensionHelper_EXT", projectName, "node_modules"));
                };

                let cliCommand = "npm install " + packageName + " --save";
                await require("child_process").execSync(cliCommand, {
                    cwd: require("path").join(__dirname, "aaa_extensionHelper_EXT", projectName),
                    stdio: [0, 1, 2]
                });

                const nodeModulesPath = require("path").join(__dirname, "aaa_extensionHelper_EXT", projectName, "node_modules", packageName);
                extensionHelper.log.success("(aaa_extensionHelper_EXT Auto Module Installer) ~ Successfully Installed " + packageName + ". Note you may need to restart your bot.");
                return require(nodeModulesPath);
            };
        };

        // Extension Auto Updater
        extensionHelper.autoUpdater = async function (data) {
            const fetch = await extensionHelper.requireModule('node-fetch', "aaa_extensionHelper_EXT");
            let depInfo = await fetch(data.depInfo).then(res => res.json());
            let depFile = await fetch(data.depFile).then(res => res.text());
            if (data.version === depInfo.version) {
                extensionHelper.log.success(`${depInfo.name} is up to date!`);
                return false
            } else {
                extensionHelper.log.warn(`${depInfo.name} is out of date. (aaa_extensionHelper_EXT Auto Updater) ~ Updating ${depInfo.name}`);
                const filePath = require("path").join(__dirname, depInfo.file);
                require("fs").writeFileSync(filePath, depFile);
                extensionHelper.log.success(`Successfully updated ${depInfo.name}, please restart the bot.`);
                return true;
            };
        };

        // Auto Updater v2
        // extensionHelper.autoUpdater = async function (data) {
        //     const fetch = await extensionHelper.requireModule('node-fetch', "aaa_extensionHelper_EXT");
        // };

        // Auto updates this extension
        extensionHelper.autoUpdater({
            depInfo: "https://gist.githubusercontent.com/greatplainsmodding/cbcaf9da3a4ddb08bc06fad3f1f32aaf/raw/aaa_greatPlainsModdingDeps_EXT.json",
            depFile: "https://gist.githubusercontent.com/greatplainsmodding/cbcaf9da3a4ddb08bc06fad3f1f32aaf/raw/aaa_greatPlainsModdingDeps_EXT.js",
            version: "1.0.4"
        });

        // Export extensionHelper to be used in DBM.extensionHelper
        DBM.extensionHelper = extensionHelper;
    };

};


module.exports = new extension;