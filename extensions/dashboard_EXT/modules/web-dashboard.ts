/******************************************************
 * Web Dashboard Module
 * Enhanced for @nt3/ Dashboard
 * Version 2.2.0
 ******************************************************/

import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { CommandManager } from './command-manager.ts';
import { DBMIntegration } from './dbm-integration.ts';
import { Database } from './database.ts';

@dbm.DBMExport()
export class WebDashboard {
  private static app: express.Application;
  private static server: any;
  private static port: number = 3000;

  // Initialize web dashboard
  static async initialize(port: number = 3000): Promise<void> {
    this.port = port;
    this.app = express();

    // Initialize database connection (only if leaderboard is enabled)
    try {
      await Database.initialize();
    } catch (dbError) {
      console.warn('[WebDashboard] Database initialization failed (leaderboard may be disabled):', dbError.message);
      // Continue without database - leaderboard features won't work but dashboard will
    }

    this.setupMiddleware();
    this.setupRoutes();

    this.server = this.app.listen(this.port, () => {
      console.log(`Web Dashboard running on http://localhost:${this.port}`);
    });
  }

  // Setup middleware
  private static setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(path.join(__dirname, '../public')));

    // Security headers
    this.app.use((req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      next();
    });
  }

  // Setup routes
  private static setupRoutes(): void {
    // Main dashboard
    this.app.get('/', (req, res) => {
      res.send(this.getDashboardHTML());
    });

    // API routes
    this.app.get('/api/commands', this.getCommands.bind(this));
    this.app.get('/api/commands/:id', this.getCommand.bind(this));
    this.app.post('/api/commands', this.createCommand.bind(this));
    this.app.put('/api/commands/:id', this.updateCommand.bind(this));
    this.app.delete('/api/commands/:id', this.deleteCommand.bind(this));

    this.app.get('/api/stats', this.getStats.bind(this));
    this.app.post('/api/reload', this.reloadCommands.bind(this));

    // DBM specific routes
    this.app.get('/api/dbm/actions', this.getDBMActions.bind(this));
    this.app.get('/api/dbm/events', this.getDBMEvents.bind(this));
    this.app.get('/api/dbm/settings', this.getDBMSettings.bind(this));

    // Leaderboard routes
    this.app.get('/api/leaderboard/:serverId?', this.getLeaderboard.bind(this));
    this.app.get('/api/user/:userId/stats', this.getUserStats.bind(this));
  }

  // Get all commands
  private async getCommands(req: express.Request, res: express.Response): Promise<void> {
    try {
      const commands = CommandManager.getAllCommands();
      res.json({
        success: true,
        data: commands,
        count: commands.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get single command
  private async getCommand(req: express.Request, res: express.Response): Promise<void> {
    try {
      const command = CommandManager.getCommand(req.params.id);
      if (command) {
        res.json({
          success: true,
          data: command,
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Command not found',
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Create new command
  private async createCommand(req: express.Request, res: express.Response): Promise<void> {
    try {
      const commandData = req.body;
      const errors = CommandManager.validateCommand(commandData);

      if (errors.length > 0) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors,
        });
        return;
      }

      CommandManager.registerCommand(commandData);
      res.json({
        success: true,
        message: 'Command created successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Update command
  private async updateCommand(req: express.Request, res: express.Response): Promise<void> {
    try {
      const commandData = req.body;
      const errors = CommandManager.validateCommand(commandData);

      if (errors.length > 0) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors,
        });
        return;
      }

      CommandManager.unregisterCommand(req.params.id);
      CommandManager.registerCommand(commandData);
      res.json({
        success: true,
        message: 'Command updated successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Delete command
  private async deleteCommand(req: express.Request, res: express.Response): Promise<void> {
    try {
      CommandManager.unregisterCommand(req.params.id);
      res.json({
        success: true,
        message: 'Command deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get statistics
  private async getStats(req: express.Request, res: express.Response): Promise<void> {
    try {
      const commandStats = CommandManager.getCommandStats();
      const dbmStats = DBMIntegration.getStats();

      res.json({
        success: true,
        data: {
          commands: commandStats,
          dbm: dbmStats,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Reload commands
  private async reloadCommands(req: express.Request, res: express.Response): Promise<void> {
    try {
      await DBMIntegration.reloadCommands();
      res.json({
        success: true,
        message: 'Commands reloaded successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get DBM actions
  private async getDBMActions(req: express.Request, res: express.Response): Promise<void> {
    try {
      const actionsPath = path.join(__dirname, '../actions');
      const actions = fs
        .readdirSync(actionsPath)
        .filter((file) => file.endsWith('.js'))
        .map((file) => {
          const actionPath = path.join(actionsPath, file);
          const action = require(actionPath);
          return {
            name: action.name,
            section: action.section,
            version: action.meta?.version,
            file: file,
          };
        });

      res.json({
        success: true,
        data: actions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get DBM events
  private async getDBMEvents(req: express.Request, res: express.Response): Promise<void> {
    try {
      const eventsPath = path.join(__dirname, '../events');
      const events = fs
        .readdirSync(eventsPath)
        .filter((file) => file.endsWith('.js'))
        .map((file) => {
          const eventPath = path.join(eventsPath, file);
          const event = require(eventPath);
          return {
            name: event.name,
            section: event.section,
            version: event.meta?.version,
            file: file,
          };
        });

      res.json({
        success: true,
        data: events,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get DBM settings
  private async getDBMSettings(req: express.Request, res: express.Response): Promise<void> {
    try {
      const settingsPath = path.join(__dirname, '../data/settings.json');
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

      // Remove sensitive data
      delete settings.token;
      delete settings.client;

      res.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get dashboard HTML
  private static getDashboardHTML(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@nt3/ DBM Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #1a1a1a; color: #fff; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #7289da; font-size: 2.5em; margin-bottom: 10px; }
        .header p { color: #b9bbbe; font-size: 1.1em; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: #2f3136; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-card h3 { color: #7289da; margin-bottom: 10px; }
        .stat-card .number { font-size: 2em; font-weight: bold; color: #43b581; }
        .commands-section { background: #2f3136; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .commands-section h2 { color: #7289da; margin-bottom: 20px; }
        .command-list { display: grid; gap: 10px; }
        .command-item { background: #36393f; padding: 15px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; }
        .command-name { font-weight: bold; color: #fff; }
        .command-type { background: #7289da; color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 0.8em; }
        .actions { display: flex; gap: 10px; }
        .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9em; }
        .btn-primary { background: #7289da; color: #fff; }
        .btn-danger { background: #f04747; color: #fff; }
        .btn-success { background: #43b581; color: #fff; }
        .loading { text-align: center; padding: 20px; color: #b9bbbe; }
        .error { background: #f04747; color: #fff; padding: 10px; border-radius: 4px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>@nt3/ DBM Dashboard</h1>
            <p>Enhanced Discord Bot Maker Dashboard with Full Command Support</p>
        </div>
        
        <div class="stats" id="stats">
            <div class="loading">Loading statistics...</div>
        </div>
        
        <div class="commands-section">
            <h2>Commands</h2>
            <div class="command-list" id="commands">
                <div class="loading">Loading commands...</div>
            </div>
        </div>
    </div>

    <script>
        // Load statistics
        async function loadStats() {
            try {
                const response = await fetch('/api/stats');
                const data = await response.json();
                
                if (data.success) {
                    const stats = data.data;
                    document.getElementById('stats').innerHTML = \`
                        <div class="stat-card">
                            <h3>Total Commands</h3>
                            <div class="number">\${stats.commands.total}</div>
                        </div>
                        <div class="stat-card">
                            <h3>Slash Commands</h3>
                            <div class="number">\${stats.commands.slash}</div>
                        </div>
                        <div class="stat-card">
                            <h3>Prefix Commands</h3>
                            <div class="number">\${stats.commands.prefix}</div>
                        </div>
                        <div class="stat-card">
                            <h3>With Cooldown</h3>
                            <div class="number">\${stats.commands.withCooldown}</div>
                        </div>
                    \`;
                }
            } catch (error) {
                document.getElementById('stats').innerHTML = '<div class="error">Failed to load statistics</div>';
            }
        }

        // Load commands
        async function loadCommands() {
            try {
                const response = await fetch('/api/commands');
                const data = await response.json();
                
                if (data.success) {
                    const commands = data.data;
                    const commandsHTML = commands.map(cmd => \`
                        <div class="command-item">
                            <div>
                                <div class="command-name">\${cmd.name}</div>
                                <div style="color: #b9bbbe; font-size: 0.9em;">\${cmd.description}</div>
                            </div>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                \${cmd.slashCommand ? '<span class="command-type">Slash</span>' : ''}
                                \${cmd.prefixCommand ? '<span class="command-type">Prefix</span>' : ''}
                                <div class="actions">
                                    <button class="btn btn-primary" onclick="editCommand('\${cmd.name}')">Edit</button>
                                    <button class="btn btn-danger" onclick="deleteCommand('\${cmd.name}')">Delete</button>
                                </div>
                            </div>
                        </div>
                    \`).join('');
                    
                    document.getElementById('commands').innerHTML = commandsHTML;
                }
            } catch (error) {
                document.getElementById('commands').innerHTML = '<div class="error">Failed to load commands</div>';
            }
        }

        // Edit command
        function editCommand(commandName) {
            alert('Edit command: ' + commandName + ' (Feature coming soon)');
        }

        // Delete command
        async function deleteCommand(commandName) {
            if (confirm('Are you sure you want to delete command: ' + commandName + '?')) {
                try {
                    const response = await fetch(\`/api/commands/\${commandName}\`, {
                        method: 'DELETE'
                    });
                    const data = await response.json();
                    
                    if (data.success) {
                        loadCommands();
                    } else {
                        alert('Failed to delete command: ' + data.error);
                    }
                } catch (error) {
                    alert('Failed to delete command: ' + error.message);
                }
            }
        }

        // Reload commands
        async function reloadCommands() {
            try {
                const response = await fetch('/api/reload', { method: 'POST' });
                const data = await response.json();
                
                if (data.success) {
                    loadStats();
                    loadCommands();
                    alert('Commands reloaded successfully!');
                } else {
                    alert('Failed to reload commands: ' + data.error);
                }
            } catch (error) {
                alert('Failed to reload commands: ' + error.message);
            }
        }

        // Initialize dashboard
        document.addEventListener('DOMContentLoaded', function() {
            loadStats();
            loadCommands();
            
            // Add reload button
            const header = document.querySelector('.header');
            const reloadBtn = document.createElement('button');
            reloadBtn.className = 'btn btn-success';
            reloadBtn.textContent = 'Reload Commands';
            reloadBtn.onclick = reloadCommands;
            reloadBtn.style.marginTop = '10px';
            header.appendChild(reloadBtn);
        });
    </script>
</body>
</html>
        `;
  }

  // Get leaderboard
  private async getLeaderboard(req: express.Request, res: express.Response): Promise<void> {
    // Check if leaderboard is enabled
    try {
      const fs = require('fs');
      const path = require('path');
      const configFile = path.join(__dirname, '../config.json');
      if (fs.existsSync(configFile)) {
        const fullConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));
        const leaderboardConfig = fullConfig.leaderboard;
        if (!leaderboardConfig.enabled) {
          return res.status(403).json({
            success: false,
            error: 'Leaderboard system is disabled. Please enable it in the admin panel.',
          });
        }
      } else {
        return res.status(403).json({
          success: false,
          error: 'Leaderboard system is not configured. Please configure it in the admin panel.',
        });
      }
    } catch (error) {
      console.error('[WebDashboard] Error checking leaderboard config:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to check leaderboard configuration',
      });
    }
    try {
      const serverId = req.params.serverId || null;
      const scope = (req.query.scope as string) || (serverId ? 'server' : 'global');
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = 25;
      const offset = (page - 1) * limit;

      let leaderboard;
      if (scope === 'global' || !serverId) {
        leaderboard = await Database.getGlobalLeaderboard(limit, offset);
      } else {
        leaderboard = await Database.getLeaderboard(serverId, limit, offset);
      }

      res.json({
        success: true,
        data: leaderboard,
        scope: scope,
        page: page,
        limit: limit,
        count: leaderboard.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get user stats
  private async getUserStats(req: express.Request, res: express.Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const serverId = (req.query.serverId as string) || null;

      if (!userId) {
        res.status(400).json({
          success: false,
          error: 'User ID is required',
        });
        return;
      }

      let levelData = null;
      let serverRank = -1;
      let globalRank = -1;
      let streakData = null;

      if (serverId) {
        levelData = await Database.getOrCreateUserLevel(userId, serverId);
        serverRank = await Database.getUserRank(userId, serverId);
        streakData = await Database.getStreakInfo(userId, serverId);
      }

      globalRank = await Database.getUserGlobalRank(userId);

      res.json({
        success: true,
        data: {
          userId: userId,
          level: levelData?.level || 0,
          xp: levelData?.xp || 0,
          serverRank: serverRank,
          globalRank: globalRank,
          streak: streakData
            ? {
                current: streakData.currentStreak,
                longest: streakData.longestStreak,
                totalDays: streakData.totalDays,
              }
            : null,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Stop the dashboard
  static stop(): void {
    if (this.server) {
      this.server.close();
      Database.close();
      console.log('Web Dashboard stopped');
    }
  }
}
