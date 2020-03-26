module.exports = {
	
    name: "Member Nickname Changed MOD",
    
    isEvent: true,
    
    fields: ["Temp Variable Name (stores new nickname):", "Temp Variable Name (stores member object):"],
    
    mod: function(DBM) {
        DBM.Mindlesscargo = DBM.Mindlesscargo || {};
        DBM.Mindlesscargo.nicknameChanged = async function(oldMember, newMember) {
            const { Bot, Actions } = DBM;
            const events = Bot.$evts["Member Nickname Changed MOD"];
            if(!events) return;
            if (newMember.nickname === oldMember.nickname) return;

            for (const event of events) {
                const temp = {};
                const server = newMember.guild
 
                const newNickname = newMember.nickname;


                if (event.temp) temp[event.temp] = newNickname;
                if (event.temp2) temp[event.temp2] = newMember.user;

                Actions.invokeEvent(event, server, temp);
            }


        };
        
        const onReady = DBM.Bot.onReady;
        DBM.Bot.onReady = function(...params) {
            DBM.Bot.bot.on("guildMemberUpdate", DBM.Mindlesscargo.nicknameChanged);
            onReady.apply(this, ...params);
        }
    }
    };
