module.exports = {
  /*
    - Author: Great Plains Modding
    - Version: 1.1.1
    - GitHub: https://github.com/greatplainsmodding
    - Description: Contains multiple stuff needed for my mods / extensions / events.
  */

  authors: ['Great Plains Modding', 'danno3817'],
  version: '1.1.2',
  changeLog: '',
  shortDescription: 'Discord Bot Maker Dashboard.',
  longDescription: '',
  requiredNodeModules: [],

  name: 'Bot Dashboard',
  isCommandExtension: false,
  isEventExtension: false,
  isEditorExtension: true,
  fields: ['port', 'clientSecret', 'callbackURL', 'owner', 'supportServer'],

  defaultFields: {
    port: require(require('path').join(
      __dirname,
      'dashboard_EXT',
      'config.json'
    )).port,
    clientSecret: require(require('path').join(
      __dirname,
      'dashboard_EXT',
      'config.json'
    )).clientSecret,
    callbackURL: require(require('path').join(
      __dirname,
      'dashboard_EXT',
      'config.json'
    )).callbackURL,
    owner: require(require('path').join(
      __dirname,
      'dashboard_EXT',
      'config.json'
    )).owner,
    supportServer: require(require('path').join(
      __dirname,
      'dashboard_EXT',
      'config.json'
    )).supportServer
  },

  size: () => {
    return {
      width: 700,
      height: 620
    }
  },

  html: (data) => {
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
        </div>
      `
    } catch (error) {
      return error
    }
  },

  init: (DBM) => {},

  close: (document, data) => {
    data.port = String(document.getElementById('port').value)
    data.clientSecret = String(document.getElementById('clientSecret').value)
    data.callbackURL = String(document.getElementById('callbackURL').value)
    data.owner = String(document.getElementById('owner').value)
    data.supportServer = String(document.getElementById('supportServer').value)

    try {
      const config = require('./dashboard_EXT/config.json')
      const dashboardConfigPath = require('path').join(
        __dirname,
        '../extensions',
        'dashboard_EXT',
        'config.json'
      )
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
        isGlitch: config.isGlitch,
        features: config.features
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
    }
  },

  load: (DBM, projectLoc) => {},

  save: (DBM, data, projectLoc) => {},

  mod: async (DBM) => {
    const fs = require('fs')
    const path = require('path')
    const chalk = await DBM.extensionHelper.requireModule(
      'chalk',
      'dashboard_EXT'
    )
    const fetch = await DBM.extensionHelper.requireModule(
      'node-fetch',
      'dashboard_EXT'
    )

    /******************************************************
     * DBM Dashboard
     * Version 1.0.5
     * Great PLains Modding
     ******************************************************/

    const Dashboard = {}
    Dashboard.version = '1.1.5'

    Dashboard.updateExtension = async () => {
      const extHelperPath = path.join(__dirname, 'aaa_extensionHelper_EXT.js')

      // auto install extensionHelper if not exists.
      if (!fs.existsSync(extHelperPath)) {
        console.log(
          chalk.red(
            'aaa_extensionHelper_EXT.js is missing ~ Auto installing it.'
          )
        )
        const url = await 'https://raw.githubusercontent.com/dbm-network/extensions/master/extensions/aaa_extensionHelper_EXT/aaa_extensionHelper_EXT.js'

        await fetch(url)
          .then((res) => res.text())
          .then((depFile) => require('fs').writeFileSync(extHelperPath, depFile))

        DBM.extensionHelper = require(extHelperPath)
        DBM.extensionHelper.mod(DBM)
        console.log(
          chalk.green(
            'Successfully installed aaa_extensionHelper_EXT.js, note you may need to restart your bot.'
          )
        )
        setTimeout(function () {}, 1000)
      }

      // check for and updates
      DBM.extensionHelper.autoUpdater({
        depInfo:
          'https://gist.githubusercontent.com/greatplainsmodding/977cdd45030fc0af1017b493b738cde1/raw/dashboard_EXT.json',
        depFile:
          'https://raw.githubusercontent.com/dbm-network/mods/master/extensions/dbm_dashboard/dashboard_EXT.js',
        version: Dashboard.version
      })
    }

    Dashboard.checkActions = async function () {
      try {
        const modsDirectory = path.join(
          __dirname,
          'dashboard_EXT',
          'actions',
          'mods'
        )
        if (!fs.existsSync()) {
          fs.mkdirSync(modsDirectory, { recursive: true })
        }
        DBM.extensionHelper.log.warn(
          '(DBM Dashboard ~ Auto Installer) Checking for new and updated actions.'
        )
        const modsFetched = await fetch(
          'https://api.github.com/repos/greatplainsmodding/DBM-Dashboard-Mods/git/trees/master'
        ).then((res) => res.json().then((data) => data.tree))
        if (!modsFetched) return
        for (const mod of modsFetched) {
          const modPath = path.join(modsDirectory, mod.path)
          if (!fs.existsSync(modPath)) {
            console.log(
              chalk.yellow('(DBM Dashboard) ~ Auto Mod Install: ' + mod.path)
            )
            const fetchedMod = await fetch(mod.url).then((res) =>
              res.json().then((data) => data.tree)
            )
            fs.mkdirSync(modPath, { recursive: true })
            for (const file of fetchedMod) {
              const modFilePath = path.join(modPath, file.path)
              if (!fs.existsSync(modFilePath)) {
                const modFile = await fetch(
                  'https://raw.githubusercontent.com/greatplainsmodding/DBM-Dashboard-Mods/master/' +
                    mod.path +
                    '/' +
                    file.path
                ).then((res) => res.text())
                'fs'.writeFileSync(modFilePath, modFile)
                console.log(
                  chalk.green('Successfully downloaded ' + file.path)
                )
              }
            }
          }
        }
      } catch (error) {
        console.log(chalk.red(error))
      }
    }

    // require needed modules //
    const express = await DBM.extensionHelper.requireModule(
      'express',
      'dashboard_EXT'
    )
    const bodyParser = await DBM.extensionHelper.requireModule(
      'body-parser',
      'dashboard_EXT'
    )
    const cookieParser = await DBM.extensionHelper.requireModule(
      'cookie-parser',
      'dashboard_EXT'
    )
    await DBM.extensionHelper.requireModule('ejs', 'dashboard_EXT')
    const Strategy = await DBM.extensionHelper.requireModule(
      'passport-discord',
      'dashboard_EXT'
    )
    const session = await DBM.extensionHelper.requireModule(
      'express-session',
      'dashboard_EXT'
    )
    const passport = await DBM.extensionHelper.requireModule(
      'passport',
      'dashboard_EXT'
    )
    const figlet = await DBM.extensionHelper.requireModule(
      'figlet',
      'dashboard_EXT'
    )

    Dashboard.app = express()

    // require local files for later use //
    Dashboard.Actions = {}
    Dashboard.settings = require(path.join(
      __dirname,
      'dashboard_EXT',
      'config.json'
    ))
    Dashboard.Actions.modsLocation = path.join(
      __dirname,
      'dashboard_EXT',
      'actions',
      'mods'
    )
    Dashboard.Actions.routeLocation = path.join(
      __dirname,
      'dashboard_EXT',
      'actions',
      'routes'
    )
    Dashboard.Actions.extensionLocation = path.join(
      __dirname,
      'dashboard_EXT',
      'actions',
      'extensions'
    )

    Dashboard.Actions.mods = new Map()
    Dashboard.Actions.extensions = new Map()

    Dashboard.storeData = function (fileName, dataName, data) {
      if (!fileName) { return console.log('storeData("fileName", "dataName", "data")') }
      if (!dataName) { return console.log('storeData("fileName", "dataName", "data")') }

      try {
        if (!fs.existsSync(path.join(__dirname, 'dashboard_EXT'))) {
          fs.mkdirSync(path.join(__dirname, 'dashboard_EXT'))
        }
        const resourceFilePath = path.join(
          __dirname,
          'dashboard_EXT',
          `${fileName}.json`
        )
        if (!fs.existsSync(resourceFilePath)) {
          let data = {}
          data = JSON.stringify(data)
          fs.writeFileSync(resourceFilePath, data)
        }

        let jsonFile = require(path.join(
          __dirname,
          'dashboard_EXT',
          `${fileName}.json`
        ))
        jsonFile[dataName] = data
        jsonFile = JSON.stringify(jsonFile)
        fs.writeFileSync(resourceFilePath, jsonFile, 'utf8')
        return jsonFile
      } catch (error) {
        console.log(error)
      }
    }

    Dashboard.retrieveData = function (fileName, dataName) {
      try {
        if (!fs.existsSync(path.join(__dirname, 'dashboard_EXT'))) {
          fs.mkdirSync(path.join(__dirname, 'dashboard_EXT'))
        }
        const resourceFilePath = path.join(
          __dirname,
          'dashboard_EXT',
          `${fileName}.json`
        )
        if (!fs.existsSync(resourceFilePath)) {
          let data = {}
          data = JSON.stringify(data)
          fs.writeFileSync(resourceFilePath, data)
        }
        const jsonFile = require(path.join(
          __dirname,
          'dashboard_EXT',
          `${fileName}.json`
        ))
        return jsonFile[dataName]
      } catch (error) {
        console.error(error)
      }
    }

    Dashboard.retrieveFile = function (fileName) {
      try {
        if (!fs.existsSync(path.join(__dirname, 'dashboard_EXT'))) {
          fs.mkdirSync(path.join(__dirname, 'dashboard_EXT'))
        }
        const resourceFilePath = path.join(
          __dirname,
          'dashboard_EXT',
          `${fileName}.json`
        )
        if (!fs.existsSync(resourceFilePath)) {
          let data = {}
          data = JSON.stringify(data)
          fs.writeFileSync(resourceFilePath, data)
          return {}
        }
        const jsonFile = require(path.join(
          __dirname,
          'dashboard_EXT',
          `${fileName}.json`
        ))
        return jsonFile
      } catch (error) {
        console.error(error)
      }
    }

    Dashboard.loadMods = function () {
      fs.readdirSync(Dashboard.Actions.modsLocation).forEach((dir) => {
        const modData = require(path.join(
          Dashboard.Actions.modsLocation,
          dir,
          '__resource.json'
        ))
        Dashboard.Actions.mods.set(dir, modData)

        if (modData.cssFiles) {
          modData.cssFiles.forEach((cssFile) => {
            Dashboard.app.get(
              `/${modData.name}/css/${cssFile}`,
              function (req, res) {
                res.sendFile(
                  path.join(
                    __dirname,
                    'dashboard_EXT',
                    'actions',
                    'mods',
                    dir,
                    cssFile
                  )
                )
              }
            )
          })
        }
      })
    }

    Dashboard.loadRoutes = function () {
      fs.readdirSync(Dashboard.Actions.routeLocation).forEach((dir) => {
        const routeData = require(path.join(
          Dashboard.Actions.routeLocation,
          dir,
          '__resource.json'
        ))
        if (routeData.isCustom) {
          // routeData.scriptFiles.forEach(file => {
          //   const fileData = require(path').join(Dashboard.Actions.routeLocation, dir, file))
          // })
        } else {
          routeData.scriptFiles.forEach((file) => {
            const fileData = require(path.join(
              Dashboard.Actions.routeLocation,
              dir,
              file
            ))
            fileData.init(DBM, Dashboard)
            const webFile = path.join(
              __dirname,
              'dashboard_EXT',
              'actions',
              'routes',
              dir,
              routeData.webFile
            )
            if (routeData.cssFiles) {
              routeData.cssFiles.forEach((cssFile) => {
                Dashboard.app.get(
                  `/${routeData.name}/css/${cssFile}`,
                  function (req, res) {
                    res.sendFile(
                      path.join(
                        __dirname,
                        'dashboard_EXT',
                        'actions',
                        'routes',
                        dir,
                        cssFile
                      )
                    )
                  }
                )
              })
            }
            if (routeData.loginRequired) {
              Dashboard.app.get(
                routeData.routeURL,
                Dashboard.checkAuth,
                function (req, res) {
                  const renderData = fileData.run(DBM, req, res, Dashboard)
                  if (renderData.skipRender) return
                  res.render(webFile, {
                    data: renderData
                  })
                }
              )
            } else {
              Dashboard.app.get(routeData.routeURL, function (req, res) {
                const renderData = fileData.run(DBM, req, res, Dashboard)
                res.render(webFile, {
                  data: renderData
                })
              })
            }
          })
        }
      })
    }

    Dashboard.loadExtensions = function () {
      fs.readdirSync(Dashboard.Actions.extensionLocation).forEach((dir) => {
        const extensionData = require(path.join(
          Dashboard.Actions.extensionLocation,
          dir,
          '__resource.json'
        ))
        Dashboard.Actions.extensions.set(dir, extensionData)

        if (extensionData.cssFiles) {
          extensionData.cssFiles.forEach((cssFile) => {
            Dashboard.app.get(
              `/${extensionData.name}/css/${cssFile}`,
              function (req, res) {
                res.sendFile(
                  path.join(
                    __dirname,
                    'dashboard_EXT',
                    'actions',
                    'mods',
                    dir,
                    cssFile
                  )
                )
              }
            )
          })
        }

        extensionData.scriptFiles.forEach((file) => {
          const extensionFile = require(path.join(
            Dashboard.Actions.extensionLocation,
            dir,
            file
          ))
          extensionFile.init(DBM, Dashboard)
        })
      })
    }

    Dashboard.checkAuth = function (req, res, next) {
      if (req.isAuthenticated()) {
        return next()
      }
      res.redirect('/login')
    }

    Dashboard.randomString = function () {
      let string = ''
      const randomChar = 'abcdefghijklmnopqrstuvwxyz0123456789'
      for (var i = 0; i < 50; i++) {
        string += randomChar.charAt(
          Math.floor(Math.random() * randomChar.length)
        )
      }
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

        Dashboard.app.use(
          bodyParser.urlencoded({
            extended: true
          })
        )

        Dashboard.app.post('/setup', (req, res) => {
          console.log(req.body)
        })
        console.log(
          chalk.red(
            'Please navigate to http://localhost:3000 to complete the setup.'
          )
        )
        return errors
      } else {
        if (!settings.port) { errors.push('Invalid port, please check your config.') }
        if (!settings.tokenSecret) {
          const filePath = path.join(__dirname, 'dashboard_EXT', 'config.json')
          settings.tokenSecret = Dashboard.randomString()
          settings = JSON.stringify(settings)
          fs.writeFileSync(filePath, settings, 'utf8')
        }
        if (!settings.clientSecret) { errors.push('Invalid client secret, please check your config.') }
        if (!settings.callbackURL) { errors.push('Invalid callback url, please check your config.') }
        return errors
      }
    }

    Dashboard.appSettings = function () {
      Dashboard.app.set('view engine', 'ejs')
      Dashboard.app.use(
        express.static(path.join(__dirname, 'dashboard_EXT', 'public'))
      )
      Dashboard.app.set(
        'views',
        path.join(__dirname, 'dashboard_EXT', 'views')
      )
      Dashboard.app.use(cookieParser(Dashboard.settings.tokenSecret))
      Dashboard.app.use(
        session({
          secret: Dashboard.settings.tokenSecret,
          resave: false,
          saveUninitialized: false
        })
      )

      Dashboard.app.use(
        bodyParser.urlencoded({
          extended: true
        })
      )

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

      passport.use(
        new Strategy.Strategy(
          {
            clientID: DBM.Bot.bot.user.id,
            clientSecret: Dashboard.settings.clientSecret,
            callbackURL: Dashboard.settings.callbackURL,
            scope: Dashboard.scopes
          },
          (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => {
              return done(null, profile)
            })
          }
        )
      )
    }

    Dashboard.loginRoute = function () {
      Dashboard.app.get(
        '/login',
        passport.authenticate('discord', {
          scope: Dashboard.scopes
        }),
        function (req, res, next) {}
      )

      Dashboard.app.get(
        '/dashboard/callback',
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
      console.log(
        '-------------------------------------------------------------------------------------------------'
      )
      console.log(
        chalk.yellow(
          figlet.textSync('DBM Dashboard', {
            horizontalLayout: 'full'
          })
        )
      )
      console.log(
        '-------------------------------------------------------------------------------------------------'
      )
      console.log(
        chalk.white('-'),
        chalk.red('Version:'),
        chalk.white('1.0.0')
      )
      console.log(
        chalk.white('-'),
        chalk.red('Port:'),
        chalk.white(Dashboard.settings.port)
      )
      console.log(
        chalk.white('-'),
        chalk.red('isBotSharded:'),
        chalk.white(Dashboard.settings.isBotSharded)
      )
      console.log(
        chalk.white('-'),
        chalk.red('Client Secret:'),
        chalk.white(Dashboard.settings.clientSecret)
      )
      console.log(
        chalk.white('-'),
        chalk.red('Callback Url:'),
        chalk.white(Dashboard.settings.callbackURL)
      )
      console.log(
        chalk.white('-'),
        chalk.red('DBM Network:'),
        chalk.white('https://discord.gg/3QxkZPK')
      )
      console.log(
        '-------------------------------------------------------------------------------------------------'
      )
      console.log(
        chalk.white(
          chalk.green('- Success:'),
          `Dashboard started on port ${Dashboard.settings.port}. http://localhost:${Dashboard.settings.port}`
        )
      )
      console.log(
        '-------------------------------------------------------------------------------------------------'
      )
    }

    const dashboardOnReady = DBM.Bot.onReady || {}
    DBM.Bot.onReady = async function () {
      Dashboard.scopes = ['identify', 'guilds']

      if (!Dashboard.verifyConfig().length === 0) {
        console.log(
          '-------------------------------------------------------------------------------------------------'
        )
        console.log(
          chalk.yellow(
            figlet.textSync('DBM Dashboard', {
              horizontalLayout: 'full'
            })
          )
        )
        console.log(
          '-------------------------------------------------------------------------------------------------'
        )
        console.log(
          chalk.white('-'),
          chalk.red('Version:'),
          chalk.white('1.0.0')
        )
        console.log(
          chalk.white('-'),
          chalk.red('Port:'),
          chalk.white(Dashboard.settings.port)
        )
        console.log(
          chalk.white('-'),
          chalk.red('isBotSharded:'),
          chalk.white(Dashboard.settings.isBotSharded)
        )
        console.log(
          chalk.white('-'),
          chalk.red('Client Secret:'),
          chalk.white(Dashboard.settings.clientSecret)
        )
        console.log(
          chalk.white('-'),
          chalk.red('Callback Url:'),
          chalk.white(Dashboard.settings.callbackURL)
        )
        console.log(
          chalk.white('-'),
          chalk.red('DBM Network:'),
          chalk.white('https://discord.gg/3QxkZPK')
        )
        console.log(
          '-------------------------------------------------------------------------------------------------'
        )
        Dashboard.verifyConfig().forEach((error) => {
          console.log(chalk.white('- Error:'), chalk.red(error))
        })
        console.log(
          '-------------------------------------------------------------------------------------------------'
        )
        return
      }

      // Dashboard init
      Dashboard.updateExtension()
      Dashboard.appSettings()
      Dashboard.passport()
      Dashboard.loginRoute()
      Dashboard.loadMods()
      Dashboard.loadRoutes()
      Dashboard.loadExtensions()

      if (DBM.Bot.bot.ws.shards.get(0).id === 0) {
        Dashboard.app.listen(Dashboard.settings.port, () =>
          Dashboard.onReady()
        )
      }

      dashboardOnReady.apply(this, arguments)
    }
  }
}
