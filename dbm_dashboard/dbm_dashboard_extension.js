module.exports = {

	//---------------------------------------------------------------------
	// Editor Extension Name
	//
	// This is the name of the editor extension displayed in the editor.
	//---------------------------------------------------------------------

	name: "DBM Dashboard",

	//---------------------------------------------------------------------
	// Is Command Extension
	//
	// Must be true to appear in "command" context menu.
	// This means each "command" will hold its own copy of this data.
	//---------------------------------------------------------------------

	isCommandExtension: false,

	//---------------------------------------------------------------------
	// Is Event Extension
	//
	// Must be true to appear in "event" context menu.
	// This means each "event" will hold its own copy of this data.
	//---------------------------------------------------------------------

	isEventExtension: false,

	//---------------------------------------------------------------------
	// Is Editor Extension
	//
	// Must be true to appear in the main editor context menu.
	// This means there will only be one copy of this data per project.
	//---------------------------------------------------------------------

	isEditorExtension: true,

	//---------------------------------------------------------------------
	// Extension Fields
	//
	// These are the fields for the extension. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the command's/event's JSON data.
	//---------------------------------------------------------------------

	fields: [
		"port", "clientSecret", "callbackURL", "owner", "supportServer"
	],

	//---------------------------------------------------------------------
	// Default Fields
	//
	// The default values of the fields.
	//---------------------------------------------------------------------

	defaultFields: {
		port: require('../extensions/dbm_dashboard_extension/config.json').port,
		clientSecret: require('../extensions/dbm_dashboard_extension/config.json').clientSecret,
		callbackURL: require('../extensions/dbm_dashboard_extension/config.json').callbackURL,
		owner: require('../extensions/dbm_dashboard_extension/config.json').owner,
		supportServer: require('../extensions/dbm_dashboard_extension/config.json').supportServer
	},

	//---------------------------------------------------------------------
	// Extension Dialog Size
	//
	// Returns the size of the extension dialog.
	//---------------------------------------------------------------------

	size: function () {
		return {
			width: 700,
			height: 540
		};
	},

	//---------------------------------------------------------------------
	// Extension HTML
	//
	// This function returns a string containing the HTML used for
	// the context menu dialog.
	//---------------------------------------------------------------------

	html: function (data, DBM) {
		return `
		<div style="overflow-y: scroll; overflow-x: hidden; width: 100%">
			<div style="padding-left: 15px; padding-top: 3px; width: 100%">
				<div>
					<p>
						<u><b>Extension Info:</b></u><br>
						<b>Version:</b> 1.0.0<br>
						<b>Created by:</b> Great Plains Modding<br><br>
					</p>
				</div>
				<div style="float: left; width: 99%;">
					Port:<br>
					<input type="text" value="${data.port}" class="round" style="padding-bottom: 3px;" id="port"><br>
					clientSecret:<br>
					<input type="text" value="${data.clientSecret}" class="round" id="clientSecret"><br>
					callbackURL:<br>
					<input type="text" value="${data.callbackURL}" class="round" id="callbackURL"><br>
					Owner ID:<br>
					<input type="text" value="${data.owner}" class="round" id="owner"><br>
					supportServer:<br>
					<input type="text" value="${data.supportServer}" class="round" id="supportServer"><br>
				</div>
			</div>
		</div>`
	},

	//---------------------------------------------------------------------
	// Extension Dialog Init Code
	//
	// When the HTML is first applied to the extension dialog, this code
	// is also run. This helps add modifications or setup reactionary
	// functions for the DOM elements.
	//---------------------------------------------------------------------

	init: function () {

	},

	//---------------------------------------------------------------------
	// Extension Dialog Close Code
	//
	// When the dialog is closed, this is called. Use it to save the data.
	//---------------------------------------------------------------------

	close: function (document, data) {
		data.port = String(document.getElementById("port").value);
		data.clientSecret = String(document.getElementById("clientSecret").value);
		data.callbackURL = String(document.getElementById("callbackURL").value);
		data.owner = String(document.getElementById("owner").value);
		data.supportServer = String(document.getElementById("supportServer").value);

		try {
			const config = require('./dbm_dashboard_extension/config.json');
			const dashboardConfigPath = require("path").join(__dirname, "../extensions", "dbm_dashboard_extension", "config.json");
			const configNew = {
				port: data.port,
				isBotSharded: false,
				tokenSecret: Math.random().toString(36).substr(2),
				clientSecret: data.clientSecret,
				callbackURL: data.callbackURL,
				owner: data.owner,
				inviteLink: "/dashboard/@me",
				supportServer: data.supportServer,
				introText: config.introText,
				footerText: config.footerText,
				theme: "default",
				isGlitch: config.isGlitch
			};

			configNew.featureOne = config.featureOne;
			configNew.featureTwo = config.featureTwo;
			configNew.featureThree = config.featureThree;
			configNew.featureFour = config.featureFour;
			configNew.navItems = config.navItems;

			let settings = JSON.stringify(configNew);
			require("fs").writeFileSync(dashboardConfigPath, settings, "utf8");
		} catch (error) {
			require("fs").writeFileSync("dashboard-errors.txt", error, "utf8");
		};
	},

	//---------------------------------------------------------------------
	// Extension On Load
	//
	// If an extension has a function for "load", it will be called
	// whenever the editor loads data.
	//
	// The "DBM" parameter is the global variable. Store loaded data within it.
	//---------------------------------------------------------------------

	load: function (DBM, projectLoc) {

	},

	//---------------------------------------------------------------------
	// Extension On Save
	//
	// If an extension has a function for "save", it will be called
	// whenever the editor saves data.
	//
	// The "data" parameter contains all data. Use this to modify
	// the data that is saved. The properties correspond to the
	// data file names:
	//
	//  - data.commands
	//  - data.settings
	// etc...
	//---------------------------------------------------------------------

	save: function (DBM, data, projectLoc) {

	},

	//---------------------------------------------------------------------
	// Editor Extension Bot Mod
	//
	// Upon initialization of the bot, this code is run. Using the bot's
	// DBM namespace, one can add/modify existing functions if necessary.
	// In order to reduce conflictions between mods, be sure to alias
	// functions you wish to overwrite.
	//
	// This is absolutely necessary for editor extensions since it
	// allows us to setup modifications for the necessary functions
	// we want to change.
	//
	// The client object can be retrieved from: `const bot = DBM.Bot.bot;`
	// Classes can be retrieved also using it: `const { Actions, Event } = DBM;`
	//---------------------------------------------------------------------

	mod: function (DBM) {
		let devMode = false
		DBM.lastPage = new Map();
		DBM.actionsExecuted = new Map();

		const {
			dashboardConfig,
			ready
		} = require('../extensions/dbm_dashboard_extension/functions');
		const config = dashboardConfig()



		// Mini module handler
		const path = require("path");
		moduleRequire = function (packageName) {
			if (config.isGlitch) {
				const nodeModulesPath = path.join(__dirname, "../node_modules", packageName);
				return require(nodeModulesPath)
			} else {
				const nodeModulesPath = path.join(__dirname, "dbm_dashboard_extension", "node_modules", packageName);
				return require(nodeModulesPath)
			}
		};

		const express = moduleRequire('express'),
			{ fs, readdirSync } = require("fs"),
			chalk = moduleRequire('chalk'),
			bodyParser = moduleRequire('body-parser'),
			cookieParser = moduleRequire('cookie-parser'),
			ejs = moduleRequire('ejs'),
			Strategy = moduleRequire('passport-discord').Strategy,
			session = moduleRequire('express-session'),
			passport = moduleRequire('passport');

		var app = express();
		app.themes = new Map();
		app.routes = new Map();
		app.actions = new Map();

		// Pulls all of the files from actions to be used as mods!
		readdirSync('./extensions/dbm_dashboard_extension/actions').forEach(dir => {
			const actions = readdirSync(`./extensions/dbm_dashboard_extension/actions/${dir}/`).filter(file => file.endsWith('.js'));
			for (let file of actions) {
				let pull = require(`../extensions/dbm_dashboard_extension/actions/${dir}/${file}`);
				app.actions.set(pull.name, pull);
				if (devMode) console.log(chalk.green(`Successfully loaded ${pull.name}`))
			}
		});

		// Route handler
		readdirSync('./extensions/dbm_dashboard_extension/actions').forEach(dir => {
			const actions = readdirSync(`./extensions/dbm_dashboard_extension/actions/${dir}/`).filter(file => file.endsWith('.js'));
			for (let file of actions) {
				let pull = require(`../extensions/dbm_dashboard_extension/actions/${dir}/${file}`);
				if (pull.routeMod) {
					app.routes.set(pull.name, pull);
					if (devMode) console.log(chalk.green(`Successfully loaded ${pull.name}`))
				}
			}
		});

		// Themes who??
		readdirSync('./extensions/dbm_dashboard_extension/public/themes').forEach(dir => {
			const themes = readdirSync(`./extensions/dbm_dashboard_extension/public/themes/${dir}/`).filter(file => file.endsWith('.css'));
			for (let file of themes) {
				app.themes.set(dir, `/themes/${dir}/${file}`);
				if (devMode) console.log(chalk.green(`Successfully loaded ${file}`));
			}
		})

		// We wait for the bot to be ready so these dmb nerds dont break it
		DBM.Bot.onReady = function () {
			const client = DBM.Bot.bot;
			let scopes = ['identify', 'guilds'];
			//
			// Define the express server settings
			app.set('view engine', 'ejs');
			app.use(express.static(path.join(__dirname, '/dbm_dashboard_extension/public')));
			app.set('views', path.join(__dirname, '/dbm_dashboard_extension/views'));
			app.use(cookieParser(config.tokenSecret));
			app.use(session({
				secret: config.tokenSecret,
				resave: false,
				saveUninitialized: false
			}));
			app.use(bodyParser.urlencoded({
				extended: true
			}));
			app.use(passport.initialize());
			app.use(passport.session());
			passport.serializeUser(function (user, done) {
				done(null, user);
			});
			passport.deserializeUser(function (obj, done) {
				done(null, obj);
			});

			passport.use(new Strategy({
				clientID: DBM.Bot.bot.user.id,
				clientSecret: config.clientSecret,
				callbackURL: config.callbackURL,
				scope: scopes
			}, (accessToken, refreshToken, profile, done) => {
				process.nextTick(() => {
					return done(null, profile);
				});
			}));

			app.get('/login', passport.authenticate('discord', {
				scope: scopes
			}), function (req, res) {});

			app.get('/dashboard/callback',
				passport.authenticate('discord', {
					failureRedirect: '/dashboard/@me'
				}),
				function (req, res) {
					adminCommandExecuted(req, false)
					dashboardCommandExecuted(req, false)
					if (req.user.id == config.owner) return res.redirect('/dashboard/admin');
					res.redirect('/dashboard/@me');
				}
			);

			if (app.routes) {
				app.routes.forEach(data => {
					if (data.routeUrl) {
						app.get(data.routeUrl, function (req, res) {
							res.render('customRoute', {
								custom: data.html(app, config, DBM, dashboardConfig, DBM.Bot.bot, req, res)
							});
							data.run(app, config, DBM, dashboardConfig, DBM.Bot.bot)
						})
					} else {
						data.run(app, config, DBM, dashboardConfig, DBM.Bot.bot)
					}
				})
			}

			function checkAuth(req, res, next) {
				if (req.isAuthenticated()) {
					return next()
				}
				res.redirect('/login');
			}

			function checkAuthOwner(req, res, next) {
				if (req.isAuthenticated()) {
					if (req.user.id == config.owner) {
						next();
					} else res.redirect('/dashboard/@me');
				} else res.redirect('/login');
			}

			function adminCommandExecuted(req, commandExecuted) {
				let data = {
					adminCommandExecuted: commandExecuted
				}
				DBM.actionsExecuted.set(req.user.id, data);
			};

			function dashboardCommandExecuted(req, dashboardCommandExecuted) {
				let data = {
					dashboardCommandExecuted: dashboardCommandExecuted
				}
				DBM.actionsExecuted.set(req.user.id, data);
			};

			function theme() {
				let theme = app.themes.get(config.theme);
				return theme
			}

			async function sections() {
				let actions = app.actions;
				let section = []
				await actions.forEach(action => {
					if (!section.includes(action.section)) {
						section.push(action.section)
					}
				});
			}

			app.listen(config.port, () => ready());
		};
	}
};
