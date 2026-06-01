module.exports = {
  // ----------------------------------------------------------------------------------
  // Ran when the dashboard if first started
  init: async (DBM) => {},
  // ----------------------------------------------------------------------------------

  run: (DBM, req, res, Dashboard) => {
    // Check if leaderboard is enabled
    const fs = require('fs');
    const path = require('path');
    let leaderboardEnabled = false;

    try {
      const configFile = path.join(__dirname, '../../../config.json');
      if (fs.existsSync(configFile)) {
        const fullConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));
        const leaderboardConfig = fullConfig.leaderboard;
        leaderboardEnabled = leaderboardConfig && leaderboardConfig.enabled === true;
      }
    } catch (error) {
      console.error('[LeaderboardRoute] Error checking leaderboard config:', error);
    }

    if (!leaderboardEnabled) {
      res.status(403).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Leaderboard Disabled</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        .error-box { max-width: 600px; margin: 0 auto; padding: 30px; background: #1a1a1a; border-radius: 8px; }
                        h1 { color: #fff; }
                        p { color: #ccc; }
                        a { color: #4a9eff; text-decoration: none; }
                    </style>
                </head>
                <body>
                    <div class="error-box">
                        <h1>Leaderboard System Disabled</h1>
                        <p>The leaderboard system is currently disabled. Please enable it in the admin panel to use this feature.</p>
                        <p><a href="/admin">Go to Admin Panel</a></p>
                    </div>
                </body>
                </html>
            `);
      return { skipRender: true };
    }

    const ownerConfig = Dashboard.settings.ownerIds || Dashboard.settings.owner || [];
    const ownerIds = Array.isArray(ownerConfig)
      ? ownerConfig.map((id) => String(id).trim()).filter(Boolean)
      : String(ownerConfig || '')
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean);
    const currentUserId = req.user && req.user.id ? String(req.user.id) : null;
    const isOwner = currentUserId ? ownerIds.includes(currentUserId) : false;

    return {
      navItems: Dashboard.settings.navItems,
      features: Dashboard.settings.features,
      inviteLink: Dashboard.settings.inviteLink,
      supportServer: Dashboard.settings.supportServer,
      introText: Dashboard.settings.introText,
      footerText: Dashboard.settings.footerText,
      footerTextHtml: Dashboard.settings.footerTextHtml,
      client: DBM.Bot.bot,
      user: req.user || null,
      ownerIds,
      isOwner,
    };
  },
};
