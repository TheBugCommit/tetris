import { useState, useEffect } from "react";
import TetrisBoard from "./components/TetrisBoard";
import { GameProvider } from "./contexts/GameContext";
import Router from "./routes/Router";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <Router />
      </GameProvider>
    </BrowserRouter>
  );
}
export default App;

/*
function App() {
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [lines, setLines] = useState(0);
  const [gameState, setGameState] = useState("LOOBY")
  const [playerName, setPlayerName] = useRef(0)


  if (gameState === "LOBBY") {
    return (
      <div className="lobby">
        <h1>Tetris Multiplayer</h1>
        <input
          value={playerName}
          onChange={e => setPlayerName(e.target.value)}
          placeholder="El teu nom"
        />
        <button onClick={joinLobby}>Unir-se</button>

        <div className="ranking">
          <h2>Ranking Històric</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="layout">
        <div>
          <h1 className="title">React Tetris</h1>
          <TetrisBoard
            paused={paused}
            setPaused={setPaused}
            gameOver={gameOver}
            setGameOver={setGameOver}
            setLines={setLines}
          />
        </div>

        <div className="panel">
          {paused && <div className="banner pause">Paused</div>}
          {gameOver && <div className="banner over">Game Over</div>}

          <div className="stat">Lines: {lines}</div>

          <div className="help">
            <p>← → Move</p>
            <p>↑ Rotate</p>
            <p>↓ Drop</p>
            <p>Space Hard drop</p>
            <p>P Pause</p>
          </div>
        </div>
      </div>
    </div>
  );


}

*/