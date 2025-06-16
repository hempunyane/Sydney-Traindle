import styled from 'styled-components';
import { StationText, HeadingText, InfoText } from './TextStyles';

// keep height fixed px, as long as it is enough to contain train lines.
const Container = styled('div')`
    display: flex;
    flex-direction: row;
    height: 120px;
    width: 90%;
    padding: 5px;
    margin-bottom: 15px;
    border-bottom: 2px solid #777;
`;

const Column1 = styled('div')`
    flex-direction: column;
    display: flex;
    justify-content: space-between;
    flex-grow: 5;
    height: 50px;
`;

const Column2 = styled('div')`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    flex-grow: 3;
    height: 50px;
`;

const Column3 = styled('div')`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    flex-grow: 2;
    height: 50px;
`;

function CurrentStation() {
    return (
        <Container>
            {/* column 1 */}
            <Column1>
                <HeadingText>Station</HeadingText>
                <StationText>
                    {/* user input guesses */}
                    Macquarie University
                </StationText>
            </Column1>
            <Column2>
                <HeadingText>Dist. from Central</HeadingText>
                {/* get from data */}
                <InfoText>8.38km</InfoText>
            </Column2>
            <Column3>
                <HeadingText>Stops</HeadingText>
                {/* get from data */}
                <InfoText>10-20km</InfoText>
            </Column3>
            {/* TODO: add train line logos depending on data and user's guess */}
        </Container>
    )
}

export default CurrentStation;