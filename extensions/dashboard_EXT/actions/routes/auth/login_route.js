const secureConfig = require('../../../security/config');

module.exports = {
  name: 'Login Route',
  section: 'Authentication',
  meta: {
    version: '1.0.0',
    preciseCheck: false,
    author: 'DBM Team',
    authorUrl: 'https://github.com/DBM-Mods',
    downloadUrl: 'https://github.com/dbm-network/mods',
    short_description: 'Handles user login via database authentication',
    long_description: 'Provides secure login functionality with session management and rate limiting.',
    category: 'Authentication',
    subcategory: 'Login',
    install: 'Installation instructions here...',
    uninstall: 'Uninstallation instructions here...',
    dependencies: ['database-auth', 'bcrypt', 'jsonwebtoken'],
    compatibility: 'Node.js 16+',
    tags: ['auth', 'login', 'database', 'security'],
    additional_info: 'This module handles user authentication through database credentials.',
    icon: 'fas fa-sign-in-alt',
    color: '#7289DA',
  },

  subtitle(data) {
    return 'Handle user login';
  },

  fields: ['action', 'username', 'password', 'rememberMe'],

  html(isEvent, data) {
    return `
        <div class="form-group">
            <label>Action:</label>
            <select class="form-control" name="action">
                <option value="login">Login User</option>
                <option value="logout">Logout User</option>
                <option value="check">Check Session</option>
            </select>
        </div>
        <div class="form-group">
            <label>Username or Email:</label>
            <input class="form-control" name="username" placeholder="Enter username or email" />
        </div>
        <div class="form-group">
            <label>Password:</label>
            <input class="form-control" name="password" type="password" placeholder="Enter password" />
        </div>
        <div class="form-group">
            <label>
                <input type="checkbox" name="rememberMe" />
                Remember me for 30 days
            </label>
        </div>
        `;
  },

  init() {
    this.databaseAuth = new DatabaseAuth();
  },

  action(cache) {
    const data = cache.actions[cache.index];
    const action = data.action;
    const username = data.username;
    const password = data.password;
    const rememberMe = data.rememberMe;

    const req = cache.req;
    const res = cache.res;

    if (!req || !res) {
      this.callNextAction(cache);
      return;
    }

    switch (action) {
      case 'login':
        this.handleLogin(req, res, username, password, rememberMe, cache);
        break;
      case 'logout':
        this.handleLogout(req, res, cache);
        break;
      case 'check':
        this.handleCheckSession(req, res, cache);
        break;
      default:
        res.status(400).json({ success: false, message: 'Invalid action' });
        this.callNextAction(cache);
    }
  },

  async handleLogin(req, res, username, password, rememberMe, cache) {
    try {
      if (!username || !password) {
        res.status(400).json({
          success: false,
          message: 'Username and password are required',
        });
        this.callNextAction(cache);
        return;
      }

      // Rate limiting check
      const clientIP = req.ip || req.connection.remoteAddress;
      const rateLimitKey = `login_attempts_${clientIP}`;

      if (!global.rateLimitStore) {
        global.rateLimitStore = new Map();
      }

      const attempts = global.rateLimitStore.get(rateLimitKey) || 0;
      if (attempts >= 5) {
        res.status(429).json({
          success: false,
          message: 'Too many login attempts. Please try again later.',
        });
        this.callNextAction(cache);
        return;
      }

      // Authenticate user
      const user = await this.databaseAuth.authenticateUser(username, password);

      if (!user) {
        global.rateLimitStore.set(rateLimitKey, attempts + 1);
        setTimeout(() => {
          global.rateLimitStore.delete(rateLimitKey);
        }, 15 * 60 * 1000); // 15 minutes

        res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
        this.callNextAction(cache);
        return;
      }

      // Clear rate limit on successful login
      global.rateLimitStore.delete(rateLimitKey);

      // Create session
      const userAgent = req.get('User-Agent') || '';
      const sessionToken = await this.databaseAuth.createSession(user.id, clientIP, userAgent);

      // Set session cookie
      const cookieOptions = {
        httpOnly: true,
        secure: secureConfig.isProduction(),
        sameSite: 'strict',
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000, // 30 days or 7 days
      };

      res.cookie('session_token', sessionToken, cookieOptions);

      // Log successful login
      console.log(`✅ User logged in: ${user.username} (${user.email})`);

      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          discord_id: user.discord_id,
        },
      });
    } catch (error) {
      console.error('❌ Login error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }

    this.callNextAction(cache);
  },

  async handleLogout(req, res, cache) {
    try {
      const sessionToken = req.cookies.session_token;

      if (sessionToken) {
        await this.databaseAuth.destroySession(sessionToken);
      }

      res.clearCookie('session_token');
      res.json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      console.error('❌ Logout error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }

    this.callNextAction(cache);
  },

  async handleCheckSession(req, res, cache) {
    try {
      const sessionToken = req.cookies.session_token;

      if (!sessionToken) {
        res.status(401).json({
          success: false,
          message: 'No session found',
        });
        this.callNextAction(cache);
        return;
      }

      const user = await this.databaseAuth.validateSession(sessionToken);

      if (!user) {
        res.clearCookie('session_token');
        res.status(401).json({
          success: false,
          message: 'Invalid or expired session',
        });
        this.callNextAction(cache);
        return;
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          discord_id: user.discord_id,
        },
      });
    } catch (error) {
      console.error('❌ Session check error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }

    this.callNextAction(cache);
  },

  mod(DBM) {
    DBM.Actions.registerMod(this);
  },
};
