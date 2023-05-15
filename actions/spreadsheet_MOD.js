module.exports = {
  name: 'Spreadsheets',
  section: 'Data',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'Staku',
    authorUrl: null,
    downloadURL: null,
  },

  subtitle(data) {
    return `Searching Row With "${data.row}" in Column ${data.column} `;
  },

  variableStorage(data, storage) {
    const type = parseInt(data.storage, 10);
    if (type !== storage) return;
    return [data.varName, 'Spreadsheet Result'];
  },

  fields: ['column', 'row', 'path', 'storage', 'varName'],

  html(isEvent, data) {
    return `
    <div> <span class="dbminputlabel">Spreadsheet Path</span>
      <input id="path" class="round" placeholder="./resources/table.csv">
    </div><br>
  
    <div style="padding-top: 8px;">
      <div style="float: left; width: 45%;"> <span class="dbminputlabel">Search Key</span>
        <input id="column" class="round" placeholder="ID">
      </div>

      <div style="padding-left: 5%; float: left; width: 55%;"> <span class="dbminputlabel">Search Value</span>
        <input id="row" class="round" placeholder="204">
      </div><br>
    </div><br><br>
    
    <div style="padding-top: 8px;">
      <div style="float: left; width: 35%;"><span class="dbminputlabel">Store In</span>
        <select id="storage" class="round">
          ${data.variables[1]}
        </select>
      </div>
      <div id="varNameContainer" style="float: right; width: 60%;"> <span class="dbminputlabel">Variable Name</span>
        <input id="varName" class="round" type="text"><br>
      </div>
    </div>
    `;
  },

  init() {},

  async action(cache) {
    // get packages and data
    const data = cache.actions[cache.index];
    const fs = require('fs');
    const Mods = this.getMods();
    const { parse } = Mods.require('csv-parse');

    // eval row and column input fields -- thanks to TheMonDon for helping me making parameters work
    const row = this.evalMessage(data.row, cache);
    const column = this.evalMessage(data.column, cache);

    // get a row with the help with a key and a value
    function getRow(filePath, columnName, columnValue, callback) {
      const dataSheet = [];
      const parser = fs.createReadStream(filePath).pipe(
        parse({
          delimiter: ',',
          columns: true,
          ltrim: true,
        }),
      );

      parser.on('data', (row) => {
        if (row[columnName] === columnValue) {
          dataSheet.push(row);
        }
      });

      parser.on('end', () => {
        callback(dataSheet[0]);
      });
    }

    // call action
    getRow(data.path, column, row, (result) => {
      this.storeValue(result, parseInt(data.storage, 10), data.varName, cache);
      this.callNextAction(cache);
    });
  },

  mod() {},
};
