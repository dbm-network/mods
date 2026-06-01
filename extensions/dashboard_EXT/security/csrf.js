// ========================================
// CSRF Protection System
// ========================================
// Comprehensive CSRF protection for the dashboard

const crypto = require('crypto');
const config = require('./config');

class CSRFProtection {
  constructor() {
    this.tokens = new Map(); // Store active tokens
    this.cleanupInterval = 15 * 60 * 1000; // 15 minutes
    this.tokenExpiry = 60 * 60 * 1000; // 1 hour

    // Start cleanup interval
    this.startCleanup();
  }

  // Generate a secure CSRF token
  generateToken(sessionId, context = {}) {
    const timestamp = Date.now();
    const randomBytes = crypto.randomBytes(32);
    const data = `${sessionId}:${timestamp}:${randomBytes.toString('hex')}`;
    const token = crypto.createHmac('sha256', config.get('jwtSecret')).update(data).digest('hex');

    // Store token with expiry
    this.tokens.set(token, {
      sessionId,
      timestamp,
      expires: timestamp + this.tokenExpiry,
      ip: context.ip || null,
      userAgent: context.userAgent || null,
    });

    return token;
  }

  // Verify CSRF token
  verifyToken(token, sessionId) {
    if (!token || !sessionId) {
      return { valid: false, error: 'Token or session ID missing' };
    }

    const tokenData = this.tokens.get(token);
    if (!tokenData) {
      return { valid: false, error: 'Invalid token' };
    }

    // Check if token has expired
    if (Date.now() > tokenData.expires) {
      this.tokens.delete(token);
      return { valid: false, error: 'Token expired' };
    }

    // Check if session ID matches
    if (tokenData.sessionId !== sessionId) {
      return { valid: false, error: 'Session mismatch' };
    }

    return { valid: true };
  }

  // Middleware to generate CSRF token
  generateTokenMiddleware() {
    return (req, res, next) => {
      let issuedToken = null;

      if (req.session && req.sessionID) {
        issuedToken = this.generateToken(req.sessionID, {
          ip: req.ip,
          userAgent: req.get ? req.get('User-Agent') : null,
        });

        try {
          if (!Array.isArray(req.session._csrfTokens)) {
            req.session._csrfTokens = [];
          }
          req.session._csrfTokens.push({
            token: issuedToken,
            ts: Date.now(),
          });
          if (req.session._csrfTokens.length > 10) {
            req.session._csrfTokens = req.session._csrfTokens.slice(-10);
          }
          req.session._csrfLastIssued = Date.now();
          req.session.csrfToken = issuedToken;
          if (typeof req.session.touch === 'function') {
            req.session.touch();
          }
        } catch (sessionError) {
          console.warn('[CSRF] Unable to persist session metadata:', sessionError.message);
        }
      }

      if (!issuedToken) {
        issuedToken = this.createStatelessTokenFromRequest(req);
      }

      if (issuedToken) {
        req.csrfToken = issuedToken;
        res.locals.csrfToken = issuedToken;
      }

      next();
    };
  }

  // Middleware to verify CSRF token
  verifyTokenMiddleware() {
    return (req, res, next) => {
      const method = (req.method || 'GET').toUpperCase();

      if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
        return next();
      }

      if (req.path.startsWith('/shared/') || req.path.startsWith('/public/')) {
        return next();
      }

      // CSRF protection applies to all state-changing requests, including authenticated API routes
      const body = req.body || {};
      const token = body._csrf || req.headers['x-csrf-token'];
      const sessionId = req.sessionID;

      let verification = this.verifyToken(token, sessionId);

      if (!verification.valid && req.session && Array.isArray(req.session._csrfTokens)) {
        const matchedToken = req.session._csrfTokens.find((entry) => entry.token === token);
        if (matchedToken) {
          verification = { valid: true };
          // Rotate token list to prevent replay
          req.session._csrfTokens = req.session._csrfTokens.filter((entry) => entry.token !== token);
        }
      }

      if (!verification.valid && token) {
        const tokenData = this.tokens.get(token);
        if (tokenData) {
          const ipMatch = tokenData.ip && tokenData.ip === req.ip;
          const uaMatch = tokenData.userAgent && tokenData.userAgent === (req.get ? req.get('User-Agent') : null);
          if (ipMatch || uaMatch) {
            verification = { valid: true };
          }
        }
      }

      if (!verification.valid && token) {
        const statelessToken = this.createStatelessTokenFromRequest(req);
        if (statelessToken && statelessToken === token) {
          verification = { valid: true };
        }
      }

      if (!verification.valid) {
        // Only log CSRF failures for legitimate user requests, not bots/scanners
        const userAgent = req.headers['user-agent'] || '';
        const isBot =
          userAgent.includes('Go-http-client') ||
          userAgent.includes('bot') ||
          userAgent.includes('scanner') ||
          userAgent.includes('crawler') ||
          userAgent.includes('spider');

        if (!isBot) {
          console.warn(`CSRF token verification failed for ${req.ip}: ${verification.error}`);
        }
        return res.status(403).json({
          error: 'CSRF token verification failed',
          details: verification.error,
        });
      }

      next();
    };
  }

  // Clean up expired tokens
  cleanup() {
    const now = Date.now();
    for (const [token, data] of this.tokens.entries()) {
      if (now > data.expires) {
        this.tokens.delete(token);
      }
    }
  }

  // Start cleanup interval
  startCleanup() {
    setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  // Get token count (for monitoring)
  getTokenCount() {
    return this.tokens.size;
  }

  // Clear all tokens (for testing)
  clearAllTokens() {
    this.tokens.clear();
  }

  // Generate token for specific session
  getTokenForSession(sessionId, context = {}) {
    return this.generateToken(sessionId, context);
  }

  // Revoke token
  revokeToken(token) {
    return this.tokens.delete(token);
  }

  // Revoke all tokens for a session
  revokeSessionTokens(sessionId) {
    for (const [token, data] of this.tokens.entries()) {
      if (data.sessionId === sessionId) {
        this.tokens.delete(token);
      }
    }
  }

  createStatelessToken(ip, userAgent) {
    const secret = config.get('tokenSecret') || config.get('sessionSecret');
    if (!secret) {
      return null;
    }

    const normalizedIp = (ip || '').toString().trim() || 'unknown-ip';
    const normalizedUa = (userAgent || '').toString().trim() || 'unknown-ua';

    return crypto.createHmac('sha256', secret).update(`${normalizedIp}::${normalizedUa}`).digest('hex');
  }

  createStatelessTokenFromRequest(req) {
    if (!req) {
      return null;
    }
    const userAgent =
      (req.get && req.get('User-Agent')) ||
      (req.headers && (req.headers['user-agent'] || req.headers['User-Agent'])) ||
      '';
    return this.createStatelessToken(req.ip, userAgent);
  }
}

module.exports = new CSRFProtection();
