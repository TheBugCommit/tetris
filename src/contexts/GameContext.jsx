import { createContext, useContext, useState, useEffect } from 'react';
import { doStartGame, doTogglePause, subscribeToGameState, joinRoom, subscribeToPlayers } from "../services/firebase/rtdb"

const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [players, setPlayers] = useState([]);
    const [gameState, setGameState] = useState({ status: "WAITING", isPaused: false, players: []});
    const [playerName, setPlayerName] = useState(() => sessionStorage.getItem("activePlayerName") || "");

    useEffect(() => {
        const onDataUpdate = (data) => setGameState(data)
        const detachListener = subscribeToGameState(onDataUpdate);
        return () => detachListener();
    }, []);

    useEffect(() => {
        if (playerName) {
            sessionStorage.setItem("activePlayerName", playerName);
        } else {
            sessionStorage.removeItem("activePlayerName");
        }

        if (!playerName) return;

        joinRoom(playerName);

        const detachPlayers = subscribeToPlayers((updatedPlayers) => setPlayers(updatedPlayers));

        return () => detachPlayers();

    }, [playerName]);

    const value = {
        status: gameState.status,
        isPaused: gameState.isPaused,
        players,
        startGame: doStartGame,
        togglePause: doTogglePause,
        setPlayerName,
        playerName,
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
    return useContext(GameContext);
};