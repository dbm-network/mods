# WebAPI

# Note: Store Variable From WebAPI is being depricated, please use the new Store JSON From WebAPI & Parse From Stored Json mods.

**More info here!** - https://github.com/generalwrex/WrexMods

Note: The mods in **DBM Mods** should be used over the mods on General Wrex's github repository if they exist in **DBM Mods**

**General Wrex's Repository**: https://github.com/generalwrex/WrexMods

# WrexMODS - Store JSON From WebAPI & Parse From Stored Json

# Forum topic and example
https://dbotmaker.io/forums/threads/create-variable-from-json-webapi.85/

 # Changes
     * Now supports the use of JsonPATH in both Store and Parse 


**WEBAPI  - Using API Keys in google's json webapi is appending** ```?key=[keygoeshere]``` ** to the end of your Google API url, google how to create a API key in googles developer console for how to create a key**


 # Path Finder 
  **A Helper program to get the JSON Path for this mod**
    You can find it here!
    https://github.com/generalwrex/DBM-WebAPI-Parser-PathFinder


 # JSON Path
 
 Find out more information about JSON Path here - http://goessner.net/articles/JsonPath/index.html#e2
 Test it out here! http://jsonPath.com
 
 ![jsonpathfirst](https://i.gyazo.com/f073451e1ad976860a097422c90ea754.png)
 
 ![jsonpathsecond](https://i.gyazo.com/e0e07b4fa87ebe31c3b16bfbf7679697.png)
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