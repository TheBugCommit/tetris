import { useMemo, useCallback } from 'react';
import { useUser } from '../contexts/UserProvider'; 
import { useRoom } from '../contexts/RoomProvider'; 
import * as gameService from '../services/gameService'; 
import { INITIAL_PLAYER_STATS } from '../constants/gameConstants';

export const usePlayerStats = () => {
    const { playerId, playerName, isJoined } = useUser();
    const { players } = useRoom();

    const stats = useMemo(() => {
        if (!playerId || !players) return INITIAL_PLAYER_STATS;
        const player = players.find(p => p.id === playerId);
        return player?.gameStats || INITIAL_PLAYER_STATS;
    }, [players, playerId]);

    const addLines = useCallback((linesCleared) => {
        if (!playerId || !isJoined) return;

        gameService.sendAttackToOthers(playerId, playerName, linesCleared, players);
        const newTotalLines = stats.lines + linesCleared;
        const newLevel = Math.floor(newTotalLines / 10) + 1;
        gameService.updatePlayerStats(playerId, {
            lines: newTotalLines,
            level: newLevel
        });

    }, [playerId, playerName, isJoined, players, stats]);

    return { 
        stats, 
        addLines, 
        level: stats.level, 
        lines: stats.lines 
    };
};