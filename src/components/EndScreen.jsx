// EndScreen.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShareAlt } from 'react-icons/fa';
import Badge from './Badge';

// Styled components
const Drawer = styled(motion.div)`
  position: fixed;
  top: 118px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 65px);
  max-width: 530px;
  background: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  padding: 10px 20px 10px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  /* Use dvh for dynamic viewport height */
  max-height: calc(100dvh - 140px);
  bottom: env(safe-area-inset-bottom, 0px);
`;

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 998; /* just below Drawer's z-index: 1000 */
  background: transparent;
`;

const ReopenButton = styled(motion.button)`
  position: fixed;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 10px);
  background-color: #F6891F;
  color: white;
  border: none;
  border-radius: 15px;
  padding: 12px 24px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  z-index: 999;
  display: flex;
  align-items: center;
  gap: 8px;
  
  /* Ensure it's above other content but below drawer */
  &:hover {
    background-color: #e07b1f;
  }
  
  /* Style for the arrow */
  span {
    font-size: 24px;
    line-height: 1;
  }
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1vh;
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
  white-space: nowrap;
  opacity: ${({ $visible }) => ($visible === false ? 0 : 1)};
  transition: opacity 0.2s ease 0.25s;
`;

const GuessLabel = styled.span`
  color: #333;
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.2s ease;
`;

const TimelineContainer = styled.div`
  margin-top: -5px;
  display: flex;
  gap: 0px;
  margin-bottom: 0px;
  flex: 1;          /* grows to fill all leftover space in Drawer */
  min-height: 200px; /* floor so it never gets crushed to nothing on tiny screens */
  z-index: -1;
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
  margin-top: 0px;
  margin-left: 20px;
`;

const AnswerBoxContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 80px;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  background: transparent;
  border-left: 2px dashed #999;
  border-right: 2px dashed #999;
  border-bottom: 2px dashed #999;
  border-top: none;
  transition: border-color 0.3s ease;
  ${({ $revealed }) => $revealed && `border-color: transparent;`}
`;

const OrangeSliver = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: #F6891F;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const LossBarContainer = styled.div`
  position: relative;
  width: 8px;
  height: 100%;
  background: transparent;
  border-left: 2px dashed #999;
  border-right: 2px dashed #999;
  border-radius: 5px;
  margin-top: 0px;
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
  margin: 10px 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  text-align: center;
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

const AnswerAreaWrapper = styled.div`
  position: relative;
`;

const MedalRow = styled.div`
  position: absolute;
  bottom: -45px;
  right: 4px;
  z-index: 5;
`;

const TrophyMount = styled.div`
  position: relative;
  width: 60px;
`;

const TrophyIcon = styled.img`
  display: block;
  width: 100%;
  height: auto;
  pointer-events: none;
  user-select: none;
`;

const BadgeOnTrophy = styled.div`
  position: absolute;
  top: -17px; /* nudges medal up so it sits in/on the trophy cup */
  left: 50%;
  transform: translateX(-50%) scale(0.65);
  transform-origin: top center;
`;

const MedalScale = styled.div`
  transform: scale(0.6);
  transform-origin: bottom right;
`;

const StatusBadge = styled.div`
  align-self: flex-start;
  min-width: 74px;
  margin: 20px 0 2px 0;
  height: 10px;
  padding: 5px 4px 4px 4px;
  border-radius: 4px;
  background-color: #727172;
  color: #ffffff;
  font-size: 12px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MedalPopupOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 0px;
`;

const MedalPopupCard = styled.div`
  position: relative;
  width: 100%;
  background: #F6891F;
  padding: 35px 20px 15px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
`;

const MedalPopupBadgeWrapper = styled.div`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%) scale(0.7);
`;

const MedalPopupText = styled.p`
  margin: 8px 0 0;
  color: #ffffff;
  font-weight: semi-bold;
  font-size: 16px;
  line-height: 1.35;
`;

const EndScreen = ({ 
	stationName, 
  lastGuessName,
  guessHistory,
	guesses,
  trainNetwork,
	maxGuesses,
	isWin, 
  mapUsed,
	onSeeGuesses,
	stats,
	isOpen,
	onReopen
}) => {
	const totalSlots = maxGuesses - 1; // number of dots
	const usedCount = guesses.length;
	
	// Create ref for TimelineContainer to get its height
	const [timelineHeight, setTimelineHeight] = useState(450);
	const timelineRef = React.useRef(null);

  const [revealed, setRevealed] = useState(isWin);
  const [medalHovered, setMedalHovered] = useState(false);

  const handleReveal = () => {
    setRevealed(!revealed);
  };
  
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

  const getGuessEmoji = (guess, answerStation) => {
    if (guess.stationsAway === 0) return '🟩'; // correct station

    const answerLines = trainNetwork[answerStation]?.lines ?? [];
    const guessLines = guess.lines ?? [];
    const guessSet = new Set(guessLines);
    const answerSet = new Set(answerLines);
    const sharesLine = [...guessSet].some((l) => answerSet.has(l));

    const isClose = guess.stationsAway > 0 && guess.stationsAway <= 20;

    if (isClose || sharesLine) return '🟨';
    return '🟥';
  };

  const buildShareGrid = (guessHistory, answerStation) => {
    const squares = guessHistory.map((g) => getGuessEmoji(g, answerStation));
    const track = ['🚂', ...squares].join('.');
  };
  
  const handleShare = () => {
    const attemptsUsed = guessHistory.length;
    const attemptsLabel = isWin ? `${attemptsUsed}/${maxGuesses}` : `X/${maxGuesses}`;
    const grid = buildShareGrid(guessHistory, stationName);
    const message = `Sydney Traindle ${attemptsLabel}${!mapUsed && isWin ? ' 🚉' : ''}\n${grid}`;

    if (navigator.share) {
        navigator.share({
            title: 'Sydney Traindle',
            text: message,
            url: window.location.href,
        });
    } else {
        navigator.clipboard.writeText(`${message}\nPlay at ${window.location.href}`);
        alert('Result copied to clipboard!');
    }
  };
	
  const winPercentage = stats.played > 0 
	  ? Math.round((stats.wins / stats.played) * 100) 
	  : 0;
  
	return (
	  <>
		<AnimatePresence>
		  {isOpen && (
        <>
        <Backdrop
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onSeeGuesses}
        />
			<Drawer
			  initial={{ y: '100%', x: '-50%' }}
			  animate={{ y: 0, x: '-50%' }}
			  exit={{ y: '100%', x: '-50%' }}
			  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
			>
			  <TopBar>
				<SeeGuessesButton onClick={onSeeGuesses}>
				  See my guesses
				</SeeGuessesButton>
				<ShareIconButton onClick={handleShare}>
				  <FaShareAlt />
				</ShareIconButton>
			  </TopBar>
        <AnswerAreaWrapper>
          {isWin ? (
            <OrangeBox>
              <StationNameBig>{stationName.replace(/\s*station$/i, '')}</StationNameBig>
            </OrangeBox>
          ) : (
            <AnswerBoxContainer $revealed={revealed} onClick={handleReveal}>
              <OrangeSliver
                initial={false}
                animate={{
                  height: revealed ? '100%' : 10,
                  borderRadius: revealed ? '8px' : '8px 8px 0 0'
                }}
                transition={{ type: 'spring', damping: 22, stiffness: 220 }}
              >
                <StationNameBig $visible={revealed}>
                  {stationName.replace(/\s*station$/i, '')}
                </StationNameBig>
              </OrangeSliver>
              <GuessLabel $visible={!revealed}>
                {lastGuessName}
              </GuessLabel>
            </AnswerBoxContainer>
          )}

          <MedalRow>
              <MedalScale>
                <Badge
                  badgeIcon="/Icons/pin.svg"
                  saturate={isWin && !mapUsed}
                  onHoverChange={setMedalHovered}
                />
              </MedalScale>
            </MedalRow>
        </AnswerAreaWrapper>
  
			  <TimelineContainer ref={timelineRef}>
          {isWin ? (
            <BarContainer $usedRatio={(usedCount / totalSlots) * 100}>
              {Array.from({ length: totalSlots }).map((_, i) => {
                const top = (i * segmentHeight) + segmentHeight;
                return <Dot key={i} style={{ top: `${top}px` }} />;
              })}
            </BarContainer>
          ) : (
            <LossBarContainer>
              {Array.from({ length: totalSlots }).map((_, i) => {
                const top = (i * segmentHeight) + segmentHeight;
                return <Dot key={i} style={{ top: `${top}px` }} />;
              })}
            </LossBarContainer>
          )}
    
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
        
        <StatusBadge>{isWin ? 'Well Done!' : 'Keep Trying!'}</StatusBadge>

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

        <AnimatePresence>
          {medalHovered && (
            <MedalPopupOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setMedalHovered(false)}
              onMouseLeave={() => setMedalHovered(false)}
            >
              <MedalPopupCard onClick={(e) => e.stopPropagation()}>
                <MedalPopupBadgeWrapper>
                  <TrophyMount>
                    <TrophyIcon src="/Icons/trophy.svg" alt="" />
                      <BadgeOnTrophy>
                          <Badge
                              badgeIcon="/Icons/pin.svg"
                              saturate={isWin && !mapUsed}
                          />
                      </BadgeOnTrophy>
                  </TrophyMount>
                </MedalPopupBadgeWrapper>
                <MedalPopupText>
                  {isWin && !mapUsed ? (
                      <>You completed Sydney Traindle<br />without using the map!</>
                    ) : (
                      <>Complete Sydney Traindle without<br /> using the map to earn this badge!</>
                  )}
                </MedalPopupText>
              </MedalPopupCard>
            </MedalPopupOverlay>
          )}
        </AnimatePresence>

			</Drawer>
        </>
		  )}
		</AnimatePresence>
		
		{/* Reopen button - only show when drawer is closed */}
		{!isOpen && (
		  <ReopenButton
			onClick={onReopen}
			initial={{ y: 100 }}
			animate={{ y: 0 }}
			exit={{ y: 100 }}
			transition={{ type: 'spring', damping: 25, stiffness: 200 }}
		  >
			View Results
		  </ReopenButton>
		)}
	  </>
	);
};
  
export default EndScreen;