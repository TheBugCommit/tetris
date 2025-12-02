const ROOT = 'room';
export const DB_PATHS = {
    ROOT: ROOT,
    gameState: `${ROOT}/gameState`,
    gameStateStatus: `${ROOT}/gameState/status`,
    gameStateIsPaused: `${ROOT}/gameState/isPaused`,
    players: `${ROOT}/players`,
    lastResults: `${ROOT}/lastGameResults`,
    player: (id) => `${ROOT}/players/${id}`,

        // TODO: moure els atacks tambe
    playerStats: (id) => `${ROOT}/players_stats/${id}`,
    allPlayersStats: `${ROOT}/players_stats`,

    playerStatus: (id) => `${ROOT}/players/${id}/status`,
    playerAttacks: (id) => `${ROOT}/players/${id}/incomingAttacks`,
};
