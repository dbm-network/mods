class GetCommandDescription {
    constructor(params) {
        this.name = 'Get Command Description';
        this.DVN = '1.0.0';
        this.displayName = `Get Command Description`;
        this.section = "Other Stuff";
        this.author = "Hazelpy";
        this.version = '1.0.0';
        this.short_description = "Get the command description from command name or ID.";
        this.fields = ["findBy", "commandData", "saveTo", "varName"];
    }

    subtitle(data) {
        return "Get Command Description";
    }

    html(isEvent, data) {
        return `<div width="540" style="height: auto;" overflow-y="scroll">
            <div style="float: left; width: 35%;">
                Find By:<br>
                <select id="findBy" class="round">
                    <option value="id">Command ID</option>
                    <option value="name">Command Name</option>
                </select>
            </div>
            <div style="float: right; width: 60%;">
                Value:<br>
                <input type="text" id="commandData" class="round" placeholder="Value"></input>
            </div><br>
            <div style="float: left; width: 35%;">
                Save To:<br>
                <select id="saveTo" class="round">
                    <option value="1">Temp Variable</option>
                    <option value="2">Server Variable</option>
                    <option value="3">Global Variable</option>
                </select>
            </div>
            <div style="float: right; width: 60%;">
                Variable Name:<br>
                <input type="text" id="varName" class="round" placeholder="Variable Name"></input>
            </div>
        </div>`;
    }

    init() {
        return;
    }

    action(cache) {
        const index = cache.index;
        const data = cache.actions[index];
        const findBy = data.findBy;
        const saveTo = data.saveTo;

        const findByValue = data.commandData;
        const saveToName = data.varName;

        const Files = this.getDBM().Files;
        const commands = Files.data.commands;
        
        if (findBy == "id") {
            var cmd;

            for (let i = 0; i < commands.length; i++) {
                cmd = commands[i];
                if (!cmd) { continue; }
                if (cmd && cmd._id === findByValue) {
                    for (let j = 0; j < cmd.actions.length; j++) {
                        let action = cmd.actions[j];
                        if (action.name == "Command Description") {
                            console.log(saveTo);
                            this.storeValue(action.description, Number(saveTo), saveToName, cache);
                            this.callNextAction(cache);
                            return;
                        } else {
                            console.log(action.name);
                        }
                    }
                }
            }

            this.storeValue(null, varType, saveToName, cache);
            this.callNextAction(cache);
        } else if (findBy == "name") {
            var cmd;

            for (let i = 0; i < commands.length; i++) {
                cmd = commands[i];
                if (!cmd) { continue; }
                if (cmd && cmd.name === findByValue) {
                    for (let j = 0; j < cmd.actions.length; j++) {
                        let action = cmd.actions[j];
                        if (action.name == "Command Description") {
                            console.log(saveTo);
                            this.storeValue(action.description, Number(saveTo), saveToName, cache);
                            this.callNextAction(cache);
                            return;
                        } else {
                            console.log(action.name);
                        }
                    }
                }
            }

            this.storeValue(null, varType, saveToName, cache);
            this.callNextAction(cache);
        }

        this.callNextAction(cache);
    }

    mod(DBM) {
        return;
    }
}

module.exports = new GetCommandDescription();