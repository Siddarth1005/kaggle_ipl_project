import * as fs from 'fs'
function matchData(inputData){
    // input data is the string converted csv file
    let data = inputData.replace(/"/g, ' ');
    // spliting the string into different lines and storing them as an array
    const lines = data.split('\n');
    // Taking only the first item from the line as the heading
    const headings = lines[0].split(',');
    let matchDataSet = []
    // iterating through each line in the lines item
    for (let i=1;i<lines.length;i++)
    {
        let singleData = {};
        // spliting each lines data by ","
        let record = lines[i].split(',')
        // assiging each value under lines[i].split(',') to the corresponding headings
        for(let j=0;j<= headings.length;j++){
            singleData[headings[j]]=record[j];
        }
        // Storing and returing matchDataSet as an array
        matchDataSet.push(singleData)
    }

    return matchDataSet;
}

export {matchData};




