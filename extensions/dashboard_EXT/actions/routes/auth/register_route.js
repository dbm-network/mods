const DatabaseAuth = require('../../security/database-auth');

module.exports = {
  name: 'Register Route',
  section: 'Authentication',
  meta: {
    version: '1.0.0',
    preciseCheck: false,
    author: 'DBM Team',
    authorUrl: 'https://github.com/DBM-Mods',
    downloadUrl: 'https://github.com/dbm-network/mods',
    short_description: 'Handles user registration via database',
    long_description: 'Provides secure user registration with validation and password hashing.',
    category: 'Authentication',
    subcategory: 'Registration',
    install: 'Installation instructions here...',
    uninstall: 'Uninstallation instructions here...',
    dependencies: ['database-auth', 'bcrypt'],
    compatibility: 'Node.js 16+',
    tags: ['auth', 'register', 'database', 'security'],
    additional_info: 'This module handles user registration through database credentials.',
    icon: 'fas fa-user-plus',
    color: '#7289DA',
  },

  subtitle(data) {
    return 'Handle user registration';
  },

  fields: ['action', 'username', 'email', 'password', 'confirmPassword', 'discordId'],

  html(isEvent, data) {
    return `
        <div class="form-group">
            <label>Action:</label>
            <select class="form-control" name="action">
                <option value="register">Register User</option>
                <option value="validate">Validate Input</option>
            </select>
        </div>
        <div class="form-group">
            <label>Username:</label>
            <input class="form-control" name="username" placeholder="Enter username (3-50 characters)" />
        </div>
        <div class="form-group">
            <label>Email:</label>
            <input class="form-control" name="email" type="email" placeholder="Enter email address" />
        </div>
        <div class="form-group">
            <label>Password:</label>
            <input class="form-control" name="password" type="password" placeholder="Enter password (min 8 characters)" />
        </div>
        <div class="form-group">
            <label>Confirm Password:</label>
            <input class="form-control" name="confirmPassword" type="password" placeholder="Confirm password" />
        </div>
        <div class="form-group">
            <label>Discord ID (Optional):</label>
            <input class="form-control" name="discordId" placeholder="Enter Discord ID to link account" />
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
    const email = data.email;
    const password = data.password;
    const confirmPassword = data.confirmPassword;
    const discordId = data.discordId;

    const req = cache.req;
    const res = cache.res;

    if (!req || !res) {
      this.callNextAction(cache);
      return;
    }

    switch (action) {
      case 'register':
        this.handleRegister(req, res, username, email, password, confirmPassword, discordId, cache);
        break;
      case 'validate':
        this.handleValidate(req, res, username, email, password, confirmPassword, cache);
        break;
      default:
        res.status(400).json({ success: false, message: 'Invalid action' });
        this.callNextAction(cache);
    }
  },

  async handleRegister(req, res, username, email, password, confirmPassword, discordId, cache) {
    try {
      // Validate input
      const validation = this.validateRegistrationInput(username, email, password, confirmPassword);
      if (!validation.valid) {
        res.status(400).json({
          success: false,
          message: validation.message,
        });
        this.callNextAction(cache);
        return;
      }

      // Rate limiting check
      const clientIP = req.ip || req.connection.remoteAddress;
      const rateLimitKey = `register_attempts_${clientIP}`;

      if (!global.rateLimitStore) {
        global.rateLimitStore = new Map();
      }

      const attempts = global.rateLimitStore.get(rateLimitKey) || 0;
      if (attempts >= 3) {
        res.status(429).json({
          success: false,
          message: 'Too many registration attempts. Please try again later.',
        });
        this.callNextAction(cache);
        return;
      }

      // Register user
      const user = await this.databaseAuth.registerUser(username, email, password, discordId);

      // Clear rate limit on successful registration
      global.rateLimitStore.delete(rateLimitKey);

      // Log successful registration
      console.log(`✅ User registered: ${user.username} (${user.email})`);

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('❌ Registration error:', error.message);

      // Increment rate limit on error
      const clientIP = req.ip || req.connection.remoteAddress;
      const rateLimitKey = `register_attempts_${clientIP}`;
      global.rateLimitStore.set(rateLimitKey, (global.rateLimitStore.get(rateLimitKey) || 0) + 1);
      setTimeout(() => {
        global.rateLimitStore.delete(rateLimitKey);
      }, 15 * 60 * 1000); // 15 minutes

      res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    this.callNextAction(cache);
  },

  handleValidate(req, res, username, email, password, confirmPassword, cache) {
    try {
      const validation = this.validateRegistrationInput(username, email, password, confirmPassword);

      res.json({
        success: validation.valid,
        message: validation.message,
        errors: validation.errors || [],
      });
    } catch (error) {
      console.error('❌ Validation error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }

    this.callNextAction(cache);
  },

  validateRegistrationInput(username, email, password, confirmPassword) {
    const errors = [];

    // Username validation
    if (!username) {
      errors.push('Username is required');
    } else if (username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    } else if (username.length > 50) {
      errors.push('Username must be no more than 50 characters long');
    } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, underscores, and hyphens');
    }

    // Email validation
    if (!email) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Please enter a valid email address');
    }

    // Password validation
    if (!password) {
      errors.push('Password is required');
    } else if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number');
    }

    // Confirm password validation
    if (!confirmPassword) {
      errors.push('Please confirm your password');
    } else if (password !== confirmPassword) {
      errors.push('Passwords do not match');
    }

    return {
      valid: errors.length === 0,
      message: errors.length === 0 ? 'Input is valid' : 'Please fix the following errors',
      errors,
    };
  },

  mod(DBM) {
    DBM.Actions.registerMod(this);
  },
};
