const Mods = {
  DBM: null,

  installModule(moduleName) {
    return new Promise((resolve) => {
      require('child_process').execSync(`npm i ${moduleName}`);
      try {
        resolve(require(moduleName));
      } catch (error) {
        console.error(`Failed to install ${moduleName}. Error: ${error.message}`);
      }
    });
  },

  require(moduleName) {
    try {
      return require(moduleName);
    } catch (e) {
      this.installModule(moduleName);
      return require(moduleName);
    }
  },

  checkURL(url) {
    if (!url) return false;

    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  jsonPath(obj, expr, arg) {
    /* eslint-disable */
    // JSONPath 0.8.0 - XPath for JSON
    // JSONPath Expressions: http://goessner.net/articles/JsonPath/index.html#e2
    // http://jsonpath.com/
    // function jsonPath(obj, expr, arg)
    // Copyright (c) 2007 Stefan Goessner (goessner.net)
    // Licensed under the MIT (MIT-LICENSE.txt) licence.

    var P = {
      resultType: (arg && arg.resultType) || 'VALUE',
      result: [],
      normalize(expr) {
        const subx = [];
        return expr
          .replace(/[\['](\??\(.*?\))[\]']/g, ($0, $1) => `[#${subx.push($1) - 1}]`)
          .replace(/'?\.'?|\['?/g, ';')
          .replace(/;;;|;;/g, ';..;')
          .replace(/;$|'?\]|'$/g, '')
          .replace(/#([0-9]+)/g, ($0, $1) => subx[$1]);
      },
      asPath(path) {
        const x = path.split(';');
        let p = '$';
        for (let i = 1, n = x.length; i < n; i++) p += /^[0-9*]+$/.test(x[i]) ? `[${x[i]}]` : `['${x[i]}']`;
        return p;
      },
      store(p, v) {
        if (p) P.result[P.result.length] = P.resultType == 'PATH' ? P.asPath(p) : v;
        return !!p;
      },
      trace(expr, val, path) {
        if (expr) {
          let x = expr.split(';');
          const loc = x.shift();
          x = x.join(';');
          if (val && val.hasOwnProperty(loc)) P.trace(x, val[loc], `${path};${loc}`);
          else if (loc === '*') {
            P.walk(loc, x, val, path, (m, l, x, v, p) => {
              P.trace(`${m};${x}`, v, p);
            });
          } else if (loc === '..') {
            P.trace(x, val, path);
            P.walk(loc, x, val, path, (m, l, x, v, p) => {
              typeof v[m] === 'object' && P.trace(`..;${x}`, v[m], `${p};${m}`);
            });
          } else if (/,/.test(loc)) {
            for (let s = loc.split(/'?,'?/), i = 0, n = s.length; i < n; i++) P.trace(`${s[i]};${x}`, val, path);
          } else if (/^\(.*?\)$/.test(loc)) {
            P.trace(`${P.eval(loc, val, path.substr(path.lastIndexOf(';') + 1))};${x}`, val, path);
          } else if (/^\?\(.*?\)$/.test(loc)) {
            P.walk(loc, x, val, path, (m, l, x, v, p) => {
              if (P.eval(l.replace(/^\?\((.*?)\)$/, '$1'), v[m], m)) P.trace(`${m};${x}`, v, p);
            });
          } else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) {
            P.slice(loc, x, val, path);
          }
        } else P.store(path, val);
      },
      walk(loc, expr, val, path, f) {
        if (val instanceof Array) {
          for (let i = 0, n = val.length; i < n; i++) {
            if (i in val) f(i, loc, expr, val, path);
            else if (typeof val === 'object') {
              for (const m in val) {
                if (val.hasOwnProperty(m)) f(m, loc, expr, val, path);
              }
            }
          }
        }
      },
      slice(loc, expr, val, path) {
        if (val instanceof Array) {
          const len = val.length;
          let start = 0;
          let end = len;
          let step = 1;
          loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, ($0, $1, $2, $3) => {
            start = parseInt($1 || start, 10);
            end = parseInt($2 || end, 10);
            step = parseInt($3 || step, 10);
          });
          start = start < 0 ? Math.max(0, start + len) : Math.min(len, start);
          end = end < 0 ? Math.max(0, end + len) : Math.min(len, end);
          for (let i = start; i < end; i += step) P.trace(`${i};${expr}`, val, path);
        }
      },
      eval(x, _v, _vname) {
        try {
          return $ && _v && eval(x.replace(/@/g, '_v'));
        } catch (e) {
          throw new SyntaxError(`jsonPath: ${e.message}: ${x.replace(/@/g, '_v').replace(/\^/g, '_a')}`);
        }
      },
    };

    var $ = obj;
    if (expr && obj && (P.resultType == 'VALUE' || P.resultType == 'PATH')) {
      P.trace(P.normalize(expr).replace(/^\$;/, ''), obj, '$');
      return P.result.length ? P.result : false;
    }

    /* eslint-enable */
  },
  getWebhook(type, varName, cache) {
    const { server } = cache;
    switch (type) {
      case 1:
        return cache.temp[varName];
      case 2:
        if (server && this.DBM.Actions.server[server.id]) return this.DBM.Actions.server[server.id][varName];
        break;
      case 3:
        return this.DBM.Actions.global[varName];
      default:
        break;
    }
    return false;
  },

  getReaction(type, varName, cache) {
    const { server } = cache;
    switch (type) {
      case 1:
        return cache.temp[varName];
      case 2:
        if (server && this.DBM.Actions.server[server.id]) return this.DBM.Actions.server[server.id][varName];
        break;
      case 3:
        return this.DBM.Actions.global[varName];
      default:
        break;
    }
    return false;
  },

  getEmoji(type, varName, cache) {
    const { server } = cache;
    switch (type) {
      case 1:
        return cache.temp[varName];
      case 2:
        if (server && this.DBM.Actions.server[server.id]) return this.DBM.Actions.server[server.id][varName];
        break;
      case 3:
        return this.DBM.Actions.global[varName];
      default:
        break;
    }
    return false;
  },
};

module.exports = {
  name: 'Mods',
  section: '#DBM Mods',
  displayName: 'Dependencies',

  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadUrl: 'https://github.com/dbm-network/mods/blob/master/actions/aaa_dbmmods_dependencies_MOD.js',
  },

  html() {
    return `
    <div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
      <p>
        <u>DBM Mods Dependencies:</u><br><br>
        This isn't an action, but it is required for the actions under this category.<br><br>
        <bCreate action wont do anything</b>
      </p>
    </div>`;
  },

  mod(DBM) {
    Mods.DBM = DBM;

    DBM.Actions.getMods = function getMods() {
      return Mods;
    };

    DBM.Mods = function _Mods() {
      return Mods;
    };
  },

  getMods() {
    return Mods;
  },
};
