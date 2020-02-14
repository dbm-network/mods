module.exports = {

    //---------------------------------------------------------------------
    // Editor Extension Name
    //
    // This is the name of the editor extension displayed in the editor.
    //---------------------------------------------------------------------

    name: "Multiple Bot Owners",

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

    fields: [],

    //---------------------------------------------------------------------
    // Default Fields
    //
    // The default values of the fields.
    //---------------------------------------------------------------------

    defaultFields: {},

    // these variables will be used by a custom installer (Optional, but nice to have)
    authors: ["GeneralWrex"],
    version: "1.0.0",
    changeLog: "Initial Release",
    shortDescription: "Overrides a bot.js method to allow multiple bot owners.",
    longDescription: "",
    requiredNodeModules: [],

    //---------------------------------------------------------------------
    // Extension Dialog Size
    //
    // Returns the size of the extension dialog.
    //---------------------------------------------------------------------

    size: function() {
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

    html: function(data) {

        return `
  			<style>
			  html,
			  body {
				  text-align: center;
				  height: 100%;
				  width: 100%;
				  background-color: #23272a;
			  }
	  
			  .input {
				  border-top-right-radius: 0px !important;
				  border-bottom-right-radius: 0px !important;
			  }
	  
			  .currentowners {
				  max-height: 150px;
				  height: 150px;
				  overflow-y: scroll !important;
				  overflow-x: hidden;
			  }
	  
			  .container {
				  margin-left: 15% !important;
				  margin-right: 15% !important;
			  }
	  
			  .input {
				  width: 100% !important;
			  }
	  
			  label, p {
				  color: white !important;
			  }
		  </style>
		  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css">
		  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css">		  
		  <script src="https://kit.fontawesome.com/9f46650366.js" crossorigin="anonymous"></script>	  

		  <div class="container has-text-centered"> 
		      <p><br>Created By ${this.authors.join(', ')}<br></p>
		      <br>The addition or removal of owners requires a bot restart.<br><br>
		  	  <label class="label">Current Owners</label>
			  <div class="currentowners" id="current-owners">

			  </div><label class="label">Add owners</label>
			  <div class="field has-addons"> <input id="ownerinput" class="input" type="text" placeholder="User ID">
				  <div class="control"> <a class="button is-info" onclick="document.addOwner()"> <i class="fas fa-plus"></i> </a> </div>
			  </div>
		  </div>	
		  `
    },

    //---------------------------------------------------------------------
    // Extension Dialog Init Code
    //
    // When the HTML is first applied to the extension dialog, this code
    // is also run. This helps add modifications or setup reactionary
    // functions for the DOM elements.
    //---------------------------------------------------------------------

    init: function(document, data) {

        try {
            const fs = require('fs'),
                path = require('path');

            const filepath = path.join(__dirname, "../data", 'multiple_bot_owners.json');

            let botOwners = [];

            function loadOwners() {
                if (!fs.existsSync(filepath)) {
                    fs.writeFileSync(filepath, JSON.stringify(botOwners));
                } else {
                    botOwners = JSON.parse(fs.readFileSync(filepath, "utf8"));
                }

                botOwners.forEach(owner => {
                    if (owner && /^\d+$/.test(owner)) {
                        addOwnerHTML(owner);
                    }
                })
			}
			
			function addOwnerHTML(owner) {
                document.getElementById('current-owners').innerHTML += `
				<div class="field has-addons" id="${owner}_DIV"> <input id="${owner}_INPUT" class="input" type="text" placeholder="User ID" disabled 
				value="${owner}">
					<div class="control"> <a class="button is-info" onclick="document.delOwner(document.getElementById('${owner}_INPUT'))"> <i class="fas fa-minus"></i> </a> </div>
				</div>
				`;
			}
			
            document.delOwner = function(element) {
                const owner = element && element.value
                const element2 = document.getElementById(`${owner}_DIV`)
                alert(`${owner} was removed.`)
                if (!owner) return;

                botOwners.splice(botOwners.indexOf(owner), 1);

                element.parentNode.removeChild(element);
                element2.parentNode.removeChild(element2);

                fs.writeFileSync(filepath, JSON.stringify(botOwners, null, 2));
            }

            document.addOwner = function(owner = false) {

                if (!owner) owner = document.getElementById('ownerinput').value

                if (!owner) {
                    return alert(`MultipleBotOwners\nYou must enter a value!`)
                } else if (!/^\d+$/.test(owner)) {
                    return alert(`MultipleBotOwners\nThe inputted value can only be a discord ID.\nYou put ${owner}.`)
                } else if (botOwners.includes(owner)) {
                    return alert(`MultipleBotOwners\nThat ID already exists!.`)
                }

                addOwnerHTML(owner);
                botOwners.push(owner);
                fs.writeFileSync(filepath, JSON.stringify(botOwners));

                return "ADDED";
            }
            loadOwners();

        } catch (error) {
            alert("MultipleBotOwners Error: \n" + error)
        }

    },

    //---------------------------------------------------------------------
    // Extension Dialog Close Code
    //
    // When the dialog is closed, this is called. Use it to save the data.
    //---------------------------------------------------------------------

    close: function(document, data) {

    },

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

    mod: function(DBM) {

        const {
            Files,
            Actions
        } = DBM;

        const fs = require('fs'),
            path = require('path');


        try {
            const filepath = path.join(__dirname, "../data", 'multiple_bot_owners.json');

            let botOwners = [];

            if (!fs.existsSync(filepath)) {
                fs.writeFileSync(filepath, JSON.stringify(botOwners));
            } else {
                botOwners = JSON.parse(fs.readFileSync(filepath, "utf8"));
            }

            Actions.checkConditions = function(msg, cmd) {
                const isServer = Boolean(msg.guild && msg.member);
                const restriction = parseInt(cmd.restriction);
                const permissions = cmd.permissions;
                switch (restriction) {
                    case 0:
                        if (isServer) {
                            return this.checkPermissions(msg, permissions);
                        } else {
                            return true;
                        }
                        case 1:
                            return isServer && this.checkPermissions(msg, permissions);
                        case 2:
                            return isServer && msg.guild.owner === msg.member;
                        case 3:
                            return !isServer;
                        case 4:
                            return botOwners.length > 0 && botOwners.includes(msg.author.id) ||
                                Files.data.settings.ownerId && msg.author.id === Files.data.settings.ownerId;;
                        default:
                            return true;
                }
            };
        } catch (error) {
            console.error("MultipleBotOwners_ERROR:\n" + error)
        }

        console.log('Multiple Bot Owners Extension Loaded!');
    }

}; // End of module
