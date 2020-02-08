module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Store Game Server Info",

	//---------------------------------------------------------------------
	// Action Section
	//
	// This is the section the action will fall into.
	//---------------------------------------------------------------------

	section: "Other Stuff",

	//---------------------------------------------------------------------
	// Action Subtitle
	//
	// This function generates the subtitle displayed next to the name.
	//---------------------------------------------------------------------

	subtitle: function (data) {
		const info = ['Server Name', 'Map', 'Number Of Players', 'Number Of Bots', 'Max Players', 'Server Tags', 'Does Server Have Password?', 'Server Player List'];
		return `${info[parseInt(data.info)]}`;
	},

	//---------------------------------------------------------------------
	// DBM Mods Manager Variables (Optional but nice to have!)
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------

	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "NetLuis, Danno3817 & Destiny",

	// The version of the mod (Defaults to 1.0.0)
	version: "2.0.0",

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "Stores Game Server Information.",

	// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


	//---------------------------------------------------------------------

	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		const info = parseInt(data.info);
		let dataType = 'Unknown Type';
		switch (info) {
			case 0:
				dataType = "Server Name";
				break;
			case 1:
				dataType = "Map";
				break;
			case 2:
				dataType = "Number";
				break;
			case 3:
				dataType = "Number";
				break;
			case 4:
				dataType = "Server Tags";
				break;
			case 5:
				dataType = "Boolean";
				break;
			case 5:
				dataType = "Player list";
				break;
		}
		return ([data.varName, dataType]);
	},

	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------

	fields: ["serverip", "serverport", "game", "info", "storage", "varName"],

	//---------------------------------------------------------------------
	// Command HTML
	//
	// This function returns a string containing the HTML used for
	// editting actions.
	//
	// The "isEvent" parameter will be true if this action is being used
	// for an event. Due to their nature, events lack certain information,
	// so edit the HTML to reflect this.
	//
	// The "data" parameter stores constants for select elements to use.
	// Each is an array: index 0 for commands, index 1 for events.
	// The names are: sendTargets, members, roles, channels,
	//                messages, servers, variables
	//---------------------------------------------------------------------

	html: function (isEvent, data) {
		return `
		<div style="width: 550px; height: 350px; overflow-y: scroll;">
        <div>
		<div class="embed">
        	<embedleftline style="background-color: #2b9696;"></embedleftline>
        	<div class="embedinfo">
	    	<span class="embed-auth"><u>Mod Info:</u><br>Made by <b>${this.author}</b></span><br>
	    	<span class="embed-desc">${this.short_description}<br>Version: ${this.version}</span>
        </div>
        </div><br>
		<div style="float: left; width: 50%; padding-top: 8px;">
			Server IP:<br>
			<textarea id="serverip" rows="2" placeholder="mc.example.com" style="width: 90%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
		</div>
		<div style="float: left; width: 50%; padding-left: 10px; padding-top: 8px;">
		 	Server Port:<br>
		 	<textarea id="serverport" rows="2" placeholder="Leave blank for default port" style="width: 90%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
	  	</div>
	 	<div style="float: left; width: 55%; padding-top: 8px;">
	 	Game:<br>
			<select id="game" class="round">
			<option value="7d2d">7 Days to Die (2013)</option>
			<option value="ageofchivalry">Age of Chivalry (2007)</option>
			<option value="aoe2">Age of Empires 2 (1999)</option>
			<option value="alienarena">Alien Arena (2004)</option>
			<option value="alienswarm">Alien Swarm (2010)</option>
			<option value="avp2">Aliens versus Predator 2 (2001)</option>
			<option value="avp2010">Aliens vs. Predator (2010)</option>
			<option value="americasarmy">America's Army (2002)</option>
			<option value="americasarmy2">America's Army 2 (2003)</option>
			<option value="americasarmy3">America's Army 3 (2009)</option>
			<option value="americasarmypg">America's Army: Proving Grounds (2015)</option>
			<option value="arcasimracing">Arca Sim Racing (2008)</option>
			<option value="arkse">Ark: Survival Evolved (2017)</option>
			<option value="arma2">ARMA 2 (2009)</option>
			<option value="arma2oa">ARMA 2: Operation Arrowhead (2010)</option>
			<option value="arma3">ARMA 3 (2013)</option>
			<option value="arma">ARMA: Armed Assault (2007)</option>
			<option value="armacwa">ARMA: Cold War Assault (2011)</option>
			<option value="armar">ARMA: Resistance (2011)</option>
			<option value="armagetron">Armagetron Advanced (2001)</option>
			<option value="atlas">Atlas (2018)</option>
			<option value="baldursgate">Baldur's Gate (1998)</option>
			<option value="bat1944">Battalion 1944 (2018)</option>
			<option value="bf1942">Battlefield 1942 (2002)</option>
			<option value="bf2">Battlefield 2 (2005)</option>
			<option value="bf2142">Battlefield 2142 (2006)</option>
			<option value="bf3">Battlefield 3 (2011)</option>
			<option value="bf4">Battlefield 4 (2013)</option>
			<option value="bfh">Battlefield Hardline (2015)</option>
			<option value="bfv">Battlefield Vietnam (2004)</option>
			<option value="bfbc2">Battlefield: Bad Company 2 (2010)</option>
			<option value="breach">Breach (2011)</option>
			<option value="breed">Breed (2004)</option>
			<option value="brink">Brink (2011)</option>
			<option value="buildandshoot">Build and Shoot / Ace of Spades Classic (2012)</option>
			<option value="cod">Call of Duty (2003)</option>
			<option value="cod2">Call of Duty 2 (2005)</option>
			<option value="cod3">Call of Duty 3 (2006)</option>
			<option value="cod4">Call of Duty 4: Modern Warfare (2007)</option>
			<option value="codmw2">Call of Duty: Modern Warfare 2 (2009)</option>
			<option value="codmw3">Call of Duty: Modern Warfare 3 (2011)</option>
			<option value="coduo">Call of Duty: United Offensive (2004)</option>
			<option value="codwaw">Call of Duty: World at War (2008)</option>
			<option value="callofjuarez">Call of Juarez (2006)</option>
			<option value="chaser">Chaser (2003)</option>
			<option value="chrome">Chrome (2003)</option>
			<option value="codenameeagle">Codename Eagle (2000)</option>
			<option value="codenameeagle">Codename Eagle (2000)</option>
			<option value="cacrenegade">Command and Conquer: Renegade (2002)</option>
			<option value="commandos3">Commandos 3: Destination Berlin (2003)</option>
			<option value="conanexiles">Conan Exiles (2018)</option>
			<option value="contactjack">Contract J.A.C.K. (2003)</option>
			<option value="cs15">Counter-Strike 1.5 (2002)</option>
			<option value="cs16">Counter-Strike 1.6 (2003)</option>
			<option value="cs2d">Counter-Strike: 2D (2004)</option>
			<option value="cscz">Counter-Strike: Condition Zero (2004)</option>
			<option value="csgo">Counter-Strike: Global Offensive (2012)</option>
			<option value="css">Counter-Strike: Source (2004)</option>
			<option value="crossracing">Cross Racing Championship Extreme 2005 (2005)</option>
			<option value="crysis">Crysis (2007)</option>
			<option value="crysis2">Crysis 2 (2011)</option>
			<option value="crysiswars">Crysis Wars (2008)</option>
			<option value="daikatana">Daikatana (2000)</option>
			<option value="dnl">Dark and Light (2017)</option>
			<option value="dmomam">Dark Messiah of Might and Magic (2006)</option>
			<option value="darkesthour">Darkest Hour: Europe '44-'45 (2008)</option>
			<option value="dod">Day of Defeat (2003)</option>
			<option value="dods">Day of Defeat: Source (2005)</option>
			<option value="doi">Day of Infamy (2017)</option>
			<option value="dayz">DayZ (2018)</option>
			<option value="dayzmod">DayZ Mod (2013)</option>
			<option value="deadlydozenpt">Deadly Dozen: Pacific Theater (2002)</option>
			<option value="dh2005">Deer Hunter 2005 (2004)</option>
			<option value="descent3">Descent 3 (1999)</option>
			<option value="deusex">Deus Ex (2000)</option>
			<option value="devastation">Devastation (2003)</option>
			<option value="dinodday">Dino D-Day (2011)</option>
			<option value="dirttrackracing2">Dirt Track Racing 2 (2002)</option>
			<option value="doom3">Doom 3 (2004)</option>
			<option value="dota2">Dota 2 (2013)</option>
			<option value="drakan">Drakan: Order of the Flame (1999)</option>
			<option value="etqw">Enemy Territory: Quake Wars (2007)</option>
			<option value="fear">F.E.A.R. (2005)</option>
			<option value="f1c9902">F1 Challenge '99-'02 (2002)</option>
			<option value="farcry">Far Cry (2004)</option>
			<option value="farcry2">Far Cry 2 (2008)</option>
			<option value="f12002">Formula One 2002 (2002)</option>
			<option value="fortressforever">Fortress Forever (2007)</option>
			<option value="ffow">Frontlines: Fuel of War (2008)</option>
			<option value="garrysmod">Garry's Mod (2004)</option>
			<option value="geneshift">Geneshift (2017)</option>
			<option value="giantscitizenkabuto">Giants: Citizen Kabuto (2000)</option>
			<option value="globaloperations">Global Operations (2002)</option>
			<option value="ges">GoldenEye: Source (2010)</option>
			<option value="gore">Gore: Ultimate Soldier (2002)</option>
			<option value="fivem">Grand Theft Auto V - FiveM (2013)</option>
			<option value="mtasa">Grand Theft Auto: San Andreas - Multi Theft Auto (2004)</option>
			<option value="mtavc">Grand Theft Auto: Vice City - Multi Theft Auto (2002)</option>
			<option value="gunmanchronicles">Gunman Chronicles (2000)</option>
			<option value="hl2dm">Half-Life 2: Deathmatch (2004)</option>
			<option value="hldm">Half-Life Deathmatch (1998)</option>
			<option value="hldms">Half-Life Deathmatch: Source (2005)</option>
			<option value="halo">Halo (2003)</option>
			<option value="halo2">Halo 2 (2007)</option>
			<option value="heretic2">Heretic II (1998)</option>
			<option value="hexen2">Hexen II (1997)</option>
			<option value="had2">Hidden & Dangerous 2 (2003)</option>
			<option value="homefront">Homefront (2011)</option>
			<option value="homeworld2">Homeworld 2 (2003)</option>
			<option value="hurtworld">Hurtworld (2015)</option>
			<option value="igi2">I.G.I.-2: Covert Strike (2003)</option>
			<option value="il2">IL-2 Sturmovik (2001)</option>
			<option value="insurgency">Insurgency (2014)</option>
			<option value="insurgencysandstorm">Insurgency: Sandstorm (2018)</option>
			<option value="ironstorm">Iron Storm (2002)</option>
			<option value="jamesbondnightfire">James Bond 007: Nightfire (2002)</option>
			<option value="jc2mp">Just Cause 2 - Multiplayer (2010)</option>
			<option value="kspdmp">Kerbal Space Program - DMP Multiplayer (2015)</option>
			<option value="killingfloor">Killing Floor (2009)</option>
			<option value="killingfloor2">Killing Floor 2 (2016)</option>
			<option value="kingpin">Kingpin: Life of Crime (1999)</option>
			<option value="kisspc">Kiss: Psycho Circus: The Nightmare Child (2000)</option>
			<option value="kzmod">Kreedz Climbing (2017)</option>
			<option value="left4dead">Left 4 Dead (2008)</option>
			<option value="left4dead2">Left 4 Dead 2 (2009)</option>
			<option value="m2mp">Mafia II - Multiplayer (2010)</option>
			<option value="m2o">Mafia II - Online (2010)</option>
			<option value="moh2010">Medal of Honor (2010)</option>
			<option value="mohab">Medal of Honor: Airborne (2007)</option>
			<option value="mohaa">Medal of Honor: Allied Assault (2002)</option>
			<option value="mohbt">Medal of Honor: Allied Assault Breakthrough (2003)</option>
			<option value="mohsh">Medal of Honor: Allied Assault Spearhead (2002)</option>
			<option value="mohpa">Medal of Honor: Pacific Assault (2004)</option>
			<option value="mohpa">Medal of Honor: Pacific Assault (2004)</option>
			<option value="mohwf">Medal of Honor: Warfighter (2012)</option>
			<option value="medievalengineers">Medieval Engineers (2015)</option>
			<option value="minecraft" selected>Minecraft (2009)</option>
			<option value="minecraftpe">Minecraft: Pocket Edition (2011)</option>
			<option value="mnc">Monday Night Combat (2011)</option>
			<option value="mumble">Mumble - GTmurmur Plugin (2005)</option>
			<option value="mumbleping">Mumble - Lightweight (2005)</option>
			<option value="nascarthunder2004">NASCAR Thunder 2004 (2003)</option>
			<option value="ns">Natural Selection (2002)</option>
			<option value="ns2">Natural Selection 2 (2012)</option>
			<option value="nfshp2">Need for Speed: Hot Pursuit 2 (2002)</option>
			<option value="nab">Nerf Arena Blast (1999)</option>
			<option value="netpanzer">netPanzer (2002)</option>
			<option value="nwn">Neverwinter Nights (2002)</option>
			<option value="nwn2">Neverwinter Nights 2 (2006)</option>
			<option value="nexuiz">Nexuiz (2005)</option>
			<option value="nitrofamily">Nitro Family (2004)</option>
			<option value="nmrih">No More Room in Hell (2011)</option>
			<option value="nolf2">No One Lives Forever 2: A Spy in H.A.R.M.'s Way (2002)</option>
			<option value="nucleardawn">Nuclear Dawn (2011)</option>
			<option value="openarena">OpenArena (2005)</option>
			<option value="openttd">OpenTTD (2004)</option>
			<option value="operationflashpoint">Operation Flashpoint: Cold War Crisis (2001)</option>
			<option value="flashpointresistance">Operation Flashpoint: Resistance (2002)</option>
			<option value="painkiller">Painkiller</option>
			<option value="postal2">Postal 2</option>
			<option value="prey">Prey</option>
			<option value="primalcarnage">Primal Carnage: Extinction</option>
			<option value="quake1">Quake 1: QuakeWorld</option>
			<option value="quake2">Quake 2</option>
			<option value="quake3">Quake 3: Arena</option>
			<option value="quake4">Quake 4</option>
			<option value="r6">Rainbow Six</option>
			<option value="r6">Rainbow Six</option>
			<option value="r6roguespear">Rainbow Six 2: Rogue Spear</option>
			<option value="r6ravenshield">Rainbow Six 3: Raven Shield</option>
			<option value="rallisportchallenge">Rainbow Six 3: Raven Shield</option>
			<option value="RalliSport Challenge">Rainbow Six 3: Raven Shield</option>
			<option value="rallymasters">Rally Masters</option>
			<option value="redorchestra">Red Orchestra</option>
			<option value="redorchestra2">Red Orchestra 2</option>
			<option value="redorchestraost">Red Orchestra: Ostfront 41-45</option>
			<option value="redline">Redline</option>
			<option value="rtcw">Return to Castle Wolfenstein</option>
			<option value="rfactor">rFactor</option>
			<option value="ricochet">Ricochet</option>
			<option value="riseofnations">Rise of Nations</option>
			<option value="rune">Rune</option>
			<option value="rust">Rust</option>
			<option value="stalker">S.T.A.L.K.E.R.</option>
			<option value="samp">San Andreas Multiplayer</option>
			<option value="ss">Serious Sam</option>
			<option value="ss2">Serious Sam 2</option>
			<option value="shatteredhorizon">Shattered Horizon</option>
			<option value="shogo">Shogo</option>
			<option value="shootmania">Shootmania</option>
			<option value="sin">SiN</option>
			<option value="sinep">SiN Episodes</option>
			<option value="soldat">Soldat</option>
			<option value="sof">Soldier of Fortune</option>
			<option value="sof2">Soldier of Fortune 2</option>
			<option value="spaceengineers">Space Engineers</option>
			<option value="stbc">Star Trek: Bridge Commander</option>
			<option value="stvef">Star Trek: Voyager - Elite Force</option>
			<option value="stvef2">Star Trek: Voyager - Elite Force 2</option>
			<option value="swbf">Star Wars: Battlefront</option>
			<option value="swbf2">Star Wars: Battlefront 2</option>
			<option value="swjk">Star Wars: Jedi Knight</option>
			<option value="swjk2">Star Wars: Jedi Knight 2</option>
			<option value="swrc">Star Wars: Republic Commando</option>
			<option value="starbound">Starbound</option>
			<option value="starmade">StarMade</option>
			<option value="starsiege">Starsiege (2009)</option>
			<option value="suicidesurvival">Suicide Survival</option>
			<option value="svencoop">Sven Coop</option>
			<option value="swat4">SWAT 4</option>
			<option value="synergy">Synergy</option>
			<option value="tacticalops">Tactical Ops</option>
			<option value="takeonhelicopters">Take On Helicopters (2011)</option>
			<option value="teamfactor">Team Factor</option>
			<option value="tf2">Team Fortress 2</option>
			<option value="tfc">Team Fortress Classic</option>
			<option value="terminus">Terminus</option>
			<option value="terraria">Terraria - TShock (2011)</option>
			<option value="hidden">The Hidden (2005)</option>
			<option value="nolf">The Operative: No One Lives Forever (2000)</option>
			<option value="ship">The Ship</option>
			<option value="graw">Tom Clancy's Ghost Recon Advanced Warfighter (2006)</option>
			<option value="graw2">Tom Clancy's Ghost Recon Advanced Warfighter 2 (2007)</option>
			<option value="thps3">Tony Hawk's Pro Skater 3</option>
			<option value="thps4">Tony Hawk's Pro Skater 4</option>
			<option value="thu2">Tony Hawk's Underground 2</option>
			<option value="towerunite">Tower Unite</option>
			<option value="trackmania2">Trackmania 2</option>
			<option value="trackmaniaforever">Trackmania Forever</option>
			<option value="tremulous">Tremulous</option>
			<option value="tribes1">Tribes 1: Starsiege</option>
			<option value="tribesvengeance">Tribes: Vengeance</option>
			<option value="tron20">Tron 2.0</option>
			<option value="turok2">Turok 2</option>
			<option value="universalcombat">Universal Combat</option>
			<option value="unreal">Unreal</option>
			<option value="ut">Unreal Tournament</option>
			<option value="ut2003">Unreal Tournament 2003</option>
			<option value="ut2004">Unreal Tournament 2004</option>
			<option value="ut3">Unreal Tournament 3</option>
			<option value="unturned">Unturned</option>
			<option value="urbanterror">Urban Terror</option>
			<option value="v8supercar">V8 Supercar Challenge</option>
			<option value="ventrilo">Ventrilo</option>
			<option value="vcmp">Vice City Multiplayer</option>
			<option value="vietcong">Vietcong</option>
			<option value="vietcong2">Vietcong 2</option>
			<option value="warsow">Warsow</option>
			<option value="wheeloftime">Wheel of Time</option>
			<option value="wolfenstein2009">Wolfenstein 2009</option>
			<option value="wolfensteinet">Wolfenstein: Enemy Territory</option>
			<option value="xpandrally">Xpand Rally</option>
			<option value="zombiemaster">Zombie Master</option>
			<option value="zps">Zombie Panic: Source</option>
		</select>
	 </div><br><br><br>
	<div style="float: left; width: 55%; padding-top: 8px;">
		Source Info:<br>
		<select id="info" class="round">
			<option value="0" selected>Server Name</option>
			<option value="1">Map</option>
			<option value="2">Number Of Players In The Server</option>
			<option value="3">Number Of Bots In The Server</option>
			<option value="4">Max Players</option>
			<option value="5">Server Tags</option>
			<option value="6">Does Server Have Password?</option>
			<option value="7">Server Player List</option>
			</select>
			</div>
		</div><br><br><br><br><br><br><br>
	<div>
		<div style="float: left; width: 35%; padding-top: 8px;">
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
	<div style="float: left; width: 88%; padding-top: 8px;">
		<br>
		<p>
			You can see Games with additional notes by clicking <a href="https://www.npmjs.com/package/gamedig#games-with-additional-notes">here</a>.
		</p>
	<div>
</div>
        
        <style>
        /* START OF EMBED CSS */
        div.embed { /* <div class="embed"></div> */
            position: relative;
        }
            embedleftline { /* <embedleftline></embedleftline> OR if you wan't to change the Color: <embedleftline style="background-color: #HEXCODE;"></embedleftline> */
                background-color: #eee;
                width: 4px;
                border-radius: 3px 0 0 3px;
                border: 0;
                height: 100%;
                margin-left: 4px;
                position: absolute;
            }
            div.embedinfo { /* <div class="embedinfo"></div> */
                background: rgba(46,48,54,.45) fixed;
                border: 1px solid hsla(0,0%,80%,.3);
                padding: 10px;
                margin:0 4px 0 7px;
                border-radius: 0 3px 3px 0;
            }
                span.embed-auth { /* <span class="embed-auth"></span> (Title thing) */
                    color: rgb(255, 255, 255);
                }
                span.embed-desc { /* <span class="embed-desc"></span> (Description thing) */
                    color: rgb(128, 128, 128);
                }
        
                span { /* Only making the text look, nice! */
                    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                }
                </style>`
	},

	//---------------------------------------------------------------------
	// Action Editor Init Code
	//
	// When the HTML is first applied to the action editor, this code
	// is also run. This helps add modifications or setup reactionary
	// functions for the DOM elements.
	//---------------------------------------------------------------------

	init: function () {
		const {
			glob,
			document
		} = this;

		glob.variableChange(document.getElementById('storage'), 'varNameContainer');
	},

	//---------------------------------------------------------------------
	// Action Bot Function
	//
	// This is the function for the action within the Bot's Action class.
	// Keep in mind event calls won't have access to the "msg" parameter,
	// so be sure to provide checks for variable existance.
	//---------------------------------------------------------------------

	action: function (cache) {
		const _this = this // To fix error
		const data = cache.actions[cache.index];
		const info = parseInt(data.info);
		const gametype = this.evalMessage(data.game, cache);
		const ip = this.evalMessage(data.serverip, cache)
		const port = this.evalMessage(data.serverport, cache)

		// Main code:
		const WrexMODS = _this.getWrexMods(); // as always.
		WrexMODS.CheckAndInstallNodeModule('gamedig');
		const Gamedig = WrexMODS.require('gamedig');

		if (!ip) return console.log("Please provide Server IP & Port.");

		Gamedig.query({
			type: gametype,
			host: ip,
			port: port,
			maxAttempts: 3,
			attemptTimeout: 25000
		}).then((state) => {
			let result = undefined;
			switch (info) {
				case 0:
					result = state.name;
					break;
				case 1:
					result = state.map;
					break;
				case 2:
					result = state.raw.numplayers;
					break;
				case 3:
					result = state.raw.numbots;
					break;
				case 4:
					result = state.maxplayers;
					break;
				case 5:
					result = state.raw.tags;
					break;
				case 6:
					result = state.password;
					break;
				case 7:
					result = state.players.map(a=> a.name);
					break;
				default:
					break;
				}

			if (result !== undefined) {
				const storage = parseInt(data.storage);
				const varName2 = _this.evalMessage(data.varName, cache);
				_this.storeValue(result, storage, varName2, cache);
			}
				_this.callNextAction(cache);
			
		}).catch((error) => {
			console.log(`Game Server Info: ${error}`)
		})
	},
	//---------------------------------------------------------------------
	// Action Bot Mod
	//
	// Upon initialization of the bot, this code is run. Using the bot's
	// DBM namespace, one can add/modify existing functions if necessary.
	// In order to reduce conflictions between mods, be sure to alias
	// functions you wish to overwrite.
	//---------------------------------------------------------------------

	mod: function (DBM) {}

}; // End of module
