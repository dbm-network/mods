module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Send Mail",

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
	return `from:"${data.username}" to: "${data.mailto}"`;
},

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function(data, varType) {
	const type = parseInt(data.storage);
	if(type !== varType) return;
	return ([data.varName, 'Unknown Type']);
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["username", "password", "mailto", "subject", "type", "text", "iffalse", "iffalseVal", "hostname", "portname", "sec"],

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
    <div><u>Mod Info:</u><br>Made by <b>Blue Label</b><br>Mod By <b>Baiano</b></div><br>
    <div>
      <u>Helpful Information</u><br>
      - Html Useful Tutorial: <a href="https://www.w3schools.com/html/">W3schools Html Tutorial</a>.<br>
    </div><br>
	<div style="float: left; width: 50%;">
		SMTP Server:<br>
		<input id="hostname" class="round" type="text">
	</div>
	<div style="float: right; width: 50%;">
		port:<br>
		<input id="portname" class="round" type="text">
	</div>
        <div style="float: right; width: 45%;">
            SSL/TLS, STARTTLS:<br>
            <select id="sec" class="round">
				<option value="yes" selected>yes</option>
				<option value="no">no</option>
		 </select>
		</div>
	<div style="float: left; width: 50%;">
		Username:<br>
		<input id="username" class="round" type="text">
	</div>
	<div style="float: left; width: 50%;">
		Password:<br>
		<input id="password" type="password" class="round" type="text">
	</div><br><br><br>
	<div style="float: right; width: 50%;">
		mailto:<br>
		<input id="mailto" class="round" type="text">
	</div><br><br><br>
	<div style="float: left; width: 50%;">
		Subject:<br>
		<input id="subject" class="round" type="text" name="is-eval"><br>
    </div><br><br><br>
    <div style="float: left; width: 60%; padding-top: 10px">
    <select id="type" class:"round">
    <option value="0" selected>Custom Text</option>
    <option value="1">Html Format</option>
    </select>
    </div>
    <div style="float: left; width: 100%;">
    <textarea id="text" rows="9" style="width: 100%;"></textarea>
    </div>
    <div style="padding-top: 8px;">
        <div style="float: left; width: 35%;">
            If Mail Delivery Fails:<br>
            <select id="iffalse" class="round" onchange="glob.onChangeFalse(this)">
				<option value="0" selected>Continue Actions</option>
				<option value="1">Stop Action Sequence</option>
				<option value="2">Jump To Action</option>
				<option value="3">Skip Next Actions</option>
		 </select>
		</div><br><br><br>
		<div id="iffalseContainer" style="display: none; float: right; width: 60%;"><span id="iffalseName">Action Number</span>:<br><input id="iffalseVal" class="round" type="text"></div>
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

    glob.onChangeFalse(document.getElementById('iffalse'));
},

//---------------------------------------------------------------------
// Action Bot Function
//
// This is the function for the action within the Bot's Action class.
// Keep in mind event calls won't have access to the "msg" parameter, 
// so be sure to provide checks for variable existance.
//---------------------------------------------------------------------

  action: function(cache) {
    const _this = this
    const data = cache.actions[cache.index];
	  const username = this.evalMessage(data.username, cache);
    const password = this.evalMessage(data.password, cache);
    const mailto = this.evalMessage(data.mailto, cache);
    const subjectvalue = this.evalMessage(data.subject, cache);
    const textvalue = this.evalMessage(data.text, cache);
    const typevalue = parseInt(data.type);
	const hostname = this.evalMessage(data.hostname, cache);
	const portname = this.evalMessage(data.portname, cache);
	const sec = this.evalMessage(data.sec, cache)
    
    //Big thank to W3schools.com for this code.
  	const nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
      host: hostname,
	  port: portname,
	  secure: sec,
      auth: {
        user: username,
        pass: password
      }
    });
    switch(typevalue) {
      case 0:
        {
          var mailOptions = {
            from: username,
            to: mailto,
            subject: subjectvalue,
            text: textvalue
          };
        }        
      case 1:
          var mailOptions = {
            from: username,
            to: mailto,
            subject: subjectvalue,
            html: textvalue
          };
    }

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        _this.executeResults(false, data, cache);
      } else {
        console.log('Email successfully sent to: ' + mailto);
        _this.callNextAction(cache);
      }
  });
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
