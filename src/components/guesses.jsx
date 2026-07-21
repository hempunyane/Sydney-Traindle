import React from "react";
import MobileContext from "./mobileContext";
import trainNetwork from "../helper/TrainNetwork";
import { getDirectionIndex, DIRECTION_LABELS, DIRECTION_NAMES } from "../helper/direction";
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
    
    getLines(stationGuess){
        return trainNetwork[stationGuess]["lines"]
    }

    constructor(stationGuess, answerStation){
        this.stationName = stationGuess
        this.lines = this.getLines(stationGuess)
        this.lineIcon = this.getIcons(stationGuess, answerStation)
        this.stationsAway = this.getStationsAway(stationGuess, answerStation)
        // Compass direction (0-7, 0 = N clockwise) from this guess toward the answer.
        // null when the guess IS the answer.
        this.direction = getDirectionIndex(stationGuess, answerStation)
        this.directionLabel = this.direction === null ? '' : DIRECTION_LABELS[this.direction]
        this.directionName = this.direction === null ? '' : DIRECTION_NAMES[this.direction]
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