module.exports = {
    name: "Server Prefixes",
    
    isCommandExtension: false,
    isEventExtension: false,
    isEditorExtension: true,

    fields: ["debug"],

    defaultFields: {
        debug: 0
    },

    size() {
        return { width: 500, height: 190};
    },

    html(data) {
        return `
		<div style="float: left; width: 99%; margin-left: auto; margin-right: auto; padding:10px; text-align: center;">
			<h2>Server Prefixes</h2><hr>
			<p>
				Created by <b>Mindlesscargo</b><br>
				Requires <b><a href="#" onclick="require('child_process').execSync('start https://www.github.com')">control server prefix</a></b>
            </p>
            <p>
                <label for="debug">Debug Mode:</label>
                <select id="debug" name="debug"><br>
                    <option label="Disabled" value=0 ${parseInt(data.debug) === 0 ? "selected=true" : ""}>
                    <option label="Enabled" value=1 ${parseInt(data.debug) === 1 ? "selected=true" : ""}>
                </select>
            </p>
		</div>`
    },

    init(document, data) {}, 

    close: function(document, data) {
        data.debug = document.getElementById('debug').value;
    },

    load(DBM, projectLoc) {},

    save(DBM, data, projectLoc) {
    },

    mod(DBM) {
        const fs = require("fs");
        const path = require("path");
        const { Bot, Files, Actions } = DBM;
        const settingsPath = path.join("./", "data", "serverSettings.json");

        const loadPrefixes = function(debug) {
            const client = Bot.bot;
            if (fs.existsSync(settingsPath)) {
                console.log("Loading server prefixes...");
               fs.readFile(settingsPath, function(err, data) {
                   if (err) {
                       console.log(err);
                       return;
                   }
                    data = JSON.parse(data);
                    const servers = Object.keys(data);
                    for (let server of servers) {
                        server = client.guilds.cache.get(server);
                        server.prefix = data[server.id];
                        if (parseInt(debug)) {
                            console.log(`Loaded server ${server.id} with prefix ${server.prefix}`);
                        }
                    }
                    console.log("Server prefixes loaded")
               })
            } else {
                console.log("Creating server settings file")
                fs.writeFile(settingsPath, JSON.stringify({}), (err) => {
                    if (err) console.error(err);
                });
            }
        }

        Bot.checkTag = function(msg) {
            const tag = msg.guild.prefix || Files.data.settings.tag;
            const separator = Files.data.settings.separator || "\\s+";
            const content = msg.content.split(new RegExp(separator))[0];
            if(content.startsWith(tag)) {
                return content.substring(tag.length);
            }
            return null;
        }

        Bot.checkCommand = function (msg) {
            let command = this.checkTag(msg);
            if(command) {
                if(!this._caseSensitive) {
                    command = command.toLowerCase();
                }
                const cmd = this.$cmds[command];
                if(cmd) {
                    Actions.preformActions(msg, cmd);
                    return true;
                }
            }
            return false;
        }

        const onReady = Bot.onReady
        Bot.onReady = function (...params) {
          loadPrefixes(Files.data.settings ? Files.data.settings["Server Prefixes"].customData["Server Prefixes"].debug : 0);
          onReady.apply(this, ...params)
        }
    }
}