import React from "react";
import MobileContext from "./mobileContext";
import trainNetwork from "../helper/TrainNetwork";
import styled from "styled-components";

export class Guess{
    //CHANGE CODE WITH ICON SOLUTION
    getIcons(stationGuess, answerStation){ 
        return './Trainlines/'+trainNetwork[stationGuess]['lines'][0]+'.svg'
    }

    //BFS to calculate dist from guess to answer in stations
    getStationsAway(stationGuess, answerStation){
        if (stationGuess === answerStation) return 0;
      
        const visited = new Set();
        const queue = [{ station: stationGuess, distance: 0 }];
      
        while (queue.length > 0) {
          const { station, distance } = queue.shift();
      
          if (station === answerStation) {
            return distance;
          }
      
          visited.add(station);
    
          for (const neighbor of trainNetwork[station]['adjacent'] || []) {
            if (!visited.has(neighbor)) {
              queue.push({ station: neighbor, distance: distance + 1 });
            }
          }
        }
      
        return -1;
    }
    
    getDistanceFromCentral(stationGuess){
        return trainNetwork[stationGuess]['dist']
    }

    //returns the path to a different arrow icon if guess is closer of further away from answer
    getDistanceIcon(stationGuess, answerStation){
        if (trainNetwork[stationGuess]['dist'] > trainNetwork[answerStation]['dist']){
            return './Icons/arrow_down.svg'
        }
        if (trainNetwork[stationGuess]['dist'] < trainNetwork[answerStation]['dist']){
            return './Icons/arrow_up.svg'
        }
        return './Icons/equal.svg'
    }

    getLines(stationGuess){
        return trainNetwork[stationGuess]["lines"]
    }

    constructor(stationGuess, answerStation){
        this.stationName = stationGuess
        this.lines = this.getLines(stationGuess)
        this.lineIcon = this.getIcons(stationGuess, answerStation)
        this.stationsAway = this.getStationsAway(stationGuess, answerStation)
        this.distanceFromCentral = this.getDistanceFromCentral(stationGuess)
        this.distanceIcon = this.getDistanceIcon(stationGuess, answerStation)
    }
}

export class GuessesLeft extends React.Component {
    render() {
        const GuessesLeftContainer = styled.div`
            margin: 0px;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            position: relative;
            flex: 1;

            h3 {
                font-size: 12px;
                font-weight: 100;
            }

            h2 {
                margin: 0px;
                font-size: 40px;
                font-family: 'Inter';
                font-weight: 400;
                color: #f6891f;
            }
        `;

        return (
            <GuessesLeftContainer className="guesses-left-container end-guesses">
                <h3>Guesses</h3>
                <h2>{this.props.guessesLeft} left</h2>
            </GuessesLeftContainer>
        );
    }
}