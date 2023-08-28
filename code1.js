// import { count } from 'console';
import * as fs from 'fs';
// importing matchData function from convertToJson file
import {matchData} from './convertToJson.js';

// reading csv file and convering it to string
let dataForMatches = fs.readFileSync("data/matches.csv").toString()
// calling matchData function with the formated data as the parameter
let iplMatchData = matchData(dataForMatches);
// reading csv file and convering it to string
let dataForDeliveries = fs.readFileSync("data/deliveries.csv").toString()
// calling matchData function with the formated data as the parameter;
let iplDeliveries = matchData(dataForDeliveries);

// Writting the converted JSON data into a json file
fs.writeFile ("matchData.json", JSON.stringify(iplMatchData), function(err) {
    if (err) {
        throw err;
    }
});
fs.writeFile ("deliveriesData.json", JSON.stringify(iplDeliveries), function(err) {
    if (err) {
        throw err;
    }
});
class Matches{
    constructor(iplMatchData, iplDeliveriesData){
        this.inputData = iplMatchData;
        this.deliveriesData = iplDeliveriesData;
    }
    // function to return number of matches played each year 
    numberOfmatchesPlayedEachYear(){
        let input = this.inputData
        let matchesPlayedEachYear = {};
        for (let i = 0; i < input.length; i ++){
            // Using default code structure
            if (!(input[i].season in matchesPlayedEachYear)) {
                matchesPlayedEachYear[input[i].season] = 1;
            }
            else{
                matchesPlayedEachYear[input[i].season] += 1;
            }
            // Using ternary operator
            // (!(input[i].season in matchesPlayedEachYear)) ? matchesPlayedEachYear[input[i].season] = 1 : matchesPlayedEachYear[input[i].season] += 1;
        }
        return matchesPlayedEachYear;
    }
    // function to retuen numbre of matches won by each team per year 
    numberOfMatchesWonByEachTeamPerYear(){
        let input = this.inputData;
        let matchesWonByEachTeam = {};
        let allTeamsData = {};
        for (let i = 0; i < input.length; i++){
            if (!(input[i].winner in allTeamsData)){
                allTeamsData[input[i].winner] = 1;
            }
            else{
                allTeamsData[input[i].winner]  += 1;
            }
            matchesWonByEachTeam[input[i].season] = allTeamsData;
        }
        return matchesWonByEachTeam
    }

    // function to return number of times each team has won the coin toss and match
    numberOfTimesEachTeamWonTossAndMatch(){
        let input = this.inputData;
        let tossAndMatchWins = {};

        for (let i = 0; i < input.length; i++){
            if (input[i].toss_winner === input[i].winner && !(input[i].winner in tossAndMatchWins)){
                tossAndMatchWins[input[i].winner] = 1;
            }
            else if (input[i].toss_winner === input[i].winner && input[i].winner in tossAndMatchWins){
                tossAndMatchWins[input[i].winner] += 1;
            }
        }
        return tossAndMatchWins;
    }

    // function to fetch the player with highest MVP
    playerWithHighestMvp(){
        let input = this.inputData;
        let playerswithMvp = {};
        let playerWithHighestMvp =  "";
        let count  = -1;
        // loop through the input match data list and add the count of MVP for each player
        for (let i = 0; i < input.length; i++){
            playerswithMvp[input[i].player_of_match] = (input[i].player_of_match in playerswithMvp) ? playerswithMvp[input[i].player_of_match] + 1 : 1;
        }
        // loop through to fetch the highest number of MVP for each player
        for (const key in playerswithMvp){
            if (playerswithMvp[key] > count){
                playerWithHighestMvp = key;
                count = playerswithMvp[key];
            }
        }
        return playerswithMvp;
    }

    // function to return matchId for a given season
    returnMatchIdForASeason(year){
        let matchIds = [];
        let input = this.inputData;
        for (let i =0; i< input.length; i++){
            if (input[i].season === year){
                matchIds.push(input[i].id);
            }
        }
        return matchIds;
    }

    // function to return matchdata for a matchID
    returnMatchDataForAMatchID(matchId){
        let deliveriesData = this.deliveriesData;
        let dataForMatchId = [];
        let foundFlag = false;
        for (let i = 0; i < deliveriesData.length; i++){
            if (deliveriesData[i].match_id == matchId){
                foundFlag = true;
                dataForMatchId.push(deliveriesData[i]);
            }
            else if (foundFlag == true){
                    break;
            }
        }
        return dataForMatchId;
    }

    // Brute force method intially written to fetch the concided Extra Runs
    extraRunsPerTeamInAYear(){
        // function call to fetch the matchID's for 2016
        let allMatchIds = this.returnMatchIdForASeason("2016");
        let data = {};
        let extraRunsConcided = {};
        for (let i = 0; i < allMatchIds.length; i++){
            // function call to fetch the match details for the match Id's
            data = this.returnMatchDataForAMatchID(allMatchIds[i]);
            for (let i = 0; i < data.length; i++){
                // Parsing through each item on data to fetch extra runs
                if (!(data[i].bowling_team in extraRunsConcided)){
                    extraRunsConcided[data[i].bowling_team] = parseInt(data[i].extra_runs, 10);
                }
                else{
                    extraRunsConcided[data[i].bowling_team] += parseInt(data[i].extra_runs, 10);
                }
            }
        }
        return extraRunsConcided;
    }

    // Alternative Concise method for Fetching Concided Extra Runs
    concidedRunsFromEachTeam(){
        // function call to fetch the matchID's for 2016
        let matchID = this.returnMatchIdForASeason("2016");
        let deliveries = this.deliveriesData;
        let concidedRuns = {};
        for (let i = 0; i < deliveries.length; i++){
            // checking for each deliveries data's id == an item in the matchID array 
            if(matchID.includes(deliveries[i].match_id, 10)){
                // If the id is present checking if the data is present in the concidedRuns object, else adding
                if (!(deliveries[i].bowling_team in concidedRuns)){
                    concidedRuns[deliveries[i].bowling_team] = parseInt(deliveries[i].extra_runs,10);
                }
                else{
                    concidedRuns[deliveries[i].bowling_team] += parseInt(deliveries[i].extra_runs,10);
                }
            }
        }
        return concidedRuns;
    }

    numberOfTimesOnePlayerDismissedByAnother(){
        let deliveries = this.deliveriesData;
        let highestDismissedData = {};
        for( let i = 0; i < deliveries.length; i++){
            if (!(deliveries[i].bowler in highestDismissedData)){
                highestDismissedData[deliveries[i].bowler] = {};
            }
        }
        for (let i= 0; i < deliveries.length; i++){
            if (deliveries[i].player_dismissed){
                
                if (!(deliveries[i].player_dismissed in highestDismissedData[deliveries[i].bowler])){
                    highestDismissedData[deliveries[i].bowler][deliveries[i].player_dismissed] = 1;
                }
                else{
                    highestDismissedData[deliveries[i].bowler][deliveries[i].player_dismissed] += 1;
                }
            }
        }
        return highestDismissedData
        
    }
}




let dataOutput = new Matches(iplMatchData,iplDeliveries).numberOfTimesOnePlayerDismissedByAnother();
console.log(dataOutput);

