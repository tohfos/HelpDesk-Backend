const RandomForestAlgorithm = require('random-forest');
const csv = require('csv-parser')
const fs = require('fs')
const results = [];
var parsedData = [];




fs.createReadStream('trainingData.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
   console.log(results);
    //parsedData = results;

   
  });

  //console.log(parsedData);

