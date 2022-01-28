module.exports = {
  name: 'Run Script Too',
  section: 'Other Stuff',
  meta: {
    version: '2.1.1',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/run_script_too_MOD.js',
  },
  subtitle(data) {
    if (data.title) return `${data.title}`;
    return `${data.file ? `External File: ${data.file}` : data.code}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Unknown Type'];
  },

  fields: ['behavior', 'interpretation', 'code', 'file', 'storage', 'varName', 'title', 'savevariables', 'namestoDBM', 'typeofvars', 'variables', 'showcode'],

  html(_isEvent, data) {
    return `
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll; po"><br>
  <div style="padding-right: 3%;">
    <div style="float: left; width: 50%;">
		<span class="dbminputlabel">End Behavior</span><br>
		<select id="behavior" class="round">
			<option value="0" selected>Call Next Action Automatically</option>
			<option value="1">Do Not Call Next Action</option>
		</select>
	</div>
	<div style="padding-left: 5%; float: right; width: 50%;">
		<span class="dbminputlabel">Interpretation Style</span><br>
		<select id="interpretation" class="round">
			<option value="0" selected>Evaluate Text First</option>
			<option value="1">Evaluate Text Directly</option>
		</select>
	</div>
  
  <br><br><br><br>


  <div id="" style="float: left; width: 100%;">
    <span class="dbminputlabel">Script Name (shown in the action subtitle)</span><br>
      <input id="title" class="round" type="text">
  </div><br><br><br><br>
  <div>
    <div style="float: left; width: 70%;">
    <span class="dbminputlabel">External File Path (Root directory is your bot folder )</span><br>
      <input type="text" name="file" id="file" class="round" placeholder="./scripts/myscript.js" style="float: left;"/>
    </div>
  <div style="padding-left: 5%; float: right; width: 30%;">
  <span class="dbminputlabel">Save Variables?<i class="clickableicon question circle outline icon" onclick="glob.onDTLChanged(this)"></i></span><br>
  <select id="savevariables" class="round" onchange="glob.onSVarChanged(this)">
    <option value="0">Yes</option>
    <option value="1" selected>No</option>
  </select>
  </div><br><br><br><br>
  <div id="dtl" style="display: none;">
  <div style="
  padding: 0.5em;
  border-radius: 4px;
  color: #b9bbbe;
  background-color: #2f3136;
  border: 1px solid #202225;
  ">

<style>
summary::before {
  content: '▶';
  padding-right: 0.5em;
}

details[open] > summary::before {
  content: '▼';
}
</style>

    <details>
      <summary><span style="color: white"><b>Documentation:</b></summary>
      <div class="codeblock">
        <span style="color:#9b9b9b">
            <span><b>How to save variables from code?</b></span>
            <details>
              <summary><span><b>Example 1</b></summary></span>
              <span><br>Your code:</span>
              <img src="https://media.discordapp.net/attachments/931609414429982720/936328207819481169/unknown.png">
              <span><br>To save <b>helloworld</b> and <b>nice</b></span>
              <img style="width: 383px;" src="https://media.discordapp.net/attachments/931609414429982720/936330964999737344/unknown.png">
              <span><b><br>Names to DBM</b> - variable name in DBM, e.g.</span>
              <img style="width: 383px;" src="https://media.discordapp.net/attachments/931609414429982720/936336613083082782/unknown.png">
            </details>
            <details>
            <summary><span><b>Example 2</b></summary></span>
            <span><br>You also can save any text:</span>
            <img style="width: 383px;" src="https://media.discordapp.net/attachments/931609414429982720/936337686896209960/unknown.png">
            <img style="width: 383px;" src="https://media.discordapp.net/attachments/931609414429982720/936338093622067200/unknown.png">
          </details>
        </span>
      </div>
    </details></div><br><br></div>
<div id="svars">
  <div style="float: left; width: calc(100%/3);">
    <span class="dbminputlabel">Variables from Code</span><br>
    <input type="text" name="file" id="variables" class="round" placeholder='"variable", "code", "dot"' style="float: left;"/>
  </div>
  <div style="float: left; padding-left: 5%; width: calc(100%/3);">
    <span class="dbminputlabel">Names to DBM</span><br>
    <input type="text" name="file" id="namestoDBM" class="round" placeholder='"variablename", "codename", "dotname"' style="float: left;"/>
  </div>
  <div style="float: left; padding-left: 5%; width: calc(100%/3);">
    <span class="dbminputlabel">Type of Variables</span><br>
    <select id="typeofvars" class="round">
    <option value="1" selected>Temp Variable</option>
    <option value="2">Server Variable</option>
    <option value="3">Global Variable</option>
  </select>
  </div><br><br><br><br>
</div>
  </div>
  <div>
    <div style="float: left; width: 35%;">
    <span class="dbminputlabel">Store In</span><br>
      <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
      ${data.variables[0]}
      </select>
    </div>
    <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    <span class="dbminputlabel">Variable Name</span><br>
      <input id="varName" class="round" type="text">
    </div>
  </div><br><br><br><br>
  <div style="width: 35%">
    <span class="dbminputlabel">Show Custom Code</span><br>
    <select id="showcode" class="round" onchange="glob.onShowCodeTypeChanged(this)">
      <option value="0" selected>Hide</option>
      <option value="1">Show</option>
    </select>
  </div>
    <br>
  <div style="padding-top: 8px;" id="customcode">
  <span class="dbminputlabel">Or Use Custom Code (This isn't used if an external path is defined.)</span><br>
    <textarea id="code" value="console.log("Text!")" rows="14" name="is-eval" style="width: 99%; white-space: nowrap; resize: none;"></textarea>
  </div>
  </div></div><br><br>`;
  },

  init() {
    const { glob, document } = this;

    glob.onSVarChanged = function (event) {
      if (event.value === '1') {
        document.getElementById('svars').style.display = 'none';
      } else {
        document.getElementById('svars').style.display = null;
      }
    };

    glob.onSVarChanged(document.getElementById('savevariables'));

    glob.onShowCodeTypeChanged = function (event) {
      if (event.value === '0') {
        document.getElementById('customcode').style.display = 'none';
      } else {
        document.getElementById('customcode').style.display = null;
      }
    };

    glob.onShowCodeTypeChanged(document.getElementById('showcode'));

    glob.onDTLChanged = function (event) {
      let DTL = document.getElementById('dtl');
      DTL.style.display = DTL.style.display === 'none' ? '' : 'none';
    };
  },

  action(cache) {
    const data = cache.actions[cache.index];
    const { file } = data;
    const savevariables = data.savevariables;
    let ready = "";
    let variables = "";
    let namestoDBM = "";

    if (savevariables === '0') {
      function save() {

        const typeofvars = data.typeofvars
        let times = 0

        const variableslength = variables.length -1
        const namestoDBMlength = namestoDBM.length -1

        const length = variableslength === namestoDBMlength ? variableslength : "Error!"

        while (times <= length) {
          ready += ` Actions.storeValue(${variables[times]}, ${typeofvars}, "${namestoDBM[times]}", cache);\n`
          times++
        }
      }

      try {variables =         eval(`[${data.variables}]`);      } catch (e) {        console.log(e);     }
      try {namestoDBM = eval(`[${data.namestoDBM}]`);        save();      } catch (e) {        console.log(e);     }
    }

    const save2 = ready !== '' ? ready : ''

    let code;

    const fs = require('fs');
    if (file && fs.existsSync(file)) {
      try {
        code = fs.readFileSync(file, 'utf8');
      } catch (error) {
        console.error(error.stack ? error.stack : error);
      }
    } else if (data.interpretation === '0') {
      code = this.evalMessage(data.code, cache);
    } else {
      code = data.code;
    }

    const result = this.eval(`${code}\n${save2}`, cache);
    const varName = this.evalMessage(data.varName, cache);
    const storage = parseInt(data.storage, 10);
    this.storeValue(result, storage, varName, cache);

    if (data.behavior === '0') this.callNextAction(cache);
  },

  mod() {},
};
