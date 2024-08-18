const { Collection } = require('discord.js');

module.exports = {
  name: 'Invite Used',
  isEvent: true,

  fields: ['Temp Variable Name (Stores invite code that was used):', 'Temp Variable Name (Stores guild):'],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Bot, Actions } = DBM;
    const invites = new Collection();

    const { onReady } = Bot;
    Bot.onReady = function inviteUsedOnReady() {
      if (Bot.$evts['Invite Used']) {
        setTimeout(() => {
          Bot.bot.guilds.cache.forEach(async (guild) => {
            if (guild.me.permissions.has('MANAGE_GUILD')) {
              const serverinvites = await guild.invites.fetch();
              invites.set(guild.id, new Collection(serverinvites.map((invite) => [invite.code, invite.uses])));
            }
          });
        }, 1000).unref();

        Bot.bot.on('guildMemberAdd', async (member) => {
          if (member.guild.me.permissions.has('MANAGE_GUILD')) {
            const newinvites = await member.guild.invites.fetch();
            const oldinvites = invites.get(member.guild.id);
            const invite = newinvites.find((i) => i.uses > oldinvites.get(i.code));
            for (const event of Bot.$evts['Invite Used']) {
              const temp = {};
              if (event.temp) temp[event.temp] = invite.code;
              if (event.temp2) temp[event.temp2] = invite.guild;
              Actions.invokeEvent(event, member.guild, temp);
            }
            invites.get(member.guild.id).set(invite.code, invite.uses);
          }
        });

        Bot.bot.on('inviteDelete', (invite) => {
          if (invite.guild.members.me.permissions.has('MANAGE_GUILD')) {
            invites.get(invite.guild.id).delete(invite.code);
          }
        });

        Bot.bot.on('inviteCreate', (invite) => {
          if (invite.guild.members.me.permissions.has('MANAGE_GUILD')) {
            invites.get(invite.guild.id).set(invite.code, invite.uses);
          }
        });

        Bot.bot.on('guildCreate', (guild) => {
          if (guild.members.me.permissions.has('MANAGE_GUILD')) {
            guild.invites.fetch().then((guildInvites) => {
              invites.set(guild.id, new Map(guildInvites.map((invite) => [invite.code, invite.uses])));
            });
          }
        });

        Bot.bot.on('guildDelete', (guild) => {
          invites.delete(guild.id);
        });

        Bot.bot.on('roleUpdate', (oldrole, newrole) => {
          if (!newrole.tags || !newrole.tags.botId) return;
          if (newrole.tags.botId === Bot.bot.user.id) {
            const oldroleperms = oldrole.permissions.has('MANAGE_GUILD');
            const newroleperms = newrole.permissions.has('MANAGE_GUILD');
            if (!oldroleperms && newroleperms) {
              newrole.guild.invites.fetch().then((guildInvites) => {
                invites.set(newrole.guild.id, new Map(guildInvites.map((invite) => [invite.code, invite.uses])));
              });
            } else if (oldroleperms && !newroleperms) {
              invites.delete(newrole.guild.id);
            }
          }
        });
      }

      onReady.apply(this);
    };
  },
};
