/* eslint-disable no-empty */
module.exports = {
  name: 'Currency Converter 2.0',
  section: 'Other Stuff',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'pKunnn',
    authorUrl: 'https://github.com/pKunnn',
    downloadURL: 'https://github.com/pKunnn/dbm-mods/blob/master/actions/currency_converter_MOD.js',
  },

  subtitle(data) {
    return `Convert to [${data.convertTo}]`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'String'];
  },

  fields: ['quantity', 'fstCurrency', 'convertTo', 'storage', 'varName'],

  html(_isEvent, data) {
    return `
	<div>
	  <p>
	    <u>Mod Info:</u>
	    <br> Created by pKunnn
	  </p>
	</div>
	<br>
	<div style="width: 100%;"> Quantity: <br>
	  <input id="quantity" placeholder="Put here the quantity you want to convert" class="round" type="text">
	  <br>
	</div>
	<br>
	<div style="width: 90%;"> First Currency: <br>
	  <input id="fstCurrency" placeholder="Should be 3 letters." class="round" type="text" maxlength="3">
	  <br>
	</div>
	<br>
	<div style="width: 90%;"> Convert to: <br>
	  <input id="convertTo" placeholder="Should be 3 letters." class="round" type="text" maxlength="3">
	  <br>
	</div>
	<br>
	<div style="padding-top: 8px;">
	  <div style="float: left; width: 35%;"> Store In: <br>
	    <select id="storage" class="round"> ${data.variables[1]} </select>
	  </div>
	  <div id="varNameContainer" style="float: right; width: 60%;"> Variable Name: <br>
	    <input id="varName" class="round" type="text">
	  </div>
	</div>
	`;
  },

  init() {
    const { glob, document } = this;
    glob.variableChange(document.getElementById('storage'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const fstCurrency = this.evalMessage(data.fstCurrency, cache);
    const convertTo = this.evalMessage(data.convertTo, cache);
    const quantity = this.evalMessage(data.quantity, cache);
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);

    const Mods = this.getMods();
    const CC = Mods.require('currency-converter-lt');

    if (!fstCurrency || fstCurrency.length > 3)
      return console.log('[First Currency] Currency name must be only 3 letters');
    if (!convertTo || convertTo.length > 3) return console.log('[Convert To] Currency name must be only 3 letters');
    if (!quantity) return console.log('[Quantity] You need to write numbers to convert.');

    const currencyConverter = new CC({
      from: fstCurrency,
      to: convertTo,
      amount: parseFloat(quantity),
    });
    currencyConverter.convert().then((response) => {
      if (response) this.storeValue(response, storage, varName, cache);
      this.callNextAction(cache);
    });
  },

  mod() {},
};
