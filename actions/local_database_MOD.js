module.exports = {
  name: 'Local Database',
  section: 'Database',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/local_database_MOD.js',
  },

  subtitle(data) {
    return `[${data.dbformat}] ${data.dboperation} ${data.dbpath || '<b><i>No path entered</i></b>'}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Object'];
  },

  fields: ['dbformat', 'dboperation', 'dbpath', 'dbvalue', 'storage', 'varName'],

  html(_isEvent, data) {
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
 </div>`;
  },

  init() {
    const { glob, document } = this;

    function updateVisibility(id, visible) {
      document.getElementById(id).style.display = visible ? null : 'none';
    }

    function updateContents(id, str) {
      document.getElementById(id).innerHTML = str;
    }

    glob.onChangeFormat = function onChangeFormat(event) {
      let selectStr = '<select id="dboperation" class="round" onchange="glob.onChangeOperation(this)">';
      let docStr = '<div id="docs" style="float: left;">';

      switch (event.value) {
        case 'quick.db':
          selectStr += `<option value="get" selected>Get/Fetch</option>
     <option value="store">Store/Save</option>
     <option value="delete">Delete</option>
     <option value="has">Has</option>
     <option value="add">Add</option>
     <option value="subtract">Subtract</option>
     <option value="push">Push</option>
     <option value="all">All</option>`;
          docStr = 'For Quick.db documentation, visit <a href="https://quickdb.js.org/overview/docs">this link</a>';
          break;
        case 'enmap':
          selectStr += `<option value="get" selected>Get/Fetch</option>
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
          docStr = 'For Enmap documentation, visit <a href="https://enmap.evie.dev/usage">this link</a>';
          break;
        default:
          selectStr += `<option value="get" selected>Get/Fetch</option>
     <option value="store">Store/Save</option>
     <option value="delete">Delete</option>`;
          break;
      }
      selectStr += '</select>';
      docStr += '</div>';
      updateContents('dboperation', selectStr);
      updateContents('docs', docStr);

      glob.onChangeOperation(document.getElementById('dboperation'));
    };

    glob.onChangeOperation = function onChangeOperation(event) {
      switch (document.getElementById('dbformat').value) {
        case 'quick.db':
          switch (event.value) {
            case 'store':
              updateContents(
                'dbpathlabel',
                'Path string (split path by .) Example: <b><u><i>servers.1234567890</i></u></b>:',
              );
              updateContents('dbvaluelabel', 'Value:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
              updateVisibility('dbvaluediv', true);
              updateVisibility('dbpathdiv', true);
              break;
            case 'add':
            case 'subtract':
            case 'push':
              updateContents(
                'dbpathlabel',
                'Path string (split path by .) Example: <b><u><i>servers.1234567890</i></u></b>:',
              );
              updateContents('dbvaluelabel', 'Value:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
              updateVisibility('dbvaluediv', true);
              updateVisibility('dbpathdiv', true);
              break;
            case 'all':
              updateContents(
                'dbpathlabel',
                'Path string (split path by .) Example: <b><u><i>servers.1234567890</i></u></b>:',
              );
              updateContents('dbvaluelabel', 'Value:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
              updateVisibility('dbvaluediv', false);
              updateVisibility('dbpathdiv', false);
              break;
            default:
              updateContents(
                'dbpathlabel',
                'Path string (split path by .) Example: <b><u><i>servers.1234567890</i></u></b>:',
              );
              updateContents('dbvaluelabel', 'Value:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
              updateVisibility('dbpathdiv', true);
              updateVisibility('dbvaluediv', false);
              break;
          }
          break;
        case 'enmap':
          switch (event.value) {
            case 'store':
            case 'has':
            case 'push':
            case 'remove':
            case 'ensure':
              updateVisibility('dbpathdiv', true);
              updateVisibility('dbvaluediv', true);
              updateContents(
                'dbpathlabel',
                'Path string (split path by .) Example: <b><u><i>servers.1234567890</i></u></b>:',
              );
              updateContents('dbvaluelabel', 'Value:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
              break;
            case 'size':
            case 'count':
            case 'fetcheverything':
            case 'indexes':
            case 'clear':
            case 'defer':
            case 'array':
              updateVisibility('dbpathdiv', true);
              updateVisibility('dbvaluediv', false);
              updateContents('dbpathlabel', 'Table string. Example: <b><u><i>servers</i></u></b>:');
              updateContents('dbvaluelabel', 'Value:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
              break;
            case 'increment':
            case 'decrement':
              updateVisibility('dbpathdiv', true);
              updateVisibility('dbvaluediv', false);
              updateContents(
                'dbpathlabel',
                'Path string (split path by .) Example: <b><u><i>servers.1234567890</i></u></b>:',
              );
              updateContents('dbvaluelabel', 'Value:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
              break;
            case 'randomkey':
              updateVisibility('dbpathdiv', true);
              updateVisibility('dbvaluediv', true);
              updateContents('dbpathlabel', 'Table string. Example: <b><u><i>servers</i></u></b>:');
              updateContents('dbvaluelabel', 'Number of random keys:');
              break;
            default:
              updateContents(
                'dbpathlabel',
                'Path string (split path by .) Example: <b><u><i>servers.1234567890</i></u></b>:',
              );
              updateContents('dbvaluelabel', 'Value:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
              updateVisibility('dbpathdiv', true);
              updateVisibility('dbvaluediv', false);
              break;
          }
          break;
      }
    };

    async function wait(id, time) {
      await new Promise((resolve) => setTimeout(resolve, time));
      glob.onChangeOperation(document.getElementById(id));
    }

    glob.onChangeFormat(document.getElementById('dbformat'));

    wait('dboperation', 50); // used b/c custom html isn't immediately available.
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const { dboperation } = data;
    const dbpath = this.evalMessage(data.dbpath, cache);
    const splitpath = dbpath.split('.');
    const dbvalue = this.eval(this.evalMessage(data.dbvalue, cache), cache);
    const { dbformat } = data;
    const db = this.getMods().require(dbformat); // safe require.
    let output;

    if (!dbpath || !splitpath[0]) throw new Error('No DB path provided.');

    switch (dbformat) {
      case 'quick.db': // quick.db
        switch (dboperation) {
          case 'get':
            output = db.get(dbpath);
            break;
          case 'store':
            output = db.set(dbpath, dbvalue);
            break;
          case 'delete':
            output = db.delete(dbpath);
            break;
          case 'has':
            output = db.has(dbpath);
            break;
          case 'add':
            output = db.add(dbpath, dbvalue);
            break;
          case 'subtract':
            output = db.subtract(dbpath, dbvalue);
            break;
          case 'push':
            output = db.push(dbpath, dbvalue);
            break;
          case 'all':
            output = db.all();
            break;
        }
        break;
      case 'enmap': {
        // enmap
        const value = splitpath.slice(2, splitpath.length);
        // eslint-disable-next-line new-cap
        const enmap = new db({
          name: splitpath[0],
        });
        switch (dboperation) {
          case 'get':
            output = enmap.get(splitpath[1], value.length === 0 ? null : value);
            break;
          case 'store':
            output = enmap.set(splitpath[1], dbvalue, value.length === 0 ? null : value);
            break;
          case 'delete':
            output = enmap.delete(splitpath[1], value.length === 0 ? null : value);
            break;
          case 'has':
            output = enmap.has(splitpath[1], value.length === 0 ? null : value);
            break;
          case 'size':
            output = enmap.size;
            break;
          case 'count':
            output = enmap.count;
            break;
          case 'push':
            output = enmap.push(splitpath[1], dbvalue, value.length === 0 ? null : value);
            break;
          case 'remove':
            output = enmap.remove(splitpath[1], dbvalue, value.length === 0 ? null : value);
            break;
          case 'increment':
            output = enmap.inc(splitpath[1], value.length === 0 ? null : value);
            break;
          case 'decrement':
            output = enmap.dec(splitpath[1], value.length === 0 ? null : value);
            break;
          case 'fetcheverything':
            output = enmap.fetchEverything();
            break;
          case 'indexes':
            output = enmap.indexes;
            break;
          case 'ensure':
            output = enmap.ensure(splitpath[1], dbvalue, value.length === 0 ? null : value);
            break;
          case 'clear':
            output = enmap.clear();
            break;
          case 'array':
            output = enmap.array();
            break;
          case 'randomkey':
            output = enmap.randomKey(parseInt(dbpath, 10) || 1);
            break;
          case 'defer':
            output = await enmap.defer;
            break;
        }
        break;
      }
    }

    const varName = this.evalMessage(data.varName, cache);
    const storage = parseInt(data.storage, 10);
    this.storeValue(output, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
