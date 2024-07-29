import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const BASE_URL = 'http://3.139.54.170:8000';

function Game() {
  const { username, gameid } = useParams();
  const [error, setError] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState('');
  const [matrix, setMatrix] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);
  const [message, setMessage] = useState('');
  const [winner, setWinner] = useState('');

  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/get_game_state`,
          { game_id: gameid },
          { headers: { 'Content-Type': 'application/json' } }
        );

        console.log(response.data);
        const { board, current_player, message, winner } = response.data;
        const newMatrix = parseBoard(board);
        setMatrix(newMatrix);
        setCurrentPlayer(current_player);
        setMessage(message);
        setWinner(winner);

        if (winner === 'None') {
          if (current_player === username) {
            setMessage("It's your turn");
          } else {
            setMessage("Waiting for opponent's move");
          }
        } else {
          setMessage(`Game ended. Winner: ${winner}`);
        }
      } catch (error) {
        console.error('Error fetching game status:', error);
        setError('Error fetching game status');
      }
    };

    const interval = setInterval(fetchGameState, 5000);

    return () => clearInterval(interval);
  }, [gameid, username]);

  const parseBoard = (board) => {
    const newMatrix = [];
    for (let i = 0; i < 3; i++) {
      newMatrix.push(board.slice(i * 3, i * 3 + 3).split(''));
    }
    return newMatrix;
  };

  const getBGClass = (value) => {
    if (value === 'X') return 'yellow';
    if (value === 'O') return 'orange';
    return '';
  };

  const handleClick = async (r, c) => {
    

    const moveIndex = r * 3 + c;
    const payload = {
      username: username,
      game_id: gameid,
      move: moveIndex,
    };

    console.log('Payload:', payload);

    try {
      const response = await axios.post(`${BASE_URL}/make_move`, payload);
      console.log('Response:', response.data);

      if (response.data.message === 'Move made') {
        const newMatrix = parseBoard(response.data.board);
        setMatrix(newMatrix);
        setCurrentPlayer(response.data.current_player);
        setMessage(response.data.message);
        setWinner(response.data.winner);
        setError('');

        // Check if the game has ended, if not continue fetching game state
        if (response.data.winner === 'None') {
          setTimeout(() => fetchGameState(), 5000);
        }
      } else {
        setError(response.data.message);
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

  const fetchGameState = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/get_game_state`,
        { game_id: gameid },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log(response.data);
      const { board, current_player, message, winner } = response.data;
      const newMatrix = parseBoard(board);
      setMatrix(newMatrix);
      setCurrentPlayer(current_player);
      setMessage(message);
      setWinner(winner);

      if (winner === 'None') {
        if (current_player === username) {
          setMessage("It's your turn");
        } else {
          setMessage("Waiting for opponent's move");
        }
        setTimeout(() => fetchGameState(), 5000);
      } else {
        setMessage(`Game ended. Winner: ${winner}`);
      }
    } catch (error) {
      console.error('Error fetching game status:', error);
      setError('Error fetching game status');
    }
  };

  return (
    <div className="xoxapp">
      <div className="xoxheader xoxalignCenter">Tic Tac Toe</div>
      <div className="xoxalignCenter xoxboard">
        <div className="xoxgameBoard">
        <div>You :{username}</div><br></br>

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
          ))}<br></br>
          {error && <div className="error">{error}</div>}
        <div className="message">{message}</div>
        </div>
        <br></br>
        
      </div>
    </div>
  );
}

export default Game;
