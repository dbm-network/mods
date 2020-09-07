# DBM Dashboard

  CURRENTLY NOT WORKING, MAIN FILE HAS BEEN REMOVED


> You can find user created mods [here](https://github.com/greatplainsmodding/DBM-Dashboard-Mods).<br>
> Want to try out new features? You can install the beta version [here](https://github.com/greatplainsmodding/DBM-Dashboard)<br>
> If you find any bugs please report them [here](https://github.com/greatplainsmodding/DBM-Dashboard/issues).

| DBM Dashboard Features | Description |                                                      |                                    
| -------------------------------------------------------------- | ----------------------------------- | ----------------------------------------------------
| Admin Panel | Manage your bot from the admin panel.
| Custom Mods | Anyone that knows javascript can create mods and extensions for the dashboard.)
| Custom Routes | With custom routes people can create their own pages for the dashboard.)
| Custom Extensions | On the admin panel and the dashboard panel, you can use extensions to add your own sections.)
| Dashboard | People can login to the dashboard, invite your bot, and manage their server.
| Landing Page | You need a website to show off your awesome bot! 

## Links
> [Developer Portal](https://discordapp.com/developers)<br>
> [DBM Network](https://discord.gg/3QxkZPK)<br>

## Step 1
> Download the needed files. You can clone them through CMD if you have git installed. After you have downloaded the files, unzip them and paste them into your bots extensions folder.

## Step 2 
> Open DBM and navigate to <code>Extensions < DBM Dashboard</code> Place your ID in the field where it says <b>Owner ID</b>.
>
> Next you will need to navigate to the [Developer Portal](https://discordapp.com/developers). Click on <b>General Information</b> and copy your client secret. After you copy that go back to DBM and paste it where it says <b>clientSecret</b>. Navigate back to the [Developer Portal](https://discordapp.com/developers) and click on <b>OAuth2</b>. Click where it says <b>Add Redirect</b> and paste this URL <code>http://localhost:3000/dashboard/callback</code>

## Step 3
> Go to your bots main folder then go to <code>/extensions/dbm_dashboard_extension</code> and do <code>npm i</code> and then start your bot!

## Step 4
> Now to configure the dashboard! Navigate to <code>http://localhost:3000/dashboard/admin</code> and here you can change the text for the landing page located here <code>http://localhost:3000/</code>

## Glitch
```
    "body-parser": "^1.19.0",
    "chalk": "^3.0.0",
    "figlet": "^1.2.4",
    "cookie-parser": "^1.4.4",
    "ejs": "^3.0.1",
    "express": "^4.17.1",
    "express-session": "^1.17.0",
    "fs": "0.0.1-security",
    "passport": "^0.4.1",
    "passport-discord": "^0.1.3",
    "path": "^0.12.7"
```

## Bugs
> Did you find a bug? You can report bugs [here](https://github.com/greatplainsmodding/DBM-Dashboard/issues).

## Other Info
> <b>Creating Mods:</b> Just like DBM you can create mods for DBM Dashboard! Its just like DBM.<br>
> <b>Dashboard:</b> The dashboard part will be coming soon, for now you are stuck with the admin panel! The dashboard will be just like the admin panel. People can create mods for it and do whatever!<br>
> <b>Report Bugs:</b> Please don't ping me or dm me! You can report bugs [here](https://github.com/greatplainsmodding/DBM-Dashboard/issues).
