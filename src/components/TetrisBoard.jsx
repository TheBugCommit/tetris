import { COLORS } from "../constants/tetrisConstants";
import styles from './TetrisBoard.module.css';

const TetrisBoard = ({board}) => {
  return (
    <div className={styles.boardContainer}>
      <div className={styles.board}>
        {board.map((row, r) =>
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