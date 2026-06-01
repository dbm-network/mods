const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Load leaderboard config helper
function loadLeaderboardConfig() {
  const configFile = path.join(__dirname, '../../../config.json');
  const defaultConfig = {
    enabled: false,
    database: {
      host: 'localhost',
      user: '',
      password: '',
      database: '',
    },
    tablesCreated: false,
  };

  try {
    if (fs.existsSync(configFile)) {
      const content = fs.readFileSync(configFile, 'utf8');
      const fullConfig = JSON.parse(content);
      return fullConfig.leaderboard || defaultConfig;
    }
  } catch (error) {
    console.error('[LeaderboardAdmin] Error loading config:', error);
  }

  return defaultConfig;
}

function saveLeaderboardConfig(config) {
  const configFile = path.join(__dirname, '../../../config.json');

  try {
    // Read existing config
    let fullConfig = {};
    if (fs.existsSync(configFile)) {
      const content = fs.readFileSync(configFile, 'utf8');
      fullConfig = JSON.parse(content);
    }

    // Update leaderboard section
    fullConfig.leaderboard = config;
    fullConfig.leaderboard.lastUpdated = Date.now();

    // Write back to config.json
    fs.writeFileSync(configFile, JSON.stringify(fullConfig, null, 4), 'utf8');
    return true;
  } catch (error) {
    console.error('[LeaderboardAdmin] Error saving config:', error);
    return false;
  }
}

function normalizeOwnerIds(ownerConfig) {
  if (Array.isArray(ownerConfig)) {
    return ownerConfig.map((id) => String(id).trim()).filter(Boolean);
  }
  if (typeof ownerConfig === 'string') {
    return ownerConfig
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);
  }
  if (ownerConfig) {
    return [String(ownerConfig).trim()].filter(Boolean);
  }
  return [];
}

module.exports = {
  init: async (DBM, Dashboard) => {
    // Toggle leaderboard enabled/disabled
    Dashboard.app.post('/api/admin/leaderboard/toggle', Dashboard.checkAuth, async (req, res) => {
      const owners = normalizeOwnerIds(Dashboard.settings.ownerIds || Dashboard.settings.owner);
      if (!req.user || !owners.includes(String(req.user.id))) {
        return res.status(403).json({ success: false, error: 'Unauthorized' });
      }

      try {
        const config = loadLeaderboardConfig();
        config.enabled = req.body.enabled === true || req.body.enabled === 'true';
        saveLeaderboardConfig(config);

        return res.json({
          success: true,
          enabled: config.enabled,
          message: `Leaderboard system ${config.enabled ? 'enabled' : 'disabled'}`,
        });
      } catch (error) {
        console.error('[LeaderboardAdmin] Toggle error:', error);
        return res.status(500).json({ success: false, error: error.message });
      }
    });

    // Save database configuration
    Dashboard.app.post('/api/admin/leaderboard/database', Dashboard.checkAuth, async (req, res) => {
      const owners = normalizeOwnerIds(Dashboard.settings.ownerIds || Dashboard.settings.owner);
      if (!req.user || !owners.includes(String(req.user.id))) {
        return res.status(403).json({ success: false, error: 'Unauthorized' });
      }

      try {
        const { host, user, password, database } = req.body;

        if (!host || !user || !password || !database) {
          return res.status(400).json({
            success: false,
            error: 'All database fields are required (host, user, password, database)',
          });
        }

        const config = loadLeaderboardConfig();
        config.database = {
          host: String(host).trim() || 'localhost',
          user: String(user).trim(),
          password: String(password).trim(),
          database: String(database).trim(),
        };

        // Test database connection
        let connection;
        try {
          connection = await mysql.createConnection({
            host: config.database.host,
            user: config.database.user,
            password: config.database.password,
            database: config.database.database,
          });
          await connection.ping();
          await connection.end();

          saveLeaderboardConfig(config);

          return res.json({
            success: true,
            message: 'Database configuration saved and connection verified',
          });
        } catch (dbError) {
          await connection?.end();
          return res.status(400).json({
            success: false,
            error: `Database connection failed: ${dbError.message}`,
          });
        }
      } catch (error) {
        console.error('[LeaderboardAdmin] Database config error:', error);
        return res.status(500).json({ success: false, error: error.message });
      }
    });

    // Execute SQL schema setup
    Dashboard.app.post('/api/admin/leaderboard/setup', Dashboard.checkAuth, async (req, res) => {
      const owners = normalizeOwnerIds(Dashboard.settings.ownerIds || Dashboard.settings.owner);
      if (!req.user || !owners.includes(String(req.user.id))) {
        return res.status(403).json({ success: false, error: 'Unauthorized' });
      }

      try {
        const config = loadLeaderboardConfig();

        if (!config.database.host || !config.database.user || !config.database.password || !config.database.database) {
          return res.status(400).json({
            success: false,
            error: 'Database configuration is incomplete. Please configure database settings first.',
          });
        }

        // Read SQL schema file - try multiple possible locations
        const possiblePaths = [
          path.join(__dirname, '../../../../../sql/leveling_system_schema.sql'), // From route to project root
          path.join(__dirname, '../../../../sql/leveling_system_schema.sql'), // Alternative path
          path.join(process.cwd(), 'sql/leveling_system_schema.sql'), // From current working directory
        ];

        let sqlFile = null;
        for (const possiblePath of possiblePaths) {
          if (fs.existsSync(possiblePath)) {
            sqlFile = possiblePath;
            break;
          }
        }

        if (!sqlFile) {
          return res.status(404).json({
            success: false,
            error:
              'SQL schema file not found. Please ensure sql/leveling_system_schema.sql exists in the project root.',
          });
        }

        const sqlContent = fs.readFileSync(sqlFile, 'utf8');
        const statements = sqlContent
          .split(';')
          .map((s) => s.trim())
          .filter((s) => s.length > 0 && !s.startsWith('--'));

        let connection;
        try {
          connection = await mysql.createConnection({
            host: config.database.host,
            user: config.database.user,
            password: config.database.password,
            database: config.database.database,
            multipleStatements: true,
          });

          // Check if tables already exist
          const [existingTables] = await connection.query(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = ? AND table_name IN ('LevelingSystem', 'Streaks')",
            [config.database.database],
          );

          const existingTableNames = existingTables.map((row) => row.table_name);
          const hasLevelingSystem = existingTableNames.includes('LevelingSystem');
          const hasStreaks = existingTableNames.includes('Streaks');

          // Execute each statement
          let tablesCreated = 0;
          for (const statement of statements) {
            if (statement.trim()) {
              try {
                await connection.query(statement);
                // Check if this created a new table
                if (statement.toUpperCase().includes('CREATE TABLE')) {
                  const tableMatch = statement.match(/CREATE TABLE.*?`?(\w+)`?/i);
                  if (tableMatch) {
                    const tableName = tableMatch[1];
                    const [checkTables] = await connection.query(
                      'SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = ?',
                      [config.database.database, tableName],
                    );
                    if (checkTables[0].count > 0) {
                      // Check if it was newly created or already existed
                      if (
                        (tableName === 'LevelingSystem' && !hasLevelingSystem) ||
                        (tableName === 'Streaks' && !hasStreaks)
                      ) {
                        tablesCreated++;
                      }
                    }
                  }
                }
              } catch (err) {
                // If table already exists, that's fine (CREATE TABLE IF NOT EXISTS)
                if (err.code === 'ER_TABLE_EXISTS_ERROR' || err.message.includes('already exists')) {
                  // Table already existed, continue
                } else {
                  throw err;
                }
              }
            }
          }

          await connection.end();

          // Mark tables as created/verified
          config.tablesCreated = true;
          saveLeaderboardConfig(config);

          let message = 'Database tables verified successfully.';
          if (tablesCreated > 0) {
            message = `Database tables created successfully. ${tablesCreated} new table(s) created.`;
          } else if (hasLevelingSystem && hasStreaks) {
            message = 'Database tables verified successfully. All tables already exist.';
          }

          return res.json({
            success: true,
            message,
            tablesCreated,
            tablesVerified: (hasLevelingSystem ? 1 : 0) + (hasStreaks ? 1 : 0),
          });
        } catch (dbError) {
          await connection?.end();
          return res.status(400).json({
            success: false,
            error: `Database setup failed: ${dbError.message}`,
          });
        }
      } catch (error) {
        console.error('[LeaderboardAdmin] Setup error:', error);
        return res.status(500).json({ success: false, error: error.message });
      }
    });

    // Get leaderboard configuration (for admin panel)
    Dashboard.app.get('/api/admin/leaderboard/config', (req, res) => {
      const owners = normalizeOwnerIds(Dashboard.settings.ownerIds || Dashboard.settings.owner);
      if (!req.user || !owners.includes(String(req.user.id))) {
        return res.status(403).json({ success: false, error: 'Unauthorized' });
      }

      try {
        const config = loadLeaderboardConfig();
        // Don't send password in response
        const safeConfig = {
          enabled: config.enabled,
          database: {
            host: config.database.host,
            user: config.database.user,
            database: config.database.database,
            passwordSet: Boolean(config.database.password),
          },
          tablesCreated: config.tablesCreated,
        };

        return res.json({ success: true, config: safeConfig });
      } catch (error) {
        console.error('[LeaderboardAdmin] Get config error:', error);
        return res.status(500).json({ success: false, error: error.message });
      }
    });
  },

  run: (DBM, req, res, Dashboard) => {
    const ownerConfig = Dashboard.settings.ownerIds || Dashboard.settings.owner || [];
    const ownerIds = Array.isArray(ownerConfig)
      ? ownerConfig.map((id) => String(id).trim()).filter(Boolean)
      : String(ownerConfig || '')
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean);
    const currentUserId = req.user && req.user.id ? String(req.user.id) : null;
    const isOwner = currentUserId ? ownerIds.includes(currentUserId) : false;

    if (!isOwner) {
      res.redirect('/dashboard/@me');
      return { skipRender: true };
    }

    const config = loadLeaderboardConfig();
    const safeConfig = {
      enabled: config.enabled,
      database: {
        host: config.database.host,
        user: config.database.user,
        database: config.database.database,
        passwordSet: Boolean(config.database.password),
      },
      tablesCreated: config.tablesCreated,
    };

    return {
      leaderboardConfig: safeConfig,
      settings: Dashboard.settings,
    };
  },
};
