// ========================================
// Security Middleware
// ========================================
// Comprehensive security middleware for the dashboard

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const crypto = require('crypto');
const config = require('./config');

class SecurityMiddleware {
  constructor() {
    this.securityConfig = config.get('security') || {};
    this.setupRateLimit();
    this.setupSecurityHeaders();
  }

  setupRateLimit() {
    this.rateLimiter = rateLimit({
      windowMs: 60000, // 1 minute window
      max: 1000, // Allow 1000 requests per minute (very generous for dashboard)
      message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: 60,
      },
      standardHeaders: true,
      legacyHeaders: false,
      skip: (req) => {
        // Skip rate limiting for static assets
        return req.path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/);
      },
      handler: (req, res) => {
        console.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
          error: 'Too many requests',
          retryAfter: 60,
        });
      },
    });
  }

  setupSecurityHeaders() {
    const hstsOptions = {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    };

    this.hstsEnabled = Boolean(this.securityConfig.hsts);
    this.trustProxyHttpsHeader = this.securityConfig.trustProxyHttpsHeader !== false;
    this.hstsMiddleware = helmet.hsts(hstsOptions);

    const cspDirectives = {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        'https://unpkg.com',
        'https://code.jquery.com',
        'https://cdn.jsdelivr.net',
        'https://cdnjs.cloudflare.com',
        'https://maxcdn.bootstrapcdn.com',
        'https://stackpath.bootstrapcdn.com',
        'https://kit.fontawesome.com',
        'https://static.cloudflareinsights.com',
        'https://dashboard.newstargeted.com',
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://unpkg.com',
        'https://fonts.googleapis.com',
        'https://cdnjs.cloudflare.com',
        'https://maxcdn.bootstrapcdn.com',
        'https://stackpath.bootstrapcdn.com',
        'https://use.fontawesome.com',
      ],
      imgSrc: ["'self'", 'data:', 'https:', 'https://cdn.discordapp.com'],
      connectSrc: [
        "'self'",
        'https://discord.com',
        'https://cdn.discordapp.com',
        'https://ka-f.fontawesome.com',
        'https://stats.g.doubleclick.net',
        'https://a.nel.cloudflare.com',
        'https://dashboard.newstargeted.com',
      ],
      fontSrc: [
        "'self'",
        'data:',
        'https://unpkg.com',
        'https://fonts.gstatic.com',
        'https://cdnjs.cloudflare.com',
        'https://use.fontawesome.com',
        'https://ka-f.fontawesome.com',
      ],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      scriptSrcAttr: ["'none'"], // Block inline event handlers
    };

    if (this.hstsEnabled) {
      cspDirectives.upgradeInsecureRequests = [];
    } else {
      cspDirectives.upgradeInsecureRequests = null;
    }

    this.securityHeaders = helmet({
      contentSecurityPolicy: {
        directives: cspDirectives,
      },
      hsts: false,
      crossOriginOpenerPolicy: false,
      xssFilter: true,
      noSniff: true,
      frameguard: { action: 'deny' },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    });

    this.originAgentCluster = (req, res, next) => {
      res.setHeader('Origin-Agent-Cluster', '?0');
      next();
    };

    this.conditionalHsts = (req, res, next) => {
      if (this.shouldApplyHsts(req)) {
        return this.hstsMiddleware(req, res, next);
      }
      return next();
    };
  }

  shouldApplyHsts(req) {
    if (!this.hstsEnabled) {
      return false;
    }

    if (req.secure) {
      return true;
    }

    if (!this.trustProxyHttpsHeader) {
      return false;
    }

    const forwardedProtoHeader = req.headers['x-forwarded-proto'];
    if (!forwardedProtoHeader) {
      return false;
    }

    const firstValue = Array.isArray(forwardedProtoHeader) ? forwardedProtoHeader[0] : forwardedProtoHeader;

    if (!firstValue) {
      return false;
    }

    const normalized = firstValue.split(',')[0].trim().toLowerCase();
    return normalized === 'https';
  }

  // Input validation and sanitization
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;

    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  // Validate Discord user ID
  validateDiscordId(id) {
    const discordIdRegex = /^\d{17,19}$/;
    return discordIdRegex.test(id);
  }

  // Validate callback URL
  validateCallbackURL(url) {
    const allowedDomains = ['localhost', '127.0.0.1', '207.180.193.210'];

    try {
      const urlObj = new URL(url);
      return allowedDomains.some((domain) => urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`));
    } catch {
      return false;
    }
  }

  // CSRF protection
  generateCSRFToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  validateCSRFToken(token, sessionToken) {
    return token && sessionToken && token === sessionToken;
  }

  // Authentication middleware
  requireAuth(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
      return next();
    }

    // Log unauthorized access attempt
    console.warn(`Unauthorized access attempt from IP: ${req.ip} to ${req.path}`);

    res.status(401).json({
      error: 'Authentication required',
      redirect: '/dashboard/login',
    });
  }

  // Admin authorization middleware
  requireAdmin(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({
        error: 'Authentication required',
      });
    }

    const user = req.user;
    const ownerIds = config.get('ownerIds');

    if (!ownerIds.includes(user.id)) {
      console.warn(`Unauthorized admin access attempt by user ${user.id} from IP: ${req.ip}`);
      return res.status(403).json({
        error: 'Admin access required',
      });
    }

    next();
  }

  // Log security events
  logSecurityEvent(event, details) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      event,
      details,
      level: 'security',
    };

    console.log(`[SECURITY] ${JSON.stringify(logEntry)}`);

    // In production, you might want to send this to a security monitoring service
    if (config.isProduction()) {
      // Send to security monitoring service
      this.sendToSecurityMonitoring(logEntry);
    }
  }

  sendToSecurityMonitoring(logEntry) {
    // Implement security monitoring service integration
    // This could be sent to services like Sentry, DataDog, etc.
  }

  // Error handling middleware
  handleError(err, req, res, next) {
    console.error('Dashboard error:', err);

    // Don't expose internal errors in production
    const isDevelopment = !config.isProduction();

    res.status(500).json({
      error: isDevelopment ? err.message : 'Internal server error',
      ...(isDevelopment && { stack: err.stack }),
    });
  }

  // Request logging middleware
  logRequest(req, res, next) {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      const logData = {
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      };

      console.log(`[REQUEST] ${JSON.stringify(logData)}`);
    });

    next();
  }

  // Get all middleware
  getAllMiddleware() {
    return {
      rateLimiter: this.rateLimiter,
      securityHeaders: this.securityHeaders,
      originAgentCluster: this.originAgentCluster,
      conditionalHsts: this.conditionalHsts,
      requireAuth: this.requireAuth.bind(this),
      requireAdmin: this.requireAdmin.bind(this),
      handleError: this.handleError.bind(this),
      logRequest: this.logRequest.bind(this),
    };
  }
}

module.exports = new SecurityMiddleware();
