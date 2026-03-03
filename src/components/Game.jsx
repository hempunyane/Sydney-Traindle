import React, { useCallback, useState, useEffect } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import styled from 'styled-components';
import SearchBox from './searchBox';
import trainNetwork from "../helper/TrainNetwork";
import { Guess, GuessesLeft } from './guesses';
import TutorialHighlighter from './TutorialHighlighter';
import CurrentStation from './CurrentStation';
import StationHistory from './StationHistory';

const MAX_GUESSES = 7;

// import { TrainlinePopout, PieIconGenerator } from './trainlineIconDisplays';
// import Timer from './timer';
//import MobileContext from './mobileContext';


// TODO: figure out how mobile top inset works
const GameContainer = styled.div.attrs(() => ({}))`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: ${props => (props.$isMobile ? '100%' : '600px')};
  box-sizing: border-box;
  padding-top: 85px;
  position: fixed;
  background: linear-gradient(to bottom, #F6891F 66px, white 66px);
`;

const TopSection = styled.div`
  width: 90%;
  margin-bottom: 8px;
`;

const SydneyTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 2px;
  background-color: #e0e0e0;
  color: #000000;
  font-size: 10px;
  margin-bottom: 4px;
`;

const SydneyTagIcon = styled.img`
  width: 14px;
  height: 14px;
`;

// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

function Game() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // <600px
    const stations = Object.keys(trainNetwork);

    const [answerStation, setAnswerStation] = useState(null);
    const [guesses, setGuesses] = useState([]);
    const [hasWon, setHasWon] = useState(false);
  
    useEffect(() => {
        const storedDate = localStorage.getItem('gameDate');
        const storedGuesses = JSON.parse(localStorage.getItem('selectedStations')) || [];
        const storedHasWon = JSON.parse(localStorage.getItem('won')) || false;

        /* mock date for testing */
        const mockDate = new Date('2025-02-05');
        const today = mockDate.toISOString().split('T')[0];
    
        // const today = new Date().toISOString().split('T')[0];
        // const day = Math.floor((new Date() - new Date(2000, 0, 1)) / 86400000);
    
        if (storedDate === today) {
            setAnswerStation(localStorage.getItem('answer'));
            setGuesses(storedGuesses);
            setHasWon(storedHasWon);
        } else {
            const newAnswer = stations[Math.floor(Math.random() * stations.length)];
            //const newAnswer = stations[Math.floor(seededRandom(day) * stations.length)];
            setAnswerStation(newAnswer);
    
            localStorage.setItem('gameDate', today);
            localStorage.setItem('answer', newAnswer);
            localStorage.setItem('selectedStations', JSON.stringify([]));
            localStorage.setItem('won', false);
    
            setHasWon(false);
            setGuesses([]);
        }
    }, []);

    const addGuess = useCallback((stationGuess) => {   
        const newGuesses = [
            new Guess(stationGuess, answerStation),
            ...guesses,
        ];
        setGuesses(newGuesses);
        localStorage.setItem('selectedStations', JSON.stringify(newGuesses));

        // Check if won
        if (stationGuess === answerStation) {
            setHasWon(true);
            localStorage.setItem('won', true);
            setShowSearchbar(false);
        }
    }, [guesses, answerStation]);

    const submitGuess = useCallback((guess) => {
        const isDuplicate = guesses.some(g => g.stationName === guess);
        if (isDuplicate) return;
    
        addGuess(guess);
        console.log(guesses)
    }, [guesses, addGuess]);

    if (!answerStation) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center'
        }}>
            <GameContainer $isMobile={isMobile}>
                <TopSection>
                    <SydneyTag>
                        <SydneyTagIcon src="/Logos/TfNSW_T.svg" alt="Sydney Trains" />
                        Sydney Traindle
                    </SydneyTag>
                    <CurrentStation currentGuess={guesses[0]} answerStation={answerStation}/>
                </TopSection>
                <StationHistory guesses={guesses.slice(1)} answerStation={answerStation}/>
                <SearchBox 
                    onSubmit={submitGuess}
                    suggestions={stations}
                    guessesLeft={MAX_GUESSES - guesses.length}
                    />
                {/* <TutorialHighlighter/> */}
            </GameContainer>

        </div>
    )
}

export default Game