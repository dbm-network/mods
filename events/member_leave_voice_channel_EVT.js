module.exports = {
  /**
   * The author of the event.
   * @type {string}
  */
  author: 'Almeida',

  /**
   * The name of the event type on the editor.
   * @type {string}
  */
  name: 'Member Leave Voice Channel',

  /**
   * Whether the object is of an event or not.
   * @type {boolean}
  */
  isEvent: true,

  /**
   * The fields of the event (Variables); there can only be either: 0, 1 or 2.
   * @type {Array<string>}
  */
  fields: ['Temp Variable Name (stores member that entered the channel):', 'Temp Variable Name (stores channel that the member left):'],

  /**
   * The function that is ran when the software/bot starts.
   * @param {Object<*>} DBM The DBM object.
   * @return {void}
   */
  mod(DBM) {
    DBM.MemberLeaveVoiceChannel = DBM.MemberLeaveVoiceChannel || {};

    const { Actions, Bot } = DBM;

    /**
     * Runs through all the bots events and runs the one that apply.
     * @param {User} oldUser The member before the voice state update.
     * @param {User} newUser The member after the voice state update.
     * @return {void}
     */
    DBM.MemberLeaveVoiceChannel.callAllEvents = async function(oldUser, newUser) {
      const events = Bot.$evts['Member Leave Voice Channel'];
      if (!events) return;

      for (const event of events) {
        const temp = {};

        const oldChannel = oldUser.voiceChannel;
        const newChannel = newUser.voiceChannel;
        const server = (oldChannel || newChannel).guild;

        if (event.temp) temp[event.temp] = server.member(newUser);
        if (event.temp2) temp[event.temp2] = oldChannel;

        if (oldChannel && !newChannel) Actions.invokeEvent(event, server, temp);
      }
    };

    /*
     * This is required so we have access to the Discord Client.
     */
    const onReady = DBM.Bot.onReady;
    DBM.Bot.onReady = function(...params) {
      DBM.Bot.bot.on('voiceStateUpdate', DBM.MemberLeaveVoiceChannel.callAllEvents);
      onReady.apply(this, ...params);
    };
  },
};
