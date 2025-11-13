import { useState } from "react";
import TetrisBoard from "./components/TetrisBoard";

function App() {
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [lines, setLines] = useState(0);

  return (
    <div className="app">
      <div className="layout">
        {/* tablero principal */}
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

        {/* panel lateral */}
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

export default App;
