import React, { useState } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(23, 20, 17, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const PromptBox = styled.div`
  background: #ffffff;
  border-radius: 10px;
  padding: 5px;
  width: min(90vw, 400px);
  box-sizing: border-box;
  position: relative;
`;

const PromptBox2 = styled.div`
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #000000;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  border: none;
  background: none;
  font-size: 1.25rem;
  line-height: 1;
  color: #b0b0b0;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #777;
  }
`;

const Title = styled.p`
  margin: 0 24px 16px 0;
  font-weight: 400;
  font-size: 1rem;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
`;

const BaseButton = styled.button`
  flex: 1;
  padding: 10px 0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
`;

const NoButton = styled(BaseButton)`
  background: #ffffff;
  border: 1px solid #000000;
  color: #000000;
`;

const YesButton = styled(BaseButton)`
  background: #f7941d;
  border: 1px solid #f7941d;
  color: #ffffff;
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #333;
  cursor: pointer;
`;

function TutorialPrompt({ onYes, onNo }) {
    const [dontShowAgain, setDontShowAgain] = useState(false);

    return (
        <Overlay>
            <PromptBox>
              <PromptBox2>
                <CloseButton aria-label="Close" onClick={() => onNo(dontShowAgain)}>×</CloseButton>
                  <Title>Read our Tutorial? (Recommended)</Title>
                  <ButtonRow>
                      <NoButton onClick={() => onNo(dontShowAgain)}>No.</NoButton>
                      <YesButton onClick={() => onYes(dontShowAgain)}>Yes.</YesButton>
                  </ButtonRow>
                  <CheckboxRow>
                      <input
                          type="checkbox"
                          checked={dontShowAgain}
                          onChange={(e) => setDontShowAgain(e.target.checked)}
                      />
                      Don't show this again
                  </CheckboxRow>
                </PromptBox2>
            </PromptBox>
        </Overlay>
    );
}

export default TutorialPrompt;