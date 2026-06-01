module.exports = {
  name: 'OpenAI Action',
  section: 'Other Stuff',

  subtitle(data) {
    const service = data.service === 'image' ? 'Images' : 'Chat';
    const model = data.model || (data.service === 'image' ? 'dall-e-3' : 'gpt-4o-mini');
    return `${service}: ${model}`;
  },

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods',
  },

  fields: [
    'service',
    'apiKeySource',
    'apiKeyInput',
    'apiKeyVar',
    'apiKeyEnv',
    'model',
    'systemMessage',
    'promptType',
    'promptValue',
    'promptVarType',
    'promptVar',
    'useConversation',
    'historyVarType',
    'historyVar',
    'temperature',
    'topP',
    'maxTokens',
    'presencePenalty',
    'frequencyPenalty',
    'jsonMode',
    'imageSize',
    'imageQuality',
    'imageCount',
    'imageFormat',
    'storeText',
    'textVarName',
    'storeImages',
    'imageVarName',
    'storeRaw',
    'rawVarName',
    'debugMode',
    'timeout',
    'retryCount',
    'retryDelay',
  ],

  html(isEvent, data) {
    const service = data.service || 'chat';
    const apiKeySource = data.apiKeySource || 'global';
    const promptType = data.promptType || 'text';
    const useConversation = data.useConversation === 'on';
    return `
<div class="dbmmodsbr" style="height: 550px; overflow-y: auto;">
  <div class="ui form">
    <div class="field">
      <span class="dbminputlabel">Service</span>
      <select id="service" class="round" onchange="glob.openaiUpdateService(this.value)">
        <option value="chat" ${service === 'image' ? '' : 'selected'}>GPT / Chat Completions</option>
        <option value="image" ${service === 'image' ? 'selected' : ''}>Images (DALL·E)</option>
      </select>
    </div>

    <div class="field">
      <span class="dbminputlabel">API Key Source</span>
      <select id="apiKeySource" class="round" onchange="glob.openaiToggleKey()">
        <option value="input" ${apiKeySource === 'input' ? 'selected' : ''}>Direct Input (not recommended)</option>
        <option value="temp" ${apiKeySource === 'temp' ? 'selected' : ''}>Temp Variable</option>
        <option value="server" ${apiKeySource === 'server' ? 'selected' : ''}>Server Variable</option>
        <option value="global" ${apiKeySource === 'global' ? 'selected' : ''}>Global Variable</option>
      </select>
    </div>

    <div id="apiKeyInputRow" class="field" style="display: none;">
      <span class="dbminputlabel">API Key / Env Name</span>
      <input id="apiKeyInput" class="round" type="text" placeholder="OPENAI_API_KEY" value="${data.apiKeyInput ?? ''}">
    </div>

    <div id="apiKeyVariableRow" class="field" style="display: none;">
      <span class="dbminputlabel">Variable Name</span>
      <input id="apiKeyVar" class="round" type="text" placeholder="apiKey" value="${data.apiKeyVar ?? ''}">
    </div>

    <div class="field">
      <span class="dbminputlabel">Model</span>
      <input id="model" class="round" type="text" placeholder="gpt-4o-mini" value="${data.model ?? ''}">
    </div>

    <div data-service="chat" class="field">
      <span class="dbminputlabel">System Message</span>
      <textarea id="systemMessage" class="round" rows="2" placeholder="You are a helpful assistant.">${
        data.systemMessage ?? ''
      }</textarea>
    </div>

    <div data-service="chat,image" class="field">
      <span class="dbminputlabel">Prompt Source</span>
      <select id="promptType" class="round" onchange="glob.openaiTogglePrompt(this.value)">
        <option value="text" ${promptType === 'text' ? 'selected' : ''}>Direct Text</option>
        <option value="variable" ${promptType === 'variable' ? 'selected' : ''}>From Variable</option>
      </select>
    </div>

    <div id="promptTextRow" data-service="chat,image" class="field">
      <span class="dbminputlabel">Prompt Text</span>
      <textarea id="promptValue" class="round" rows="3" placeholder="Describe your prompt here..." name="is-eval">${
        data.promptValue ?? ''
      }</textarea>
    </div>

    <div id="promptVariableRow" data-service="chat,image" class="field" style="display: none;">
      <span class="dbminputlabel">Prompt Variable</span>
      <div class="two fields">
        <div class="field">
          <select id="promptVarType" class="round">
            <option value="1" ${data.promptVarType === '1' ? 'selected' : ''}>Temp</option>
            <option value="2" ${data.promptVarType === '2' ? 'selected' : ''}>Server</option>
            <option value="3" ${data.promptVarType === '3' ? 'selected' : ''}>Global</option>
          </select>
        </div>
        <div class="field">
          <input id="promptVar" class="round" type="text" placeholder="promptText" value="${data.promptVar ?? ''}">
        </div>
      </div>
    </div>

    <div data-service="chat" class="field">
      <div class="ui checkbox" style="margin-top: 10px;">
        <input type="checkbox" id="useConversation" ${
          useConversation ? 'checked' : ''
        } onchange="glob.openaiToggleConversation(this.checked)">
        <label>Use conversation history (array of messages)</label>
      </div>
    </div>

    <div id="conversationSection" data-service="chat" style="display: none;">
      <div class="two fields">
        <div class="field">
          <span class="dbminputlabel">Conversation Variable Type</span>
          <select id="historyVarType" class="round">
            <option value="1" ${data.historyVarType === '1' ? 'selected' : ''}>Temp</option>
            <option value="2" ${data.historyVarType === '2' ? 'selected' : ''}>Server</option>
            <option value="3" ${data.historyVarType === '3' ? 'selected' : ''}>Global</option>
          </select>
        </div>
        <div class="field">
          <span class="dbminputlabel">Conversation Variable Name</span>
          <input id="historyVar" class="round" type="text" placeholder="openaiConversation" value="${
            data.historyVar ?? ''
          }">
        </div>
      </div>
    </div>

    <div data-service="chat" class="two fields">
      <div class="field">
        <span class="dbminputlabel">Temperature</span>
        <input id="temperature" class="round" type="text" placeholder="0.7" value="${data.temperature ?? ''}">
      </div>
      <div class="field">
        <span class="dbminputlabel">Top P</span>
        <input id="topP" class="round" type="text" placeholder="1" value="${data.topP ?? ''}">
      </div>
    </div>

    <div data-service="chat" class="two fields">
      <div class="field">
        <span class="dbminputlabel">Max Tokens</span>
        <input id="maxTokens" class="round" type="text" placeholder="4000" value="${data.maxTokens ?? ''}">
      </div>
      <div class="field">
        <span class="dbminputlabel">JSON Mode</span>
        <select id="jsonMode" class="round">
          <option value="0" ${data.jsonMode === '1' ? '' : 'selected'}>Disabled</option>
          <option value="1" ${data.jsonMode === '1' ? 'selected' : ''}>Enabled</option>
        </select>
      </div>
    </div>

    <div data-service="chat" class="two fields">
      <div class="field">
        <span class="dbminputlabel">Presence Penalty</span>
        <input id="presencePenalty" class="round" type="text" placeholder="0" value="${data.presencePenalty ?? ''}">
      </div>
      <div class="field">
        <span class="dbminputlabel">Frequency Penalty</span>
        <input id="frequencyPenalty" class="round" type="text" placeholder="0" value="${data.frequencyPenalty ?? ''}">
      </div>
    </div>

    <div data-service="image" class="two fields" style="display: none;">
      <div class="field">
        <span class="dbminputlabel">Image Size</span>
        <select id="imageSize" class="round">
          <option value="1024x1024" ${
            data.imageSize === '1024x1024' || !data.imageSize ? 'selected' : ''
          }>1024 x 1024</option>
          <option value="512x512" ${data.imageSize === '512x512' ? 'selected' : ''}>512 x 512</option>
          <option value="256x256" ${data.imageSize === '256x256' ? 'selected' : ''}>256 x 256</option>
        </select>
      </div>
      <div class="field">
        <span class="dbminputlabel">Image Quality</span>
        <select id="imageQuality" class="round">
          <option value="standard" ${data.imageQuality === 'hd' ? '' : 'selected'}>Standard</option>
          <option value="hd" ${data.imageQuality === 'hd' ? 'selected' : ''}>HD (costs more)</option>
        </select>
      </div>
    </div>

    <div data-service="image" class="two fields" style="display: none;">
      <div class="field">
        <span class="dbminputlabel">Image Count</span>
        <input id="imageCount" class="round" type="text" placeholder="1" value="${data.imageCount ?? ''}">
      </div>
      <div class="field">
        <span class="dbminputlabel">Image Format</span>
        <select id="imageFormat" class="round">
          <option value="url" ${data.imageFormat === 'b64_json' ? '' : 'selected'}>URL</option>
          <option value="b64_json" ${data.imageFormat === 'b64_json' ? 'selected' : ''}>Base64</option>
        </select>
      </div>
    </div>

    <div class="two fields">
      <div class="field">
        <span class="dbminputlabel">Store Text Response</span>
        <select id="storeText" class="round">
          <option value="0" ${
            data.storeText === '1' || data.storeText === '2' || data.storeText === '3' ? '' : 'selected'
          }>Do Not Store</option>
          <option value="1" ${data.storeText === '1' ? 'selected' : ''}>Temp Variable</option>
          <option value="2" ${data.storeText === '2' ? 'selected' : ''}>Server Variable</option>
          <option value="3" ${data.storeText === '3' ? 'selected' : ''}>Global Variable</option>
        </select>
      </div>
      <div class="field">
        <span class="dbminputlabel">Text Variable Name</span>
        <input id="textVarName" class="round" type="text" value="${data.textVarName ?? ''}">
      </div>
    </div>

    <div class="two fields">
      <div class="field">
        <span class="dbminputlabel">Store Images</span>
        <select id="storeImages" class="round">
          <option value="0" ${
            data.storeImages === '1' || data.storeImages === '2' || data.storeImages === '3' ? '' : 'selected'
          }>Do Not Store</option>
          <option value="1" ${data.storeImages === '1' ? 'selected' : ''}>Temp Variable</option>
          <option value="2" ${data.storeImages === '2' ? 'selected' : ''}>Server Variable</option>
          <option value="3" ${data.storeImages === '3' ? 'selected' : ''}>Global Variable</option>
        </select>
      </div>
      <div class="field">
        <span class="dbminputlabel">Images Variable Name</span>
        <input id="imageVarName" class="round" type="text" value="${data.imageVarName ?? ''}">
      </div>
    </div>

    <div class="two fields">
      <div class="field">
        <span class="dbminputlabel">Store Raw Response</span>
        <select id="storeRaw" class="round">
          <option value="0" ${
            data.storeRaw === '1' || data.storeRaw === '2' || data.storeRaw === '3' ? '' : 'selected'
          }>Do Not Store</option>
          <option value="1" ${data.storeRaw === '1' ? 'selected' : ''}>Temp Variable</option>
          <option value="2" ${data.storeRaw === '2' ? 'selected' : ''}>Server Variable</option>
          <option value="3" ${data.storeRaw === '3' ? 'selected' : ''}>Global Variable</option>
        </select>
      </div>
      <div class="field">
        <span class="dbminputlabel">Raw Variable Name</span>
        <input id="rawVarName" class="round" type="text" value="${data.rawVarName ?? ''}">
      </div>
    </div>

    <div class="two fields">
      <div class="field">
        <span class="dbminputlabel">Timeout (ms)</span>
        <input id="timeout" class="round" type="text" placeholder="60000" value="${data.timeout ?? ''}">
      </div>
      <div class="field">
        <span class="dbminputlabel">Retry Attempts</span>
        <input id="retryCount" class="round" type="text" placeholder="1" value="${data.retryCount ?? ''}">
      </div>
    </div>

    <div class="two fields">
      <div class="field">
        <span class="dbminputlabel">Retry Delay (ms)</span>
        <input id="retryDelay" class="round" type="text" placeholder="1500" value="${data.retryDelay ?? ''}">
      </div>
      <div class="field">
        <span class="dbminputlabel">Debug Mode</span>
        <select id="debugMode" class="round">
          <option value="0" ${data.debugMode === '1' ? '' : 'selected'}>Disabled</option>
          <option value="1" ${data.debugMode === '1' ? 'selected' : ''}>Enabled</option>
        </select>
      </div>
    </div>
  </div>
</div>
<style>
  .dbmmodsbr .field {
    margin-bottom: 12px;
  }
</style>`;
  },

  init() {
    const { document, glob } = this;

    glob.openaiUpdateService = function openaiUpdateService(value) {
      const blocks = document.querySelectorAll('[data-service]');
      for (const block of blocks) {
        const modes = block.getAttribute('data-service').split(',');
        block.style.display = modes.includes(value) ? '' : 'none';
      }
    };

    glob.openaiTogglePrompt = function openaiTogglePrompt(val) {
      const textRow = document.getElementById('promptTextRow');
      const varRow = document.getElementById('promptVariableRow');
      if (textRow && varRow) {
        textRow.style.display = val === 'text' ? '' : 'none';
        varRow.style.display = val === 'variable' ? '' : 'none';
      }
    };

    glob.openaiToggleConversation = function openaiToggleConversation(checked) {
      const section = document.getElementById('conversationSection');
      if (section) section.style.display = checked ? '' : 'none';
    };

    glob.openaiToggleKey = function openaiToggleKey() {
      const source = document.getElementById('apiKeySource');
      const inputRow = document.getElementById('apiKeyInputRow');
      const varRow = document.getElementById('apiKeyVariableRow');
      if (!source || !inputRow || !varRow) return;
      const value = source.value;
      if (value === 'input') {
        inputRow.style.display = 'block';
        inputRow.querySelector('span').textContent = 'API Key';
      } else {
        inputRow.style.display = 'none';
      }
    };

    const service = document.getElementById('service');
    const promptType = document.getElementById('promptType');
    const useConversation = document.getElementById('useConversation');

    glob.openaiToggleKey();
    glob.openaiTogglePrompt(promptType?.value ?? 'text');
    glob.openaiToggleConversation(useConversation?.checked ?? false);
    glob.openaiUpdateService(service?.value ?? 'chat');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const service = data.service === 'image' ? 'image' : 'chat';
    const { Actions } = this.getDBM();
    const Mods = this.getMods();
    const fetch = Mods.require('node-fetch', '2');
    const path = require('path');
    const fs = require('fs');

    const debugMode = data.debugMode === '1';
    const helperDir = path.join(process.cwd(), 'resources', 'openai');
    const helperPath = path.join(helperDir, 'execute.js');

    if (!fs.existsSync(helperPath)) {
      if (!fs.existsSync(helperDir)) {
        fs.mkdirSync(helperDir, { recursive: true });
      }

      const helperContent = [
        "const { setTimeout: delay } = require('timers/promises');",
        '',
        'function buildChatMessages({ systemMessage, conversation, prompt }) {',
        '  const messages = [];',
        '  if (systemMessage) {',
        "    messages.push({ role: 'system', content: systemMessage });",
        '  }',
        '  if (Array.isArray(conversation)) {',
        '    for (const entry of conversation) {',
        "      if (entry && typeof entry.role === 'string' && typeof entry.content === 'string') {",
        '        messages.push({ role: entry.role, content: entry.content });',
        '      }',
        '    }',
        '  }',
        '  if (prompt) {',
        "    messages.push({ role: 'user', content: prompt });",
        '  }',
        '  return messages;',
        '}',
        '',
        'async function callWithRetries(fetch, request, retries, retryDelay, debugMode) {',
        '  let lastError;',
        '  for (let attempt = 0; attempt <= retries; attempt += 1) {',
        '    try {',
        '      const response = await fetch(request.url, request.options);',
        '      const json = await response.json();',
        '      if (!response.ok) {',
        "        const message = json?.error?.message || response.statusText || 'Unknown error';",
        '        throw new Error(`HTTP ${response.status}: ${message}`);',
        '      }',
        '      return json;',
        '    } catch (error) {',
        '      lastError = error;',
        '      if (debugMode) {',
        '        console.warn(`[${new Date().toISOString()}][OpenAI Helper] Attempt ${attempt + 1} failed: ${error.message || error}`);',
        '      }',
        '      if (attempt < retries) {',
        '        const delayMs = Math.max(0, retryDelay);',
        '        if (delayMs > 0) {',
        '          await delay(delayMs);',
        '        }',
        '      }',
        '    }',
        '  }',
        '  throw lastError;',
        '}',
        '',
        'module.exports = async function executeOpenAI(options) {',
        '  const {',
        '    fetch,',
        '    apiKey,',
        '    service,',
        '    model,',
        '    prompt,',
        '    systemMessage,',
        '    conversation,',
        '    temperature,',
        '    topP,',
        '    maxTokens,',
        '    presencePenalty,',
        '    frequencyPenalty,',
        '    jsonMode,',
        '    imageSize,',
        '    imageQuality,',
        '    imageCount,',
        '    imageFormat,',
        '    timeout,',
        '    retryCount,',
        '    retryDelay,',
        '    debugMode,',
        '  } = options;',
        '',
        "  if (!fetch) throw new Error('Missing fetch implementation.');",
        "  if (!apiKey) throw new Error('Missing OpenAI API key.');",
        "  if (!prompt) throw new Error('Prompt is required.');",
        '',
        '  const controller = new AbortController();',
        '  const { signal } = controller;',
        '  let timer;',
        '  if (timeout > 0) {',
        '    timer = setTimeout(() => controller.abort(), timeout);',
        '  }',
        '',
        '  const headers = {',
        "    'Content-Type': 'application/json',",
        '    Authorization: `Bearer ${apiKey}`,',
        '  };',
        '',
        '  try {',
        '    let request;',
        "    if (service === 'image') {",
        '      request = {',
        "        url: 'https://api.openai.com/v1/images/generations',",
        '        options: {',
        "          method: 'POST',",
        '          headers,',
        '          signal,',
        '          body: JSON.stringify({',
        "            model: model || 'dall-e-3',",
        '            prompt,',
        '            size: imageSize || "1024x1024",',
        "            quality: imageQuality || 'standard',",
        "            response_format: imageFormat || 'url',",
        '            n: Math.max(1, Math.min(imageCount || 1, 8)),',
        '          }),',
        '        },',
        '      };',
        '    } else {',
        '      request = {',
        "        url: 'https://api.openai.com/v1/chat/completions',",
        '        options: {',
        "          method: 'POST',",
        '          headers,',
        '          signal,',
        '          body: JSON.stringify({',
        "            model: model || 'gpt-4o-mini',",
        '            messages: buildChatMessages({ systemMessage, conversation, prompt }),',
        '            temperature: Number.isFinite(temperature) ? temperature : undefined,',
        '            top_p: Number.isFinite(topP) ? topP : undefined,',
        '            max_tokens: Number.isFinite(maxTokens) ? maxTokens : undefined,',
        '            presence_penalty: Number.isFinite(presencePenalty) ? presencePenalty : undefined,',
        '            frequency_penalty: Number.isFinite(frequencyPenalty) ? frequencyPenalty : undefined,',
        "            response_format: jsonMode ? { type: 'json_object' } : undefined,",
        '          }),',
        '        },',
        '      };',
        '    }',
        '',
        '    if (debugMode) {',
        '      console.log(`[${new Date().toISOString()}][OpenAI Helper] POST ${request.url}`);',
        '    }',
        '',
        '    const responseJson = await callWithRetries(fetch, request, retryCount || 0, retryDelay || 0, debugMode);',
        '',
        '    const result = { response: responseJson };',
        '',
        "    if (service === 'image') {",
        '      const images = Array.isArray(responseJson?.data)',
        "        ? responseJson.data.map((item) => (imageFormat === 'b64_json' ? item?.b64_json : item?.url)).filter(Boolean)",
        '        : [];',
        '      result.images = images;',
        '    } else {',
        '      const messages = responseJson?.choices?.map((choice) => choice?.message?.content).filter(Boolean) || [];',
        "      result.text = messages.join('\n');",
        '    }',
        '',
        '    return result;',
        '  } finally {',
        '    if (timer) clearTimeout(timer);',
        '  }',
        '};',
        '',
      ].join('\n');

      try {
        fs.writeFileSync(helperPath, helperContent, 'utf8');
        if (debugMode) {
          console.log(`[${new Date().toISOString()}][OpenAI Action] Helper script created at ${helperPath}.`);
        }
      } catch (error) {
        console.error(
          `[${new Date().toISOString()}][OpenAI Action] Failed to create helper script:`,
          error?.message || error,
        );
        return this.callNextAction(cache);
      }
    }

    delete require.cache[require.resolve(helperPath)];
    const execute = require(helperPath);

    const apiKeySource = data.apiKeySource || 'global';
    let apiKey = '';
    switch (apiKeySource) {
      case 'input':
        apiKey = this.evalMessage(data.apiKeyInput, cache);
        break;
      case 'temp':
        apiKey = this.getVariable(1, this.evalMessage(data.apiKeyVar, cache), cache);
        break;
      case 'server':
        apiKey = this.getVariable(2, this.evalMessage(data.apiKeyVar, cache), cache);
        break;
      case 'global':
        apiKey = this.getVariable(3, this.evalMessage(data.apiKeyVar, cache), cache);
        break;
      default:
        break;
    }

    if (!apiKey) {
      console.error(`[${new Date().toISOString()}][OpenAI Action] Missing API key.`);
      return this.callNextAction(cache);
    }

    const model = this.evalMessage(data.model || (service === 'image' ? 'dall-e-3' : 'gpt-4o-mini'), cache);
    const temperature = parseFloat(this.evalMessage(data.temperature || '0.7', cache));
    const topP = parseFloat(this.evalMessage(data.topP || '1', cache));
    const maxTokens = parseInt(this.evalMessage(data.maxTokens || '4000', cache), 10);
    const presencePenalty = parseFloat(this.evalMessage(data.presencePenalty || '0', cache));
    const frequencyPenalty = parseFloat(this.evalMessage(data.frequencyPenalty || '0', cache));
    const jsonMode = data.jsonMode === '1';
    const imageSize = data.imageSize || '1024x1024';
    const imageQuality = data.imageQuality || 'standard';
    const imageCount = Math.max(1, parseInt(this.evalMessage(data.imageCount || '1', cache), 10) || 1);
    const imageFormat = data.imageFormat || 'url';
    const timeout = Math.max(0, parseInt(this.evalMessage(data.timeout || '60000', cache), 10) || 0);
    const retryCount = Math.max(0, parseInt(this.evalMessage(data.retryCount || '1', cache), 10) || 0);
    const retryDelay = Math.max(0, parseInt(this.evalMessage(data.retryDelay || '1500', cache), 10) || 0);

    let prompt = '';
    if (data.promptType === 'variable') {
      const promptVarType = parseInt(data.promptVarType || '1', 10);
      const varName = this.evalMessage(data.promptVar, cache);
      if (varName) {
        prompt = this.getVariable(promptVarType, varName, cache);
      }
    } else {
      prompt = this.evalMessage(data.promptValue, cache);
    }

    if (!prompt) {
      console.error(`[${new Date().toISOString()}][OpenAI Action] Prompt is empty.`);
      return this.callNextAction(cache);
    }

    const systemMessage = this.evalMessage(data.systemMessage || '', cache);

    let conversation = [];
    let historyStorage;
    if (service === 'chat' && data.useConversation === 'on') {
      historyStorage = parseInt(data.historyVarType || '1', 10);
      const historyName = this.evalMessage(data.historyVar, cache);
      if (historyName) {
        const existing = this.getVariable(historyStorage, historyName, cache);
        if (Array.isArray(existing)) {
          conversation = existing;
        }
      }
    }

    const options = {
      fetch,
      apiKey,
      service,
      model,
      prompt,
      systemMessage,
      conversation,
      temperature: Number.isFinite(temperature) ? temperature : undefined,
      topP: Number.isFinite(topP) ? topP : undefined,
      maxTokens: Number.isFinite(maxTokens) ? maxTokens : undefined,
      presencePenalty: Number.isFinite(presencePenalty) ? presencePenalty : undefined,
      frequencyPenalty: Number.isFinite(frequencyPenalty) ? frequencyPenalty : undefined,
      jsonMode,
      imageSize,
      imageQuality,
      imageCount,
      imageFormat,
      timeout,
      retryCount,
      retryDelay,
      debugMode,
    };

    if (debugMode) {
      console.log(`[${new Date().toISOString()}][OpenAI Action] Sending request to OpenAI (${service}).`);
    }

    let result;
    try {
      result = await execute(options);
    } catch (error) {
      console.error(`[${new Date().toISOString()}][OpenAI Action] Request failed:`, error?.message || error);
      return this.callNextAction(cache);
    }

    if (!result) {
      if (debugMode) {
        console.warn(`[${new Date().toISOString()}][OpenAI Action] No result returned.`);
      }
      return this.callNextAction(cache);
    }

    const storeText = parseInt(data.storeText || '0', 10);
    const storeImages = parseInt(data.storeImages || '0', 10);
    const storeRaw = parseInt(data.storeRaw || '0', 10);

    if (service === 'chat' && storeText > 0) {
      const responseText = (result.text || '').trim();
      if (responseText) {
        Actions.storeValue(responseText, storeText, this.evalMessage(data.textVarName, cache), cache);
      }
    }

    if (service === 'image' && storeImages > 0) {
      const images = Array.isArray(result.images) ? result.images : [];
      if (images.length) {
        Actions.storeValue(images, storeImages, this.evalMessage(data.imageVarName, cache), cache);
      }
    }

    if (storeRaw > 0) {
      Actions.storeValue(result.response, storeRaw, this.evalMessage(data.rawVarName, cache), cache);
    }

    if (service === 'chat' && data.useConversation === 'on') {
      const historyName = this.evalMessage(data.historyVar, cache);
      if (historyStorage && historyName) {
        const updatedHistory = Array.isArray(conversation) ? conversation.slice() : [];
        if (prompt) {
          updatedHistory.push({ role: 'user', content: prompt });
        }
        if (result.text) {
          updatedHistory.push({ role: 'assistant', content: result.text });
        }
        Actions.storeValue(updatedHistory, historyStorage, historyName, cache);
      }
    }

    this.callNextAction(cache);
  },

  mod() {},
};
