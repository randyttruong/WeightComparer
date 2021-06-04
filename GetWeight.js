//barely any comments oh well
//todo: add profile checker so that it takes the highest weight ironman rather than latest profile

const fetch = require("node-fetch");
var fs = require("fs");

const apikey = "546bbaaf-65db-4280-88cb-636847c5d0af";
var guuid = "60ac425a8ea8c9bb7f6da827";
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
async function getData(url, options) {
    fetch(url, options)
    .then(res => res.json())
    .then(data => {
            console.log(String(data.data.id) + "," + String(data.data.username) + "," + String(data.data.weight) + "," + String(data.data.last_save_at.date).substring(5, 10) + ",");
        }
    );
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
function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
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
     return await newData;
}
async function getGuildData() {
    var uuids = await getUuids(guildurl);
    for(var i = 0; i<uuids.length; i++) {
        var senitherurl = `https://hypixel-api.senither.com/v1/profiles/${uuids[i]}/latest`;
        await getData(senitherurl, options);
        await delay(1000);
    }
}
async function compareData() {
    var oldData = await readTextFile('OldData.txt');
    var newData = await readTextFile('NewData.txt');
    await delay(3000);
    //console.log(oldData);
    //read data text file into a 2-d array
    newData.sort(sortFunction);
    //console.log(newData);
    oldData.sort(sortFunction);
    //console.log(oldData);
    for(var i = 0; i<newData.length; i++) {
        for(var a = 0; a<oldData.length; a++) {
            if(newData[i][0] == oldData[a][0] && newData[i][2] >= oldData[a][2]) {
                console.log(newData[i][1]+", "+String((newData[i][2]-oldData[a][2])).substring(0, 5));
                break;
            }
        }
    }
    //console.log(oldData);
}
//getGuildData();
compareData();