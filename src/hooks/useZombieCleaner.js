import { useEffect, useRef } from 'react';
import * as GameStateModel from '../models/GameStateModel';
import * as PlayerModel from '../models/PlayerModel';
import * as gameService from '../services/gameService';

export const useZombieCleaner = (gameState, players, myPlayerId) => {
    const stateRef = useRef({ gameState, players, myPlayerId });

    useEffect(() => {
        stateRef.current = { gameState, players, myPlayerId };
    }, [gameState, players, myPlayerId]);

    useEffect(() => {
        if (!gameState) return;

        let zombieTimer;

        const checkAndClean = async () => {
            const { gameState, players, myPlayerId } = stateRef.current;

            if (gameState.status !== GameStateModel.GAME_STATUS.PLAYING) return;
            if (players.length === 0) return;

            const activePlayers = players.filter(p => p.isOnline && p.status === PlayerModel.PLAYER_STATUS.PLAYING);

            if (activePlayers.length === 0) {
                const allConnected = players.filter(p => p.isOnline).sort((a, b) => a.id.localeCompare(b.id));
                const coordinator = allConnected[0];

                if (coordinator && coordinator.id === myPlayerId) {
                    console.log("👮 Soy el coordinador. Detectada partida zombie. Iniciando limpieza...", myPlayerId);
                    await gameService.doGameOver();
                }
            }
        };

        if (gameState.status === GameStateModel.GAME_STATUS.PLAYING) {
            zombieTimer = setTimeout(checkAndClean, 3000);
        }

        return () => clearTimeout(zombieTimer);

    }, [gameState?.status, players, myPlayerId]); 
};