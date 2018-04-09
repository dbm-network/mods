module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Create \"Only-Coded\" Bot",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Other Stuff",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
    const numba = ['No Template', 'Await Response', 'Await Reaction']
	return `Create Bot - ${numba[parseInt(data.temblate)]}`;
},

//---------------------------------------------------------------------
    // DBM Mods Manager Variables (Optional but nice to have!)
    //
    // These are variables that DBM Mods Manager uses to show information
    // about the mods for people to see in the list.
    //---------------------------------------------------------------------

    // Who made the mod (If not set, defaults to "DBM Mods")
    author: "EliteArtz",

    // The version of the mod (Defaults to 1.0.0)
    version: "1.8.7",

    // A short description to show on the mod line for this mod (Must be on a single line)
    short_description: "Creates 2 Files with your Code you put in or the Template you used.",

	 // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


	 //---------------------------------------------------------------------

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["temblate", "togen", "brefix", "path"],

//---------------------------------------------------------------------
// Command HTML
//
// This function returns a string containing the HTML used for
// editting actions.
//
// The "isEvent" parameter will be true if this action is being used
// for an event. Due to their nature, events lack certain information,
// so edit the HTML to reflect this.
//
// The "data" parameter stores constants for select elements to use.
// Each is an array: index 0 for commands, index 1 for events.
// The names are: sendTargets, members, roles, channels,
//                messages, servers, variables
//---------------------------------------------------------------------

html: function(isEvent, data) {
	return `
    <div>
    <p>
        <u>Mod Info:</u><br>
        Made by EliteArtz<br>
        - Using the Await-Response Command, the Word will be "Bot" (You'll have 10 Seconds)! <br>
        - More Template's can and will be added soon!<br>
        - Commands Await Response: (YourPrefix)help, (YourPrefix)await when using Templates<br>
        - Command Await Reaction: (YourPrefix)help, (YourPrefix)voter, when using Templates<br>
        - Don't forget to install the modules and then "node index.js" to start your Bot.<br>
    </p>
	<div style="float: left; width: 50%;">
		Template:<br>
		<select id="temblate" class="round" style="width: 50%;">
			<option value="0" selected>No Template</option>
			<option value="1">Await Response</option>
			<option value="2">Await Reaction</option>
        </select>
    </div><br><br>
    <div style="float: left; width: 99%">
        Token:<br>
        <textarea id="togen" class="round" style="width: 100%; resize: none;" type="textarea" rows="1" cols="50"></textarea><br>
    </div><br>
	<div style="float: left; width: 45%;">
		Prefix:<br>
		<textarea id="brefix" class="round" style="width: 100%; resize: none;" type="textarea" rows="1" cols="50" placeholder="Please insert a Prefix here." >!</textarea><br>
    </div>
    <div style="float: right; width: 54%;">
		Where to Save File's:<br>
		<textarea id="path" class="round" style="width: 100%; resize: none;" type="textarea" rows="1" cols="55" placeholder="Please let stay here \"resources/\"">resources/</textarea><br>
	</div>
</div>`
},

//---------------------------------------------------------------------
// Action Editor Init Code
//
// When the HTML is first applied to the action editor, this code
// is also run. This helps add modifications or setup reactionary
// functions for the DOM elements.
//---------------------------------------------------------------------

init: function() {},

//---------------------------------------------------------------------
// Action Bot Function
//
// This is the function for the action within the Bot's Action class.
// Keep in mind event calls won't have access to the "msg" parameter,
// so be sure to provide checks for variable existance.
//---------------------------------------------------------------------

action: function (cache) {
    const data = cache.actions[cache.index];
    const fs = require('fs');
    const PATH = this.evalMessage(data.path, cache)
    const PREFIX = this.evalMessage(data.brefix, cache);
    const TOKEN = this.evalMessage(data.togen, cache);

    try {
        const TEMPLATE = data.temblate;
        if (TEMPLATE === "0") {
            fs.writeFileSync(PATH + "\\index.js", `const Discord = require('discord.js');
const botSettings = require("./settings");
const bot = new Discord.Client();
const prefix = botSettings.prefix;
const token = botSettings.token;

bot.login(token);

bot.on("ready", async () => {
    console.log("Bot is online!");
    console.log(\`Prefix "\${prefix}"\`);
    bot.user.setPresence({
        game: {
            name: prefix + "help",
            type: 0
        }
    });
    try {
        let xD = await bot.generateInvite(2146958591);
        console.log(xD);
    } catch (e) {
        console.log(e.stack);
    }
});

bot.on("message", async message => {
    if (message.channel.type === "dm") return;
    if (message.author.bot === true) return;

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if (!command.startsWith(prefix)) return;

    if (command === \`\${prefix}help\`) {
        let embed = new Discord.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTitle("Command List")
            .setThumbnail(message.author.avatarURL)
            .setColor("RANDOM")
            .setDescription(\`\${prefix}help\`);
        message.channel.send(embed);
        message.delete(1);

    }
});`, console.log('Bot File was successfully created.'));

            fs.writeFileSync(PATH + "\\settings.json", `{
    "token": "${TOKEN}",
    "prefix": "${PREFIX}"
}`, console.log('Settings File Successfully created.'));
        } else if (TEMPLATE === "1") {
            fs.writeFileSync(PATH + "\\index.js", `const Discord = require('discord.js');
const botSettings = require("./settings");
const bot = new Discord.Client();
const prefix = botSettings.prefix;
const token = botSettings.token;

bot.login(token);

bot.on("ready", async () => {
    console.log("Bot is online!");
    console.log(\`Prefix "\${prefix}"\`);
    bot.user.setPresence({
        game: {
            name: prefix + "help",
            type: 0
        }
    });
    try {
        let xD = await bot.generateInvite(2146958591);
        console.log(xD);
    } catch (e) {
        console.log(e.stack);
    }
});

bot.on("message", async message => {
    if (message.channel.type === "dm") return;
    if (message.author.bot === true) return;

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if (!command.startsWith(prefix)) return;

    if (command === \`\${prefix}help\`) {
        let embed = new Discord.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTitle("Command List")
            .setThumbnail(message.author.avatarURL)
            .setColor("RANDOM")
            .setDescription(\`\${prefix}await
\${prefix}help\`);
        message.channel.send(embed);
        message.delete(1);

    }
});

bot.on("message", async message => {
    if (message.channel.type === "dm") return;
    if (message.author.bot === true) return;

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if (!command.startsWith(prefix)) return;

    if (command === \`\${prefix}await\`) {
        await message.channel.send("Test, Write 'Bot', You have 10 Seconds to write.");
        try {
        const messages1 = await message.channel.awaitMessages(message => message.content.includes("Bot"), {time: 10000});

        message.channel.send(\`Await completed! Familiar Answers collected: "\${messages1.map(message => message.content).join(", ")}"\`);

        console.log(messages1);
        } catch (e) {
            console.error("ERROR!" + e.stack);
            message.channel.send(\`ERROR!  \${e.stack}\`);
        }
    }
});`, console.log('Bot File was successfully created.'));
            fs.writeFileSync(PATH + "\\settings.json", `{
    "token": "${TOKEN}",
    "prefix": "${PREFIX}"
}`, console.log('Settings File Successfully created.'));
        } else if (TEMPLATE === "2") {
                        fs.writeFileSync(PATH + "\\index.js", `const Discord = require('discord.js');
const botSettings = require("./settings");
const bot = new Discord.Client();
const prefix = botSettings.prefix;
const token = botSettings.token;

bot.login(token);

bot.on("ready", async () => {
    console.log("Bot is online!");
    console.log(\`Prefix "\${prefix}"\`);
    bot.user.setPresence({
        game: {
            name: prefix + "help",
            type: 0
        }
    });
    try {
        let xD = await bot.generateInvite(2146958591);
        console.log(xD);
    } catch (e) {
        console.log(e.stack);
    }
});

bot.on("message", async message => {
    if (message.channel.type === "dm") return;
    if (message.author.bot === true) return;

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if (!command.startsWith(prefix)) return;

    if (command === \`\${prefix}help\`) {
        let embed = new Discord.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTitle("Command List")
            .setThumbnail(message.author.avatarURL)
            .setColor("RANDOM")
            .setDescription(\`\${prefix}voter
\${prefix}help\`);
        message.channel.send(embed);
        message.delete(1);

    }
});

bot.on("message", async message => {
    if (message.channel.type === "dm") return;
    if (message.author.bot === true) return;

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if (!command.startsWith(prefix)) return;

    const x = "✅";
    const hundred = "❎";

    if (command === \`\${prefix}voter\`) {
        await message.channel.send("Click on 1 Reaction!");
        try {
            let msg = await message.channel.send("Vote! *You have 15 seconds to vote!* **This Action is a bit buggy**");
            await msg.react(x);
            await msg.react(hundred);

            const reactions = await msg.awaitReactions(reaction => reaction.emoji.name === hundred || reaction.emoji.name === x, {time: 15000});
            message.channel.send(\`Voting complete!

\${x}: \${reactions.get(x).count-1}
\${hundred}: \${reactions.get(hundred).count-1}\`);

        } catch (e) {
            console.error("ERROR!" + e.stack);
            message.channel.send(\`ERROR!  \${e.stack}\`);
        }
    }
});`, console.log('Bot File was successfully created.'));

            fs.writeFileSync(PATH + "\\settings.json", `{
    "token": "${TOKEN}",
    "prefix": "${PREFIX}"
}`, console.log('Settings File Successfully created.'));
        } //else if (test === "3") {}
    } catch (err) {
        console.log("ERROR! " + err.stack ? err.stack : err);
    }
    this.callNextAction(cache);
},

//---------------------------------------------------------------------
// Action Bot Mod
//
// Upon initialization of the bot, this code is run. Using the bot's
// DBM namespace, one can add/modify existing functions if necessary.
// In order to reduce conflictions between mods, be sure to alias
// functions you wish to overwrite.
//---------------------------------------------------------------------

mod: function(DBM) {
}

}; // End of module
