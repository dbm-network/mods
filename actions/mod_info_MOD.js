module.exports = {
  name: 'Welcome',
  section: '#DBM Mods',
  version: '1.9.8',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/mod_info_MOD.js',
  },

  subtitle() {},

  fields: ['mods'],

  html() {
    return `
<style>
table.scroll {
  width: 525px;
  /* 140px * 5 column + 16px scrollbar width */
  border-spacing: 0;
  border: 2px solid #47494c;
}

table.scroll tbody,
table.scroll thead tr {
  display: block;
}

table.scroll tbody {
  height: 100px;
  overflow-y: auto;
  overflow-x: hidden;
}

table.scroll tbody td,
table.scroll thead th {
  width: 176px;
}

table.scroll thead th:last-child {
  width: 180px;
  /* 140px + 16px scrollbar width */
}

thead tr th {
  height: 30px;
  line-height: 30px;
  /*text-align: left;*/
}

tbody {
  border-top: 2px solid #47494c;
}

.embed {
  position: relative;
}

.embedinfo {
  background: rgba(46, 48, 54, .45) fixed;
  border: 1px solid #2f3237;
  border-radius: 0 3px 3px 0;
  padding: 10px;
  margin: 0 4px 0 7px;
  border-radius: 0 3px 3px 0;
}

embedleftline {
  background-color: #e74c3c;
  width: 4px;
  border-radius: 3px 0 0 3px;
  border: 0;
  height: 100%;
  margin-left: 4px;
  position: absolute;
}

span {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

span.embed-auth {
  color: rgb(255, 255, 255);
}

span.embed-desc {
  color: #afafaf;
}

span.wrexlink2,
span.wrexlink3 {
  color: #0096cf;
  text-decoration: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: inherit;
}

span.wrexlink2:hover,
span.wrexlink3:hover {
  text-decoration: underline;
}

span.discord_channel {
  background-color: rgba(114, 137, 218, .1);
  color: #7289da;
  cursor: pointer;
  font-family: sans-serif;
  padding: 2px;
}

span.discord_channel:hover {
  background-color: rgba(114, 137, 218, .7);
  color: #fff;
}

span.discord_code_blocks {
  background: #2f3136;
  border: 1.5px solid #2b2c31;
  border-radius: 7px;
  box-sizing: border-box;
  overflow: hidden;
  padding: 8px 10px;
  color: #839496;
  font-family: Consolas
}
</style>
<div id="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
  <p>
    <h1 style="color: #fff">Welcome!</h1>
    Thank you for using the DBM Mod Collection!<br>
    If you want to tell us something, join the Discord Guild below.
    And if something doesn't work feel free to create an issue on GitHub
    or open <span class="discord_channel wrexlink" data-url="https://discordapp.com/channels/374961173524643843/374961417016573962">#support</span> and describe your problem.

    <h3 style="color: #fff">Discord:</h3>
    Join the Discord Guild to stay updated and be able to suggest things.<br>
    <span class="wrexlink2" data-url2="https://dbm-network.org/">https://dbm-network.org/</span>

    <h3 style="color: #fff">Your version:</h3>
    <span class="discord_code_blocks">${this.version}</span>

    <h3 style="color: #fff">Our Donators:</h3>
    <div class="embed" style="width:35%;">
      <embedleftline></embedleftline>
      <div class="embedinfo">
        <span class="embed-auth">
          Our Supporters
        </span><br>
        <span class="embed-desc">
          Sam<br>
          Zaserr<br>
          papa goobs<br>
          Danno3817<br>
          GeT_DuCkT<br>
          Nerd<br>
          squiffy<br>
          Noah<br>
          Adam_V<br>
          DoimptSopy<br>
          Lasse<br>
          Not Alien<br>
          𝕯𝖔𝖒<br>
          Leondre Devries [BAM]<br>
          _iTrqPss<br>
          NetLuis<br>
          Almeida<br>
          Orochimaru<br>
          Max 🌟<br>
          GAMER<br>
          S h i r o ツ<br>
          Quinten<br>
          Rafied<br>
          lucasboss45<br>
          Dominus_Marceau<br>
          TheMonDon
        </span>
      </div>
    </div>

    <h3 style="color: #fff">GitHub:</h3>
    Visit us on GitHub! The whole mod collection is on GitHub
    and everyone is invited to join us developing new mods!<br>
    Copy and paste the link to view the site in your browser.<br>
    <span class="wrexlink3" data-url3="https://github.com/dbm-network/mods">https://github.com/dbm-network/mods</span><br>
  </p>

  <h3 style="color: #fff">Current List of Mods</h3>
  <table class="scroll">
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Section</th>
        <th scope="col">Author(s)</th>
      </tr>
    </thead>
    <tbody id="mods">
    </tbody>
  </table><br><br>
</div>`;
  },

  init() {
    const { document } = this;

    const path = require('path');

    try {
      const mods = document.getElementById('mods');

      require('fs')
        .readdirSync(__dirname)
        .forEach((file) => {
          if (file.match(/MOD.js/i)) {
            const action = require(path.join(__dirname, file));
            if (action.name && action.action !== null) {
              const tr = document.createElement('tr');
              tr.setAttribute('class', 'table-dark');

              const name = document.createElement('td');
              const headerText = document.createElement('b');
              headerText.innerHTML = action.name;
              name.appendChild(headerText);

              name.setAttribute('scope', 'row');
              tr.appendChild(name);

              const section = document.createElement('td');
              section.appendChild(document.createTextNode(action.section));
              tr.appendChild(section);

              const author = document.createElement('td');
              author.appendChild(document.createTextNode(action.author ? action.author : 'DBM'));
              tr.appendChild(author);
              mods.appendChild(tr);
            }
          }
        });
    } catch (error) {
      // write any init errors to errors.txt in dbms' main directory
      require('fs').appendFile('errors.txt', error.stack || `${error}\r\n`);
    }

    const wrexlinks = document.getElementsByClassName('wrexlink');
    for (let x = 0; x < wrexlinks.length; x++) {
      const wrexlink = wrexlinks[x];
      const url = wrexlink.getAttribute('data-url');
      if (url) {
        wrexlink.addEventListener('click', (e) => {
          e.stopImmediatePropagation();
          console.log(`Launching URL: [${url}] in your default browser.`);
          require('child_process').execSync(`start ${url}`);
        });
      }
    }

    const wrexlinks2 = document.getElementsByClassName('wrexlink2');
    for (let x2 = 0; x2 < wrexlinks2.length; x2++) {
      const wrexlink2 = wrexlinks2[x2];
      const url2 = wrexlink2.getAttribute('data-url2');
      if (url2) {
        wrexlink2.setAttribute('title', url2);
        wrexlink2.addEventListener('click', (e2) => {
          e2.stopImmediatePropagation();
          console.log(`Launching URL: [${url2}] in your default browser.`);
          require('child_process').execSync(`start ${url2}`);
        });
      }
    }

    const wrexlinks3 = document.getElementsByClassName('wrexlink3');
    for (let x3 = 0; x3 < wrexlinks3.length; x3++) {
      const wrexlink3 = wrexlinks3[x3];
      const url3 = wrexlink3.getAttribute('data-url3');
      if (url3) {
        wrexlink3.setAttribute('title', url3);
        wrexlink3.addEventListener('click', (e3) => {
          e3.stopImmediatePropagation();
          console.log(`Launching URL: [${url3}] in your default browser.`);
          require('child_process').execSync(`start ${url3}`);
        });
      }
    }
  },

  action() {},

  mod() {},
};
