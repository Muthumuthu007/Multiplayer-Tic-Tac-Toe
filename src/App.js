import './App.css';
import Login from './Login';
import Signup from './Signup';
import Homepage from './Homepage';
import Creategame from './Creategame';
import Joingame from './Joingame';
import Game from './Game';
import Game2 from './Game2'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path='/Creategame' element={<Creategame/>}/>
            <Route path='/Joingame' element={<Joingame/>}/>
            <Route path="/Game/:username/:gameid/:role" element={<Game />} /> 
            <Route path="/Game2/:username/:gameid/:role" element={<Game2/>} />          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
