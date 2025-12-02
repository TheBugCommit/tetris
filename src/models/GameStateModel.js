export const GAME_STATUS = {
    PLAYING: "PLAYING",
    GAME_OVER: "GAME_OVER",
};

export const createGameState = (status = GAME_STATUS.GAME_OVER, isPaused = true) => ({
    status,
    isPaused
});

export const createPlayingState = () => createGameState(GAME_STATUS.PLAYING, false);
export const createGameOverState = () => createGameState(GAME_STATUS.GAME_OVER, true);

export const gameStateFromFirebase = (data) => {
    return data || createGameOverState();
};