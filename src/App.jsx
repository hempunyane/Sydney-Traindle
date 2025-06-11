import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Background from './components/background';
import "bootstrap-icons/font/bootstrap-icons.css";
import Game from './components/Game';

function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Game />} />
        </Routes>
        <Background/>
    </BrowserRouter>
  );
}

export default App;