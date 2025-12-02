export const INITIAL_PLAYER_STATS = {
    lines: 0,
    level: 1
};

export const PLAYER_STATUS = {
    WAITING: "WAITING",
    PLAYING: "PLAYING"
};

export const createPlayer = (id, name, isOnline = true, status = PLAYER_STATUS.WAITING) => ({
    id,
    name,
    isOnline,
    status
});

export const playerFromFirebase = (data) => {
    if (!data) return null;
    return createPlayer(data.id, data.name, data.isOnline, data.status);
};

export const createGameStats = (lines = 0, level = 1) => ({
    lines,
    level
});

export const playerStatsFromFirebase = (data) => {
    if (!data) return createInitialStats();
    
    return {
        lines: data.lines,
        level: data.level
    };
};

export const getReconnectPayload = () => ({ isOnline: true, status: PLAYER_STATUS.WAITING });
export const getDisconnectPayload = () => ({ isOnline: false, status: PLAYER_STATUS.WAITING });
export const createInitialStats = () => ({ ...INITIAL_PLAYER_STATS });