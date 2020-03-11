module.exports = function (DBM) {
    const Dashboard = DBM.Dashboard;
    const client = DBM.Bot.bot;
    Dashboard.loadDashboard = function () {
        Dashboard.app.get('/dashboard/@me', Dashboard.checkAuth, function (req, res) {
            res.render('servers', {
                guilds: req.user.guilds.filter(u => (u.permissions & 2146958591) === 2146958591),
                user: req.user,
                config: Dashboard.config,
                client: DBM.Bot.bot,
                theme: Dashboard.theme(),
                req: req
            });
        });

        Dashboard.app.get('/dashboard/@me/servers/:guildID', Dashboard.checkAuth, function (req, res) {
            let serv = client.guilds.get(req.params.guildID);
            if (!serv) return res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${DBM.Bot.bot.user.id}&scope=bot&permissions=2146958591&guild_id=${req.params.guildID}`);
            let dashboardMods = [];
            Dashboard.actions.forEach(data => {
                if (data.dashboardMod == true) {
                    dashboardMods.push(data);
                };
            });
            let section = []
            Dashboard.actions.forEach(action => {
                if (!section.includes(action.section) && action.routeMod == false && action.dashboardMod == true) {
                    section.push(action.section);
                };
            });
            if (!req.user.log) req.user.log = 'Command Executed';
            res.render('dashboardPanel', {
                client: DBM.Bot.bot,
                server: serv,
                dashboardMods: dashboardMods,
                customHtml: false,
                log: req.user.log,
                config: Dashboard.config,
                commandExecuted: req.user.commandExecuted,
                theme: Dashboard.theme(),
                sections: section,
                req: req
            });
            Dashboard.commandExecuted(req, false);
        });

        Dashboard.app.get('/dashboard/@me/servers/:guildID/:action', Dashboard.checkAuth, function (req, res) {
            let serv = client.guilds.get(req.params.guildID);
            if (!serv) return res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${DBM.Bot.bot.user.id}&scope=bot&permissions=2146958591&guild_id=${req.params.guildID}`);
            var action = req.params.action;
            let data = Dashboard.actions.get(action);
            let dashboardMods = [];
            Dashboard.actions.forEach(data => {
                if (data.dashboardMod == true) dashboardMods.push(data);
            });
            let section = []
            Dashboard.actions.forEach(action => {
                if (!section.includes(action.section) && action.routeMod == false && action.dashboardMod == true) {
                    section.push(action.section);
                };
            });
            res.render('dashboardPanel', {
                dashboardMods: dashboardMods,
                commandExecuted: req.user.commandExecuted,
                customHtml: data.customHtml,
                action: data,
                log: req.user.log,
                client: DBM.Bot.bot,
                config: Dashboard.config,
                server: serv,
                theme: Dashboard.theme(),
                sections: section,
                req: req
            });
            Dashboard.commandExecuted(req, false);
        });

        Dashboard.app.get('/dashboard/admin', Dashboard.checkAuthOwner, function (req, res) {
            let config = Dashboard.dashboardConfig();
            let dashboardMods = [];
            Dashboard.actions.forEach(data => {
                if (data.adminMod == true) dashboardMods.push(data);
            });
            if (!req.user.log) req.user.log = 'Command Executed';
            let actions = Dashboard.actions;
            let section = [];
            let extensions = [];
            actions.forEach(action => {
                if (!section.includes(action.section) && action.routeMod == false && action.adminMod == true) {
                    section.push(action.section);
                };
            });
            
            actions.forEach(action => {
                if (action.extensionMod && action.customHtml) {
                    extensions.push(action);
                };
            });

            res.render('adminPanel', {
                dashboardMods: dashboardMods,
                commandExecuted: req.user.commandExecuted,
                customHtml: false,
                log: req.user.log,
                client: DBM.Bot.bot,
                config: Dashboard.config,
                theme: Dashboard.theme(),
                sections: section,
                extensions: extensions,
                app: Dashboard.app,
                req: req
            });
            Dashboard.commandExecuted(req, false);
        });


        Dashboard.app.get('/dashboard/admin/:action', Dashboard.checkAuthOwner, function (req, res) {
            var action = req.params.action;
            let data = Dashboard.actions.get(action);
            let dashboardMods = [];

            Dashboard.actions.forEach(data => {
                if (data.adminMod == true) dashboardMods.push(data);
            });

            let section = [];
            let extensions = [];
            Dashboard.actions.forEach(action => {
                if (!section.includes(action.section) && action.routeMod == false && action.adminMod == true) {
                    section.push(action.section);
                }
            });

            Dashboard.actions.forEach(action => {
                if (action.extensionMod && action.customHtml) {
                    extensions.push(action);
                };
            });

            let passData = {}
            console.log(data.render(passData))
            res.render('adminPanel', {
                dashboardMods: dashboardMods,
                commandExecuted: false,
                customHtml: true,
                action: data,
                log: req.user.log,
                client: DBM.Bot.bot,
                config: Dashboard.config,
                theme: Dashboard.theme(),
                sections: section,
                extensions: extensions,
                app: Dashboard.app,
                req: req,
                render: data.render(passData)
            });
            Dashboard.commandExecuted(req, false);
        });

        Dashboard.app.post('/api/execute/:action', Dashboard.checkAuthOwner, function (req, res) {
            var next = req.query['next'];
            if (!next) next = false;
            var action = req.params.action;
            let data = Dashboard.actions.get(action);
            let serv;
            Dashboard.onCommandExecute(req, data);
            if (data.customHtml) {
                if (next == 'true') {
                    data.run(Dashboard.app, Dashboard.config, DBM, DBM.Bot.bot, req, res, serv);
                    if (data.next) {
                        Dashboard.commandExecuted(req, true);
                        res.redirect('/dashboard/admin');
                    };
                } else {
                    res.redirect(`/dashboard/admin/${data.name}`);
                };
            } else {
                data.run(Dashboard.app, Dashboard.config, DBM, DBM.Bot.bot, req, res, serv);
                if (data.next) {
                    Dashboard.commandExecuted(req, true);
                    res.redirect('/dashboard/admin');
                };
            };
        });
    
        Dashboard.app.post('/dashboard/@me/servers/:guildID/execute/:action', Dashboard.checkAuth, function (req, res) {
            var next = req.query['next'];
            if (!next) next = false;
            var action = req.params.action;
            let data = Dashboard.actions.get(action);
            let serv = client.guilds.get(req.params.guildID);
            Dashboard.onCommandExecute(req, data);
            if (data.customHtml) {
                if (next == 'true') {
                    data.run(Dashboard.app, Dashboard.config, DBM, DBM.Bot.bot, req, res, serv);
                    if (data.next) {
                        Dashboard.commandExecuted(req, true);
                        res.redirect(`/dashboard/@me/servers/${serv.id}`);
                    };
                } else {
                    res.redirect(`/dashboard/@me/servers/${serv.id}/${data.name}`);
                };
            } else {
                data.run(Dashboard.app, Dashboard.config, DBM, DBM.Bot.bot, req, res, serv);
                if (data.next) {
                    Dashboard.commandExecuted(req, true);
                    res.redirect(`/dashboard/@me/servers/${serv.id}/${data.name}`);
                };
            };
        });

        Dashboard.app.post('/api/admin/web', Dashboard.checkAuthOwner, function (req, res) {
            const dashboardConfigPath = require("path").join(__dirname, "../config.json");
            let config = require('../config.json.js.js');
    
            config.featureOne.name = req.body.featureOneName;
            config.featureOne.description = req.body.featureOneDescription;
            config.featureTwo.name = req.body.featureTwoName;
            config.featureTwo.description = req.body.featureTwoDescription;
            config.featureThree.name = req.body.featureThreeName;
            config.featureThree.description = req.body.featureThreeDescription;
            config.featureFour.name = req.body.featureFourName;
            config.featureFour.description = req.body.featureFourDescription;
            config.footerText = req.body.footerText;
            config.introText = req.body.introText;
    
            let settings = JSON.stringify(config);
            require("fs").writeFileSync(dashboardConfigPath, settings, "utf8");
            res.redirect('/');
        });
    };
};