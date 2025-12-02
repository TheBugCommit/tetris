const ROOT = 'room';
export const DB_PATHS = {
    ROOT: ROOT,
    gameState: `${ROOT}/gameState`,
    gameStateStatus: `${ROOT}/gameState/status`,
    gameStateIsPaused: `${ROOT}/gameState/isPaused`,
    players: `${ROOT}/players`,
    lastResults: `${ROOT}/lastGameResults`,
    player: (id) => `${ROOT}/players/${id}`,
    playerStats: (id) => `${ROOT}/players/${id}/gameStats`,
    playerStatus: (id) => `${ROOT}/players/${id}/status`,
    playerAttacks: (id) => `${ROOT}/players/${id}/incomingAttacks`,
};
