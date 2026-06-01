// ========================================
// Secure Config Protection System
// ========================================
// Comprehensive protection against configuration secret exposure

const fs = require('fs');
const path = require('path');

class ConfigProtection {
  constructor() {
    this.configPath = path.join(__dirname, '../../../config.php');
    this.backupPath = path.join(__dirname, '../../../config.php.backup');
    this.protectedPaths = [
      'config.php',
      'config/config.php',
      '*.secret.php',
      'secrets',
      'secure-config',
      'private-config',
    ];
  }

  // Block all secure config access
  blockConfigAccess() {
    return (req, res, next) => {
      const requestedPath = req.path.toLowerCase();

      // Check if request is for any secure configuration path
      const isConfigRequest = this.protectedPaths.some((pattern) => {
        if (pattern.includes('*')) {
          const regex = new RegExp(pattern.replace(/\*/g, '.*'));
          return regex.test(requestedPath);
        }
        return requestedPath.includes(pattern);
      });

      if (isConfigRequest) {
        // Log potential security breach
        console.warn(`🚨 BLOCKED secure config access attempt from ${req.ip} to ${req.path}`);

        // Return 404 to hide the file existence
        return res.status(404).json({
          error: 'Not Found',
          message: 'The requested resource was not found',
        });
      }

      next();
    };
  }

  // Create secure configuration backup
  createSecureBackup() {
    try {
      if (!fs.existsSync(this.configPath)) {
        console.info('ℹ️ config.php file not present; backup skipped.');
        return true;
      }

      // Read original config file
      const configContent = fs.readFileSync(this.configPath, 'utf8');

      // Create encrypted backup
      const encryptedContent = this.encryptContent(configContent);

      // Write backup with restricted permissions
      fs.writeFileSync(this.backupPath, encryptedContent, { mode: 0o600 });

      console.log('✅ Secure configuration backup created');
      return true;
    } catch (error) {
      console.error('❌ Failed to create configuration backup:', error.message);
      return false;
    }
  }

  // Restore from backup
  restoreFromBackup() {
    try {
      if (!fs.existsSync(this.backupPath)) {
        console.info('ℹ️ config.php.backup file not found; no restore required.');
        return false;
      }

      // Read encrypted backup
      const encryptedContent = fs.readFileSync(this.backupPath, 'utf8');

      // Decrypt content
      const decryptedContent = this.decryptContent(encryptedContent);

      // Write to config.php file
      fs.writeFileSync(this.configPath, decryptedContent, { mode: 0o600 });

      console.log('✅ config.php restored from backup');
      return true;
    } catch (error) {
      console.error('❌ Failed to restore configuration from backup:', error.message);
      return false;
    }
  }

  // Encrypt content
  encryptContent(content) {
    try {
      // Use simple base64 encoding for compatibility
      const encrypted = Buffer.from(content).toString('base64');
      return JSON.stringify({
        encrypted,
        method: 'base64',
        timestamp: Date.now(),
      });
    } catch (error) {
      console.warn('⚠️ Encryption failed:', error.message);
      return JSON.stringify({
        encrypted: content,
        method: 'plain',
        timestamp: Date.now(),
      });
    }
  }

  // Decrypt content
  decryptContent(encryptedData) {
    try {
      const data = JSON.parse(encryptedData);

      // Handle different encryption methods
      if (data.method === 'base64') {
        return Buffer.from(data.encrypted, 'base64').toString('utf8');
      } else if (data.method === 'plain') {
        return data.encrypted;
      }
      // Legacy support - try base64 first
      try {
        return Buffer.from(data.encrypted, 'base64').toString('utf8');
      } catch (e) {
        return data.encrypted;
      }
    } catch (error) {
      console.warn('⚠️ Decryption failed, returning raw data:', error.message);
      return encryptedData;
    }
  }

  // Secure configuration file permissions
  secureConfigPermissions() {
    try {
      if (fs.existsSync(this.configPath)) {
        // Set restrictive permissions (owner read/write only)
        fs.chmodSync(this.configPath, 0o600);
        console.log('✅ config.php permissions secured');
      } else {
        console.info('ℹ️ config.php not detected; permissions hardening skipped.');
      }

      if (fs.existsSync(this.backupPath)) {
        // Set restrictive permissions for backup
        fs.chmodSync(this.backupPath, 0o600);
        console.log('✅ config.php.backup permissions secured');
      } else {
        console.info('ℹ️ config.php.backup not detected; no permissions update necessary.');
      }
    } catch (error) {
      console.error('❌ Failed to secure file permissions:', error.message);
    }
  }

  // Add secure config protection headers
  addProtectionHeaders() {
    return (req, res, next) => {
      // Add headers to prevent config file caching
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

      // Block config files in robots.txt
      if (req.path === '/robots.txt') {
        res.setHeader('Content-Type', 'text/plain');
        res.send(`User-agent: *
Disallow: /config.php
Disallow: /config/config.php
Disallow: /config/
Disallow: /logs/
Disallow: /uploads/
Disallow: /node_modules/`);
        return;
      }

      next();
    };
  }

  // Create .htaccess for Apache servers
  createHtaccess() {
    const htaccessContent = `# ========================================
# Secure Config Protection for Apache
# ========================================

# Block access to secure configuration files
<Files "config.php">
    Order allow,deny
    Deny from all
</Files>

# Block access to backup files
<Files "config.php.backup">
    Order allow,deny
    Deny from all
</Files>

# Block access to config files
<Files "config.json">
    Order allow,deny
    Deny from all
</Files>

# Block access to log files
<Files "*.log">
    Order allow,deny
    Deny from all
</Files>

# Block access to sensitive directories
<Directory "logs">
    Order allow,deny
    Deny from all
</Directory>

<Directory "uploads">
    Order allow,deny
    Deny from all
</Directory>

<Directory "node_modules">
    Order allow,deny
    Deny from all
</Directory>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Content-Security-Policy "default-src 'self'"
</IfModule>

# Disable server signature
ServerSignature Off

# Hide secure configuration files from directory listings
IndexIgnore config.php config.php.backup
IndexIgnore *.backup
IndexIgnore *.log
IndexIgnore config.json`;

    const htaccessPath = path.join(__dirname, '../../../.htaccess');
    fs.writeFileSync(htaccessPath, htaccessContent);
    console.log('✅ .htaccess file created for Apache protection');
  }

  // Create web.config for IIS servers
  createWebConfig() {
    const webConfigContent = `<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <security>
            <requestFiltering>
                <hiddenSegments>
                    <add segment="config.php" />
                    <add segment="config" />
                    <add segment="*.backup" />
                    <add segment="*.log" />
                    <add segment="config.json" />
                </hiddenSegments>
                <denyUrlSequences>
                    <add sequence="config.php" />
                    <add sequence="config.json" />
                    <add sequence="*.log" />
                </denyUrlSequences>
            </requestFiltering>
        </security>
        <httpProtocol>
            <customHeaders>
                <add name="X-Content-Type-Options" value="nosniff" />
                <add name="X-Frame-Options" value="DENY" />
                <add name="X-XSS-Protection" value="1; mode=block" />
                <add name="Referrer-Policy" value="strict-origin-when-cross-origin" />
            </customHeaders>
        </httpProtocol>
    </system.webServer>
</configuration>`;

    const webConfigPath = path.join(__dirname, '../../../web.config');
    fs.writeFileSync(webConfigPath, webConfigContent);
    console.log('✅ web.config file created for IIS protection');
  }

  // Create nginx configuration snippet
  createNginxConfig() {
    const nginxConfigContent = `# ========================================
# Secure Config Protection for Nginx
# ========================================

# Block access to secure configuration files
location ~* \/config\.php$ {
    deny all;
    return 404;
}

location ~* \/config\.php\.backup$ {
    deny all;
    return 404;
}

# Block access to backup files
location ~ \.backup$ {
    deny all;
    return 404;
}

# Block access to log files
location ~ \.log$ {
    deny all;
    return 404;
}

# Block access to config files
location ~ /config\.json$ {
    deny all;
    return 404;
}

# Block access to sensitive directories
location ~ ^/(logs|uploads|node_modules)/ {
    deny all;
    return 404;
}

# Security headers
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options DENY;
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Content-Security-Policy "default-src 'self'";`;

    const nginxConfigPath = path.join(__dirname, '../../../nginx-config-protection.conf');
    fs.writeFileSync(nginxConfigPath, nginxConfigContent);
    console.log('✅ nginx-config-protection.conf file created');
  }

  // Monitor for secure configuration access attempts
  monitorConfigAccess() {
    return (req, res, next) => {
      const requestedPath = req.path.toLowerCase();

      if (requestedPath.includes('config.php') || requestedPath.includes('config.json')) {
        // Log security event
        const securityEvent = {
          timestamp: new Date().toISOString(),
          type: 'CONFIG_ACCESS_ATTEMPT',
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          path: req.path,
          method: req.method,
          headers: req.headers,
        };

        console.warn(
          '🚨 SECURITY ALERT - Secure configuration access attempt:',
          JSON.stringify(securityEvent, null, 2),
        );

        // In production, you might want to send this to a security monitoring service
        this.sendSecurityAlert(securityEvent);
      }

      next();
    };
  }

  // Send security alert (implement based on your monitoring system)
  sendSecurityAlert(event) {
    // This could send alerts to:
    // - Security monitoring service (Sentry, DataDog, etc.)
    // - Email notifications
    // - Discord webhook
    // - Slack webhook
    console.log('🔔 Security alert would be sent here:', event.type);
  }

  // Initialize all protection measures
  initializeProtection() {
    console.log('🔒 Initializing secure configuration protection...');

    // Create secure backup
    this.createSecureBackup();

    // Secure file permissions
    this.secureConfigPermissions();

    // Create server configuration files
    this.createHtaccess();
    this.createWebConfig();
    this.createNginxConfig();

    return [this.blockConfigAccess(), this.addProtectionHeaders(), this.monitorConfigAccess()];
  }

  // Get all protection middleware
  getAllProtectionMiddleware() {
    return [this.blockConfigAccess(), this.addProtectionHeaders(), this.monitorConfigAccess()];
  }
}

module.exports = new ConfigProtection();
console.log('✅ Secure configuration protection initialized');
