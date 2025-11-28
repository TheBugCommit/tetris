import { createContext, useContext, useEffect, useCallback, useMemo, useReducer, useState } from 'react';
import * as gameService from "../services/gameService";
import { useUser } from './UserProvider'
import { useRoom } from './RoomProvider';
import rankingService from "../services/rankingService";
import { SPEED } from '../constants/tetrisConstants';
import { usePlayerStats } from '../hooks/usePlayerStats';
import { useGameAttacks } from '../hooks/useGameAttacks';

const GameplayContext = createContext();

// TODO: Arreglar models del servie
// TODO_ arreglar css
// TODO: Arreglar nomenclatura
// TODO: Arreglar moles practiques

export const GameplayProvider = ({ children }) => {
    const { playerId, playerName, isJoined } = useUser();
    const { isGameOver, isGamePlaying } = useRoom();

    const { stats: playerGameStats, addLines: setLines } = usePlayerStats();
    const { garbagePending, notification, consumeGarbage } = useGameAttacks(playerId, isJoined, isGamePlaying)
    const [speed, setSpeed] = useState(SPEED)

    useEffect(() => {
        setSpeed((s) => Math.max(50, SPEED * Math.pow(0.9, playerGameStats.level - 1)))
    }, [playerGameStats.level])

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

                } catch (error) {
                    sessionStorage.removeItem("score_submitted");
                }
            })();
        } else if (isGamePlaying) {
            sessionStorage.removeItem("score_submitted")
        }
    }, [isGameOver, isGamePlaying])

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