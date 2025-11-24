import { useEffect } from "react";
import { COLORS } from "../constants/tetrisConstants";
import { useTetris } from "../hooks/useTetris";
import styles from './TetrisBoard.module.css';

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
      if (keys.includes(e.key) || keys.includes(e.code)) e.preventDefault();

      if (e.code === "KeyP") {
        return togglePause();
      }

      if (gameOver || paused) return;

      if (e.key === "ArrowLeft") actions.moveLeft();
      if (e.key === "ArrowRight") actions.moveRight();
      if (e.key === "ArrowDown") actions.moveDown();
      if (e.key === "ArrowUp") actions.rotate();
      if (e.code === "Space") actions.hardDrop();
    };

    window.addEventListener("keydown", handleKeyDown);
    
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [actions, paused, gameOver, togglePause]);

  const renderBoard = getRenderBoard();

  return (
    <div className={styles.boardContainer}>
      <div className={styles.board}>
        {renderBoard.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`${styles.cell} ${!cell ? styles.cellEmpty : ''}`}
              style={{
                backgroundColor: cell ? COLORS[cell] : undefined,
                boxShadow: cell ? 'inset 0 0 4px rgba(0,0,0,0.25)' : 'none'
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TetrisBoard;