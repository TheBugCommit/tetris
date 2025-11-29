import { DB_PATHS, INITIAL_PLAYER_STATS } from "../constants/gameConstants";
import * as GameStateModel from "../models/GameStateModel";
import * as AttackModel from "../models/AttackModel";

export const buildStartGameUpdates = (playersData) => {
    const updates = {};
    const gameState = GameStateModel.createPlayingState()

    updates[`${DB_PATHS.gameState}/status`] = gameState.status;
    updates[`${DB_PATHS.gameState}/isPaused`] = gameState.isPaused;
    updates[DB_PATHS.lastResults] = null;

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
    updates[DB_PATHS.gameState] = GameStateModel.createGameOverState()

    if (playersData) {
        updates[DB_PATHS.lastResults] = playersData;
    }
    return updates;
};

export const buildWaitingState = () => GameStateModel.createWaitingState()

export const buildAttackUpdates = (allPlayers, myPlayerId, myName, lines, idGenerator) => {
    const updates = {};
    const attackPayload = AttackModel.createAttack(myName, lines);
    allPlayers.forEach(player => {
        if (player.id !== myPlayerId && player.isOnline) {
            const newKey = idGenerator();
            const path = `${DB_PATHS.playerAttacks(player.id)}/${newKey}`;
            updates[path] = attackPayload;
        }
    });
    return updates;
};

export const mapGameState = (data) => GameStateModel.gameStateFromFirebase(data);
export const mapPlayersList = (data) => data ? Object.values(data) : [];
export const mapResultsList = (data) => data ? Object.values(data) : [];
export const mapIncomingAttack = (data) => AttackModel.attackFromFirebase(data);