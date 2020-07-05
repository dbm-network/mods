const Mods = {
  DBM: null,

  installModule (moduleName) {
    return new Promise((resolve) => {
      require('child_process').execSync(`npm i ${moduleName}`)
      try {
        resolve(require(moduleName))
      } catch {
        console.log(`Failed to Install ${moduleName}, please re-try or install manually with "npm i ${moduleName}"`)
      }
    })
  },

  require (moduleName) {
    try {
      return require(moduleName)
    } catch (e) {
      this.installModule(moduleName)
      return require(moduleName)
    }
  },

  checkURL (url) {
    if (!url) return false

    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  runPostJson (url, json, returnJson = true, callback) {
    const request = this.require('request')
    const options = {
      method: 'POST',
      url,
      json
    }

    request(options, (err, res, data) => {
      if (callback && typeof callback === 'function') callback(err, res ? res.statusCode : 200, data)
    })
  },

  /*
    var json = {
    "permission_overwrites": [],
    "name": tempVars("myChannel"),
    "parent_id": null,
    "nsfw": false,
    "position": 0,
    "guild_id": msg.guild.id,
    "type": 4
  }
  */

  // this.getMods().executeDiscordJSON("POST", "guilds/" + msg.guild.id + "/channels", json, this.getDBM(), cache)
  executeDiscordJSON (type, urlPath, json, DBM, cache, callback) {
    return new Promise((resolve, reject) => {
      const request = this.require('request')
      const options = {
        headers: { Authorization: `Bot ${DBM.Files.data.settings.token}` },
        url: `https://discordapp.com/api/v6/${urlPath}`,
        method: type,
        json
      }

      request(options, (err, res, data) => {
        const statusCode = res ? res.statusCode : 200

        if (err) reject({ err, statusCode, data }); else resolve({ err, statusCode, data })

        if (callback && typeof callback === 'function') callback(err, statusCode, data)
      })
    })
  },

  runPublicRequest (url, returnJson = false, callback, token, user, pass) {
    const request = this.require('request')

    request.get({
      url,
      json: returnJson,
      headers: { 'User-Agent': 'Other' },
      auth: {
        bearer: token,
        user,
        pass,
        sendImmediately: false
      }
    }, (err, res, data) => {
      const statusCode = res ? res.statusCode : 200

      if (callback && typeof callback === 'function') callback(err, statusCode, data)
    })
  },

  runBearerTokenRequest (url, returnJson = false, bearerToken, callback) {
    const request = this.require('request')

    request.get({
      url,
      json: returnJson,
      auth: { bearer: bearerToken },
      headers: { 'User-Agent': 'Other' }
    }, (err, res, data) => {
      const statusCode = res ? res.statusCode : 200

      if (callback && typeof callback === 'function') callback(err, statusCode, data)
    })
  },

  runBasicAuthRequest (url, returnJson = false, username, password, callback) {
    const request = this.require('request')

    request.get({
      url,
      json: returnJson,
      auth: {
        user: username,
        pass: password,
        sendImmediately: false
      },
      headers: { 'User-Agent': 'Other' }
    }, (err, res, data) => {
      const statusCode = res ? res.statusCode : 200

      if (callback && typeof callback === 'function') callback(err, statusCode, data)
    })
  },

  jsonPath (obj, expr, arg) {
    /* eslint-disable */
    // JSONPath 0.8.0 - XPath for JSON
    // JSONPath Expressions: http://goessner.net/articles/JsonPath/index.html#e2
    // http://jsonpath.com/
    // function jsonPath(obj, expr, arg)
    // Copyright (c) 2007 Stefan Goessner (goessner.net)
    // Licensed under the MIT (MIT-LICENSE.txt) licence.

    var P = {
      resultType: arg && arg.resultType || 'VALUE',
      result: [],
      normalize (expr) {
        const subx = []
        return expr.replace(/[\['](\??\(.*?\))[\]']/g, ($0, $1) => `[#${subx.push($1) - 1}]`)
          .replace(/'?\.'?|\['?/g, ';')
          .replace(/;;;|;;/g, ';..;')
          .replace(/;$|'?\]|'$/g, '')
          .replace(/#([0-9]+)/g, ($0, $1) => subx[$1])
      },
      asPath (path) {
        const x = path.split(';'); let
          p = '$'
        for (let i = 1, n = x.length; i < n; i++) p += /^[0-9*]+$/.test(x[i]) ? (`[${x[i]}]`) : (`['${x[i]}']`)
        return p
      },
      store (p, v) {
        if (p) P.result[P.result.length] = P.resultType == 'PATH' ? P.asPath(p) : v
        return !!p
      },
      trace (expr, val, path) {
        if (expr) {
          let x = expr.split(';'); const
            loc = x.shift()
          x = x.join(';')
          if (val && val.hasOwnProperty(loc)) P.trace(x, val[loc], `${path};${loc}`)
          else if (loc === '*') {
            P.walk(loc, x, val, path, (m, l, x, v, p) => {
              P.trace(`${m};${x}`, v, p)
            })
          } else if (loc === '..') {
            P.trace(x, val, path)
            P.walk(loc, x, val, path, (m, l, x, v, p) => {
              typeof v[m] === 'object' && P.trace(`..;${x}`, v[m], `${p};${m}`)
            })
          } else if (/,/.test(loc)) {
            for (let s = loc.split(/'?,'?/), i = 0, n = s.length; i < n; i++) P.trace(`${s[i]};${x}`, val, path)
          } else if (/^\(.*?\)$/.test(loc)) {
            P.trace(`${P.eval(loc, val, path.substr(path.lastIndexOf(';') + 1))};${x}`, val, path)
          } else if (/^\?\(.*?\)$/.test(loc)) {
            P.walk(loc, x, val, path, (m, l, x, v, p) => {
              if (P.eval(l.replace(/^\?\((.*?)\)$/, '$1'), v[m], m)) P.trace(`${m};${x}`, v, p)
            })
          } else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) {
            P.slice(loc, x, val, path)
          }
        } else P.store(path, val)
      },
      walk (loc, expr, val, path, f) {
        if (val instanceof Array) {
          for (let i = 0, n = val.length; i < n; i++) {
            if (i in val) f(i, loc, expr, val, path)
            else if (typeof val === 'object') {
              for (const m in val) {
                if (val.hasOwnProperty(m)) f(m, loc, expr, val, path)
              }
            }
          }
        }
      },
      slice (loc, expr, val, path) {
        if (val instanceof Array) {
          const len = val.length; let start = 0; let end = len; let
            step = 1
          loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, ($0, $1, $2, $3) => {
            start = parseInt($1 || start); end = parseInt($2 || end); step = parseInt($3 || step)
          })
          start = (start < 0) ? Math.max(0, start + len) : Math.min(len, start)
          end = (end < 0) ? Math.max(0, end + len) : Math.min(len, end)
          for (let i = start; i < end; i += step) P.trace(`${i};${expr}`, val, path)
        }
      },
      eval (x, _v, _vname) {
        try {
          return $ && _v && eval(x.replace(/@/g, '_v'))
        } catch (e) {
          throw new SyntaxError(`jsonPath: ${e.message}: ${x.replace(/@/g, '_v').replace(/\^/g, '_a')}`)
        }
      }
    }

    var $ = obj
    if (expr && obj && (P.resultType == 'VALUE' || P.resultType == 'PATH')) {
      P.trace(P.normalize(expr).replace(/^\$;/, ''), obj, '$')
      return P.result.length ? P.result : false
    }

    /* eslint-enable */
  },
  getWebhook (type, varName, cache) {
    const { server } = cache
    switch (type) {
      case 1:
        return cache.temp[varName]
      case 2:
        if (server && this.server[server.id]) return this.server[server.id][varName]
        break
      case 3:
        return this.global[varName]
      default:
        break
    }
    return false
  },

  getReaction (type, varName, cache) {
    const { server } = cache
    switch (type) {
      case 1:
        return cache.temp[varName]
      case 2:
        if (server && this.server[server.id]) return this.server[server.id][varName]
        break
      case 3:
        return this.global[varName]
      default:
        break
    }
    return false
  },

  getEmoji (type, varName, cache) {
    const { server } = cache
    switch (type) {
      case 1:
        return cache.temp[varName]
      case 2:
        if (server && this.server[server.id]) return this.server[server.id][varName]
        break
      case 3:
        return this.global[varName]
      default:
        break
    }
    return false
  },

  setupMusic (DBM) {
    if (DBM.Audio.playingnow === undefined) {
      DBM.Audio.playingnow = []
    }

    if (DBM.Audio.loopQueue === undefined) {
      DBM.Audio.loopQueue = {}
    }

    if (DBM.Audio.loopItem === undefined) {
      DBM.Audio.loopItem = {}
    }

    DBM.Audio.addToQueue = function (item, cache) {
      if (!cache.server) return
      const { id } = cache.server
      if (!this.queue[id]) {
        this.queue[id] = []
        DBM.Audio.loopQueue[id] = false
        DBM.Audio.loopItem[id] = false
      }
      this.queue[id].push(item)
      this.playNext(id)
    }

    DBM.Audio.playNext = function (id, forceSkip) {
      if (!this.connections[id]) {
        DBM.Audio.loopQueue[id] = false
        DBM.Audio.loopItem[id] = false
        return
      }
      if (!this.dispatchers[id] || !!forceSkip) {
        if (DBM.Audio.loopItem[id] === true) {
          const item = this.playingnow[id]
          this.playItem(item, id)
        } else if (DBM.Audio.loopQueue[id] === true) {
          const currentItem = this.playingnow[id]
          this.queue[id].push(currentItem)
          const nextItem = this.queue[id].shift()
          this.playItem(nextItem, id)
        } else {
          if (this.queue[id] && this.queue[id].length > 0) {
            const item = this.queue[id].shift()
            this.playItem(item, id)
          } else {
            DBM.Audio.loopQueue[id] = false
            DBM.Audio.loopItem[id] = false
            this.connections[id].disconnect()
          }
        }
      }
    }

    DBM.Audio.playItem = function (item, id) {
      if (!this.connections[id]) return
      if (this.dispatchers[id]) {
        this.dispatchers[id]._forceEnd = true
        this.dispatchers[id].destroy()
      }

      const type = item[0]
      let setupDispatcher = false
      switch (type) {
        case 'file':
          setupDispatcher = this.playFile(item[2], item[1], id)
          this.playingnow[id] = item
          break
        case 'url':
          setupDispatcher = this.playUrl(item[2], item[1], id)
          this.playingnow[id] = item
          break
        case 'yt':
          setupDispatcher = this.playYt(item[2], item[1], id)
          this.playingnow[id] = item
          break
      }

      if (setupDispatcher && !this.dispatchers[id]._eventSetup) {
        this.dispatchers[id].on('finish', () => {
          const isForced = this.dispatchers[id]._forceEnd
          this.dispatchers[id] = null
          if (!isForced) {
            this.playNext(id)
          }
        })
        this.dispatchers[id]._eventSetup = true
      }
    }
  }
}

module.exports = {
  name: 'Mods',
  section: 'JSON Things',

  html () {
    return `
    <div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
      <p>
        <u>DBM Mods Dependencies:</u><br><br>
        This isn't an action, but it is required for the actions under this category.<br><br>
        <bCreate action wont do anything</b>
      </p>
    </div>`
  },

  mod (DBM) {
    Mods.DBM = DBM

    DBM.Actions.getMods = function () {
      return Mods
    }

    DBM.Mods = function () {
      return Mods
    }
  },

  getMods () {
    return Mods
  }
}
