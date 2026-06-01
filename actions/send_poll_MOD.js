module.exports = {
  name: 'Send Poll',

  section: 'Messaging',

  subtitle(data) {
    const question = data.pollQuestion || 'No question set';
    return `Send poll: "${question.length > 50 ? `${question.slice(0, 47)}...` : question}"`;
  },

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Shadow',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadUrl: 'https://github.com/dbm-network/mods',
  },

  fields: [
    'channel',
    'varNameContainer',
    'varName',
    'pollQuestion',
    'pollAnswers',
    'pollAnswer',
    'pollEmoji',
    'pollAllowMultipleAnswers',
    'pollDuration',
  ],

  html(isEvent, data) {
    return `
<div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->1.0</a></div>




    <channel-input dropdownLabel="Source Channel" selectId="channel" variableContainerId="varNameContainer" variableInputId="varName"></channel-input>

    <br><br><br><br><br>

  <div style="padding: 3px 30px 1px;">

    
    <span class="dbminputlabel">Question</span>
    <input id="pollQuestion" class="round" type="text" placeholder="Leave blank for default..." style="width: 100%;">

    <br>
    
    <dialog-list id="pollAnswers" fields='["pollAnswer", "pollEmoji"]' dialogTitle="Create Answer" dialogWidth="400" dialogHeight="280" listLabel="Answers (min 1 - max 10)" listStyle="height: calc(100vh - 450px);" itemName="Answer" itemCols="1" itemHeight="30px;" itemTextFunction="data.pollAnswer" itemStyle="text-align: left; line-height: 30px;">
      <div style="padding: 16px;">
        <span class="dbminputlabel">Answer</span>
        <input id="pollAnswer" class="round" type="text" placeholder="Type your answer" style="width: 100%;">

        <br>

        <span class="dbminputlabel">Emoji</span>
        <input id="pollEmoji" class="round" type="text" placeholder="Leave blank for none..." style="width: 100%;">

        <br>
      </div>
    </dialog-list>

    
    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 20px; margin-bottom: 0;">
     
      <div style="flex: 1; text-align: left;">
        <dbm-checkbox id="pollAllowMultipleAnswers" label="Allow Multiple Answers"></dbm-checkbox>
      </div>
      

      <div style="flex: 1; text-align: left;">
      <span class="dbminputlabel">Duration (in hours 1/2/3...)</span>
      <input id="pollDuration" class="round" type="text" placeholder="Leave blank for 24h..." style="width: 100%;">
    </div>

  </div>
    `;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const pollQuestion = this.evalMessage(data.pollQuestion, cache) || 'Question';
    const pollDuration = this.evalMessage(data.pollDuration, cache) || '24';
    const pollAllowMultipleAnswers = data.pollAllowMultipleAnswers ? true : false;

    const pollAnswers = data.pollAnswers.map((answerData) => {
      return {
        text: this.evalMessage(answerData.pollAnswer, cache),
        emoji: this.evalMessage(answerData.pollEmoji, cache) || undefined,
      };
    });

    const targetChannel = await this.getChannelFromData(data.channel, data.varName, cache);

    if (!targetChannel) {
      this.callNextAction(cache);
      return;
    }

    try {
      await targetChannel.send({
        poll: {
          question: { text: pollQuestion },
          answers: pollAnswers,
          allowMultiselect: pollAllowMultipleAnswers,
          duration: pollDuration,
        },
      });
    } catch (err) {
      console.error('[Send Poll] Error sending survey:', err);
    }

    this.callNextAction(cache);
  },

  mod() {},
};
