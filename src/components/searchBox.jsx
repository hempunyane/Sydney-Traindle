import React from "react";
import styled from "styled-components";
import Keyboard from "./Keyboard";
import { Guess, GuessesLeft } from './guesses';

const AutocompleteContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const Autocomplete = styled.div`
    display: flex;
    width: 100%;
    height: 15vh;
    border-bottom: 2px solid #777;
    margin-bottom: 15px;
    padding-bottom: 15px;
    position: relative;
`;

const InputContainer = styled.div`
    position: relative;
    flex: 2;
    display: flex;
    align-items: center;
`;

const StyledInput = styled.input.attrs({
    tabIndex: -1,
})`
    margin: auto 0px 5px 0px;
    width: 100%;
    border: none;
    font-size: 20pt;
    color: #000;
    outline: none;
    caret-color: black;
    background: transparent;
    position: relative;
    z-index: 2;
    -webkit-user-select: none;
    user-select: none;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;

    &::placeholder {
        color: #919191;
    }
`;
  
const AutocompleteSuggestion = styled.div`
    position: absolute;
    left: 0;
    bottom: 0px;
    margin: auto 0px 6px 2px;
    font-size: 20pt;
    color: #777;
    pointer-events: none;
    z-index: 1;
    display: flex;
    align-items: center;
    font-family: 'Arial', sans-serif;
`;

const VisiblePart = styled.span`
    color: transparent;
    white-space: pre;
`;

const SuggestionPart = styled.span`
    color: #777;
    white-space: pre;
`;

class SearchBox extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            filteredSuggestions: [],
            activeSuggestionIndex: 0,
            showSuggestions: false
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
        
        const { value } = this.state;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        
        if (key === 'Enter') {
            if (this.state.currentSuggestion) {
                this.props.onSubmit(this.state.currentSuggestion + ' Station');
                this.setState({
                    value: '',
                    currentSuggestion: "",
                    showSuggestion: false
                });
            }
            return;
        }
        
        let newValue = value;
        let newCursorPos = start;
        
        if (key === 'Backspace') {
            if (start === end && start > 0) {
                newValue = value.slice(0, start - 1) + value.slice(end);
                newCursorPos = start - 1;
            } else if (start !== end) {
                newValue = value.slice(0, start) + value.slice(end);
                newCursorPos = start;
            }
        } else {
            newValue = value.slice(0, start) + key + value.slice(end);
            newCursorPos = start + key.length;
        }
        
        const suggestion = this.getFilteredSuggestions(newValue);
        const showSuggestion = Boolean(suggestion && newValue);
        
        this.setState({
            value: newValue,
            currentSuggestion: suggestion || "",
            showSuggestion
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
        const { value, currentSuggestion, showSuggestion } = this.state;
        const suggestionPart = showSuggestion 
            ? currentSuggestion.slice(value.length) 
            : "";
            
        return (
            <AutocompleteContainer>
                <Autocomplete>
                    <InputContainer>
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
                            <AutocompleteSuggestion>
                                <VisiblePart>{value}</VisiblePart><SuggestionPart>{suggestionPart}</SuggestionPart>
                            </AutocompleteSuggestion>
                        )}
                    </InputContainer>
                    <GuessesLeft guessesLeft={this.props.guessesLeft} />
                </Autocomplete>
                <Keyboard 
                    onKeyPress={this.handleKeyPress}
                    disableEnter={!showSuggestion}
                />
            </AutocompleteContainer>
        );
    }
}

export default SearchBox;
