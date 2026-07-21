import React from 'react';
import Hint from './Hint.jsx'
const stationInput = ({ onStationSelect, suggestions, answer, onWin }) => {
  // states for current input, suggestions based on input, the highligghted suggestion and whether or not to show suggestions
  const [input, setInput] = React.useState('');
  const [filteredSuggestions, setFilteredSuggestions] = React.useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = React.useState(0);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  // reference is used for the scrollign when usign arrow keys
  const suggestionRefs = React.useRef([]);

  // handles changes in theinput field
  const handleChange = (e) => {
    const userInput = e.target.value;

    // filter the suggestions based on input
    const filtered = suggestions.filter(
      (suggestion) =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    // update states with new input and filtered suggestions
    setInput(userInput);
    setFilteredSuggestions(filtered);
    setActiveSuggestionIndex(0);
    setShowSuggestions(true);
  };

  // handles keyboard navigation and submission
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // prevent empty or no valid suggestions from being submitted
      if (input === '' || filteredSuggestions.length === 0) {
        return;
      }

      const selectedGuess = filteredSuggestions[activeSuggestionIndex];

      // we caall the win funciton if guess is correct
      if (selectedGuess === answer) {
        onWin();
      }

      // update the user's guesses with the highlighted suggestion
      onStationSelect(selectedGuess);
      // reset input and hide suggestions
      setInput('');
      setShowSuggestions(false);

    // we move the highlighted suggestion up
    } else if (e.key === 'ArrowUp') {
      if (activeSuggestionIndex === 0) {
        return;
      }
      const newIndex = activeSuggestionIndex - 1;
      setActiveSuggestionIndex(newIndex);
      scrollToActiveSuggestion(newIndex);

    // we move the highlighted suggestion down
    } else if (e.key === 'ArrowDown') {
      if (activeSuggestionIndex === filteredSuggestions.length - 1) {
        return;
      }
      const newIndex = activeSuggestionIndex + 1;
      setActiveSuggestionIndex(newIndex);
      scrollToActiveSuggestion(newIndex);

    // we move highlighted suggestion down if 'TAB'
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const newIndex = activeSuggestionIndex === filteredSuggestions.length - 1 ? 0 : activeSuggestionIndex + 1;
      setActiveSuggestionIndex(newIndex);
      scrollToActiveSuggestion(newIndex);
    }
  };

  // handles when a user clicks on a suggestion
  const handleClick = (suggestion) => {
    if (suggestion === answer) {
      onWin();
    }
    onStationSelect(suggestion);
    setInput('');
    setShowSuggestions(false);
  };

  // we highlight the suggestion that the user is hovering over
  const handleHover = (index) => {
    setActiveSuggestionIndex(index);
  };

  // we hide the suggestions and reset input when the input is clocked off of
  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      setInput('');
    }, 150);
  };

  // we use teh reference to scroll up or down a list when a arrow key is used when the next staiton is out of view
  const scrollToActiveSuggestion = (index) => {
    if (suggestionRefs.current[index]) {
      suggestionRefs.current[index].scrollIntoView({
        block: 'nearest',
      });
    }
  };

  // renders the station suggestions dropdown
  const renderSuggestions = () => {
    if (showSuggestions && input) {
      if (filteredSuggestions.length) {
        return (
          <ul className="suggestions">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                ref={(el) => (suggestionRefs.current[index] = el)}
                className={
                  index === activeSuggestionIndex
                    ? 'suggestion-active'
                    : 'suggestion-unactive'
                }
                onMouseEnter={() => handleHover(index)}
                onClick={() => handleClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        );
      } else {
        return <div className="no-suggestions">No matches</div>;
      }
    }
    return null;
  };

  return (
    <div className='search-container'>
      <div className="autocomplete">
        <input
            id="myInput"
            type="text"
            name="stationGuess"
            placeholder="Station"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            autoComplete="off"
          />
        {renderSuggestions()}
      </div>
      <Hint/>
    </div>
  );
};

export default stationInput;