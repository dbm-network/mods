const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'Generate',
  section: 'Economy',
  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Shadow',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods',
  },

  subtitle(data) {
    return `Generate ${data.type}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Text'];
  },

  fields: [
    'type',
    'passwordDifficulty',
    'min',
    'max',
    'nicknameLanguage',
    'fullnameLanguage',
    'storage',
    'varName',
    'licenseKeyLength',
  ],

  html(isEvent, data) {
    return `
    <div class="dbmmodsbr1" style="height: 59px">
  <p>Mod Info:</p>
  <p>Created by Shadow</p>
  <p>
    Help:
    <a
      href="https://discord.gg/9HYB4n3Dz4"
      target="_blank"
      style="color: #0077ff; text-decoration: none"
      >discord</a
    >
  </p>
</div>

<div class="dbmmodsbr dbmmodsbr2">
  <p>Mod Version:</p>
  <p>
    <a
      href="https://github.com/Shadow64gg/DBM-14"
      target="_blank"
      style="color: #0077ff; text-decoration: none"
      >1.0</a
    >
  </p>
</div>

<style>
  .dbmmodsbr1,
  .dbmmodsbr2 {
    position: absolute;
    bottom: 0px;
    background: rgba(0, 0, 0, 0.7);
    color: #999;
    padding: 5px;
    font-size: 12px;
    z-index: 999999;
    cursor: pointer;
    line-height: 1.2;
    border-radius: 8px;
    transition: transform 0.3s ease, background-color 0.6s ease, color 0.6s ease;
  }

  .dbmmodsbr1 {
    left: 0px;
    border: 2px solid rgba(50, 50, 50, 0.7);
  }

  .dbmmodsbr2 {
    right: 0px;
    text-align: center;
  }

  .dbmmodsbr1:hover,
  .dbmmodsbr2:hover {
    transform: scale(1.01);
    background-color: rgba(29, 29, 29, 0.9);
    color: #fff;
  }

  .dbmmodsbr1 p,
  .dbmmodsbr2 p {
    margin: 0;
    padding: 0;
  }

  .dbmmodsbr1 a,
  .dbmmodsbr2 a {
    font-size: 12px;
    color: #0077ff;
    text-decoration: none;
  }

  .dbmmodsbr1 a:hover,
  .dbmmodsbr2 a:hover {
    text-decoration: underline;
  }
</style>



    </div><br>

    <div>
      <span class="dbminputlabel">Generate Type</span><br>
      <select id="type" class="round" onchange="glob.onChangeType(this)">
        <option value="password" selected>Password</option>
        <option value="nickname">Nick Name</option>
        <option value="licensekey">License Key</option>
        <option value="fullname">Full Name</option>
      </select>
    </div><br>

    <div id="passwordSection">
      <div style="float: left; width: 45%;">
        <span class="dbminputlabel">Minimum Length</span>
        <input id="min" class="round" type="text"><br>
      </div>
      <div style="padding-left: 5%; float: left; width: 50%;">
        <span class="dbminputlabel">Maximum Length</span>
        <input id="max" class="round" type="text"><br>
      </div><br>
      <div style="padding-top: 8px;">
        <span class="dbminputlabel">Difficulty</span><br>
        <select id="passwordDifficulty" class="round">
          <option value="easy" selected>Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div><br>
    </div>

    <div id="nicknameSection" style="display: none;">
      <div style="padding-top: 8px;">
        <span class="dbminputlabel">Language</span><br>
        <select id="nicknameLanguage" class="round">
          <option value="pl" selected>Polish</option>
          <option value="en">English</option>
        </select>
      </div><br>
    </div>

    <div id="fullnameSection" style="display: none;">
      <div style="padding-top: 8px;">
        <span class="dbminputlabel">Language</span><br>
        <select id="fullnameLanguage" class="round">
          <option value="pl" selected>Polish</option>
          <option value="en">English</option>
        </select>
      </div><br>
    </div>

    <div id="licenseKeySection" style="display: none;">
      <span class="dbminputlabel">License Key Length</span><br>
      <select id="licenseKeyLength" class="round">
        <option value="1">######-######-######</option>
        <option value="2">######-######-######-######</option>
        <option value="3">######-######-######-######-######</option>
        <option value="4">######-######-######-######-######-######</option>
      </select>
    </div><br>

    <div style="padding-top: 8px;">
      <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
    </div>`;
  },

  init() {
    const { glob, document } = this;

    glob.onChangeType = function (event) {
      const value = event.value;
      document.getElementById('passwordSection').style.display = value === 'password' ? null : 'none';
      document.getElementById('nicknameSection').style.display = value === 'nickname' ? null : 'none';
      document.getElementById('licenseKeySection').style.display = value === 'licensekey' ? null : 'none';
      document.getElementById('fullnameSection').style.display = value === 'fullname' ? null : 'none';
    };

    glob.onChangeType(document.getElementById('type'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const type = data.type;
    const passwordDifficulty = this.evalMessage(data.passwordDifficulty, cache);
    const min = parseInt(this.evalMessage(data.min, cache), 10);
    const max = parseInt(this.evalMessage(data.max, cache), 10);
    const nicknameLanguage = this.evalMessage(data.nicknameLanguage, cache);
    const fullnameLanguage = this.evalMessage(data.fullnameLanguage, cache);
    const licenseKeyLength = parseInt(this.evalMessage(data.licenseKeyLength, cache), 10);
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);

    // Corrected path to generates.json in 'data' folder of the bot
    const generatesFilePath = path.join(__dirname, '..', 'data', 'generates.json');

    // Check if generates.json exists
    let generatesData = {};
    if (!fs.existsSync(generatesFilePath)) {
      console.log('generates.json not found. Creating a new file with default data.');

      // Default data for generates.json
      generatesData = {
        nicknames: {
          pl: ['SzybkiStrzelec', 'MocnyMati', 'SzybkiGrom'],
          en: ['VenomousViper', 'IronWulf', 'NightHawkX'],
        },
        firstNames: {
          pl: ['Jan', 'Anna', 'Krzysztof'],
          en: ['John', 'Emma', 'Chris'],
        },
        lastNames: {
          pl: ['Kowalski', 'Nowak', 'Wiśniewski'],
          en: ['Smith', 'Johnson', 'Williams'],
        },
      };

      // Write default data to generates.json
      fs.writeFileSync(generatesFilePath, JSON.stringify(generatesData, null, 2), 'utf8');
    } else {
      // Read the existing data from generates.json
      generatesData = JSON.parse(fs.readFileSync(generatesFilePath, 'utf8'));
    }

    let result = '';

    if (type === 'password') {
      const charSets = {
        easy: 'abcdefghijklmnopqrstuvwxyz',
        medium: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        hard: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?',
      };
      const chars = charSets[passwordDifficulty];
      const length = Math.floor(Math.random() * (max - min + 1)) + min;
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } else if (type === 'nickname') {
      const nicknames = generatesData.nicknames[nicknameLanguage];
      if (nicknames && nicknames.length > 0) {
        // Correctly picking a random nickname from the list
        result = nicknames[Math.floor(Math.random() * nicknames.length)];
      }
    } else if (type === 'licensekey') {
      const lengths = [
        3, // 3 grupy po 5 znaków
        4, // 4 grupy po 5 znaków
        5, // 5 grup po 5 znaków
        6, // 6 grup po 5 znaków
      ];

      const numberOfGroups = lengths[licenseKeyLength - 1];
      let licenseKey = '';

      // Generowanie klucza licencji
      for (let i = 0; i < numberOfGroups; i++) {
        const group = Math.random().toString(36).substring(2, 7).toUpperCase(); // 5 znaków w każdej grupie
        licenseKey += group;
        if (i < numberOfGroups - 1) {
          licenseKey += '-'; // Dodajemy myślnik po każdej grupie, z wyjątkiem ostatniej
        }
      }

      result = licenseKey; // Przypisujemy wygenerowany klucz licencji
    } else if (type === 'fullname') {
      const firstNames = generatesData.firstNames[fullnameLanguage];
      const lastNames = generatesData.lastNames[fullnameLanguage];
      if (firstNames && lastNames && firstNames.length > 0 && lastNames.length > 0) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        result = `${firstName} ${lastName}`;
      }
    }

    if (!result) {
      console.log('Error: No data found for the selected type and language.');
      return this.callNextAction(cache);
    }

    // Store the generated value in the selected variable
    this.storeValue(result, storage, varName, cache);

    // Proceed to next action
    this.callNextAction(cache);
  },

  mod() {},
};
