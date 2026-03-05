import React, { useCallback, useState, useEffect } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import styled from 'styled-components';
import SearchBox from './searchBox';
import trainNetwork from "../helper/TrainNetwork";
import { Guess, GuessesLeft } from './guesses';
import TutorialHighlighter from './TutorialHighlighter';
import CurrentStation from './CurrentStation';
import StationHistory from './StationHistory';
import EndScreen from './EndScreen';

const MAX_GUESSES = 8;

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
  padding-top: 15px;
  position: fixed;
  background: white;
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

const getTodayDateString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getTodaysAnswer = (stations) => {
  // Use days since 2000-01-01 as seed
  const today = new Date();
  const start = new Date(2000, 0, 1);
  const daysSinceEpoch = Math.floor((today - start) / 86400000);
  const randomIndex = Math.floor(seededRandom(daysSinceEpoch) * stations.length);
  return stations[randomIndex];
};
  
// Load stats from localStorage
const loadStats = () => {
  const defaultStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    lastGameDate: '',
    lastGameResult: null
  };
  const stored = localStorage.getItem('gameStats');
  return stored ? JSON.parse(stored) : defaultStats;
};

// Save stats
const saveStats = (stats) => {
  localStorage.setItem('gameStats', JSON.stringify(stats));
};

function Game() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const stations = Object.keys(trainNetwork);

    const [answerStation, setAnswerStation] = useState(null);
    const [guesses, setGuesses] = useState([]);
    const [hasWon, setHasWon] = useState(false);
    const [hasLost, setHasLost] = useState(false);
    const [showEndScreen, setShowEndScreen] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);
    const [stats, setStats] = useState(loadStats);

    const initialized = React.useRef(false);
  
    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const storedDate = localStorage.getItem('gameDate');
        const storedGuesses = JSON.parse(localStorage.getItem('selectedStations')) || [];
        const storedHasWon = JSON.parse(localStorage.getItem('won')) || false;
        const storedHasLost = JSON.parse(localStorage.getItem('lost')) || false;

        const today = getTodayDateString();
        //const mockDate = new Date('2025-02-03');
        //const today = mockDate.toISOString().split('T')[0];
        const todaysAnswer = getTodaysAnswer(stations);
        
        const isFirstVisit = storedDate === null;
        setShowTutorial(isFirstVisit);
        // need ot not store answer in local
        if (storedDate === today) {
            setAnswerStation(todaysAnswer);
            setGuesses(storedGuesses);
            setHasWon(storedHasWon);
            setHasLost(storedHasLost);
        } else {
            setAnswerStation(todaysAnswer);
            setHasWon(false);
            setHasLost(false);
            setGuesses([]);
  
            localStorage.setItem('gameDate', today);
            localStorage.setItem('selectedStations', JSON.stringify([]));
            localStorage.setItem('won', false);
            localStorage.setItem('lost', false);
        }

    }, []);

    // Check for win/loss conditions
    useEffect(() => {
        // Check for win
        if (hasWon && guesses.length > 0 && guesses[0].stationName === answerStation) {
            setShowEndScreen(true);
        }
        
        // Check for loss (ran out of guesses and haven't won)
        const guessesLeft = MAX_GUESSES - guesses.length;
        if (!hasWon && guessesLeft === 0 && guesses.length > 0) {
            setHasLost(true);
            localStorage.setItem('lost', true);
            setShowEndScreen(true);
        }
    }, [hasWon, guesses, answerStation]);

    const handleSeeGuesses = () => {
        setShowEndScreen(false);
    };
    const getGuessesForDisplay = () => {
      if (hasWon) {
        return guesses.slice(1).map(g => g.stationName.replace(/\s*station$/i, ''));
      } else {
        return guesses.slice(1).map(g => g.stationName.replace(/\s*station$/i, ''));
      }
    };

    useEffect(() => {
        if (showEndScreen) {
          const today = getTodayDateString();
          // Only update if not already recorded for today

          if (stats.lastGameDate !== today) {
            const newStats = { ...stats };
            newStats.gamesPlayed += 1;
            if (hasWon) {
              newStats.gamesWon += 1;
              newStats.currentStreak = stats.lastGameResult === 'win' ? stats.currentStreak + 1 : 1;
            } else {
              newStats.currentStreak = 0;
            }
            newStats.lastGameDate = today;
            newStats.lastGameResult = hasWon ? 'win' : 'lose';
            setStats(newStats);
            saveStats(newStats);
          }
        }
    }, [showEndScreen, hasWon]);

    const addGuess = useCallback((stationGuess) => { 
        if (hasWon || hasLost) return;

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
        }
    }, [guesses, answerStation, hasWon, hasLost]);

    const submitGuess = useCallback((guess) => {
        const isDuplicate = guesses.some(g => g.stationName === guess);
        if (isDuplicate) return;
    
        addGuess(guess);
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
                    onHelp={() => setShowTutorial(true)}
                    disabled={hasWon || hasLost} // Disable search if game is over
                />
                {showTutorial && (
                    <TutorialHighlighter 
                        onFinish={() => setShowTutorial(false)} 
                        show={showTutorial} 
                    />
                )}
                {showEndScreen && (
                    <EndScreen
                    stationName={answerStation}
                    guesses={getGuessesForDisplay()}
                    maxGuesses={MAX_GUESSES}
                    isWin={hasWon}
                    onSeeGuesses={handleSeeGuesses}
                    stats={{
                      played: stats.gamesPlayed,
                      wins: stats.gamesWon,
                      streak: stats.currentStreak
                    }}
                  />
                )}
            </GameContainer>
        </div>
    )
}

export default Game;