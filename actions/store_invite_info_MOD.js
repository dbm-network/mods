module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------
	
	name: "Store Invite Info",
	
	//---------------------------------------------------------------------
	// Action Section
	//
	// This is the section the action will fall into.
	//---------------------------------------------------------------------
	
	section: "Channel Control",
	
	//---------------------------------------------------------------------
	// Action Subtitle
	//
	// This function generates the subtitle displayed next to the name.
	//---------------------------------------------------------------------
	
	subtitle: function(data) {
		const info = ['Channel Object', 'Invite Creator', 'Creation Date', 'Expiration Date', 'Guild Object', 'Max. Uses', 'Is Temporary?', 'URL for Invite', 'Times Used']
		return `Store ${info[parseInt(data.info)]} from Invite`;
	},

	//---------------------------------------------------------------------
	 // DBM Mods Manager Variables (Optional but nice to have!)
	 //
	 // These are variables that DBM Mods Manager uses to show information
	 // about the mods for people to see in the list.
	 //---------------------------------------------------------------------

	 // Who made the mod (If not set, defaults to "DBM Mods")
 	author: "iAmaury, General Wrex, EliteArtz and Jakob",

 	// The version of the mod (Defaults to 1.0.0)
 	version: "1.9.0", //Added in 1.9.0

 	// A short description to show on the mod line for this mod (Must be on a single line)
 	short_description: "Stores something from an Invite.",

 	// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods

 	//---------------------------------------------------------------------

	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		const info = parseInt(data.info);
		let dataType = 'Unknown Type';
		switch(info) {
			case 0:
				dataType = 'Object';
				break;
			case 1:
				dataType = 'User';
				break;
			case 2:
				dataType = 'date';
				break;
			case 3:
				dataType = 'date';
				break;
			case 4:
				dataType = 'Guild';
				break;
			case 5:
				dataType = 'number';
				break;
			case 6:
				dataType = 'boolean';
				break;
			case 7:
				dataType = 'string';
				break;
			case 8:
				dataType = '';
				break;
		}
		return ([data.varName, dataType]);
	},
	
	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------
	
	fields: ["invite", "info", "storage", "varName"],
	
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
<div class="embed">
    <embedleftline style="background-color: #2b9696;"></embedleftline>
    <div class="embedinfo">
        <span class="embed-auth"><u>Mod Info:</u><br>Made by <b>${this.author}</b></span><br>
        <span class="embed-desc">${this.short_description}<br>Version: ${this.version}<br>NOTE: The only guaranteed properties are Url for invite, guild object and channel object. Other properties can be missing.</span>
    </div>
</div><br>
	<div style="padding-top: 8px;">
		Source Invite:<br>
		<textarea class="round" id="invite" rows="1" placeholder="Code or URL | e.g abcdef or discord.gg/abcdef" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
	</div><br>
	<div style="padding-top: 8px; width: 70%;">
		Source Info:<br>
		<select id="info" class="round">
			<option value="0" selected>Channel object</option>
			<option value="1">Creator of invite</option>
			<option value="2">Creation date</option>
			<option value="3">Expiration date</option>
			<option value="4">Guild object</option>
			<option value="5">Max. uses</option>
			<option value="6">Is temporary?</option>
			<option value="7">Url for invite</option>
			<option value="8">Times used</option>
		</select>
	</div><br>
	<div style="float: left; width: 35%; padding-top: 8px;">
		Store Result In:<br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
			${data.variables[0]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; display: none; width: 60%; padding-top: 8px;">
		Variable Name:<br>
		<input id="varName" class="round" type="text">
	</div>
	<style>
	/* START OF EMBED CSS */
div.embed { /* <div class="embed"></div> */
    position: relative;
}
    embedleftline { /* <embedleftline></embedleftline> OR if you wan't to change the Color: <embedleftline style="background-color: #HEXCODE;"></embedleftline> */
        background-color: #eee;
        width: 4px;
        border-radius: 3px 0 0 3px;
        border: 0;
        height: 100%;
        margin-left: 4px;
        position: absolute;
    }
    div.embedinfo { /* <div class="embedinfo"></div> */
        background: rgba(46,48,54,.45) fixed;
        border: 1px solid hsla(0,0%,80%,.3);
        padding: 10px;
        margin:0 4px 0 7px;
        border-radius: 0 3px 3px 0;
    }
        span.embed-auth { /* <span class="embed-auth"></span> (Title thing) */
            color: rgb(255, 255, 255);
        }
        span.embed-desc { /* <span class="embed-desc"></span> (Description thing) */
            color: rgb(128, 128, 128);
        }

span { /* Only making the text look, nice! */
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
	</style>`
	},
	
	//---------------------------------------------------------------------
	// Action Editor Init Code
	//
	// When the HTML is first applied to the action editor, this code
	// is also run. This helps add modifications or setup reactionary
	// functions for the DOM elements.
	//---------------------------------------------------------------------
	
	init: function() {
		const {glob, document} = this;
	
		glob.variableChange(document.getElementById('storage'), 'varNameContainer');
	},
	
	//---------------------------------------------------------------------
	// Action Bot Function
	//
	// This is the function for the action within the Bot's Action class.
	// Keep in mind event calls won't have access to the "msg" parameter, 
	// so be sure to provide checks for variable existance.
	//---------------------------------------------------------------------
	
	action: function(cache) {
		const data = cache.actions[cache.index];
		const invite = this.evalMessage(data.invite, cache);
		const info = parseInt(data.info);
		
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);

        const client = this.getDBM().Bot.bot;

        client.fetchInvite(invite).catch(console.error).then(doThis.bind(this));

        function doThis(invite){

            if(!invite) this.callNextAction(cache);
				
			let result;
			switch(info) {
				case 0:
					result = invite.channel;
					break;
				case 1:
					result = invite.inviter;
					break;
				case 2:
					result = invite.createdAt;
					break;
				case 3:
					result = invite.expiresAt;
					break;
				case 4:
					result = invite.guild;
					break;
				case 5:
					result = invite.maxUses;
					break;
				case 6:
					result = invite.temporary;
					break;
				case 7:
					result = invite.url;
					break;
				case 8:
					result = invite.uses;
					break;
				default:
					break;
			}

			if(result !== undefined) {
				this.storeValue(result, storage, varName, cache);
			}
			this.callNextAction(cache);	
        }	
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