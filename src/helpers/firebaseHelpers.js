import { DB_PATHS } from "../config/firebase";
import * as GameStateModel from "../models/GameStateModel";
import * as AttackModel from "../models/AttackModel";
import * as PlayerModel from "../models/PlayerModel";

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
                updates[DB_PATHS.playerStats(pid)] = PlayerModel.createInitialStats();
                updates[DB_PATHS.playerAttacks(pid)] = null;
                updates[DB_PATHS.playerStatus(pid)] = PlayerModel.PLAYER_STATUS.PLAYING;
            }
        });
    }
    return updates;
};

export const buildGameOverUpdates = (playersData) => {
    const updates = {};
    updates[DB_PATHS.gameState] = GameStateModel.createGameOverState()

    if (playersData) {
        const players = Object.fromEntries(
            Object.entries(playersData)
                .filter(([key, player]) => player.status === PlayerModel.PLAYER_STATUS.PLAYING)
        );

        updates[DB_PATHS.lastResults] = players;
        Object.keys(playersData).forEach(pid => {
            updates[DB_PATHS.playerStatus(pid)] = PlayerModel.PLAYER_STATUS.WAITING;
        });
    }
    return updates;
};

export const buildAttackUpdates = (allPlayers, myPlayerId, myName, lines, idGenerator) => {
    const updates = {};
    const attackPayload = AttackModel.createAttack(myName, lines);
    allPlayers.forEach(player => {
        if (player.id !== myPlayerId && player.isOnline && player.status === PlayerModel.PLAYER_STATUS.PLAYING) {
            const newKey = idGenerator();
            const path = `${DB_PATHS.playerAttacks(player.id)}/${newKey}`;
            updates[path] = attackPayload;
        }
    });
    return updates;
};

export const mapGameState = (data) => GameStateModel.gameStateFromFirebase(data);
export const mapPlayersList = (data) => {
    if (!data) return [];
    return Object.values(data).map(playerData =>
        PlayerModel.playerFromFirebase(playerData)
    );
};
export const mapIncomingAttack = (data) => AttackModel.attackFromFirebase(data);