module.exports = {
  name: 'Spreadsheets',
  section: 'Data',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
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
    <tab-system>
      <tab label="Spreadsheet" icon="table">
        <div style="padding-top: 10px;"> <span class="dbminputlabel">Spreadsheet Path</span>
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
      </tab>

      <tab label="Docs" icon="book">
       <div class="scroll" style="margin-bottom: 20px; margin-top: 20px;">
        
        <!-- Spreadsheet Path -->
        <section><h4>════════════ Spreadsheet Path ════════════</h4>  
          <p style="padding-top: 5px;">The Relative Path To The File (Spreadsheet) For Example <a>./resources/table.csv</a></p>
        </section>
        <!-- Search Key -->
        <section><h4>════════════ Search Key ════════════</h4>
          <p>The <a>Search Key</a> is To tell the Action in with column to look for the given Search Value</p>
        
          <div class="code-block">
            <pre>
              <code>
       <a>ID</a>,<a>Name</a>,<a>Price</a>,<a>...</a> ⬅
       1 ,Stone,0.4,...    
       2,Iron,2,...        
              </code>
            </pre>
          </div>
          <p>In this Case it should look for <a>ID</a>, <a>Name</a> Or <a>Price</a></p>
        </section>
        <!-- Search Value -->
        <section><h4>════════════ Search Value ════════════</h4>
          <p>The <a>Search Value</a> is the value it should look for in the Given Column</p>
      
          <div class="code-block">
            <pre>
              <code>
       ID,Name,Price,...
       <a>1</a>,Stone,0.4,...
       <a>2</a>,Iron,2,...
       ⬆
              </code>
            </pre>
          </div>

          <p>For Example, I look For <a>ID</a> and I want the Second item in the table</p>
          <p>so my value is <a>2</a> and the key is <a>ID</a> the output would be <a>{ID:"2", Name:"Iron", Price:"2"}</a></p>
        </section>

        <!-- HOW TO CREATE A SPREADSHEET -->
        <section><h4>════════════ Create a Spreadsheet ════════════</h4>
          <p>Here a more Options, you could write them Manual or you could use something like Google Sheets or Microsoft Excel or other tools that allow to make CSV Tables</p>
          <p style="color: red;">IMPORTANT here is that the first row has to be the KEYS</p>
          <p style="color: red;">Also, it isn't allowed to use a Comma in the data because it splits the data and breaks things</p>
        </section>
      </div> 
    </tab>
    
    </tab-system>
    
    <style>
      .scroll {
        height: 56vh;
        overflow-y: scroll;
        scroll-snap-type: y mandatory;
      }
      .code-block {
        background-color: #3b3b3b;
        padding: 10px;
        font-family: 'Courier New', monospace;
        text-align: inline-block;
        margin-left: 115px;
        margin-bottom: 15px;
        width: 280px;
        height: 110px;
        border-radius: 5px
      }
      /* section {
        scroll-snap-align: start;
        height: 56vh;
      } */
      h4 {
        text-align: center;
        font-weight: bold;
        font-size: large;
        padding-top: 10px;
      }
    </style>
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
