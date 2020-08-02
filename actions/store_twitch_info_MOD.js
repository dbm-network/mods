module.exports = {
  name: 'Store Twitch Info',
  section: 'Other Stuff',

  subtitle (data) {
    const sourceType = parseInt(data.type) // "Channel", "Stream", "Video" or "Game"
    const inputType = parseInt(data.inputtype) // "ID" or "Name"

    const info1 = parseInt(data.info1)
    const info2 = parseInt(data.info2)
    const info3 = parseInt(data.info3)
    const info4 = parseInt(data.info4)

    const list1 = ['User ID', 'User Login Name', 'User Display Name', 'User Type', 'Broadcaster Type', 'Channel Description', 'Channel Profile Picture', 'Channel Offline Picture', 'Channel View Count', 'Channel Follower Count', 'Channel Following Count']// User & Channel Info
    const list2 = ['Stream ID', 'User ID', 'User Display Name', 'Game ID', 'REMOVED OPTION', 'Live Status', 'Stream Title', 'Viewer Count', 'Started At Time', 'Language Code', 'Thumbnail URL', 'Tag IDs', 'Game Name']// Stream Info
    const list3 = ['Video IDs', 'User IDs', 'User Display Names', 'Video Titles', 'Video Descriptions', 'Video Creation Dates', 'Video Publish Dates', 'Video URLs', 'Video Thumbnail URLs', 'Videos Viewable?', 'Video Viewcounts', 'Video Languages', 'Video Types', 'Video Durations', 'Video Durations in Seconds']// Video Info
    const list4 = ['Game ID', 'Game Name', 'Game Box Art URL', 'Popular Games List (Game IDs)', 'Popular Games List (Game Names)', 'Popular Games List (Game Box Art URLs)']// Game Info

    var infoNum1 = 0
    var infoNum2
    var infoList1 = []
    var infoList2 = []
    var infoName1 = ''
    var infoName2 = ''

    switch (sourceType) { // "Channel", "Stream", "Video" or "Game"
      case 0:
        infoList1 = list1 // Channel
        infoNum1 = info1
        infoName2 = 'Channel'
        switch (inputType) {
          case 0: // User ID
            infoName1 = 'ID'
            break
          case 1: // User Login Name
            if (sourceType > 0) {
              infoName1 = 'ID'
            } else if (info1 < 9) {
              infoName1 = 'Login Name'
            } else {
              infoName1 = 'ID'
            };
            break
        };
        break
      case 1:
        infoList1 = list2 // Stream
        infoNum1 = info2
        infoName2 = 'User'
        break
      case 2:
        infoList1 = list3 // Video
        infoNum1 = info3
        infoName2 = 'Video'
        break
      case 3:
        infoList1 = list4 // Game
        infoNum1 = info4
        infoName2 = 'Game'
        switch (inputType) {
          case 0:
            infoName1 = 'ID'
            break
          case 1:
            infoName1 = 'Name'
            break
        };
        break
    };

    infoList2.push(`from ${infoName2} ${infoName1} "${data.input.toString()}"`)
    infoList2.push('')

    if (info4 > 2 && sourceType === 3) {
      infoNum2 = 1
    } else {
      infoNum2 = 0
    };

    return `Get "${infoList1[parseInt(infoNum1)]}" ${infoList2[parseInt(infoNum2)]}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    const sourceType = parseInt(data.type) // "Channel", "Stream", "Video" or "Game"
    if (type !== varType) return
    var dataType = 'Unknown Type'

    if (sourceType === 0) { // Source Type: Channel
      var info1 = parseInt(data.info1)
      switch (info1) {
        case 0:
        case 8:
        case 9:
        case 10:
          dataType = 'Number'
          break
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          dataType = 'Text'
          break
        case 6:
        case 7:
          dataType = 'Image URL'
          break
      };
    } else if (sourceType === 1) { // Source Type: Stream
      var info2 = parseInt(data.info2)
      switch (info2) {
        case 0:
        case 1:
        case 7:
        case 12:
        case 8:
          dataType = 'Number'
          break
        case 2:
        case 6:
        case 3:
        case 9:
          dataType = 'Text'
          break
        case 5:
          dataType = 'Boolean'
          break
        case 10:
          dataType = 'Image URL'
          break
        case 4:
        case 11: dataType = 'List'
          break
      }
    } else if (sourceType === 2) { // Source Type: Video
      /* var info3 = parseInt(data.info3); */
      dataType = 'List'
    } else if (sourceType === 3) { // Source Type: Game
      var info4 = parseInt(data.info4)
      switch (info4) {
        case 0:
          dataType = 'Number'
          break
        case 1:
          dataType = 'Text'
          break
        case 2:
          dataType = 'Image URL'
          break
        case 3:
        case 4:
        case 5:
          dataType = 'List'
          break
      };
    };

    return ([data.varName, dataType])
  },

  fields: ['wrexdiv', 'type', 'divinputtype', 'inputtype', 'divinput', 'input', 'divinfo1', 'info1', 'divinfo2', 'info2', 'divinfo3', 'info3', 'divinfo4', 'info4', 'clientid', 'token', 'results', 'divresults', 'storage', 'varName', 'cache'],

  html (isEvent, data) {
    return `
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll; overflow-x: hidden;">
  <div style="float: left; width: 42%;">
    <br>Source Type:<br>
    <select id="type" class="round" onchange="glob.onChange1(this)">
      <option value="0" selected>Channel Info</option>
      <option value="1">Stream Info</option>
      <option value="2">Video Info</option>
      <option value="3">Game Info</option>
    </select>
  </div>
  <div id="divinputtype" style="padding-left: 5%; float: left; width: 52%; display: none;">
    <br>Input Type:<br>
    <select id="inputtype" class="round" onchange="glob.onChange2(this)" style="display: none;">
      <option value="0" selected>ID</option>
      <option value="1">Name</option>
    </select>
  </div>
  <div id="divinput" style="float: left; width: 99%; padding-top: 8px;">
    <span id="tempName1">User</span> <span id="tempName2">ID</span>:<br>
    <textarea id="input" rows="2" placeholder="Please insert the needed information..." style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
  </div>
  <div id="divinfo1"; style="float: left; width: 94%; padding-top: 8px; display: none;" onchange="glob.onChange3(this)">
    Source Channel Info:<br>
    <select id="info1" class="round">
      <option value="0">User ID</option>
      <option value="1">User Login Name</option>
      <option value="2" selected>User Display Name</option>
      <option value="3">User Type</option>
      <option value="4">Broadcaster Type</option>
      <option value="5">Channel Description</option>
      <option value="6">Channel Profile Picture URL</option>
      <option value="7">Channel Offline Picture URL</option>
      <option value="8">Channel View Count</option>
      <option value="9">Channel Follower Count</option>
      <option value="10">Channel Following Count</option>
    </select>
  </div>
  <div id="divinfo2"; style="float: left; width: 94%; padding-top: 8px; display: none;">
    Source Stream Info:<br>
    <select id="info2" class="round">
      <option value="5">Is Live?</option>
      <option value="0">Stream ID</option>
      <option value="6" selected>Stream Title</option>
      <option value="7">Viewer Count</option>
      <option value="8">Started At</option>
      <option value="9">Language Code</option>
      <option value="10">Thumbnail URL</option>
      <option value="1">User ID</option>
      <option value="2">User Display Name</option>
      <option value="12">Game Name</option>
      <option value="3">Game ID</option>
      <option hidden value="4">Community IDs</option>
      <option value="11">Tag IDs</option>
    </select>
  </div>
  <div id="divinfo3"; style="float: left; width: 94%; padding-top: 8px; display: none;">
    Source Video Info:<br>
    <select id="info3" class="round">
      <option value="1">User ID</option>
      <option value="2">User Display Name</option>
      <option value="0">Video IDs</option>
      <option value="3" selected>Video Titles</option>
      <option value="4">Video Descriptions</option>
      <option value="5">Video Creation Dates</option>
      <option value="6">Video Publish Dates</option>
      <option value="7">Video URLs</option>
      <option value="8">Video Thumbnail URLs</option>
      <option value="9">Videos Viewable?</option>
      <option value="10">Video Viewcounts</option>
      <option value="11">Video Languages</option>
      <option value="12">Video Types</option>
      <option value="13">Video Durations</option>
      <option value="14">Video Durations in Seconds</option>
    </select>
  </div>
  <div id="divinfo4"; style="float: left; width: 94%; padding-top: 8px; display: none;" onchange="glob.onChange4(this)">
    Source Game Info:<br>
    <select id="info4" class="round">
      <option value="0">Game ID</option>
      <option value="1">Game Name</option>
      <option value="2">Game Box Art URL</option>
      <option value="3">Popular Games List (Game IDs)</option>
      <option value="4">Popular Games List (Game Names)</option>
      <option value="5">Popular Games List (Game Box Art URLs)</option>
    </select>
  </div>
  <div style="float: left; width: 50%; padding-top: 8px;">
    Client ID:<br>
    <input id="clientid" class="round" type="text" placeholder="Insert your Twitch Application Client ID...">
  </div>
  <div style="float: right; width: 50%; padding-top: 8px;">
    Access Token:<br>
    <input id="token" class="round" type="text" placeholder="Insert your Twitch Application Access Token...">
  </div>
  <div id="divresults" style="float: left; width: 95%; padding-top: 8px; display: none;">
    Max Results:<br>
    <input id="results" class="round" type="text" placeholder="Default: 20 | Max: 100">
  </div>
  <div>
    <div style="float: left; width: 35%;  padding-top: 8px;">
      Store In:<br>
      <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
        ${data.variables[1]}
      </select>
    </div>
    <div id="varNameContainer" style="float: right; width: 60%; padding-top: 8px;">
      Variable Name:<br>
      <input id="varName" class="round" type="text"><br>
    </div>
  </div>
  <div>
    <div style="float: left; width: 60%; padding-top: 8px;">
      Read From Cache:<br>
      <select id="cache" class="round">
        <option value="true" selected>True</option>
        <option value="false">False (Recache)</option>
      </select>
    </div>
    <div style="float: left; padding-top: 8px;">
      <p>
        <u>API Info:</u><br>
        You will need a <span class="wrexlink" data-url="https://dev.twitch.tv/console/apps">Twitch Applications</span> to use this mod!<br><br>
        <u>Client ID Introductions:</u><br>
        To get a client id: login through Twitch, create a new application. Then insert your favourite application name & some url (this could be your GitHub page).<br>
        Then select the category "Application Integration" down below and click on create! You should now be in your application list again.<br>
        You need to edit your application once more to copy the client id.<br><br>
        <u>API Limitations:</u><br>
        Please go to the <span class="wrexlink2" data-url2="https://dev.twitch.tv/docs/api/guide/#rate-limits">Twitch API Rate Limits Page</span> if need this information.<br><br>
        <u>Explanations of individual source types:</u><br>
        • User Types: "staff", "admin", "global_mod" or ""<br>
        • Broadcaster Types: "partner", "affiliate" or ""<br>
        • Video Types: "upload", "archive" or "highlight"<br>
        • Video Duration: Will return something like "3h8m33s"<br>
      </p>
    </div>
  </div>
</div>
<style>
  span.wrexlink {
    color: #99b3ff;
    text-decoration:underline;
    cursor:pointer;
  }

  span.wrexlink:hover {
    color:#4676b9;
  }

  span.wrexlink2 {
    color: #99b3ff;
    text-decoration:underline;
    cursor:pointer;
  }

  span.wrexlink2:hover {
    color:#4676b9;
  }
</style>`
  },

  init () {
    const { glob, document } = this

    try {
      var wrexlinks = document.getElementsByClassName('wrexlink')
      for (var x = 0; x < wrexlinks.length; x++) {
        var wrexlink = wrexlinks[x]
        var url = wrexlink.getAttribute('data-url')
        if (url) {
          wrexlink.setAttribute('title', url)
          wrexlink.addEventListener('click', function (e) {
            e.stopImmediatePropagation()
            console.log('Launching URL: [' + url + '] in your default browser.')
            require('child_process').execSync('start ' + url)
          })
        }
      }

      var wrexlinks2 = document.getElementsByClassName('wrexlink2')
      for (var x2 = 0; x2 < wrexlinks2.length; x2++) {
        var wrexlink2 = wrexlinks2[x2]
        var url2 = wrexlink2.getAttribute('data-url2')
        if (url2) {
          wrexlink2.setAttribute('title', url2)
          wrexlink2.addEventListener('click', function (e2) {
            e2.stopImmediatePropagation()
            console.log('Launching URL: [' + url2 + '] in your default browser.')
            require('child_process').execSync('start ' + url2)
          })
        }
      }
    } catch (error) { // Write any init errors to errors.txt in dbm's main directory
      require('fs').appendFile('errors.txt', error.stack ? error.stack : error + '\r\n')
    }

    glob.onChange1 = function () { // "Channel", "Stream", "Video" or "Game"
      const id1 = parseInt(document.getElementById('type').value)// Source Type: "Channel", "Stream", "Video" or "Game"
      const infoDiv1 = document.getElementById('divinfo1')// Source Channel Info
      const info1 = document.getElementById('info1')// Source Channel Info
      const infoDiv2 = document.getElementById('divinfo2')// Source Stream Info
      const info2 = document.getElementById('info2')// Source Stream Info
      const infoDiv3 = document.getElementById('divinfo3')// Source Video Info
      const info3 = document.getElementById('info3')// Source Video Info
      const infoDiv4 = document.getElementById('divinfo4')// Source Game Info
      const info4 = document.getElementById('info4')// Source Game Info
      const inputType = document.getElementById('inputtype')// InputType: "ID" or "Name"
      const inputTypeDiv = document.getElementById('divinputtype')// Div of InputType
      const results = document.getElementById('results')// Max Results
      const resultsDiv = document.getElementById('divresults')// Max Results
      const inputList1 = ['ID', 'Login Name']// List for "switch": "case 0"
      const inputList2 = ['ID', 'Name']// List for "switch": "case 3"

      // Change HTML Stuff
      var result1 = ''
      var result2 = ''
      switch (id1) {
        case 0: // User & Channel
          result1 = 'User'
          if (parseInt(info1.value) < 9) {
            result2 = inputList1[parseInt(inputType.value)]
            inputType.style.display = null
            inputTypeDiv.style.display = null
          } else {
            result2 = 'ID'
            inputType.style.display = 'none'
            inputTypeDiv.style.display = 'none'
          }
          infoDiv1.style.display = null
          info1.style.display = null
          infoDiv2.style.display = 'none'
          info2.style.display = 'none'
          infoDiv3.style.display = 'none'
          info3.style.display = 'none'
          infoDiv4.style.display = 'none'
          info4.style.display = 'none'
          /* inputType.style.display = null;
          inputTypeDiv.style.display = null; */
          results.style.display = 'none'
          resultsDiv.style.display = 'none'
          break
        case 1: // Stream
          result1 = 'User'
          result2 = inputList2[parseInt(inputType.value)]
          infoDiv1.style.display = 'none'
          info1.style.display = 'none'
          infoDiv2.style.display = null
          info2.style.display = null
          infoDiv3.style.display = 'none'
          info3.style.display = 'none'
          infoDiv4.style.display = 'none'
          info4.style.display = 'none'
          inputType.style.display = null
          inputTypeDiv.style.display = null
          results.style.display = 'none'
          resultsDiv.style.display = 'none'
          break
        case 2: // Video
          result1 = 'User'
          result2 = 'ID'
          infoDiv1.style.display = 'none'
          info1.style.display = 'none'
          infoDiv2.style.display = 'none'
          info2.style.display = 'none'
          infoDiv3.style.display = null
          info3.style.display = null
          infoDiv4.style.display = 'none'
          info4.style.display = 'none'
          inputType.style.display = 'none'
          inputTypeDiv.style.display = 'none'
          results.style.display = null
          resultsDiv.style.display = null
          break
        case 3: // Game
          result1 = 'Game'
          result2 = inputList2[parseInt(inputType.value)]
          if (parseInt(info4.value) < 3) {
            inputType.style.display = null
            inputTypeDiv.style.display = null
          } else {
            inputType.style.display = 'none'
            inputTypeDiv.style.display = 'none'
          };
          infoDiv1.style.display = 'none'
          info1.style.display = 'none'
          infoDiv2.style.display = 'none'
          info2.style.display = 'none'
          infoDiv3.style.display = 'none'
          info3.style.display = 'none'
          infoDiv4.style.display = null
          info4.style.display = null
          /* inputType.style.display = null;
          inputTypeDiv.style.display = null; */
          results.style.display = 'none'
          resultsDiv.style.display = 'none'
          break
      }

      document.getElementById('tempName1').innerHTML = result1
      document.getElementById('tempName2').innerHTML = result2
    }

    glob.onChange2 = function () { // "ID" or "Login Name"
      const id1 = parseInt(document.getElementById('type').value) // Source Type: "Channel", "Stream", "Video" or "Game"
      const id2 = parseInt(document.getElementById('inputtype').value) // Input Type

      var result = ''
      if (id1 === 0) {
        switch (id2) {
          case 0:
            result = 'ID'
            break
          case 1:
            if (id2 > 0) {
              result = 'Login Name'
            } else {
              result = 'ID'
            }
            break
        }
      } else if ([1, 3].includes(id1)) {
        switch (id2) {
          case 0:
            result = 'ID'
            break
          case 1:
            result = 'Name'
        }
      } else {
        result = 'ID'
      }

      document.getElementById('tempName2').innerHTML = result
    }

    glob.onChange3 = function () { // Source Channel Info
      const id4 = parseInt(document.getElementById('info1').value) // Source Channel Info
      const inputType = document.getElementById('inputtype') // InputType: "ID" or "Login Name"
      const inputTypeDiv = document.getElementById('divinputtype') // Div of InputType
      const inputList1 = ['ID', 'Login Name'] // List for "case 0"

      var result2 = ''
      if (id4 < 9) {
        inputType.style.display = null
        inputTypeDiv.style.display = null
        result2 = inputList1[parseInt(inputType.value)]
      } else {
        inputType.style.display = 'none'
        inputTypeDiv.style.display = 'none'
        result2 = 'ID'
      }

      document.getElementById('tempName2').innerHTML = result2
    }

    glob.onChange4 = function () { // Source Game Info
      const id1 = parseInt(document.getElementById('type').value) // Source Type: "Channel", "Stream", "Video" or "Game"
      const id5 = parseInt(document.getElementById('info4').value) // Source Game Info
      const inputType = document.getElementById('inputtype') // InputType: "ID" or "Login Name"
      const inputTypeDiv = document.getElementById('divinputtype') // Div of InputType

      if (id1 === 3) {
        if (parseInt(id5) < 3) {
          inputType.style.display = null
          inputTypeDiv.style.display = null
        } else {
          inputType.style.display = 'none'
          inputTypeDiv.style.display = 'none'
        }
      } else if (id1 === 1 || id1 === 2) {
        inputType.style.display = 'none'
        inputTypeDiv.style.display = 'none'
      } else {
        inputType.style.display = null
        inputTypeDiv.style.display = null
      }
    }

    // Load HTML Stuff if a user opens the action in DBM
    document.getElementById('type')
    document.getElementById('inputtype').style.display = null
    document.getElementById('divinputtype').style.display = null
    document.getElementById('info1')
    document.getElementById('info4')

    // On Type Change
    glob.onChange1(document.getElementById('type')) // For the "Source Type"
    glob.onChange2(document.getElementById('inputtype')) // For the "Input Type"
    glob.onChange3(document.getElementById('info1')) // For Source Info: Channel
    glob.onChange4(document.getElementById('info4')) // For Source Info: Game
    glob.variableChange(document.getElementById('storage'), 'varNameContainer')
  },

  async action (cache) {
    const data = cache.actions[cache.index]
    const Mods = this.getMods()
    const fetch = Mods.require('node-fetch')

    const input = this.evalMessage(data.input, cache)
    const clientID = this.evalMessage(data.clientid, cache)
    const token = this.evalMessage(data.token, cache)
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const cacheBoolean = data.cache === 'true'
    if (!token) return console.log('Store Twitch Info: Please insert access token!')
    if (!clientID) return console.log('Store Twitch Info: Please insert a client id!')
    if (!input) return console.log('Store Twitch Info: Please insert something to search for!')
    const api = 'https://api.twitch.tv/helix/'
    const headers = { 'Client-ID': clientID, Authorization: 'Bearer ' + token }

    let searchResults = parseInt(data.results) // Default: 20 | Max: 100 (Because of API limitation!)
    if (searchResults && !isNaN(searchResults)) {
      if (searchResults > 100) searchResults = 100
    } else {
      searchResults = 20
    }

    const inputType = parseInt(data.inputtype) // Channel "ID" or "Name"
    const type = parseInt(data.type) // "Channel", "Stream", "Video" or "Game"
    let infoType
    switch (type) {
      case 0:
        infoType = parseInt(data.info1)
        break
      case 1:
        infoType = parseInt(data.info2)
        break
      case 2:
        infoType = parseInt(data.info3)
        break
      case 3:
        infoType = parseInt(data.info4)
        break
    }

    let url = api
    let json
    switch (type) {
      case 0: // Channel
        if (infoType === 9) {
          url += `users/follows?to_id=${input}&first=2`
        } else if (infoType === 10) {
          url += `users/follows?from_id=${input}&first=2`
        } else {
          if (inputType === 0) {
            url += `users?id=${input}`
          } else {
            url += `users?login=${input}`
          }
        }
        json = await getApi.call(this, url)
        if (json && json.data.length !== 0) {
          let result
          switch (infoType) {
            case 0:
              result = json.data[0].id
              break
            case 1:
              result = json.data[0].login
              break
            case 2:
              result = json.data[0].display_name
              break
            case 3: // "staff", "admin", "global_mod", or ""
              result = json.data[0].type
              break
            case 4: // "partner", "affiliate", or ""
              result = json.data[0].broadcaster_type
              break
            case 5:
              result = json.data[0].description
              break
            case 6:
              result = json.data[0].profile_image_url
              break
            case 7:
              result = json.data[0].offline_image_url
              break
            case 8:
              result = json.data[0].view_count
              break
            case 9:
            case 10:
              result = json.total
              break
          }
          this.storeValue(result, storage, varName, cache)
        } else if (json && json.message) {
          console.error(json)
        } else {
          console.log(`No results for ${input}.`)
        }
        break
      case 1: // Stream
        if (inputType === 0) {
          url += `streams?user_id=${input}`
        } else {
          url += `streams?user_login=${input}`
        }
        json = await getApi.call(this, url)
        if (json && json.data.length !== 0) {
          let result
          const iso2 = [{ code: 'ab', name: 'Abkhaz' }, { code: 'aa', name: 'Afar' }, { code: 'af', name: 'Afrikaans' }, { code: 'ak', name: 'Akan' }, { code: 'sq', name: 'Albanian' }, { code: 'am', name: 'Amharic' }, { code: 'ar', name: 'Arabic' }, { code: 'an', name: 'Aragonese' }, { code: 'hy', name: 'Armenian' }, { code: 'as', name: 'Assamese' }, { code: 'av', name: 'Avaric' }, { code: 'ae', name: 'Avestan' }, { code: 'ay', name: 'Aymara' }, { code: 'az', name: 'Azerbaijani' }, { code: 'bm', name: 'Bambara' }, { code: 'ba', name: 'Bashkir' }, { code: 'eu', name: 'Basque' }, { code: 'be', name: 'Belarusian' }, { code: 'bn', name: 'Bengali; Bangla' }, { code: 'bh', name: 'Bihari' }, { code: 'bi', name: 'Bislama' }, { code: 'bs', name: 'Bosnian' }, { code: 'br', name: 'Breton' }, { code: 'bg', name: 'Bulgarian' }, { code: 'my', name: 'Burmese' }, { code: 'ca', name: 'Catalan; Valencian' }, { code: 'ch', name: 'Chamorro' }, { code: 'ce', name: 'Chechen' }, { code: 'ny', name: 'Chichewa; Chewa; Nyanja' }, { code: 'zh', name: 'Chinese' }, { code: 'cv', name: 'Chuvash' }, { code: 'kw', name: 'Cornish' }, { code: 'co', name: 'Corsican' }, { code: 'cr', name: 'Cree' }, { code: 'hr', name: 'Croatian' }, { code: 'cs', name: 'Czech' }, { code: 'da', name: 'Danish' }, { code: 'dv', name: 'Divehi; Dhivehi; Maldivian;' }, { code: 'nl', name: 'Dutch' }, { code: 'dz', name: 'Dzongkha' }, { code: 'en', name: 'English' }, { code: 'eo', name: 'Esperanto' }, { code: 'et', name: 'Estonian' }, { code: 'ee', name: 'Ewe' }, { code: 'fo', name: 'Faroese' }, { code: 'fj', name: 'Fijian' }, { code: 'fi', name: 'Finnish' }, { code: 'fr', name: 'French' }, { code: 'ff', name: 'Fula; Fulah; Pulaar; Pular' }, { code: 'gl', name: 'Galician' }, { code: 'ka', name: 'Georgian' }, { code: 'de', name: 'German' }, { code: 'el', name: 'Greek, Modern' }, { code: 'gn', name: 'GuaranÃ­' }, { code: 'gu', name: 'Gujarati' }, { code: 'ht', name: 'Haitian; Haitian Creole' }, { code: 'ha', name: 'Hausa' }, { code: 'he', name: 'Hebrew (modern)' }, { code: 'hz', name: 'Herero' }, { code: 'hi', name: 'Hindi' }, { code: 'ho', name: 'Hiri Motu' }, { code: 'hu', name: 'Hungarian' }, { code: 'ia', name: 'Interlingua' }, { code: 'id', name: 'Indonesian' }, { code: 'ie', name: 'Interlingue' }, { code: 'ga', name: 'Irish' }, { code: 'ig', name: 'Igbo' }, { code: 'ik', name: 'Inupiaq' }, { code: 'io', name: 'Ido' }, { code: 'is', name: 'Icelandic' }, { code: 'it', name: 'Italian' }, { code: 'iu', name: 'Inuktitut' }, { code: 'ja', name: 'Japanese' }, { code: 'jv', name: 'Javanese' }, { code: 'kl', name: 'Kalaallisut, Greenlandic' }, { code: 'kn', name: 'Kannada' }, { code: 'kr', name: 'Kanuri' }, { code: 'ks', name: 'Kashmiri' }, { code: 'kk', name: 'Kazakh' }, { code: 'km', name: 'Khmer' }, { code: 'ki', name: 'Kikuyu, Gikuyu' }, { code: 'rw', name: 'Kinyarwanda' }, { code: 'ky', name: 'Kyrgyz' }, { code: 'kv', name: 'Komi' }, { code: 'kg', name: 'Kongo' }, { code: 'ko', name: 'Korean' }, { code: 'ku', name: 'Kurdish' }, { code: 'kj', name: 'Kwanyama, Kuanyama' }, { code: 'la', name: 'Latin' }, { code: 'lb', name: 'Luxembourgish, Letzeburgesch' }, { code: 'lg', name: 'Ganda' }, { code: 'li', name: 'Limburgish, Limburgan, Limburger' }, { code: 'ln', name: 'Lingala' }, { code: 'lo', name: 'Lao' }, { code: 'lt', name: 'Lithuanian' }, { code: 'lu', name: 'Luba-Katanga' }, { code: 'lv', name: 'Latvian' }, { code: 'gv', name: 'Manx' }, { code: 'mk', name: 'Macedonian' }, { code: 'mg', name: 'Malagasy' }, { code: 'ms', name: 'Malay' }, { code: 'ml', name: 'Malayalam' }, { code: 'mt', name: 'Maltese' }, { code: 'mi', name: 'MÄori' }, { code: 'mr', name: 'Marathi (MarÄá¹­hÄ«)' }, { code: 'mh', name: 'Marshallese' }, { code: 'mn', name: 'Mongolian' }, { code: 'na', name: 'Nauru' }, { code: 'nv', name: 'Navajo, Navaho' }, { code: 'nb', name: 'Norwegian BokmÃ¥l' }, { code: 'nd', name: 'North Ndebele' }, { code: 'ne', name: 'Nepali' }, { code: 'ng', name: 'Ndonga' }, { code: 'nn', name: 'Norwegian Nynorsk' }, { code: 'no', name: 'Norwegian' }, { code: 'ii', name: 'Nuosu' }, { code: 'nr', name: 'South Ndebele' }, { code: 'oc', name: 'Occitan' }, { code: 'oj', name: 'Ojibwe, Ojibwa' }, { code: 'cu', name: 'Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic' }, { code: 'om', name: 'Oromo' }, { code: 'or', name: 'Oriya' }, { code: 'os', name: 'Ossetian, Ossetic' }, { code: 'pa', name: 'Panjabi, Punjabi' }, { code: 'pi', name: 'PÄli' }, { code: 'fa', name: 'Persian (Farsi)' }, { code: 'pl', name: 'Polish' }, { code: 'ps', name: 'Pashto, Pushto' }, { code: 'pt', name: 'Portuguese' }, { code: 'qu', name: 'Quechua' }, { code: 'rm', name: 'Romansh' }, { code: 'rn', name: 'Kirundi' }, { code: 'ro', name: 'Romanian, [])' }, { code: 'ru', name: 'Russian' }, { code: 'sa', name: 'Sanskrit (Saá¹ská¹›ta)' }, { code: 'sc', name: 'Sardinian' }, { code: 'sd', name: 'Sindhi' }, { code: 'se', name: 'Northern Sami' }, { code: 'sm', name: 'Samoan' }, { code: 'sg', name: 'Sango' }, { code: 'sr', name: 'Serbian' }, { code: 'gd', name: 'Scottish Gaelic; Gaelic' }, { code: 'sn', name: 'Shona' }, { code: 'si', name: 'Sinhala, Sinhalese' }, { code: 'sk', name: 'Slovak' }, { code: 'sl', name: 'Slovene' }, { code: 'so', name: 'Somali' }, { code: 'st', name: 'Southern Sotho' }, { code: 'az', name: 'South Azerbaijani' }, { code: 'es', name: 'Spanish; Castilian' }, { code: 'su', name: 'Sundanese' }, { code: 'sw', name: 'Swahili' }, { code: 'ss', name: 'Swati' }, { code: 'sv', name: 'Swedish' }, { code: 'ta', name: 'Tamil' }, { code: 'te', name: 'Telugu' }, { code: 'tg', name: 'Tajik' }, { code: 'th', name: 'Thai' }, { code: 'ti', name: 'Tigrinya' }, { code: 'bo', name: 'Tibetan Standard, Tibetan, Central' }, { code: 'tk', name: 'Turkmen' }, { code: 'tl', name: 'Tagalog' }, { code: 'tn', name: 'Tswana' }, { code: 'to', name: 'Tonga (Tonga Islands)' }, { code: 'tr', name: 'Turkish' }, { code: 'ts', name: 'Tsonga' }, { code: 'tt', name: 'Tatar' }, { code: 'tw', name: 'Twi' }, { code: 'ty', name: 'Tahitian' }, { code: 'ug', name: 'Uyghur, Uighur' }, { code: 'uk', name: 'Ukrainian' }, { code: 'ur', name: 'Urdu' }, { code: 'uz', name: 'Uzbek' }, { code: 've', name: 'Venda' }, { code: 'vi', name: 'Vietnamese' }, { code: 'vo', name: 'VolapÃ¼k' }, { code: 'wa', name: 'Walloon' }, { code: 'cy', name: 'Welsh' }, { code: 'wo', name: 'Wolof' }, { code: 'fy', name: 'Western Frisian' }, { code: 'xh', name: 'Xhosa' }, { code: 'yi', name: 'Yiddish' }, { code: 'yo', name: 'Yoruba' }, { code: 'za', name: 'Zhuang, Chuang' }, { code: 'zu', name: 'Zulu' }]
          switch (infoType) {
            case 0:
              result = json.data[0].id
              break
            case 1:
              result = json.data[0].user_id
              break
            case 2:
              result = json.data[0].user_name
              break
            case 3:
              result = json.data[0].game_id
              break
            // case 4: result = json.data[0].community_ids; break;
            case 5:
              result = Boolean(json.data[0] !== undefined)
              break
            case 6:
              result = json.data[0].title
              break
            case 7:
              result = json.data[0].viewer_count
              break
            case 8:
              result = json.data[0].started_at
              break
            case 9:
              result = iso2.find(lang => lang.code === json.data[0].language).name
              break
            case 10:
              result = json.data[0].thumbnail_url.replace('{width}', '1920').replace('{height}', '1280')
              break
            case 11:
              url = `${api}streams/tags?broadcaster_id=${json.data[0].user_id}`
              const respond = await getApi.call(this, url)
              if (respond && respond.data) {
                result = respond.data.map((tag) => { return tag.localization_names['en-us'] })
              } else if (respond && respond.message) {
                console.error(respond)
              } else {
                console.log(`No results for ${input}.`)
              }
              break
            case 12:
              url = `${api}games?id=${json.data[0].game_id}`
              const respond12 = await getApi.call(this, url)
              if (respond12 && respond12.data) {
                result = respond12.data[0].name
              } else if (respond12 && respond12.message) {
                console.error(respond12)
              } else {
                console.log(`No results for ${input}`)
              }
              break
            default:
              console.log('Please update mod or the input from dbm!!!')
          }
          this.storeValue(result, storage, varName, cache)
        } else if (json && json.message) {
          console.error(json)
        } else {
          console.log(`No results for ${input}.`)
        }
        break
      case 2: // Video
        url += `videos?user_id=${input}&first=${searchResults}`
        json = await getApi.call(this, url)
        if (json && json.data.length !== 0) {
          let result
          const iso2 = [{ code: 'ab', name: 'Abkhaz' }, { code: 'aa', name: 'Afar' }, { code: 'af', name: 'Afrikaans' }, { code: 'ak', name: 'Akan' }, { code: 'sq', name: 'Albanian' }, { code: 'am', name: 'Amharic' }, { code: 'ar', name: 'Arabic' }, { code: 'an', name: 'Aragonese' }, { code: 'hy', name: 'Armenian' }, { code: 'as', name: 'Assamese' }, { code: 'av', name: 'Avaric' }, { code: 'ae', name: 'Avestan' }, { code: 'ay', name: 'Aymara' }, { code: 'az', name: 'Azerbaijani' }, { code: 'bm', name: 'Bambara' }, { code: 'ba', name: 'Bashkir' }, { code: 'eu', name: 'Basque' }, { code: 'be', name: 'Belarusian' }, { code: 'bn', name: 'Bengali; Bangla' }, { code: 'bh', name: 'Bihari' }, { code: 'bi', name: 'Bislama' }, { code: 'bs', name: 'Bosnian' }, { code: 'br', name: 'Breton' }, { code: 'bg', name: 'Bulgarian' }, { code: 'my', name: 'Burmese' }, { code: 'ca', name: 'Catalan; Valencian' }, { code: 'ch', name: 'Chamorro' }, { code: 'ce', name: 'Chechen' }, { code: 'ny', name: 'Chichewa; Chewa; Nyanja' }, { code: 'zh', name: 'Chinese' }, { code: 'cv', name: 'Chuvash' }, { code: 'kw', name: 'Cornish' }, { code: 'co', name: 'Corsican' }, { code: 'cr', name: 'Cree' }, { code: 'hr', name: 'Croatian' }, { code: 'cs', name: 'Czech' }, { code: 'da', name: 'Danish' }, { code: 'dv', name: 'Divehi; Dhivehi; Maldivian;' }, { code: 'nl', name: 'Dutch' }, { code: 'dz', name: 'Dzongkha' }, { code: 'en', name: 'English' }, { code: 'eo', name: 'Esperanto' }, { code: 'et', name: 'Estonian' }, { code: 'ee', name: 'Ewe' }, { code: 'fo', name: 'Faroese' }, { code: 'fj', name: 'Fijian' }, { code: 'fi', name: 'Finnish' }, { code: 'fr', name: 'French' }, { code: 'ff', name: 'Fula; Fulah; Pulaar; Pular' }, { code: 'gl', name: 'Galician' }, { code: 'ka', name: 'Georgian' }, { code: 'de', name: 'German' }, { code: 'el', name: 'Greek, Modern' }, { code: 'gn', name: 'GuaranÃ­' }, { code: 'gu', name: 'Gujarati' }, { code: 'ht', name: 'Haitian; Haitian Creole' }, { code: 'ha', name: 'Hausa' }, { code: 'he', name: 'Hebrew (modern)' }, { code: 'hz', name: 'Herero' }, { code: 'hi', name: 'Hindi' }, { code: 'ho', name: 'Hiri Motu' }, { code: 'hu', name: 'Hungarian' }, { code: 'ia', name: 'Interlingua' }, { code: 'id', name: 'Indonesian' }, { code: 'ie', name: 'Interlingue' }, { code: 'ga', name: 'Irish' }, { code: 'ig', name: 'Igbo' }, { code: 'ik', name: 'Inupiaq' }, { code: 'io', name: 'Ido' }, { code: 'is', name: 'Icelandic' }, { code: 'it', name: 'Italian' }, { code: 'iu', name: 'Inuktitut' }, { code: 'ja', name: 'Japanese' }, { code: 'jv', name: 'Javanese' }, { code: 'kl', name: 'Kalaallisut, Greenlandic' }, { code: 'kn', name: 'Kannada' }, { code: 'kr', name: 'Kanuri' }, { code: 'ks', name: 'Kashmiri' }, { code: 'kk', name: 'Kazakh' }, { code: 'km', name: 'Khmer' }, { code: 'ki', name: 'Kikuyu, Gikuyu' }, { code: 'rw', name: 'Kinyarwanda' }, { code: 'ky', name: 'Kyrgyz' }, { code: 'kv', name: 'Komi' }, { code: 'kg', name: 'Kongo' }, { code: 'ko', name: 'Korean' }, { code: 'ku', name: 'Kurdish' }, { code: 'kj', name: 'Kwanyama, Kuanyama' }, { code: 'la', name: 'Latin' }, { code: 'lb', name: 'Luxembourgish, Letzeburgesch' }, { code: 'lg', name: 'Ganda' }, { code: 'li', name: 'Limburgish, Limburgan, Limburger' }, { code: 'ln', name: 'Lingala' }, { code: 'lo', name: 'Lao' }, { code: 'lt', name: 'Lithuanian' }, { code: 'lu', name: 'Luba-Katanga' }, { code: 'lv', name: 'Latvian' }, { code: 'gv', name: 'Manx' }, { code: 'mk', name: 'Macedonian' }, { code: 'mg', name: 'Malagasy' }, { code: 'ms', name: 'Malay' }, { code: 'ml', name: 'Malayalam' }, { code: 'mt', name: 'Maltese' }, { code: 'mi', name: 'MÄori' }, { code: 'mr', name: 'Marathi (MarÄá¹­hÄ«)' }, { code: 'mh', name: 'Marshallese' }, { code: 'mn', name: 'Mongolian' }, { code: 'na', name: 'Nauru' }, { code: 'nv', name: 'Navajo, Navaho' }, { code: 'nb', name: 'Norwegian BokmÃ¥l' }, { code: 'nd', name: 'North Ndebele' }, { code: 'ne', name: 'Nepali' }, { code: 'ng', name: 'Ndonga' }, { code: 'nn', name: 'Norwegian Nynorsk' }, { code: 'no', name: 'Norwegian' }, { code: 'ii', name: 'Nuosu' }, { code: 'nr', name: 'South Ndebele' }, { code: 'oc', name: 'Occitan' }, { code: 'oj', name: 'Ojibwe, Ojibwa' }, { code: 'cu', name: 'Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic' }, { code: 'om', name: 'Oromo' }, { code: 'or', name: 'Oriya' }, { code: 'os', name: 'Ossetian, Ossetic' }, { code: 'pa', name: 'Panjabi, Punjabi' }, { code: 'pi', name: 'PÄli' }, { code: 'fa', name: 'Persian (Farsi)' }, { code: 'pl', name: 'Polish' }, { code: 'ps', name: 'Pashto, Pushto' }, { code: 'pt', name: 'Portuguese' }, { code: 'qu', name: 'Quechua' }, { code: 'rm', name: 'Romansh' }, { code: 'rn', name: 'Kirundi' }, { code: 'ro', name: 'Romanian, [])' }, { code: 'ru', name: 'Russian' }, { code: 'sa', name: 'Sanskrit (Saá¹ská¹›ta)' }, { code: 'sc', name: 'Sardinian' }, { code: 'sd', name: 'Sindhi' }, { code: 'se', name: 'Northern Sami' }, { code: 'sm', name: 'Samoan' }, { code: 'sg', name: 'Sango' }, { code: 'sr', name: 'Serbian' }, { code: 'gd', name: 'Scottish Gaelic; Gaelic' }, { code: 'sn', name: 'Shona' }, { code: 'si', name: 'Sinhala, Sinhalese' }, { code: 'sk', name: 'Slovak' }, { code: 'sl', name: 'Slovene' }, { code: 'so', name: 'Somali' }, { code: 'st', name: 'Southern Sotho' }, { code: 'az', name: 'South Azerbaijani' }, { code: 'es', name: 'Spanish; Castilian' }, { code: 'su', name: 'Sundanese' }, { code: 'sw', name: 'Swahili' }, { code: 'ss', name: 'Swati' }, { code: 'sv', name: 'Swedish' }, { code: 'ta', name: 'Tamil' }, { code: 'te', name: 'Telugu' }, { code: 'tg', name: 'Tajik' }, { code: 'th', name: 'Thai' }, { code: 'ti', name: 'Tigrinya' }, { code: 'bo', name: 'Tibetan Standard, Tibetan, Central' }, { code: 'tk', name: 'Turkmen' }, { code: 'tl', name: 'Tagalog' }, { code: 'tn', name: 'Tswana' }, { code: 'to', name: 'Tonga (Tonga Islands)' }, { code: 'tr', name: 'Turkish' }, { code: 'ts', name: 'Tsonga' }, { code: 'tt', name: 'Tatar' }, { code: 'tw', name: 'Twi' }, { code: 'ty', name: 'Tahitian' }, { code: 'ug', name: 'Uyghur, Uighur' }, { code: 'uk', name: 'Ukrainian' }, { code: 'ur', name: 'Urdu' }, { code: 'uz', name: 'Uzbek' }, { code: 've', name: 'Venda' }, { code: 'vi', name: 'Vietnamese' }, { code: 'vo', name: 'VolapÃ¼k' }, { code: 'wa', name: 'Walloon' }, { code: 'cy', name: 'Welsh' }, { code: 'wo', name: 'Wolof' }, { code: 'fy', name: 'Western Frisian' }, { code: 'xh', name: 'Xhosa' }, { code: 'yi', name: 'Yiddish' }, { code: 'yo', name: 'Yoruba' }, { code: 'za', name: 'Zhuang, Chuang' }, { code: 'zu', name: 'Zulu' }]
          switch (infoType) {
            case 0:
              result = json.data.map(video => { return video.id })
              break
            case 1:
              result = json.data[0].user_id
              break
            case 2:
              result = json.data[0].user_name
              break
            case 3:
              result = json.data.map(video => video.title)
              break
            case 4:
              result = json.data.map(video => video.description)
              break
            case 5:
              result = json.data.map(video => video.created_at)
              break
            case 6:
              result = json.data.map(video => video.published_at)
              break
            case 7:
              result = json.data.map(video => video.url)
              break
            case 8:
              result = json.data.map(video => video.thumbnail_url.replace('%{width}', '1920').replace('%{height}', '1280'))
              break
            case 9: // "public" or "private"
              result = json.data.map(video => video.viewable === 'public')
              break
            case 10:
              result = json.data.map(video => video.view_count)
              break
            case 11:
              result = json.data.map(video => iso2.find(lang => lang.code === video.language).name)
              break
            case 12: // "upload", "archive" or "highlight"
              result = json.data.map(video => video.type)
              break
            case 13:
              result = json.data.map(video => video.duration)
              break
            case 14:
              result = json.data.map(video => {
                const input = video.duration.match(/[a-z]/gi)
                const times = video.duration.match(/[0-9]{1,2}/gi)
                const moment = Mods.require('moment')
                const duration = moment.duration()
                input.forEach((t, index) => duration.add(times[index], t))
                return duration.asSeconds()
              })
              break
          };
          this.storeValue(result, storage, varName, cache)
        } else if (json && json.message) {
          console.error(json)
        } else {
          console.log(`No results for ${input}.`)
        };
        break
      case 3: // Game
        if (infoType < 3) {
          (inputType === 0) ? url += `games?id=${input}` : url += `games?name=${input}`
        } else {
          url += `games/top?limit=${searchResults}`
        };
        json = await getApi.call(this, url)
        if (json && json.data.length !== 0) {
          let result
          switch (infoType) {
            case 0:
              result = json.data[0].id
              break
            case 1:
              result = json.data[0].name
              break
            case 2:
              result = json.data[0].box_art_url.replace('{width}', '1300').replace('{height}', '1730')
              break
            case 3:
              result = json.data.map(game => game.id)
              break
            case 4:
              result = json.data.map(game => game.name)
              break
            case 5:
              result = json.data.map(game => game.box_art_url.replace('{width}', '1300').replace('{height}', '1730'))
              break
          }
          this.storeValue(result, storage, varName, cache)
        } else if (json && json.message) {
          console.error(json)
        } else {
          console.log(`No results for ${input}.`)
        }
        break
    }
    this.callNextAction(cache)

    async function getApi (url) { // get a better cache system
      try {
        let oldUrl
        if (cacheBoolean) {
          oldUrl = this.getVariable(1, `${url}_URL`, cache)
        }
        if (oldUrl && oldUrl === url) {
          return this.getVariable(1, url, cache)
        } else {
          const res = await fetch(url, { headers })
          if (res.ok) {
            const twitchJson = JSON.parse(await res.text())
            this.storeValue(twitchJson, 1, url, cache)
            this.storeValue(url, 1, `${url}_URL`, cache)
            return twitchJson
          } else {
            return false
          }
        }
      } catch (err) {
        return err
      }
    }
  },

  mod () {}

}
