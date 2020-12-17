module.exports = {

  /*
        - Author: Great Plains Modding
        - Version: 1.1.1
        - GitHub: https://github.com/greatplainsmodding
        - Description: Contains multiple stuff needed for my mods / extensions / events.
    */

  authors: ['Great Plains Modding'],
  version: '1.1.1',
  changeLog: '',
  shortDescription: 'Discord Bot Maker Dashboard.',
  longDescription: '',
  requiredNodeModules: [],

  // ---------------------------------------------------------------------
  // Editor Extension Name
  //
  // This is the name of the editor extension displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Bot Dashboard',

  // ---------------------------------------------------------------------
  // Is Command Extension
  //
  // Must be true to appear in "command" context menu.
  // This means each "command" will hold its own copy of this data.
  // ---------------------------------------------------------------------

  isCommandExtension: false,

  // ---------------------------------------------------------------------
  // Is Event Extension
  //
  // Must be true to appear in "event" context menu.
  // This means each "event" will hold its own copy of this data.
  // ---------------------------------------------------------------------

  isEventExtension: false,

  // ---------------------------------------------------------------------
  // Is Editor Extension
  //
  // Must be true to appear in the main editor context menu.
  // This means there will only be one copy of this data per project.
  // ---------------------------------------------------------------------

  isEditorExtension: true,

  // ---------------------------------------------------------------------
  // Extension Fields
  //
  // These are the fields for the extension. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the command's/event's JSON data.
  // ---------------------------------------------------------------------

  fields: ['port', 'clientSecret', 'callbackURL', 'owner', 'supportServer'],

  // ---------------------------------------------------------------------
  // Default Fields
  //
  // The default values of the fields.
  // ---------------------------------------------------------------------

  defaultFields: {
    port: require(require('path').join(__dirname, 'dashboard_EXT', 'config.json')).port,
    clientSecret: require(require('path').join(__dirname, 'dashboard_EXT', 'config.json')).clientSecret,
    callbackURL: require(require('path').join(__dirname, 'dashboard_EXT', 'config.json')).callbackURL,
    owner: require(require('path').join(__dirname, 'dashboard_EXT', 'config.json')).owner,
    supportServer: require(require('path').join(__dirname, 'dashboard_EXT', 'config.json')).supportServer
  },

  // ---------------------------------------------------------------------
  // Extension Dialog Size
  //
  // Returns the size of the extension dialog.
  // ---------------------------------------------------------------------

  size () {
    return {
      width: 700,
      height: 620
    }
  },

  // ---------------------------------------------------------------------
  // Extension HTML
  //
  // This function returns a string containing the HTML used for
  // the context menu dialog.
  // ---------------------------------------------------------------------

  html (data) {
    try {
      return `
            <div class="ui cards" style="margin: 0; padding: 0; width: 100%;">
                <div class="card" style="margin: 0; padding: 0; width: 100%; background-color: #36393e; color: #e3e5e8;">
                    <div class="content" style="padding-top:15px;">
                        <img class="right floated ui image" src="https://avatars1.githubusercontent.com/u/46289624" style="height: 100px;">
                        <div class="header" style="background-color: #36393e; color: #e3e5e8; font-size: 28px;">
                            <u>Discord Bot Dashboard</u>
                    </div>
                    <div class="meta" style="background-color: #36393e; color: #e3e5e8; font-size: 14px; width: 100%;">
                        <li>Created By: <a onclick="require('child_process').execSync('start https://github.com/greatplainsmodding')"> Great Plains Modding</a></li>
                        <li>DBM Network: <a onclick="require('child_process').execSync('start https://discord.gg/3QxkZPK')"> Join Server</a></li>
                        <li>Extension Version: 1.0.9</li>
                    </div>
                    <div class="description" style="background-color: #36393e; color: #e3e5e8">
                        <hr>
                        <div class="field" style="width: 100%">
                            <div class="field" style="width: 100%">
                                Port:<br>
                                <input type="text" value="${data.port}" class="round" style="padding-bottom: 3px;" id="port"><br>
                                clientSecret:<br>
                                <input type="text" value="${data.clientSecret}" class="round" id="clientSecret"><br>
                                callbackURL:<br>
                                <input type="text" value="${data.callbackURL}" class="round" id="callbackURL"><br>
                                Owner ID:<br>
                                <input type="text" value="${data.owner}" class="round" id="owner"><br>
                                supportServer:<br>
                                <input type="text" value="${data.supportServer}" class="round" id="supportServer"><br>
                            </div>
                        </div><br>
                    </div>
                </div>
            </div>
            `
    } catch (error) {
      return error
    }
  },

  // ---------------------------------------------------------------------
  // Extension Dialog Init Code
  //
  // When the HTML is first applied to the extension dialog, this code
  // is also run. This helps add modifications or setup reactionary
  // functions for the DOM elements.
  // ---------------------------------------------------------------------

  init (DBM) {

  },

  // ---------------------------------------------------------------------
  // Extension Dialog Close Code
  //
  // When the dialog is closed, this is called. Use it to save the data.
  // ---------------------------------------------------------------------

  close (document, data) {
    data.port = String(document.getElementById('port').value)
    data.clientSecret = String(document.getElementById('clientSecret').value)
    data.callbackURL = String(document.getElementById('callbackURL').value)
    data.owner = String(document.getElementById('owner').value)
    data.supportServer = String(document.getElementById('supportServer').value)

    try {
      const config = require('./dashboard_EXT/config.json')
      const dashboardConfigPath = require('path').join(__dirname, '../extensions', 'dashboard_EXT', 'config.json')
      const configNew = {
        port: data.port,
        isBotSharded: false,
        tokenSecret: Math.random().toString(36).substr(2),
        clientSecret: data.clientSecret,
        callbackURL: data.callbackURL,
        owner: data.owner.split(/ +/g),
        inviteLink: '/dashboard/@me',
        supportServer: data.supportServer,
        introText: config.introText,
        footerText: config.footerText,
        theme: 'default',
        isGlitch: config.isGlitch
      }

      configNew.featureOne = config.featureOne
      configNew.featureTwo = config.featureTwo
      configNew.featureThree = config.featureThree
      configNew.featureFour = config.featureFour
      configNew.navItems = config.navItems

      const settings = JSON.stringify(configNew)
      require('fs').writeFileSync(dashboardConfigPath, settings, 'utf8')
    } catch (error) {
      require('fs').writeFileSync('dashboard-errors.txt', error, 'utf8')
    };
  },

  // ---------------------------------------------------------------------
  // Extension On Load
  //
  // If an extension has a function for "load", it will be called
  // whenever the editor loads data.
  //
  // The "DBM" parameter is the global variable. Store loaded data within it.
  // ---------------------------------------------------------------------

  load (DBM, projectLoc) {},

  // ---------------------------------------------------------------------
  // Extension On Save
  //
  // If an extension has a function for "save", it will be called
  // whenever the editor saves data.
  //
  // The "data" parameter contains all data. Use this to modify
  // the data that is saved. The properties correspond to the
  // data file names:
  //
  //  - data.commands
  //  - data.settings
  // etc...
  // ---------------------------------------------------------------------

  save (DBM, data, projectLoc) {

  },

  // ---------------------------------------------------------------------
  // Editor Extension Bot Mod
  //
  // Upon initialization of the bot, this code is run. Using the bot's
  // DBM namespace, one can add/modify existing functions if necessary.
  // In order to reduce conflictions between mods, be sure to alias
  // functions you wish to overwrite.
  //
  // This is absolutely necessary for editor extensions since it
  // allows us to setup modifications for the necessary functions
  // we want to change.
  //
  // The client object can be retrieved from: `const bot = DBM.Bot.bot;`
  // Classes can be retrieved also using it: `const { Actions, Event } = DBM;`
  // ---------------------------------------------------------------------

  async mod (DBM) {
    /******************************************************
         * DBM Dashboard
         * Version 1.0.5
         * Great PLains Modding
         ******************************************************/

    const Dashboard = {}
    Dashboard.version = '1.1.5'

    // ----------------------------------------------------------------------------------
    // Check for great plains modding dependencies //
    const fetch = DBM.extensionHelper.requireModule('node-fetch', 'dashboard_EXT')
    const filePath = require('path').join(__dirname, 'aaa_extensionHelper_EXT.js')
    if (!require('fs').existsSync(filePath)) {
      // if Great Plains Modding Deps is missing then install it //
      console.log(DBM.extensionHelper.requireModule('chalk', 'dashboard_EXT').red('aaa_extensionHelper_EXT.js is missing ~ Auto installing it.'))
      const url = await 'https://raw.githubusercontent.com/dbm-network/extensions/master/extensions/aaa_extensionHelper_EXT/aaa_extensionHelper_EXT.js'
      await fetch(url).then(res => res.text()).then(depFile => require('fs').writeFileSync(filePath, depFile))
      DBM.extensionHelper = require(filePath)
      DBM.extensionHelper.mod(DBM)
      console.log(DBM.extensionHelper.requireModule('chalk').green('Successfully installed aaa_extensionHelper_EXT.js, note you may need to restart your bot.'))
      setTimeout(function () {}, 1000)
    };

    // check for and updates
    DBM.extensionHelper.autoUpdater({
      depInfo: 'https://gist.githubusercontent.com/greatplainsmodding/977cdd45030fc0af1017b493b738cde1/raw/dashboard_EXT.json',
      depFile: 'https://gist.githubusercontent.com/greatplainsmodding/977cdd45030fc0af1017b493b738cde1/raw/dashboard_EXT.js',
      version: Dashboard.version
    })
    // ----------------------------------------------------------------------------------

    Dashboard.checkActions = async function () {
      try {
        const fetch = require('node-fetch')
        DBM.extensionHelper.log.warn('(DBM Dashboard ~ Auto Installer) Checking for new and updated actions.')
        const modsFetched = await fetch('https://api.github.com/repos/greatplainsmodding/DBM-Dashboard-Mods/git/trees/master').then(res => res.json().then(data => data.tree))
        if (!modsFetched) return
        for (const mod of modsFetched) {
          const filePath = require('path').join(__dirname, 'dashboard_EXT', 'actions', 'mods', mod.path)
          if (!require('fs').existsSync(filePath)) {
            console.log(chalk.yellow('(DBM Dashboard) ~ Auto Mod Install: ' + mod.path))
            const fetchedMod = await fetch(mod.url).then(res => res.json().then(data => data.tree))
            require('fs').mkdirSync(require('path').join(__dirname, 'dashboard_EXT', 'actions', 'mods', mod.path))
            for (const file of fetchedMod) {
              const filePath = require('path').join(__dirname, 'dashboard_EXT', 'actions', 'mods', mod.path, file.path)
              if (!require('fs').existsSync(filePath)) {
                const modFile = await fetch('https://raw.githubusercontent.com/greatplainsmodding/DBM-Dashboard-Mods/master/' + mod.path + '/' + file.path).then(res => res.text())
                require('fs').writeFileSync(filePath, modFile)
                console.log(chalk.green('Successfully downloaded ' + file.path))
              }
            }
          }
        }
      } catch (error) {
        console.log(chalk.red(error))
      }
    }

    // ----------------------------------------------------------------------------------
    // require needed modules //
    const express = await DBM.extensionHelper.requireModule('express', 'dashboard_EXT')
    const bodyParser = await DBM.extensionHelper.requireModule('body-parser', 'dashboard_EXT')
    const cookieParser = await DBM.extensionHelper.requireModule('cookie-parser', 'dashboard_EXT')
    await DBM.extensionHelper.requireModule('ejs', 'dashboard_EXT')
    const Strategy = await DBM.extensionHelper.requireModule('passport-discord', 'dashboard_EXT')
    const session = await DBM.extensionHelper.requireModule('express-session', 'dashboard_EXT')
    await DBM.extensionHelper.requireModule('path', 'dashboard_EXT')
    const passport = await DBM.extensionHelper.requireModule('passport', 'dashboard_EXT')
    const chalk = await DBM.extensionHelper.requireModule('chalk', 'dashboard_EXT')
    const figlet = await DBM.extensionHelper.requireModule('figlet', 'dashboard_EXT')
    await require('url')

    Dashboard.app = express()
    // ----------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------
    Dashboard.Actions = {}
    Dashboard.settings = require(require('path').join(__dirname, 'dashboard_EXT', 'config.json'))
    Dashboard.Actions.modsLocation = require('path').join(__dirname, 'dashboard_EXT', 'actions', 'mods')
    Dashboard.Actions.routeLocation = require('path').join(__dirname, 'dashboard_EXT', 'actions', 'routes')
    Dashboard.Actions.extensionLocation = require('path').join(__dirname, 'dashboard_EXT', 'actions', 'extensions')

    Dashboard.Actions.mods = new Map()
    Dashboard.Actions.extensions = new Map()
    // ----------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------

    Dashboard.storeData = function (fileName, dataName, data) {
      if (!fileName) return console.log('storeData("fileName", "dataName", "data")')
      if (!dataName) return console.log('storeData("fileName", "dataName", "data")')

      try {
        if (!require('fs').existsSync(require('path').join(__dirname, 'dashboard_EXT'))) {
          require('fs').mkdirSync(require('path').join(__dirname, 'dashboard_EXT'))
        };
        const path = require('path').join(__dirname, 'dashboard_EXT', `${fileName}.json`)
        if (!require('fs').existsSync(path)) {
          let data = {}
          data = JSON.stringify(data)
          require('fs').writeFileSync(path, data)
        };

        let jsonFile = require(require('path').join(__dirname, 'dashboard_EXT', `${fileName}.json`))
        jsonFile[dataName] = data
        jsonFile = JSON.stringify(jsonFile)
        require('fs').writeFileSync(path, jsonFile, 'utf8')
        return jsonFile
      } catch (error) {
        console.log(error)
      };
    }

    Dashboard.retrieveData = function (fileName, dataName) {
      try {
        if (!require('fs').existsSync(require('path').join(__dirname, 'dashboard_EXT'))) {
          require('fs').mkdirSync(require('path').join(__dirname, 'dashboard_EXT'))
        };
        const path = require('path').join(__dirname, 'dashboard_EXT', `${fileName}.json`)
        if (!require('fs').existsSync(path)) {
          let data = {}
          data = JSON.stringify(data)
          require('fs').writeFileSync(path, data)
        };
        const jsonFile = require(require('path').join(__dirname, 'dashboard_EXT', `${fileName}.json`))
        return jsonFile[dataName]
      } catch (error) {
        console.error(error)
      };
    }

    Dashboard.retrieveFile = function (fileName) {
      try {
        if (!require('fs').existsSync(require('path').join(__dirname, 'dashboard_EXT'))) {
          require('fs').mkdirSync(require('path').join(__dirname, 'dashboard_EXT'))
        };
        const path = require('path').join(__dirname, 'dashboard_EXT', `${fileName}.json`)
        if (!require('fs').existsSync(path)) {
          let data = {}
          data = JSON.stringify(data)
          require('fs').writeFileSync(path, data)
          return {}
        };
        const jsonFile = require(require('path').join(__dirname, 'dashboard_EXT', `${fileName}.json`))
        return jsonFile
      } catch (error) {
        console.error(error)
      };
    }

    Dashboard.loadMods = function () {
      require('fs').readdirSync(Dashboard.Actions.modsLocation).forEach(dir => {
        const modData = require(require('path').join(Dashboard.Actions.modsLocation, dir, '__resource.json'))
        Dashboard.Actions.mods.set(dir, modData)

        if (modData.cssFiles) {
          modData.cssFiles.forEach(cssFile => {
            Dashboard.app.get(`/${modData.name}/css/${cssFile}`, function (req, res) {
              res.sendFile(require('path').join(__dirname, 'dashboard_EXT', 'actions', 'mods', dir, cssFile))
            })
          })
        };
      })
    }

    Dashboard.loadRoutes = function () {
      require('fs').readdirSync(Dashboard.Actions.routeLocation).forEach(dir => {
        const routeData = require(require('path').join(Dashboard.Actions.routeLocation, dir, '__resource.json'))
        if (routeData.isCustom) {
          // routeData.scriptFiles.forEach(file => {
          //   const fileData = require(require('path').join(Dashboard.Actions.routeLocation, dir, file))
          // })
        } else {
          routeData.scriptFiles.forEach(file => {
            const fileData = require(require('path').join(Dashboard.Actions.routeLocation, dir, file))
            fileData.init(DBM, Dashboard)
            const webFile = require('path').join(__dirname, 'dashboard_EXT', 'actions', 'routes', dir, routeData.webFile)
            if (routeData.cssFiles) {
              routeData.cssFiles.forEach(cssFile => {
                Dashboard.app.get(`/${routeData.name}/css/${cssFile}`, function (req, res) {
                  res.sendFile(require('path').join(__dirname, 'dashboard_EXT', 'actions', 'routes', dir, cssFile))
                })
              })
            };
            if (routeData.loginRequired) {
              Dashboard.app.get(routeData.routeURL, Dashboard.checkAuth, function (req, res) {
                const renderData = fileData.run(DBM, req, res, Dashboard)
                if (renderData.skipRender) return
                res.render(webFile, {
                  data: renderData
                })
              })
            } else {
              Dashboard.app.get(routeData.routeURL, function (req, res) {
                const renderData = fileData.run(DBM, req, res, Dashboard)
                res.render(webFile, {
                  data: renderData
                })
              })
            };
          })
        };
      })
    }

    Dashboard.loadExtensions = function () {
      require('fs').readdirSync(Dashboard.Actions.extensionLocation).forEach(dir => {
        const extensionData = require(require('path').join(Dashboard.Actions.extensionLocation, dir, '__resource.json'))
        Dashboard.Actions.extensions.set(dir, extensionData)

        if (extensionData.cssFiles) {
          extensionData.cssFiles.forEach(cssFile => {
            Dashboard.app.get(`/${extensionData.name}/css/${cssFile}`, function (req, res) {
              res.sendFile(require('path').join(__dirname, 'dashboard_EXT', 'actions', 'mods', dir, cssFile))
            })
          })
        };

        extensionData.scriptFiles.forEach(file => {
          const extensionFile = require(require('path').join(Dashboard.Actions.extensionLocation, dir, file))
          extensionFile.init(DBM, Dashboard)
        })
      })
    }

    Dashboard.checkAuth = function (req, res, next) {
      if (req.isAuthenticated()) {
        return next()
      };
      res.redirect('/login')
    }

    Dashboard.randomString = function () {
      let string = ''
      const randomChar = 'abcdefghijklmnopqrstuvwxyz0123456789'
      for (var i = 0; i < 50; i++) {
        string += randomChar.charAt(Math.floor(Math.random() * randomChar.length))
      };
      return string
    }

    Dashboard.verifyConfig = function () {
      const errors = []
      let settings = Dashboard.settings

      if (settings.runSetup) {
        Dashboard.app.get('/', (req, res) => {
          res.render('setup', {
            config: Dashboard.settings
          })
        })

        Dashboard.app.use(bodyParser.urlencoded({
          extended: true
        }))

        Dashboard.app.post('/setup', (req, res) => {
          console.log(req.body)
        })
        console.log(require('chalk').red('Please navigate to http://localhost:3000 to complete the setup.'))
        return errors
      } else {
        if (!settings.port) errors.push('Invalid port, please check your config.')
        if (!settings.tokenSecret) {
          const filePath = require('path').join(__dirname, 'dashboard_EXT', 'config.json')
          settings.tokenSecret = Dashboard.randomString()
          settings = JSON.stringify(settings)
          require('fs').writeFileSync(filePath, settings, 'utf8')
        }
        if (!settings.clientSecret) errors.push('Invalid client secret, please check your config.')
        if (!settings.callbackURL) errors.push('Invalid callback url, please check your config.')
        return errors
      };
    }

    Dashboard.appSettings = function () {
      Dashboard.app.set('view engine', 'ejs')
      Dashboard.app.use(express.static(require('path').join(__dirname, 'dashboard_EXT', 'public')))
      Dashboard.app.set('views', require('path').join(__dirname, 'dashboard_EXT', 'views'))
      Dashboard.app.use(cookieParser(Dashboard.settings.tokenSecret))
      Dashboard.app.use(session({
        secret: Dashboard.settings.tokenSecret,
        resave: false,
        saveUninitialized: false
      }))

      Dashboard.app.use(bodyParser.urlencoded({
        extended: true
      }))

      Dashboard.app.use(passport.initialize())
      Dashboard.app.use(passport.session())
    }

    Dashboard.passport = function () {
      passport.serializeUser(function (user, done) {
        done(null, user)
      })

      passport.deserializeUser(function (obj, done) {
        done(null, obj)
      })

      passport.use(new Strategy.Strategy({
        clientID: DBM.Bot.bot.user.id,
        clientSecret: Dashboard.settings.clientSecret,
        callbackURL: Dashboard.settings.callbackURL,
        scope: Dashboard.scopes
      }, (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => {
          return done(null, profile)
        })
      }))
    }

    Dashboard.loginRoute = function () {
      Dashboard.app.get('/login', passport.authenticate('discord', {
        scope: Dashboard.scopes
      }), function (req, res, next) {

      })

      Dashboard.app.get('/dashboard/callback',
        passport.authenticate('discord', {
          failureRedirect: '/'
        }),
        function (req, res, next) {
          // req.user.commandExecuted
          res.redirect('/dashboard/@me')
        }
      )
    }

    Dashboard.onReady = function () {
      Dashboard.checkActions()
      console.log('-------------------------------------------------------------------------------------------------')
      console.log(chalk.yellow(figlet.textSync('DBM Dashboard', {
        horizontalLayout: 'full'
      })))
      console.log('-------------------------------------------------------------------------------------------------')
      console.log(chalk.white('-'), chalk.red('Version:'), chalk.white('1.0.0'))
      console.log(chalk.white('-'), chalk.red('Port:'), chalk.white(Dashboard.settings.port))
      console.log(chalk.white('-'), chalk.red('isBotSharded:'), chalk.white(Dashboard.settings.isBotSharded))
      console.log(chalk.white('-'), chalk.red('Client Secret:'), chalk.white(Dashboard.settings.clientSecret))
      console.log(chalk.white('-'), chalk.red('Callback Url:'), chalk.white(Dashboard.settings.callbackURL))
      console.log(chalk.white('-'), chalk.red('DBM Network:'), chalk.white('https://discord.gg/3QxkZPK'))
      console.log('-------------------------------------------------------------------------------------------------')
      console.log(chalk.white(chalk.green('- Success:'), `Dashboard started on port ${Dashboard.settings.port}. http://localhost:${Dashboard.settings.port}`))
      console.log('-------------------------------------------------------------------------------------------------')
    }
    // ----------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------

    const dashboardOnReady = DBM.Bot.onReady || {}
    DBM.Bot.onReady = async function () {
      Dashboard.scopes = ['identify', 'guilds']

      if (!Dashboard.verifyConfig().length === 0) {
        console.log('-------------------------------------------------------------------------------------------------')
        console.log(chalk.yellow(figlet.textSync('DBM Dashboard', {
          horizontalLayout: 'full'
        })))
        console.log('-------------------------------------------------------------------------------------------------')
        console.log(chalk.white('-'), chalk.red('Version:'), chalk.white('1.0.0'))
        console.log(chalk.white('-'), chalk.red('Port:'), chalk.white(Dashboard.settings.port))
        console.log(chalk.white('-'), chalk.red('isBotSharded:'), chalk.white(Dashboard.settings.isBotSharded))
        console.log(chalk.white('-'), chalk.red('Client Secret:'), chalk.white(Dashboard.settings.clientSecret))
        console.log(chalk.white('-'), chalk.red('Callback Url:'), chalk.white(Dashboard.settings.callbackURL))
        console.log(chalk.white('-'), chalk.red('DBM Network:'), chalk.white('https://discord.gg/3QxkZPK'))
        console.log('-------------------------------------------------------------------------------------------------')
        Dashboard.verifyConfig().forEach(error => {
          console.log(chalk.white('- Error:'), chalk.red(error))
        })
        console.log('-------------------------------------------------------------------------------------------------')
        return
      };

      // Dashboard init
      Dashboard.appSettings()
      Dashboard.passport()
      Dashboard.loginRoute()
      Dashboard.loadMods()
      Dashboard.loadRoutes()
      Dashboard.loadExtensions()

      if (DBM.Bot.bot.ws.shards.get(0).id === 0) {
        Dashboard.app.listen(Dashboard.settings.port, () => Dashboard.onReady())
      };

      dashboardOnReady.apply(this, arguments)
    }
  }
}
