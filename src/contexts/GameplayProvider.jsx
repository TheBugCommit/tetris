import { createContext, useContext, useEffect, useCallback, useMemo, useReducer } from 'react';
import * as gameService from "../services/firebase/rtdb";
import { useUser } from './UserProvider'
import { useRoom } from './RoomProvider';
import rankingService from "../services/ranking/rankingService";

const GameplayContext = createContext();

function playerStatsReducer(state, action) {
    switch (action.type) {
        case "INIT":
            return { lines: action.payload.lines || 0, level: action.payload.level || 1 };
        case "ADD_LINES": {
            const newLines = state.lines + action.payload;
            const newLevel = Math.floor(newLines / 10) + 1;
            return { lines: newLines, level: newLevel };
        }
        default: return state;
    }
}

export const GameplayProvider = ({ children }) => {
    const { playerId, playerName, isJoined } = useUser();
    const { isGameOver, isGamePlaying } = useRoom();

    const [playerGameStats, dispatch] = useReducer(playerStatsReducer, {
        lines: 0,
        level: 1
    });

    const setLines = useCallback((lines) => {
        dispatch({ type: "ADD_LINES", payload: lines });
    }, []);

    useEffect(() => {
        const alreadySubmitted = sessionStorage.getItem("score_submitted");

        if (isGameOver && playerGameStats && !alreadySubmitted) {
            (async () => {
                try {
                    sessionStorage.setItem("score_submitted", "true");

                    await rankingService.postRanking({
                        playerName: playerName,
                        level: playerGameStats.level,
                        lines: playerGameStats.lines
                    });

                    console.log("Ranking enviado y registrado.");
                } catch (error) {
                    sessionStorage.removeItem("score_submitted");
                }
            })();
        } else if(isGamePlaying) {
            sessionStorage.removeItem("score_submitted")
        }
    }, [isGameOver, isGamePlaying])


    useEffect(() => {
        if (!playerId || !isJoined) return;
        gameService.updatePlayerStats(playerId, playerGameStats);

    }, [playerGameStats, playerId, isJoined]);

    const value = useMemo(() => ({
        playerGameStats,
        setLines,
        level: playerGameStats.level,
        lines: playerGameStats.lines
    }), [playerGameStats, setLines]);

    return <GameplayContext.Provider value={value}>{children}</GameplayContext.Provider>;
};

export const useGameplay = () => {
    const context = useContext(GameplayContext);
    if (!context) throw new Error("useGameplay must be used within GameplayProvider");
    return context;
};