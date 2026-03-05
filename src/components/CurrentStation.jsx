import styled from 'styled-components';
import trainNetwork from "../helper/TrainNetwork";
import { StationText, HeadingText, InfoText } from './TextStyles';

const Container = styled('div')`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-top: 10px;
    margin-bottom: 5px;
    border-bottom: 1px solid #777;
`;

const ColumnsRow = styled('div')`
    display: flex;
    width: 100%;
`;

const Column1 = styled('div')`
    flex-direction: column;
    display: flex;
    justify-content: space-between;
    flex-grow: 5;
`;

const Column2 = styled('div')`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    flex-grow: 3;
`;

const Column3 = styled('div')`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    flex-grow: 2;
`;

const LinesRow = styled('div')`
    display: flex;
    justify-content: flex-start;
    margin-top: 8px;
    margin-bottom: 8px;
`;

const CurrentLineIcon = styled.img`
    width: 39px;
    height: 39px;
`;

const QuestionMarkIcon = styled.div`
    width: 39px;
    height: 39px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FFFFFF;
    border-radius: 5px;
    font-size: 28px;
    font-weight: bold;
    color: #333;
`;

const LinesContainer = styled('div')`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 4.5px 4.5px;
    border-radius: 10px;
    background-color: ${({ background }) => background || 'transparent'};
`;

const DistanceRow = styled('div')`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
`;

const CurrentArrowIcon = styled.img`
    width: 25px;
    height: 25px;
`;

const getStationRanges = (stationsAway) => {
    if (stationsAway === 0) return '0';
    const ranges = ['10-20', '20-30', '30-40', '40-50', '50-60', '60-70'];
    const distRange = Math.floor(stationsAway / 10);
    if (distRange === 0) return stationsAway.toString();
    return ranges[distRange - 1] || `${stationsAway}`;
};

function formatDistance(distance) {
    return parseFloat(distance).toFixed(2);
}

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

function CurrentStation({ currentGuess, answerStation }) {
    const hasGuess = Boolean(currentGuess);

    const stationName = hasGuess ? currentGuess.stationName.replace(/\s*station$/i, '') : 'Type to Guess!';
    const distance = hasGuess ? `${formatDistance(currentGuess.distanceFromCentral)}km` : '-.--km';
    const stops = hasGuess ? getStationRanges(currentGuess.stationsAway) : '--/--';
    const lines = hasGuess ? currentGuess.lines : [];
    const linesBackground = hasGuess ? getLinesBackgroundColour(answerStation, lines) : '#FF8888';

    return (
        <Container id="current-guess">
            <ColumnsRow>
                <Column1>
                    <HeadingText>Station</HeadingText>
                    <StationText>{stationName}</StationText>
                </Column1>
                <Column2 id="current-guess-dist">
                    <HeadingText>Dist. from Central</HeadingText>
                    {hasGuess ? (
                        <DistanceRow>
                            <InfoText>{distance}</InfoText>
                            <CurrentArrowIcon src={currentGuess.distanceIcon} alt="Distance indicator" />
                        </DistanceRow>
                    ) : (
                        <DistanceRow>
                            <InfoText>{distance}</InfoText>
                            <CurrentArrowIcon src="/Icons/arrow_up.svg" alt="Distance indicator" />
                        </DistanceRow>
                    )}
                </Column2>
                <Column3 id="current-guess-stops">
                    <HeadingText>Stops</HeadingText>
                    <InfoText>{stops}</InfoText>
                </Column3>
            </ColumnsRow>
            <LinesRow>
                <LinesContainer id="current-guess-trainlines" background={linesBackground}>
                    {hasGuess ? (
                        lines.map((line) => (
                            <CurrentLineIcon
                                key={line}
                                src={`/Trainlines/${line}.svg`}
                                alt={line}
                            />
                        ))
                    ) : (
                        <QuestionMarkIcon>?</QuestionMarkIcon>
                    )}
                </LinesContainer>
            </LinesRow>
        </Container>
    );
}

export default CurrentStation;