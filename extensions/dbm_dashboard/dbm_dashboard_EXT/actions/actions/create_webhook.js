module.exports = {
    //----------------------------------------------------------------------------------
    // Used to set the name of the mod / extension. 
    // Note if this is an extension it cant have a space or it will not work.
    name: "Create Webhook",
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
    author: "Dominus_Marceau",
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // Here you define the version of the mod / extension.
    version: "1.0.0",
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // You can set the mods description. 
    // You only need this if its a mod for the admin panel or dashboard.
    short_description: "Create a Webhook.",
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
    // Pass data through here to use ejs
    render: function (data) {
        return data
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
                    <p>Webhook Name:</p>
                    <input class="form-control" name="title" required>
                </div>
               <div class="form-group col-md-6">
                    <p>Profile Pic:</p>
                    <input class="form-control" name="webhookpic" placeholder="Leave blank for no picture">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group col-md-6">
                    <p>Webhook Message:</p>
                    <input class="form-control" name="message" placeholder="Leave blank for no message">
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
                    <p>Webhook Name:</p>
                    <input class="form-control" name="title" required>
                      </div>
                <div class="form-group col-md-6">
                    <p>Profile Pic:</p>
                    <input class="form-control" name="webhookpic" placeholder="Leave blank for no picture">
                </div>
            </div>
    
            <div class="form-row">
                <div class="form-group col-md-6">
                    <p>Message:</p>
                    <input class="form-control" name="message" placeholder="Leave blank for no message">
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
    // Ran when the dashboard if first started
    init: async (DBM) => {
        
    },
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // Whenever the command is executed this is the code that will be ran. 
    // You can use req to get stuff, note this only works if you add custom html. 
    run: async (app, config, DBM, client, req, res, server) => {

        const Discord = require("discord.js")
        let channel;

        try {
            if (!server) {
                if (req.body.serverType == 'id') server = client.guilds.find(server => server.id === req.body.server);
                if (!server) server = client.guilds.find(server => server.name === req.body.server);
                if (!server) return req.user.log = 'I couldn\'t find this server, please make sure you have the right ID or name.';
            }
    
            if (req.body.channelType == 'id') channel = server.channels.find(channel => channel.id === req.body.channel);
            if (!channel) channel = client.guilds.find(channel => channel.name === req.body.channel);
            if (!channel) return req.user.log = 'I couldn\'t find this channel, please make sure you have the right ID or name.';
    

               channel.createWebhook(req.body.title, req.body.webhookpico)
                  .then(webhook => webhook.send(req.body.message))


            // const embed = new Discord.RichEmbed()
            //     .setURL(req.body.url)
            //     .setAuthor(req.body.author, req.body.authorpic)
            //     .setDescription(req.body.description)
            //     .setThumbnail(req.body.thumb)
            //     .setImage(req.body.image)
            //     .setFooter(req.body.footer, req.body.footerurl);
            // channel.send(embed);
    
            req.user.log = `Successfully created webhook at ${server.name}`;
        } catch (error) {
            console.log(error)
            req.user.log = 'We ran into an error.';
        }
    }
    //----------------------------------------------------------------------------------
}
