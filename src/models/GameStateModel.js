import { GAME_STATUS } from "../constants/gameConstants";

export const createGameState = (status = GAME_STATUS.WAITING, isPaused = false) => ({
    status,
    isPaused
});

export const createWaitingState = () => createGameState(GAME_STATUS.WAITING, false);
export const createPlayingState = () => createGameState(GAME_STATUS.PLAYING, false);
export const createGameOverState = () => createGameState(GAME_STATUS.GAME_OVER, true);

export const gameStateFromFirebase = (data) => {
    return data || createWaitingState();
};