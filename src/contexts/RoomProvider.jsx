import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import * as gameService from "../services/gameService";
import * as GameStateModel from '../models/GameStateModel'
import { useZombieCleaner } from '../hooks/useZombieCleaner';
import { useUser } from './UserProvider';

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
    const [gameState, setGameState] = useState(null);
    const [players, setPlayers] = useState([]);
    const { playerId } = useUser();

    useEffect(() => {
        const unsubGame = gameService.subscribeToGameState(setGameState);
        const unsubPlayers = gameService.subscribeToPlayers(setPlayers);

        return () => {
            unsubGame();
            unsubPlayers();
        }
    }, []);

    const startGame = useCallback(async () => await gameService.doStartGame(), []);
    const togglePause = useCallback(() => {
        if (gameState) {
            gameService.togglePause(gameState.isPaused);
        }
    }, [gameState]);
    const setGameOver = useCallback(async () => await gameService.doGameOver(), []);

    useZombieCleaner(gameState, players, playerId)

    const value = useMemo(() => ({
        isGamePlaying: gameState?.status === GameStateModel.GAME_STATUS.PLAYING,
        isGameOver: gameState?.status === GameStateModel.GAME_STATUS.GAME_OVER,
        isPaused: gameState?.isPaused || false,
        gameState: gameState || GameStateModel.createGameOverState(),
        players,
        startGame,
        togglePause,
        setGameOver
    }), [gameState, players, startGame, togglePause, setGameOver]);

    return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export const useRoom = () => {
    const context = useContext(RoomContext);
    if (!context) throw new Error("useRoom must be used within RoomProvider");
    return context;
};