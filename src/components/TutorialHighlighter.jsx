import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";

const TutorialBox = styled.div`
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: start;
    z-index: 5;
    position: absolute;
    left: 50%;
    top: ${({ offset = 0 }) => `calc(50% + ${offset}px)`};
    transform: translate(-50%, -50%);
    height: ${({ height }) => height-20}px;
    width: ${({ width }) => width-20}px;
    border-radius: 10px;
    padding: 20px;

    p .bold {
        font-weight: bold;
    }
`;

const InputAreaTutorial = () => {
    const ExampleSearchbar = styled.div`
        width: 100%;
        font-size: 18pt;
        height: 40px;
        border-bottom: 1px solid #000000;

        .grey {
            color: #919191;
        }
    `

    return <TutorialBox width="300" height="250" offset={-175}>
        <p>Enter a station name into the search bar to make a guess</p>
        <ExampleSearchbar>Par<span className="grey">ramatta Station</span></ExampleSearchbar>
        <p>Suggestions will be made based on letters you type</p>
    </TutorialBox>
}

const CurrentGuessTutorial = () => {
    return <TutorialBox width="300" height="150">
        <p>This area will show all information relevant to the guess you just made</p>
        <p>When a new guess is made it will be shown here</p>
    </TutorialBox>
}

const CurrentGuessDistTutorial = () => {
    const ArrowDisplay = styled.div`
        display: flex;
        justify-content: space-around;

        img {
            width: 50px;
        }

        div {
            width: 40px;
        }
    `

    return <TutorialBox width="300" height="250" offset={-100}>
        <p><span className="bold">Distance</span></p>
        <p>The correct station is:</p>
        <ArrowDisplay>
            <div></div>
            <img src="/Icons/arrow_up.svg"/>
            <p><span className="bold">Further away</span> from Central Station than this guess</p>
        </ArrowDisplay>
        <ArrowDisplay>
            <div></div>
            <img src="/Icons/arrow_down.svg"/>
            <p><span className="bold">Closer to</span> Central Station than this guess</p>
        </ArrowDisplay>
    </TutorialBox>
}

const CurrentGuessStopsTutorial = () => {
    return <TutorialBox width="300" height="125" offset={-200}>
        <p><span className="bold">Stops</span></p>
        <p>Displays the amount of stations to the correct answer (inclusive)</p>
    </TutorialBox>
}

const CurrentGuessTrainlinesTutorial = () => {
    const TrainlineImageContainer = styled.div`
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 1px;
        background-color: ${({ colour }) => colour};
        border-radius: 5px;

        img {
            width: 30px;
            height: 30px;
            padding: 2.5px;
        }
    `;

    return <TutorialBox width="300" height="300">
        <TrainlineImageContainer colour="#9EFB96">
            <img src="/Trainlines/T1.svg"></img>
            <img src="/Trainlines/T2.svg"></img>
            <img src="/Trainlines/T5.svg"></img>
        </TrainlineImageContainer>
        <p>All trainlines are correct</p>

        <TrainlineImageContainer colour="#F4FA9C">
            <img src="/Trainlines/T1.svg"></img>
            <img src="/Trainlines/T2.svg"></img>
            <img src="/Trainlines/T5.svg"></img>
        </TrainlineImageContainer>
        <p>Some trainlines are correct</p>

        <TrainlineImageContainer colour="#FF8888">
            <img src="/Trainlines/T1.svg"></img>
            <img src="/Trainlines/T2.svg"></img>
            <img src="/Trainlines/T5.svg"></img>
        </TrainlineImageContainer>
        <p>No trainlines are correct</p>
    </TutorialBox>
}

const HistoryAreaTutorial = () => {
    return <TutorialBox width="300" height="125" offset={200}>
        <p><span className="bold">History</span></p>
        <p>All of your previous guesses are stored here.</p>
    </TutorialBox>
}

const HistoryExpansionTutorial = () => {
    return <TutorialBox width="300" height="100">
        <p>
            You can expand a previous guess to get more 
            information about the trainlines by clicking it
        </p>
    </TutorialBox>
}

const BlackoutSVG = ({ clip, onClick }) => {
    const [size, setSize] = useState({
        w: window.innerWidth,
        h: window.innerHeight,
    });

    useEffect(() => {
        const onResize = () => setSize({
            w: window.innerWidth,
            h: window.innerHeight,
        });
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    if (!clip) return null;

    const [top, left, width, height] = clip;

    return (
        <svg
            width="100vw"
            height="100vh"
            viewBox={`0 0 ${size.w} ${size.h}`}
            preserveAspectRatio="none"
            style={{ position: "fixed", top: 0, left: 0, zIndex: 3, cursor: "pointer" }}
            onClick={onClick}
        >
            <defs>
                <mask id="blackout-mask">
                    <rect width="100%" height="100%" fill="white" />

                    <motion.rect
                        initial={false}
                        animate={{
                            x: left,
                            y: top,
                            width,
                            height
                        }}
                        transition={{
                            duration : 0.5,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                        rx={10}
                        ry={10}
                        fill="black"
                    />
                </mask>
            </defs>

            <rect
                width="100%"
                height="100%"
                fill="rgba(23,20,17,0.65)"
                mask="url(#blackout-mask)"
            />
        </svg>
    );
};

function FadeInOut({ show, children }) {
    const [shouldRender, setShouldRender] = React.useState(show);

    React.useEffect(() => {
        if (show) setShouldRender(true);
    }, [show]);

    function onTransitionEnd() {
        if (!show) setShouldRender(false);
    }

    return shouldRender ? (
        <div
            style={{
                opacity: show ? 1 : 0,
                transition: "opacity 300ms ease",
            }}
            onTransitionEnd={onTransitionEnd}
        >
            {children}
        </div>
    ) : null;
}

function formatClipByID(id){
  const el = document.getElementById(id)
  if (!el) return null

  const rect = el.getBoundingClientRect();
  const padding = 10;

  return [
    rect.top + window.scrollY - padding,
    rect.left + window.scrollX - padding,
    rect.width + padding*2,
    rect.height + padding*2
  ]
}

const TutorialHighlighter = ({ currentIndex = 0, onFinish, show }) => {
    const [tutorialIndex, setTutorialIndex] = useState(0);
    const [clips, setClips] = useState([]);
    //force an expansion on first history item when index changes from 5-6
    useEffect(() => {
        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            const newClips = [
                document.getElementById("input-area") ? formatClipByID("input-area") : null,
                document.getElementById("current-guess") ? formatClipByID("current-guess") : null,
                document.getElementById("current-guess-dist") ? formatClipByID("current-guess-dist") : null,
                document.getElementById("current-guess-stops") ? formatClipByID("current-guess-stops") : null,
                document.getElementById("current-guess-trainlines") ? formatClipByID("current-guess-trainlines") : null,
                document.getElementById("history-area") ? formatClipByID("history-area") : null,
                document.getElementById("history-expansion") ? formatClipByID("history-expansion") : null,
            ];
            setClips(newClips);
        }, 100); // Small delay to ensure DOM is fully rendered
        
        return () => clearTimeout(timer);
    }, [tutorialIndex, show]);

    /*
    tutorial steps:
    1: keyboard and search
        using the keyboard
    2: current guess, relevant info, guess count
        current guess area
        distance breakdown
        stops breakdown
        trainline breakdown
    3: history and expanding history information
        explain previous guess and micro trainline icon
        explain expandable for trainline names
    */

    const targetedIds = [
        formatClipByID("input-area"),
        formatClipByID("current-guess"),
        formatClipByID("current-guess-dist"),
        formatClipByID("current-guess-stops"),
        formatClipByID("current-guess-trainlines"),
        formatClipByID("history-area"),
        formatClipByID("history-expansion")
    ]

    const tutorialPopups = [
        <InputAreaTutorial/>,
        <CurrentGuessTutorial/>,
        <CurrentGuessDistTutorial/>,
        <CurrentGuessStopsTutorial/>,
        <CurrentGuessTrainlinesTutorial/>,
        <HistoryAreaTutorial/>,
        <HistoryExpansionTutorial/>
    ]

    if (!clips[tutorialIndex]) {
        return null;
    }

    const variants = {
        initial: {
            opacity: 0,
            scale: 0.8,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }
        },
        animate: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <FadeInOut show={true}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={tutorialIndex}
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 4,
                        pointerEvents: "none"
                    }}
                >
                    {tutorialPopups[tutorialIndex]}
                </motion.div>
            </AnimatePresence>
            
            <BlackoutSVG
                clip={clips[tutorialIndex]}
                onClick={() => {
                    setTutorialIndex(i => {
                        const next = i + 1;
                        if (next >= tutorialPopups.length) {
                            if (onFinish) {
                                onFinish();
                            }
                            return i;
                        }
                        return next;
                    });
                }}
            />
        </FadeInOut>
    )
}

export default TutorialHighlighter;
