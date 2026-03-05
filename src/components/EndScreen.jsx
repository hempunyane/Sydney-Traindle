// EndScreen.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShareAlt } from 'react-icons/fa';

// Styled components
const Drawer = styled(motion.div)`
  position: fixed;
  top: 118px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 65px); /* 14px margins on each side */
  max-width: 530px;
  background: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  position: relative;
`;

const SeeGuessesButton = styled.button`
  background: none;
  border: none;
  color: #333;
  font-size: 15px;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  
  &:hover {
    color: #F6891F;
  }
`;

const ShareIconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  font-size: 24px;
  display: flex;
  align-items: center;
  margin-left: auto;
  
  &:hover {
    color: #F6891F;
  }
`;

const OrangeBox = styled.div`
  width: 100%;
  height: 80px;
  z-index: 1;
  background-color: #F6891F;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
`;

const StationNameBig = styled.span`
  color: white;
  font-size: 32px;
  font-weight: bold;
  text-align: center;
`;

const TimelineContainer = styled.div`
  margin-top: -5px;
  display: flex;
  gap: 0px;
  margin-bottom: 0px;
  height: calc(98vh - 400px); /* Dynamic height based on viewport */
  min-height: 300px; /* Minimum height to ensure visibility */
  max-height: 550px; /* Maximum height to prevent overflow */
`;

const BarContainer = styled.div`
  position: relative;
  width: 10px;
  height: 100%;
  background: ${({ $usedRatio }) => `linear-gradient(to bottom, 
    #F6891F 0%, 
    #F6891F ${$usedRatio}%, 
    #CCCCCC ${$usedRatio}%, 
    #CCCCCC 100%)`};
  border-radius: 5px;
  margin-top: 0px; /* Removed negative margin */
  margin-left: 20px;
`;

const Dot = styled.div`
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 11px;
  height: 11px;
  background: white;
  border: 2px solid #999;
  border-radius: 50%;
  z-index: 2;
  pointer-events: none;
`;

const LabelsContainer = styled.div`
  margin-top: ${({ $height }) => `${$height/2 - 7}px`};
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const LabelRow = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 24px;
  color: #333;
  gap: 0px;
  height: 100%;
`;

const FlagIcon = styled.img`
  width: 42px;
  height: 42px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #333;
  margin: 24px 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  text-align: center;
  margin-top: auto;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatNumber = styled.div`
  font-size: 60px;
  font-weight: bold;
  color: #333;
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 15px;
  color: #666;
  margin-top: 4px;
`;

const EndScreen = ({ 
	stationName, 
	guesses,           // array of guess objects with name and stationsAway
	maxGuesses,        // MAX_GUESSES from Game
	isWin, 
	onSeeGuesses,
	stats              // { played, wins, streak }
  }) => {
	const totalSlots = maxGuesses - 1; // number of dots
	const usedCount = guesses.length;
	
	// Create ref for TimelineContainer to get its height
	const [timelineHeight, setTimelineHeight] = useState(450);
	const timelineRef = React.useRef(null);
  
	// Update timeline height on resize
	useEffect(() => {
	  const updateHeight = () => {
		if (timelineRef.current) {
		  setTimelineHeight(timelineRef.current.clientHeight);
		}
	  };
  
	  updateHeight();
	  window.addEventListener('resize', updateHeight);
	  return () => window.removeEventListener('resize', updateHeight);
	}, []);
  
	// Fill remaining slots with flag icon
	const items = [
	  ...guesses,
	  ...Array(totalSlots - usedCount).fill('flag')
	];
  
	// Calculate segment height based on actual timeline height
	const segmentHeight = timelineHeight / totalSlots;
  
	const getStopColor = (stationsAway) => {
	  if (stationsAway === 0) return 'green';
	  if (stationsAway <= 20) return 'yellow';
	  return 'red';
	};
  
	const handleShare = () => {
	  const message = isWin 
		? `I guessed ${stationName} and won!`
		: `I couldn't guess ${stationName}. Can you do better?`;
	  if (navigator.share) {
		navigator.share({
		  title: 'Sydney Traindle',
		  text: message,
		  url: window.location.href,
		});
	  } else {
		navigator.clipboard.writeText(
		  `${message} Play Sydney Traindle at ${window.location.href}`
		);
		alert('Result copied to clipboard!');
	  }
	};
  
	const winPercentage = stats.played > 0 
	  ? Math.round((stats.wins / stats.played) * 100) 
	  : 0;
  
	return (
	  <AnimatePresence>
		<Drawer
        initial={{ y: '100%', x: '-50%' }}
        animate={{ y: 0, x: '-50%' }}
        exit={{ y: '100%', x: '-50%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
		  <TopBar>
			<SeeGuessesButton onClick={onSeeGuesses}>
			  I want to see my guesses
			</SeeGuessesButton>
			<ShareIconButton onClick={handleShare}>
			  <FaShareAlt />
			</ShareIconButton>
		  </TopBar>
  
		  <OrangeBox>
			<StationNameBig>{stationName.replace(/\s*station$/i, '')}</StationNameBig>
		  </OrangeBox>
  
		  <TimelineContainer ref={timelineRef}>
			<BarContainer $usedRatio={(usedCount / totalSlots) * 100}>
			  {Array.from({ length: totalSlots }).map((_, i) => {
				// Position dot at the center of each segment
				const top = (i * segmentHeight) + segmentHeight;				
				return <Dot key={i} style={{ top: `${top}px` }} />;
			  })}
			</BarContainer>
  
			<LabelsContainer $height={segmentHeight}>
			  {items.map((item, i) => (
				<LabelRow key={i}>
				  {item === 'flag' ? (
					<FlagIcon src="/Icons/Flag.svg" alt="unused guess" />
				  ) : (
					<span style={{ marginLeft: '16px' }}>{item}</span>
				  )}
				</LabelRow>
			  ))}
			</LabelsContainer>
		  </TimelineContainer>
  
		  <Divider />
  
		  <StatsGrid>
			<StatItem>
			  <StatNumber>{stats.played}</StatNumber>
			  <StatLabel>Played</StatLabel>
			</StatItem>
			<StatItem>
			  <StatNumber>{winPercentage}</StatNumber>
			  <StatLabel>Win %</StatLabel>
			</StatItem>
			<StatItem>
			  <StatNumber>{stats.streak}</StatNumber>
			  <StatLabel>Streak</StatLabel>
			</StatItem>
		  </StatsGrid>
		</Drawer>
	  </AnimatePresence>
	);
};
  
export default EndScreen;