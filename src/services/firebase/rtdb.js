import { ref, onValue, update, off, set, onDisconnect } from "firebase/database";
import { db } from "./config"

export function subscribeToGameState(onDataFunction) {
    const gameRef = ref(db, `room/gameState`);

    const handleDataChange = (snapshot) => {
        const data = snapshot.val();
        onDataFunction(data || { status: "WAITING", isPaused: false });
    };

    onValue(gameRef, handleDataChange);

    return function detachListener() {
        off(gameRef, "value", handleDataChange);
    };
}

// 2. ACCIÓ: START GAME (Escriu a la BD)
export function doStartGame() {
    const gameRef = ref(db, `room/gameState`);
    return update(gameRef, {
        status: "PLAYING",
        isPaused: false
    });
}

export function doTogglePause(currentPauseState) {
    const gameRef = ref(db, `room/gameState`);
    return update(gameRef, {
        isPaused: !currentPauseState
    });
}

export function joinRoom(playerName) {
    const userRef = ref(db, `room/players/${playerName}`);

    set(userRef, {
        name: playerName,
        score: 0
    });

    onDisconnect(userRef).remove() 
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