module.exports = {
  name: 'Pastebin',
  isCommandExtension: true,
  isEventExtension: true,

  fields: [],
  defaultFields: {},

  size () {
    return { height: 425, width: 500 }
  },

  html () {
    return `
<div style="float: left; width: 99%; margin-left: auto; margin-right: auto; padding:10px;">
  <h2 style="text-align: center;">Pastebin</h2>
  Status: <p id="status">Idle</p><br>
  Type:
  <select id="type" class="round">
    <option value="none" selected>None</option>
    <option value="post">Upload (Post)</option>
    <option value="get">Download (Get)</option>
  </select><br>
  Key:
  <input id="key" class="round" type="text"><br>
  URL:
  <input id="url" class="round" type="text"><br>
  <p>
    Get your api key here: <a href="#" onclick="require('child_process').execSync('start https://pastebin.com/api#1')">Click Here</a>
  </p>
</div>
<p style="display: none" id="raw"></p>`
  },

  init (document) {
    const fs = require('fs')
    const filepath = require('path').join(this.DBM._currentProject, 'package.json')

    const { DBM } = this.DBM

    this.installedModules = Object.keys(JSON.parse(fs.readFileSync(filepath)).dependencies)
    if (this.installedModules.includes('pastebin-js') === false) {
      document.getElementById('status').innerHTML = 'Please close this window to install <b>pastebin-js</b>'
      document.getElementById('type').disabled = true
      document.getElementById('url').disabled = true
      return
    }

    const PastebinAPI = require('pastebin-js')
    const path = require('path').join(this.DBM._currentProject, 'data', 'pastebin.json')
    let options = {}
    if (!fs.existsSync(path)) {
      options.key = ''
      options.format = 'json'
      options.privacy = 1
      options.expiration = '6M'
      fs.writeFileSync(path, JSON.stringify(options))
    } else {
      try {
        options = JSON.parse(fs.readFileSync(path))
      } catch (err) {
        options.key = ''
        options.format = 'json'
        options.privacy = 1
        options.expiration = '6M'
        fs.writeFileSync(path, JSON.stringify(options))
      }
      options = JSON.parse(fs.readFileSync(path))
    }
    if (options.key) {
      document.getElementById('key').value = options.key
    }

    document.getElementById('key').onchange = function () {
      options.key = document.getElementById('key').value
      fs.writeFileSync(path, JSON.stringify(options))
    }

    document.getElementById('type').onchange = function () {
      const type = document.getElementById('type').value
      document.getElementById('type').disabled = true
      switch (type) {
        case 'post':
          if (options.key) {
            document.getElementById('status').innerHTML = 'Uploading...'
            post.call(this, options)
          } else {
            document.getElementById('status').innerHTML = 'Key not found.'
            document.getElementById('type').value = 'none'
            document.getElementById('type').disabled = false
          }
          break
        case 'get':
          document.getElementById('status').innerHTML = 'Downloading...'
          get()
          break
      }
    }

    async function get () {
      const id = getId()
      if (id) {
        try {
          const pastebin = new PastebinAPI()
          const paste = await pastebin.getPaste(id)
          JSON.parse(paste)
          document.getElementById('raw').innerHTML = paste
          document.getElementById('status').innerHTML = 'Downloaded'
        } catch (err) {
          document.getElementById('status').innerHTML = err
        }
      } else {
        document.getElementById('status').innerHTML = 'Invalid Hostname, make sure it is a pastebin'
      }
      document.getElementById('type').value = 'none'
      document.getElementById('type').disabled = false
    }

    function getId () {
      const url = document.getElementById('url').value
      if (url === '') {
        document.getElementById('status').innerHTML = 'URL not found.'
        return
      }
      let id
      try {
        const test = new URL(url)
        if (test.host === 'pastebin.com') {
          if (test.pathname.startsWith('/raw/')) {
            id = test.pathname.slice(5)
          } else {
            id = test.pathname.slice(1)
          }
        } else {
          id = false
        }
        return id
      } catch (err) {
        return url
      }
    }

    async function post (options) {
      try {
        let current
        if (DBM.currentSection === 'Commands') {
          current = DBM.$cmds[DBM.currentId]
        } else {
          current = DBM.$evts[DBM.ecurrentId]
        }
        const pastebin = new PastebinAPI(options.key)
        const url = await pastebin.createPaste({ text: JSON.stringify(current), title: `${current.name}_${current._id}`, format: 'json', privacy: 1, expiration: '1M' })
        document.getElementById('url').value = url
        document.getElementById('status').innerHTML = 'Post!'
        document.getElementById('url').value = url
      } catch (err) {
        document.getElementById('status').innerHTML = 'Error!\n' + err
      }
      document.getElementById('type').value = 'none'
      document.getElementById('type').disabled = false
    }
  },

  close (document) {
    if (this.installedModules.includes('pastebin-js') === false) {
      this.DBM.installSpecificModules(['pastebin-js'])
      return
    }
    if (!document.getElementById('raw').innerHTML) {
      return
    }
    const json = JSON.parse(document.getElementById('raw').innerHTML)
    const keyLength = Object.keys(json.customData).length
    if (keyLength === 1) {
      delete json.customData
    } else if (keyLength !== 0 && json.customData.Pastebin) {
      delete json.customData.Pastebin
    }
    if (this.DBM.currentSection === 'Commands') {
      this.DBM.$cmds[this.DBM.currentId] = json
    } else {
      this.DBM.$evts[this.DBM.ecurrentId] = json
    }
    this.DBM.reloadData()
  },

  mod () {}
}
