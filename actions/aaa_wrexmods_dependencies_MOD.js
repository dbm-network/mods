// ---------------------------------------------------------------------
// WrexMODS - for Discord Bot Maker
// Contains functions for actions using WrexMODS
// ---------------------------------------------------------------------
const WrexMODS = {};

WrexMODS.API = {};

WrexMODS.DBM = null;

WrexMODS.Version = '2.0.5';

WrexMODS.latest_changes = 'The module installer WORKS NOW';

// Changelog
// Lasse - 1.9:
// Merged custom_methods into wrexmods

// wrex - 2.0.5
// wrex - FIXED THE DAMN MODULE INSTALLER

// rigid - 2.0.6
// rigid - fixed the **damn** module installer (from v12)

WrexMODS.CheckAndInstallNodeModule = function (moduleName) {
  try {
    require('child_process').execSync(`npm i ${moduleName}`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    console.log(`Failed to Install ${moduleName}, please re-try or install manually with "npm i ${moduleName}"`);
    return false;
  }
};

WrexMODS.require = function (moduleName) {
  try {
    return require(moduleName);
  } catch (e) {
    this.CheckAndInstallNodeModule(moduleName);
    try {
      return require(moduleName);
    } catch (e2) {
      return null;
    }
  }
};

WrexMODS.checkURL = function (url) {
  // / <summary>Checks if the provided URL is valid.</summary>
  // / <param name="url" type="String">The URL to check.</param>
  // / <returns type="Boolean">True if valid.</returns>
  return !url ? false : this.validUrl().isUri(url) ? true : false;
};

WrexMODS.runPostJson = function (url, json, returnJson = true, callback) {
  // / <summary>Runs a Request to return JSON Data</summary>
  // / <param name="url" type="String">The URL to post the JSON to.</param>
  // / <param name="json" type="String">The json to post</param>
  // / <param name="returnJson" type="Boolean">True if the response should be in JSON format. False if not</param>
  // / <param name="callback" type="Function">The callback function, args: error, statusCode, data</param>
  const axios = this.require('axios');
  axios
    .post(url, json, { headers: { 'Content-Type': 'application/json' } })
    .then(function (res) {
      const statusCode = res && res.status ? res.status : 200;
      const data = res && res.data !== undefined ? res.data : res;
      if (callback && typeof callback === 'function') {
        callback(null, statusCode, data);
      }
    })
    .catch(function (err) {
      const statusCode = err.response && err.response.status ? err.response.status : 500;
      const data = err.response && err.response.data !== undefined ? err.response.data : null;
      if (callback && typeof callback === 'function') {
        callback(err, statusCode, data);
      }
    });
};

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

// this.getWrexMods().executeDiscordJSON("POST", "guilds/" + msg.guild.id + "/channels", json ,this.getDBM(), cache)

WrexMODS.executeDiscordJSON = function (type, urlPath, json, DBM, cache, callback) {
  return new Promise((resolve, reject) => {
    const axios = this.require('axios');
    const url = `https://discord.com/api/v10/${urlPath}`;
    const config = {
      headers: { Authorization: `Bot ${DBM.Files.data.settings.token}` },
      method: type,
      url,
      data: json,
    };
    axios(config)
      .then(function (res) {
        const statusCode = res && res.status ? res.status : 200;
        const data = res && res.data !== undefined ? res.data : res;
        resolve({ err: null, statusCode, data });
        if (callback && typeof callback === 'function') {
          callback(null, statusCode, data);
        }
      })
      .catch(function (err) {
        const statusCode = err.response && err.response.status ? err.response.status : 500;
        const data = err.response && err.response.data !== undefined ? err.response.data : null;
        const rejErr = err instanceof Error ? err : new Error(String(err?.message || 'Discord JSON request failed'));
        rejErr.statusCode = statusCode;
        rejErr.data = data;
        reject(rejErr);
        if (callback && typeof callback === 'function') {
          callback(err, statusCode, data);
        }
      });
  });
};

WrexMODS.runPublicRequest = function (url, returnJson = false, callback, token, user, pass) {
  // / <summary>Runs a Request to return JSON Data</summary>
  // / <param name="url" type="String">The URL to get JSON from.</param>
  // / <param name="returnJson" type="String">True if the response should be in JSON format. False if not</param>
  // / <param name="callback" type="Function">The callback function, args: error, statusCode, data</param>
  const axios = this.require('axios');
  const config = { url, headers: { 'User-Agent': 'Other' }, responseType: returnJson ? 'json' : undefined };
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  if (user !== null && user !== undefined && pass !== null && pass !== undefined) {
    config.auth = { username: user, password: pass };
  }
  axios
    .get(url, config)
    .then(function (res) {
      const statusCode = res && res.status ? res.status : 200;
      const data = res && res.data !== undefined ? res.data : res;
      if (callback && typeof callback === 'function') {
        callback(null, statusCode, data);
      }
    })
    .catch(function (err) {
      const statusCode = err.response && err.response.status ? err.response.status : 500;
      const data = err.response && err.response.data !== undefined ? err.response.data : null;
      if (callback && typeof callback === 'function') {
        callback(err, statusCode, data);
      }
    });
};

WrexMODS.runBearerTokenRequest = function (url, returnJson = false, bearerToken, callback) {
  // / <summary>Runs a Request to return HTML Data using a bearer Token.</summary>
  // / <param name="url" type="String">The URL to get JSON from.</param>
  // / <param name="returnJson" type="String">True if the response should be in JSON format. False if not</param>
  // / <param name="bearerToken" type="String">The token to run the request with.</param>
  // / <param name="callback" type="Function">The callback function, args: error, statusCode, data</param>
  const axios = this.require('axios');
  const config = {
    url,
    headers: { 'User-Agent': 'Other', Authorization: `Bearer ${bearerToken}` },
    responseType: returnJson ? 'json' : undefined,
  };
  axios
    .get(url, config)
    .then(function (res) {
      const statusCode = res && res.status ? res.status : 200;
      const data = res && res.data !== undefined ? res.data : res;
      if (callback && typeof callback === 'function') {
        callback(null, statusCode, data);
      }
    })
    .catch(function (err) {
      const statusCode = err.response && err.response.status ? err.response.status : 500;
      const data = err.response && err.response.data !== undefined ? err.response.data : null;
      if (callback && typeof callback === 'function') {
        callback(err, statusCode, data);
      }
    });
};

WrexMODS.runBasicAuthRequest = function (url, returnJson = false, username, password, callback) {
  // / <summary>Runs a Request to return HTML Data</summary>
  // / <param name="url" type="String">The URL to get JSON from.</param>
  // / <param name="returnJson" type="String">True if the response should be in JSON format. False if not</param>
  // / <param name="username" type="String">The username for the request</param>
  // / <param name="password" type="String">The password for the request</param>
  // / <param name="callback" type="Function">The callback function, args: error, statusCode, data</param>
  const axios = this.require('axios');
  const config = {
    url,
    headers: { 'User-Agent': 'Other' },
    auth: { username, password },
    responseType: returnJson ? 'json' : undefined,
  };
  axios
    .get(url, config)
    .then(function (res) {
      const statusCode = res && res.status ? res.status : 200;
      const data = res && res.data !== undefined ? res.data : res;
      if (callback && typeof callback === 'function') {
        callback(null, statusCode, data);
      }
    })
    .catch(function (err) {
      const statusCode = err.response && err.response.status ? err.response.status : 500;
      const data = err.response && err.response.data !== undefined ? err.response.data : null;
      if (callback && typeof callback === 'function') {
        callback(err, statusCode, data);
      }
    });
};

WrexMODS.jsonPath = function (obj, expr, arg) {
  // JSONPath 0.8.0 - XPath for JSON
  // JSONPath Expressions: http://goessner.net/articles/JsonPath/index.html#e2
  // http://jsonpath.com/
  // function jsonPath(obj, expr, arg)
  // Copyright (c) 2007 Stefan Goessner (goessner.net)
  // Licensed under the MIT (MIT-LICENSE.txt) licence.
  const $ = obj;
  const P = {
    resultType: (arg && arg.resultType) || 'VALUE',
    result: [],
    normalize(expr) {
      const subx = [];
      return expr
        .replace(/[\['](\??\(.*?\))[\]']/g, function ($0, $1) {
          return `[#${subx.push($1) - 1}]`;
        })
        .replace(/'?\.'?|\['?/g, ';')
        .replace(/;;;|;;/g, ';..;')
        .replace(/;$|'?\]|'$/g, '')
        .replace(/#([0-9]+)/g, function ($0, $1) {
          return subx[$1];
        });
    },
    asPath(path) {
      const x = path.split(';');
      let p = '$';
      for (let i = 1, n = x.length; i < n; i++) p += /^[0-9*]+$/.test(x[i]) ? `[${x[i]}]` : `['${x[i]}']`;
      return p;
    },
    store(p, v) {
      if (p) P.result[P.result.length] = P.resultType === 'PATH' ? P.asPath(p) : v;
      return Boolean(p);
    },
    trace(expr, val, path) {
      if (expr) {
        let x = expr.split(';');
        const loc = x.shift();
        x = x.join(';');
        if (val && val.hasOwnProperty(loc)) P.trace(x, val[loc], `${path};${loc}`);
        else if (loc === '*')
          P.walk(loc, x, val, path, function (m, l, x, v, p) {
            P.trace(`${m};${x}`, v, p);
          });
        else if (loc === '..') {
          P.trace(x, val, path);
          P.walk(loc, x, val, path, function (m, l, x, v, p) {
            typeof v[m] === 'object' && P.trace(`..;${x}`, v[m], `${p};${m}`);
          });
        } else if (/,/.test(loc)) {
          // [name1,name2,...]
          for (let s = loc.split(/'?,'?/), i = 0, n = s.length; i < n; i++) P.trace(`${s[i]};${x}`, val, path);
        } else if (/^\(.*?\)$/.test(loc))
          // [(expr)]
          P.trace(`${P.eval(loc, val, path.substr(path.lastIndexOf(';') + 1))};${x}`, val, path);
        else if (/^\?\(.*?\)$/.test(loc))
          // [?(expr)]
          P.walk(loc, x, val, path, function (m, l, x, v, p) {
            if (P.eval(l.replace(/^\?\((.*?)\)$/, '$1'), v[m], m)) P.trace(`${m};${x}`, v, p);
          });
        else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc))
          // [start:end:step]  phyton slice syntax
          P.slice(loc, x, val, path);
      } else P.store(path, val);
    },
    walk(loc, expr, val, path, f) {
      if (val instanceof Array) {
        for (let i = 0, n = val.length; i < n; i++) if (i in val) f(i, loc, expr, val, path);
      } else if (typeof val === 'object') {
        for (const m in val) if (val.hasOwnProperty(m)) f(m, loc, expr, val, path);
      }
    },
    slice(loc, expr, val, path) {
      if (val instanceof Array) {
        const len = val.length;
        let start = 0;
        let end = len;
        let step = 1;
        loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function ($0, $1, $2, $3) {
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

  if (expr && obj && (P.resultType === 'VALUE' || P.resultType === 'PATH')) {
    P.trace(P.normalize(expr).replace(/^\$;/, ''), obj, '$');
    return P.result.length ? P.result : false;
  }
};

WrexMODS.validUrl = function () {
  // converted to function from NPM module valid-url: https://www.npmjs.com/package/valid-url
  const splitUri = function (uri) {
    const splitted = uri.match(/(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/);
    return splitted;
  };

  function is_iri(value) {
    if (!value) {
      return;
    }

    // check for illegal characters
    if (/[^a-z0-9\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\.\-\_\~\%]/i.test(value)) return;

    // check for hex escapes that aren't complete
    if (/%[^0-9a-f]/i.test(value)) return;
    if (/%[0-9a-f](:?[^0-9a-f]|$)/i.test(value)) return;

    let splitted = [];
    let scheme = '';
    let authority = '';
    let path = '';
    let query = '';
    let fragment = '';
    let out = '';

    // from RFC 3986
    splitted = splitUri(value);
    scheme = splitted[1];
    authority = splitted[2];
    path = splitted[3];
    query = splitted[4];
    fragment = splitted[5];

    // scheme and path are required, though the path can be empty
    if (!(scheme && scheme.length && path.length >= 0)) return;

    // if authority is present, the path must be empty or begin with a /
    if (authority && authority.length) {
      if (!(path.length === 0 || /^\//.test(path))) return;
    } else if (/^\/\//.test(path)) {
      // if authority is not present, the path must not start with //
      return;
    }

    // scheme must begin with a letter, then consist of letters, digits, +, ., or -
    if (!/^[a-z][a-z0-9\+\-\.]*$/.test(scheme.toLowerCase())) return;

    // re-assemble the URL per section 5.3 in RFC 3986
    out += `${scheme}:`;
    if (authority && authority.length) {
      out += `//${authority}`;
    }

    out += path;

    if (query && query.length) {
      out += `?${query}`;
    }

    if (fragment && fragment.length) {
      out += `#${fragment}`;
    }

    return out;
  }

  function is_http_iri(value, allowHttps) {
    if (!is_iri(value)) {
      return;
    }

    let splitted = [];
    let scheme = '';
    let authority = '';
    let path = '';
    let port = '';
    let query = '';
    let fragment = '';
    let out = '';

    // from RFC 3986
    splitted = splitUri(value);
    scheme = splitted[1];
    authority = splitted[2];
    path = splitted[3];
    query = splitted[4];
    fragment = splitted[5];

    if (!scheme) return;

    if (allowHttps) {
      if (scheme.toLowerCase() !== 'https') return;
    } else if (scheme.toLowerCase() !== 'http') {
      return;
    }

    // fully-qualified URIs must have an authority section that is
    // a valid host
    if (!authority) {
      return;
    }

    // enable port component
    if (/:(\d+)$/.test(authority)) {
      port = authority.match(/:(\d+)$/)[0];
      authority = authority.replace(/:\d+$/, '');
    }

    out += `${scheme}:`;
    out += `//${authority}`;

    if (port) {
      out += port;
    }

    out += path;

    if (query && query.length) {
      out += `?${query}`;
    }

    if (fragment && fragment.length) {
      out += `#${fragment}`;
    }

    return out;
  }

  function is_https_iri(value) {
    return is_http_iri(value, true);
  }

  function is_web_iri(value) {
    return is_http_iri(value) || is_https_iri(value);
  }

  const module = {};
  module.exports = {};
  module.exports.is_uri = is_iri;
  module.exports.is_http_uri = is_http_iri;
  module.exports.is_https_uri = is_https_iri;
  module.exports.is_web_uri = is_web_iri;
  // Create aliases
  module.exports.isUri = is_iri;
  module.exports.isHttpUri = is_http_iri;
  module.exports.isHttpsUri = is_https_iri;
  module.exports.isWebUri = is_web_iri;

  return module.exports;
};

WrexMODS.getWebhook = function (type, varName, cache) {
  const server = cache.server;
  switch (type) {
    case 1:
      return cache.temp[varName];
    case 2:
      if (server && this.server[server.id]) {
        return this.server[server.id][varName];
      }
      break;
    case 3:
      return this.global[varName];
    default:
      break;
  }
  return false;
};

WrexMODS.getReaction = function (type, varName, cache) {
  const server = cache.server;
  switch (type) {
    case 1:
      return cache.temp[varName];
    case 2:
      if (server && this.server[server.id]) {
        return this.server[server.id][varName];
      }
      break;
    case 3:
      return this.global[varName];
    default:
      break;
  }
  return false;
};

WrexMODS.getEmoji = function (type, varName, cache) {
  const server = cache.server;
  switch (type) {
    case 1:
      return cache.temp[varName];
    case 2:
      if (server && this.server[server.id]) {
        return this.server[server.id][varName];
      }
      break;
    case 3:
      return this.global[varName];
    default:
      break;
  }
  return false;
};

// This function is called by DBM when the bot is started
const customaction = {};
customaction.name = 'WrexMODS';
customaction.section = 'JSON Things';
customaction.author = 'General Wrex';
customaction.version = '1.8.3';
customaction.short_description = 'Required for some mods. Does nothing';

customaction.html = function () {
  return `
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
     <p>
		<u>Wrexmods Dependencies:</u><br><br>
		This isn't an action, but it is required for the actions under this category. <br><br> 
		<b> Create action wont do anything </b>
	</p>
</div>`;
};

customaction.getWrexMods = function () {
  return WrexMODS;
};

customaction.mod = function (DBM) {
  WrexMODS.DBM = DBM;

  // Avoid running `npm i` on every bot start. Only install if missing.
  try {
    require.resolve('axios');
  } catch (e) {
    WrexMODS.CheckAndInstallNodeModule('axios');
  }
  // WrexMODS.CheckAndInstallNodeModule("extend");
  // WrexMODS.CheckAndInstallNodeModule("valid-url");

  DBM.Actions.getWrexMods = function () {
    return WrexMODS;
  };
};
module.exports = customaction;
