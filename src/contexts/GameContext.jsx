import { createContext, useContext, useState, useEffect, useCallback, useReducer } from 'react';
import * as gameService from "../services/firebase/rtdb";

const GameContext = createContext();

function playerStatsReducer(state, action) {
    switch (action.type) {
        case "INIT":
            return {
                lines: action.payload.lines || 0,
                level: action.payload.level || 1
            };

        case "ADD_LINES": {
            const newLines = state.lines + action.payload;
            const newLevel = Math.floor(newLines / 10) + 1;
            return { lines: newLines, level: newLevel };
        }

        default:
            return state;
    }
}

export const GameProvider = ({ children }) => {

    const [players, setPlayers] = useState([]);
    const [gameState, setGameState] = useState({ status: "WAITING", isPaused: false });
    const [lastResults, setLastResults] = useState([]);
    const [isJoined, setIsJoined] = useState(false);

    const [playerName, setPlayerName] = useState(() => sessionStorage.getItem("activePlayerName") || "");
    const [playerId, setPlayerId] = useState(() => sessionStorage.getItem("activePlayerId") || "");

    const playerStats = Array.isArray(players) ? players.find(p => p.id === playerId) : null;

    const [playerGameStats, dispatch] = useReducer(playerStatsReducer, {
        lines: 0,
        level: 1
    });

    useEffect(() => {
        if (playerStats) {
            dispatch({
                type: "INIT",
                payload: playerStats
            });
        }
    }, [playerStats]);

    useEffect(() => {
        if (!playerId || !isJoined) return;

        gameService.updatePlayerStats(playerId, playerGameStats);
    }, [playerGameStats, playerId, isJoined]);

    const setLines = useCallback((lines) => {
        dispatch({ type: "ADD_LINES", payload: lines });
    }, []);

    useEffect(() => {
        const unsubGame = gameService.subscribeToGameState(setGameState);
        const unsubPlayers = gameService.subscribeToPlayers(setPlayers);
        const unsubResults = gameService.subscribeToLastResults(setLastResults);

        return () => {
            unsubGame();
            unsubPlayers();
            unsubResults();
        };
    }, []);

    const setPlayerInfo = useCallback((id, name) => {
        setPlayerName(name);
        setPlayerId(id);
        sessionStorage.setItem("activePlayerName", name);
        sessionStorage.setItem("activePlayerId", id);
    });

    useEffect(() => {
        if (playerId && playerName) {
            (async () => {
                try {
                    await gameService.joinRoom(playerId, playerName);
                    setIsJoined(true)
                } catch (error) {
                    console.error(error);
                }
            })();
        }
    }, [playerId, playerName]);

    const startGame = async () => { await gameService.doStartGame(); };

    const setGameOver = useCallback(() => {
        gameService.saveGameResults(players);
        gameService.setGameToOver();
    }, [players]);

    const togglePause = useCallback(() => {
        gameService.togglePause(gameState.isPaused);
    }, [gameState.isPaused]);

    const value = {
        isGamePlaying: gameState.status == "PLAYING",
        isGameOver: gameState.status == "GAME_OVER",
        isPaused: gameState.isPaused,
        playerGameStats,
        players,
        lastResults,
        playerName,
        playerId,
        setPlayerName,
        startGame,
        setLines,
        setGameOver,
        togglePause,
        setPlayerInfo
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGame debe ser usado dentro de un GameProvider");
    }
    return context;
};