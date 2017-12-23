

//---------------------------------------------------------------------
// WrexMODS - for Discord Bot Maker
// Contains functions for actions using WrexMODS
//---------------------------------------------------------------------
const WrexMODS= {};

WrexMODS.API = {};

WrexMODS.DBM = null;

WrexMODS.Version = "1.0.2";

WrexMODS.MaxInstallAttempts = 3;

// Add Extra Variables Here
//---------------------------------------------------------------------


//---------------------------------------------------------------------
var currentInstallAttempts = 0;
WrexMODS.CheckAndInstallNodeModule = function(moduleName){


	var installed = false;

	let result;

	try {
		result = require.resolve(moduleName);

		currentInstallAttempts = 0;
		installed = true;
	} catch(e) {

		if(currentInstallAttempts >= this.MaxInstallAttempts){
			console.error("WrexMods: Could not automatically install " + moduleName + ". (Install attempt limit reached) Please install it manually 'npm install " + moduleName + "' before continuing.");
			return false;
		}

			
		try {
			console.log("Installing Node Module: " + moduleName);	
			var child = this.require('child_process');
			var cliCommand = 'npm install ' + moduleName + " --loglevel=error";
			result = child.execSync(cliCommand,{stdio:[0,1,2]});
			
			currentInstallAttempts += 1;			
		} catch (error) {
			console.error("Could not automatically install " + moduleName + " Please install it manually 'npm install " + moduleName + "' before continuing.");
			result = error;
		}
	}	  	

	return installed;
}

WrexMODS.require = function(moduleName){
	/// <summary> Custom require function that will attempt to install the module if it doesn't exist</summary>
	/// <returns type="Object">The required module</returns>
	this.CheckAndInstallNodeModule(moduleName);	
	return require(moduleName);
}

WrexMODS.checkURL = function (url){
    /// <summary>Checks if the provided URL is valid.</summary>  
    /// <param name="url" type="String">The URL to check.</param>  
	/// <returns type="Boolean">True if valid.</returns>  
  
	if(!url){
		return false;
	}

    var validUrl = this.require('valid-url');
    
    if (validUrl.isUri(url)){
        return true;
    } 
    else {
        return false;
    }
};

WrexMODS.runPostJson = function (url, json, returnJson = true, callback){
    /// <summary>Runs a Request to return JSON Data</summary>  
	/// <param name="url" type="String">The URL to post the JSON to.</param>  
	/// <param name="json" type="String">The json to post</param>  
	/// <param name="returnJson" type="Boolean">True if the response should be in JSON format. False if not</param>  
    /// <param name="callback" type="Function">The callback function, args: error, statusCode, data</param>  
	var request = this.require('request');
	
	var options = {
	  url: url,
	  method: 'POST',
	  json: json
	};
	
	request(options, function (err, res, data) {
		var statusCode = res.statusCode;
		
		if(callback && typeof callback == "function"){
			callback(err, statusCode, data);
		}
	});  
};

/*
    var json = {    
		"permission_overwrites": [],
		"name": tempVars("myChannel"),
		"parent_id": null,
		"nsfw": false,
		"position": 0,
		"guild_id": msg.guild.id,
		"type": 4
	}
*/

// this.getWrexMods().executeDiscordJSON("POST", "guilds/" + msg.guild.id + "/channels", json ,this.getDBM(), cache)

WrexMODS.executeDiscordJSON = function(type, urlPath, json ,DBM, cache, callback){
	return new Promise((resolve, reject) => {

		var request = this.require('request');
	
			var options = {
				headers: {
					'Authorization': 'Bot ' + DBM.Files.data.settings.token
				},
				url: "https://discordapp.com/api/v6/" + urlPath,
				method: type,
				json: json
			};
	
		request(options, function (err, res, data) {
			var statusCode = res.statusCode;	

			if(err){
				reject({err, statusCode, data});
			}else{
				resolve({err, statusCode, data})		
			}			
			
			if(callback && typeof callback == "function"){
				callback(err, statusCode, data);
			}
		});  
	});			
}


WrexMODS.runPublicRequest = function (url, returnJson = false, callback, token, user, pass){
    /// <summary>Runs a Request to return JSON Data</summary>  
	/// <param name="url" type="String">The URL to get JSON from.</param>  
	/// <param name="returnJson" type="String">True if the response should be in JSON format. False if not</param>  
    /// <param name="callback" type="Function">The callback function, args: error, statusCode, data</param>  
    var request = this.require("request");
		   
	request.get({
		url: url,
		json: returnJson,
		headers: {'User-Agent': 'Other'},
		auth: {
			bearer: token,
			user: user,
			pass: pass,
			sendImmediately: false
		  },
	  }, (err, res, data) => {    

        var statusCode = res.statusCode;
   
        if(callback && typeof callback == "function"){
            callback(err, statusCode, data);
        }
    });	

   
};

WrexMODS.runBearerTokenRequest = function (url, returnJson = false, bearerToken, callback){
	/// <summary>Runs a Request to return HTML Data using a bearer Token.</summary>  
	/// <param name="url" type="String">The URL to get JSON from.</param>  
	/// <param name="returnJson" type="String">True if the response should be in JSON format. False if not</param>  
	/// <param name="bearerToken" type="String">The token to run the request with.</param>  
	/// <param name="callback" type="Function">The callback function, args: error, statusCode, data</param>  
    var request = this.require("request");
	
	request.get({
		url: url,
		json: returnJson,
		auth: {
			bearer: bearerToken
		  },
		headers: {'User-Agent': 'Other'}
		}, (err, res, data) => {    

		var statusCode = res.statusCode;

		if(callback && typeof callback == "function"){
			callback(err, statusCode, data);
		}
	});	
};

WrexMODS.runBasicAuthRequest = function (url, returnJson = false, username, password, callback){
	/// <summary>Runs a Request to return HTML Data</summary>  
	/// <param name="url" type="String">The URL to get JSON from.</param>  
	/// <param name="returnJson" type="String">True if the response should be in JSON format. False if not</param>  
	/// <param name="username" type="String">The username for the request</param>  
	/// <param name="password" type="String">The password for the request</param>  
	/// <param name="callback" type="Function">The callback function, args: error, statusCode, data</param>  
    var request = this.require("request");
	
	request.get({
		url: url,
		json: returnJson,
		auth: {
			user: user,
			pass: password,
			sendImmediately: false
		  },
		headers: {'User-Agent': 'Other'}
		}, (err, res, data) => {    

		var statusCode = res.statusCode;

		if(callback && typeof callback == "function"){
			callback(err, statusCode, data);
		}
	});	
};


WrexMODS.jsonPath = function(obj, expr, arg) {

	//JSONPath 0.8.0 - XPath for JSON
	//JSONPath Expressions: http://goessner.net/articles/JsonPath/index.html#e2
	//http://jsonpath.com/
  	//function jsonPath(obj, expr, arg)
  	//Copyright (c) 2007 Stefan Goessner (goessner.net)
  	//Licensed under the MIT (MIT-LICENSE.txt) licence.
	var P = {
	   resultType: arg && arg.resultType || "VALUE",
	   result: [],
	   normalize: function(expr) {
		  var subx = [];
		  return expr.replace(/[\['](\??\(.*?\))[\]']/g, function($0,$1){return "[#"+(subx.push($1)-1)+"]";})
					 .replace(/'?\.'?|\['?/g, ";")
					 .replace(/;;;|;;/g, ";..;")
					 .replace(/;$|'?\]|'$/g, "")
					 .replace(/#([0-9]+)/g, function($0,$1){return subx[$1];});
	   },
	   asPath: function(path) {
		  var x = path.split(";"), p = "$";
		  for (var i=1,n=x.length; i<n; i++)
			 p += /^[0-9*]+$/.test(x[i]) ? ("["+x[i]+"]") : ("['"+x[i]+"']");
		  return p;
	   },
	   store: function(p, v) {
		  if (p) P.result[P.result.length] = P.resultType == "PATH" ? P.asPath(p) : v;
		  return !!p;
	   },
	   trace: function(expr, val, path) {
		  if (expr) {
			 var x = expr.split(";"), loc = x.shift();
			 x = x.join(";");
			 if (val && val.hasOwnProperty(loc))
				P.trace(x, val[loc], path + ";" + loc);
			 else if (loc === "*")
				P.walk(loc, x, val, path, function(m,l,x,v,p) { P.trace(m+";"+x,v,p); });
			 else if (loc === "..") {
				P.trace(x, val, path);
				P.walk(loc, x, val, path, function(m,l,x,v,p) { typeof v[m] === "object" && P.trace("..;"+x,v[m],p+";"+m); });
			 }
			 else if (/,/.test(loc)) { // [name1,name2,...]
				for (var s=loc.split(/'?,'?/),i=0,n=s.length; i<n; i++)
				   P.trace(s[i]+";"+x, val, path);
			 }
			 else if (/^\(.*?\)$/.test(loc)) // [(expr)]
				P.trace(P.eval(loc, val, path.substr(path.lastIndexOf(";")+1))+";"+x, val, path);
			 else if (/^\?\(.*?\)$/.test(loc)) // [?(expr)]
				P.walk(loc, x, val, path, function(m,l,x,v,p) { if (P.eval(l.replace(/^\?\((.*?)\)$/,"$1"),v[m],m)) P.trace(m+";"+x,v,p); });
			 else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) // [start:end:step]  phyton slice syntax
				P.slice(loc, x, val, path);
		  }
		  else
			 P.store(path, val);
	   },
	   walk: function(loc, expr, val, path, f) {
		  if (val instanceof Array) {
			 for (var i=0,n=val.length; i<n; i++)
				if (i in val)
				   f(i,loc,expr,val,path);
		  }
		  else if (typeof val === "object") {
			 for (var m in val)
				if (val.hasOwnProperty(m))
				   f(m,loc,expr,val,path);
		  }
	   },
	   slice: function(loc, expr, val, path) {
		  if (val instanceof Array) {
			 var len=val.length, start=0, end=len, step=1;
			 loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function($0,$1,$2,$3){start=parseInt($1||start);end=parseInt($2||end);step=parseInt($3||step);});
			 start = (start < 0) ? Math.max(0,start+len) : Math.min(len,start);
			 end   = (end < 0)   ? Math.max(0,end+len)   : Math.min(len,end);
			 for (var i=start; i<end; i+=step)
				P.trace(i+";"+expr, val, path);
		  }
	   },
	   eval: function(x, _v, _vname) {
		  try { return $ && _v && eval(x.replace(/@/g, "_v")); }
		  catch(e) { throw new SyntaxError("jsonPath: " + e.message + ": " + x.replace(/@/g, "_v").replace(/\^/g, "_a")); }
	   }
	};
 
	var $ = obj;
	if (expr && obj && (P.resultType == "VALUE" || P.resultType == "PATH")) {
	   P.trace(P.normalize(expr).replace(/^\$;/,""), obj, "$");
	   return P.result.length ? P.result : false;
	}
 } 
 
// This function is called by DBM when the bot is started
var customaction = {};
customaction.name = "WrexMODS";
customaction.section = "JSON Things";
customaction.author = "General Wrex";
customaction.version = "1.8.2";
customaction.short_description = "Required for some mods. Does nothing";

customaction.html = function() { 
	return `
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
     <p>
		<u>Wrexmods Dependencies:</u><br><br>
		This isn't an action, but it is required for the actions under this category. <br><br> 
		<b> Create action wont do anything </b>
	</p>
</div>`	
};


customaction.mod = function(DBM) {

	WrexMODS.DBM = DBM
	
	WrexMODS.CheckAndInstallNodeModule("request");
	WrexMODS.CheckAndInstallNodeModule("extend");
    WrexMODS.CheckAndInstallNodeModule("valid-url");

	DBM.Actions.getWrexMods = function(){		
		return WrexMODS;
	}
};		
module.exports = customaction; 
 
