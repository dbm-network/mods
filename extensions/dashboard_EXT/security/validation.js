// ========================================
// Input Validation and Sanitization
// ========================================
// Comprehensive input validation to prevent injection attacks

const validator = require('validator');
const xss = require('xss');

class InputValidator {
  constructor() {
    this.setupValidationRules();
  }

  setupValidationRules() {
    this.rules = {
      // Discord ID validation
      discordId: {
        pattern: /^\d{17,19}$/,
        message: 'Invalid Discord ID format',
      },

      // Username validation
      username: {
        minLength: 2,
        maxLength: 32,
        pattern: /^[a-zA-Z0-9._-]+$/,
        message: 'Username must be 2-32 characters, alphanumeric with dots, underscores, or hyphens',
      },

      // Email validation
      email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Invalid email format',
      },

      // URL validation
      url: {
        pattern: /^https?:\/\/.+/,
        message: 'URL must start with http:// or https://',
      },

      // File name validation
      filename: {
        pattern: /^[a-zA-Z0-9._-]+$/,
        message: 'Filename contains invalid characters',
      },

      // Command name validation
      commandName: {
        minLength: 1,
        maxLength: 32,
        pattern: /^[a-zA-Z0-9_-]+$/,
        message: 'Command name must be 1-32 characters, alphanumeric with underscores or hyphens',
      },
    };
  }

  // Sanitize HTML input to prevent XSS
  sanitizeHTML(input) {
    if (typeof input !== 'string') return input;

    const options = {
      whiteList: {
        a: ['href', 'title', 'target'],
        b: [],
        i: [],
        em: [],
        strong: [],
        p: [],
        br: [],
        ul: [],
        ol: [],
        li: [],
        h1: [],
        h2: [],
        h3: [],
        h4: [],
        h5: [],
        h6: [],
      },
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script', 'style'],
    };

    return xss(input, options);
  }

  // Sanitize text input
  sanitizeText(input) {
    if (typeof input !== 'string') return input;

    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/['"]/g, '') // Remove quotes
      .trim();
  }

  // Validate Discord ID
  validateDiscordId(id) {
    if (!id || typeof id !== 'string') {
      return { valid: false, error: 'Discord ID is required' };
    }

    if (!this.rules.discordId.pattern.test(id)) {
      return { valid: false, error: this.rules.discordId.message };
    }

    return { valid: true };
  }

  // Validate username
  validateUsername(username) {
    if (!username || typeof username !== 'string') {
      return { valid: false, error: 'Username is required' };
    }

    const sanitized = this.sanitizeText(username);

    if (sanitized.length < this.rules.username.minLength || sanitized.length > this.rules.username.maxLength) {
      return {
        valid: false,
        error: `Username must be ${this.rules.username.minLength}-${this.rules.username.maxLength} characters`,
      };
    }

    if (!this.rules.username.pattern.test(sanitized)) {
      return { valid: false, error: this.rules.username.message };
    }

    return { valid: true, sanitized };
  }

  // Validate email
  validateEmail(email) {
    if (!email || typeof email !== 'string') {
      return { valid: false, error: 'Email is required' };
    }

    const sanitized = email.trim().toLowerCase();

    if (!validator.isEmail(sanitized)) {
      return { valid: false, error: 'Invalid email format' };
    }

    return { valid: true, sanitized };
  }

  // Validate URL
  validateURL(url) {
    if (!url || typeof url !== 'string') {
      return { valid: false, error: 'URL is required' };
    }

    const sanitized = url.trim();

    if (
      !validator.isURL(sanitized, {
        protocols: ['http', 'https'],
        require_protocol: true,
      })
    ) {
      return { valid: false, error: 'Invalid URL format' };
    }

    return { valid: true, sanitized };
  }

  // Validate callback URL
  validateCallbackURL(url) {
    const urlValidation = this.validateURL(url);
    if (!urlValidation.valid) {
      return urlValidation;
    }

    const allowedDomains = ['localhost', '127.0.0.1', '207.180.193.210'];

    try {
      const urlObj = new URL(urlValidation.sanitized);
      const isAllowed = allowedDomains.some(
        (domain) => urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`),
      );

      if (!isAllowed) {
        return {
          valid: false,
          error: 'Callback URL must be from an allowed domain',
        };
      }

      return { valid: true, sanitized: urlValidation.sanitized };
    } catch {
      return { valid: false, error: 'Invalid URL format' };
    }
  }

  // Validate command name
  validateCommandName(name) {
    if (!name || typeof name !== 'string') {
      return { valid: false, error: 'Command name is required' };
    }

    const sanitized = this.sanitizeText(name);

    if (sanitized.length < this.rules.commandName.minLength || sanitized.length > this.rules.commandName.maxLength) {
      return {
        valid: false,
        error: `Command name must be ${this.rules.commandName.minLength}-${this.rules.commandName.maxLength} characters`,
      };
    }

    if (!this.rules.commandName.pattern.test(sanitized)) {
      return { valid: false, error: this.rules.commandName.message };
    }

    return { valid: true, sanitized };
  }

  // Validate file upload
  validateFileUpload(file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif']) {
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { valid: false, error: 'File size too large (max 5MB)' };
    }

    // Check file type
    if (!allowedTypes.includes(file.mimetype)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`,
      };
    }

    // Validate filename
    const filenameValidation = this.validateFilename(file.originalname);
    if (!filenameValidation.valid) {
      return filenameValidation;
    }

    return { valid: true, sanitized: filenameValidation.sanitized };
  }

  // Validate filename
  validateFilename(filename) {
    if (!filename || typeof filename !== 'string') {
      return { valid: false, error: 'Filename is required' };
    }

    const sanitized = this.sanitizeText(filename);

    if (!this.rules.filename.pattern.test(sanitized)) {
      return { valid: false, error: this.rules.filename.message };
    }

    return { valid: true, sanitized };
  }

  // Validate JSON input
  validateJSON(input) {
    if (typeof input === 'object') {
      return { valid: true, sanitized: input };
    }

    if (typeof input !== 'string') {
      return { valid: false, error: 'Invalid JSON input' };
    }

    try {
      const parsed = JSON.parse(input);
      return { valid: true, sanitized: parsed };
    } catch {
      return { valid: false, error: 'Invalid JSON format' };
    }
  }

  // Validate and sanitize request body
  validateRequestBody(body, schema) {
    const errors = [];
    const sanitized = {};

    for (const [field, rules] of Object.entries(schema)) {
      const value = body[field];

      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        continue;
      }

      if (value !== undefined && value !== null && value !== '') {
        let validation;

        switch (rules.type) {
          case 'discordId':
            validation = this.validateDiscordId(value);
            break;
          case 'username':
            validation = this.validateUsername(value);
            break;
          case 'email':
            validation = this.validateEmail(value);
            break;
          case 'url':
            validation = this.validateURL(value);
            break;
          case 'callbackURL':
            validation = this.validateCallbackURL(value);
            break;
          case 'commandName':
            validation = this.validateCommandName(value);
            break;
          case 'text':
            sanitized[field] = this.sanitizeText(value);
            continue;
          case 'html':
            sanitized[field] = this.sanitizeHTML(value);
            continue;
          case 'json':
            validation = this.validateJSON(value);
            break;
          default:
            sanitized[field] = value;
            continue;
        }

        if (validation && !validation.valid) {
          errors.push(validation.error);
        } else if (validation && validation.sanitized !== undefined) {
          sanitized[field] = validation.sanitized;
        } else {
          sanitized[field] = value;
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      sanitized,
    };
  }

  // Middleware for request validation
  validateRequest(schema) {
    return (req, res, next) => {
      const validation = this.validateRequestBody(req.body, schema);

      if (!validation.valid) {
        return res.status(400).json({
          error: 'Validation failed',
          details: validation.errors,
        });
      }

      req.body = validation.sanitized;
      next();
    };
  }

  // Check for SQL injection patterns
  detectSQLInjection(input) {
    if (typeof input !== 'string') return false;

    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
      /(\b(OR|AND)\s+['"]\s*=\s*['"])/i,
      /(UNION\s+SELECT)/i,
      /(DROP\s+TABLE)/i,
      /(INSERT\s+INTO)/i,
      /(UPDATE\s+SET)/i,
      /(DELETE\s+FROM)/i,
    ];

    return sqlPatterns.some((pattern) => pattern.test(input));
  }

  // Check for XSS patterns
  detectXSS(input) {
    if (typeof input !== 'string') return false;

    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /<object[^>]*>.*?<\/object>/gi,
      /<embed[^>]*>.*?<\/embed>/gi,
      /<link[^>]*>.*?<\/link>/gi,
      /<meta[^>]*>.*?<\/meta>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<[^>]*on\w+\s*=[^>]*>/gi,
    ];

    return xssPatterns.some((pattern) => pattern.test(input));
  }

  // Comprehensive input sanitization
  sanitizeInput(input, type = 'text') {
    if (typeof input !== 'string') return input;

    // Check for malicious patterns
    if (this.detectSQLInjection(input)) {
      console.warn('Potential SQL injection detected:', input.substring(0, 100));
      return '';
    }

    if (this.detectXSS(input)) {
      console.warn('Potential XSS detected:', input.substring(0, 100));
      return '';
    }

    // Apply appropriate sanitization
    switch (type) {
      case 'html':
        return this.sanitizeHTML(input);
      case 'url':
        return this.sanitizeText(input);
      case 'json':
        const jsonValidation = this.validateJSON(input);
        return jsonValidation.valid ? jsonValidation.sanitized : null;
      default:
        return this.sanitizeText(input);
    }
  }
}

module.exports = new InputValidator();
