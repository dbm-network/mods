// ========================================
// Secure Configuration Checker
// ========================================
// Ensures config.php is properly secured and not exposed

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class ConfigSecurityChecker {
  constructor() {
    this.configPath = path.join(__dirname, '../../../config.php');
    this.gitignorePath = path.join(__dirname, '../../../.gitignore');
    this.placeholderPatterns = [
      /your_bot_token_here/i,
      /your_client_id_here/i,
      /your_client_secret_here/i,
      /your_database_password_here/i,
      /change_me/i,
    ];
    this.weakSecretPatterns = [
      /(['"])(password|123456|admin|secret)\1/i,
      /define\(['"]JWT_SECRET['"],\s*['"](?:password|123456|admin)['"]\)/i,
      /define\(['"]ENCRYPTION_KEY['"],\s*['"](?:password|123456|admin)['"]\)/i,
    ];
  }

  checkConfigSecurity() {
    const issues = [];

    if (!fs.existsSync(this.configPath)) {
      issues.push({
        level: 'error',
        message: 'config.php file not found.',
        action: 'Create config.php using the secure template and store credentials there.',
      });
      return issues;
    }

    if (process.platform !== 'win32') {
      const stats = fs.statSync(this.configPath);
      const mode = stats.mode & parseInt('777', 8);
      if (mode > parseInt('600', 8)) {
        issues.push({
          level: 'warning',
          message: 'config.php has overly permissive permissions',
          action: 'Run: chmod 600 config.php',
        });
      }
    }

    this.ensureGitignoreEntry(issues);

    const configContent = fs.readFileSync(this.configPath, 'utf8');
    if (this.placeholderPatterns.some((pattern) => pattern.test(configContent))) {
      issues.push({
        level: 'error',
        message: 'Placeholder values detected in config.php',
        action: 'Replace placeholder credentials with actual secure values.',
      });
    }

    if (this.weakSecretPatterns.some((pattern) => pattern.test(configContent))) {
      issues.push({
        level: 'warning',
        message: 'Weak secrets detected in config.php',
        action: 'Use strong, randomly generated secrets for tokens and passwords.',
      });
    }

    if (!/define\(['"]DB_PASSWORD['"],\s*['"][^'"]+['"]\)/i.test(configContent)) {
      issues.push({
        level: 'warning',
        message: 'Database password not set in config.php',
        action: 'Confirm database credentials are defined within config.php.',
      });
    }

    return issues;
  }

  ensureGitignoreEntry(issues) {
    if (fs.existsSync(this.gitignorePath)) {
      const gitignoreContent = fs.readFileSync(this.gitignorePath, 'utf8');
      if (!gitignoreContent.includes('config.php')) {
        issues.push({
          level: 'error',
          message: 'config.php is not excluded from version control.',
          action: 'Add "config.php" to .gitignore.',
        });
      }
    } else {
      issues.push({
        level: 'warning',
        message: '.gitignore file not found.',
        action: 'Create .gitignore and add config.php to the ignored list.',
      });
    }
  }

  generateSecureConfigTemplate() {
    return `<?php\n/**\n * Secure configuration template\n * Copy this file to config.php and update the values.\n */\n\ndefine('BOT_TOKEN', '${this.generateSecureToken()}');\ndefine('CLIENT_ID', '${this.generateSecureToken(
      18,
    )}');\ndefine('CLIENT_SECRET', '${this.generateSecureToken(
      32,
    )}');\n\ndefine('DASHBOARD_SECRET', '${this.generateSecureToken(
      32,
    )}');\ndefine('DASHBOARD_SESSION_SECRET', '${this.generateSecureToken(
      32,
    )}');\n\ndefine('DB_HOST', 'localhost');\ndefine('DB_PORT', 3306);\ndefine('DB_NAME', 'dbm_dashboard');\ndefine('DB_USER', 'dbm_user');\ndefine('DB_PASSWORD', '${this.generateSecureToken(
      16,
    )}');\n\ndefine('JWT_SECRET', '${this.generateSecureToken(
      32,
    )}');\ndefine('ENCRYPTION_KEY', '${this.generateSecureToken(32)}');\n\nreturn true;\n`;
  }

  generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  fixFilePermissions() {
    if (process.platform !== 'win32') {
      try {
        fs.chmodSync(this.configPath, 0o600);
        console.log('✅ config.php file permissions fixed');
      } catch (error) {
        console.error('❌ Failed to fix config.php file permissions:', error.message);
      }
    }
  }

  createGitignoreEntry() {
    const entry = `\n# Secure configuration\nconfig.php\nconfig.php.backup\n`;
    if (fs.existsSync(this.gitignorePath)) {
      const current = fs.readFileSync(this.gitignorePath, 'utf8');
      if (!current.includes('config.php')) {
        fs.appendFileSync(this.gitignorePath, entry);
        console.log('✅ Added config.php to .gitignore');
      }
    } else {
      fs.writeFileSync(this.gitignorePath, `# Secure configuration\nconfig.php\nconfig.php.backup\n`);
      console.log('✅ Created .gitignore with config.php protections');
    }
  }

  createSecureConfigTemplate() {
    const templatePath = path.join(__dirname, '../../../config.example.php');
    if (!fs.existsSync(templatePath)) {
      fs.writeFileSync(templatePath, this.generateSecureConfigTemplate(), { mode: 0o600 });
      console.log('✅ config.example.php template generated');
    }
  }

  runSecurityCheck() {
    const issues = this.checkConfigSecurity();
    if (issues.length > 0) {
      console.warn('⚠️ Configuration security issues detected:\n');
      issues.forEach((issue) => {
        console.warn(`- [${issue.level.toUpperCase()}] ${issue.message}`);
        console.warn(`  ➜ Recommended action: ${issue.action}\n`);
      });
      return false;
    }

    console.log('✅ config.php security checks passed');
    return true;
  }
}

module.exports = new ConfigSecurityChecker();
