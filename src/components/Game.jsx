import React, { useCallback, useState, useEffect } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import styled from 'styled-components';
import SearchBox from './SearchBox';
import trainNetwork from "../helper/TrainNetwork";
import TutorialHighlighter from './TutorialHighlighter';
import CurrentStation from './CurrentStation';
import StationHistory from './StationHistory';
import EndScreen from './EndScreen';
import Hint from './Hint';
import TutorialPrompt from './TutorialPrompt';
import { createGuess } from './Guesses';

const MAX_GUESSES = 8;

const DEMO_ANSWER_OVERRIDE = "Lindfield Station";

// TODO: figure out how mobile top inset works
const GameContainer = styled.div.attrs(() => ({}))`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100dvh;
  width: ${props => (props.$isMobile ? '100%' : '600px')};
  box-sizing: border-box;
  padding-top: 20px;
  padding-bottom: env(safe-area-inset-bottom, 0px); /* Add safe area padding */
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
  if (DEMO_ANSWER_OVERRIDE) return DEMO_ANSWER_OVERRIDE;

  // Use days since 2000-01-01 as seed
  const today = new Date();
  const start = new Date(2000, 0, 1);
  const daysSinceEpoch = Math.floor((today - start) / 86400000);
  const randomIndex = Math.floor(seededRandom(daysSinceEpoch) * stations.length);
  return stations[randomIndex];
};
  
const safeParseJSON = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
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
  return safeParseJSON(localStorage.getItem('gameStats'), defaultStats);
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
    const [guessCount, setGuessCount] = useState(0);
    const [hasWon, setHasWon] = useState(false);
    const [hasLost, setHasLost] = useState(false);
    const [showEndScreen, setShowEndScreen] = useState(false);
    const [isEndScreenOpen, setIsEndScreenOpen] = useState(true);
    const [showTutorial, setShowTutorial] = useState(false);
    const [stats, setStats] = useState(loadStats);
    const [showMap, setShowMap] = useState(false);
    const [showTutorialPrompt, setShowTutorialPrompt] = useState(false);

    const initialized = React.useRef(false);
  
    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const storedDate = localStorage.getItem('gameDate');
        const storedGuesses = safeParseJSON(localStorage.getItem('selectedStations'), []);
        const storedHasWon = safeParseJSON(localStorage.getItem('won'), false);
        const storedHasLost = safeParseJSON(localStorage.getItem('lost'), false);

        const today = getTodayDateString();
        //const mockDate = new Date('2025-02-03');
        //const today = mockDate.toISOString().split('T')[0];
        const todaysAnswer = getTodaysAnswer(stations);
        
        const hideTutorialPrompt = safeParseJSON(localStorage.getItem('hideTutorialPrompt'), false);

        // need ot not store answer in local
        if (storedDate === today) {
            setAnswerStation(todaysAnswer);
            setGuesses(storedGuesses);
            setGuessCount(storedGuesses.length);
            setHasWon(storedHasWon);
            setHasLost(storedHasLost);
            setShowTutorialPrompt(!hideTutorialPrompt && !storedHasWon && !storedHasLost);
        } else {
            setAnswerStation(todaysAnswer);
            setHasWon(false);
            setHasLost(false);
            setGuesses([]);
            setShowTutorialPrompt(!hideTutorialPrompt);
  
            localStorage.setItem('gameDate', today);
            localStorage.setItem('selectedStations', JSON.stringify([]));
            localStorage.setItem('won', false);
            localStorage.setItem('lost', false);
        }

    }, []);

    // Check for win/loss conditions
    useEffect(() => {
        // Check for win
        if (hasWon && guessCount > 0 && guesses[0].stationName === answerStation) {
            setShowEndScreen(true);
        }
        
        // Check for loss (ran out of guesses and haven't won)
        const guessesLeft = MAX_GUESSES - guessCount;
        if (!hasWon && guessesLeft === 0 && guessCount > 0) {
            setHasLost(true);
            localStorage.setItem('lost', true);
            setShowEndScreen(true);
        }
    }, [hasWon, guesses, answerStation]);

    const getGuessesForDisplay = () => {
        return guesses.slice(1).map(g => g.stationName.replace(/\s*station$/i, ''));
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
          createGuess(stationGuess, answerStation),
          ...guesses,
      ];
      setGuesses(newGuesses);
      localStorage.setItem('selectedStations', JSON.stringify(newGuesses));
  
      if (stationGuess === answerStation) {
          setHasWon(true);
          localStorage.setItem('won', true);
      }
    }, [guesses, answerStation, hasWon, hasLost]);

    const submitGuess = useCallback((guess) => {
      if (hasWon || hasLost) return;
      const isDuplicate = guesses.some(g => g.stationName === guess);
      if (isDuplicate) return;
  
      addGuess(guess);
      setGuessCount(prev => prev + 1);
    }, [guesses, addGuess, hasWon, hasLost]);

    const handleSeeGuesses = () => {
      setIsEndScreenOpen(false); // Close the drawer
    };
    
    const handleReopenEndScreen = () => {
        setIsEndScreenOpen(true); // Reopen the drawer
    };

    const handleTutorialPromptResponse = (wantsTutorial, dontShowAgain) => {
      if (dontShowAgain) {
          localStorage.setItem('hideTutorialPrompt', true);
      }
      setShowTutorialPrompt(false);
      if (wantsTutorial) {
          setShowTutorial(true);
      }
    };

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
                    guessesLeft={MAX_GUESSES - guessCount}
                    onHelp={() => setShowTutorial(true)}
                    onMap={() => setShowMap(true)}
                    disabled={hasWon || hasLost}
                    isMobile={isMobile}
                />
                {showTutorialPrompt && (
                    <TutorialPrompt
                        onYes={(dontShowAgain) => handleTutorialPromptResponse(true, dontShowAgain)}
                        onNo={(dontShowAgain) => handleTutorialPromptResponse(false, dontShowAgain)}
                    />
                )}
                {showTutorial && (
                    <TutorialHighlighter
                        onFinish={() => setShowTutorial(false)}
                        show={showTutorial}
                    />
                )}
                {showEndScreen && (
                  <EndScreen
                      stationName={answerStation}
                      lastGuessName={guesses[0]?.stationName?.replace(/\s*station$/i, '')}
                      guesses={getGuessesForDisplay()}
                      maxGuesses={MAX_GUESSES}
                      isWin={hasWon}
                      onSeeGuesses={handleSeeGuesses}
                      onReopen={handleReopenEndScreen}
                      isOpen={isEndScreenOpen}
                      stats={{
                          played: stats.gamesPlayed,
                          wins: stats.gamesWon,
                          streak: stats.currentStreak
                      }}
                  />
              )}
                <Hint 
                    isOpen={showMap}
                    onClose={() => setShowMap(false)}
                />

                
            </GameContainer>
        </div>
    )
}

export default Game;