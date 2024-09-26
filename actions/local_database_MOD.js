module.exports = {
  name: 'Local Database',
  section: 'Database',
  meta: {
    version: '2.1.7',
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

  html() {
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
 </div>
 <br><br>

 <div>
  <div style="float: left; width: 20%;">
   <span class="dbminputlabel">Operation</span>
   <select id="dboperation" class="round" onchange="glob.onChangeOperation(this)">
    <option value="get" selected>Get/Fetch</option>
    <option value="store">Store/Save</option>
    <option value="delete">Delete</option>
   </select>
  </div>
  <div id="dbpathdiv" style="padding-left: 15px; float: left; width: 80%;">
   <div class="dbminputlabel" style="display: inline-block" id="dbpathlabel">Something has broken. You should not be seeing this message.</div>
   <input id="dbpath" placeholder="" class="round" type="text"><br>
  </div>
 </div>
 <br><br><br>

 <div id="dbvaluediv">
  <div class="dbminputlabel" id="dbvaluelabel" style="float: left;">
   Something has broken. You should not be seeing this message.
  </div>
  <input id="dbvalue" class="round" type="text"><br>
 </div>

 <div>
   <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
 </div>`;
  },

  init() {
    const { glob, document } = this;

    function updateVisibility(id, visible) {
      document.getElementById(id).style.display = visible ? null : 'none';
    }

    function updateContents(id, str, pathplaceholder) {
      document.getElementById(id).innerHTML = str;
      if (pathplaceholder) document.getElementById('dbpath').placeholder = pathplaceholder;
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
     <option value="pull">Pull</option>
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
              updateContents('dbpathlabel', 'Path string', 'Split path by . (Example: servers.1234567890)');
              updateContents('dbvaluelabel', 'Value');
              updateVisibility('dbvaluediv', true);
              updateVisibility('dbpathdiv', true);
              break;
            case 'add':
            case 'subtract':
            case 'push':
              updateContents('dbpathlabel', 'Path string', 'Split path by . (Example: servers.1234567890)');
              updateContents('dbvaluelabel', 'Value');
              updateVisibility('dbvaluediv', true);
              updateVisibility('dbpathdiv', true);
              break;

            case 'pull':
              updateContents('dbpathlabel', 'Path string', 'Split path by . (Example: servers.1234567890)');
              updateContents('dbvaluelabel', 'Value');
              updateVisibility('dbvaluediv', true);
              updateVisibility('dbpathdiv', true);
              break;
            case 'all':
              updateContents('dbpathlabel', 'Path string', 'Split path by . (Example: servers.1234567890)');
              updateContents('dbvaluelabel', 'Value');
              updateVisibility('dbvaluediv', false);
              updateVisibility('dbpathdiv', false);
              break;
            default:
              updateContents('dbpathlabel', 'Path string', 'Split path by . (Example: servers.1234567890)');
              updateContents('dbvaluelabel', 'Value');
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
              updateContents('dbpathlabel', 'Path string', 'Split path by . (Example: servers.1234567890)');
              updateContents('dbvaluelabel', 'Value');
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
              updateContents('dbpathlabel', 'Table string', 'Example: servers');
              updateContents('dbvaluelabel', 'Value');
              break;
            case 'increment':
            case 'decrement':
              updateVisibility('dbpathdiv', true);
              updateVisibility('dbvaluediv', false);
              updateContents('dbpathlabel', 'Path string', 'Split path by . (Example: servers.1234567890)');
              updateContents('dbvaluelabel', 'Value');
              break;
            case 'randomkey':
              updateVisibility('dbpathdiv', true);
              updateVisibility('dbvaluediv', true);
              updateContents('dbpathlabel', 'Table string', 'Example: servers');
              updateContents('dbvaluelabel', 'Number of random keys');
              break;
            default:
              updateContents('dbpathlabel', 'Path string', 'Split path by . (Example: servers.1234567890)');
              updateContents('dbvaluelabel', 'Value');
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
    let db = this.getMods().require(dbformat); // safe require.
    let output;

    if (!dbpath || !splitpath[0]) throw new Error('No DB path provided.');

    switch (dbformat) {
      case 'quick.db': {
        const version = db.version;
        // Support older versions of quick.db (v7)
        if (!version) {
          db = new db.QuickDB();
        }
        switch (dboperation) {
          case 'get':
            output = await db.get(dbpath);
            break;
          case 'store':
            output = await db.set(dbpath, dbvalue);
            break;
          case 'delete':
            output = await db.delete(dbpath);
            break;
          case 'has':
            output = await db.has(dbpath);
            break;
          case 'add':
            output = await db.add(dbpath, dbvalue);
            break;
          case 'subtract':
            if (!version) output = await db.sub(dbpath, dbvalue);
            else output = await db.subtract(dbpath, dbvalue);
            break;
          case 'push':
            output = await db.push(dbpath, dbvalue);
            break;
          case 'pull':
            output = await db.pull(dbpath, dbvalue);
            break;
          case 'all':
            output = await db.all();
            break;
        }
        break;
      }
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
