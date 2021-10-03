module.exports = {
  name: 'Store Bot Client Info',
  section: 'Bot Client Control',

  subtitle(data) {
    const info = [
      'Uptime in Milliseconds',
      'Ready At?',
      'Ping',
      'Guild Amount',
      'User Amount',
      'Rounded Ping',
      'Uptime in Seconds',
      'Uptime in Minutes',
      "Bots' Token",
      'Voice Connections Amount',
      'Total Amount of Channels',
      'Total Amount of Emojis',
      'This option has been removed',
      'Uptime in Days',
      'Uptime in Days (Rounded)',
      'Memory (RAM) Usage',
      'Bot Guilds Objects',
      'Bot Guilds Names',
      'Bot Guilds IDs',
      'Bot Current Prefix',
      'Bot Client ID',
      'Discord JS Version',
      'Uptime in Hours',
      'Refreshing Uptime in Days',
      'Refreshing Uptime in Hours',
      'Refreshing Uptime in Minutes',
      'Refreshing Uptime in Seconds',
      'Memory (RAM) Usage in MB',
      "Bots' OS (Process Platform)",
      'CPU Usage in MB',
      'Average CPU Usage (%)',
      'CPU Usage (%)',
      "Bots' Directory",
      'Node JS Version',
      'Amount of Commands',
      'Amount of Events',
      'Ready At ? [timestamp]',
      'CPU Core Count',
      'Total Memory (GB)',
      'Total Memory (MB)',
      'Available Memory (GB)',
      'Available Memory (MB)',
      'Available Memory (%)',
      'Used Memory (GB)',
      'Used Memory (MB)',
      'Used Memory (%)',
      'Bot Owner ID',
      'Are Commands Case Sensitive?',
      'Last Message ID',
    ];
    return `Bot Client - ${info[parseInt(data.info, 10)]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    let dataType = 'Unknown Type';
    switch (parseInt(data.info, 10)) {
      case 0: // Uptime in Milliseconds
      case 22: // Uptime in Hours
      case 27: // Memory (RAM) Usage in MB
      case 29: // CPU Usage in MB
      case 32: // Amount of Commands
      case 33: // Amount of Events
      case 34: // Ready At ? [Timestamp]
      case 35: // CPU Core Amount
      case 36: // Total Memory (GB)
      case 37: // Total Memory (MB)
      case 38: // Available Memory (GB)
      case 39: // Available Memory (MB)
      case 40: // Available Memory (%)
      case 41: // Used Memory (GB)
      case 42: // Used Memory (MB)
      case 43: // Used Memory (%)
      case 48: // CPU Usage (%)
      case 2: // Ping
      case 3: // Guild Amount
      case 4: // User Amount
      case 5: // Rounded Ping
      case 6: // Uptime in Seconds
      case 7: // Uptime in Minutes
      case 9: // Voice Connections Amount
      case 10: // Total Amount of Channels
      case 11: // Total Amount of Emojis
      case 15: // Memory (Ram) Usage
        dataType = 'Number';
        break;
      case 1: // Ready At
        dataType = 'Date';
        break;
      case 8: // Bots' Token
        dataType = 'Token';
        break;
      case 16: // Bot Guilds Objects
        dataType = 'Guild';
        break;
      case 17: // Bot Guilds Names
        dataType = 'Guild Name';
        break;
      case 18: // Bot Guilds IDs
        dataType = 'Guild ID';
        break;
      case 19: // Bot Current Prefix
        dataType = 'Bot Tag';
        break;
      case 20: // Bot Client ID
        dataType = 'Bot ID';
        break;
      case 13: // Uptime in Days
      case 14: // Uptime in Days (Rounded)
      case 23: // Refreshing Uptime in Days
      case 24: // Refreshing Uptime in Hours
      case 25: // Refreshing Uptime in Minutes
      case 26: // Refreshing Uptime in Seconds
        dataType = 'Time';
        break;
      case 28: // Bots' OS (Process Platform)
        dataType = 'OS Name';
        break;
      case 30: // Bots' Directory
        dataType = 'Directory';
        break;
      case 21: // Discord JS Version
      case 31: // Node JS Version
        dataType = 'Version Number';
        break;
      case 44: // Bot Owner ID
        dataType = 'Bot Owner ID';
        break;
      case 45: // Are Commands Case Sensitive?
        dataType = 'Boolean';
        break;
      case 46: // Last Message ID
        dataType = 'Last Message ID';
        break;
      case 47: // CPU Load Average
        dataType = 'Average CPU Usage Array';
        break;
    }
    return [data.varName2, dataType];
  },

  fields: ['info', 'storage', 'varName2'],

  html(_isEvent, data) {
    return `
<div style="float: left; width: 80%; padding-top: 8px;">
  Source Info:<br>
  <select id="info" class="round">
    <optgroup label="Uptimes">
      <option value="23">Refreshing Uptime in Days</option>
      <option value="24">Refreshing Uptime in Hours</option>
      <option value="25">Refreshing Uptime in Minutes</option>
      <option value="26">Refreshing Uptime in Seconds</option>
    </optgroup>
    <optgroup label="Values">
      <option value="3">Total Amount of Guilds</option>
      <option value="4">Total Amount of Users</option>
      <option value="10">Total Amount of Channels</option>
      <option value="11">Total Amount of Emojis</option>
      <option value="32">Total Amount of Commands</option>
      <option value="33">Total Amount of Events</option>
      <option value="9">Total Voice Connections</option>
    </optgroup>
    <optgroup label="Guilds Arrays">
      <option value="16">Bot Guilds Objects</option>
      <option value="17">Bot Guilds Names</option>
      <option value="18">Bot Guilds IDs</option>
    <optgroup label="Bot Information">
      <option value="19">Bot Current Prefix</option>
      <option value="20">Bot Client ID</option>
      <option value="44">Bot Owner ID</option>
      <option value="28">Bot OS (Process Platform)</option>
      <option value="30">Bot Directory</option>
      <option value="8">Bot Token (be careful)</option>
      <option value="45">Are Commands Case Sensitive?</option>
      <option value="46">Last Message ID</option>
    </optgroup>
    <optgroup label="System Measurements">
      <option value="29">CPU Usage (MB)</option>
      <option value="47">Average CPU Usage [1m, 5m, 15m] (%)</option>
      <option value="48">CPU Usage (%)</option>
      <option value="35">CPU Core Count</option>
      <option value="36">Total Memory (GB)</option>
      <option value="37">Total Memory (MB)</option>
      <option value="38">Available Memory (GB)</option>
      <option value="39">Available Memory (MB)</option>
      <option value="40">Available Memory (%)</option>
      <option value="41">Used Memory (GB)</option>
      <option value="42">Used Memory (MB)</option>
      <option value="43">Used Memory (%)</option>
    </optgroup>
    <optgroup label="Bot Measurements">
      <option value="27">Memory (RAM) Usage in MB</option>
      <option value="1">Ready at</option>
      <option value="34">Ready at [unix timestamp]</option>
      <option value="2">Ping</option>
      <option value="5">Ping Rounded</option>
    </optgroup>
    <optgroup label="Versions">
      <option value="21">Discord JS Version</option>
      <option value="31">Node JS Version</option>
    </optgroup>
  </select>
</div><br><br><br>
<div>
  <div style="float: left; width: 35%; padding-top: 8px;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer2" style="float: right; width: 60%; padding-top: 8px;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text"><br>
  </div>
</div>`;
  },

  init() {},

  action(cache) {
    const botClient = this.getDBM().Bot.bot;
    const { Bot } = this.getDBM();
    const os = require('os');
    if (process.platform === 'win32') this.getMods().require('loadavg-windows'); // Make loadavg work on windows.
    const DBM = this.getDBM();
    const data = cache.actions[cache.index];
    const info = parseInt(data.info, 10);
    const msToDay = 1000 * 60 * 60 * 24;

    if (!botClient) return this.callNextAction(cache);

    let result;
    switch (info) {
      case 0: // Uptime in Milliseconds //Deprecated in 1.8.5
        result = botClient.uptime;
        break;
      case 1: // Ready At
        result = botClient.readyAt;
        break;
      case 2: // Ping
        result = botClient.ws.ping;
        break;
      case 3: // Guild Amount
        result = botClient.guilds.cache.size;
        break;
      case 4: // User Amount
        result = botClient.users.cache.size;
        break;
      case 5: // Rounded Ping
        result = Math.round(botClient.ws.ping);
        break;
      case 6: // Uptime in Seconds // Deprecated in 1.8.5
        result = Math.floor(botClient.uptime / 1000);
        break;
      case 7: // Uptime in Minutes // Deprecated in 1.8.5
        result = Math.floor(botClient.uptime / 1000 / 60);
        break;
      case 8: // Bots' Token
        result = botClient.token;
        break;
      case 9: // Voice Connections Amount
        result = botClient.voice.connections.size;
        break;
      case 10: // Total Amount of Channels
        result = botClient.channels.cache.size;
        break;
      case 11: // Total Amount of Emojis
        result = botClient.emojis.cache.size;
        break;
      case 13: // Uptime in Days // Deprecated in 1.8.5
        result = botClient.uptime / msToDay;
        break;
      case 14: // Uptime in Days (Rounded) // Deprecated in 1.8.5
        result = Math.floor(botClient.uptime / msToDay);
        break;
      case 15: // Memory (Ram) Usage // Deprecated in 1.8.8
        result = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}%`;
        break;
      case 16: // Bot Guilds Objects
        result = botClient.guilds.cache.array();
        break;
      case 17: // Bot Guilds Names
        result = botClient.guilds.cache.map((g) => g.name);
        break;
      case 18: // Bot Guilds IDs
        result = botClient.guilds.cache.map((g) => g.id);
        break;
      case 19: // Bot Current Prefix
        result = DBM.Files.data.settings.tag;
        break;
      case 20: // Bot Client ID
        result = DBM.Files.data.settings.client;
        break;
      case 21: // Discord JS Version
        result = DBM.DiscordJS.version;
        break;
      case 22: // Uptime in Hours // Deprecated in 1.8.5
        result = Math.floor(botClient.uptime / 1000 / 60 / 60);
        break;
      case 23: // Refreshing Uptime in Days
        result = Math.floor((process.uptime() % 31536000) / 86400);
        break;
      case 24: // Refreshing Uptime in Hours
        result = Math.floor((process.uptime() % 86400) / 3600);
        break;
      case 25: // Refreshing Uptime in Minutes
        result = Math.floor((process.uptime() % 3600) / 60);
        break;
      case 26: // Refreshing Uptime in  Seconds
        result = Math.round(process.uptime() % 60);
        break;
      case 27: // Memory (RAM) Usage in MB
        result = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        break;
      case 28: // Bots' OS (Process Platform)
        if (process.platform) {
          const { platform } = process;
          if (platform === 'win32') result = 'Windows';
          else if (platform === 'aix') result = 'Aix';
          else if (platform === 'linux') result = 'Linux';
          else if (platform === 'darwin') result = 'Darwin';
          else if (platform === 'openbsd') result = 'OpenBSD';
          else if (platform === 'sunos') result = 'Solaris';
          else if (platform === 'freebsd') result = 'FreeBSD';
        }
        break;
      case 29: // CPU Usage in MB
        result = (process.cpuUsage().user / 1024 / 1024).toFixed(2);
        break;
      case 30: // Bots' Directory
        result = process.cwd();
        break;
      case 31: // Node JS Version
        result = process.versions.node;
        break;
      case 32: // Amount of Commands
        result = DBM.Files.data.commands.length;
        break;
      case 33: // Amount of Events
        result = DBM.Files.data.events.length;
        break;
      case 34: // Ready At ? [Timestamp]
        result = botClient.readyTimestamp;
        break;
      case 35: // CPU Core Amount
        result = os.cpus().length;
        break;
      case 36: // Total Memory (GB)
        result = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        break;
      case 37: // Total Memory (MB)
        result = (os.totalmem() / 1024 / 1024).toFixed(0);
        break;
      case 38: // Available Memory (GB)
        result = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        break;
      case 39: // Available Memory (MB)
        result = (os.freemem() / 1024 / 1024).toFixed(0);
        break;
      case 40: // Available Memory (%)
        result = Math.floor((os.freemem() / os.totalmem()) * 100);
        break;
      case 41: // Used Memory (GB)
        result = ((os.totalmem() - os.freemem() / 1024) / 1024 / 1024).toFixed(2);
        break;
      case 42: // Used Memory (MB)
        result = ((os.totalmem() - os.freemem()) / 1024 / 1024).toFixed(0);
        break;
      case 43: // Used Memory (%)
        result = Math.floor(((os.totalmem() - os.freemem()) / os.totalmem()) * 100);
        break;
      case 44: // Bot Owner ID
        result = DBM.Files.data.settings.ownerId;
        break;
      case 45: // Are Commands Case Sensitive?
        result = Bot._caseSensitive;
        break;
      case 46: // Last Message ID
        result = botClient.user.lastMessageID;
        break;
      case 47: // CPU Usage Average [1m, 5m, 15m]
        result = os.loadavg();
        break;
      case 48: // Current CPU Usage
        result = os.loadavg[0];
        break;
      default:
        break;
    }

    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName2 = this.evalMessage(data.varName2, cache);
      this.storeValue(result, storage, varName2, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
