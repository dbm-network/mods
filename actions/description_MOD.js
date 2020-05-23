module.exports = {
    name: "Command Description",
    section: "Other Stuff",
    author: "Hazelpy",
    version: "1.0.0",
    short_description: "Set command description and restrictions. Useful for help/info commands.",
    subtitle: function(data) { return `Command Description`; },
    fields: ["description", "restrictedTo"],
    html: (isEvent, data) => {
        return `<div width="540" height="360" overflow-y="scroll">
            <div style="padding-top: 8px;">
	            Description:<br>
	            <textarea id="description" rows="9" placeholder="Insert description here." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
            </div><br>
            <div style="padding-top: 8px;">
                Restricted to:<br>
                <select id="restrictedTo" class="round">
                    <option value="none" selected>Everybody</option>
                    <option value="botOwner">Bot Owner</option>
                </select>
            </div>
        </div>
        `;
    },
    action: function(cache) { this.callNextAction(cache); },
    init: function() { },
    mod: function(DBM) { }
}
