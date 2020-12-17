module.exports = {
 name: "Local Database",
 section: "Database",
 version: "1.0.0",
 
 subtitle: function(data) {
  return `[${data.dbformat}] ${data.dboperation} ${data.dbpath || "<b><i>No path entered</i></b>"}`;
 },
 //---------------------------------------------------------------------
 // Action Storage Function
 //
 // Stores the relevant variable info for the editor.
 //---------------------------------------------------------------------

 variableStorage: function(data, varType) {
  const type = parseInt(data.storage);
  if(type !== varType) return;
  return ([data.varName, 'Object']);
 },
 
 
 //---------------------------------------------------------------------
 // Action Fields
 //
 // These are the fields for the action. These fields are customized
 // by creating elements with corresponding IDs in the HTML. These
 // are also the names of the fields stored in the action's JSON data.
 //---------------------------------------------------------------------
 
 fields: [ "dbformat", "dboperation", "dbpath", "dbvalue", "storage", "varName" ],
 
 //https://github.com/danthecomputerman/
 author: "CoolGuy",
 version: "1.1.0",

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
 <div id="docs" style="float: left;">
 </div><br>
 <div>
  <div style="float: left;">
   Database format:
  </div>
  <div style="padding-left: 15px; float: left;">
   <select id="dbformat" class="round" onchange="glob.onChangeFormat(this)">
    <option value="quick.db" selected>Quick.db</option>
    <option value="enmap">Enmap</option>
   </select>
  </div>
 </div><br><br>
 <div>
  <div style="float: left; width: 20%;">
   Operation:<br>
   <select id="dboperation" class="round" onchange="glob.onChangeOperation(this)">
    <option value="get" selected>Get/Fetch</option>
    <option value="store">Store/Save</option>
    <option value="delete">Delete</option>
   </select>
  </div>
  <div id="dbpathdiv" style="padding-left: 15px; float: left; width: 80%;">
   <div id="dbpathlabel">Something has broken. You should not be seeing this message.</div>
   <input id="dbpath" class="round" type="text"><br>
  </div>
 </div><br><br><br>
 <div id="dbvaluediv">
  <div id="dbvaluelabel" style="float: left;">
   Something has broken. You should not be seeing this message.
  </div>
  <input id="dbvalue" class="round" type="text" placeholder="Leave blank for no value."><br>
 </div>
 <div>
  <div style="float: left; width: 25%;">
   Store In:<br>
   <select id="storage" class="round">
    ${data.variables[1]}
   </select>
  </div>
  <div style="float: right; padding-left: 15px; float: left; width: 74%;">
   Variable Name:<br>
   <input id="varName" class="round" type="text"><br>
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
  const { glob, document } = this;
  
  function updateVisibility(id, visible) {
   document.getElementById(id).style.display = (visible) ? null : 'none'
  }
  
  function updateContents(id, str) {
   document.getElementById(id).innerHTML = str;
  }
  
  glob.onChangeFormat = function(event) {
   let select_str = `<select id="dboperation" class="round" onchange="glob.onChangeOperation(this)">`;
   let doc_str = `<div id="docs" style="float: left;">`;
   
   switch (event.value) {
    case "quick.db":
     select_str += `<option value="get" selected>Get/Fetch</option>
     <option value="store">Store/Save</option>
     <option value="delete">Delete</option>
     <option value="has">Has</option>
     <option value="add">Add</option>
     <option value="subtract">Subtract</option>
     <option value="push">Push</option>
     <option value="all">All</option>`;
     doc_str = `For Quick.db documentation, visit <a href="https://quickdb.js.org/overview/docs">this link</a>`;
     break;
    case "enmap":
     select_str += `<option value="get" selected>Get/Fetch</option>
     <option value="store">Store/Save</option>
     <option value="delete">Delete</option>
     <option value="has">Has</option>
     <option value="size">Size (Cached only)</option>
     <option value="count">Count (Cached &amp; Uncached)</option>
     <option value="push">Push</option>
     <option value="remove">Remove</option>
     <option value="increment">Increment</option>
     <option value="decrement">Decrement</option>
     <option value="fetcheverything">FetchEverything</option>
     <option value="indexes">Indexes</option>
     <option value="ensure">Ensure</option>
     <option value="clear">Clear</option>
     <option value="array">Array</option>
     <option value="randomkey">RandomKey</option>
     <option value="defer">Defer</option>`;
     doc_str = `For Enmap documentation, visit <a href="https://enmap.evie.dev/usage">this link</a>`;
     break;
    default:
     select_str += `<option value="get" selected>Get/Fetch</option>
     <option value="store">Store/Save</option>
     <option value="delete">Delete</option>`;
     break;
   }
   select_str += "</select>"; doc_str += "</div>";
   updateContents("dboperation", select_str);
   updateContents("docs", doc_str);
   
   glob.onChangeOperation(document.getElementById('dboperation'));
  };
  
  glob.onChangeOperation = function(event) {
   switch(document.getElementById('dbformat').value) {
    case "quick.db":
     switch(event.value) {
      case "store":
       updateContents('dbpathlabel', `Path string (split path by .) Example: <b><u><i>servers.1234567890</i></u></b>:`);
       updateContents('dbvaluelabel', `Value:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`);
       updateVisibility('dbvaluediv', true);
       updateVisibility('dbpathdiv', true);
       break;
      case "add":
      case "subtract":
      case "push":
       updateContents('dbpathlabel', `Path string (split path by .) Example: <b><u><i>servers.1234567890</i></u></b>:`);
       updateContents('dbvaluelabel', `Value:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`);
       updateVisibility('dbvaluediv', true);
       updateVisibility('dbpathdiv', true);
       break;
      case "all":
       updateContents('dbpathlabel', `Path string (split path by .) Example: <b><u><i>servers.1234567890</i></u></b>:`);
       updateContents('dbvaluelabel', `Value:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`);
       updateVisibility('dbvaluediv', false);
       updateVisibility('dbpathdiv', false);
       break;
      default:
       updateContents('dbpathlabel', `Path string (split path by .) Example: <b><u><i>servers.1234567890</i></u></b>:`);
       updateContents('dbvaluelabel', `Value:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`);
       updateVisibility('dbpathdiv', true);
       updateVisibility('dbvaluediv', false);
       break;
     }
     break;
    case "enmap":
     switch (event.value) {
      case "store":
      case "has":
      case "push":
      case "remove":
      case "ensure":
       updateVisibility('dbpathdiv', true);
       updateVisibility('dbvaluediv', true);
       updateContents('dbpathlabel', `Path string (split path by .) Example: <b><u><i>servers.1234567890</i></u></b>:`);
       updateContents('dbvaluelabel', `Value:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`);
       break;
      case "size":
      case "count":
      case "fetcheverything":
      case "indexes":
      case "clear":
      case "defer":
      case "array":
       updateVisibility('dbpathdiv', true);
       updateVisibility('dbvaluediv', false);
       updateContents('dbpathlabel', `Table string. Example: <b><u><i>servers</i></u></b>:`);
       updateContents('dbvaluelabel', `Value:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`);
       break;
      case "increment":
      case "decrement":
       updateVisibility('dbpathdiv', true);
       updateVisibility('dbvaluediv', false);
       updateContents('dbpathlabel', `Path string (split path by .) Example: <b><u><i>servers.1234567890</i></u></b>:`);
       updateContents('dbvaluelabel', `Value:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`);
       break;
      case "randomkey":
       updateVisibility('dbpathdiv', true);
       updateVisibility('dbvaluediv', true);
       updateContents('dbpathlabel', `Table string. Example: <b><u><i>servers</i></u></b>:`);
       break;
       updateContents('dbvaluelabel', `Number of random keys:`);
       break;
      default:
       updateContents('dbpathlabel', `Path string (split path by .) Example: <b><u><i>servers.1234567890</i></u></b>:`);
       updateContents('dbvaluelabel', `Value:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`);
       updateVisibility('dbpathdiv', true);
       updateVisibility('dbvaluediv', false);
       break;
     }
     break;
   }
  };
  
  async function wait(id, time) {
   await new Promise(resolve => setTimeout(resolve, time));
   glob.onChangeOperation(document.getElementById(id));
  }
  
  glob.onChangeFormat(document.getElementById('dbformat'));
  
  wait('dboperation', 50); // used b/c custom html isn't immediately available.
 },

 //---------------------------------------------------------------------
 // Action Bot Function
 //
 // This is the function for the action within the Bot's Action class.
 // Keep in mind event calls won't have access to the "msg" parameter, 
 // so be sure to provide checks for variable existance.
 //---------------------------------------------------------------------

 action: function(cache) {
  const functhis = this;
  const data = cache.actions[cache.index];
  const dboperation = data.dboperation;
  const dbpath = this.evalMessage(data.dbpath, cache);
  const splitpath = dbpath.split(".");
  const dbvalue = this.eval(this.evalMessage(data.dbvalue, cache), cache);
  const dbformat = data.dbformat;
  const db = this.getMods().require(dbformat); // safe require.
  let output; let done = false;
  
  if (!dbpath || !splitpath[0]) throw new Error("No DB path provided.");
  
  switch (dbformat) {
   case "quick.db": // quick.db
    switch (dboperation) {
     case "get":
      output = db.get(dbpath);
      break;
     case "store":
      output = db.set(dbpath, dbvalue);
      break;
     case "delete":
      output = db.delete(dbpath);
      break;
     case "has":
      output = db.has(dbpath);
      break;
     case "add":
      output = db.add(dbpath, dbvalue);
      break;
     case "subtract":
      output = db.subtract(dbpath, dbvalue);
      break;
     case "push":
      output = db.push(dbpath, dbvalue);
      break;
     case "all":
      output = db.all();
      break;
    }
    finished();
    break;
   case "enmap": // enmap
    (async () => {
     let value = splitpath.slice(2, splitpath.length);
     const enmap = new db({ name: splitpath[0] });
     console.log(enmap);
     switch (dboperation) {
      case "get":
       output = enmap.get(splitpath[1], (value.length === 0) ? null : value);
       break;
      case "store":
       output = enmap.set(splitpath[1], dbvalue, (value.length === 0) ? null : value);
       break;
      case "delete":
       output = enmap.delete(splitpath[1], (value.length === 0) ? null : value);
       break;
      case "has":
       output = enmap.has(splitpath[1], (value.length === 0) ? null : value);
       break;
      case "size":
       output = enmap.size;
       break;
      case "count":
       output = enmap.count;
       break;
      case "push":
       output = enmap.push(splitpath[1], dbvalue, (value.length === 0) ? null : value);
       break;
      case "remove":
       output = enmap.remove(splitpath[1], dbvalue, (value.length === 0) ? null : value);
       break;
      case "increment":
       output = enmap.inc(splitpath[1], (value.length === 0) ? null : value);
       break;
      case "decrement":
       output = enmap.dec(splitpath[1], (value.length === 0) ? null : value);
       break;
      case "fetcheverything":
       output = enmap.fetchEverything();
       break;
      case "indexes":
       output = enmap.indexes;
       break;
      case "ensure":
       output = enmap.ensure(splitpath[1], dbvalue, (value.length === 0) ? null : value);
       break;
      case "clear":
       output = enmap.clear();
       break;
      case "array":
       output = enmap.array();
       break;
      case "randomkey":
       output = enmap.randomKey(parseInt(dbpath) || 1);
       break;
      case "defer":
       output = await enmap.defer;
       break;
     }
     finished();
    })()
    break;
  }
  
  function finished() { // Easy way to hand-wave away and synchronous or asynchronous callback function.
   const varName = functhis.evalMessage(data.varName, cache);
   const storage = parseInt(data.storage);
   functhis.storeValue(output, storage, varName, cache);
   functhis.callNextAction(cache);
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
