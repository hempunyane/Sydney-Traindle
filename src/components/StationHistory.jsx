import styled from 'styled-components';
import { HeadingText, HistoryInfoText } from './TextStyles';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

const Container = styled('div')`
    display: flex;
    flex-direction: column;
    height: 30%;
    width: 100%;
`;

// wrapper for the entire accordion
const StationAccordion = styled(Accordion)`
    width: 100%;
    min-height: 30px;
    box-shadow: none !important;

    &.Mui-expanded {
        min-height: 60px;
    }
`;

// the accordion when collapsed
const StationCollapsed = styled(AccordionSummary)`
    padding-left: 0 !important;
    padding-right: 0 !important;
    min-height: 30px;
    &.Mui-expanded {
        min-height: 30px; /* keep summary height fixed */
        border-bottom: 1px solid #e0e0e0;
    }
`;

const FlexWrapper = styled('div')`
    display: flex;
    width: 100%;
    justify-content: space-between;
`;

const HintWrapper = styled('div')`
    display: flex;
    width: 30%;
    justify-content: space-between;
`;

// the accordion when expanded on click
const StationExpanded = styled(AccordionDetails)`
    padding: 8px 16px;
`;

const StyledImg = styled('img')`
    margin-bottom: 0px;
    width: 25px;
    height: 25px;
`;

function StationHistory({ guesses, correctStation }) {
    return (
        <Container>
            <HeadingText style={{ paddingBottom: '10px' }}>History</HeadingText>
            {guesses.map((station, index) => {
                console.log(station)

                return (
                    <StationAccordion key={index}>
                        <StationCollapsed>
                            <FlexWrapper>
                                <HistoryInfoText>{station.stationName}</HistoryInfoText>
                                <HintWrapper>
                                    <HistoryInfoText>
                                        {station.distanceFromCentral}km  
                                        <StyledImg src={station.distanceIcon}></StyledImg>
                                    </HistoryInfoText>
                                    <HistoryInfoText>{station.stationsAway}</HistoryInfoText>
                                </HintWrapper>
                            </FlexWrapper>
                        </StationCollapsed>
                        <StationExpanded>
                        {station.lines.map((line, index) => (
                            <img key={index} src={"/Trainlines/"+line+".svg"} width="30px" alt={line}/>
                        ))}
                        </StationExpanded>
                    </StationAccordion>
                );
            })}
        </Container>
    );
}

export default StationHistory;