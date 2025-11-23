import { ref, onValue, update, off, set, onDisconnect, get, child } from "firebase/database";
import { db } from "./config";

const ROOM_ID = "room";
const GAME_STATE_REF = ref(db, `${ROOM_ID}/gameState`);
const PLAYERS_REF = ref(db, `${ROOM_ID}/players`);
const RESULTS_REF = ref(db, `${ROOM_ID}/lastGameResults`);

export function subscribeToGameState(onDataFunction) {
    const handleDataChange = (snapshot) => {
        const data = snapshot.val();
        onDataFunction(data || { status: "WAITING", isPaused: false });
    };

    onValue(GAME_STATE_REF, handleDataChange);
    return () => off(GAME_STATE_REF, "value", handleDataChange);
}

export async function doStartGame() {
    const roomRef = ref(db, `${ROOM_ID}/`);
    const snapshot = await get(child(roomRef, "players"));

    if (!snapshot.exists()) return;

    const playersData = snapshot.val();
    const updates = {};

    updates[`${ROOM_ID}/gameState/status`] = "PLAYING";
    updates[`${ROOM_ID}/gameState/isPaused`] = false;
    
    updates[`${ROOM_ID}/lastGameResults`] = null;

    Object.keys(playersData).forEach(playerId => {
        if (!playersData[playerId].isOnline) {
            updates[`${ROOM_ID}/players/${playerId}`] = null;
        } else {
            updates[`${ROOM_ID}/players/${playerId}/gameStats/lines`] = 0;
            updates[`${ROOM_ID}/players/${playerId}/gameStats/level`] = 1;
        }
    });

    return update(ref(db), updates);
}

export function setGameToWaiting() {
    return update(GAME_STATE_REF, {
        status: "WAITING",
        isPaused: false
    });
}

export async function doGameOver() {
    const playersRef = ref(db, `${ROOM_ID}/players`);
    
    try {
        const snapshot = await get(playersRef);
        
        if (snapshot.exists()) {
            const currentPlayersData = snapshot.val();
            const updates = {};
            
            updates[`${ROOM_ID}/gameState/status`] = "GAME_OVER";
            updates[`${ROOM_ID}/gameState/isPaused`] = true;
            
            updates[`${ROOM_ID}/lastGameResults`] = currentPlayersData;

            return update(ref(db), updates);
        } else {
            return update(ref(db, `${ROOM_ID}/gameState`), { status: "GAME_OVER" });
        }
    } catch (error) {
        console.error("Error finalitzant la partida:", error);
    }
}

export function togglePause(currentPauseState) {
    return update(GAME_STATE_REF, {
        isPaused: !currentPauseState
    });
}

export async function joinRoom(playerId, playerName) {
    const playersRef = ref(db, `${ROOM_ID}/players/${playerId}`);

    const snapshot = await get(playersRef);
    onDisconnect(playersRef).update({ isOnline: false });

    if (snapshot.exists()) {
        console.log(`Re-connectant a ${playerName}...`);
        return update(playersRef, { 
            isOnline: true 
        });
    } else {
        console.log(playerId, playerName)
        return update(playersRef, {
            id: playerId,
            name: playerName,
            isOnline: true,
            gameStats: {
                lines: 0,
                level: 1
            },
        });
    }
}

export function subscribeToPlayers(onPlayersChange) {
    const handleData = (snapshot) => {
        const data = snapshot.val();
        const playersList = data ? Object.values(data) : [];
        onPlayersChange(playersList);
    };

    onValue(PLAYERS_REF, handleData);
    return () => off(PLAYERS_REF, "value", handleData);
}

export function subscribeToLastResults(onDataChange) {
    const handleData = (snapshot) => {
        const data = snapshot.val();
        const list = data ? Object.values(data) : [];
        onDataChange(list);
    };

    onValue(RESULTS_REF, handleData);
    return () => off(RESULTS_REF, "value", handleData);
}

export function clearGameResults() {
     set(RESULTS_REF, null);
}

export function updatePlayerStats(playerId, stats) {
    const playerStatsRef = ref(db, `${ROOM_ID}/players/${playerId}/gameStats`);
    update(playerStatsRef, stats);
}