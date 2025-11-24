import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { checkCollision, getMatrix, rotatePieceMath, randomPiece, createGarbageLine } from '../helpers/tetrisHelpers'
import { ROWS, COLS } from '../constants/tetrisConstants';

export const useTetris = ({
    speed, gameOver, paused, setGameOver, setLines,
    onNextPieceChange, incomingGarbage, onGarbageConsumed
}) => {
    const [board, setBoard] = useState(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
    const [piece, setPiece] = useState(randomPiece());
    const [nextPiece, setNextPiece] = useState(randomPiece());

    const boardRef = useRef(board);
    const pieceRef = useRef(piece);
    const incomingGarbageRef = useRef(incomingGarbage);

    useEffect(() => { boardRef.current = board; }, [board]);
    useEffect(() => { pieceRef.current = piece; }, [piece]);
    useEffect(() => { incomingGarbageRef.current = incomingGarbage; }, [incomingGarbage]);

    useEffect(() => {
        if (onNextPieceChange) onNextPieceChange(nextPiece);
    }, [nextPiece, onNextPieceChange]);

    const spawn = useCallback(() => {
        const currentNext = nextPiece;
        const newNext = randomPiece();

        if (checkCollision(boardRef.current, currentNext, 0, 0)) {
            setGameOver(true);
        } else {
            setPiece(currentNext);
            setNextPiece(newNext);
        }
    }, [nextPiece, setGameOver]);

    const addGarbage = (currentBoard, amount) => {
        if (amount <= 0) return currentBoard;
        // Check Game Over en las líneas superiores
        for (let y = 0; y < amount; y++) {
            if (currentBoard[y].some(cell => cell !== null)) {
                setGameOver(true);
                return currentBoard;
            }
        }
        const remaining = currentBoard.slice(amount);
        const newLines = Array.from({ length: amount }, () => createGarbageLine());
        return [...remaining, ...newLines];
    };

    const lockPiece = useCallback(() => {
        const p = pieceRef.current;
        const b = boardRef.current;
        const m = getMatrix(p);

        const newBoard = b.map(row => [...row]);
        for (let y = 0; y < m.length; y++) {
            for (let x = 0; x < m[y].length; x++) {
                if (m[y][x]) {
                    const ny = p.y + y;
                    const nx = p.x + x;
                    if (ny >= 0) newBoard[ny][nx] = p.type;
                }
            }
        }

        const rowsKept = newBoard.filter(r => r.some(c => !c));
        const cleared = ROWS - rowsKept.length;
        let finalBoardRows = [...Array.from({ length: cleared }, () => Array(COLS).fill(null)), ...rowsKept];

        if (cleared > 0) setLines(cleared);

        // 3. Aplicar Basura (Ataques) si hay pendiente
        const garbageAmount = incomingGarbageRef.current;
        if (garbageAmount > 0) {
            finalBoardRows = addGarbage(finalBoardRows, garbageAmount);
            if (onGarbageConsumed) onGarbageConsumed();
        }

        setBoard(finalBoardRows);
        spawn();

    }, [setLines, spawn, onGarbageConsumed, setGameOver]);

    const move = useCallback((dirX, dirY) => {
        if (gameOver || paused) return;
        const p = pieceRef.current;
        const b = boardRef.current;

        if (!checkCollision(b, p, dirX, dirY)) {
            setPiece(prev => ({ ...prev, x: prev.x + dirX, y: prev.y + dirY }));
            return true; // Movimiento exitoso
        }

        // Si no se puede mover abajo, bloqueamos
        if (dirY > 0) {
            lockPiece();
        }
        return false; // Colisión
    }, [gameOver, paused, lockPiece]);

    const rotate = useCallback(() => {
        if (gameOver || paused) return;
        const p = pieceRef.current;
        const b = boardRef.current;
        const rotated = rotatePieceMath(p);

        if (!checkCollision(b, rotated, 0, 0)) {
            setPiece(rotated);
        }
    }, [gameOver, paused]);

    const hardDrop = useCallback(() => {
        if (gameOver || paused) return;
        const p = pieceRef.current;
        const b = boardRef.current;
        let dy = 0;
        while (!checkCollision(b, p, 0, dy + 1)) {
            dy++;
        }
        const landedPiece = { ...p, y: p.y + dy };
        pieceRef.current = landedPiece;
        setPiece(landedPiece);
        lockPiece();

    }, [gameOver, paused, lockPiece]);

    // Intervalo de Gravedad (Game Loop)
    useEffect(() => {
        if (gameOver || paused) return;
        const interval = setInterval(() => {
            move(0, 1); // Step Down
        }, speed);
        return () => clearInterval(interval);
    }, [speed, gameOver, paused, move]);

    // Helper para renderizado
    const getRenderBoard = () => {
        const temp = board.map(row => [...row]);
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

    return useMemo(() => ({
        board,
        piece,
        getRenderBoard,
        actions: {
            moveLeft: () => move(-1, 0),
            moveRight: () => move(1, 0),
            moveDown: () => move(0, 1),
            rotate,
            hardDrop
        }
    }));
};