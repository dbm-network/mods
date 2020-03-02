module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Edit Embed Object MOD",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Embed Message",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	const storage = ["", "Temp Variable", "Server Variable", "Global Variable"];
	return `${storage[parseInt(data.storage)]} (${data.varName})`;
},

//https://github.com/LeonZ2019/
author: "LeonZ",
version: "1.2.0",


//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function(data, varType) {
	const type = parseInt(data.storage);
	if(type !== varType) return;
	return ([data.varName, 'Embed Message']);
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["storage", "varName", "Edit0", "Edit1", "Edit2", "Edit3", "Edit4", "Edit5", "Edit6", "Edit7", "Edit8", "Edit9", "Edit10", "Edit11", "Edit12", "title", "url", "description", "color", "imageUrl", "imageUrl2", "thumbUrl", "thumbUrl2", "author", "authorUrl", "authorIcon", "footer", "footerIcon", "timestamp", "fieldNum", "fieldName", "fieldDescription", "fieldInline"],

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
<div style="width: 550px; height: 350px; overflow-y: scroll;">
	<div style="padding-top: 8px;">
		<div style="float: left; width: 35%;">
			Source Embed Object:<br>
			<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
				${data.variables[1]}
			</select>
		</div>
		<div style="float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text" list="variableList">
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 35%;">
			Edit Title:<br>
			<select id="Edit0" class="round" onchange="glob.onChange0(this)">
				<option value="0" selected>Keep Content</option>
				<option value="1">Edit Content</option>
				<option value="2">Clear Content</option>
			</select>
		</div>
		<div id="Input0" style="display: none; float: right; width: 60%;">
			Title:<br>
			<input id="title" class="round" type="text">
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 35%;">
			Edit URL:<br>
			<select id="Edit1" class="round" onchange="glob.onChange1(this)">
				<option value=0 selected>Keep Content</option>
				<option value=1>Edit Content</option>
				<option value=2>Clear Content</option>
			</select>
		</div>
		<div id="Input1" style="display: none; float: right; width: 60%;">
			URL:<br>
			<input id="url" class="round" type="text">
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 35%;">
			Edit Description:<br>
			<select id="Edit2" class="round" onchange="glob.onChange2(this)">
				<option value=0 selected>Keep Content</option>
				<option value=1>Edit Content</option>
				<option value=2>Clear Content</option>
			</select>
		</div>
		<div id="Input2" style="display: none; float: right; width: 60%;">
			Description:<br>
			<input id="description" class="round" type="text">
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 35%;">
			Edit Color:<br>
			<select id="Edit3" class="round" onchange="glob.onChange3(this)">
				<option value=0 selected>Keep Content</option>
				<option value=1>Edit Content</option>
				<option value=2>Clear Content</option>
			</select>
		</div>
		<div id="Input3" style="display: none; float: right; width: 60%;">
			Color:<br>
			<input id="color" class="round" type="text">
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 35%;">
			Edit Image URL:<br>
			<select id="Edit4" class="round" onchange="glob.onChange4(this)">
				<option value=0 selected>Keep Content</option>
				<option value=1>Edit Content</option>
				<option value=2>Clear Content</option>
				<option value=3>Edit Content (Local)</option>
			</select>
		</div>
		<div id="Input4" style="display: none; float: right; width: 60%;">
			<div id="Input4placeholder">Image URL:</div>
			<input id="imageUrl" class="round" type="text">
		</div>
	</div><br><br><br>
	<div id="Input4a" style="display: none; padding-top: 8px;">
	<div style="float: left; width: 105%;">
			Name With Extension:<br>
			<input id="imageUrl2" class="round" type="text" placeholder="name.extension">
		</div><br><br><br>
	</div>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 35%;">
			Edit Thumbnail URL:<br>
			<select id="Edit5" class="round" onchange="glob.onChange5(this)">
				<option value=0 selected>Keep Content</option>
				<option value=1>Edit Content</option>
				<option value=2>Clear Content</option>
				<option value=3>Edit Content (Local)</option>
			</select>
		</div>
		<div id="Input5" style="display: none; float: right; width: 60%;">
			<div id="Input5placeholder">Thumbnail URL:</div>
			<input id="thumbUrl" class="round" type="text">
		</div>
	</div><br><br><br>
	<div id="Input5a" style="display: none; padding-top: 8px;">
		<div style="float: left; width: 105%;">
			Name With Extension:<br>
			<input id="thumbUrl2" class="round" type="text" placeholder="name.extension">
		</div><br><br><br>
	</div>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 35%;">
			Edit Author Name:<br>
			<select id="Edit6" class="round" onchange="glob.onChange6(this)">
				<option value=0 selected>Keep Content</option>
				<option value=1>Edit Content</option>
				<option value=2>Clear Content</option>
			</select>
		</div>
		<div id="Input6" style="display: none; float: right; width: 60%;">
			Author Name:<br>
			<input id="author" class="round" type="text">
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 35%;">
			Edit Author URL:<br>
			<select id="Edit7" class="round" onchange="glob.onChange7(this)">
				<option value=0 selected>Keep Content</option>
				<option value=1>Edit Content</option>
				<option value=2>Clear Content</option>
			</select>
		</div>
		<div id="Input7" style="display: none; float: right; width: 60%;">
			Author URL:<br>
			<input id="authorUrl" class="round" type="text">
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 35%;">
			Edit Author Icon URL:<br>
			<select id="Edit8" class="round" onchange="glob.onChange8(this)">
				<option value=0 selected>Keep Content</option>
				<option value=1>Edit Content</option>
				<option value=2>Clear Content</option>
			</select>
		</div>
		<div id="Input8" style="display: none; float: right; width: 60%;">
			Author Icon URL:<br>
			<input id="authorIcon" class="round" type="text">
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 35%;">
			Edit Footer:<br>
			<select id="Edit9" class="round" onchange="glob.onChange9(this)">
				<option value=0 selected>Keep Content</option>
				<option value=1>Edit Content</option>
				<option value=2>Clear Content</option>
			</select>
		</div>
		<div id="Input9" style="display: none; float: right; width: 60%;">
			Footer:<br>
			<input id="footer" class="round" type="text">
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 35%;">
			Edit Footer Icon URL:<br>
			<select id="Edit10" class="round" onchange="glob.onChange10(this)">
				<option value=0 selected>Keep Content</option>
				<option value=1>Edit Content</option>
				<option value=2>Clear Content</option>
			</select>
		</div>
		<div id="Input10" style="display: none; float: right; width: 60%;">
			Footer Icon URL:<br>
			<input id="footerIcon" class="round" type="text">
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 35%;">
			Edit Timestamp:<br>
			<select id="Edit11" class="round" onchange="glob.onChange11(this)">
				<option value=0 selected>Keep Content</option>
				<option value=1>Edit to Current Timestamp</option>
				<option value=2>Edit to String Timestamp</option>
				<option value=3>Clear Content</option>
			</select>
		</div>
		<div id="Input11" style="display: none; float: right; width: 60%;">
			URL Timestamp:<br>
			<input id="timestamp" class="round" type="text">
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 35%;">
			Edit Edit Field:<br>
			<select id="Edit12" class="round" onchange="glob.onChange12(this)">
				<option value=0 selected>Keep Content</option>
				<option value=1>Edit Content</option>
				<option value=2>Delete Field</option>
				<option value=3>Delete All Fields</option>
				<option value=4>Add Field</option>
			</select><br>
		</div>
		<div id="Input12" style="display: none; float: right; width: 60%;">
			Field Number:<br>
			<input id="fieldNum" class="round" type="text"><br>
		</div>
	</div><br><br><br>
	<div id="Input13" style="display: none;">
		<div style="float: left; width: 32%;">
			Edit Field Name:<br>
			<input id="fieldName" class="round" type="text"><br>
		</div>
		<div style="padding-left: 3%; float: left; width: 32%;">
			Edit Field Value:<br>
			<input id="fieldDescription" class="round" type="text"><br>
		</div>
		<div style="padding-left: 3%; float: left; width: 32%;">
			Edit Field Inline:<br>
			<select id="fieldInline" class="round">
				<option value=0 selected>Keep Inline</option>
				<option value=1>Yes</option>
				<option value=2>No</option>
			</select><br>
		</div>
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

init: function() {
	const {glob, document} = this;
	const Input0 = document.getElementById('Input0');
	const Input1 = document.getElementById('Input1');
	const Input2 = document.getElementById('Input2');
	const Input3 = document.getElementById('Input3');
	const Input4 = document.getElementById('Input4');
	const Input4a = document.getElementById('Input4a');
	const Input4placeholder = document.getElementById('Input4placeholder');
	const Input5 = document.getElementById('Input5');
	const Input5a = document.getElementById('Input5a');
	const Input5placeholder = document.getElementById('Input5placeholder');
	const Input6 = document.getElementById('Input6');
	const Input7 = document.getElementById('Input7');
	const Input8 = document.getElementById('Input8');
	const Input9 = document.getElementById('Input9');
	const Input10 = document.getElementById('Input10');
	const Input11 = document.getElementById('Input11');
	const Input12 = document.getElementById('Input12');
	const Input13 = document.getElementById('Input13');
	const Input14 = document.getElementById('Input14');
	const fieldInline = document.getElementById('fieldInline');

	glob.onChange0 = function(Edit0) {
		switch(parseInt(Edit0.value)) {
			case 0:
			case 2:
				Input0.style.display = 'none';
				break;
			case 1:
				Input0.style.display = null;
				break;
		}
	}
	glob.onChange1 = function(Edit1) {
		switch(parseInt(Edit1.value)) {
			case 0:
			case 2:
				Input1.style.display = 'none';
				break;
			case 1:
				Input1.style.display = null;
				break;
		}
	}
	glob.onChange2 = function(Edit2) {
		switch(parseInt(Edit2.value)) {
			case 0:
			case 2:
				Input2.style.display = 'none';
				break;
			case 1:
				Input2.style.display = null;
				break;
		}
	}
	glob.onChange3 = function(Edit3) {
		switch(parseInt(Edit3.value)) {
			case 0:
			case 2:
				Input3.style.display = 'none';
				break;
			case 1:
				Input3.style.display = null;
				break;
		}
	}
	glob.onChange4 = function(Edit4) {
		switch(parseInt(Edit4.value)) {
			case 0:
			case 2:
				Input4.style.display = 'none';
				Input4a.style.display = 'none';
				break;
			case 1:
				Input4.style.display = null;
				Input4placeholder.innerHTML = 'Image URL:';
				document.getElementById('imageUrl').value = '';
				Input4a.style.display = 'none';
				break;
			case 3:
				Input4.style.display = null;
				Input4placeholder.innerHTML = 'Local Path:';
				document.getElementById('imageUrl').value = './resources';
				Input4a.style.display = null;
				break;
		}
	}
	glob.onChange5 = function(Edit5) {
		switch(parseInt(Edit5.value)) {
			case 0:
			case 2:
				Input5.style.display = 'none';
				Input5a.style.display = 'none';
				break;
			case 1:
				Input5.style.display = null;
				Input5placeholder.innerHTML = 'Image URL:';
				document.getElementById('thumbUrl').value = '';
				Input5a.style.display = 'none';
				break;
			case 3:
				Input5.style.display = null;
				Input5placeholder.innerHTML = 'Local Path:';
				document.getElementById('thumbUrl').value = './resources';
				Input5a.style.display = null;
				break;
		}
	}
	glob.onChange6 = function(Edit6) {
		switch(parseInt(Edit6.value)) {
			case 0:
			case 2:
				Input6.style.display = 'none';
				break;
			case 1:
				Input6.style.display = null;
				break;
		}
	}
	glob.onChange7 = function(Edit7) {
		switch(parseInt(Edit7.value)) {
			case 0:
			case 2:
				Input7.style.display = 'none';
				break;
			case 1:
				Input7.style.display = null;
				break;
		}
	}
	glob.onChange8 = function(Edit8) {
		switch(parseInt(Edit8.value)) {
			case 0:
			case 2:
				Input8.style.display = 'none';
				break;
			case 1:
				Input8.style.display = null;
				break;
		}
	}
	glob.onChange9 = function(Edit9) {
		switch(parseInt(Edit9.value)) {
			case 0:
			case 2:
				Input9.style.display = 'none';
				break;
			case 1:
				Input9.style.display = null;
				break;
		}
	}
	glob.onChange10 = function(Edit10) {
		switch(parseInt(Edit10.value)) {
			case 0:
			case 2:
				Input10.style.display = 'none';
				break;
			case 1:
				Input10.style.display = null;
				break;
		}
	}
	glob.onChange11 = function(Edit11) {
		switch(parseInt(Edit11.value)) {
			case 0:
			case 1:
			case 3:
				Input11.style.display = 'none';
				break;
			case 2:
				Input11.style.display = null;
				break;
		}
	}

	glob.onChange12 = function(Edit12) {
		switch(parseInt(Edit12.value)) {
			case 0:
			case 3:
				Input12.style.display = 'none';
				Input13.style.display = 'none';
				break;
			case 1:
				Input12.style.display = null;
				Input13.style.display = null;
				if (fieldInline.length !== 3) {
					var option = document.createElement('option');
					option.value = 0;
					option.innerHTML = "Keep Inline";
					fieldInline.prepend(option);
				}
				break;
			case 2:
				Input12.style.display = null;
				Input13.style.display = 'none';
				break;
			case 4:
				Input12.style.display = null;
				Input13.style.display = null;
				if (fieldInline.length === 3) {
					fieldInline.remove(0);
				}
				break;
		}
	}

	glob.onChange0(document.getElementById('Edit0'));
	glob.onChange1(document.getElementById('Edit1'));
	glob.onChange2(document.getElementById('Edit2'));
	glob.onChange3(document.getElementById('Edit3'));
	glob.onChange4(document.getElementById('Edit4'));
	glob.onChange5(document.getElementById('Edit5'));
	glob.onChange6(document.getElementById('Edit6'));
	glob.onChange7(document.getElementById('Edit7'));
	glob.onChange8(document.getElementById('Edit8'));
	glob.onChange9(document.getElementById('Edit9'));
	glob.onChange10(document.getElementById('Edit10'));
	glob.onChange11(document.getElementById('Edit11'));
	glob.onChange12(document.getElementById('Edit12'));
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
	const storage = parseInt(data.storage);
	const varName = this.evalMessage(data.varName, cache);
	const embed = this.getVariable(storage, varName, cache);
	if(!embed) {
		this.callNextAction(cache);
		return;
	}
	const Edit0 = parseInt(data.Edit0);
	const Edit1 = parseInt(data.Edit1);
	const Edit2 = parseInt(data.Edit2);
	const Edit3 = parseInt(data.Edit3);
	const Edit4 = parseInt(data.Edit4);
	const Edit5 = parseInt(data.Edit5);
	const Edit6 = parseInt(data.Edit6);
	const Edit7 = parseInt(data.Edit7);
	const Edit8 = parseInt(data.Edit8);
	const Edit9 = parseInt(data.Edit9);
	const Edit10 = parseInt(data.Edit10);
	const Edit11 = parseInt(data.Edit11);
	const Edit12 = parseInt(data.Edit12);
	const title = this.evalMessage(data.title, cache);
	const url = this.evalMessage(data.url, cache);
	const description = this.evalMessage(data.description, cache);
	const color = this.evalMessage(data.color, cache);
	const imageUrl = this.evalMessage(data.imageUrl, cache);
	const imageUrl2 = this.evalMessage(data.imageUrl2, cache);
	const thumbUrl = this.evalMessage(data.thumbUrl, cache);
	const thumbUrl2 = this.evalMessage(data.thumbUrl2, cache);
	const author = this.evalMessage(data.author, cache);
	const authorUrl = this.evalMessage(data.authorUrl, cache);
	const authorIcon = this.evalMessage(data.authorIcon, cache);
	const footer = this.evalMessage(data.footer, cache);
	const footerIcon = this.evalMessage(data.footerIcon, cache);
	const timestamp = this.evalMessage(data.timestamp, cache);
	const fieldNum = parseInt(this.evalMessage(data.fieldNum, cache));
	const fieldName = this.evalMessage(data.fieldName, cache);
	const fieldDescription = this.evalMessage(data.fieldDescription, cache);
	const fieldInline = parseInt(data.fieldInline);
	switch(Edit0) {
		case 1:
			embed.setTitle(title);
			break;
		case 2:
			embed.title = undefined;
			break;
	}
	switch(Edit1) {
		case 1:
			embed.setURL(url);
			break;
		case 2:
			embed.url = undefined;
			break;
	}
	switch(Edit2) {
		case 1:
			embed.setDescription(description);
			break;
		case 2:
			embed.description = undefined;
			break;
	}
	switch(Edit3) {
		case 1:
			embed.setColor(color);
			break;
		case 2:
			embed.color = undefined;
			break;
	}
	switch(Edit4) {
		case 1:
			embed.setImage(imageUrl);
			break;
		case 2:
			embed.image = undefined;
			break;
		case 3:
			embed.attachFile(imageUrl+"/"+imageUrl2);
			embed.setImage('attachment://'+imageUrl2)
			break;
	}
	switch(Edit5) {
		case 1:
			embed.setThumbnail(thumbUrl);
			break;
		case 2:
			embed.thumbnail = undefined;
			break;
		case 3:
			embed.attachFile(thumbUrl+"/"+thumbUrl2);
			embed.setImage('attachment://'+thumbUrl2)
			break;
	}
	if (embed.author === undefined) {
		if (Edit6 == 1 && typeof author !== undefined) {
			embed.setAuthor(author);
			if (Edit7 == 1 && typeof authorUrl !== undefined) {
				embed.author.url = authorUrl;
			}
			if (Edit8 == 1 && typeof authorIcon !== undefined) {
				embed.author.icon_url = authorIcon;
			}
		}
	} else {
		if (typeof author !== undefined && Edit6 == 1) {
			embed.author.name = author;
		} else if (Edit6 == 2) {
			embed.author.name = undefined;
		}
		if (typeof authorUrl !== undefined && Edit7 == 1 && embed.author !== undefined) {
			embed.author.url = authorUrl;
		} else if (Edit7 == 2) {
			embed.author.url = undefined;
		}
		if (typeof authorIcon !== undefined && Edit8 == 1 && embed.author !== undefined) {
			embed.author.icon_url = authorIcon;
		} else if (Edit8 == 2) {
			embed.author.icon_url = undefined;
		}
	}
	if (embed.footer === undefined) {
		if (Edit9 == 1 && typeof footer !== undefined) {
			embed.setFooter(footer);
			if (Edit10 == 1 && typeof footerIcon !== undefined) {
				embed.footer.icon_url = footerIcon;
			}
		}
	} else {
		if (typeof footer !== undefined && Edit9 == 1) {
			embed.footer.text = footer;
		} else if (Edit9 != 0) {
			embed.footer.text = undefined;
		}
		if (typeof footerIcon !== undefined && Edit10 == 1) {
			embed.footer.icon_url = footerIcon;
		} else if (Edit10 != 0) {
			embed.footer.icon_url = undefined;
		}
	}		
	switch(Edit10) {
		case 1:
			embed.footer.icon_url = footerIcon;
			break;
		case 2:
			embed.footer.icon_url = undefined;
			break;
	}
	switch(Edit11) {
		case 1:
			embed.setTimestamp(new Date());
			break;
		case 2:
			if (isNaN(timestamp)) {
				embed.setTimestamp(new Date(timestamp));
			} else {
				embed.setTimestamp(new Date(parseInt(timestamp)));
			}
			break;
		case 3:
			embed.timestamp = undefined;
			break;
	}
	switch(Edit12) {
		case 1:
			if(embed.fields.length > fieldNum) {
				embed.fields[fieldNum].name = fieldName;
				embed.fields[fieldNum].value = fieldDescription;
				switch(fieldInline) {
					case 1:
						embed.fields[fieldNum].inline = true;
						break;
					case 2:
						embed.fields[fieldNum].inline = false;
						break;
				}
			}
			break;
		case 2:
			embed.fields.splice(fieldNum,1);
			break;
		case 3:
			embed.fields = [];
			break;
		case 4:
			let field = {};
			field.name = fieldName;
			field.value = fieldDescription;
			field.inline = fieldInline;
			switch(fieldInline) {
				case 1:
					field.inline = true;
					break;
				case 2:
					field.inline = false;
					break;
			}
			embed.fields.splice(fieldNum, 0, field)
			break;
	}
	this.storeValue(embed, storage, varName, cache);
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
