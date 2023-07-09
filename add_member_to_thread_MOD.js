module.exports = {
    name: "Add Member to Thread MOD",
    section: "Channel Control",
    meta: {
        version: '2.1.7',
        preciseCheck: true,
        author: 'Phyrok',
        authorUrl: '',
        downloadURL: '',
    },

    subtitle(data, presets) {

        if(data.descriptionx == true){
          desccor = data.descriptioncolor
          } else {
            desccor = 'none'
          }
    
        const storeTypes = presets.variables;

        return data.description
        ? `<font style="color:${desccor}">${data.description}</font>`
        : `<font style="color:${desccor}">${storeTypes[parseInt(data.storage, 10)]} (${data.varName})</font>`
      },

    fields: ["storage", "varName", "member", "varName2", "iffalse", "iffalseVal","descriptioncolor","description","descriptionx"],


    html(isEvent, data) {
        return `
      
        <div style="width: 100%; padding:5px 5px;height: calc(100vh - 160px);overflow:auto">

      <retrieve-from-variable dropdownLabel="Source Thread" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>
      
      <br><br><br><br>

      <member-input dropdownLabel="Member" selectId="member" variableContainerId="varNameContainer2" variableInputId="varName2"></member-input>

<style>

</style>
    `;
    },

    async action(cache) {
        const data = cache.actions[cache.index];
        const storage = parseInt(data.storage, 10);
        const varName = this.evalMessage(data.varName, cache);
        const th = this.getVariable(storage, varName, cache);
        const member = await this.getMemberFromData(data.member, data.varName2, cache);

        try { 
            await th.members.add(member.id);
            this.callNextAction(cache);
        } catch {
            this.executeResults(false, data, cache);
        }
    },

    mod() { },
};