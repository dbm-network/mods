module.exports = {
    //----------------------------------------------------------------------------------
    // Used to set the name of the mod / extension. 
    // Note if this is an extension it cant have a space or it will not work.
    name: "Dashboard-Logs",
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // Here you can configure what section you want your mod to show up on the dashboard / admin panel. 
    // If this is an extension or route mod you can leave this blank.
    section: "",
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // true if this is a mod for the dashboard.
    dashboardMod: false,
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
    author: "Great Plains Modding",
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // Here you define the version of the mod / extension.
    version: "1.0.0",
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // You can set the mods description. 
    // You only need this if its a mod for the admin panel or dashboard.
    short_description: "",
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // If this is for a mod and you want to add custom html to the mod set this to true.
    // If you are using this as a custom route you can leave this true or false as it will still pull the custom html.
    // Also if this is an extension it will only show up in the dashboard if this is set to true. 
    customHtml: false,
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
        <table class="table table-striped table-dark">
            <thead style="background-color: #2C2F33;">
                <tr style="background-color: #23272A;">
                    <th>Member</th>
                    <th>Member ID</th>
                    <th>Command</th>
                    <th>Date</th>
                </tr>
                <tr> 
                    <td><%= render.test %></td>
                    <td>12345678935656</td>
                    <td>Bot Ping</td>
                    <td>3/3/2020</td>
                </tr>
            </thead>
        </table>
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
        const moment = DBM.Dashboard.requireModule("moment");
        // Create your own functions so other mods can edit them. Note if you overwrite a mod the filename will need to start with zzz
        DBM.Dashboard.loggingExtension = function () {
            DBM.Dashboard.loggingExtension = DBM.Dashboard.onCommandExecute || {};
            DBM.Dashboard.onCommandExecute = function (req, command) {
                let data = {
                        "userID": req.user.id,
                        "action": command.name,
                        "date": moment().format('MM/DD/YYYY')
                    }

                let oldData = DBM.Dashboard.retrieveData("dashboardLogging");
                if (!oldData) oldData = [];
                oldData.push(data);
                DBM.Dashboard.insertData("dashboardLogging", oldData)
                DBM.Dashboard.loggingExtension.apply(this, arguments);
            };
        };
        

        // Now we need to run  our function
        DBM.Dashboard.loggingExtension();
        
    },
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // Whenever the command is executed this is the code that will be ran. 
    // You can use req to get stuff, note this only works if you add custom html. 
    run: async (app, config, DBM, client, req, res, server) => {

    }
    //----------------------------------------------------------------------------------
}