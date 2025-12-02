import { useCallback, useEffect, useState } from 'react';
import { useUser } from '../contexts/UserProvider';
import { useRoom } from '../contexts/RoomProvider';
import * as gameService from '../services/gameService';
import * as PlayerModel from '../models/PlayerModel';

export const usePlayerStats = () => {
    const { playerId, playerName, isJoined } = useUser();
    const { players } = useRoom();

    const [stats, setStats] = useState(PlayerModel.createInitialStats());

    useEffect(() => {
        const unsubscribe = gameService.subscribeToMyStats(playerId, (data) => { if (data) setStats(data) });
        return () => unsubscribe();
    }, [playerId])

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