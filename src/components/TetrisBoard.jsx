import { useState, useEffect } from "react";
import { ROWS, COLS, SHAPES, COLORS } from "../utils/tetris/constants";

function randomPiece() {
  const keys = Object.keys(SHAPES).filter(key => key !== 'G');
  const type = keys[Math.floor(Math.random() * keys.length)];
  return { type, rotation: 0, x: 3, y: 0 };
}


function rotate(piece, dir = 1) {
  const total = SHAPES[piece.type].length;
  return { ...piece, rotation: (piece.rotation + dir + total) % total };
}


function getMatrix(piece) {
  return SHAPES[piece.type][piece.rotation];
}

function createGarbageLine() {
  const line = Array(COLS).fill("G");
  const hole1 = Math.floor(Math.random() * COLS);
  let hole2 = Math.floor(Math.random() * COLS);
  while (hole1 === hole2) hole2 = Math.floor(Math.random() * COLS);

  line[hole1] = null;
  line[hole2] = null;
  return line;
}

const TetrisBoard = ({
  paused,
  togglePause,
  gameOver,
  setGameOver,
  setLines,
  onNextPieceChange,
  speed,
  onGarbageConsumed,
  incomingGarbage
}) => {
  const [board, setBoard] = useState(
    Array.from({ length: ROWS }, () => Array(COLS).fill(null))
  );

  useEffect(() => {
    setBoard(addGarbage(board, 1));
  }, [])

  const [piece, setPiece] = useState(randomPiece());
  const [nextPiece, setNextPiece] = useState(randomPiece());

  const addGarbage = (currentBoard, amount) => {
    if (amount <= 0) return currentBoard;

    // 1. Quitamos 'amount' líneas de arriba (Game Over si había algo ahí)
    // Comprobamos si las líneas que vamos a eliminar tienen piezas
    for (let y = 0; y < amount; y++) {
      if (currentBoard[y].some(cell => cell !== null)) {
        setGameOver(true);
        return currentBoard;
      }
    }

    // 2. Cortamos el tablero y añadimos las nuevas líneas abajo
    const remainingBoard = currentBoard.slice(amount);
    const newGarbageLines = Array.from({ length: amount }, () => createGarbageLine());

    return [...remainingBoard, ...newGarbageLines];
  };


  useEffect(() => {
    if (onNextPieceChange) {
      onNextPieceChange(nextPiece);
    }
  }, [nextPiece, onNextPieceChange]);

  const collide = (b, p, offX = 0, offY = 0) => {
    const m = getMatrix(p);
    for (let y = 0; y < m.length; y++) {
      for (let x = 0; x < m[y].length; x++) {
        if (!m[y][x]) continue;

        const nx = p.x + x + offX;
        const ny = p.y + y + offY;

        if (ny < 0) continue;

        if (nx < 0 || nx >= COLS || ny >= ROWS) return true;

        if (b[ny][nx]) return true;
      }
    }
    return false;
  };


  const merge = (b, p) => {
    const m = getMatrix(p);
    const newBoard = b.map((r) => r.slice());

    for (let y = 0; y < m.length; y++) {
      for (let x = 0; x < m[y].length; x++) {
        if (m[y][x]) {
          const ny = p.y + y;
          const nx = p.x + x;
          if (ny >= 0) newBoard[ny][nx] = p.type;
        }
      }
    }
    return newBoard;
  };


  const clearLines = (b) => {
    const rowsKept = b.filter((r) => r.some((c) => !c));
    const cleared = ROWS - rowsKept.length;

    const newRows = Array.from({ length: cleared }, () =>
      Array(COLS).fill(null)
    );

    return { newBoard: [...newRows, ...rowsKept], cleared };
  };


  const spawn = () => {
    if (collide(board, nextPiece, 0, 0)) setGameOver(true);
    else {
      setPiece(nextPiece);
      setNextPiece(randomPiece())
    }
  };


  const stepDown = () => {
    if (gameOver || paused) return;

    if (!collide(board, piece, 0, 1)) {
      setPiece((prev) => ({ ...prev, y: prev.y + 1 }));
    } else {
      const merged = merge(board, piece);
      const { newBoard, cleared } = clearLines(merged);
      if (cleared > 0) setLines(cleared);
      let finalBoard = newBoard;
      if (incomingGarbage > 0) {
        finalBoard = addGarbage(newBoard, incomingGarbage);
        onGarbageConsumed();
      }

      setBoard(finalBoard);
      spawn();
    }
  };


  useEffect(() => {
    if (gameOver || paused) return;
    const interval = setInterval(stepDown, speed);
    return () => clearInterval(interval);
  }, [speed, stepDown, gameOver, paused]);


  useEffect(() => {
    const handleKeyDown = (e) => {
      const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"];
      if (keys.includes(e.key) || keys.includes(e.code)) e.preventDefault();

      if (e.code === "KeyP"){
        return togglePause();
      } 
      if (gameOver || paused) return;

      if (e.key === "ArrowLeft" && !collide(board, piece, -1, 0))
        setPiece((p) => ({ ...p, x: p.x - 1 }));

      if (e.key === "ArrowRight" && !collide(board, piece, 1, 0))
        setPiece((p) => ({ ...p, x: p.x + 1 }));

      if (e.key === "ArrowDown") stepDown();

      if (e.key === "ArrowUp") {
        const rotated = rotate(piece);
        if (!collide(board, rotated, 0, 0)) setPiece(rotated);
      }

      if (e.code === "Space") {
        let dy = 0;
        while (!collide(board, piece, 0, dy + 1)) dy++;

        const landed = { ...piece, y: piece.y + dy };
        const merged = merge(board, landed);
        const { newBoard, cleared } = clearLines(merged);

        if (cleared > 0) setLines(cleared);
        let finalBoard = newBoard;
        if (incomingGarbage > 0) {
          finalBoard = addGarbage(newBoard, incomingGarbage);
          onGarbageConsumed();
        }

        setBoard(finalBoard);
        spawn();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [board, piece, gameOver, paused, togglePause]);


  const getRenderBoard = (board, piece) => {

    const temp = board.map((row) => [...row]);
    const m = getMatrix(piece);

    for (let y = 0; y < m.length; y++) {
      for (let x = 0; x < m[y].length; x++) {
        if (!m[y][x]) continue;

        const ny = piece.y + y;
        const nx = piece.x + x;
        if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS) {
          temp[ny][nx] = piece.type;
        }
      }
    }
    return temp;
  };


  return (
    <div className="board">
      {getRenderBoard(board, piece).map((row, r) =>
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
