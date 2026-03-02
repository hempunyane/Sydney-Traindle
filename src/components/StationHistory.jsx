import React, { useState } from 'react';
import styled from 'styled-components';
import { HeadingText, HistoryInfoText } from './TextStyles';
import { BarDisplay } from './trainlineIconDisplays';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

const Container = styled('div')`
    display: flex;
    flex-direction: column;
    max-height: 100vh;
    width: 100%;
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
    margin: 0 !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    border-bottom: 1px solid #e0e0e0;
    
    &:before {
        display: none;
    }
    
    &.Mui-expanded {
        margin: 0 !important;
    }
`;

// the accordion when collapsed
const StationCollapsed = styled(AccordionSummary)`
    padding: 0 8px !important;
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
    padding: 8px 16px !important;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
`;

const MetricsContainer = styled('div')`
    display: grid;
    grid-template-columns: auto auto auto;
    align-items: center;
    justify-items: end;
    gap: 8px;
    min-width: 200px;
`;

const MetricItem = styled('div')`
    display: flex;
    justify-content: flex-end;
    min-width: 70px;
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
    margin: 0 4px;
`;

const LineIcon = styled.img`
    width: 30px;
    height: 30px;
`;

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

function StationHistory({ guesses }) {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const handleChange = (index) => (_event, isExpanded) => {
        setExpandedIndex(isExpanded ? index : null);
    };

    return (
        <Container>
            <HeadingText style={{ 
                paddingBottom: '10px', 
                position: 'sticky', 
                top: 0, 
                background: 'white', 
                zIndex: 1 
            }}>
                History
            </HeadingText>
            {guesses.map((station, index) => (
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
                                    <HistoryInfoText>
                                        {formatDistance(station.distanceFromCentral)}
                                    </HistoryInfoText>
                                </DistanceText>
                                <ArrowIcon 
                                    src={station.distanceIcon} 
                                    alt="Distance indicator" 
                                />
                                <MetricItem>
                                    <HistoryInfoText>
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
                        {station.lines.map((line, lineIndex) => (
                            <LineIcon key={lineIndex} src={`/Trainlines/${line}.svg`} alt={line} />
                        ))}
                    </StationExpanded>
                </StationAccordion>
            ))}
        </Container>
    );
}

export default StationHistory;