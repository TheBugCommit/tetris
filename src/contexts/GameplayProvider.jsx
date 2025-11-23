import { createContext, useContext, useEffect, useCallback, useMemo, useReducer, useState } from 'react';
import * as gameService from "../services/firebase/rtdb";
import { useUser } from './UserProvider'
import { useRoom } from './RoomProvider';
import rankingService from "../services/ranking/rankingService";
import { SPEED } from '../constants/constants';

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
    const { isGameOver, isGamePlaying, players } = useRoom();

    const [playerGameStats, dispatch] = useReducer(playerStatsReducer, {
        lines: 0,
        level: 1
    });
    const [speed, setSpeed] = useState(SPEED)
    const [garbagePending, setGarbagePending] = useState(0);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (!playerId || !isJoined || !isGamePlaying) return;

        const unsubscribe = gameService.subscribeToIncomingAttacks(playerId, (lines, senderName) => {
            setGarbagePending(prev => prev + lines);
            setNotification({
                id: Date.now(),
                message: `⚠️ Ataque de ${senderName}: +${lines} líneas!`
            });
        });

        return () => unsubscribe();
    }, [playerId, isJoined, isGamePlaying]);

    const consumeGarbage = useCallback(() => {
        setGarbagePending(0);
    }, []);

    useEffect(() => {
        setSpeed((s) => Math.max(50, SPEED * Math.pow(0.9, playerGameStats.level - 1)))
    }, [playerGameStats.level])

    useEffect(() => {
        const alreadySubmitted = sessionStorage.getItem("score_submitted");
        
        setNotification(null);
        setGarbagePending(0);

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
        } else if (isGamePlaying) {
            sessionStorage.removeItem("score_submitted")
        }
    }, [isGameOver, isGamePlaying])

    useEffect(() => {
        if (!playerId || !isJoined) return;
        gameService.updatePlayerStats(playerId, playerGameStats);

    }, [playerGameStats, playerId, isJoined]);

    const setLines = useCallback((lines) => {
        gameService.sendAttackToOthers(playerId, playerName, lines, players);
        dispatch({ type: "ADD_LINES", payload: lines });
    }, [playerId, playerName, players]);

    const value = useMemo(() => ({
        playerGameStats,
        setLines,
        level: playerGameStats.level,
        lines: playerGameStats.lines,
        speed,
        garbagePending,
        notification,
        consumeGarbage
    }), [playerGameStats, setLines, speed, garbagePending, notification, consumeGarbage]);

    return <GameplayContext.Provider value={value}>{children}</GameplayContext.Provider>;
};

export const useGameplay = () => {
    const context = useContext(GameplayContext);
    if (!context) throw new Error("useGameplay must be used within GameplayProvider");
    return context;
};