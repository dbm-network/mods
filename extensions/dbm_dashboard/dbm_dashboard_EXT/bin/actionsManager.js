module.exports = function (DBM) {
    const Dashboard = DBM.Dashboard
    const { fs, readdirSync } = require("fs"),
        chalk = Dashboard.requireModule('chalk'),
        path = Dashboard.requireModule('path');

    Dashboard.loadActions = function () {
        readdirSync('./extensions/dbm_dashboard_EXT/actions').forEach(dir => {
            const actions = readdirSync(`./extensions/dbm_dashboard_EXT/actions/${dir}/`).filter(file => file.endsWith('.js'));
            for (let file of actions) {
                let pull = require(path.join(__dirname, "../actions", dir, file));
                Dashboard.actions.set(pull.name, pull);
                pull.init(DBM);
                if (Dashboard.devMode) console.log(chalk.green(`Successfully loaded ${pull.name}`));
            }
        });
    }

    // Route handler
    Dashboard.loadRoutes = function () {
        readdirSync('./extensions/dbm_dashboard_EXT/actions').forEach(dir => {
            const actions = readdirSync(`./extensions/dbm_dashboard_EXT/actions/${dir}/`).filter(file => file.endsWith('.js'));
            for (let file of actions) {
                let pull = require(path.join(__dirname, "../actions", dir, file));
                if (pull.routeMod) {
                    Dashboard.routes.set(pull.name, pull);
                    if (Dashboard.devMode) console.log(chalk.green(`Successfully loaded ${pull.name}`))
                }
            }
        });
    }

    // Themes who??
    Dashboard.loadThemes = function () {
        readdirSync('./extensions/dbm_dashboard_EXT/public/themes').forEach(dir => {
            const themes = readdirSync(`./extensions/dbm_dashboard_EXT/public/themes/${dir}/`).filter(file => file.endsWith('.css'));
            for (let file of themes) {
                Dashboard.themes.set(dir, `/themes/${dir}/${file}`);
                if (Dashboard.devMode) console.log(chalk.green(`Successfully loaded ${file}`));
            }
        })
    }

    Dashboard.loadCustomRoutes = function () {
        if (Dashboard.routes) {
            Dashboard.routes.forEach(data => {
                if (data.routeUrl) {
                    Dashboard.app.get(data.routeUrl, function (req, res) {
                        res.render('customRoute', {
                            custom: data.html(Dashboard.app, Dashboard.config, DBM, Dashboard.config, DBM.Bot.bot, req, res)
                        });
                        data.run(Dashboard.app, Dashboard.config, DBM, Dashboard.config, DBM.Bot.bot)
                    })
                } else {
                    data.run(Dashboard.app, Dashboard.config, DBM, Dashboard.config, DBM.Bot.bot)
                }
            })
        }
    }

}