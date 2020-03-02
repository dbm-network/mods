module.exports = {
	
    name: "Member Role Removed MOD",
    
    isEvent: true,
    
    fields: ["Temp Variable Name (stores role object):", "Temp Variable Name (stores member object):"],
    
    mod: function(DBM) {
        DBM.Mindlesscargo = DBM.Mindlesscargo || {};
        DBM.Mindlesscargo.roleRemoved = async function(oldMember, newMember) {
            const { Bot, Actions } = DBM;
            const events = Bot.$evts["Member Role Removed MOD"];
            if(!events) return;
            if (newMember.roles.size >= oldMember.roles.size) return;

            for (const event of events) {
                const temp = {};
                const server = newMember.guild
                const oldRoles = oldMember.roles;
                const newRoles = newMember.roles;

                let difference = oldRoles.filter(role => !newRoles.has(role.id));

                if (event.temp) temp[event.temp] = server.roles.find(role => role.id == difference.firstKey());
                if (event.temp2) temp[event.temp2] = newMember.user;

                Actions.invokeEvent(event, server, temp);
            }


        };
        
        const onReady = DBM.Bot.onReady;
        DBM.Bot.onReady = function(...params) {
            DBM.Bot.bot.on("guildMemberUpdate", DBM.Mindlesscargo.roleRemoved);
            onReady.apply(this, ...params);
        }
    }
    };
