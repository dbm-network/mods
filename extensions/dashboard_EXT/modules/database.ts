/******************************************************
 * Database Module for Leveling System
 * MySQL connection and query functions
 * Version 1.0.0
 ******************************************************/

import * as mysql from 'mysql2/promise';

interface LevelingData {
  userID: string;
  level: number;
  xp: number;
  serverID?: string;
}

interface StreakData {
  userID: string;
  serverID: string;
  currentStreak: number;
  longestStreak: number;
  lastClaimDate: string | null;
  totalDays: number;
}

interface LeaderboardEntry {
  userID: string;
  level: number;
  xp: number;
  rank: number;
}

@dbm.DBMExport()
export class Database {
  private static pool: mysql.Pool | null = null;

  // Initialize database connection pool
  static async initialize(): Promise<void> {
    if (this.pool) {
      return; // Already initialized
    }

    try {
      // Try to load leaderboard config first (for modular system)
      let dbConfig: any = null;
      try {
        const fs = require('fs');
        const path = require('path');
        const configFile = path.join(__dirname, '../config.json');
        if (fs.existsSync(configFile)) {
          const fullConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));
          const leaderboardConfig = fullConfig.leaderboard;
          if (leaderboardConfig && leaderboardConfig.enabled && leaderboardConfig.database) {
            dbConfig = leaderboardConfig.database;
          }
        }
      } catch (leaderboardError) {
        // Fall back to config.php if leaderboard config doesn't exist
      }

      // Fall back to default config if leaderboard config not available
      // Note: config.php is PHP, not JavaScript, so we can't require it directly
      // The leaderboard system should be configured through the admin panel
      if (!dbConfig) {
        // Use default values - these should be configured via admin panel
        dbConfig = {
          host: 'localhost',
          user: 'news_disco',
          password: 'xs@#yxv+xdcwxnuk',
          database: 'news_disco',
        };

        // Try to load from leaderboard config even if disabled (for fallback)
        try {
          const fs = require('fs');
          const path = require('path');
          const configFile = path.join(__dirname, '../config.json');
          if (fs.existsSync(configFile)) {
            const fullConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));
            const leaderboardConfig = fullConfig.leaderboard;
            if (leaderboardConfig && leaderboardConfig.database && leaderboardConfig.database.host) {
              dbConfig = leaderboardConfig.database;
            }
          }
        } catch (fallbackError) {
          // Use default values
        }
      }

      // Only create pool if we have valid database configuration
      if (!dbConfig.host || !dbConfig.user || !dbConfig.database) {
        console.warn('[Database] Incomplete database configuration. Leaderboard features will be disabled.');
        // Don't create pool - return without error so dashboard can still start
        return;
      }

      this.pool = mysql.createPool({
        host: dbConfig.host || 'localhost',
        user: dbConfig.user || 'news_disco',
        password: dbConfig.password || dbConfig.db_password || '',
        database: dbConfig.database || dbConfig.name || 'news_disco',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
      });

      console.log('[Database] Connection pool initialized');
    } catch (error) {
      console.error('[Database] Failed to initialize database pool:', error.message);
      // Don't throw - allow dashboard to start without database
      // Leaderboard features will be disabled
    }
  }

  // Get database pool
  static getPool(): mysql.Pool | null {
    if (!this.pool) {
      return null;
    }
    return this.pool;
  }

  // Check if database is available
  static isAvailable(): boolean {
    return this.pool !== null;
  }

  // Get user level data
  static async getUserLevel(userId: string, serverId: string): Promise<LevelingData | null> {
    const pool = this.getPool();
    if (!pool) {
      return null;
    }
    try {
      const [rows] = await pool.execute<mysql.RowDataPacket[]>(
        'SELECT userID, level, xp, serverID FROM LevelingSystem WHERE userID = ? AND serverID = ?',
        [userId, serverId],
      );

      if (Array.isArray(rows) && rows.length > 0) {
        return rows[0] as LevelingData;
      }
      return null;
    } catch (error) {
      console.error('Error getting user level:', error);
      throw error;
    }
  }

  // Get or create user level data
  static async getOrCreateUserLevel(userId: string, serverId: string): Promise<LevelingData> {
    const pool = this.getPool();
    if (!pool) {
      throw new Error('Database not available');
    }

    let userData = await this.getUserLevel(userId, serverId);

    if (!userData) {
      try {
        await pool.execute('INSERT INTO LevelingSystem (userID, serverID, level, xp) VALUES (?, ?, 0, 0)', [
          userId,
          serverId,
        ]);
        userData = { userID: userId, serverID: serverId, level: 0, xp: 0 };
      } catch (error) {
        console.error('Error creating user level:', error);
        throw error;
      }
    }

    return userData;
  }

  // Get server leaderboard
  static async getLeaderboard(serverId: string, limit: number = 25, offset: number = 0): Promise<LeaderboardEntry[]> {
    const pool = this.getPool();
    if (!pool) {
      return [];
    }
    try {
      const [rows] = await pool.execute<mysql.RowDataPacket[]>(
        'SELECT userID, level, xp FROM LevelingSystem WHERE serverID = ? ORDER BY xp DESC, level DESC LIMIT ? OFFSET ?',
        [serverId, limit, offset],
      );

      const leaderboard: LeaderboardEntry[] = [];
      let rank = offset + 1;

      if (Array.isArray(rows)) {
        for (const row of rows) {
          leaderboard.push({
            userID: row.userID,
            level: row.level || 0,
            xp: row.xp || 0,
            rank: rank++,
          });
        }
      }

      return leaderboard;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      throw error;
    }
  }

  // Get global leaderboard
  static async getGlobalLeaderboard(limit: number = 25, offset: number = 0): Promise<LeaderboardEntry[]> {
    const pool = this.getPool();
    if (!pool) {
      return [];
    }
    try {
      const [rows] = await pool.execute<mysql.RowDataPacket[]>(
        'SELECT userID, level, xp FROM LevelingSystem ORDER BY xp DESC, level DESC LIMIT ? OFFSET ?',
        [limit, offset],
      );

      const leaderboard: LeaderboardEntry[] = [];
      let rank = offset + 1;

      if (Array.isArray(rows)) {
        for (const row of rows) {
          leaderboard.push({
            userID: row.userID,
            level: row.level || 0,
            xp: row.xp || 0,
            rank: rank++,
          });
        }
      }

      return leaderboard;
    } catch (error) {
      console.error('Error getting global leaderboard:', error);
      throw error;
    }
  }

  // Get user rank in server
  static async getUserRank(userId: string, serverId: string): Promise<number> {
    const pool = this.getPool();
    if (!pool) {
      return -1;
    }
    try {
      const userData = await this.getUserLevel(userId, serverId);
      if (!userData) {
        return -1; // User not found
      }

      const [rows] = await pool.execute<mysql.RowDataPacket[]>(
        'SELECT COUNT(*) + 1 as rank FROM LevelingSystem WHERE serverID = ? AND (xp > ? OR (xp = ? AND level > ?))',
        [serverId, userData.xp, userData.xp, userData.level],
      );

      if (Array.isArray(rows) && rows.length > 0) {
        return rows[0].rank || -1;
      }
      return -1;
    } catch (error) {
      console.error('Error getting user rank:', error);
      throw error;
    }
  }

  // Get user global rank
  static async getUserGlobalRank(userId: string): Promise<number> {
    const pool = this.getPool();
    if (!pool) {
      return -1;
    }
    try {
      const [rows] = await pool.execute<mysql.RowDataPacket[]>(
        'SELECT userID, level, xp FROM LevelingSystem WHERE userID = ? ORDER BY xp DESC, level DESC LIMIT 1',
        [userId],
      );

      if (!Array.isArray(rows) || rows.length === 0) {
        return -1; // User not found
      }

      const userData = rows[0] as LevelingData;

      const [rankRows] = await pool.execute<mysql.RowDataPacket[]>(
        'SELECT COUNT(*) + 1 as rank FROM LevelingSystem WHERE (xp > ? OR (xp = ? AND level > ?))',
        [userData.xp, userData.xp, userData.level],
      );

      if (Array.isArray(rankRows) && rankRows.length > 0) {
        return rankRows[0].rank || -1;
      }
      return -1;
    } catch (error) {
      console.error('Error getting user global rank:', error);
      throw error;
    }
  }

  // Get streak information
  static async getStreakInfo(userId: string, serverId: string): Promise<StreakData | null> {
    const pool = this.getPool();
    if (!pool) {
      return null;
    }
    try {
      const [rows] = await pool.execute<mysql.RowDataPacket[]>(
        'SELECT userID, serverID, currentStreak, longestStreak, lastClaimDate, totalDays FROM Streaks WHERE userID = ? AND serverID = ?',
        [userId, serverId],
      );

      if (Array.isArray(rows) && rows.length > 0) {
        return rows[0] as StreakData;
      }
      return null;
    } catch (error) {
      console.error('Error getting streak info:', error);
      throw error;
    }
  }

  // Close database connection pool
  static async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      console.log('Database connection pool closed');
    }
  }
}
