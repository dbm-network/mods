module.exports = {
    //----------------------------------------------------------------------------------
    // Used to set the name of the mod / extension. 
    // Note if this is an extension it cant have a space or it will not work.
    name: "Send Embed Message",
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // Here you can configure what section you want your mod to show up on the dashboard / admin panel. 
    // If this is an extension or route mod you can leave this blank.
    section: "Dashboard",
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // true if this is a mod for the dashboard.
    dashboardMod: true,
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // true if this is a mod for the admin panel.
    adminMod: true,
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // true if this is a mod for routes.
    routeMod: false,
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // If this route mod will only have 1 url you can set the url here. 
    // If not you will need to create your own routes in the run section.
    routeUrl: '',
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // Toggle this if you are creating a extension.
    extensionMod: false,
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // You can put your name here or whoever it was created by.
    author: "Zoom",
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // Here you define the version of the mod / extension.
    version: "1.0.0",
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // You can set the mods description. 
    // You only need this if its a mod for the admin panel or dashboard.
    short_description: "Sends a custom embed to a server.",
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // If this is for a mod and you want to add custom html to the mod set this to true.
    // If you are using this as a custom route you can leave this true or false as it will still pull the custom html.
    customHtml: true,
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // Change the width of the popup for mods.
    size: function () {
        return {
            width: 1000
        };
    },
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // Here you can add your custom html! 
    // Note if customHtml is set to false this will now show up. 
    // This is also valid bootstrap. Also note that this html code will be placed inside of <form> so if you want to retrieve the data all you need to do is add the fields.
    // Also if you are using this mod for a custom route you can place your html code here and this is what will show up on the page. 
    // Note this is not inside of form tags if this is a custom route.
    html: function (requestFromAdmin) {
        if (requestFromAdmin) {
            return `
            <div class="form-row">
                <div class="form-group col-md-6"
                    <p>Find Server By:</p>
                        <select class="form-control" name="serverType">
                        <option selected value="id">Guild ID</option>
                        <option value="name">Guild Name</option>
                    </select>
                </div>
                <div class="form-group col-md-6"
                    <p>Guild ID / Guild Name</p>
                    <input type="text" class="form-control" name="server" placeholder="Guild ID / Guild Name">
                </div>
            </div>
    
            <div class="form-row">
                <div class="form-group col-md-6">
                    <p>Find Channel By:</p>
                        <select class="form-control" name="channelType">
                        <option selected value="id">Guild ID</option>
                        <option value="name">Guild Name</option>
                    </select>
                </div>
                <div class="form-group col-md-6"
                    <p>Channel ID / Channel Name</p>
                    <input type="text" class="form-control" name="channel" placeholder="Channel ID / Channel Name">
                </div>
            </div>
    
            <div class="form-row">
                <div class="form-group col-md-6">
                    <p>Title:</p>
                    <input class="form-control" name="title" required>
                </div>
                <div class="form-group col-md-6">
                    <p>URL:</p>
                    <input class="form-control" name="url" placeholder="Leave blank for no URL">
                </div>
            </div>
    
            <div class="form-row">
                <div class="form-group col-md-6">
                    <p>Author:</p>
                    <input class="form-control" name="author" required>
                </div>
                <div class="form-group col-md-6">
                    <p>Author Picture:</p>
                    <input class="form-control" name="authorpic" placeholder="Leave blank for no picture">
                </div>
            </div>
    
            <div class="form-group">
                <p>Embed Color: <code>*Use HEX when putting in color. Type "RANDOM" for a random color</code></p>
                <input style="min-width: 100%" class="form-control" name="color" placeholder="Leave blank for no color">
            </div>
    
            <div class="form-group">
                <p>Description:</p>
                <textarea style="width: 100%" class="form-control" name="description" rows="4" style="min-width: 100%"></textarea>
            </div>
    
            <div class="form-row">
                <div class="form-group col-md-6">
                    <p>Footer:</p>
                    <input class="form-control" name="footer" rows="4" placeholder="Leave blank for no footer">
                </div>
                <div class="form-group col-md-6">
                    <p>Footer URL:</p>
                    <input class="form-control" name="footerurl" rows="4" placeholder="Leave blank for no URL">
                </div>
            </div>
            `
        } else {
            return `
            <div class="form-row">
                <div class="form-group col-md-6">
                    <p>Find Channel By:</p>
                        <select class="form-control" name="channelType">
                        <option selected value="id">Channel ID</option>
                        <option value="name">Channel Name</option>
                    </select>
                </div>
                <div class="form-group col-md-6"
                    <p>Channel ID / Channel Name</p>
                    <input type="text" class="form-control" name="channel" placeholder="Channel ID / Channel Name">
                </div>
            </div>
    
            <div class="form-row">
                <div class="form-group col-md-6">
                    <p>Title:</p>
                    <input class="form-control" name="title" required>
                </div>
                <div class="form-group col-md-6">
                    <p>URL:</p>
                    <input class="form-control" name="url" placeholder="Leave blank for no URL">
                </div>
            </div>
    
            <div class="form-row">
                <div class="form-group col-md-6">
                    <p>Author:</p>
                    <input class="form-control" name="author" required>
                </div>
                <div class="form-group col-md-6">
                    <p>Author Picture:</p>
                    <input class="form-control" name="authorpic" placeholder="Leave blank for no picture">
                </div>
            </div>
    
            <div class="form-group">
                <p>Embed Color: <code>*Use HEX when putting in color. Type "RANDOM" for a random color</code></p>
                <input style="min-width: 100%" class="form-control" name="color" placeholder="Leave blank for no color">
            </div>
    
            <div class="form-group">
                <p>Description:</p>
                <textarea style="width: 100%" class="form-control" name="description" rows="4" style="min-width: 100%"></textarea>
            </div>
    
            <div class="form-row">
                <div class="form-group col-md-6">
                    <p>Footer:</p>
                    <input class="form-control" name="footer" rows="4" placeholder="Leave blank for no footer">
                </div>
                <div class="form-group col-md-6">
                    <p>Footer URL:</p>
                    <input class="form-control" name="footerurl" rows="4" placeholder="Leave blank for no URL">
                </div>
            </div>
            `
        }
    },
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // This is used to move on to the next action. 
    // When the code is ran it will return to the dashboard but if you want to redirect you need to set this to false.
    next: true,
    //----------------------------------------------------------------------------------


    //----------------------------------------------------------------------------------
    // Whenever the command is executed this is the code that will be ran. 
    // You can use req to get stuff, note this only works if you add custom html. 
    run: async (app, config, DBM, client, req, res, server) => {
        let channel;
        if (!server) {
            if (req.body.serverType == 'id') server = client.guilds.find(server => server.id === req.body.server);
            if (!server) server = client.guilds.find(server => server.name === req.body.server);
            if (!server) return client.log = 'I couldn\'t find this server, please make sure you have the right ID or name.';
        }

        if (req.body.channelType == 'id') channel = server.channels.find(channel => channel.id === req.body.channel);
        if (!channel) channel = client.guilds.find(channel => channel.name === req.body.channel);
        if (!channel) return client.log = 'I couldn\'t find this channel, please make sure you have the right ID or name.';

        const embed = new Discord.RichEmbed()
            .setColor(req.body.color)
            .setTitle(req.body.title)
            .setURL(req.body.url)
            .setAuthor(req.body.author, req.body.authorpic)
            .setDescription(req.body.description)
            .setThumbnail(req.body.thumb)
            .setImage(req.body.image)
            .setFooter(req.body.footer, req.body.footerurl);
        channel.send(embed);

        client.log = `Successfully sent the embed to ${server.name}`;
    }
    //----------------------------------------------------------------------------------
}