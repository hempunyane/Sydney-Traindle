import React from "react";
import styled from "styled-components";
import Keyboard from "./Keyboard";
import { Guess, GuessesLeft } from './guesses';

const AutocompleteContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    margin-bottom: 10px;
`;

const Autocomplete = styled.div`
    display: flex;
    align-items: center; /* Vertically center all items */
    width: 90%;
    min-height: 70px; /* Minimum height instead of fixed vh */
    border-bottom: 1px solid #777;
    padding-bottom: 1vh;
    margin-bottom: 7px;
    position: relative;
`;

const InputContainer = styled.div`
    position: relative;
    flex: 2; /* Take available space */
    min-width: 0; /* Allow shrinking */
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
    margin: ${({ $isMobile }) => $isMobile ? '0px 0px -1px -1px' : '0 0 0 0'};
    display: flex;
    align-items: flex-end;
    font-size: 24px;
    color: #777;
    pointer-events: none;
    z-index: 1;
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
    height: 19px;
    border-radius: 4px;
    background-color: #727172;
    color: #ffffff;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

class SearchBox extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            filteredSuggestions: [],
            activeSuggestionIndex: 0,
            showSuggestions: false,
            nextCapital: true
        };
    }

    componentDidMount() {
        window.addEventListener("keydown", this.handleGlobalKeyDown);
    }
    
    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleGlobalKeyDown);
    }

    getFilteredSuggestions = (userInput) => {
        if (!userInput) return null;
        
        const lcInput = userInput.toLowerCase();
        const { suggestions } = this.props;
        
        // Remove 'station' from suggestions for matching
        const cleanedSuggestions = suggestions.map(s => s.replace(/\s*station$/i, ''));
        
        // Only find matches that START WITH the input
        const firstMatch = cleanedSuggestions.find(s => 
            s.toLowerCase().startsWith(lcInput)
        );
        
        return firstMatch || null;
    };

    handleGlobalKeyDown = (e) => {
        const key = e.key;
        if (key.length > 1 && key !== "Enter" && key !== "Backspace") {
            return;
        }

        e.preventDefault();
        if (this.inputRef) {
            this.inputRef.focus();
        }
        
        this.handleKeyPress(key);
    };

    handleKeyPress = (key) => {
        const input = this.inputRef;
        if (!input) return;
        
        const { value, nextCapital } = this.state;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        
        if (key === 'Enter') {
            if (this.state.currentSuggestion) {
                this.props.onSubmit(this.state.currentSuggestion + ' Station');
                this.setState({
                    value: '',
                    currentSuggestion: "",
                    showSuggestion: false,
                    nextCapital: true // Reset to capital mode after submit
                });
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
            
            // Recalculate capitalisation after backspace based on cursor position
            const prevChar = newValue[newCursorPos - 1];
            nextCapitalState = !newValue || prevChar === ' ';
        } else {
            // character / space input
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
        
        const suggestion = this.getFilteredSuggestions(newValue);
        const showSuggestion = Boolean(suggestion && newValue);
        
        this.setState({
            value: newValue,
            currentSuggestion: suggestion || "",
            showSuggestion,
            nextCapital: nextCapitalState
        });
        
        this.updateInputValue(newValue, newCursorPos);
        this.inputRef?.focus();
    };

    updateInputValue = (newValue, newCursorPos) => {
        this.setState({ value: newValue }, () => {
            requestAnimationFrame(() => {
                this.inputRef.focus();
                this.inputRef.setSelectionRange(newCursorPos, newCursorPos);
            });
        });
    };

    handleInputSelect = (e) => {
        e.preventDefault();
        this.inputRef.focus();
        setTimeout(() => {
            this.inputRef.setSelectionRange(
                this.inputRef.selectionStart, 
                this.inputRef.selectionEnd
            );
        }, 0);
    };

    render() {
        const { value, currentSuggestion, showSuggestion, nextCapital } = this.state;
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
                                ref={(ref) => this.inputRef = ref}
                                value={value}
                                placeholder="Station Name"
                                autoComplete="off"
                                inputMode="none"
                                onChange={() => {}}
                                onTouchStart={this.handleInputSelect}
                            />
                            {showSuggestion && (
                                <AutocompleteSuggestion $isMobile={this.props.isMobile}>
                                    <VisiblePart>{value}</VisiblePart>
                                    <SuggestionPart>{suggestionPart}</SuggestionPart>
                                </AutocompleteSuggestion>
                            )}
                        </InputWrapper>
                    </InputContainer>
                    <GuessesLeft guessesLeft={this.props.guessesLeft} />
                </Autocomplete>
                <Keyboard 
                    onKeyPress={this.handleKeyPress}
                    disableEnter={!showSuggestion}
                    isCapitalMode={nextCapital}
                    onHelp={this.props.onHelp}
                    onMap={this.props.onMap}
                />
            </AutocompleteContainer>
        );
    }
}

export default SearchBox;