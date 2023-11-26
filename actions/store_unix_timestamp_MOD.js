module.exports = {
    name: "Store Unix Timestamp",
    section: "Other Stuff",
    meta: {
        version: "2.1.7",
        preciseCheck: true,
        author: 'DBM Mods',
        authorUrl: 'https://github.com/dbm-network/mods',
        downloadUrl: 'https://github.com/dbm-network/mods/blob/master/actions/store_unix_timestamp_MOD.js'
    },

    subtitle() {
        return `Current Unix Timestamp`;
    },

    fields: ["type", "varName"],

    html() {
        return `
<div style="padding-top: 8px;">
    <span class="dbminputlabel">Time Info</span>
    <input value="Current Timestamp" class="round" disabled></input>
</div>

<br>

<div style="float: left; padding-top: 8px; width: 30%;">
    <span class="dbminputlabel">Store In</span>
    <select id="type" class="round">
        <option value="1" selected>Temp Variable</option>
        <option value="2">Server Variable</option>
        <option value="3">Global Variable</option>
    </select>
</div>

<div style="float: right; padding-top: 8px; width: 65%">
    <span class="dbminputlabel">Variable Name</span>
    <input id="varName" class="round"></input>
</div>
`;
    },

    init() { },

    action(cache) {
        const data = cache.actions[cache.index];
        const result = Math.floor(new Date().getTime() / 1000);
        this.storeValue(result, data.type.value, data.varName, cache);
        this.callNextAction(cache);
    },

    mod() { },
};