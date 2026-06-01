const secureConfig = require('./config');

class DatabaseAuth {
  constructor() {
    this.enabled = false;
    this.disabledReason = this.resolveDisabledReason();
    this.warnedOperations = new Set();
    this.logDisabledState();
  }

  resolveDisabledReason() {
    const databaseConfig = secureConfig.get('database');
    if (databaseConfig && Object.keys(databaseConfig).length > 0) {
      return 'Database connectivity has been disabled by policy. Define an external auth adapter if required.';
    }
    return 'No database configuration supplied. Database-backed auth remains disabled.';
  }

  logDisabledState() {
    const message = `[DatabaseAuth] Database-backed authentication disabled. Reason: ${this.disabledReason}`;
    if (console && typeof console.info === 'function') {
      console.info(message);
    } else {
      console.log(message);
    }
  }

  isEnabled() {
    return this.enabled;
  }

  getDisabledReason() {
    return this.disabledReason;
  }

  warnDisabledOperation(operation) {
    if (!this.warnedOperations.has(operation)) {
      this.warnedOperations.add(operation);
      console.warn(
        `[DatabaseAuth] Attempted to ${operation}, but the database module is disabled. Reason: ${this.disabledReason}`,
      );
    }
  }

  createDisabledError(operation) {
    const error = new Error('Database authentication is disabled.');
    error.code = 'DATABASE_AUTH_DISABLED';
    error.operation = operation;
    error.details = {
      reason: this.disabledReason,
    };
    return error;
  }

  async registerUser() {
    this.warnDisabledOperation('register a user');
    throw this.createDisabledError('registerUser');
  }

  async authenticateUser() {
    this.warnDisabledOperation('authenticate a user');
    return null;
  }

  async createSession() {
    this.warnDisabledOperation('create a session');
    throw this.createDisabledError('createSession');
  }

  async validateSession() {
    this.warnDisabledOperation('validate a session');
    return null;
  }

  async destroySession() {
    this.warnDisabledOperation('destroy a session');
    return false;
  }

  async destroyAllUserSessions() {
    this.warnDisabledOperation('destroy all user sessions');
    return 0;
  }

  async linkDiscordAccount() {
    this.warnDisabledOperation('link a Discord account');
    throw this.createDisabledError('linkDiscordAccount');
  }

  async getUserByDiscordId() {
    this.warnDisabledOperation('look up user by Discord ID');
    return null;
  }

  async updateUserPassword() {
    this.warnDisabledOperation('update a user password');
    throw this.createDisabledError('updateUserPassword');
  }

  async deleteUser() {
    this.warnDisabledOperation('delete a user');
    throw this.createDisabledError('deleteUser');
  }

  async cleanupExpiredSessions() {
    this.warnDisabledOperation('clean up expired sessions');
    return 0;
  }

  async close() {
    this.warnDisabledOperation('close database connections');
    return true;
  }
}

module.exports = DatabaseAuth;
