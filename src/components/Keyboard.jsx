import React from 'react';
import styled from 'styled-components';

const KeyboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  border-radius: 8px;
  margin-top: 10px;
`;

const KeyboardRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 2.5%;
`;

const Key = styled.button`
  color: black;
  user-select: none;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  width: clamp(0px, 8%, 65px);
  height: 50px;
  border: none;
  border-radius: 5px;
  background: #f1f1f1;
  font-size: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 2px rgba(0,0,0,0.1);
  
  &:active {
    background: #e0e0e0;
  }
  
  &.wide {
    min-width: 50px;
  }
  
  &.enter {
    width: clamp(40px, 15vw, 65px);
    font-weight: bold;
    font-size: 16px;
  }

    &.disabled {
    background: #cccccc;
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:disabled {
    pointer-events: none;
  }
  
  &.backspace {
    width: clamp(40px, 12vw, 65px);
  }

  &.spacebar {
    flex-grow: 1;
    max-width: 250px;
    height: 44px;
    margin-right: 10px;
    margin-bottom: 40px;
  }
`;

const BottomButtonRow = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
`;

const FooterButtonContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FooterButton = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 45px;
  background-color: #f6891f;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    cursor: pointer;
  }
`;

const FooterIconWrapper = styled.div`
  cursor: pointer;

  &:hover {
    cursor: pointer;
  }
`;

const FooterIcon = styled.img`
  width: 25px;
  height: 25px;
`;

const Text = styled.div`
  margin-top: 4px;
`;

function Keyboard({onKeyPress, onLegendClick, onMapClick, disableEnter}) {
  const topRow = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const middleRow = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  const bottomRow = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

  const handleKeyClick = (key) => {
    onKeyPress(key);
  };

  return (
    <KeyboardContainer>
      <KeyboardRow>
        {topRow.map(key => (
          <Key key={key} onClick={() => handleKeyClick(key)}>{key}</Key>
        ))}
      </KeyboardRow>
      <KeyboardRow>
        {middleRow.map(key => (
          <Key key={key} onClick={() => handleKeyClick(key)}>{key}</Key>
        ))}
      </KeyboardRow>
      <KeyboardRow>
      <Key 
        className={`enter ${disableEnter ? 'disabled' : ''}`}
        onClick={() => !disableEnter && handleKeyClick('Enter')}
        disabled={disableEnter}
      >
        Enter
      </Key>
        {bottomRow.map(key => (
          <Key key={key} onClick={() => handleKeyClick(key)}>{key}</Key>
        ))}
        <Key className="backspace" onClick={() => handleKeyClick('Backspace')}>
          <img src="/Icons/Delete.svg" alt="Backspace" width={24} />
        </Key>
      </KeyboardRow>

      <BottomButtonRow>
        <FooterButtonContainer>
          <FooterIconWrapper onClick={onLegendClick}>
            <img src="./Icons/Legend.svg" alt="Legend" width="35" height="35"/>
          </FooterIconWrapper>
          <div>Legend</div>
        </FooterButtonContainer>

        <Key className="spacebar" onClick={() => handleKeyClick(' ')}>
          &nbsp;
        </Key>

        <FooterButtonContainer>
          <FooterButton className="cursor-hover" onClick={onMapClick}>
            <FooterIcon src="./Icons/pin.svg" alt="Map" />
          </FooterButton>
          <Text>Map</Text>
        </FooterButtonContainer>
      </BottomButtonRow>

    </KeyboardContainer>
  );
}

export default React.memo(Keyboard);
