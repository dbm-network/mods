const DatabaseAuth = require('./database-auth');

class AuthMiddleware {
  constructor() {
    this.databaseAuth = new DatabaseAuth();
  }

  // Middleware to check if user is authenticated
  async requireAuth(req, res, next) {
    try {
      const sessionToken = req.cookies.session_token;

      if (!sessionToken) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const user = await this.databaseAuth.validateSession(sessionToken);

      if (!user) {
        res.clearCookie('session_token');
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired session',
        });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      console.error('❌ Auth middleware error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Middleware to check if user has specific role
  requireRole(requiredRole) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const userRole = req.user.role;
      const roleHierarchy = {
        user: 1,
        moderator: 2,
        admin: 3,
      };

      if (roleHierarchy[userRole] < roleHierarchy[requiredRole]) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
        });
      }

      next();
    };
  }

  // Middleware to check if user is admin
  requireAdmin(req, res, next) {
    return this.requireRole('admin')(req, res, next);
  }

  // Middleware to check if user is moderator or admin
  requireModerator(req, res, next) {
    return this.requireRole('moderator')(req, res, next);
  }

  // Optional authentication - doesn't fail if no session
  async optionalAuth(req, res, next) {
    try {
      const sessionToken = req.cookies.session_token;

      if (sessionToken) {
        const user = await this.databaseAuth.validateSession(sessionToken);
        if (user) {
          req.user = user;
        }
      }

      next();
    } catch (error) {
      console.error('❌ Optional auth middleware error:', error.message);
      next(); // Continue even if there's an error
    }
  }

  // Middleware to check if user owns resource or is admin
  requireOwnershipOrAdmin(resourceUserIdField = 'userId') {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const userRole = req.user.role;
      const userId = req.user.id;
      const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];

      if (userRole === 'admin' || userId.toString() === resourceUserId.toString()) {
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
        });
      }
    };
  }

  // Middleware to check if user has Discord account linked
  requireDiscordLink(req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!req.user.discord_id) {
      return res.status(400).json({
        success: false,
        message: 'Discord account must be linked to access this feature',
      });
    }

    next();
  }

  // Middleware to handle both Discord OAuth and database auth
  async handleDualAuth(req, res, next) {
    try {
      // Check for Discord OAuth session first
      if (req.session && req.session.passport && req.session.passport.user) {
        const discordUser = req.session.passport.user;

        // Try to find linked database user
        const dbUser = await this.databaseAuth.getUserByDiscordId(discordUser.id);

        if (dbUser) {
          req.user = {
            ...dbUser,
            authType: 'discord',
            discordUser,
          };
        } else {
          req.user = {
            id: discordUser.id,
            username: discordUser.username,
            email: null,
            discord_id: discordUser.id,
            role: 'user',
            authType: 'discord',
            discordUser,
          };
        }

        return next();
      }

      // Check for database session
      const sessionToken = req.cookies.session_token;

      if (sessionToken) {
        const user = await this.databaseAuth.validateSession(sessionToken);
        if (user) {
          req.user = {
            ...user,
            authType: 'database',
          };
          return next();
        }
      }

      // No valid session found
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    } catch (error) {
      console.error('❌ Dual auth middleware error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Middleware to clean up expired sessions periodically
  async cleanupSessions(req, res, next) {
    try {
      // Run cleanup every 100 requests (to avoid performance impact)
      if (!global.sessionCleanupCounter) {
        global.sessionCleanupCounter = 0;
      }

      global.sessionCleanupCounter++;

      if (global.sessionCleanupCounter >= 100) {
        global.sessionCleanupCounter = 0;
        await this.databaseAuth.cleanupExpiredSessions();
      }

      next();
    } catch (error) {
      console.error('❌ Session cleanup error:', error.message);
      next(); // Continue even if cleanup fails
    }
  }

  // Get current user info
  async getCurrentUser(req) {
    try {
      // Check Discord OAuth first
      if (req.session && req.session.passport && req.session.passport.user) {
        const discordUser = req.session.passport.user;
        const dbUser = await this.databaseAuth.getUserByDiscordId(discordUser.id);

        return {
          ...dbUser,
          authType: 'discord',
          discordUser,
        };
      }

      // Check database session
      const sessionToken = req.cookies.session_token;

      if (sessionToken) {
        const user = await this.databaseAuth.validateSession(sessionToken);
        if (user) {
          return {
            ...user,
            authType: 'database',
          };
        }
      }

      return null;
    } catch (error) {
      console.error('❌ Get current user error:', error.message);
      return null;
    }
  }

  // Logout user from both auth systems
  async logoutUser(req, res) {
    try {
      // Clear Discord OAuth session
      if (req.session) {
        req.session.destroy();
      }

      // Clear database session
      const sessionToken = req.cookies.session_token;
      if (sessionToken) {
        await this.databaseAuth.destroySession(sessionToken);
      }

      res.clearCookie('session_token');
      res.clearCookie('connect.sid'); // Discord OAuth session cookie

      return true;
    } catch (error) {
      console.error('❌ Logout error:', error.message);
      return false;
    }
  }
}

module.exports = AuthMiddleware;
