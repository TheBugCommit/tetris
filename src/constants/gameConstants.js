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

export const DB_PATHS = {
    ROOT: 'room',
    gameState: () => `room/gameState`,
    players: () => `room/players`,
    player: (id) => `room/players/${id}`,
    playerStats: (id) => `room/players/${id}/gameStats`,
    playerAttacks: (id) => `room/players/${id}/incomingAttacks`,
    lastResults: () => `room/lastGameResults`,
};