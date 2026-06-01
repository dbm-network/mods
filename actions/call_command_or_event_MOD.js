module.exports = {
  name: 'Call Command/Event',
  section: 'Other Stuff',
  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods',
  },

  subtitle(data) {
    let source;
    if (parseInt(data.sourcetype, 10) === 2) {
      source = `Nome do comando: ${data.source3.toString()}`;
    }
    if (parseInt(data.sourcetype, 10) === 1) {
      source = `ID do comando: ${data.source2.toString()}`;
    }
    if (parseInt(data.sourcetype, 10) === 0) {
      source = `Lista > comando: ${data.source.toString()}`;
    }
    return `${source}`;
  },

  fields: ['sourcetype', 'source', 'source2', 'source3', 'type'],

  html() {
    return `
<div style="float: left; width: 85%; padding-top: 20px;">
<span class="dbminputlabel">Source Type</span><br>
  <select id="sourcetype" class="round" onchange="glob.onChange1(this)">
    <option value="0" selected>Choose from the list</option>
    <option value="1">Enter the command/event ID</option>
    <option value="2">Enter the name of the command/event</option>
  </select>
</div>
<div id="info1"; style="float: left; width: 85%; padding-top: 20px; display: none;">
<span class="dbminputlabel">Command/Event</span><br>
  <select id="source" class="round">
    <optgroup id="commands" label="Commands"></optgroup>
    <optgroup id="events" label="Events"></optgroup>
  </select>
</div>
<div id="info2" style="float: left; width: 85%; padding-top: 20px;">
<span class="dbminputlabel">Command/Event ID</span><br>
  <input id="source2" class="round" type="text" placeholder="">
</div>
<div id="info3" style="float: left; width: 85%; padding-top: 20px;">
<span class="dbminputlabel">Command/Event Name</span><br>
  <input id="source3" class="round" type="text" placeholder="">
</div>
<div style="float: left; width: 85%; padding-top: 20px;">
<span class="dbminputlabel">Call type</span><br>
  <select id="type" class="round">
  <option value="true" selected>Wait for completion</option>
  <option value="false">Run simultaneously</option>
  </select>
</div>`;
  },

  init() {
    const { glob, document } = this;

    const { $cmds } = glob;
    const coms = document.getElementById('commands');
    coms.innerHTML = '';
    for (let i = 0; i < $cmds.length; i++) {
      if ($cmds[i]) {
        coms.innerHTML += `<option value="${$cmds[i]._id}">${$cmds[i].name}</option>\n`;
      }
    }

    const { $evts } = glob;
    const evet = document.getElementById('events');
    evet.innerHTML = '';
    for (let i = 0; i < $evts.length; i++) {
      if ($evts[i]) {
        evet.innerHTML += `<option value="${$evts[i]._id}">${$evts[i].name}</option>\n`;
      }
    }

    glob.onChange1 = function onChange1(event) {
      const sourceType = parseInt(document.getElementById('sourcetype').value, 10);
      const info1 = document.getElementById('info1');
      const info2 = document.getElementById('info2');
      const info3 = document.getElementById('info3');

      switch (sourceType) {
        case 0:
          info1.style.display = null;
          info2.style.display = 'none';
          info3.style.display = 'none';
          break;
        case 1:
          info1.style.display = 'none';
          info2.style.display = null;
          info3.style.display = 'none';
          break;
        case 2:
          info1.style.display = 'none';
          info2.style.display = 'none';
          info3.style.display = null;
          break;
        default:
          break;
      }
    };

    glob.onChange1(document.getElementById('sourcetype'));
  },

  action(cache) {
    const data = cache.actions[cache.index];
    const { Files } = this.getDBM();

    let id;
    if (parseInt(data.sourcetype, 10) === 1) {
      id = this.evalMessage(data.source2, cache);
    } else {
      id = data.source;
    }
    if (!id) return console.log('Enter a Command/Event ID!');

    let name;
    if (parseInt(data.sourcetype, 10) === 2) {
      name = this.evalMessage(data.source3, cache);
    } else {
      name = data.source;
    }
    if (!name) return console.log('Enter a Command/Event name!');

    let actions;
    const allData = Files.data.commands.concat(Files.data.events);
    for (let i = 0; i < allData.length; i++) {
      if (parseInt(data.sourcetype, 10) === 0) {
        if (allData[i] && allData[i]._id === id) {
          actions = allData[i].actions;
          break;
        }
      }
      if (parseInt(data.sourcetype, 10) === 1) {
        if (allData[i] && allData[i]._id === id) {
          actions = allData[i].actions;
          break;
        }
      }
      if (parseInt(data.sourcetype, 10) === 2) {
        if (allData[i] && allData[i].name === name) {
          actions = allData[i].actions;
          break;
        }
      }
    }
    if (!actions) {
      this.callNextAction(cache);
      return;
    }

    const waitForCompletion = data.type === 'true';
    let callback = null;
    if (waitForCompletion) {
      callback = () => this.callNextAction(cache);
    }
    this.executeSubActions(actions, cache, callback);
    if (!waitForCompletion) {
      this.callNextAction(cache);
    }
  },

  mod() {},
};
