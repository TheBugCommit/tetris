import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import * as gameService from "../services/firebase/rtdb";

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
    const [gameState, setGameState] = useState({ status: "WAITING", isPaused: false });

    useEffect(() => {
        const unsubGame = gameService.subscribeToGameState(setGameState);
        return () => unsubGame();
    }, []);

    const startGame = useCallback(async () => await gameService.doStartGame(), []);
    const togglePause = useCallback(() => gameService.togglePause(!gameState.isPaused), [gameState.isPaused]);
    const setGameOver = useCallback(async () => await gameService.doGameOver(), []);
    const setWaitingState = useCallback(() => gameService.setGameToWaiting(), []);

    const value = useMemo(() => ({
        isGamePlaying: gameState.status === "PLAYING",
        isGameOver: gameState.status === "GAME_OVER",
        isWaiting: gameState.status === "WAITING",
        isPaused: gameState.isPaused,
        gameState,
        setWaitingState,
        startGame,
        togglePause,
        setGameOver
    }), [gameState, startGame, togglePause, setGameOver, setWaitingState]);

    return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export const useRoom = () => {
    const context = useContext(RoomContext);
    if (!context) throw new Error("useRoom must be used within RoomProvider");
    return context;
};