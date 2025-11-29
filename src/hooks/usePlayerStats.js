import { useMemo, useCallback } from 'react';
import { useUser } from '../contexts/UserProvider'; 
import { useRoom } from '../contexts/RoomProvider'; 
import * as gameService from '../services/gameService'; 
import * as PlayerModel from '../models/PlayerModel'; 

export const usePlayerStats = () => {
    const { playerId, playerName, isJoined } = useUser();
    const { players } = useRoom();

    const stats = useMemo(() => {
        if (!playerId || !players) return PlayerModel.createInitialStats();
        const player = players.find(p => p.id === playerId);
        return player?.gameStats || PlayerModel.createInitialStats();
    }, [players, playerId]);

    const addLines = useCallback((linesCleared) => {
        if (!playerId || !isJoined) return;

        gameService.sendAttackToOthers(playerId, playerName, linesCleared, players);
        const newTotalLines = stats.lines + linesCleared;
        const newLevel = Math.floor(newTotalLines / 10) + 1;
        const newStats = PlayerModel.createGameStats(newTotalLines, newLevel);
        gameService.updatePlayerStats(playerId, newStats);
    }, [playerId, playerName, isJoined, players, stats]);

    return { 
        stats, 
        addLines, 
        level: stats.level, 
        lines: stats.lines 
    };
};