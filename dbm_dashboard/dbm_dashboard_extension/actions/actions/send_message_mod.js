module.exports = {
    //----------------------------------------------------------------------------------
    // Used to set the name of the mod / extension. 
    // Note if this is an extension it cant have a space or it will not work.
    name: "Send Message",
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // Here you can configure what section you want your mod to show up on the dashboard / admin panel. 
    // If this is an extension or route mod you can leave this blank.
    section: "Dashboard",
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // true if this is a mod for the dashboard.
    dashboardMod: false,
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
    author: "Great Plains Modding",
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // Here you define the version of the mod / extension.
    version: "1.0.0",
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // You can set the mods description. 
    // You only need this if its a mod for the admin panel or dashboard.
    short_description: "Sends a message to the specified server and channel.",
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
            width: 700
        };
    },
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // Here you can add your custom html! 
    // Note if customHtml is set to false this will now show up. 
    // This is also valid bootstrap. Also note that this html code will be placed inside of <form> so if you want to retrieve the data all you need to do is add the fields.
    // Also if you are using this mod for a custom route you can place your html code here and this is what will show up on the page. 
    // Note this is not inside of form tags if this is a custom route.
    html: function () {
        return `
        <div class="form-group">
            <p>Find Server By:</p>
            <select class="form-control" name="serverType">
                <option selected value="id">Guild ID</option>
                <option value="name">Guild Name</option>
            </select><br>
            <p>Guild ID / Name:</p>
            <input class="form-control" name="server" rows="4" required><br><br>
            <p>Find Channel By:</p>
            <select class="form-control" name="channelType">
                <option selected value="id">Channel ID</option>
                <option value="name">Channel Name</option>
            </select><br>
            <p>Channel ID / Name:</p>
            <input class="form-control" name="channel" rows="4" required><br><br>
            <p>Message:</p>
            <textarea class="form-control" name="message" rows="4" required style="width=100%"></textarea>
        </div>
        `
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
        if (req.body.serverType == 'id') server = client.guilds.find(server => server.id === req.body.server);
        if (!server) server = client.guilds.find(server => server.name === req.body.server);
        if (!server) return client.log = 'I couldn\'t find this server, please make sure you have the right ID or name.';

        if (req.body.channelType == 'id') channel = server.channels.find(channel => channel.id === req.body.channel);
        if (!channel) channel = client.guilds.find(channel => channel.name === req.body.channel);
        if (!channel) return client.log = 'I couldn\'t find this channel, please make sure you have the right ID or name.';


        channel.send(req.body.message);
        client.log = `Successfully sent the message to ${server.name}`;
    }
    //----------------------------------------------------------------------------------
}