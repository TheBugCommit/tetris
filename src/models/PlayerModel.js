export const INITIAL_PLAYER_STATS = {
    lines: 0,
    level: 1
};

export const createPlayer = (id, name, isOnline = true, gameStats = INITIAL_PLAYER_STATS) => ({
    id,
    name,
    isOnline,
    gameStats
});

export const playerFromFirebase = (data) => {
    if (!data) return null;
    return createPlayer(data.id, data.name, data.isOnline, data.gameStats);
};

export const createGameStats = (lines = 0, level = 1) => ({
    lines,
    level
});

export const getReconnectPayload = () => ({ isOnline: true });
export const getDisconnectPayload = () => ({ isOnline: false });
export const createInitialStats = () => ({ ...INITIAL_PLAYER_STATS });