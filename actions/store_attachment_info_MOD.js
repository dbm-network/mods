/**
 * The Store Attachment Info action code.
 * @class StoreAttachmentInfo
 */
class StoreAttachmentInfo {
  /**
   * Creates an instance of StoreAttachmentInfo.
   */
  constructor() {
    /**
     * The name of the action.
     * @type {string}
     */
    this.name = 'Store Attachment Info';

    /**
     * The section of the action.
     * @type
     */
    this.section = 'Messaging';

    /**
     * The authors of the action.
     * @type {string}
     */
    this.authors = ['EGGSY', 'Almeida'];

    /**
     * The version of the action.
     * @type {string}
     */
    this.version = '1.8.7';

    /**
     * The Developer Version Number.
     * @type {string}
     */
    this.DVN = '1.0.0';

    /**
     * The name of the action, displayed on the editor.
     * @type {string}
     */
    this.displayName = `Store Attachment Info v${this.DVN}`;

    /**
     * A short description to be shown on the list of mods.
     * @type {string}
     */
    this.shortDescription = 'Stores information from an attachment of a message.';

    /**
     * The fields used in the actions JSON data and HTML elements.
     * @type {Array<string>}
     */
    this.fields = ['storage', 'varName', 'info', 'storage2', 'varName2'];
  }

  /**
   * The function that is ran whenever the software/bot starts.
   * @param {Object<*>} DBM The DBM workspace.
   * @return {void}
   */
  mod() {}

  /**
   * Generates the subtitle displayed next to the name on the editor.
   * @param {Object<*>} data The data of the command.
   * @param {string} data.max The max messages that will be awaited.
   * @param {string} data.time The time that the bot will wait.
   * @return {string} The finalized subtitle.
   */
  subtitle({ info }) {
    const names = ['Attachment\'s URL', 'Attachment File\'s Name', 'ttachment\'s Height', 'Attachment\'s Width', 'Attachment Message\'s Content', 'Attachment File\'s Size', 'Attachment Message\'s ID'];
    return `${names[parseInt(info)]}`;
  }

  /**
   * Stores the relevant variable info for the editor.
   * @param {Object<*>} data The data for of the action.
   * @param {string} varType The variable type.
   * @return {Array<string>|void} An array containing the variable types.
   */
  variableStorage(data, varType) {
    const type = parseInt(data.storage2);
    if (type !== varType) return;

    const info = parseInt(data.info);
    const dataType = [
      'URL',
      'File Name',
      'Number',
      'Message Content',
      'File Size',
      'Message ID',
    ][info] || 'Message Attachment (Unknown) Info';

    return ([data.varName2, dataType]);
  }

  /**
   * Is ran when the HTML is loaded.
   * @return {void}
   */
  init() {
    const { document, glob } = this;

    glob.messageChange(document.getElementById('storage'), 'varNameContainer');
    glob.variableChange(document.getElementById('storage2'), 'varNameContainer2');
  }

  /**
   * What is ran when the action is called.
   * @param {Object<*>} cache The cache of the command/event.
   * @return {void}
   */
  action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage);
    const varName = this.evalMessage(data.varName, cache);
    const message = this.getMessage(storage, varName, cache);
    const info = parseInt(data.info);

    const attachments = message.attachments.array();

    if (attachments.length > 0) {
      const attachment = attachments[0];

      const result = [
        attachment.url,
        attachment.filename,
        attachment.height,
        attachment.width,
        attachment.message.content,
        Math.floor(attachment.filesize / 1000),
        attachment.message.id,
      ][info];

      if (result !== undefined) {
        const storage2 = parseInt(data.storage2);
        const varName2 = this.evalMessage(data.varName2, cache);
        this.storeValue(result, storage2, varName2, cache);
      }
    }

    this.callNextAction(cache);
  }

  /**
   * The HTML document for the action, visible on the editor.
   * @param {boolean} isEvent Whether the action is being used in an event or not.
   * @param {Object<*>} data The data for the action.
   * @return {string} The HTML document.
   */
  html(isEvent, data) {
    return `
      <div style="padding-bottom: 100px; padding: 5px 15px 5px 5px">
        <div class="container">
          <div class="ui teal segment" style="background: inherit;">
            <p>${this.shortDescription}</p>
            <p>Made by: <b>${this.authors.join(' ')}</b> Version: ${this.version} | DVN: ${this.DVN}</p>
          </div>
        </div>
      </div>
      <div style="float: left; width: 35%; padding-top: 8px;">
        Source Message:<br>
        <select id="storage" class="round" onchange="glob.messageChange(this, 'varNameContainer')">
          ${data.messages[isEvent ? 1 : 0]}
        </select>
      </div>
      <div id="varNameContainer" style="display: none; float: right; width: 60%; padding-top: 8px;">
        Variable Name:<br>
        <input id="varName" class="round" type="text" list="variableList"><br>
      </div><br><br>
      <div style="float: left; width: 80%; padding-top: 8px;">
        Source Info:<br>
        <select id="info" class="round">
          <option value="0">Attachment's URL</option>
          <option value="1">Attachment File's Name</option>
          <option value="2">Attachment's Height</option>
          <option value="3">Attachment's Width</option>
          <option value="4">Attachment Message's Content</option>
          <option value="5">Attachment File's Size (KB)</option>
          <option value="6">Attachment Message's ID</option>
        </select>
      </div><br><br>
      <div style="float: left; width: 35%; padding-top: 8px;">
        Store In:<br>
        <select id="storage2" class="round" onchange="glob.variableChange(this, 'varNameContainer2')>
          ${data.variables[0]}
        </select>
      </div>
      <div id="varNameContainer2" style="float: right; width: 60%; padding-top: 8px;">
        Variable Name:<br>
        <input id="varName2" class="round" type="text"><br>
      </div>
      <style>
        .codeblock {
          margin-right: 25px;
          background-color: rgba(0,0,0,0.20);
          border-radius: 3.5px;
          border: 1px solid rgba(255,255,255,0.15);
          padding: 4px 8px;
          font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
          transition: border 175ms ease;
        }
      </style>`;
  }
}

module.exports = new StoreAttachmentInfo();
