//initialize packages
const fetch = require("node-fetch");
const LilyWeight = require("lilyweight");
var fs = require("fs");
const { maxHeaderSize } = require("http");

//create apikey and guuid variables
const apikey = "b524d985-5bcb-48cf-b2ad-d887b23f7528";
const lily = new LilyWeight(apikey);
var imcid = "60ac425a8ea8c9bb7f6da827"; //imc
var imaid = "633b10688ea8c9eeda70db6b"  //ima
var imsid = "5fbea1f38ea8c9d1008d4940"; //ims

//url for hypixel api
const guildurlimc = `https://api.hypixel.net/guild?key=${apikey}&id=${imcid}`;
const guildurlims = `https://api.hypixel.net/guild?key=${apikey}&id=${imsid}`;
const guildurlima = `https://api.hypixel.net/guild?key=${apikey}&id=${imaid}`;

//give api key for api call
const options = {
    headers: {
        Authorization: apikey
    }
};

//delay function(because hypixel api is ratelimited to 120 calls/min)
function delay(delayInms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  }

//grab all ironman profiles for a player
async function getIronProfiles(uuid) {
    var ironIDs = [];
    await fetch(`https://api.hypixel.net/skyblock/profiles?key=${apikey}&uuid=${uuid}`)
        .then(res => res.json())
        .then(data => {
            //loop through all profiles
            for(var i = 0; i<data.profiles.length; i++) {
                try {
                    //add their profile id to a list if it is ironman
                    if(data.profiles[i].game_mode == "ironman") {
                        ironIDs.push(data.profiles[i].profile_id);
                    }
                }
                catch(e) {};
            }
        }
    );
    return ironIDs;
}
//get data for all ironman profiles for a player
async function getDataIMC(uuid) {
    var ironProfileIDs = await getIronProfiles(uuid);
    if(ironProfileIDs.length == 0) {
        data = await lily.getWeight(uuid, true);
        console.log(uuid + "," + String(data.username) + ",0,");
        return;
    }
    var max = 0;
    var username = "";
    for(var i = 0; i<ironProfileIDs.length; i++) {
        check = true;
        while(check){
        try{
            data = await lily.getProfileWeightFromUUID(uuid, ironProfileIDs[i], true);
            check = false;
        }
        catch(exception){
            await delay(5000);
        }
    }
        username = data.username;
        max = Math.max(max, data.total);
    }
    
    console.log(uuid + "," + String(username) + "," + 
        String(max) + ", ");
        
}

//get a list of all members in a guild(url is guildurl)
async function getUuids(url)  {
    var uuids = [];
    await fetch(url)
    .then(res => res.json())
    .then(data => {
        for(var i = 0; i<data.guild.members.length; i++) {
            uuids.push(data.guild.members[i].uuid);
        }
    });
    return await uuids;
}

//sorting functions

function sortUUID(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}
function sortWeight(a, b) {
    if (parseInt(a[2]) === parseInt(b[2])) {
        return 0;
    }
    else {
        return (parseInt(a[2]) < parseInt(b[2])) ? -1 : 1;
    }
}
function sortWeights(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] < b[1]) ? -1 : 1;
    }
}

//function to read data from a text file
//turn the data into an arary
async function readTextFile(filename)
{
    var newData = [];
    fs.readFile(filename, function (err, data) {
        if (err) {
           return console.error(err);
        }
        var dataStr = data.toString();
        var currStr = "";
        var counter = 0;
        var playerCounter = -1;
        for(var i = 0; i<dataStr.length; i++) {
            if(dataStr.charAt(i) == '\n') {
                continue;
            }
            if(dataStr.charAt(i) == ',') {
                if(counter == 0) {
                    newData.push([currStr]);
                    playerCounter++;
                }
                else {
                    newData[playerCounter].push(currStr);
                }
                counter++;
                counter%=3;
                currStr = "";
                continue;
            }
            currStr+=dataStr.charAt(i);
        }
        //console.log(newData);
     });
     return newData;
}
//pull data for everyone in a guild
async function getGuildDataIMA() {
    var uuids = await getUuids(guildurlimc);
    for(var i = 0; i<uuids.length; i++) {
        await getDataIMC(uuids[i]);
        await delay(2500);
    }
}
async function compareData() {
    var oldData = await readTextFile('OldData.txt');
    var newData = await readTextFile('NewData.txt');
    await delay(4000);
    //read data text file into a 2-d array
    newData.sort(sortWeights);
    oldData.sort(sortWeights);
    var weightDifferences = [];
    for(var i = 0; i<newData.length; i++) {
        for(var a = 0; a<oldData.length; a++) {
            if(newData[i][1] == oldData[a][1] && parseInt(newData[i][2]) >= parseInt(oldData[a][2])) {
                weightDifferences.push([newData[i][1], (newData[i][2]-oldData[a][2])]);
                break;
            }
        }
    }
    weightDifferences.sort(sortWeights);
    for(var i = 0; i<weightDifferences.length; i++) {
        console.log(weightDifferences[i][0]+", "+(weightDifferences[i][1].toFixed(2)));
    }
}
async function formatData() {
    var newData = await readTextFile('NewData.txt');
    await delay(4000);
    newData.sort(sortWeight);
    var sum = 0;
    for(var i = 0; i<newData.length; i++) {
        sum += parseInt(newData[i][2]);
        console.log(newData.length-i + ". " + newData[i][1] + ": " + Math.floor(newData[i][2]*10)/10);
    }
    var average = sum/(newData.length);
    console.log("Average weight: " + Math.floor(average.toString()*100)/100);
}

//pulls the guild data from api. WILL TAKE ABOUT FIVE MINUTES TO RUN. 
getGuildDataIMA();
//copy paste the data in NewData.txt to OldData.txt and then copy paste the output given by getGuildData into NewData. Remember to save the files. 
//This function will output the sorted weights for the #casuals-weights channel
//formatData();
//This function will output the weight differences for everyone
//compareData(); 