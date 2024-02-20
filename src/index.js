/* 
 * index.js 
 * 
 * entry-point file for WeightComparer
 */

// Packages 
const fetch = require("node-fetch");
const LilyWeight = require("lilyweight");
const fs = require("fs");
const { maxHeaderSize } = require("http");

//create apikey and guuid variables
const apikey = "ef525cf2-4e05-46ba-b8dd-3c235ff2aa5b";
const lily = new LilyWeight(apikey);
var imcid = "60ac425a8ea8c9bb7f6da827"; //imc
var imaid = "633b10688ea8c9eeda70db6b"  //ima
var imsid = "5fbea1f38ea8c9d1008d4940"; //ims

//url for hypixel api
const guildurlimc = `https://api.hypixel.net/guild?key=${apikey}&id=${imcid}`;
const guildurlims = `https://api.hypixel.net/guild?key=${apikey}&id=${imsid}`;
const guildurlima = `https://api.hypixel.net/guild?key=${apikey}&id=${imaid}`;


function main() { 
  const args = process.argv.slice(2); 

} 

main(); 

