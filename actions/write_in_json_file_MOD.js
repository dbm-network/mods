module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Write In Json File',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Json Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const filePath = data.filePath || 'file.json';
    return `Edit JSON File: ${filePath}`;
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Shadow',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadUrl: 'https://github.com/dbm-network/mods',
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName, 'File Path'];
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['filePath', 'action', 'key', 'value', 'index', 'newName', 'storage', 'varName'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
  <div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->1.0</a></div>
  

    <div style="padding: 10px;">
    <span class="dbminputlabel">File Path</span>
    <input id="filePath" class="round" type="text" value="resources/file.json">
    <br><br>
    <span class="dbminputlabel">Action</span><br>
    <select id="action" class="round">
      <option value="1" selected>Merge Object (add/merge object)</option>
      <option value="2">Delete Property (delete property)</option>
      <option value="3">Overwrite Property (overwrite property)</option>
      <option value="4">Push to Array (push to array)</option>
      <option value="5">Increment Numeric Value (increment number)</option>
      <option value="6">Decrement Numeric Value (decrement number)</option>
      <option value="7">Toggle Boolean (toggle boolean)</option>
      <option value="8">Rename Property (rename property)</option>
      <option value="9">Delete Array Element by Index (delete array element by index)</option>
      <option value="10">Insert into Array at Index (insert into array at index)</option>
      <option value="11">Pop from Array (pop last element from array)</option>
      <option value="12">Shift from Array (remove first element from array)</option>
      <option value="13">Unshift into Array (add element at beginning of array)</option>
      <option value="14">Clear Array (clear array)</option>
    </select>
    <br><br>
    <div id="keyContainer">
      <span class="dbminputlabel">Property Path (e.g. user.profile.name)</span>
      <input id="key" class="round" type="text" placeholder="Optional, if empty the operation applies to the entire object">
      <br><br>
    </div>
    <div id="valueContainer">
      <span class="dbminputlabel">Value (JSON or text)</span>
      <input id="value" class="round" type="text" placeholder='E.g. {"age":30} or "text"'>
      <br><br>
    </div>
    <div id="indexContainer">
      <span class="dbminputlabel">Index (for array operations)</span>
      <input id="index" class="round" type="text" placeholder="E.g. 0">
      <br><br>
    </div>
    <div id="newNameContainer">
      <span class="dbminputlabel">New Name (for Rename Property option)</span>
      <input id="newName" class="round" type="text" placeholder="New key name">
      <br><br>
    </div>
  </div>  
        </div>
      `;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {
    const { document } = this;
    function updateVisibility() {
      const action = parseInt(document.getElementById('action').value, 10);

      const keyContainer = document.getElementById('keyContainer');
      const valueContainer = document.getElementById('valueContainer');
      const indexContainer = document.getElementById('indexContainer');
      const newNameContainer = document.getElementById('newNameContainer');

      keyContainer.style.display = 'none';
      valueContainer.style.display = 'none';
      indexContainer.style.display = 'none';
      newNameContainer.style.display = 'none';

      switch (action) {
        case 1:
          keyContainer.style.display = 'block';
          valueContainer.style.display = 'block';
          break;
        case 2:
          keyContainer.style.display = 'block';
          break;
        case 3:
          keyContainer.style.display = 'block';
          valueContainer.style.display = 'block';
          break;
        case 4:
          keyContainer.style.display = 'block';
          valueContainer.style.display = 'block';
          break;
        case 5:
          keyContainer.style.display = 'block';
          valueContainer.style.display = 'block';
          break;
        case 6:
          keyContainer.style.display = 'block';
          valueContainer.style.display = 'block';
          break;
        case 7:
          keyContainer.style.display = 'block';
          break;
        case 8:
          keyContainer.style.display = 'block';
          newNameContainer.style.display = 'block';
          break;
        case 9:
          keyContainer.style.display = 'block';
          indexContainer.style.display = 'block';
          break;
        case 10:
          keyContainer.style.display = 'block';
          indexContainer.style.display = 'block';
          valueContainer.style.display = 'block';
          break;
        case 11:
          keyContainer.style.display = 'block';
          break;
        case 12:
          keyContainer.style.display = 'block';
          break;
        case 13:
          keyContainer.style.display = 'block';
          valueContainer.style.display = 'block';
          break;
        case 14:
          keyContainer.style.display = 'block';
          break;
        default:
          break;
      }
    }

    document.getElementById('action').addEventListener('change', updateVisibility);

    updateVisibility();
  },

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------
  async action(cache) {
    const fs = require('fs');
    const path = require('path');
    const data = cache.actions[cache.index];
    const filePath = this.evalMessage(data.filePath, cache);
    const actionType = parseInt(data.action, 10);
    const keyPath = this.evalMessage(data.key, cache).trim();
    const rawValue = this.evalMessage(data.value, cache);
    const index = parseInt(this.evalMessage(data.index, cache), 10);
    const newName = this.evalMessage(data.newName, cache).trim();

    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let jsonData = {};
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        jsonData = fileContent ? JSON.parse(fileContent) : {};
      } catch (error) {
        console.error('[Write In Json File] Error reading or parsing JSON file:', error);
        jsonData = {};
      }
    }

    const getNestedProperty = (obj, path) => {
      if (!path) return obj;
      const keys = path.split('.');
      return keys.reduce((o, k) => (o || {})[k], obj);
    };

    const setNestedValue = (obj, path, value) => {
      if (!path) return value;
      const keys = path.split('.');
      let current = obj;
      for (let i = 0; i < keys.length - 1; i++) {
        if (typeof current[keys[i]] !== 'object' || current[keys[i]] === null) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return obj;
    };

    const deleteNestedValue = (obj, path) => {
      if (!path) return;
      const keys = path.split('.');
      let current = obj;
      for (let i = 0; i < keys.length - 1; i++) {
        if (typeof current[keys[i]] !== 'object') return;
        current = current[keys[i]];
      }
      delete current[keys[keys.length - 1]];
    };

    const renameNestedKey = (obj, path, newKey) => {
      if (!path || !newKey) return false;
      const keys = path.split('.');
      let current = obj;
      for (let i = 0; i < keys.length - 1; i++) {
        if (typeof current[keys[i]] !== 'object') return false;
        current = current[keys[i]];
      }
      if (current.hasOwnProperty(keys[keys.length - 1])) {
        current[newKey] = current[keys[keys.length - 1]];
        delete current[keys[keys.length - 1]];
        return true;
      }
      return false;
    };

    let parsedValue;
    try {
      parsedValue = JSON.parse(rawValue);
    } catch (e) {
      parsedValue = rawValue;
    }

    switch (actionType) {
      case 1:
        if (keyPath) {
          const current = getNestedProperty(jsonData, keyPath);
          if (
            typeof current === 'object' &&
            current !== null &&
            typeof parsedValue === 'object' &&
            parsedValue !== null
          ) {
            Object.assign(current, parsedValue);
          } else {
            setNestedValue(jsonData, keyPath, parsedValue);
          }
        } else if (typeof parsedValue === 'object' && parsedValue !== null) {
          Object.assign(jsonData, parsedValue);
        }
        break;

      case 2:
        if (keyPath) {
          deleteNestedValue(jsonData, keyPath);
        }
        break;

      case 3:
        if (keyPath) {
          setNestedValue(jsonData, keyPath, parsedValue);
        }
        break;

      case 4:
        {
          let arr = getNestedProperty(jsonData, keyPath);
          if (!Array.isArray(arr)) {
            arr = [];
          }
          arr.push(parsedValue);
          setNestedValue(jsonData, keyPath, arr);
        }
        break;

      case 5:
        {
          let current = getNestedProperty(jsonData, keyPath);
          const incrementBy = typeof parsedValue === 'number' ? parsedValue : 1;
          if (typeof current === 'number') {
            current += incrementBy;
          } else {
            current = incrementBy;
          }
          setNestedValue(jsonData, keyPath, current);
        }
        break;

      case 6:
        {
          let current = getNestedProperty(jsonData, keyPath);
          const decrementBy = typeof parsedValue === 'number' ? parsedValue : 1;
          if (typeof current === 'number') {
            current -= decrementBy;
          } else {
            current = -decrementBy;
          }
          setNestedValue(jsonData, keyPath, current);
        }
        break;

      case 7:
        {
          let current = getNestedProperty(jsonData, keyPath);
          if (typeof current === 'boolean') {
            current = !current;
          } else {
            current = true;
          }
          setNestedValue(jsonData, keyPath, current);
        }
        break;

      case 8:
        {
          if (keyPath && newName) {
            const result = renameNestedKey(jsonData, keyPath, newName);
            if (!result) {
              console.error('[Write In Json File] Failed to rename property. Make sure the key exists.');
            }
          }
        }
        break;

      case 9:
        {
          const arr = getNestedProperty(jsonData, keyPath);
          if (Array.isArray(arr) && !isNaN(index)) {
            arr.splice(index, 1);
            setNestedValue(jsonData, keyPath, arr);
          }
        }
        break;

      case 10:
        {
          let arr = getNestedProperty(jsonData, keyPath);
          if (!Array.isArray(arr)) {
            arr = [];
          }
          if (!isNaN(index)) {
            arr.splice(index, 0, parsedValue);
            setNestedValue(jsonData, keyPath, arr);
          }
        }
        break;

      case 11:
        {
          const arr = getNestedProperty(jsonData, keyPath);
          if (Array.isArray(arr)) {
            arr.pop();
            setNestedValue(jsonData, keyPath, arr);
          }
        }
        break;

      case 12:
        {
          const arr = getNestedProperty(jsonData, keyPath);
          if (Array.isArray(arr)) {
            arr.shift();
            setNestedValue(jsonData, keyPath, arr);
          }
        }
        break;

      case 13:
        {
          let arr = getNestedProperty(jsonData, keyPath);
          if (!Array.isArray(arr)) {
            arr = [];
          }
          arr.unshift(parsedValue);
          setNestedValue(jsonData, keyPath, arr);
        }
        break;

      case 14:
        {
          let arr = getNestedProperty(jsonData, keyPath);
          if (Array.isArray(arr)) {
            arr = [];
            setNestedValue(jsonData, keyPath, arr);
          }
        }
        break;

      default:
        break;
    }

    try {
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
    } catch (error) {
      console.error('[Write In Json File] Error while writing JSON file:', error);
    }

    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------
  mod() {},
};
