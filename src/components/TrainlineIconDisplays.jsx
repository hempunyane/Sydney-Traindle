import styled from 'styled-components';

const LINE_COLOURS = {
    T1: 'rgb(246, 145, 16)',
    T2: 'rgb(8, 151, 209)',
    T3: 'rgb(242, 93, 27)',
    T4: 'rgb(30, 86, 168)',
    T5: 'rgb(196, 17, 144)',
    T6: 'rgb(124, 62, 33)',
    T7: 'rgb(105, 124, 138)',
    T8: 'rgb(10, 150, 73)',
    T9: 'rgb(210, 26, 45)',
    M1: 'rgb(0, 150, 159)',
};

const BarContainer = styled.div`
    display: flex;
    position: absolute;
    align-items: center;
    height: 4px;
    bottom: 4px;
`;

const BarColour = styled.div`
    width: 35px;
    height: 4px;
    background-color: ${({ $colour }) => $colour};
`;

export function BarDisplay({ trainlines }) {
    if (!trainlines) {
        return null;
    }

    return (
        <BarContainer>
            {trainlines.map((line, index) => (
                <BarColour key={index} $colour={LINE_COLOURS[line]} />
            ))}
        </BarContainer>
    );
}
