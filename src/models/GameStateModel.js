import { GAME_STATUS } from "../constants/gameConstants";

export class GameStateModel {
    constructor(status = GAME_STATUS.WAITING, isPaused = false) {
        this.status = status;
        this.isPaused = isPaused;
    }

    static createWaiting() {
        return new GameStateModel(GAME_STATUS.WAITING, false);
    }

    static createPlaying() {
        return new GameStateModel(GAME_STATUS.PLAYING, false);
    }

    static createGameOver() {
        return new GameStateModel(GAME_STATUS.GAME_OVER, true);
    }

    toFirebase() {
        return {
            status: this.status,
            isPaused: this.isPaused
        };
    }
}