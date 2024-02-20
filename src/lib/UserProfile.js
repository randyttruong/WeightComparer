/* 
 * UserProfile.js 
 *
 * Author: randyttruong (based on charliehyin) 
 *
 * Description: Defines the `UserProfile` class, which gets a user's 
 * Ironman profiles and their corresponding lily weight. 
 * 
 */

class UserProfile {  
  function constructor(apikey, uuid) { 
    this.ironIdList= []; 
    this.uuid = uuid; 
    this.apikey = apikey;
    const this.RETRY_LIMIT = 10; 
  } 

  // 
  // TODO UserProfile.GetPlayerActivity() 
  async function GetPlayerActivity() { 
    var activityApi = `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`; 

    var res = await fetch(activityApi); 

    if (res.status != 200) return; 

    res = res.json(); 

    console.log(`${this.uuid}, ${res.name}, 0, # No profiles found -- \ 
      has this person logged in recently?`);
  } 
  
  // 
  // UserProfile.GetPlayerProfiles()
  async function GetPlayerProfiles() { 
    var check = true; 
    var fails = 0; 

    var profileApi = `https://api.hypixel.net/skyblock/profiles?key=${apikey}&uuid=${uuid}`; 

    while (fails < this.RETRY_LIMIT) { 
      try { 
	let res = await fetch(profileApi); // Grab UserProfile from Hypixel API 

	if (res.status != 200) 
	  throw new Error("Code 1: Unable to fetch User Profile.");

	res = res.json(); // success -> jsonify

	if (!res.profiles) 
	  return null; 

	res.profiles.forEach((profile) => { 
	  if (!profile) continue;

	  if (profile.game_mode === "ironman") 
	    this.ironIdList.push(profile.profile_id);
	}); 
      } catch (e) { 
	fails++; 
	await delay(5000); 
      } 
    }  
  } 

  //
  // UserProfile.GetWeight() 
  async function GetWeight() { 
    var max = 0; 
    var username; 

    // base case 1: if no ironman profiles -> check activity
    if (this.ironIdList.length === 0) { 
      this.GetPlayerActivity(); 
      return; 
    } 

    this.ironIdList.forEach((id) => { 
      let fails = 0; 

      // Attempt to grab a username 
      while (fails < this.RETRY_LIMIT)  { 
	try { 
	  const res = await lily.getProfileWeightFromUUID(this.uuid, id, true);

	  if (res.status != 200) 
	    throw new Error("Code 2: Unable to fetch User Profile"); 
	  
	} catch (e) { 
	  fails++; 
	  await delay(5000);
	} 
      } 

      username = res.username; 
      max = Math.max(max, res.total); 

      // TODO probably write to a file? 
      console.log(`UUID: ${uuid}, Username: ${String(username)}, MaximumWeight: ${max}`);
    });
  } 

} 

