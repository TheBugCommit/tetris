import { useEffect, useCallback, useRef, useMemo, useState } from 'react';
import { checkCollision, getMatrix, rotatePieceMath, randomPiece, createGarbageLine } from '../helpers/tetrisHelpers'
import { ROWS, COLS } from '../constants/tetrisConstants';

const INITIAL_BOARD_STATE = {
    board: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
    piece: null,
    nextPiece: null
};

export const useTetris = ({
    speed, gameOver, paused, setGameOver, setLines,
    onNextPieceChange, incomingGarbage, onGarbageConsumed
}) => {

    const [gameState, setGameState] = useState(INITIAL_BOARD_STATE);

    useEffect(() => {
        if (!gameState.piece || !gameState.nextPiece) {
            setGameState(prev => ({
                ...prev,
                piece: randomPiece(),
                nextPiece: randomPiece()
            }));
        }
    }, []);

    const stateRef = useRef(gameState);
    const incomingGarbageRef = useRef(incomingGarbage);

    useEffect(() => { stateRef.current = gameState; }, [gameState]);
    useEffect(() => { incomingGarbageRef.current = incomingGarbage; }, [incomingGarbage])

    useEffect(() => {
        if (gameState.nextPiece && onNextPieceChange) {
            onNextPieceChange(gameState.nextPiece);
        }
    }, [gameState.nextPiece, onNextPieceChange]);

    const spawn = useCallback(() => {
        const { board, nextPiece } = stateRef.current;
        const newNext = randomPiece();

        if (checkCollision(board, nextPiece, 0, 0)) {
            setGameOver(true);
        } else {
            setGameState(prev => ({
                ...prev,
                board: board,
                piece: nextPiece,
                nextPiece: newNext
            }));
        }
    }, [setGameOver, setGameState]);

    const addGarbage = (currentBoard, amount) => {
        if (amount <= 0) return currentBoard;
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
        const { piece, board } = stateRef.current;
        const matrix = getMatrix(piece);

        const newBoard = board.map(row => [...row]);
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    const ny = piece.y + y;
                    const nx = piece.x + x;
                    if (ny >= 0 && ny < ROWS) newBoard[ny][nx] = piece.type;
                }
            });
        });

        const rowsKept = newBoard.filter(row => row.some(cell => !cell));
        const cleared = ROWS - rowsKept.length;
        let finalBoard = [...Array(cleared).fill(null).map(() => Array(COLS).fill(null)), ...rowsKept];

        if (cleared > 0) setLines(cleared);

        const garbageAmount = incomingGarbageRef.current;
        if (garbageAmount > 0) {
            finalBoard = addGarbage(finalBoard, garbageAmount);
            if (onGarbageConsumed) onGarbageConsumed();
        }

        stateRef.current.board = finalBoard
        spawn()
    }, [setLines, spawn, onGarbageConsumed, setGameOver]);

    const move = useCallback((dirX, dirY) => {
        if (gameOver || paused) return;
        const { piece, board } = stateRef.current;

        if (!checkCollision(board, piece, dirX, dirY)) {
            setGameState(prev => ({
                ...prev,
                piece: { ...prev.piece, x: prev.piece.x + dirX, y: prev.piece.y + dirY }
            }));
            return true;
        }

        if (dirY > 0) lockPiece();
        return false;
    }, [gameOver, paused, lockPiece, setGameState]);

    const rotate = useCallback(() => {
        if (gameOver || paused) return;
        const { piece, board } = stateRef.current;
        const rotated = rotatePieceMath(piece);
        if (!checkCollision(board, rotated, 0, 0)) {
            setGameState(prev => ({ ...prev, piece: rotated }));
        }
    }, [gameOver, paused, setGameState]);

    const hardDrop = useCallback(() => {
        if (gameOver || paused) return;
        const { piece, board } = stateRef.current;
        if (!piece) return;

        let dy = 0;
        while (!checkCollision(board, piece, 0, dy + 1)) dy++;
        
        stateRef.current.piece = { ...piece, y: piece.y + dy };
        lockPiece();
    }, [gameOver, paused, lockPiece]);

    useEffect(() => {
        if (gameOver || paused) return;
        const interval = setInterval(() => move(0, 1), speed);
        return () => clearInterval(interval);
    }, [speed, gameOver, paused, move]);

    const getRenderBoard = () => {
        const { board, piece } = gameState;
        if (!board || !piece) return Array(ROWS).fill(Array(COLS).fill(null));

        const temp = board.map(row => [...row]);
        const matrix = getMatrix(piece);
        matrix.forEach((row, y) => {
            row.forEach((val, x) => {
                if (val) {
                    const ny = piece.y + y;
                    const nx = piece.x + x;
                    if (ny >= 0 && ny < ROWS) temp[ny][nx] = piece.type;
                }
            });
        });
        return temp;
    };

    return useMemo(() => ({
        board: gameState.board,
        piece: gameState.piece,
        nextPiece: gameState.nextPiece,
        getRenderBoard,
        actions: {
            moveLeft: () => move(-1, 0),
            moveRight: () => move(1, 0),
            moveDown: () => move(0, 1),
            rotate,
            hardDrop,
        }
    }), [gameState, getRenderBoard, move, rotate, hardDrop]);
};