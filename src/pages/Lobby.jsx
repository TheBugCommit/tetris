import { useGame } from '../contexts/GameContext';
import { useEffect } from 'react';

const Lobby = () => {
  const { status, isPaused, startGame, togglePause, players, playerName } = useGame();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        if(status == "PLAYING")
          return

        startGame();
      }

      if (e.key.toLowerCase() === "p") {
        togglePause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [startGame, togglePause]);

  return (
    <>
      <div>
        <h1>Estat: {status}</h1>
        {isPaused && <h2>EN PAUSA</h2>}
        {status === "WAITING" && <p>Prem ENTER per començar</p>}
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