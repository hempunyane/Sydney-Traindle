import React, { createRef } from 'react';
import trainNetwork from "../helper/TrainNetwork";
import styled from 'styled-components';
import { TrainlinePopout, PieIconGenerator } from './TrainlineIconDisplays';
import { Guess, GuessesLeft } from './Guesses';
import Timer from './Timer';
import SearchBox from './SearchBox';
import MobileContext from './MobileContext';

//takes props: 
//  Function closeHTP = a function that changes the a state in the parent to control visibility
//  Bool showButton = a bool deciding if a close button should be rendered
class HowToPlay extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            screenSelect: 0,
        }
        this.screens = this.addScreens()
        this.addScreens()
        this.maxScreenIndex = this.screens.length-1
    }

    //definitions for how to play screens
    addScreens(){
        const HTPSquare = styled.div`
            width: 70%;
            height: 70%;
            border-radius: 10px;
            background-color: #e4e4e4;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            h2 {
                font-size: 28pt;
                font-weight: 400;
                text-align: center;
                margin: 20px;
            }

            h3 {
                font-family: 'Inter';
                font-weight: 300;
                font-size: 14pt;
                text-align: center;
                margin: 20px;
            }
            
            img {
                width: 40px;
                height: 40px;
            }

            #t-logo {
                margin: auto;
                width: 75px !important;
                height: 75px !important;
            }
        `

        const HTPCircle = styled.div`
            width: 50px;
            height: 50px;
            border-radius: 100px;
            border: 2px solid #b8b8b8;
            display: flex;
            align-items: center;
            margin: 0;

            img {
                width: 90%;
                height: 90%;
                margin: auto;
            }
        `

        const HTPPictureContainer = styled.div`
            display: flex;
            margin-left: auto;
            margin-right: auto;
            justify-content: space-around;
            width: 75%;
            margin-top: 0;
            margin-bottom: 0;
        `

        //holds each screen
        let screens = []

        screens.push(<HTPSquare className="shadow">
            <h2>Goal</h2>
            <img id="t-logo" src="./Logos/TfNSW_T.svg"></img>
            <h3>
                Use the search box at the bottom to try and guess the correct station,
                you will be given hints along the way to help you guess.
            </h3>
        </HTPSquare>)

        screens.push(<HTPSquare className="shadow">
            <h2>Distance</h2>
            <HTPPictureContainer>
                <HTPCircle>
                    <img src="./Icons/arrow_up.svg"></img>
                </HTPCircle>
                <HTPCircle>
                    <img src="./Icons/arrow_down.svg"></img>
                </HTPCircle>
            </HTPPictureContainer>
            <h3>
                An up arrow means your guess is further from central than the answer station and vice versa.
            </h3>
        </HTPSquare>)

        screens.push(<HTPSquare className="shadow">
            <h2>Stops</h2>
            <HTPPictureContainer>
                <HTPCircle>
                    <h2 className="center-text">12</h2>
                </HTPCircle>
            </HTPPictureContainer>
            <h3>
                A number will be shown to represent how many stations the correct answer is from your guess
            </h3>
        </HTPSquare>)

        screens.push(<HTPSquare className="shadow">
            <h2>Colours</h2>
            <HTPPictureContainer>
                <HTPCircle className="green"/>
                <HTPCircle className="yellow"/>
                <HTPCircle className="red"/>
            </HTPPictureContainer>
            <h3 className="space-text">
                Green - correct<br/>
                Yellow - partially correct<br/>
                Red - incorrect
            </h3>
        </HTPSquare>)

        //sets screen array in constructor to array holding all screens
        this.screens = screens
    }

    changeScreen(goToNextScreen){
        let screenNo
        if (goToNextScreen){
            screenNo = this.state.screenSelect+1
            if (screenNo > this.maxScreenIndex){
                screenNo = 0
            }
        }
        else {
            screenNo = this.state.screenSelect-1
            if (screenNo < 0){
                screenNo = this.maxScreenIndex
            }
        }
        this.setState({
            screenSelect: screenNo
        })
    }

    render(){
        const HTPContainer = styled.div`
            display: flex;
            flex-wrap: wrap;
            width: 460px;
            height: 460px;
            margin: auto;
            margin-top: 20px;
            margin-bottom: 20px;
            justify-content: center;
            align-items: center;
        `

        const HTPArrow = styled.img`
            width: 60px;
            height: 60px;
        `

        const HTPCloseContainer = styled.div`
            display: flex;
            width: calc(100% - 20px);
            height: 30px;
            justify-content: flex-end;
            margin: 10px;
        `

        const HTPCloseButton = styled.div`
            width: 30px;
            height: 30px;
            border-radius: 100px;
            background-color: #f6891f;
            display: flex;
            justify-content: center;
            align-items: center;
        `


        return <div>
            <HTPCloseContainer>
                {/*Renders a close button when prop showButton is true*/}
                {this.props.showButton ? (
                    <HTPCloseButton onClick={() => this.props.closeHTP()} className="cursor-hover">
                        <img onClick={() => this.props.closeHTP()} src="./Icons/close.svg" className="invert cursor-hover"></img>
                    </HTPCloseButton>
                ) : (null)}
            </HTPCloseContainer>

            <HTPContainer>
                <HTPArrow onClick={() => this.changeScreen(false)} className="cursor-hover" src="./Icons/arrow_back.svg"></HTPArrow>
                    {this.state.screenSelect === 0 && this.screens[0]}
                    {this.state.screenSelect === 1 && this.screens[1]}
                    {this.state.screenSelect === 2 && this.screens[2]}
                    {this.state.screenSelect === 3 && this.screens[3]}
                <HTPArrow onClick={() => this.changeScreen(true)} className="cursor-hover" src="./Icons/arrow_forward.svg"></HTPArrow>
            </HTPContainer>
        </div>
    }
}

//takes props:
//  Bool isWin = Changes render depending on if the player has won or lost
//  Guess answerStation = Instance of a guess object of the answer station
class EndScreen extends React.Component {
    render(){
        const EndContainer = styled.div`
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            align-items: center;
            justify-content: space-between;
        `

        const ButtonContainer = styled.div`
            display: flex;
            justify-content: center;
            align-items: center;
            height: 20%;
            width: 80%;
            border-top: 1px solid #ebece6;
            gap: 100px;

            div {
                background-color: #f6891f;
                width: 70px;
                height: 70px;
                border-radius: 70px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `

        const StationContainer = styled.div`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 80%;
            height: 80%;

            Guess {
                border-top: 1px solid #ebece6;
            }
        `

        let endMessage
        if (this.props.isWin){
            endMessage = "You correctly guessed"
        }
        else {
            endMessage = "The correct station was"
        }
        
        return <EndContainer>
            <StationContainer>
                <h2>{endMessage}</h2>
                {/*Move guess rendering into guess component and render answer station here from prop*/}
                RENDER GUESS HERE
            </StationContainer>
            <GuessesLeft/>
            <ButtonContainer>
                <div>
                    <img src="./Icons/share.svg"></img>
                </div>
                <div>
                    <img src="./Icons/infinite.svg"></img>
                </div>
            </ButtonContainer>
        </EndContainer>
    }
}



class MobileLayout extends React.Component {
    constructor(props){
        super(props)
        this.timerRef = createRef()
        this.trainlineRefs = {}
        this.state = {
            guesses: [],
            remainingGuesses: 7,
            showMap: false,
            showHTP: false,
            tipSelect: 0,
            showSearchbar: true
        }
    }

    toggleHTP = () => {
        this.setState({
            showHTP: !this.state.showHTP,
            showMap: false
        })
    }

    toggleMap(){
        this.setState({
            showMap: !this.state.showMap
        })
    }
    
    toggleSearchbar(){
        this.setState({
            showSearchbar: !this.state.showSearchbar
        })
    }

    updateTimerState = (startTimer) => {
        if (this.timerRef.current) {
            this.timerRef.current.toggleTimer(startTimer)
        }
    }

    submitGuess = (guess) => {
        //dont allow for duplicates
        const isDuplicate = this.state.guesses.some(g => 
            g.stationName === guess
        )
        if (isDuplicate){
            return
        }

        this.addGuess(guess)
    }

    getGuessesLeft = () => {
        return 7-this.state.guesses.length
    }

    addGuess(stationGuess){
        if (this.state.guesses.length == 0){ //starts timer on first guess
            this.updateTimerState(true)
        }
        this.setState((prevState) => ({
            guesses: [{guess: stationGuess, answer: this.props.answerStation}, ...prevState.guesses],
            remainingGuesses: prevState.remainingGuesses-1
        }));
    }

    managePopout = (stationKey, show) => {
        const popout = this.trainlineRefs[stationKey];
        if (popout) {
            popout.updatePopout(show);
        }
    }

    renderCurrent(){
        return this.state.guesses.length ? (
            <Guess
                stationGuess={this.state.guesses[0].guess}
                answerStation={this.state.guesses[0].answer}
                current={true}
            />
        ) : null
    }

    renderHistory(){
        return this.state.guesses.slice(1).map((guess, i) => (
            <Guess
                key={i}
                stationGuess={guess.guess}
                answerStation={guess.answer}
                current={false}
            />
        ));
    }

    //function which returns the correct screen to be rendered depending on different state options
    screenSelect() {
        if (this.state.guesses.length == 0){
            return <HowToPlay closeHTP={this.toggleHTP} showButton={false}/>;
        }

        let gameScreen = <div className="answer-field-body">
            {this.renderCurrent()}
            <div className="history-container">
                <h3 className="answer-field-h3">History</h3>
                {this.renderHistory()}
            </div>
            <div className="answer-footer">
                <div className="footer-button-container">
                    <div onClick={() => this.toggleMap()} className="cursor-hover footer-button">
                        <img onClick={() => this.toggleMap()} className="cursor-hover"src="./Icons/pin.svg"></img>
                    </div>
                    <div onClick={() => this.toggleHTP()} className="footer-button cursor-hover">
                        <img onClick={() => this.toggleHTP()} className="cursor-hover" src="./Icons/help.svg"></img>
                    </div>
                </div>
                <GuessesLeft/>
                <div>
                </div> 
            </div>
        </div>

        //display wins creen
        if (this.state.guesses[0].stationsAway === 0){
            if (this.state.showSearchbar){
                //hide search bar
                this.toggleSearchbar()
                //pause timer
                this.updateTimerState(false)
            }
            return <EndScreen isWin={true}/>
        }

        //display lose screen
        if (this.state.remainingGuesses == 0){
            if (this.state.showSearchbar){
                //hide search bar
                this.toggleSearchbar()
                //pause timer
                this.updateTimerState(false)
            }
            return <EndScreen isWin={false}/>
        }

        if (this.state.showHTP){
            return <HowToPlay closeHTP={this.toggleHTP} showButton={true}/>
        }

        return gameScreen
    }

    render() {
        const stations = Object.keys(trainNetwork);
        return <MobileContext.Provider value={{getGuessesLeft: this.getGuessesLeft}}>
            <div className='answer-field shadow'>
                {this.state.showMap ? (
                    <div className="map-holder shadow">
                        <div className="map-header">
                            <img onClick={() => this.toggleMap()} className="htp-close-image cursor-hover" src="./Icons/close.svg"></img>
                        </div>
                        Map goes here
                    </div>
                ) : (null)}
                <h1 className='timer'><span>Timer</span><Timer classProp="timer-number" ref={this.timerRef}/></h1>
                {/*Changes what is rendered if no guesses have been made, htp is open, or win/lose*/}
                {this.screenSelect()}
                {this.state.showSearchbar ? (
                    <SearchBox 
                        submitGuess={this.submitGuess} 
                        classProp="answer-field-search" 
                        dummyText="Station Name"
                        suggestions={stations}
                    />
                ) : (null)}
            </div>
        </MobileContext.Provider>
    }
}

export default MobileLayout