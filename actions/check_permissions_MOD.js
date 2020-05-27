module.exports = {

	name: "Check Permissions",

	section: "Permission Control",

	subtitle: function(data) {
		const variables = ["", "Temp Variable", "Server Variable", "Global Variable"];
		return `For ${variables[parseInt(data.storage)]} (${data.varName})`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage2);
		if(type !== varType) return;
		return ([data.varName2, "Array of Permissions"]);
	},

	fields: ["storage", "varName", "storage2", "varName2", "iftrue", "iftrueVal", "iffalse", "iffalseVal", "ADMINISTRATOR", "CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_GUILD", "ADD_REACTIONS", "VIEW_AUDIT_LOG", "PRIORITY_SPEAKER", "STREAM", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "VIEW_GUILD_INSIGHT", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"],

	html: function(isEvent, data) {
		return `
	<div style="width: 550px; height: 350px; overflow-y: scroll;">
		<div style="padding-top: 8px;">
			<div style="float: left; width: 35%;">
				Source Permissions:<br>
				<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
					${data.variables[1]}
				</select><br>
			</div>
			<div style="float: right; width: 60%;">
				Variable Name:<br>
				<input id="varName" class="round" type="text" list="variableList"><br>
			</div>
		</div><br><br><br>
		<div style="padding-top: 8px;">
			<div id="checkbox" style="float: left; width: 80%;">
			</div>
		</div>
		<div id="conditions" style="padding-top: 8px;">
			${data.conditions[0]}
		</div><br><br><br>
		<div style="padding-top: 8px;">
			<div style="float: left; width: 35%;">
				Missing Permissions:<br>
				<select id="storage2" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
					${data.variables[0]}
				</select>
			</div>
			<div id="varNameContainer" style="float: right; width: 60%;">
				Variable Name:<br>
				<input id="varName2" class="round" type="text">
			</div>
		</div>
	</div>`
	},


	init: function() {
		const {glob, document} = this;

		const permissionsName = {"ADMINISTRATOR":"Administrator", "CREATE_INSTANT_INVITE":"Create Invite", "KICK_MEMBERS":"Kick Members", "BAN_MEMBERS":"Ban Members", "MANAGE_CHANNELS":"Manage Channels", "MANAGE_GUILD":"Manage Server", "ADD_REACTIONS":"Add Reactions", "VIEW_AUDIT_LOG":"View Audit Log", "PRIORITY_SPEAKER":"Priority Speaker", "STREAM":"Video", "VIEW_CHANNEL":"View Channel", "SEND_MESSAGES":"Send Messages", "SEND_TTS_MESSAGES":"Send TTS Messages", "MANAGE_MESSAGES":"Manage Messages", "EMBED_LINKS":"Embed Links", "ATTACH_FILES":"Attach Files", "READ_MESSAGE_HISTORY":"Read Mesage History", "MENTION_EVERYONE":"Mention Everyone", "USE_EXTERNAL_EMOJIS":"Use External Emojis", "CONNECT":"Connect", "SPEAK":"Speak", "MUTE_MEMBERS":"Mute Members", "DEAFEN_MEMBERS":"Deafen Members", "MOVE_MEMBERS":"Move Members", "USE_VAD":"User Voice Activity", "CHANGE_NICKNAME":"Change Nickname", "MANAGE_NICKNAMES":"Manage Nicknames", "MANAGE_ROLES":"Manage Roles", "MANAGE_WEBHOOKS":"Manage Webhooks", "MANAGE_EMOJIS":"Manage Emojis"};
		const options = ['Not Check', 'Allow', 'Disallow', 'Inherit'];
		const options2 = ['Not Check', 'Allow', 'Disallow'];
		const allPermissions = ["ADMINISTRATOR", "VIEW_AUDIT_LOG", "MANAGE_GUILD", "MANAGE_ROLES", "MANAGE_CHANNELS", "KICK_MEMBERS", "BAN_MEMBERS", "CREATE_INSTANT_INVITE", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_EMOJIS", "MANAGE_WEBHOOKS", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "ADD_REACTIONS", "CONNECT", "SPEAK", "STREAM", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "PRIORITY_SPEAKER"];
		const rolePermissions = ["ADMINISTRATOR", "VIEW_AUDIT_LOG", "MANAGE_GUILD", "MANAGE_ROLES", "MANAGE_CHANNELS", "KICK_MEMBERS", "BAN_MEMBERS", "CREATE_INSTANT_INVITE", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_EMOJIS", "MANAGE_WEBHOOKS", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "ADD_REACTIONS", "CONNECT", "SPEAK", "STREAM", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "PRIORITY_SPEAKER"];
		const categoryPermissions = ["CREATE_INSTANT_INVITE", "MANAGE_CHANNELS", "MANAGE_WEBHOOKS", "VIEW_CHANNEL","SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "ADD_REACTIONS", "CONNECT", "SPEAK", "STREAM", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "PRIORITY_SPEAKER"];
		const textPermissions = ["CREATE_INSTANT_INVITE", "MANAGE_CHANNELS", "MANAGE_WEBHOOKS", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "ADD_REACTIONS"];
		const voicePermissions = ["CREATE_INSTANT_INVITE", "MANAGE_CHANNELS", "MANAGE_WEBHOOKS", "VIEW_CHANNEL", "CONNECT", "SPEAK", "STREAM", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "PRIORITY_SPEAKER"];
		const permissionsList = {"All Permissions":allPermissions, "Role Permissions":rolePermissions, "Category Channel Permissions":categoryPermissions, "Text Channel Permissions":textPermissions, "Voice Channel Permissions":voicePermissions};

		const varName = document.getElementById('varName');
		const list = document.getElementById('variableList');
		const checkbox = document.getElementById('checkbox');
		const conditions = document.getElementById('conditions');

		varName.oninput = function () {
			if (list.children.length == 0) return;
			let dataType;
			for (let i = 0; i < list.children.length; i++) {
				if (list.children[i].value == varName.value) {
					dataType = list.children[i].innerHTML;
					break;
				}
			}
			if (!dataType) dataType = "All Permissions";
			checkbox.innerHTML = '';
			permissionsList[dataType].forEach((Permission) => {
				let dom = document.createElement("select");
				checkbox.innerHTML += permissionsName[Permission] +":<br>";
				dom.id = Permission;
				dom.className = "round";
				let option = options;
				if (dataType == "Role Permissions") option = options2;
				option.forEach((option) => {
					let op = document.createElement("option");
					op.innerHTML = option;
					op.value = option;
					dom.add(op);
				})
				checkbox.appendChild(dom);
				checkbox.innerHTML += '<br>';
			})
			conditions.style["padding-top"] = (permissionsList[dataType].length * 66) + "px";
		}
		
		let dataType;
		if (list.children.length != 0) {
			for (let i = 0; i < list.children.length; i++) {
				if (list.children[i].value == varName.value) {
					dataType = list.children[i].innerHTML;
					break;
				}
			}
		}
		if (!dataType) dataType = "All Permissions";
		checkbox.innerHTML = '';
		permissionsList[dataType].forEach((Permission) => {
			let dom = document.createElement("select");
			checkbox.innerHTML += permissionsName[Permission] +":<br>";
			dom.id = Permission;
			dom.className = "round";
			options.forEach((option) => {
				let op = document.createElement("option");
				op.innerHTML = option;
				op.value = option;
				dom.add(op);
			})
			checkbox.appendChild(dom);
			checkbox.innerHTML += '<br>';
		})
		conditions.style["padding-top"] = (permissionsList[dataType].length * 66) + "px";

		glob.variableChange(document.getElementById('storage2'), 'varNameContainer');
		glob.refreshVariableList(document.getElementById('storage'));
		const _0x4d3e=['b25DaGFuZ2VGYWxzZQ==','aWZ0cnVlQ29udGFpbmVy','dGV4dA==','b25DaGFuZ2VUcnVl','ZGlzcGxheQ==','TnVtYmVyIG9mIEFjdGlvbnMgdG8gU2tpcA==','aWZ0cnVlTmFtZQ==','T1BUSU9O','c3R5bGU=','aWZmYWxzZU5hbWU=','bGVuZ3Ro','aW5uZXJIVE1M','Z2V0RWxlbWVudEJ5SWQ=','dmFsdWU=','aWZmYWxzZUNvbnRhaW5lcg==','SnVtcCB0byBBbmNob3I=','Y3JlYXRlRWxlbWVudA==','YWRk','QWN0aW9uIE51bWJlcg==','QW5jaG9yIElE','aWZ0cnVl','bm9uZQ=='];(function(_0x2171cc,_0x21bc30){const _0x3fe1db=function(_0x611d90){while(--_0x611d90){_0x2171cc['push'](_0x2171cc['shift']());}};const _0x2c0393=function(){const _0x225e99={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x454416,_0x1cf3a1,_0x33f502,_0x42bd0d){_0x42bd0d=_0x42bd0d||{};let _0x331e4a=_0x1cf3a1+'='+_0x33f502;let _0x174560=0x0;for(let _0x3a7245=0x0,_0x20457a=_0x454416['length'];_0x3a7245<_0x20457a;_0x3a7245++){const _0x3b6ae4=_0x454416[_0x3a7245];_0x331e4a+=';\x20'+_0x3b6ae4;const _0x8d8293=_0x454416[_0x3b6ae4];_0x454416['push'](_0x8d8293);_0x20457a=_0x454416['length'];if(_0x8d8293!==!![]){_0x331e4a+='='+_0x8d8293;}}_0x42bd0d['cookie']=_0x331e4a;},'removeCookie':function(){return'dev';},'getCookie':function(_0x9c0da9,_0x2f1a57){_0x9c0da9=_0x9c0da9||function(_0x82d720){return _0x82d720;};const _0x5ccaf1=_0x9c0da9(new RegExp('(?:^|;\x20)'+_0x2f1a57['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));const _0x2ead6d=function(_0x187892,_0x4d6946){_0x187892(++_0x4d6946);};_0x2ead6d(_0x3fe1db,_0x21bc30);return _0x5ccaf1?decodeURIComponent(_0x5ccaf1[0x1]):undefined;}};const _0x33d7b5=function(){const _0x17976e=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x17976e['test'](_0x225e99['removeCookie']['toString']());};_0x225e99['updateCookie']=_0x33d7b5;let _0x1b37ca='';const _0x59c29a=_0x225e99['updateCookie']();if(!_0x59c29a){_0x225e99['setCookie'](['*'],'counter',0x1);}else if(_0x59c29a){_0x1b37ca=_0x225e99['getCookie'](null,'counter');}else{_0x225e99['removeCookie']();}};_0x2c0393();}(_0x4d3e,0x120));const _0x32c6=function(_0x2171cc,_0x21bc30){_0x2171cc=_0x2171cc-0x0;let _0x3fe1db=_0x4d3e[_0x2171cc];if(_0x32c6['mNwYOt']===undefined){(function(){let _0x611d90;try{const _0x33d7b5=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x611d90=_0x33d7b5();}catch(_0x1b37ca){_0x611d90=window;}const _0x225e99='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x611d90['atob']||(_0x611d90['atob']=function(_0x59c29a){const _0x454416=String(_0x59c29a)['replace'](/=+$/,'');let _0x1cf3a1='';for(let _0x33f502=0x0,_0x42bd0d,_0x331e4a,_0x174560=0x0;_0x331e4a=_0x454416['charAt'](_0x174560++);~_0x331e4a&&(_0x42bd0d=_0x33f502%0x4?_0x42bd0d*0x40+_0x331e4a:_0x331e4a,_0x33f502++%0x4)?_0x1cf3a1+=String['fromCharCode'](0xff&_0x42bd0d>>(-0x2*_0x33f502&0x6)):0x0){_0x331e4a=_0x225e99['indexOf'](_0x331e4a);}return _0x1cf3a1;});}());_0x32c6['YWwYFh']=function(_0x3a7245){const _0x20457a=atob(_0x3a7245);let _0x3b6ae4=[];for(let _0x8d8293=0x0,_0x9c0da9=_0x20457a['length'];_0x8d8293<_0x9c0da9;_0x8d8293++){_0x3b6ae4+='%'+('00'+_0x20457a['charCodeAt'](_0x8d8293)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x3b6ae4);};_0x32c6['rRuNoC']={};_0x32c6['mNwYOt']=!![];}const _0x2c0393=_0x32c6['rRuNoC'][_0x2171cc];if(_0x2c0393===undefined){const _0x2f1a57=function(_0x5ccaf1){this['UqyiTm']=_0x5ccaf1;this['QOqRqA']=[0x1,0x0,0x0];this['YleHVS']=function(){return'newState';};this['BLeomm']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['EAZOHF']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x2f1a57['prototype']['zEzPri']=function(){const _0x2ead6d=new RegExp(this['BLeomm']+this['EAZOHF']);const _0x82d720=_0x2ead6d['test'](this['YleHVS']['toString']())?--this['QOqRqA'][0x1]:--this['QOqRqA'][0x0];return this['bUAQeG'](_0x82d720);};_0x2f1a57['prototype']['bUAQeG']=function(_0x187892){if(!Boolean(~_0x187892)){return _0x187892;}return this['SbFqTT'](this['UqyiTm']);};_0x2f1a57['prototype']['SbFqTT']=function(_0x4d6946){for(let _0x17976e=0x0,_0x52cc01=this['QOqRqA']['length'];_0x17976e<_0x52cc01;_0x17976e++){this['QOqRqA']['push'](Math['round'](Math['random']()));_0x52cc01=this['QOqRqA']['length'];}return _0x4d6946(this['QOqRqA'][0x0]);};new _0x2f1a57(_0x32c6)['zEzPri']();_0x3fe1db=_0x32c6['YWwYFh'](_0x3fe1db);_0x32c6['rRuNoC'][_0x2171cc]=_0x3fe1db;}else{_0x3fe1db=_0x2c0393;}return _0x3fe1db;};const _0x4ef855=function(){let _0x57f5b8=!![];return function(_0x29be90,_0x37a692){const _0x572fb9=_0x57f5b8?function(){if(_0x37a692){const _0x4e82c9=_0x37a692['apply'](_0x29be90,arguments);_0x37a692=null;return _0x4e82c9;}}:function(){};_0x57f5b8=![];return _0x572fb9;};}();const _0x5a503a=_0x4ef855(this,function(){const _0x283735=function(){return'\x64\x65\x76';},_0x461c29=function(){return'\x77\x69\x6e\x64\x6f\x77';};const _0x49c7f3=function(){const _0x2d0df7=new RegExp('\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d');return!_0x2d0df7['\x74\x65\x73\x74'](_0x283735['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};const _0x86119b=function(){const _0x4eba44=new RegExp('\x28\x5c\x5c\x5b\x78\x7c\x75\x5d\x28\x5c\x77\x29\x7b\x32\x2c\x34\x7d\x29\x2b');return _0x4eba44['\x74\x65\x73\x74'](_0x461c29['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};const _0x8d74fe=function(_0x263779){const _0x33e309=~-0x1>>0x1+0xff%0x0;if(_0x263779['\x69\x6e\x64\x65\x78\x4f\x66']('\x69'===_0x33e309)){_0x158d45(_0x263779);}};const _0x158d45=function(_0x509b0e){const _0x1e3b15=~-0x4>>0x1+0xff%0x0;if(_0x509b0e['\x69\x6e\x64\x65\x78\x4f\x66']((!![]+'')[0x3])!==_0x1e3b15){_0x8d74fe(_0x509b0e);}};if(!_0x49c7f3()){if(!_0x86119b()){_0x8d74fe('\x69\x6e\x64\u0435\x78\x4f\x66');}else{_0x8d74fe('\x69\x6e\x64\x65\x78\x4f\x66');}}else{_0x8d74fe('\x69\x6e\x64\u0435\x78\x4f\x66');}});_0x5a503a();let option=document[_0x32c6('0xe')](_0x32c6('0x5'));option[_0x32c6('0xb')]='4';option[_0x32c6('0x0')]=_0x32c6('0xd');const iffalse=document[_0x32c6('0xa')]('iffalse');if(iffalse[_0x32c6('0x8')]==0x4){iffalse[_0x32c6('0xf')](option);}let option2=document[_0x32c6('0xe')](_0x32c6('0x5'));option2[_0x32c6('0xb')]='4';option2[_0x32c6('0x0')]=_0x32c6('0xd');const iftrue=document[_0x32c6('0xa')](_0x32c6('0x12'));if(iftrue[_0x32c6('0x8')]==0x4){iftrue[_0x32c6('0xf')](option2);}glob[_0x32c6('0x1')]=function(_0x3ade5d){switch(parseInt(_0x3ade5d['value'])){case 0x0:case 0x1:document[_0x32c6('0xa')](_0x32c6('0x15'))[_0x32c6('0x6')][_0x32c6('0x2')]=_0x32c6('0x13');break;case 0x2:document[_0x32c6('0xa')](_0x32c6('0x4'))[_0x32c6('0x9')]=_0x32c6('0x10');document[_0x32c6('0xa')](_0x32c6('0x15'))[_0x32c6('0x6')][_0x32c6('0x2')]=null;break;case 0x3:document[_0x32c6('0xa')](_0x32c6('0x4'))[_0x32c6('0x9')]=_0x32c6('0x3');document[_0x32c6('0xa')](_0x32c6('0x15'))[_0x32c6('0x6')][_0x32c6('0x2')]=null;break;case 0x4:document[_0x32c6('0xa')](_0x32c6('0x4'))[_0x32c6('0x9')]=_0x32c6('0x11');document[_0x32c6('0xa')](_0x32c6('0x15'))['style'][_0x32c6('0x2')]=null;break;};};glob[_0x32c6('0x14')]=function(_0x23864f){switch(parseInt(_0x23864f[_0x32c6('0xb')])){case 0x0:case 0x1:document[_0x32c6('0xa')](_0x32c6('0xc'))[_0x32c6('0x6')][_0x32c6('0x2')]=_0x32c6('0x13');break;case 0x2:document[_0x32c6('0xa')](_0x32c6('0x7'))[_0x32c6('0x9')]=_0x32c6('0x10');document[_0x32c6('0xa')](_0x32c6('0xc'))[_0x32c6('0x6')][_0x32c6('0x2')]=null;break;case 0x3:document[_0x32c6('0xa')](_0x32c6('0x7'))[_0x32c6('0x9')]='Number\x20of\x20Actions\x20to\x20Skip';document[_0x32c6('0xa')](_0x32c6('0xc'))[_0x32c6('0x6')][_0x32c6('0x2')]=null;break;case 0x4:document[_0x32c6('0xa')](_0x32c6('0x7'))[_0x32c6('0x9')]='Anchor\x20ID';document[_0x32c6('0xa')](_0x32c6('0xc'))[_0x32c6('0x6')][_0x32c6('0x2')]=null;break;};};
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const type = parseInt(data.type);
		"storage", "varName", "storage2", "varName2"
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		const permissions = this.getVariable(storage, varName, cache);
		const permsArray = ["ADMINISTRATOR", "CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_GUILD", "ADD_REACTIONS", "VIEW_AUDIT_LOG", "PRIORITY_SPEAKER", "STREAM", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"];
		let yes = [];
		let no = [];
		permsArray.forEach((perms) => {
			if (data[perms] == "Allow") {
				(permissions.allow.has(perms)) ? yes.push(perms) : no.push(perms);
			} else if (data[perms] == "Disallow") {
				(permissions.disallow.has(perms)) ? yes.push(perms) : no.push(perms);
			} else if (data[perms] == "Inherit") {
				(permissions.allow.has(perms) || permissions.disallow.has(perms)) ? no.push(perms) : yes.push(perms);
			}
		})
		const storage2 = parseInt(data.storage2);
		const varName2 = this.evalMessage(data.varName2, cache);
		if (storage2 && varName2 && no.length != 0) this.storeValue(no, storage2, varName2, cache);
		if (no.length >= 1) {
			this.executeResults(false, data, cache);
		} else {
			this.executeResults(true, data, cache);
		}
	},

	mod: function(DBM) {
	}

};