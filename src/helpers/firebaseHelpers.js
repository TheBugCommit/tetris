import { DB_PATHS } from "../config/firebase";
import * as GameStateModel from "../models/GameStateModel";
import * as AttackModel from "../models/AttackModel";
import * as PlayerModel from "../models/PlayerModel";

export const buildStartGameUpdates = (playersData) => {
    const updates = {};
    const gameState = GameStateModel.createPlayingState()

    updates[DB_PATHS.gameStateStatus] = gameState.status;
    updates[DB_PATHS.gameStateIsPaused] = gameState.isPaused;

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

export const buildGameOverUpdates = (playersData, statsData) => {
    const updates = {};
    updates[DB_PATHS.gameState] = GameStateModel.createGameOverState()

    if (playersData) {
        const players = Object.entries(playersData)
            .filter(([key, player]) => player.status === PlayerModel.PLAYER_STATUS.PLAYING);

        const results = {};

        players.forEach(([pid, player]) => {
            results[pid] = {
                ...player,
                gameStats: (statsData && statsData[pid]) ? statsData[pid] : PlayerModel.createInitialStats()
            };

            updates[DB_PATHS.playerStatus(pid)] = PlayerModel.PLAYER_STATUS.WAITING;
        });

        updates[DB_PATHS.lastResults] = results;
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

export const mapLastResults = (data) => {
    if (!data) return [];
    return Object.values(data).map(item => ({
        ...PlayerModel.playerFromFirebase(item),
        gameStats: item.gameStats 
            ? PlayerModel.playerStatsFromFirebase(item.gameStats) 
            : PlayerModel.createInitialStats()
    }));
};

export const mapIncomingAttack = (data) => AttackModel.attackFromFirebase(data);
export const mapPlayersStats = (data) => {
    if (!data) return [];
    return Object.entries(data).map(([key, data]) => {
        return { id: key, ...PlayerModel.playerStatsFromFirebase(data) }
    })
}