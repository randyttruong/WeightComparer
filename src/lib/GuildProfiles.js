/* 
 * GuildProfiles.js 
 *
 * authors: randyttruong (based on charliehyin) 
 * description: TODO 
 */ 

class GuildProfiles {  
  function constructor(guildUrl) { 
    this.guildUrl = guildUrl;  
    this.idList = []; 
  } 

  // 
  // GuildProfiles.fetchUuidList()
  async function fetchUuidList() {  
    try { 
      const errorMsg =  "Error Code 3: Unable to fetch guild UUIDs";
      var res = await fetch(this.guildUrl); 


      if (res.status != 200) { 
	res = res.json(); 

	console.log(res.cause); 
	throw new Error(errorMsg); 
      } 

      res = res.json(); 

      memberList = res.guild.members; 

      memberList.forEach((m) => { 
	this.idList.push(m.uuid);
      }); 

    } catch (e) {  
      console.error(`Error: Program failure, ${e.message}`);
    } 
  } 

} 
