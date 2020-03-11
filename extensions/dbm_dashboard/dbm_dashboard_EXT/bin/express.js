module.exports = function (DBM) {
    let Dashboard = DBM.Dashboard;

    // Require needed modules
    const express = Dashboard.requireModule('express'),
        bodyParser = Dashboard.requireModule('body-parser'),
        cookieParser = Dashboard.requireModule('cookie-parser'),
        ejs = Dashboard.requireModule('ejs'),
        Strategy = Dashboard.requireModule('passport-discord').Strategy,
        session = Dashboard.requireModule('express-session'),
        path = Dashboard.requireModule('path'),
        passport = Dashboard.requireModule('passport'),
        url = require('url');

    const client = DBM.Bot.bot;
    let scopes = ['identify', 'guilds'];

    // Define the express server settings
    Dashboard.app.set('view engine', 'ejs');
    Dashboard.app.use(express.static(path.join(__dirname, 'public')));
    Dashboard.app.set('views', path.join(__dirname, 'views'));
    Dashboard.app.use(cookieParser(Dashboard.config.tokenSecret));
    Dashboard.app.use(session({
        secret: Dashboard.config.tokenSecret,
        resave: false,
        saveUninitialized: false
    }));

    Dashboard.app.use(bodyParser.urlencoded({
        extended: true
    }));

    Dashboard.app.use(passport.initialize());
    Dashboard.app.use(passport.session());
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    passport.use(new Strategy({
        clientID: DBM.Bot.bot.user.id,
        clientSecret: Dashboard.config.clientSecret,
        callbackURL: Dashboard.config.callbackURL,
        scope: scopes
    }, (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => {
            return done(null, profile);
        });
    }));

    Dashboard.app.get('/login', passport.authenticate('discord', {
        scope: scopes
    }), function (req, res, next) {
        if (req.session.backURL) {
            req.session.backURL = req.session.backURL;
        } else if (req.headers.referer) {
            const parsed = url.parse(req.headers.referer);
            if (parsed.hostname === router.locals.domain) {
                req.session.backURL = parsed.path;
            };
        } else {
            req.session.backURL = '/'
        };
        next();
    });

    Dashboard.app.get('/dashboard/callback',
        passport.authenticate('discord', {
            failureRedirect: '/'
        }),
        function (req, res) {
            Dashboard.commandExecuted(req, false);
            Dashboard.commandExecuted(req, false);
            res.redirect('/dashboard/@me');
            Dashboard.onLogin(req);
        }
    );

    // Startup the dashboard!!!
    Dashboard.loadActions();
    Dashboard.loadRoutes();
    Dashboard.loadThemes();
    Dashboard.loadDashboard();
    Dashboard.loadCustomRoutes();

    Dashboard.app.listen(Dashboard.config.port, () => Dashboard.onReady());
}