// WinScreen.jsx
import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck } from "react-icons/fa";

const Overlay = styled(motion.div)`
    position: fixed;
    top: -10vh;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: white;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 400px;
    width: 100%;
    text-align: center;
`;

const IconContainer = styled.div`
    margin-bottom: 14px;
`;

const GreenBox = styled.div`
    width: 120px;
    height: 120px;
    background-color: #9EFB96;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const OrangeBox = styled.div`
    width: 86px;
    height: 86px;
    background-color: #F6891F;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 8px solid white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StationName = styled.h1`
    font-size: 24px;
    font-weight: bold;
    margin: 0 0 8px 0;
    color: #333;
`;

const YouGotIt = styled.h2`
    font-size: 40px;
    margin: 40px 0 0 0;
    color: #333;
`;

const SharePrompt = styled.p`
    font-size: 24px;
    margin: 0 0 32px 0;
`;

const ShareButton = styled.button`
    background-color: #F6891F;
    color: white;
    font-size: 24px;
    font-weight: 500;
    padding: 6px 60px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: fit-content;
    transition: transform 0.2s;

    &:hover {
        transform: scale(1.02);
    }

    &:active {
        transform: scale(0.98);
    }
`;

const SeeGuessesButton = styled.button`
    background: none;
    border: none;
    color: #333;
    font-size: 15px;
    text-decoration: underline;
    cursor: pointer;
    padding: 8px;
    
    &:hover {
        color: #F6891F;
    }
`;

const WinScreen = ({ stationName, onSeeGuesses }) => {
    return (
        <AnimatePresence>
            <Overlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Content>
                    <IconContainer>
                        <GreenBox>
                            <OrangeBox>
                              <FaCheck color='white' size={'50px'}/>
                            </OrangeBox>
                        </GreenBox>
                    </IconContainer>

                    <StationName>{stationName}</StationName>
                    <YouGotIt>You Got It!</YouGotIt>
                    <SharePrompt>Share your guesses?</SharePrompt>

                    <ShareButton onClick={() => console.log('shared')}>
                        Share
                    </ShareButton>

                    <SeeGuessesButton onClick={onSeeGuesses}>
                        I want to see my guesses
                    </SeeGuessesButton>
                </Content>
            </Overlay>
        </AnimatePresence>
    );
};

export default WinScreen;