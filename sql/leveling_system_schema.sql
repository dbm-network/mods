-- =============================================================================
-- DBM Dashboard extension: leaderboard / leveling (MySQL 5.7+ / MariaDB 10.3+)
-- =============================================================================
-- Used by: extensions/dashboard_EXT (modules/database.ts, leaderboard admin)
-- Install:  Place this file at YOUR BOT PROJECT ROOT:  sql/leveling_system_schema.sql
--            (same folder as bot.js). The dashboard admin "setup tables" API reads it.
-- Config:   Set credentials only in extensions/dashboard_EXT/config.json under
--            "leaderboard"."database" (host, user, password, database). Never commit secrets.
-- Tables:   LevelingSystem (per-guild XP/level), Streaks (daily streak metadata)
-- =============================================================================

CREATE TABLE IF NOT EXISTS `LevelingSystem` (
  `userID` VARCHAR(32) NOT NULL COMMENT 'Discord user snowflake',
  `serverID` VARCHAR(32) NOT NULL COMMENT 'Discord guild snowflake',
  `level` INT UNSIGNED NOT NULL DEFAULT 0,
  `xp` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`userID`, `serverID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Streaks` (
  `userID` VARCHAR(32) NOT NULL COMMENT 'Discord user snowflake',
  `serverID` VARCHAR(32) NOT NULL COMMENT 'Discord guild snowflake',
  `currentStreak` INT UNSIGNED NOT NULL DEFAULT 0,
  `longestStreak` INT UNSIGNED NOT NULL DEFAULT 0,
  `lastClaimDate` DATE NULL DEFAULT NULL COMMENT 'Last day streak was claimed (UTC date)',
  `totalDays` INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`userID`, `serverID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_leveling_server_xp` ON `LevelingSystem` (`serverID`, `xp` DESC);
