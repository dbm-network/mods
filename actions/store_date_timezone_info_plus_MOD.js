module.exports = {
  name: 'Store Date Timezone Info Plus',
  section: 'Other Stuff',
  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods',
  },

  subtitle(data) {
    const info = [
      'Day of the week',
      'Day (number)',
      'Day of the year',
      'Week of the year',
      'Month of the year',
      'Month (number)',
      'Year',
      'Hour',
      'Minutes',
      'Seconds',
      'Milliseconds',
      'Time zone',
      'Unix Timestamp',
      'Data completa',
    ];
    const storage = ['', 'Temporary Variable', 'Server Variable', 'Global Variable'];
    return `${
      data.modeStorage === '0'
        ? `"${info[data.info]}"`
        : data.buildInput === ''
        ? '"Not Configured"'
        : `"${data.buildInput}"`
    } of a date ~ ${storage[data.storage]}`;
  },

  short_description: 'Stores something from a date more completely!',
  depends_on_mods: ['WrexMODS'],

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    const dataType = 'Date';
    return [data.varName, dataType];
  },

  fields: ['sourceDate', 'timezone', 'dateLanguage', 'modeStorage', 'info', 'buildInput', 'storage', 'varName'],

  html(isEvent, data) {
    return `

        <div style="float: left; width: 62%;margin:0px 4px;">
        <span class="dbminputlabel">Date of origin</span><br>
            <input id="sourceDate" class="round" type="text" placeholder="Ex: Sun Oct 26 2019 10:38:01 GMT+0200 ou \${new Date}">
        </div>
        <div style="float: right; width: 35%">
        <span class="dbminputlabel">Date language (initials)</span><br>
           <input id="dateLanguage" value="en" class="round" placeholder='The default is "en" (English)'>
        </div><br><br><br>
        <div style="float: left; width: 100%">
        <span class="dbminputlabel">Timezone (<span class="wrexlink" data-url="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones">Timezones</span>)</span><br>
    <input id="timezone" class="round" type="text" placeholder="Ex: America/Sao_Paulo" value="America/Sao_Paulo">
</div><br><br><br>
        <div style="float: left; width: 35%; margin:0px 4px">
        <span class="dbminputlabel">Mode</span><br>
            <select id="modeStorage" class="round" onchange="glob.onChangeMode(this)">
                <option value="0" selected>Choose</option>
                <option value="1">Build</option>
            </select>
        </div>
        <div id="selectMode" style="display: none; float: right; width: 62%">
        <span class="dbminputlabel">Information</span><br>
            <select id="info" class="round">
                <option value="0" selected>Weekday</option>
                <option value="1">Day [number]</option>
                <option value="2">Day of the year [number]</option>
                <option value="3">Week of the year [number]</option>
                <option value="4">Month of the year</option>
                <option value="5">Month [number]</option>
                <option value="6">Year</option>
                <option value="7">Time</option>
                <option value="8">Minutes</option>
                <option value="9">Seconds</option>
                <option value="10">Milliseconds</option>
                <option value="11">Time zone</option>
                <option value="12">Unix Timestamp</option>
                <option value="13">Full date</option>
            </select>
        </div>
        <div id="buildMode" style="display: none; float: right; width: 62%">
        <span class="dbminputlabel">Build (<span class="wrexlink" data-url="https://momentjs.com/docs/#/displaying/format/">Document</span>):</span><br>
            <input id="buildInput" class="round" placeholder="Ex: DD/MM/YYYY [to] HH:mm:ss">
        </div><br><br><br>
        <div style="float: left; width: 35%;margin:0px 4px">
        <span class="dbminputlabel">Store in:</span><br>
            <select id="storage" class="round">
                ${data.variables[1]}
            </select>
        </div>
        <div id="varNameContainer" style="float: right; width: 62%">
        <span class="dbminputlabel">Variable name:</span><br>
            <input id="varName" class="round" type="text">
        </div><br><br><br>
        <div id="noteContainer" style="display: none; padding-top: 16px">
            <b>Nota:</b> You can use square brackets to put the text in <b>Build</b><br>
            <b>Ex:</b> <span id="code">DD/MM/YYYY [at] HH:mm:ss</span> = <span id="code">30/01/2022 at 13:38:20</span>
        </div>
        <style>
             span.wrexlink {
		color: #99b3ff;
		text-decoration: underline;
                cursor: pointer
            }

	     span.wrexlink:hover { 
                color:#4676b9
            }

            #code {
                background: #2C313C;
                color: white;
                padding: 3px;
                font-size: 12px;
                border-radius: 2px
              }
        </style>
        `;
  },

  init() {
    const { glob, document } = this;

    glob.onChangeMode = function (modeStorage) {
      switch (parseInt(modeStorage.value, 10)) {
        case 0:
          document.getElementById('selectMode').style.display = null;
          document.getElementById('buildMode').style.display = 'none';
          document.getElementById('noteContainer').style.display = 'none';
          break;
        case 1:
          document.getElementById('selectMode').style.display = 'none';
          document.getElementById('buildMode').style.display = null;
          document.getElementById('noteContainer').style.display = null;
          break;
      }
    };

    glob.onChangeMode(document.getElementById('modeStorage'));

    const wrexlinks = document.getElementsByClassName('wrexlink');
    for (let x = 0; x < wrexlinks.length; x++) {
      const wrexlink = wrexlinks[x];
      var url = wrexlink.getAttribute('data-url');
      if (url) {
        wrexlink.setAttribute('title', url);
        wrexlink.addEventListener('click', function (e) {
          e.stopImmediatePropagation();
          console.log(`Posting URL: [${url}] in your default browser.`);
          require('child_process').execSync(`start ${url}`);
        });
      }
    }
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const moment = require('moment-timezone');
    const dateLanguage = this.evalMessage(data.dateLanguage, cache);
    const timezone = this.evalMessage(data.timezone, cache);
    const date = moment(
      Date.parse(this.evalMessage(data.sourceDate, cache)),
      '',
      dateLanguage === '' ? 'pt' : dateLanguage,
    ).tz(timezone);
    const buildInput = this.evalMessage(data.buildInput, cache);
    const modeType = parseInt(this.evalMessage(data.modeStorage, cache), 10);
    const info = parseInt(data.info, 10);

    let result;

    if (modeType === 0) {
      switch (info) {
        case 0:
          result = date.format('dddd');
          break;
        case 1:
          result = date.format('DD');
          break;
        case 2:
          result = date.format('DDD');
          break;
        case 3:
          result = date.format('ww');
          break;
        case 4:
          result = date.format('MMMMM');
          break;
        case 5:
          result = date.format('MM');
          break;
        case 6:
          result = date.format('YYYY');
          break;
        case 7:
          result = date.format('hh');
          break;
        case 8:
          result = date.format('mm');
          break;
        case 9:
          result = date.format('ss');
          break;
        case 10:
          result = date.format('SS');
          break;
        case 11:
          result = date.format('ZZ');
          break;
        case 12:
          result = date.format('X');
          break;
        case 13:
          result = date.format('DD/MM/YYYY HH:mm:ss');
          break;
        default:
      }
    } else {
      result = date.format(buildInput);
    }

    if (result === 'Invalid date') {
      return console.log(
        'Invalid Date! Check that your date is valid in "Store Date Info Plus". A Date usually looks like the one stored in a server\'s "Creation Date" (variables work)',
      );
    }

    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(result, storage, varName, cache);
    }

    this.callNextAction(cache);
  },

  mod(DBM) {},
};
