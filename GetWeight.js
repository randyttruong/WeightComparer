//barely any comments oh well
//todo: add profile checker so that it takes the highest weight ironman rather than latest profile

const fetch = require("node-fetch");
var fs = require("fs");
const { maxHeaderSize } = require("http");

const apikey = "48b696c2-18af-4c2d-8320-35165b15f3e4";
var guuid = "60ac425a8ea8c9bb7f6da827"; //imc
//var guuid = "5fbea1f38ea8c9d1008d4940"; //ims
const guildurl = `https://api.hypixel.net/guild?key=${apikey}&id=${guuid}`;

const options = {
    headers: {
        Authorization: apikey
    }
};
function delay(delayInms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  }
async function getIronProfiles(uuid) {
    var ironIDs = [];
    await fetch(`https://api.hypixel.net/skyblock/profiles?key=${apikey}&uuid=${uuid}`)
        .then(res => res.json())
        .then(data => {
            for(var i = 0; i<data.profiles.length; i++) {
                try {
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
async function getData(uuid, url, options) {
    var ironProfileIDs = await getIronProfiles(uuid);
    fetch(url, options)
    .then(res => res.json())
    .then(data => {
        var highestIronWeight = 0;
        var highestIronID = 0;
        for(var i = 0; i<data.data.length; i++) {
            for(var a = 0; a<ironProfileIDs.length; a++) {
                if(data.data[i].id == ironProfileIDs[a]) {
                    var weight = data.data[i].weight;
                    if(weight > highestIronWeight) {
                        highestIronWeight = weight;
                        highestIronID = i;
                    }
                }
            }
        }
        console.log(String(data.data[highestIronID].id) + "," + String(data.data[highestIronID].username) + "," + 
        String(highestIronWeight) + "," + String(data.data[highestIronID].last_save_at.date).substring(5, 10) + ",");
    });
        
}
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
                counter%=4;
                currStr = "";
                continue;
            }
            currStr+=dataStr.charAt(i);
        }
        //console.log(newData);
     });
     return newData;
}
async function getGuildData() {
    var uuids = await getUuids(guildurl);
    for(var i = 0; i<uuids.length; i++) {
        var senitherurl = `https://hypixel-api.senither.com/v1/profiles/${uuids[i]}`;
        await getData(uuids[i], senitherurl, options);
        await delay(2500);
    }
}
async function compareData() {
    var oldData = await readTextFile('OldData.txt');
    var newData = await readTextFile('NewData.txt');
    await delay(4000);
    //console.log(oldData);
    //read data text file into a 2-d array
    newData.sort(sortUUID);
    //for(var i = 0; i<newData.length; i++) {
    //    console.log(newData[i][1] + ": " + newData[i][2] + "\nLast login: " + newData[i][3]);
    //}
    //console.log(newData);
    oldData.sort(sortUUID);
    //console.log(oldData);
    var weightDifferences = [];
    for(var i = 0; i<newData.length; i++) {
        for(var a = 0; a<oldData.length; a++) {
            if(newData[i][1] == oldData[a][1] && newData[i][2] >= oldData[a][2]) {
                weightDifferences.push([newData[i][1], (newData[i][2]-oldData[a][2])]);
                //console.log(newData[i][1]+", "+String((newData[i][2]-oldData[a][2])).substring(0, 5));
                break;
            }
        }
    }
    weightDifferences.sort(sortWeights);
    for(var i = 0; i<weightDifferences.length; i++) {
        console.log(weightDifferences[i][0]+", "+(weightDifferences[i][1].toFixed(2)));
    }
    //console.log(oldData);
}
async function formatData() {
    var newData = await readTextFile('NewData.txt');
    await delay(4000);
    newData.sort(sortWeight);
    var sum = 0;
    for(var i = 0; i<newData.length; i++) {
        sum += parseInt(newData[i][2]);
        console.log(newData[i][1] + ": " + newData[i][2]);
    }
    var average = sum/(newData.length);
    console.log("Average weight: " + average.toString());
}
//pulls the guild data from api. WILL TAKE ABOUT FIVE MINUTES TO RUN. 
//getGuildData();
//copy paste the data in NewData.txt to OldData.txt and then copy paste the output given by getGuildData into NewData. Remember to save the files. 
//This function will output the sorted weights for the #casuals-weights channel
//formatData();
//This function will output the weight differences for everyone
compareData(); 
