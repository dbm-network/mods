class EmitEvent {
  constructor () {
    this.name = 'Emit Event'
    this.section = 'Bot Client Control'
    this.fields = ['eventType', 'firstArg', 'secondArg']
  }

  mod () {}

  subtitle ({ eventType }) {
    let DiscordJS
    try {
      DiscordJS = require('discord.js')
    } catch (_) {}

    const events = Object.values(DiscordJS.Constants.Events).sort()
    return events.includes(eventType) ? `Emits a ${eventType} event` : 'Not emitting antyhing'
  }

  init () {
    const { execSync } = require('child_process')
    const { document } = this

    const wrexlinks = document.getElementsByClassName('wrexlink2')
    for (let i = 0; i < wrexlinks.length; i++) {
      const wrexlink = wrexlinks[i]
      const url = wrexlink.getAttribute('data-url2')
      if (url) {
        wrexlink.setAttribute('title', url)
        wrexlink.addEventListener('click', (e) => {
          e.stopImmediatePropagation()
          execSync(`start ${url}`)
        })
      }
    }
  }

  action (cache) {
    const data = cache.actions[cache.index]

    const { DiscordJS } = this.getDBM()
    const events = Object.values(DiscordJS.Constants.Events).sort()
    const event = this.evalMessage(data.eventType)
    if (!events.includes(event)) return console.error(`${this.name} (#${cache.index + 1}): Unkown event type.`)

    const firstArg = this.evalMessage(data.firstArg, cache)
    const secondArg = this.evalMessage(data.secondArg, cache)

    const client = this.getDBM().Bot.bot
    client.emit(event, firstArg, secondArg)
  }

  html () {
    let DiscordJS
    try {
      DiscordJS = require('discord.js')
    } catch (_) {}

    const events = DiscordJS && Object.values(DiscordJS.Constants.Events).sort()
    const docs = `https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-${(events && events[0]) || 'channelCreate'}`

    return `
<div id="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
  ${events ? `
    <div style="padding-top: 8px;">
      <details>
        <summary><span style="color: white"><b>Available event types (click to expand)</b></summary>
        <div class="codeblock">
          <span style="color:#9b9b9b">
            ${events.map((e) => `<li>${e}</li>`).join('\n')}
          </span>
          <p>
            You can learn more about what events take what arguments on the <u><span class="wrexlink2" data-url2="${docs}">discord.js documentation.</span></u>
          </p>
      </details>
    </div>` : ''}
  <div class="container">
    Event Type:<br>
    <input id="eventType" class="round" type="text" value="error">
  </div>
  <div class="container">
    First Parameter:<br>
    <input id="firstArg" class="round" type="text">
  </div>
  <div class="container">
    Second Parameter:<br>
    <input id="secondArg" class="round" type="text">
  </div>
  <div style="float: left; width: 90%; padding-top: 8px;">
    <p><u>Note:</u><br>
    Some events may not require the two arguments and some may not even require any arguments at all. Just leave the boxes empty on those cases.
  </div><br>
</div>
<style>
  .container {
    float: left;
    width: 90%;
    padding-top: 8px;
  }

  .codeblock {
    margin-right: 25px;
    background-color: rgba(0,0,0,0.20);
    border-radius: 3.5px;
    border: 1px solid rgba(255,255,255,0.15);
    padding: 4px 8px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    transition: border 175ms ease;
  }

  span.wrexlink2 {
    color: #99b3ff;
    text-decoration: underline;
    cursor: pointer;
  }

  span.wrexlink2:hover {
    color: #4676b9;
  }
</style>`
  }
}

module.exports = new EmitEvent()
