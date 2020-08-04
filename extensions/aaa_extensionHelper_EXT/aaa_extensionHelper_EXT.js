class Extension {
  constructor () {
    this.name = 'Extension Helper'
    this.version = '1.0.0'
    this.isCommandExtension = false
    this.isEventExtension = false
    this.isEditorExtension = false

    this.fields = ['']
    this.defaultFields = {}
  }

  size () {
    return { height: 550, width: 500 }
  }

  html () {
    return ''
  }

  init () {}

  close () {}

  mod (DBM) {
    const extensionHelper = {
      log: {
        error: (msg) => console.log('\x1b[31m' + msg, '\x1b[0m'),
        success: (msg) => console.log('\x1b[32m' + msg, '\x1b[0m'),
        warn: (msg) => console.log('\x1b[33m' + msg, '\x1b[0m')
      },
      async requireModule (packageName, projectName) {
        const { join } = require('path')
        const { existsSync, mkdirSync } = require('fs')
        const { execSync } = require('child_process')

        try {
          const nodeModulesPath = join(__dirname, 'aaa_extensionHelper_EXT', projectName, 'node_modules', packageName)
          return require(nodeModulesPath)
        } catch (e) {
          extensionHelper.log.warn('(aaa_extensionHelper_EXT Auto Module Installer) ~ Installing ' + packageName)

          if (!existsSync(join(__dirname, 'aaa_extensionHelper_EXT'))) {
            mkdirSync(join(__dirname, 'aaa_extensionHelper_EXT'))
          };

          if (!existsSync(join(__dirname, 'aaa_extensionHelper_EXT', projectName))) {
            mkdirSync(join(__dirname, 'aaa_extensionHelper_EXT', projectName))
          };

          if (!existsSync(join(__dirname, 'aaa_extensionHelper_EXT', projectName, 'node_modules'))) {
            mkdirSync(join(__dirname, 'aaa_extensionHelper_EXT', projectName, 'node_modules'))
          };

          const cliCommand = 'npm install ' + packageName + ' --save'
          await execSync(cliCommand, {
            cwd: join(__dirname, 'aaa_extensionHelper_EXT', projectName),
            stdio: [0, 1, 2]
          })

          const nodeModulesPath = join(__dirname, 'aaa_extensionHelper_EXT', projectName, 'node_modules', packageName)
          extensionHelper.log.success('(aaa_extensionHelper_EXT Auto Module Installer) ~ Successfully Installed ' + packageName + '. Note you may need to restart your bot.')
          return require(nodeModulesPath)
        }
      },
      async autoUpdater (data) {
        const fetch = await extensionHelper.requireModule('node-fetch', 'aaa_extensionHelper_EXT')
        const depInfo = await fetch(data.depInfo).then(res => res.json())
        const depFile = await fetch(data.depFile).then(res => res.text())
        if (data.version === depInfo.version) {
          extensionHelper.log.success(`${depInfo.name} is up to date!`)
          return false
        } else {
          extensionHelper.log.warn(`${depInfo.name} is out of date. (aaa_extensionHelper_EXT Auto Updater) ~ Updating ${depInfo.name}`)
          const filePath = require('path').join(__dirname, depInfo.file)
          require('fs').writeFileSync(filePath, depFile)
          extensionHelper.log.success(`Successfully updated ${depInfo.name}, please restart the bot.`)
          return true
        };
      }
    }

    extensionHelper.autoUpdater({
      depInfo: 'https://gist.githubusercontent.com/greatplainsmodding/cbcaf9da3a4ddb08bc06fad3f1f32aaf/raw/aaa_greatPlainsModdingDeps_EXT.json',
      depFile: 'https://gist.githubusercontent.com/greatplainsmodding/cbcaf9da3a4ddb08bc06fad3f1f32aaf/raw/aaa_greatPlainsModdingDeps_EXT.js',
      version: '1.0.4'
    })

    DBM.extensionHelper = extensionHelper
  };
}

module.exports = new Extension()
