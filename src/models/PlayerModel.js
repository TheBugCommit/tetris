import { INITIAL_PLAYER_STATS } from "../constants/gameConstants";

export class PlayerModel {
    constructor(id, name, isOnline = true, gameStats = INITIAL_PLAYER_STATS) {
        this.id = id;
        this.name = name;
        this.isOnline = isOnline;
        this.gameStats = gameStats;
    }

    static createNew(id, name) {
        return new PlayerModel(id, name);
    }

    static fromFirebase(data) {
        if (!data) return null;
        return new PlayerModel(data.id, data.name, data.isOnline, data.gameStats);
    }

    toFirebase() {
        return {
            id: this.id,
            name: this.name,
            isOnline: this.isOnline,
            gameStats: this.gameStats
        };
    }

    static getReconnectPayload() {
        return { isOnline: true };
    }

    static getDisconnectPayload() {
        return { isOnline: false };
    }
}