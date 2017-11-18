# DBM-webapi-parsing

# Forum topic and example
https://dbotmaker.io/forums/threads/create-variable-from-json-webapi.85/

 # Changes
     * Can now use variables in the URL and Path textboxes.
     * added console logging to print what's going on in your bots console.


 # Installation: 

Choose the one you need from Release

Extract the folder in Discord Bot Makers base directory
 ex. "steamapps\common\Discord Bot Maker <-"

Restart Discord Bot Maker

Remember to extract it in your projects directory as well if you want it in your bot!


 # Contributing

**Thanks to Tresmos for the help with testing!**

If you want to help, just fork it out, make your changes and do a pull request!

Here is a link to the github pages that contains the current menu for this action
https://generalwrex.github.io/DBM-webapi-parsing


 # How to get the path
 
 Here is our example
 
![jsonimage](https://i.gyazo.com/349715d816924fd40c7d521f5d45f798.png)


![jsontree](https://i.gyazo.com/7e1529df4b2894f9875ead96b56c01d8.png)

Interact with it here! https://jsonblob.com/

Lets say we wanted to get the **"b"** object from that ( the highlighted one )

the path to the **"b"** object would be  **"object.object.a"**

the path to the **"Hello World"** string would be **"object.string"**

the path to the **"123"** would be **"object.number"**

To pull an object from the array, it would be **object.array[0]** for 1, **array[1]** for 2, and **array[2]** for 3"
Instead of **array.0** its **array[0]**.

**When typing these into the path, always ignore the root variable as thats already there.**

so if you wanted the path to output **"Hello World"**, you would type  **string**  into the path textbox. (removing **object.** from it)

Have fun!
 
 
