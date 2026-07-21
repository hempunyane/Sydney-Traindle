import styled from "styled-components";
import trainNetwork from "../helper/TrainNetwork";
import { getDirectionIndex, DIRECTION_LABELS, DIRECTION_NAMES } from "../helper/direction";

const GuessesLeftContainer = styled.div`
    margin: 0px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    position: relative;
    flex: 1;

    h3 {
        font-size: 12px;
        font-weight: 100;
    }

    h2 {
        margin: 0px;
        font-size: 40px;
        font-family: 'Inter';
        font-weight: 400;
        color: #f6891f;
    }
`;

const getIcon = (stationGuess) => {
    return `./Trainlines/${trainNetwork[stationGuess]['lines'][0]}.svg`;
};

const getLines = (stationGuess) => {
    return trainNetwork[stationGuess]['lines'];
};

const getStationsAway = (stationGuess, answerStation) => {
    if (stationGuess === answerStation) return 0;

    const visited = new Set();
    const queue = [{ station: stationGuess, distance: 0 }];

    while (queue.length > 0) {
        const { station, distance } = queue.shift();

        if (station === answerStation) {
            return distance;
        }

        visited.add(station);

        for (const neighbor of trainNetwork[station]['adjacent'] || []) {
            if (!visited.has(neighbor)) {
                queue.push({ station: neighbor, distance: distance + 1 });
            }
        }
    }

    return -1;
};

export const createGuess = (stationGuess, answerStation) => {
    const direction = getDirectionIndex(stationGuess, answerStation);

    return {
        stationName: stationGuess,
        lines: getLines(stationGuess),
        lineIcon: getIcon(stationGuess),
        stationsAway: getStationsAway(stationGuess, answerStation),
        direction,
        directionLabel: direction === null ? '' : DIRECTION_LABELS[direction],
        directionName: direction === null ? '' : DIRECTION_NAMES[direction],
    };
};

export function GuessesLeft({ guessesLeft }) {
    return (
        <GuessesLeftContainer className="guesses-left-container end-guesses">
            <h3>Guesses</h3>
            <h2>{guessesLeft} left</h2>
        </GuessesLeftContainer>
    );
}
