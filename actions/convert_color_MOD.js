module.exports = {
  name: 'Convert Color',
  section: 'Conversions',
  meta: {
    version: '2.2.0',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/convert_color_MOD.js',
  },

  subtitle(data) {
    let from = data.InputColor.toUpperCase();
    if (from === 'AUTO') from = 'Auto Detect';
    if (from === 'CSS') from = 'Keyword';
    if (from === 'DECIMAL') from = 'Decimal';

    let to = data.OutputColor.toUpperCase();
    if (to === 'CSS') to = 'Keyword';
    if (to === 'DECIMAL') to = 'Decimal';
    return `Convert Color from ${from} to ${to}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.Storage, 10) !== varType) return;
    return [data.VarName, 'Color'];
  },

  fields: ['InputColor', 'InputText', 'OutputColor', 'Storage', 'VarName'],

  html() {
    return `
<div style="float: left; width: 100%;">
  <div style="float: left; width: calc(50% - 12px);">
	  <span class="dbminputlabel">Convert From</span>
	  <select id="InputColor" class="round">
      <option value="auto" selected>Auto Detect</option>
		  <option value="css">Keyword</option>
		  <option value="hex">HEX</option>
		  <option value="rgb">RGB</option>
      <option value="hsl">HSL</option>
      <option value="cmyk">CMYK</option>
      <option value="decimal">Decimal</option>
	  </select>
  </div>
  <div id="inputDiv" style="float: right; width: calc(50% - 12px);">
    <span class="dbminputlabel">Color</span>
    <input id="InputText" class="round" type="text">
  </div>
</div>
<br><br>

<div style="float: left; width: 100%; padding-top: 12px;">
  <span class="dbminputlabel">Convert To</span>
  <select id="OutputColor" class="round">
    <option value="css" selected>Keyword</option>
    <option value="hex">HEX</option>
    <option value="rgb">RGB</option>
    <option value="hsl">HSL</option>
    <option value="cmyk">CMYK</option>
    <option value="decimal">Decimal</option>
  </select>
</div>
<br><br><br>

<div style="float: left; padding-top: 12px; width: 100%;">
  <store-in-variable dropdownLabel="Store In" selectId="Storage" variableContainerId="VarNameContainer" variableInputId="VarName"></store-in-variable>
</div>
<br><br><br><br>

<div style="padding-top: 8px;">
  <p>
    Input Strings:<br>
    Keyword: Name of the color<br>
    HEX: (0x || #) [a-fA-F0-9] (x3 || x6)<br>
    RGB: rgb(100, 100, 100)<br>
    HSL: hsl(50, 50%, 50%) || hsl(50, 50, 50)<br>
    CMYK: cmyk(100%, 100%, 0%, 0%) || cmyk(100, 100, 0, 0)<br>
  </p>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const InputText = this.evalMessage(data.InputText, cache);
    let OutputText;

    // Module requirements
    const Mods = this.getMods();
    const ColorConvert = Mods.require('color-convert');

    if (data.InputColor === data.OutputColor) {
      const storage = parseInt(data.Storage, 10);
      const VarName = this.evalMessage(data.VarName, cache);
      this.storeValue(InputText, storage, VarName, cache);
      return this.callNextAction(cache);
    }

    // Regex to check if it's valid
    const rgbRegex = /^rgb[\s+]?\((:?\d+\.?\d?%?)(,|-|\/\|)\s?(:?\d+\.?\d?%?)(,|-|\/\|)\s?(:?\d+\.?\d?%?)\)/i;
    const cmykRegex = /^cmyk\((\d{1,3})%?\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\)$/i;
    const hslRegex = /^hsl\((\d{1,3}),?(\s)?(\d{1,3})%?,?(\s)?(\d{1,3})%?\)$/i;
    const hexRegex = /^(#|0x)([a-f0-9]{3}){1,2}$/i;
    const decimalRegex = /\b(?:\d{1,3}(?:,\s?)?){3}\b/;
    const cssRegex = /^[a-zA-Z]+$/;

    // Convert from HEX to the respective output (It is much easier to just convert everything to hex and convert back)
    const Convert = function Convert(input) {
      let Output;

      try {
        switch (data.OutputColor) {
          case 'css': {
            // Get the nearest color from an extra list of colors
            const ColorNameList = Mods.require('color-name-list');
            const extraColors = ColorNameList.reduce(
              (o, { name, hex }) => Object.assign(o, { [name.toLowerCase()]: hex }),
              {},
            );
            const nearestColor = Mods.require('nearest-color').from(extraColors);

            // Check if the keyword for css is included inside the extraColors list
            if (extraColors[input.toString().toLowerCase()]) input = extraColors[input.toString().toLowerCase()];

            Output = nearestColor(input).name;
            break;
          }
          case 'hex': {
            if (input.length === 3) {
              input = input.slice();
              const pos1 = input[0];
              const pos2 = input[1];
              const pos3 = input[2];
              input = pos1 + pos1 + pos2 + pos2 + pos3 + pos3;
            }
            Output = input.toUpperCase();
            break;
          }
          case 'rgb': {
            Output = ColorConvert.hex.rgb(input);
            break;
          }
          case 'hsl': {
            Output = ColorConvert.hex.hsl(input);
            break;
          }
          case 'cmyk': {
            Output = ColorConvert.hex.cmyk(input);
            break;
          }
          case 'decimal': {
            const Converter = Mods.require('hex2dec');
            Output = Converter.hexToDec(input);
            break;
          }
        }
      } catch (error) {
        console.error(error);
      }

      return Output;
    };

    try {
      switch (data.InputColor) {
        case 'css': {
          if (!cssRegex.test(InputText)) break;
          OutputText = Convert(ColorConvert.keyword.hex(InputText));
          break;
        }
        case 'hex': {
          if (!hexRegex.test(InputText)) break;
          let input = InputText.toUpperCase();
          if (input.charAt() === '#') {
            input = input.substr(1);
          } else if (input.charAt() === '0' && input.charAt(1) === 'X') {
            input = input.substr(2);
          }

          OutputText = Convert(input);
          break;
        }
        case 'rgb': {
          if (!rgbRegex.test(InputText)) break;
          const input = InputText.trim()
            .replace(/rgb|\(|\)/gi, '')
            .replace(/\s/g, '')
            .split(',');
          OutputText = Convert(ColorConvert.rgb.hex(input));
          break;
        }
        case 'hsl': {
          if (!hslRegex.test(InputText)) break;
          const input = InputText.trim()
            .replace(/hsl|\(|\)|%/gi, '')
            .replace(/\s/g, '')
            .split(',')
            .map((string) => Number(string));
          OutputText = Convert(ColorConvert.hsl.hex(input));
          break;
        }
        case 'cmyk': {
          if (!cmykRegex.test(InputText)) break;
          const input = InputText.trim()
            .replace(/cmyk|\(|\)|%/gi, '')
            .replace(/\s/g, '')
            .split(',')
            .map((string) => Number(string));
          OutputText = Convert(ColorConvert.cmyk.hex(input));
          break;
        }
        case 'decimal': {
          if (!decimalRegex.test(InputText)) break;
          const Converter = Mods.require('hex2dec');
          const input = Converter.decToHex(InputText, { prefix: false });
          OutputText = Convert(input);
          break;
        }
        case 'auto': {
          if (cmykRegex.test(InputText)) {
            const input = InputText.trim()
              .replace(/cmyk|\(|\)|%/gi, '')
              .replace(/\s/g, '')
              .split(',')
              .map((string) => Number(string));
            OutputText = Convert(ColorConvert.cmyk.hex(input));
            break;
          } else if (hslRegex.test(InputText)) {
            const input = InputText.trim()
              .replace(/hsl|\(|\)|%/gi, '')
              .replace(/\s/g, '')
              .split(',')
              .map((string) => Number(string));
            OutputText = Convert(ColorConvert.hsl.hex(input));
            break;
          } else if (rgbRegex.test(InputText)) {
            const input = InputText.trim()
              .replace(/rgb|\(|\)/gi, '')
              .replace(/\s/g, '')
              .split(',');
            OutputText = Convert(ColorConvert.rgb.hex(input));
            break;
          } else if (hexRegex.test(InputText)) {
            let input = InputText.toUpperCase();
            if (input.charAt() === '#') {
              input = input.substr(1);
            } else if (/^0x/i.test(input)) {
              input = input.substr(2);
            }
            OutputText = Convert(input);
            break;
          } else if (cssRegex.test(InputText)) {
            OutputText = Convert(ColorConvert.keyword.hex(InputText.toLowerCase()));
            break;
          } else if (decimalRegex.test(InputText)) {
            const Converter = Mods.require('hex2dec');
            const input = Converter.decToHex(InputText, { prefix: false });
            OutputText = Convert(input);
            break;
          }
          break;
        }
      }
    } catch (error) {
      console.error(error);
    }

    if (OutputText !== undefined) {
      const storage = parseInt(data.Storage, 10);
      const varName = this.evalMessage(data.VarName, cache);
      this.storeValue(OutputText, storage, varName, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
