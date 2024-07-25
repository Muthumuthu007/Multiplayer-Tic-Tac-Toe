import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function Creategame() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [gameId, setGameId] = useState('');
  const navigate = useNavigate();

  const createGame = async (e) => {
    e.preventDefault();
    const payload = { username };

    try {
      const response = await axios.post('http://3.139.54.170:8000/create_game', payload);
      console.log(response.data);
      if (response.data.game_id) {
        setError('');
        setGameId(response.data.game_id); // Store the game_id in state
      } else {
        setError('Failed to create game');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Failed to create game');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  const handleStart = () => {
    navigate(`/Game/${username}/${gameId}/X`);
  };

  return (
    <div>
      <h1>Create Game</h1>
      <form onSubmit={createGame}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <button type="submit">Confirm</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      {gameId && (
        <div>
          <h2>Game Created Successfully!</h2>
          <p className='gameid'>Your Game ID: {gameId}</p>
          <button onClick={handleStart}>Start</button>
        </div>
      )}
    </div>
  );
}

export default Creategame;