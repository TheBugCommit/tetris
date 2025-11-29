import { createContext, useContext, useMemo } from 'react';
import { useUser } from './UserProvider'
import { useRoom } from './RoomProvider';
import { usePlayerStats } from '../hooks/usePlayerStats';
import { useGameAttacks } from '../hooks/useGameAttacks';
import { MIN_SPEED, SPEED_DECAY_FACTOR, SPEED } from '../constants/tetrisConstants';
import { useScoreSubmission } from '../hooks/useScoreSubmission';
import { useNotification } from '../hooks/useNotification';

const GameplayContext = createContext();

export const GameplayProvider = ({ children }) => {
    const { playerId, playerName, isJoined } = useUser();
    const { isGameOver, isGamePlaying } = useRoom();

    const { stats: playerGameStats, addLines: setLines } = usePlayerStats();
    const { notification, showNotification } = useNotification();
    const { garbagePending, consumeGarbage } = useGameAttacks(playerId, isJoined, isGamePlaying, showNotification)
    const speed = useMemo(() => Math.max(MIN_SPEED, SPEED * Math.pow(SPEED_DECAY_FACTOR, playerGameStats.level - 1))
        , [playerGameStats.level]);

    useScoreSubmission(isGameOver, isGamePlaying, playerGameStats, playerName, showNotification);

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