import { INITIAL_PLAYER_STATS } from "../constants/gameConstants";

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

export const getReconnectPayload = () => ({ isOnline: true });
export const getDisconnectPayload = () => ({ isOnline: false });