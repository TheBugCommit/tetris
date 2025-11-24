import { useEffect } from "react";
import { COLORS } from "../constants/tetrisConstants";
import { useTetris } from "../hooks/useTetris";

const TetrisBoard = (props) => {
  const { 
    paused, 
    togglePause, 
    gameOver 
  } = props;

  const { getRenderBoard, actions } = useTetris(props);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"];
      // Evitamos el scroll del navegador
      if (keys.includes(e.key) || keys.includes(e.code)) e.preventDefault();

      // Pausa
      if (e.code === "KeyP") {
        return togglePause();
      }

      if (gameOver || paused) return;

      // Acciones usando las funciones ESTABLES del hook
      if (e.key === "ArrowLeft") actions.moveLeft();
      if (e.key === "ArrowRight") actions.moveRight();
      if (e.key === "ArrowDown") actions.moveDown();
      if (e.key === "ArrowUp") actions.rotate();
      if (e.code === "Space") actions.hardDrop();
    };

    window.addEventListener("keydown", handleKeyDown);
    
    // Limpieza
    return () => window.removeEventListener("keydown", handleKeyDown);
    
    // OJO: 'actions' es estable (no cambia en cada render), 
    // así que este listener se crea UNA SOLA VEZ (o cuando cambie paused/gameOver).
    // ¡Adiós a los problemas de rendimiento!
  }, [actions, paused, gameOver, togglePause]);

  const renderBoard = getRenderBoard();

  return (
    <div className="board">
      {renderBoard.map((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            className="cell"
            style={{
              backgroundColor: cell ? COLORS[cell] : "transparent",
            }}
          />
        ))
      )}
    </div>
  );
};

export default TetrisBoard;