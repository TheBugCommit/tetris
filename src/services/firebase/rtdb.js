import { ref, onValue, update, off, set, onDisconnect, get, child, onChildAdded, push, remove } from "firebase/database";
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
        isPaused: currentPauseState
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

// 1. ENVIAR ATAQUE (El cliente escribe en el buzón de los OTROS)
export async function sendAttackToOthers(myPlayerId, myName, linesToSend, allPlayers) {
    if (!allPlayers || linesToSend <= 0) return;

    const updates = {};
    
    // Recorremos todos los jugadores
    allPlayers.forEach(player => {
        // No nos atacamos a nosotros mismos ni a los desconectados
        if (player.id !== myPlayerId && player.isOnline) {
            // Generamos una ID única para este ataque
            const newAttackKey = push(child(ref(db), `${ROOM_ID}/players/${player.id}/incomingAttacks`)).key;
            
            // Preparamos el paquete de ataque
            const attackData = {
                sender: myName,
                lines: linesToSend,
                timestamp: Date.now()
            };

            // Añadimos la actualización a la lista batch
            updates[`${ROOM_ID}/players/${player.id}/incomingAttacks/${newAttackKey}`] = attackData;
        }
    });

    // Ejecutamos todas las escrituras a la vez (Atomic Update)
    return update(ref(db), updates);
}

// 2. RECIBIR Y CONSUMIR (Escuchamos nuestro buzón)
export function subscribeToIncomingAttacks(myPlayerId, onAttackReceived) {
    const myAttacksRef = ref(db, `${ROOM_ID}/players/${myPlayerId}/incomingAttacks`);

    // onChildAdded se dispara una vez por cada ataque nuevo que entra
    const unsub = onChildAdded(myAttacksRef, (snapshot) => {
        const attackId = snapshot.key;
        const attackData = snapshot.val();

        if (attackData) {
            console.log(`Ataque recibido de ${attackData.sender}: ${attackData.lines} líneas`);
            
            // 1. Ejecutamos la acción visual en el juego
            onAttackReceived(attackData.lines, attackData.sender);

            // 2. CONSUMIMOS EL ATAQUE (Lo borramos para no procesarlo nunca más)
            // Esto asegura el "procesar solo 1 vez"
            remove(ref(db, `${ROOM_ID}/players/${myPlayerId}/incomingAttacks/${attackId}`));
        }
    });

    return () => unsub(); // Devolvemos la función para desuscribirnos
}