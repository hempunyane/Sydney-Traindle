import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Keyboard from "./Keyboard";
import { GuessesLeft } from './Guesses';

const AutocompleteContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    margin-bottom: 10px;
`;

const Autocomplete = styled.div`
    display: flex;
    align-items: center;
    width: 90%;
    min-height: 70px;
    border-bottom: 1px solid #777;
    padding-bottom: 1vh;
    margin-bottom: 7px;
    position: relative;
`;

const InputContainer = styled.div`
    position: relative;
    flex: 2;
    min-width: 0;
    display: flex;
    align-items: center;
    height: 100%;
`;

const StyledInput = styled.input.attrs({
    tabIndex: -1,
})`
    margin: auto 0px 0px 0px;
    width: 100%;
    padding: 0px;
    border: none;
    font-size: 24px;
    color: #000;
    outline: none;
    caret-color: black;
    -webkit-user-select: none;
    user-select: none;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    position: relative;
    z-index: 2;
    background: transparent;
    font-family: 'Arial', sans-serif;

    &::placeholder {
        color: #919191;
    }
`;

const InputWrapper = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    height: 100%;
`;

const AutocompleteSuggestion = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: flex-end;
    font-size: 24px;
    color: #777;
    pointer-events: none;
    z-index: 1;
    font-family: 'Arial', sans-serif;
`;

const VisiblePart = styled.span`
    color: transparent;
    white-space: pre;
    font-size: 24px;
`;

const SuggestionPart = styled.span`
    color: #777;
    white-space: pre;
    font-size: 24px;
`;

const NextGuessBadge = styled.div`
    position: absolute;
    top: 12px;
    left: 0;
    min-width: 74px;
    height: 10px;
    padding:  5px 0px 4px 0px;
    border-radius: 4px;
    background-color: #727172;
    color: #ffffff;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

function getFilteredSuggestions(userInput, suggestions) {
    if (!userInput) return null;

    const lcInput = userInput.toLowerCase();
    const cleanedSuggestions = suggestions.map(s => s.replace(/\s*station$/i, ''));
    const firstMatch = cleanedSuggestions.find(s => s.toLowerCase().startsWith(lcInput));

    return firstMatch || null;
}

function SearchBox({ onSubmit, suggestions, guessesLeft, onHelp, onMap, isMobile }) {
    const inputRef = useRef(null);
    const [value, setValue] = useState("");
    const [currentSuggestion, setCurrentSuggestion] = useState("");
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [nextCapital, setNextCapital] = useState(true);

    const updateInputValue = useCallback((newValue, newCursorPos) => {
        setValue(newValue);
        requestAnimationFrame(() => {
            if (!inputRef.current) return;
            inputRef.current.focus();
            inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        });
    }, []);

    const handleKeyPress = useCallback((key) => {
        const input = inputRef.current;
        if (!input) return;

        const start = input.selectionStart;
        const end = input.selectionEnd;

        if (key === 'Enter') {
            if (currentSuggestion) {
                onSubmit(currentSuggestion + ' Station');
                setValue('');
                setCurrentSuggestion("");
                setShowSuggestion(false);
                setNextCapital(true);
            }
            return;
        }

        let newValue = value;
        let newCursorPos = start;
        let nextCapitalState = nextCapital;

        if (key === 'Backspace') {
            if (start === end && start > 0) {
                newValue = value.slice(0, start - 1) + value.slice(end);
                newCursorPos = start - 1;
            } else if (start !== end) {
                newValue = value.slice(0, start) + value.slice(end);
                newCursorPos = start;
            }

            const prevChar = newValue[newCursorPos - 1];
            nextCapitalState = !newValue || prevChar === ' ';
        } else {
            let charToInsert = key;
            const isLetter = /^[a-zA-Z]$/.test(key);

            if (isLetter) {
                charToInsert = nextCapital ? key.toUpperCase() : key.toLowerCase();
                nextCapitalState = false;
            } else if (key === ' ') {
                nextCapitalState = true;
            }

            newValue = value.slice(0, start) + charToInsert + value.slice(end);
            newCursorPos = start + charToInsert.length;
        }

        const suggestion = getFilteredSuggestions(newValue, suggestions);
        const shouldShowSuggestion = Boolean(suggestion && newValue);

        setCurrentSuggestion(suggestion || "");
        setShowSuggestion(shouldShowSuggestion);
        setNextCapital(nextCapitalState);
        updateInputValue(newValue, newCursorPos);
        inputRef.current?.focus();
    }, [value, nextCapital, currentSuggestion, suggestions, onSubmit, updateInputValue]);

    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            const key = e.key;
            if (key.length > 1 && key !== "Enter" && key !== "Backspace") {
                return;
            }

            e.preventDefault();
            inputRef.current?.focus();
            handleKeyPress(key);
        };

        window.addEventListener("keydown", handleGlobalKeyDown);
        return () => window.removeEventListener("keydown", handleGlobalKeyDown);
    }, [handleKeyPress]);

    const handleInputSelect = (e) => {
        e.preventDefault();
        inputRef.current?.focus();
        setTimeout(() => {
            if (!inputRef.current) return;
            inputRef.current.setSelectionRange(
                inputRef.current.selectionStart,
                inputRef.current.selectionEnd
            );
        }, 0);
    };

    const suggestionPart = showSuggestion
        ? currentSuggestion.slice(value.length)
        : "";

    return (
        <AutocompleteContainer id="input-area">
            <Autocomplete>
                <NextGuessBadge>Next Guess</NextGuessBadge>
                <InputContainer>
                    <InputWrapper>
                        <StyledInput
                            ref={inputRef}
                            value={value}
                            placeholder="Station Name"
                            autoComplete="off"
                            inputMode="none"
                            onChange={() => {}}
                            onTouchStart={handleInputSelect}
                        />
                        {showSuggestion && (
                            <AutocompleteSuggestion $isMobile={isMobile}>
                                <VisiblePart>{value}</VisiblePart>
                                <SuggestionPart>{suggestionPart}</SuggestionPart>
                            </AutocompleteSuggestion>
                        )}
                    </InputWrapper>
                </InputContainer>
                <GuessesLeft guessesLeft={guessesLeft} />
            </Autocomplete>
            <Keyboard
                onKeyPress={handleKeyPress}
                disableEnter={!showSuggestion}
                isCapitalMode={nextCapital}
                onHelp={onHelp}
                onMap={onMap}
            />
        </AutocompleteContainer>
    );
}

export default React.memo(SearchBox);
