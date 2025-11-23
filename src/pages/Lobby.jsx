import { useGame } from '../contexts/GameContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Lobby = () => {
  const navigate = useNavigate()
  const { 
    isGameOver,
    isGamePlaying, 
    startGame, 
    players, 
    playerName, 
    lastResults 
  } = useGame();

  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    /*const fetchHighScores = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/scores'); 
        const data = await response.json();
        setHighScores(data);
      } catch (error) {
        console.error("Error carregant rànquing històric:", error);
        setHighScores([
            { name: "MestreTetris", score: 9999 },
            { name: "Novatillo", score: 1200 }
        ]);
      }
    };

    fetchHighScores();*/
  }, []);

  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (e.key === "Enter") {
        if (!isGamePlaying) {
            await startGame();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGameOver, startGame]);

  useEffect(() => {
    if (isGamePlaying) {
      navigate('/game');
    }
  }, [isGamePlaying, navigate]);


  if (isGamePlaying) {
      return <div className="lobby-container"><h1>La partida està en curs...</h1></div>;
  }

  return (
    <div className="lobby-container">
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>TETRIS MULTIPLAYER</h1>
        <h2 style={{ color: 'yellow', animation: 'blink 1s infinite' }}>
            PRESS ENTER TO START THE GAME
        </h2>
        <p>Estat actual: {isGameOver ? "Partida Finalitzada" : "Esperant Jugadors"}</p>
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
        
        <div className="panel">
          <h3>👥 Jugadors Connectats ({players.length})</h3>
          <ul>
            {players.map((p) => (
              <li key={p.id} style={{ color: p.name === playerName ? '#4ade80' : 'white' }}>
                {p.name} {p.name === playerName && "(Tu)"}
                {!p.isOnline && <span style={{color: 'gray', fontSize: '0.8em'}}> (Desconnectat)</span>}
              </li>
            ))}
            {players.length === 0 && <li>Esperant connexions...</li>}
          </ul>
        </div>

        {lastResults && lastResults.length > 0 && (
          <div className="panel">
            <h3>🏆 Última Partida</h3>
            <ul>
              {lastResults
                .sort((a, b) => b.score - a.score) // Ordenem per punts
                .map((p, index) => (
                <li key={p.id + "res"}>
                  #{index + 1} {p.name}: <strong>{p.score}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="panel">
          <h3>📜 Hall of Fame (Històric)</h3>
          <ul>
            {highScores.length > 0 ? (
                highScores.map((record, index) => (
                <li key={index} style={{ color: 'gold' }}>
                    {record.name}: {record.score}
                </li>
                ))
            ) : (
                <li>Carregant dades...</li>
            )}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Lobby;