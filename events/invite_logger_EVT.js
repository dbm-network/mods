const { Collection, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'Invite Logger',
  isEvent: true,

  fields: ['Temp Variable Name (Stores Invite Code):', 'Temp Variable Name (Stores Invited User):'],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Bot, Actions } = DBM;
    const invites = new Collection();

    const { onReady } = Bot;
    Bot.onReady = function inviteUsedOnReady() {
      if (Bot.$evts['Invite Logger']) {
        setTimeout(() => {
          Bot.bot.guilds.cache.forEach(async (guild) => {
            if (guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
              try {
                const serverinvites = await guild.invites.fetch();
                invites.set(guild.id, new Collection(serverinvites.map((invite) => [invite.code, invite.uses])));
              } catch (error) {
                console.error(`Error downloading invitations to the server ${guild.name}:`, error);
              }
            }
          });
        }, 1000).unref();

        Bot.bot.on('guildMemberAdd', async (member) => {
          if (member.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            try {
              const newinvites = await member.guild.invites.fetch();
              const oldinvites = invites.get(member.guild.id);
              const invite = newinvites.find((i) => i.uses > oldinvites.get(i.code));
              if (invite) {
                for (const event of Bot.$evts['Invite Logger']) {
                  const temp = {};
                  if (event.temp) temp[event.temp] = invite.code;
                  if (event.temp2) temp[event.temp2] = `<@${member.id}>`;
                  Actions.invokeEvent(event, member.guild, temp);
                }
                invites.get(member.guild.id).set(invite.code, invite.uses);
              }
            } catch (error) {
              console.error(`Error checking invitations for the user ${member.user.tag}:`, error);
            }
          }
        });

        Bot.bot.on('inviteDelete', (invite) => {
          if (invite.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            invites.get(invite.guild.id).delete(invite.code);
          }
        });

        Bot.bot.on('inviteCreate', (invite) => {
          if (invite.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            invites.get(invite.guild.id).set(invite.code, invite.uses);
          }
        });

        Bot.bot.on('guildCreate', (guild) => {
          if (guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            guild.invites
              .fetch()
              .then((guildInvites) => {
                invites.set(guild.id, new Map(guildInvites.map((invite) => [invite.code, invite.uses])));
              })
              .catch((error) => {
                console.error(`Error downloading invitations to the server ${guild.name}:`, error);
              });
          }
        });

        Bot.bot.on('guildDelete', (guild) => {
          invites.delete(guild.id);
        });

        Bot.bot.on('roleUpdate', (oldrole, newrole) => {
          if (!newrole.tags || !newrole.tags.botId) return;
          if (newrole.tags.botId === Bot.bot.user.id) {
            const oldroleperms = oldrole.permissions.has(PermissionsBitField.Flags.ManageGuild);
            const newroleperms = newrole.permissions.has(PermissionsBitField.Flags.ManageGuild);
            if (!oldroleperms && newroleperms) {
              newrole.guild.invites
                .fetch()
                .then((guildInvites) => {
                  invites.set(newrole.guild.id, new Map(guildInvites.map((invite) => [invite.code, invite.uses])));
                })
                .catch((error) => {
                  console.error(
                    `Error downloading invitations after updating the role on the server ${newrole.guild.name}:`,
                    error,
                  );
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
