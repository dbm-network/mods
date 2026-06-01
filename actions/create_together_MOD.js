module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Create Together',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'DBM Extended',

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `Action created by DBM Extended`;
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  //
  // Helps check for updates and provides info if a custom mod.
  // If this is a third-party mod, please set "author" and "authorUrl".
  //
  // It's highly recommended "preciseCheck" is set to false for third-party mods.
  // This will make it so the patch version (0.0.X) is not checked.
  // ---------------------------------------------------------------------

  meta: { version: '2.1.5', preciseCheck: true, author: null, authorUrl: null, downloadUrl: null },

  // ---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  // ---------------------------------------------------------------------

  fields: ['together'],

  // ---------------------------------------------------------------------
  // Command HTML
  //
  // This function returns a string containing the HTML used for
  // editing actions.
  //
  // The "isEvent" parameter will be true if this action is being used
  // for an event. Due to their nature, events lack certain Information,
  // so edit the HTML to reflect this.
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
      <div>
	<div style="padding-top: 8px; width: 100%;">
		<span class="dbminputlabel">Source Together</span><br>
		<select id="together" class="round">
      <option value="youtube">Youtube</options>
      <option value="spellcast">Spellcast</options>
      <option value="poker">Poker</options>
      <option value="fishing">Fishing</options>
      <option value="chess">Chess</options>
      <option value="checkers">Checkers</options>
      <option value="sketchheads">Sketchheads</options>
      <option value="doodlecrew">Doodlecrew</options>
      <option value="wordsnack">Wordsnack</options>
      <option value="awkword">Awkword</options>
      <option value="lettertile">Letter League</options>
		</select>
	</div>
</div>
<br><br>
<p>Zmiena = \${tempVars("GameInvite")}</p>
      `;
  },

  init() {},

  // ---------------------------------------------------------------------
  // Action Bot Function
  //
  // This is the function for the action within the Bot's Action class.
  // Keep in mind event calls won't have access to the "msg" parameter,
  // so be sure to provide checks for variable existence.
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    // Use DBM's DiscordJS for version compatibility (supports both v13 and v14)
    const { MessageEmbed } = this.getDBM().DiscordJS;
    const client = this.getDBM().Bot.bot;
    const { interaction } = cache;
    const { DiscordTogether } = require('discord-together');

    client.discordTogether = new DiscordTogether(client);

    if (interaction.member.voice.channel) {
      client.discordTogether.createTogetherCode(interaction.member.voice.channelId, data.together).then((invite) => {
        const result = invite.code;
        this.storeValue(result, 1, 'GameInvite', cache);
        this.callNextAction(cache);
      });
    } else {
      const embederror = new MessageEmbed()
        .setTitle(`Error!`)
        .setColor(0xff0000) // Red color as number for v14 compatibility
        .setTimestamp()
        .setDescription(
          `
                    
                > ** Join the voice channel **
    
                `,
        )
        .setFooter({
          text: `${interaction.member.user.username} (${interaction.member.user.id})`,
          iconURL: `${interaction.member.user.displayAvatarURL({ dynamic: true })}`,
        });
      interaction.reply({ embeds: [embederror], ephemeral: true });
    }
  },

  mod() {},
};
