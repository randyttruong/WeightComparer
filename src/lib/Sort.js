/* 
 * Sort.js 
 *
 * authors: randyttruong (based on charliehyin) 
 * description: Custom comparators 
 *
 */ 

// sortUUID() 
const sortUUID = (a, b) => { 
  if (a[0] === b[0]) { 
    return 0; 
  } 
  return (a[0] < b[0]) ? -1 : 1; 
} 


// sortWeight()
const sortWeight = (a, b) => {
    if (parseInt(a[2]) === parseInt(b[2])) {
        return 0;
    }

    return (parseInt(a[2]) < parseInt(b[2])) ? -1 : 1;
}

// sortWeights() 
const sortWeights = (a, b) => {
    if (a[1] === b[1]) {
        return 0;
    }
    return (a[1] < b[1]) ? -1 : 1;
}
