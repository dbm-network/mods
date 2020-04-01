module.exports = {
    //----------------------------------------------------------------------------------
    // Usado para definir o nome do mod / extensão.
    // Note que se esta é uma extensão, ela não pode ter espaço ou não funcionará.
    name: "Delete Bulk Messages",
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // Here you can configure what section you want your mod to show up on the dashboard / admin panel. 
    //Se este for um modificador de extensão ou rota, você pode deixar em branco.
    section: "Dashboard",
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // true if this is a mod for the dashboard.
    dashboardMod: true,
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // true if this is a mod for the admin panel.
    adminMod: false,
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
    author: "AstinHighty",
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // Here you define the version of the mod / extension.
    version: "1.5.0",
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // You can set the mods description. 
    // You only need this if its a mod for the admin panel or dashboard.
    short_description: "Exclude a certain number of messages from a channel",
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
    html: function () {
        return `
        <div class="form-group">
            <p>Find Channel by:</p>
            <select class="form-control" name="channelType">
                <option selected value="id">Channel ID</option>
                <option value="name">Channel Name</option>
            </select><br>
            <p>Channel ID / Name:</p>
            <input class="form-control" name="channel" rows="4" required><br><br>
            <p>Amount:</p>
            <input class="form-control" name="amount" rows="4" required placeholder="2 to 100">
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
    // Ran when the dashboard if first started
    init: async (DBM) => {
        
    },
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // Whenever the command is executed this is the code that will be ran. 
    // You can use req to get stuff, note this only works if you add custom html. 
    run: async (app, config, DBM, client, req, res, server) => {
     let channel;

        try {
            if (!server) {
                if (req.body.serverType == 'id') server = client.guilds.find(server => server.id === req.body.server);
                if (!server) server = client.guilds.find(server => server.name === req.body.server);
                if (!server) return req.user.log = 'This server could not be found, please make sure you have the right ID or name.';
            }
    
            if (req.body.channelType == 'id') channel = server.channels.find(channel => channel.id === req.body.channel);
            if (!channel) channel = client.guilds.find(channel => channel.name === req.body.channel);
            if (!channel) return req.user.log = 'This server could not be found, please make sure you have the right ID or name.';
    
            channel.bulkDelete(req.body.amount)
            req.user.log = `${req.body.amount} messages were deleted on the "${channel.name}" | "${server.name}"`;  
        } catch (error) {
            req.user.log = 'We ran into an error.';
        }
    }
    //----------------------------------------------------------------------------------
}
