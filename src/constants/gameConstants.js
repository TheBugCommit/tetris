export const GAME_STATUS = {
    WAITING: "WAITING",
    PLAYING: "PLAYING",
    GAME_OVER: "GAME_OVER",
};

export const INITIAL_PLAYER_STATS = {
    lines: 0,
    level: 1
};

export const INITIAL_GAME_STATE = {
    status: GAME_STATUS.WAITING,
    isPaused: false
};

export const GAME_OVER_GAME_STATE = {
    status: GAME_STATUS.GAME_OVER,
    isPaused: true
};

export const PLAYING_GAME_STATE = {
    status: GAME_STATUS.PLAYING,
    isPaused: false
};

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
    playerAttacks: (id) => `${ROOT}/players/${id}/incomingAttacks`,
};