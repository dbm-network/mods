// ========================================
// Secure File Upload Handler
// ========================================
// Secure file upload handling with validation and sanitization

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const validator = require('./validation');

class SecureFileUpload {
  constructor() {
    this.setupStorage();
    this.setupFilters();
  }

  setupStorage() {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Configure multer storage
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(uploadsDir, 'dashboard');
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        // Generate secure filename
        const ext = path.extname(file.originalname);
        const name = crypto.randomBytes(16).toString('hex');
        const sanitizedName = validator.sanitizeText(file.originalname.replace(ext, ''));
        cb(null, `${sanitizedName}-${name}${ext}`);
      },
    });
  }

  setupFilters() {
    // Allowed file types
    this.allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'text/plain',
      'application/json',
      'text/csv',
    ];

    // File size limits (5MB for images, 1MB for others)
    this.maxFileSize = 5 * 1024 * 1024; // 5MB
    this.maxTextFileSize = 1 * 1024 * 1024; // 1MB

    // File filter
    this.fileFilter = (req, file, cb) => {
      // Check MIME type
      if (!this.allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error(`File type ${file.mimetype} not allowed`), false);
      }

      // Check file size based on type
      const isImage = file.mimetype.startsWith('image/');
      const _maxSize = isImage ? this.maxFileSize : this.maxTextFileSize;

      // Note: File size check will be done in the upload handler (limits use this.maxFileSize / _maxSize context)
      // as multer doesn't provide file size in the filter

      cb(null, true);
    };
  }

  // Get multer configuration
  getMulterConfig() {
    return {
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: {
        fileSize: this.maxFileSize,
        files: 5, // Max 5 files per request
        fieldSize: 1024 * 1024, // 1MB for form fields
      },
    };
  }

  // Validate uploaded file
  validateFile(file) {
    const errors = [];

    // Check if file exists
    if (!file) {
      errors.push('No file provided');
      return { valid: false, errors };
    }

    // Check file size
    const isImage = file.mimetype.startsWith('image/');
    const maxSize = isImage ? this.maxFileSize : this.maxTextFileSize;

    if (file.size > maxSize) {
      errors.push(`File too large. Max size: ${Math.round(maxSize / 1024 / 1024)}MB`);
    }

    // Check MIME type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      errors.push(`File type ${file.mimetype} not allowed`);
    }

    // Validate filename
    const filenameValidation = validator.validateFilename(file.originalname);
    if (!filenameValidation.valid) {
      errors.push(filenameValidation.error);
    }

    // Check for malicious content in filename
    if (validator.detectXSS(file.originalname)) {
      errors.push('Filename contains potentially malicious content');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Scan file for malicious content
  async scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // Check for common malicious patterns
      const maliciousPatterns = [
        /<script[^>]*>.*?<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /eval\s*\(/gi,
        /document\.cookie/gi,
        /document\.write/gi,
        /window\.location/gi,
      ];

      for (const pattern of maliciousPatterns) {
        if (pattern.test(content)) {
          return {
            safe: false,
            reason: 'Potentially malicious content detected',
          };
        }
      }

      return { safe: true };
    } catch (error) {
      return {
        safe: false,
        reason: 'Unable to scan file content',
      };
    }
  }

  // Clean up uploaded file
  cleanupFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
    } catch (error) {
      console.error('Error cleaning up file:', error);
    }
    return false;
  }

  // Get file info
  getFileInfo(file) {
    return {
      originalName: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      uploadedAt: new Date().toISOString(),
    };
  }

  // Middleware for file upload
  uploadMiddleware(fieldName = 'file') {
    const upload = multer(this.getMulterConfig());

    return (req, res, next) => {
      upload.single(fieldName)(req, res, (err) => {
        if (err) {
          console.error('File upload error:', err);
          return res.status(400).json({
            error: 'File upload failed',
            details: err.message,
          });
        }

        // Validate uploaded file
        if (req.file) {
          const validation = this.validateFile(req.file);
          if (!validation.valid) {
            // Clean up invalid file
            this.cleanupFile(req.file.path);
            return res.status(400).json({
              error: 'File validation failed',
              details: validation.errors,
            });
          }

          // Add file info to request
          req.fileInfo = this.getFileInfo(req.file);
        }

        next();
      });
    };
  }

  // Middleware for multiple file uploads
  uploadMultipleMiddleware(fieldName = 'files', maxCount = 5) {
    const upload = multer(this.getMulterConfig());

    return (req, res, next) => {
      upload.array(fieldName, maxCount)(req, res, (err) => {
        if (err) {
          console.error('File upload error:', err);
          return res.status(400).json({
            error: 'File upload failed',
            details: err.message,
          });
        }

        // Validate all uploaded files
        if (req.files && req.files.length > 0) {
          const validFiles = [];
          const errors = [];

          for (const file of req.files) {
            const validation = this.validateFile(file);
            if (validation.valid) {
              validFiles.push(this.getFileInfo(file));
            } else {
              errors.push(...validation.errors);
              // Clean up invalid file
              this.cleanupFile(file.path);
            }
          }

          if (errors.length > 0) {
            return res.status(400).json({
              error: 'File validation failed',
              details: errors,
            });
          }

          req.filesInfo = validFiles;
        }

        next();
      });
    };
  }

  // Secure file serving
  serveFile(filePath, res) {
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }

      // Get file stats
      const stats = fs.statSync(filePath);

      // Set appropriate headers
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Length', stats.size);
      res.setHeader('Content-Disposition', 'attachment');

      // Security headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');

      // Stream file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error('Error serving file:', error);
      res.status(500).json({ error: 'Error serving file' });
    }
  }

  // Clean up old files (run periodically)
  cleanupOldFiles(maxAge = 24 * 60 * 60 * 1000) {
    // 24 hours
    const uploadsDir = path.join(__dirname, '../../../uploads/dashboard');

    if (!fs.existsSync(uploadsDir)) return;

    try {
      const files = fs.readdirSync(uploadsDir);
      const now = Date.now();

      for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);

        if (now - stats.mtime.getTime() > maxAge) {
          fs.unlinkSync(filePath);
          console.log(`Cleaned up old file: ${file}`);
        }
      }
    } catch (error) {
      console.error('Error cleaning up old files:', error);
    }
  }
}

module.exports = new SecureFileUpload();
