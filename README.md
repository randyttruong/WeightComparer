# WeightComparer

## TODO 
- [x] - Finished creating `/src/index.js` 
- [x] - Finished refactoring `getIronProfiles`, `getDataIMC`, `getUuids`, and all `Sort` 
- [ ] - Refactor `readTextFile` 
- [ ] - Refactor `compareData` 
- [ ] - Refactor `formatData`
- [ ] - Add CLI functionality 
- [ ] - Create CLI functionality

## Files: 
```
/src/ - Folder for all source code 
/src/lib/ - Folder for all libraries 
/src/index.js - Main/entrypoint file 
```

## Description 
`WeightComprarer` is a utility for getting the `lily weight` of everyone in Ironman Casuals. 

`WeightComprarer` can also compare the weights of everyone in Ironman Casuals with a dataset from a prior time. 

# Tutorial: 
1. Clone the repository
2. To get new data from the Hypixel API, call getGuildDataIMC
3. Copy paste the data printed to the console into either OldData.txt or NewData.txt to use the data in compareData
4. At the bottom of GetWeight.js, call compareData to compare the data in OldData.txt and NewData.txt
5. To format the data in NewData.txt, call formatData
