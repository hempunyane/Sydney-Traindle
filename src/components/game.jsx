import { useMediaQuery, useTheme } from '@mui/material';
import styled from 'styled-components';

// import trainNetwork from "../helper/TrainNetwork";
// import { TrainlinePopout, PieIconGenerator } from './trainlineIconDisplays';
// import { Guess, GuessesLeft } from './guesses';
// import Timer from './timer';
// import SearchBox from './searchBox';
//import MobileContext from './mobileContext';

import CurrentStation from './CurrentStation';
import StationHistory from './StationHistory';
import Keyboard from './Keyboard';

// TODO: figure out how mobile top inset works
const GameContainer = styled.div.attrs(() => ({}))`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  width: ${props => (props.$isMobile ? '100%' : '600px')};
  box-sizing: border-box;
  padding-top: 70px;
  padding-left: 25px;
  padding-right: 25px;
  position: fixed;
  background: linear-gradient(to bottom, #F6891F 50px, white 50px);
`;


function Game() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // <600px

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center'
        }}>
            <GameContainer $isMobile={isMobile}>
                <CurrentStation/>
                <StationHistory/>
                <Keyboard/>
            </GameContainer>
        </div>
    )
}

export default Game