module.exports = {
  name: 'Text To Speech',
  section: 'Messaging',
  meta: {
    version: '2.2.0',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/text_to_speech_MOD.js',
  },

  subtitle() {
    return 'Make your Discord bot talk.';
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Local MP3 path'];
  },

  fields: ['text', 'lang', 'storage', 'varName'],

  html() {
    return `
<div>
  <p>Uses <code>simple-tts-mp3</code> (chunks long text via Google TTS). In your bot project folder run: <code>npm install simple-tts-mp3</code></p>
  <p>Stores a <strong>local .mp3 file path</strong> (not an HTTP URL). Use <strong>Play File</strong> with this path, not Play URL.</p>
  <p>Normal sentences work beyond 200 characters. A single very long &quot;word&quot; with no spaces may fail (Google TTS chunking).</p>
  <p><strong>Security (npm audit):</strong> In your <strong>bot</strong> <code>package.json</code>, add root-level <code>&quot;overrides&quot;: { &quot;axios&quot;: &quot;^1.15.0&quot; }</code>, then <code>npm install</code>, so axios pulled in by Google TTS stays patched.</p>
</div>
<br>

<div style="width: 100%;">
  <span class="dbminputlabel">Message</span>
  <input id="text" class="round" type="text" placeholder="to be converted to speech">
</div>
<br>

<div style="width: 100%;">
  <span class="dbminputlabel">Language</span>
  <input id="lang" class="round" type="text">
</div>
<br>

<div>
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const text = this.evalMessage(data.text, cache);
    const languageRaw = this.evalMessage(data.lang, cache);
    const language = (languageRaw && String(languageRaw).trim()) || 'en';
    const Mods = this.getMods();
    const os = require('os');
    const path = require('path');
    const crypto = require('crypto');

    if (!text || !String(text).trim()) {
      console.error('[Text To Speech MOD] Missing or empty text.');
      this.callNextAction(cache);
      return;
    }

    try {
      const { createAudioFile } = Mods.require('simple-tts-mp3');
      const baseName = path.join(
        os.tmpdir(),
        `dbm-tts-${process.pid}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
      );
      const filePath = await createAudioFile(text, baseName, language);
      this.storeValue(filePath, storage, varName, cache);
    } catch (err) {
      const msg = err && err.message ? String(err.message) : 'Unknown error';
      console.error('[Text To Speech MOD] Failed to generate audio:', msg);
      this.callNextAction(cache);
      return;
    }
    this.callNextAction(cache);
  },

  mod() {},
};
