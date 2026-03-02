import React, { useState } from 'react';
import styled from 'styled-components';
import trainNetwork from "../helper/TrainNetwork";
import { HeadingText, HistoryInfoText } from './TextStyles';
import { BarDisplay } from './trainlineIconDisplays';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

const Container = styled('div')`
    display: flex;
    flex-direction: column;
    height: 360px;
    width: 100%;
    padding: 0 35px;
    box-sizing: border-box;
    overflow-y: auto;
    scrollbar-width: thin;
    
    &::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-thumb {
        background-color: rgba(0,0,0,0.2);
        border-radius: 3px;
    }
`;

// wrapper for the entire accordion
const StationAccordion = styled(Accordion)`
    width: 100%;
    margin: 0 0 8px 0 !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    border-bottom: none;
    
    &:before {
        display: none;
    }
    
    &.Mui-expanded {
        margin: 0 !important;
    }
`;

// the accordion when collapsed
const StationCollapsed = styled(AccordionSummary)`
    padding: 0 !important;
    min-height: 48px !important;
    position: relative;
    
    &.Mui-expanded {
        min-height: 48px !important;
    }
    
    .MuiAccordionSummary-content {
        margin: 8px 0 !important;
        align-items: center;
    }
`;

const FlexWrapper = styled('div')`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
`;

const StationExpanded = styled(AccordionDetails)`
    padding: 4px 0 0 0 !important;
    margin-top: -4px;
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
`;

const ExpandedLinesContainer = styled('div')`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 3px;
    border-radius: 8px;
    background-color: ${({ background }) => background || 'transparent'};
`;

const MetricsContainer = styled('div')`
    display: grid;
    grid-template-columns: minmax(70px, 90px) 24px minmax(70px, 90px);
    align-items: center;
    justify-items: end;
`;

const MetricItem = styled('div')`
    display: flex;
    justify-content: flex-end;
    font-size: 1.3rem;
`;

const DistanceText = styled(MetricItem)`
    &::after {
        content: 'km';
        margin-top: auto;
        margin-left: 2px;
    }
`;

const ArrowIcon = styled.img`
    width: 25px;
    height: 25px;
    margin: 0;
    margin-left: 32px;
    justify-self: center;
`;

const LineIcon = styled.img`
    width: 30px;
    height: 30px;
`;

const getLinesBackgroundColour = (answerStation, lines) => {
    if (!answerStation || !lines || !lines.length) {
        return 'transparent';
    }

    const answerLines = trainNetwork[answerStation]?.lines || trainNetwork[answerStation]?.["lines"] || [];
    if (!answerLines.length) return 'transparent';

    const guessSet = new Set(lines);
    const answerSet = new Set(answerLines);

    let commonCount = 0;
    guessSet.forEach(line => {
        if (answerSet.has(line)) {
            commonCount += 1;
        }
    });

    if (commonCount === 0) {
        return '#FF8888'; // red-ish: no overlap
    }

    const isExactMatch = commonCount === guessSet.size && commonCount === answerSet.size;

    if (isExactMatch) {
        return '#9EFB96'; // green-ish: perfect match
    }

    return '#F4FA9C'; // yellow-ish: partial overlap
};

const getStationRanges = (stationsAway) => {
    let ranges = [
      "10-20",
      "20-30",
      "30-40",
      "40-50",
      "50-60",
      "60-70"
    ]
    let distRange = Math.floor(stationsAway/10);
    if (distRange == 0) return stationsAway.toString().padStart(4, ' ');
    return ranges[distRange-1];
}

function formatDistance(distance) {
    return parseFloat(distance).toFixed(2);
}

function StationHistory({ guesses, answerStation }) {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const handleChange = (index) => (_event, isExpanded) => {
        setExpandedIndex(isExpanded ? index : null);
    };

    return (
        <Container>
            <HeadingText
                style={{ 
                    paddingBottom: '8px', 
                    position: 'sticky', 
                    top: '-2px', 
                    background: 'white', 
                    zIndex: 10,
                    marginLeft: '-8px'
                }}
            >
                History
            </HeadingText>
            {guesses.map((station, index) => {
                const linesBackground = getLinesBackgroundColour(answerStation, station.lines);
                return (
                <StationAccordion 
                    key={index} 
                    TransitionProps={{ unmountOnExit: true }}
                    expanded={expandedIndex === index}
                    onChange={handleChange(index)}
                >
                    <StationCollapsed
                        aria-controls={`panel${index}-content`}
                        id={`panel${index}-header`}
                    >
                        <FlexWrapper>
                            <HistoryInfoText style={{ flex: 1 }}>
                                {station.stationName.replace(/\s*station$/i, '')}
                            </HistoryInfoText>
                            <MetricsContainer>
                                <DistanceText>
                                    <HistoryInfoText style={{ width: '100%', textAlign: 'right' }}>
                                        {formatDistance(station.distanceFromCentral)}
                                    </HistoryInfoText>
                                </DistanceText>
                                <ArrowIcon 
                                    src={station.distanceIcon} 
                                    alt="Distance indicator" 
                                />
                                <MetricItem>
                                    <HistoryInfoText style={{ width: '100%', textAlign: 'right' }}>
                                        {getStationRanges(station.stationsAway)}
                                    </HistoryInfoText>
                                </MetricItem>
                            </MetricsContainer>
                        </FlexWrapper>
                        {expandedIndex !== index && (
                            <BarDisplay trainlines={station.lines} />
                        )}
                    </StationCollapsed>
                    <StationExpanded>
                        <ExpandedLinesContainer background={linesBackground}>
                            {station.lines.map((line, lineIndex) => (
                                <LineIcon key={lineIndex} src={`/Trainlines/${line}.svg`} alt={line} />
                            ))}
                        </ExpandedLinesContainer>
                    </StationExpanded>
                </StationAccordion>
            )})}
        </Container>
    );
}

export default StationHistory;