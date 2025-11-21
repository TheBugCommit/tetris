import { useGame } from '../contexts/GameContext';
import { useEffect } from 'react';

const Lobby = () => {
  const { status, isPaused, startGame, togglePause, players, playerName, gameOver, countDown, lastResults } = useGame();

  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (e.key === "Enter") {
        if(status == "PLAYING")
          return

        await startGame();
      }

      if (e.key.toLowerCase() === "p") {
        togglePause();
      }

      if(e.key.toLowerCase() === "o") {
        gameOver()
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [startGame, togglePause]);

  if (status === "GAME_OVER") {
    return (
      <div className="game-over-overlay">
        <h1>GAME OVER</h1>
        <p>La partida ha finalitzat.</p>
        
        {countDown !== null && (
            <div className="redirect-timer">
                <h3>Tornant al Lobby en...</h3>
                <div className="big-number">{countDown}</div>
            </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div>
        <h1>Estat: {status}</h1>
        {isPaused && <h2>EN PAUSA</h2>}
        {status === "WAITING" && <p>Prem ENTER per començar</p>}
      </div>

      <div className="results-board">
        <h3>Jugadors / Resultats</h3>
        <ul>
          {lastResults.map((p) => (
            <li 
                key={p.name} 
                className={p.isOnline ? "player-online" : "player-offline"}
                style={{ opacity: p.isOnline ? 1 : 0.5 }}
            >
              <span className="name">
                {p.name} {p.name === playerName && "(Tu)"}
              </span>
              
              <span className="score">Punts: {p.score}</span>
              
              {!p.isOnline && <span className="tag-offline"> (Desconnectat)</span>}
            </li>
          ))}
        </ul>
      </div>

      <h2>Jugadors Connectats ({players.length})</h2>
      <ul>
        {players.map((p) => (
          <li key={p.name} style={{ color: p.name === playerName ? 'green' : 'white' }}>
            {p.name} {p.name === playerName && "(Tu)"}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Lobby