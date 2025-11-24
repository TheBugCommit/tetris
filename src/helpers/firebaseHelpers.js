import { DB_PATHS, INITIAL_PLAYER_STATS } from "../constants/gameConstants";
import { GameStateModel } from "../models/GameStateModel";
import { AttackModel } from "../models/AttackModel";

// --- BUILDERS DE ACTUALIZACIÓN COMPLEJA ---

export const buildStartGameUpdates = (playersData) => {
    const updates = {};
    const playingState = GameStateModel.createPlaying().toFirebase();

    // 1. Estado Global
    updates[`${DB_PATHS.gameState}/status`] = playingState.status;
    updates[`${DB_PATHS.gameState}/isPaused`] = playingState.isPaused;
    updates[DB_PATHS.lastResults] = null;

    // 2. Jugadores (Reset)
    if (playersData) {
        Object.keys(playersData).forEach(pid => {
            const player = playersData[pid];
            if (!player.isOnline) {
                updates[DB_PATHS.player(pid)] = null;
            } else {
                updates[DB_PATHS.playerStats(pid)] = INITIAL_PLAYER_STATS;
            }
        });
    }
    return updates;
};

export const buildGameOverUpdates = (playersData) => {
    const updates = {};
    updates[DB_PATHS.gameState] = GameStateModel.createGameOver().toFirebase();
    
    if (playersData) {
        updates[DB_PATHS.lastResults] = playersData;
    }
    return updates;
};

export const buildWaitingState = () => GameStateModel.createWaiting().toFirebase();

export const buildAttackUpdates = (allPlayers, myPlayerId, myName, lines, idGenerator) => {
    const updates = {};
    const attackPayload = new AttackModel(myName, lines).toFirebase();

    allPlayers.forEach(player => {
        if (player.id !== myPlayerId && player.isOnline) {
            const newKey = idGenerator();
            const path = `${DB_PATHS.playerAttacks(player.id)}/${newKey}`;
            updates[path] = attackPayload;
        }
    });
    return updates;
};

// --- MAPPERS PARA SUSCRIPCIONES ---
export const mapGameState = (data) => data || GameStateModel.createWaiting().toFirebase();
export const mapPlayersList = (data) => data ? Object.values(data) : [];
export const mapResultsList = (data) => data ? Object.values(data) : [];
// Attack usa el modelo directamente para limpiar datos
export const mapIncomingAttack = (data) => AttackModel.fromFirebase(data);