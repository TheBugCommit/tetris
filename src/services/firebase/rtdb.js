import { ref, onValue, update, off, set, onDisconnect, get, child } from "firebase/database";
import { db } from "./config"

const gameRef = ref(db, `room/gameState`);

export function subscribeToGameState(onDataFunction) {
    const handleDataChange = (snapshot) => {
        const data = snapshot.val();
        onDataFunction(data || { status: "WAITING", isPaused: false });
    };

    onValue(gameRef, handleDataChange);

    return function detachListener() {
        off(gameRef, "value", handleDataChange);
    };
}

export async function doStartGame() {
    const roomRef = ref(db, `room/`);
    const snapshot = await get(child(roomRef, "players"));

    if (!snapshot.exists()) return;

    const playersData = snapshot.val();
    
    const updates = {};

    updates[`room/gameState/status`] = "PLAYING";
    updates[`room/gameState/isPaused`] = false;

    Object.keys(playersData).forEach(playerName => {
        console.log(playersData[playerName])
        if(!playersData[playerName].isOnline)
            updates[`room/players/${playerName}`] = null;
        else
            updates[`room/players/${playerName}/score`] = 0;
    });

    updates[`room/lastGameResults`] = null;

    return update(ref(db), updates);
}

export function doInLobby() {
    return update(gameRef, {
        status: "WAITING",
        isPaused: false
    });
}

export function doGameOver() {
    return update(gameRef, {
        status: "GAME_OVER",
        isPaused: true
    });
}

export function doTogglePause(currentPauseState) {
    return update(gameRef, {
        isPaused: !currentPauseState
    });
}

export function joinRoom(playerName) {
    const userRef = ref(db, `room/players/${playerName}`);

    set(userRef, {
        name: playerName,
        score: 0,
        isOnline: true
    });

    onDisconnect(userRef).update({ isOnline: false })
}

export function subscribeToPlayers(onPlayersChange) {
    const playersRef = ref(db, `room/players`);

    const handleData = (snapshot) => {
        const data = snapshot.val();
        const playersList = data ? Object.values(data) : [];
        onPlayersChange(playersList);
    };

    onValue(playersRef, handleData);

    return () => off(playersRef, "value", handleData);
}

export function saveGameResults(playersList) {
    const resultsRef = ref(db, `room/lastGameResults`);
    set(resultsRef, playersList);
}

export function subscribeToLastResults(onDataChange) {
    const resultsRef = ref(db, `room/lastGameResults`);
    
    const handleData = (snapshot) => {
        const data = snapshot.val();
        // Si data és un objecte, el convertim a array, si no, array buit
        const list = data ? Object.values(data) : [];
        onDataChange(list);
    };

    onValue(resultsRef, handleData);
    return () => off(resultsRef, "value", handleData);
}

export function clearGameResults() {
     const resultsRef = ref(db, `room/lastGameResults`);
     set(resultsRef, null);
}

export function removeOfflinePlayers() {
    const playersRef = ref(db, `room/players`);

    // Aquí podries decidir esborrar els que porten offline molta estona,
    // però el més fàcil és posar score a 0 i isAlive a true per tothom.
    // O millor: Esborrar els offline i resetjear els online.

    // Per simplificar, només resetegem puntuacions:
    // Nota: Això requeriria iterar, però per fer-ho simple, 
    // assumim que els clients actualitzen el seu propi estat al Start.
}