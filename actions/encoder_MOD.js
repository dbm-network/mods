module.exports = {
  name: 'Encode/Decode Text',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
  },

  subtitle(data) {
    const methods = [
      'Binary',
      'Keyboard Shift',
      'Base64',
      'Caesar Cipher',
      'Enigma Machine',
      'Letter to Number',
      'Morse Code',
      'Hexadecimal',
      'URL Encoding',
      'ROT13',
      'Vigenère Cipher',
    ];
    const action = data.encode === 'true' ? 'Encode' : 'Decode';
    return `${methods[data.method]} ${action}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'String'];
  },

  fields: ['text', 'method', 'encode', 'shift', 'keyword', 'storage', 'varName'],

  html() {
    return `
<div style="padding-top: 8px;">
  <span class="dbminputlabel">Text</span>
  <textarea id="text" rows="3" placeholder="Insert text here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>
<div style="padding-top: 8px;">
  <span class="dbminputlabel">Method</span>
  <select id="method" class="round">
    <option value="0" selected>Binary</option>
    <option value="1">Keyboard Shift</option>
    <option value="2">Base64</option>
    <option value="3">Caesar Cipher</option>
    <option value="4">Enigma Machine</option>
    <option value="5">Letter to Number</option>
    <option value="6">Morse Code</option>
    <option value="7">Hexadecimal</option>
    <option value="8">URL Encoding</option>
    <option value="9">ROT13</option>
    <option value="10">Vigenère Cipher</option>
  </select>
</div>
<div style="padding-top: 8px;">
  <span class="dbminputlabel">Encode or Decode</span>
  <select id="encode" class="round">
    <option value="true" selected>Encode</option>
    <option value="false">Decode</option>
  </select>
</div>
<div style="padding-top: 8px;" id="shift-container">
  <span class="dbminputlabel">Shift Amount (for Caesar Cipher & Keyboard Shift)</span>
  <input id="shift" class="round" type="number" placeholder="Enter shift amount...">
</div>
<div style="padding-top: 8px;" id="keyword-container">
  <span class="dbminputlabel">Keyword (for Vigenère Cipher)</span>
  <input id="keyword" class="round" type="text" placeholder="Enter keyword...">
</div>
<div style="padding-top: 8px;">
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>`;
  },

  /* eslint-disable */
  init() {
    const { document } = this;
    const methodSelect = document.getElementById('method');
    const shiftContainer = document.getElementById('shift-container');
    const keywordContainer = document.getElementById('keyword-container');

    function toggleContainers() {
      const method = parseInt(methodSelect.value, 10);
      shiftContainer.style.display = method === 1 || method === 3 ? 'block' : 'none';
      keywordContainer.style.display = method === 10 ? 'block' : 'none';
    }

    methodSelect.addEventListener('change', toggleContainers);
    toggleContainers();
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const text = this.evalMessage(data.text, cache);
    const method = parseInt(data.method, 10);
    const encode = data.encode === 'true';
    const shift = parseInt(data.shift, 10);
    const keyword = this.evalMessage(data.keyword, cache);
    let result;

    switch (method) {
      case 0: // Binary
        result = encode
          ? text
              .split('')
              .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
              .join(' ')
          : text
              .split(' ')
              .map((bin) => String.fromCharCode(parseInt(bin, 2)))
              .join('');
        break;
      case 1: // Keyboard Shift
        const keyboardShift = (char, shift) => {
          const qwerty = 'qwertyuiopasdfghjklzxcvbnm';
          const index = qwerty.indexOf(char.toLowerCase());
          if (index === -1) return char;
          const newIndex = (index + shift + qwerty.length) % qwerty.length;
          return char === char.toUpperCase() ? qwerty[newIndex].toUpperCase() : qwerty[newIndex];
        };
        result = text
          .split('')
          .map((char) => keyboardShift(char, encode ? shift : -shift))
          .join('');
        break;
      case 2: // Base64
        result = encode ? Buffer.from(text).toString('base64') : Buffer.from(text, 'base64').toString('utf8');
        break;
      case 3: // Caesar Cipher
        result = text
          .split('')
          .map((char) => {
            if (char.match(/[a-z]/i)) {
              const code = char.charCodeAt(0);
              const offset = code >= 65 && code <= 90 ? 65 : 97;
              return String.fromCharCode(((((code - offset + (encode ? shift : -shift)) % 26) + 26) % 26) + offset);
            }
            return char;
          })
          .join('');
        break;
      case 4: // Enigma Machine (simplified)
        const enigma = (char, encode) => {
          const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          const reflector = 'YRUHQSLDPXNGOKMIEBFZCWVJAT';
          const rotor1 = 'EKMFLGDQVZNTOWYHXUSPAIBRCJ';
          const rotor2 = 'AJDKSIRUXBLHWTMCQGZNPYFVOE';
          const rotor3 = 'BDFHJLCPRTXVZNYEIWGAKMUSQO';
          const rotors = [rotor1, rotor2, rotor3];
          const reverse = (rotor) =>
            rotor.split('').reduce((acc, val, i) => {
              acc[val] = alphabet[i];
              return acc;
            }, {});

          if (!alphabet.includes(char.toUpperCase())) return char;
          let index = alphabet.indexOf(char.toUpperCase());
          for (let i = 0; i < rotors.length; i++) {
            index = alphabet.indexOf(rotors[i][index]);
          }
          index = alphabet.indexOf(reflector[index]);
          for (let i = rotors.length - 1; i >= 0; i--) {
            index = alphabet.indexOf(reverse(rotors[i])[index]);
          }
          return alphabet[index];
        };
        result = text
          .split('')
          .map((char) => enigma(char, encode))
          .join('');
        break;
      case 5: // Letter to Number
        result = encode
          ? text
              .split('')
              .map((char) => char.toLowerCase().charCodeAt(0) - 96)
              .join(' ')
          : text
              .split(' ')
              .map((num) => String.fromCharCode(parseInt(num) + 96))
              .join('');
        break;
      case 6: // Morse Code
        const morseAlphabet = {
          a: '.-',
          b: '-...',
          c: '-.-.',
          d: '-..',
          e: '.',
          f: '..-.',
          g: '--.',
          h: '....',
          i: '..',
          j: '.---',
          k: '-.-',
          l: '.-..',
          m: '--',
          n: '-.',
          o: '---',
          p: '.--.',
          q: '--.-',
          r: '.-.',
          s: '...',
          t: '-',
          u: '..-',
          v: '...-',
          w: '.--',
          x: '-..-',
          y: '-.--',
          z: '--..',
          1: '.----',
          2: '..---',
          3: '...--',
          4: '....-',
          5: '.....',
          6: '-....',
          7: '--...',
          8: '---..',
          9: '----.',
          0: '-----',
          '.': '.-.-.-',
          '/': '-..-.',
          ' ': '/',
        };
        if (encode) {
          result = text
            .toLowerCase()
            .split('')
            .map((char) => morseAlphabet[char] || '')
            .join(' ');
        } else {
          const reversedMorseAlphabet = Object.fromEntries(Object.entries(morseAlphabet).map(([k, v]) => [v, k]));
          result = text
            .split(' ')
            .map((code) => reversedMorseAlphabet[code] || '')
            .join('');
        }
        break;
      case 7: // Hexadecimal
        result = encode
          ? text
              .split('')
              .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
              .join(' ')
          : text
              .split(' ')
              .map((hex) => String.fromCharCode(parseInt(hex, 16)))
              .join('');
        break;
      case 8: // URL Encoding
        result = encode ? encodeURIComponent(text) : decodeURIComponent(text);
        break;
      case 9: // ROT13
        result = text.replace(/[a-z]/gi, (char) => {
          const offset = char <= 'Z' ? 65 : 97;
          return String.fromCharCode(((char.charCodeAt(0) - offset + 13) % 26) + offset);
        });
        break;
      case 10: // Vigenère Cipher
        const vigenere = (text, keyword, encode) => {
          const alphabet = 'abcdefghijklmnopqrstuvwxyz';
          const shift = (char, keyChar, encode) => {
            const charIndex = alphabet.indexOf(char.toLowerCase());
            const keyIndex = alphabet.indexOf(keyChar.toLowerCase());
            if (charIndex === -1 || keyIndex === -1) return char;
            const newIndex = encode ? (charIndex + keyIndex) % 26 : (charIndex - keyIndex + 26) % 26;
            return char === char.toUpperCase() ? alphabet[newIndex].toUpperCase() : alphabet[newIndex];
          };

          let keyIndex = 0;
          return text
            .split('')
            .map((char) => {
              if (alphabet.includes(char.toLowerCase())) {
                const result = shift(char, keyword[keyIndex], encode);
                keyIndex = (keyIndex + 1) % keyword.length;
                return result;
              }
              return char;
            })
            .join('');
        };

        result = vigenere(text, keyword, encode);
        break;
    }

    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(result, storage, varName, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
/* eslint-enable */
