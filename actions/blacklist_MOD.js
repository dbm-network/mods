module.exports = {
  name: "Blacklist Users",
  section: "Other Stuff",
  subtitle: function(data) {
    const info = ["", "Blacklist User", "Un-Blacklist User"];
    const vars = ["", "Temp Variable", "Server Variable", "Global Variable"];
    return `${vars[parseInt(data.storage)]}: ${data.varName} | ${info[parseInt(data.type)]}`;
  },
  fields: ["storage", "varName", "type"],
  html: function(isEvent, data) {
    return `
  <div>
    <div>
    <p><u>Made by Rigid and Noah</u></p>
    <br>Operation Type:<br>
      <select class="round" id="type">
        <option value="1" selected>Blacklist User</option>
        <option value="2">Un-Blacklist User</option>
      </select><br>
      <div style="float: left; width: 47%">
        Variable Type:<br><select id="storage" class="round">
          ${data.variables[1]}
        </select>
      </div>
      <div style="float: right; width: 47%">
        Variable Name:<br>
        <input class="round" id="varName" />
</div>
    </div>
  </div>
    `
  },
  init: function() {
    const { document, glob } = this;
  },
  action: function(cache) {
    const data = cache.actions[cache.index];
    const varName = this.evalMessage(data.varName, cache);
    const storage = parseInt(data.storage);
    const type = parseInt(data.type);
    const user = this.getVariable(storage, varName, cache)
    let xxxTentaction;
    let users;
    const fs = require(`fs`);
    if (!varName) {
      this.callNextAction(cache);
      return;
    }
    switch(type) {
      case 1:
        xxxTentaction = fs.readFileSync('./data/blacklist.txt', 'utf-8').toString();
        users = xxxTentaction.split("\n");
        if (!users.includes(user.id)) {
          fs.appendFileSync('./data/blacklist.txt', user.id + "\n");
        }
        break;
      case 2:
        xxxTentaction = fs.readFileSync('./data/blacklist.txt', 'utf-8').toString();
        users = xxxTentaction.split("\n");
        if (users.includes(user.id)) {
          console.log(users);
          console.log(users.filter(x => x !== user.id));
          fs.writeFileSync('./data/blacklist.txt', users.filter(x => x !== user.id).join("\n"));
        }
        break;
    default:
        console.log("wha- hwatt???");
        break;
    }
  },
