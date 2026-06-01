module.exports = {
  name: 'Converter',
  section: 'Other Stuff',
  short_description: 'Convert an information to text, number or format',
  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods',
  },

  subtitle(data) {
    const info = [
      'Whole number (Rounded)',
      'Whole number (Up)',
      'Whole number (Down)',
      'Text',
      'Uppercase text',
      'Small text',
      'Text without spaces',
      'Text (Without spaces on both sides)',
      'Number with punctuation',
      'Short number',
      'R$ money format',
      'U$ money format',
      '€ money format',
      'Text without accents',
      'Text starting with capital letter',
      'Spaced text',
    ];
    const prse = parseInt(data.into, 10);
    return `Convert "${data.vAria}" to ${info[prse]}`;
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    const prse2 = parseInt(data.into, 10);
    const info2 = [
      'Number',
      'Number',
      'Number',
      'Text',
      'Text',
      'Text',
      'Text',
      'Text',
      'Number',
      'Number',
      'Money',
      'Money',
      'Money ',
      'Text',
      'Text',
      'Text',
    ];
    if (type !== varType) return;
    return [data.varName2, info2[prse2]];
  },

  fields: ['into', 'vAria', 'storage', 'varName2'],

  html(isEvent, data) {
    return `
    <div style="width: 550px; height: 350px;">
        <div style="width: 60%;">
            <div style="width: 150%;">
            <span class="dbminputlabel">Information</span><br>
                   <textarea id="vAria" rows="3" style="width:100%;"></textarea>
               </div>
            <br>
            <span class="dbminputlabel">Convert to</span><br>
            <select id="into" class="round">
					<option value="0" selected>Integer (Rounded)</option>
                    <option value="1">Integer (Up)</option>
                    <option value="2">Integer (Down)</option>
                    <option value="8">Number with scores (Ex: 1,000)</option>
                    <option value="9">Short number (Ex: 1k)</option>
                    <option value="10">R$ money format</option>
                    <option value="11">U$ money format</option>
                    <option value="12">Money format €</option>
                    <option value="3">Text</option>
                    <option value="4">Uppercase text</option>
                    <option value="5">Lower text</option>
                    <option value="6">Text without spaces</option>
                    <option value="7">Text (No spaces on both sides)</option>
                    <option value="13">Text without accents</option>
                    <option value="14">Text starting with capital letter</option>
                    <option value="15">Spaced text</option>
            </select>
        </div><br>
        <div>
            <div style="float: left; width: 35%;">
            <span class="dbminputlabel">Store in</span><br>
                <select id="storage" class="round">
                    ${data.variables[1]}
                </select>
            </div>
            <div id="varNameContainer2" style="float: right; width: 60%;">
                <div class="col-3 input-effect" style="width: 83%;">
                    <input id="varName2" class="efeitoala" type="text" style="width: 100%;">
                    <label><span class="dbminputlabel">Variable name</span></label>
                    <span class="focus-border"></span>
                </div><br>
            </div>
        </div>
    </div>
    <style>
        .codeblock {
            margin: 4px; background-color: rgba(0,0,0,0.20); border-radius: 3.5px; border: 1px solid rgba(255,255,255,0.15); padding: 4px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; transition: border 175ms ease;
        }
        .codeblock:hover{border:1px solid rgba(255,255,255,.45)}.text{color:#0ff}
        select.round{width:100%;border:0 solid #eee !important;border-radius:4px !important;box-sizing:border-box !important;display:block !important;height:28px !important;padding-left:8px !important;box-shadow:-2px 0 0 #fff;transition:box-shadow 150ms ease}
        select.round:focus{outline-width:0;box-shadow:0 1px 0 #0059ff;}
        .col-3 {border: 0px solid #eee;float: left; margin-top: 20px; margin-bottom: 6px; position: relative; background: rgba(0, 0, 0, 0.27); border-radius: 5px;}
        input[type="text"]{font: 15px/24px 'Muli', sans-serif; color: #eee; width: 100%; box-sizing: border-box; letter-spacing: 1px; padding: 0 0 0 3px;}
        input[type="text"]{font: 15px/24px "Lato", Arial, sans-serif; color: #eee; width: 100%; box-sizing: border-box; letter-spacing: 1px; padding: 0 0 0 3px;}
        
        .efeitoala{border: 0; padding: 4px; border-bottom: 1px solid #ccc; background-color: transparent;}
        .efeitoala ~ .focus-border{position: absolute; bottom: 0; left: 50%; width: 0; height: 2px; background-color: #4caf50; transition: 0.4s;}
        .efeitoala:focus ~ .focus-border,
        .has-content.efeitoala ~ .focus-border{width: 100%; transition: 0.4s; left: 0;}
        .efeitoala ~ label{position: absolute; left: 0%; width: 100%; top: -21px; color: #aaa; transition: 0.3s; z-index: -1; letter-spacing: 0.5px;}
        .efeitoala:focus ~ label, .has-content.efeitoala ~ label{font-size: 12px; color: #4caf50; transition: 0.3s;}
        
    </style>`;
  },

  init() {},

  action(cache) {
    const data = cache.actions[cache.index];
    const theVar = this.evalMessage(data.vAria, cache);
    const INTO = parseInt(data.into, 10);
    let result;

    switch (INTO) {
      case 0:
        result = Math.round(theVar.toString().replace(',', '.'));
        break;
      case 1:
        result = Math.ceil(theVar.toString().replace(',', '.'));
        break;
      case 2:
        result = parseInt(theVar, 10);
        break;
      case 3:
        result = theVar.toString();
        break;
      case 4:
        result = theVar.toString().toUpperCase();
        break;
      case 5:
        result = theVar.toString().toLowerCase();
        break;
      case 6:
        result = theVar.toString().split(' ').join('');
        break;
      case 7:
        result = theVar.toString().trim();
        break;
      case 8:
        if (isNaN(parseFloat(theVar))) {
          result = theVar;
        } else {
          result = parseFloat(theVar).toLocaleString('pt-BR');
        }
        break;
      case 9:
        var number = parseInt(this.evalMessage(theVar, cache), 10);

        if (number >= 1000 && number <= 999999) {
          number = `${number.toString().slice(0, -3)}k`;
        }

        if (number >= 1e6 && number <= 1e8) {
          number = `${number.toString().slice(0, -6)}m`;
        }

        if (number >= 1e9 && number <= 1e11) {
          number = `${number.toString().slice(0, -9)}b`;
        }

        if (number >= 1e12 && number <= 1e14) {
          number = `${number.toString().slice(0, -12)}t`;
        }
        if (number >= 1e15 && number <= 1e17) {
          number = `${number.toString().slice(0, -15)}q`;
        }
        if (number >= 1e18 && number <= 1e20) {
          number = `${number.toString().slice(0, -18)}sx`;
        }
        if (number >= 1e21 && number <= 1e23) {
          number = `${number.toString().slice(0, -4)}sp`;
        }
        if (number >= 1e24 && number <= 1e26) {
          number = `${number.toString().slice(0, -4)}o`;
        }
        if (number >= 1e27 && number <= 1e29) {
          number = `${number.toString().slice(0, -4)}n`;
        }
        if (number >= 1e30 && number <= 1e32) {
          number = `${number.toString().slice(0, -4)}d`;
        }
        if (number >= 1e33 && number <= 1e35) {
          number = `${number.toString().slice(0, -4)}u`;
        }
        if (number >= 1e36 && number <= 1e38) {
          number = `${number.toString().slice(0, -4)}du`;
        }
        if (number >= 1e39) {
          number = `${number.toString().slice(0, -4)}tr`;
        }
        result = number;
        break;
      case 10:
        const money = Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });
        result = money.format(theVar.toString().replace(',', '.'));
        break;
      case 11:
        const money2 = Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        });
        result = money2.format(theVar.toString().replace(',', '.'));
        break;
      case 12:
        const money3 = Intl.NumberFormat('de-DE', {
          style: 'currency',
          currency: 'EUR',
        });
        result = money3.format(theVar.toString().replace(',', '.'));
        break;
      case 13:
        const comAcentos =
          'ÄÅÁÂÀÃĀĂĄāăąäáâàãÉÊËÈĖĘĚĔĒėęěĕēéêëèÍÎÏÌİĮĪıįīíîïìÖÓÔÒÕŐŌőōöóôòõÜÚÛŲŰŮŪųűůūüúûùÇĆČçćčÑŇŅŃñňņńŸÝÿýŹŻŽźżžŁĽĻĹłľļĺĶķĢĞģğĎďŚŠŞśšşŤȚŢťțţŔŘŕř';
        const semAcentos =
          'AAAAAAAAAaaaaaaaaEEEEEEEEEeeeeeeeeeIIIIIIIiiiiiiiOOOOOOOoooooooUUUUUUUuuuuuuuuCCCcccNNNNnnnnYYyyZZZzzzLLLLllllKkGGggDdSSSsssTTTtttRRrr';

        result = theVar.toString();

        for (let i = 0; i <= comAcentos.length; i++) {
          result = result.replaceAll(comAcentos[i], semAcentos[i]);
        }
        break;
      case 14:
        const convertor = theVar[0].toUpperCase() + theVar.substring(1);
        result = convertor;
        break;
      case 15:
        result = theVar.toString().replaceAll('', ' ');
        break;
    }
    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName2 = this.evalMessage(data.varName2, cache);
      this.storeValue(result, storage, varName2, cache);
    }
    this.callNextAction(cache);
  },

  mod(DBM) {},
};
