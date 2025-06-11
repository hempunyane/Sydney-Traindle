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
    border-bottom: 1px solid #e0e0e0;

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

function StationHistory() {

    return (
        <Container>
            <HeadingText>History</HeadingText>
            <StationAccordion
            >
                <StationCollapsed>
                    <FlexWrapper>
                        {/* guess from user input */}
                        <HistoryInfoText>
                            Macquarie University
                        </HistoryInfoText>

                        <HintWrapper>
                            {/* distance from central */}
                            <HistoryInfoText>
                                8.38km
                            </HistoryInfoText>

                            {/* stops from correct station */}
                            <HistoryInfoText>
                                10-20
                            </HistoryInfoText>
                        </HintWrapper>
                    </FlexWrapper>
                </StationCollapsed>

                <StationExpanded>
                    station details
                </StationExpanded>
            </StationAccordion>
        </Container>
    )
}

export default StationHistory;