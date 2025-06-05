import React from "react";
import MobileContext from "./MobileContext";
import trainNetwork from "../helper/TrainNetwork";
import styled from "styled-components";
import { PieIconGenerator, TrainlinePopout } from "./TrainlineIconDisplays";

//render() method is only used to display outside of the game, e.g. end screen
//renderCurrent() / renderPrevious() are used when used in game
//possible because guess instances are stored in a list and dont render by default
export class Guess extends React.Component {
    constructor(props){
        super(props)
        this.stationName = this.props.stationGuess
        this.lines = this.getLines(this.props.stationGuess)
        this.lineIcon = this.getIcons(this.props.stationGuess, this.props.answerStation)
        this.stationsAway = this.getStationsAway(this.props.stationGuess, this.props.answerStation)
        this.distanceFromCentral = this.getDistanceFromCentral(this.props.stationGuess)
        this.distanceIcon = this.getDistanceIcon(this.props.stationGuess, this.props.answerStation)
    }

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

    getCorrectColour(type, data){
        if (type === "distance"){
            let answerDist = this.props.answerStation
            let tolerance = answerDist*0.2
            if (data === 0){
                return "green"
            }
            if (data < answerDist+tolerance && data > answerDist-tolerance){
                return "yellow"
            }
            return "red"
        }
        if (type === "stops"){
            if (data === 0) {
                return "green"
            }
            if (data < 10){
                return "yellow"
            }
            return "red"
        }
        if (type === "lines"){
            let hasCommon = false
            let hasUncommon = false
            let answerStationLines = trainNetwork[this.props.answerStation]["lines"]

            if (data.length != answerStationLines.length){
                hasUncommon = true
            }
            //makes type the smaller of the two
            if (data.length > answerStationLines.length){
                let temp = answerStationLines
                answerStationLines = data
                data = temp
            }
            
            //loop through and check for matches
            for (let i = 0; i < data.length; i++){
                if (answerStationLines.includes(data[i])){
                    hasCommon = true
                }
                else {
                    hasUncommon = true
                }
            }

            if (hasCommon && !hasUncommon){
                return "green"
            }
            if (hasCommon && hasUncommon){
                return "yellow"
            }
            return "red"
        }
    }

    renderCurrent(){
        return <div className="last-guessed-container">
            <div className="relative">
                <div className="popout-icon-align">
                    <div 
                        onMouseEnter={() => this.managePopout(this.stationName, true)}
                        onMouseLeave={() => this.managePopout(this.stationName, false)}
                    >
                        {this.lines.length === 1 ? (
                            <img src={this.lineIcon}></img>
                        ) : (
                            <PieIconGenerator key={this.stationName} lines={this.lines}/>
                        )}
                    </div>
                </div>
                <div className={"large-icon-guess-indicator "+this.getCorrectColour("lines", this.lines)}></div>
            </div>
            <div className="symbol-splitter">
                <div className="large-answer-text">
                    <h2 className="answer-field-h2">{this.stationName}</h2>
                    <h3 className="answer-field-h3">{this.distanceFromCentral}km from Central</h3>
                </div>
                <div className="symbol-container">
                    <div>
                        <h3 className="answer-field-h3">Dist.</h3>
                        <div className={"hint-circle "+this.getCorrectColour("distance", this.distance)}>
                            <img src={this.distanceIcon}></img>
                        </div>
                    </div>
                    <div>
                        <h3 className="answer-field-h3">Stops</h3>
                        <div className={"hint-circle "+this.getCorrectColour("stops", this.stationsAway)}>
                            <h2>{this.stationsAway}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    //index is used to decide background color
    renderPrevious(index){
        return <div>
            <div className="small-answer-group">
                <div className="relative">
                    <div className="popout-icon-align">
                        <div
                            onMouseEnter={() => this.managePopout(this.stationName, true)}
                            onMouseLeave={() => this.managePopout(this.stationName, false)}
                            className="previous-guess-icon"
                        >
                            {this.lines.length === 1 ? (
                                <img className="previous-guess-icon" src={this.lineIcon}></img>
                            ) : (
                                <PieIconGenerator key={this.stationName} isSmall={true} lines={this.lines}/>
                            )}
                        </div>

                    </div>
                    <div className={"small-icon-guess-indicator "+this.getCorrectColour("lines", this.lines)}></div>
                </div>
                <div>
                    <h2 className="answer-field-h2 no-margin">{this.stationName}</h2>
                    <h3 className="answer-field-h3 no-margin">{this.distanceFromCentral} km from Central</h3>
                </div>
            </div>
            <div className="small-answer-group">
                <div className={"hint-circle "+this.getCorrectColour("distance", this.distance)}>
                    <img className="previous-guess-symbol" src={this.distanceIcon}></img>
                </div>
                <div className={"hint-circle "+this.getCorrectColour("stops", this.stationsAway)}>
                    <div className="previosu-guess-symbol center-text-symbol">
                        <h2>{this.stationsAway}</h2>
                    </div>
                </div>
            </div>
        </div>
    }

    render(){
        if (this.props.current){
            return this.renderCurrent()
        }
        return this.renderPrevious()
    }
}

export class GuessesLeft extends React.Component {
    static contextType = MobileContext;

    render(){
        const GuessesLeftContainer = styled.div`
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            position: relative;
            top: 9px;
            flex: 1;

            h2 {
                font-size: 32pt;
                font-family: 'Inter';
                font-weight: 400;
                color: #f6891f;
            }
        `;

        const guesses = this.context.getGuessesLeft();

        return (
            <GuessesLeftContainer className="guesses-left-container end-guesses">
                <h3 className="answer-field-h3 no-margin">Guesses</h3>
                <h2 className="no-margin">{guesses} left</h2>
            </GuessesLeftContainer>
        );
    }
}