import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function Game() {
  const [username, setUsername] = useState('');
  const [gameid, setGameid] = useState('');
  const [error, setError] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const navigate = useNavigate(); 

  const [matrix, setMatrix] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);

  const getBGClass = (value) => {
    if (value === 'X') return 'yellow';
    if (value === 'O') return 'orange';
    return '';
  };

  const handleClick = async (r, c) => {
    if (!username || !gameid) {
      setError('Username and game ID are required');
      return;
    }

    if (matrix[r][c] !== '') {
      setError('Invalid move');
      return;
    }

    const moveIndex = r * 3 + c;
    const payload = {
      username: username,
      game_id: gameid,
      move: moveIndex,
    };

    console.log('Payload:', payload);

    try {
      const response = await axios.post('http://3.139.54.170:8000/make_move', payload);
      console.log('Response:', response.data);

      if (response.data.message === 'Move made') {
        const tempMatrix = [...matrix];
        tempMatrix[r][c] = currentPlayer;
        setMatrix(tempMatrix);
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
        setError('');
      } else if (response.data.message === 'Invalid move') {
        setError('Invalid move');
      } else if (response.data.message === "It's not your turn") {
        setError("It's not your turn");
      } else if (response.data.message === 'Game already has a winner') {
        setError('Game already has a winner');
      }
    } catch (error) {
      if (error.response) {
        console.error('Server responded with an error:', error.response.data);
        setError(error.response.data.message || 'An error occurred');
      } else {
        console.error('Error:', error.message);
        setError('An error occurred');
      }
    }
  };

  return (
    <div className="xoxapp">
      <div className="xoxheader xoxalignCenter">Tic Tac Toe</div>
      <div className="xoxalignCenter">
        <div className="inputContainer">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Game ID"
            value={gameid}
            onChange={(e) => setGameid(e.target.value)}
          />
        </div>
      </div>
      <div className="xoxalignCenter xoxboard">
        <div className="xoxgameBoard">
          {matrix.map((row, rIndex) => (
            <div className="xoxrow" key={rIndex}>
              {row.map((cell, cIndex) => (
                <div
                  key={cIndex}
                  onClick={() => handleClick(rIndex, cIndex)}
                  className={`xoxcell xoxalignCenter ${getBGClass(matrix[rIndex][cIndex])}`}
                >
                  {matrix[rIndex][cIndex]}
                </div>
              ))}
            </div>
          ))}
        </div>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}

export default Game;