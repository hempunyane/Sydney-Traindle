import React from "react";


//this only exists to stop circular importing
const MobileContext = React.createContext({
    getGuesses: () => 0,
})

export default MobileContext