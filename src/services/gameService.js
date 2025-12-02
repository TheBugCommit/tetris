import { ref, onValue, update, off, set, onDisconnect, get, onChildAdded, push, remove } from "firebase/database";
import { db } from "../persistance/firebase";
import * as helpers from "../helpers/firebaseHelpers";
import * as PlayerModel from "../models/PlayerModel";
import { DB_PATHS } from "../config/firebase";

function createSubscription(path, mapper, callback) {
    const dbRef = ref(db, path);
    const handleData = (snapshot) => callback(mapper(snapshot.val()));
    onValue(dbRef, handleData);
    return () => off(dbRef, "value", handleData);
}

export function subscribeToGameState(callback) {
    return createSubscription(DB_PATHS.gameState, helpers.mapGameState, callback);
}

export function subscribeToPlayers(callback) {
    return createSubscription(DB_PATHS.players, helpers.mapPlayersList, callback);
}

export function subscribeToLastResults(callback) {
    return createSubscription(DB_PATHS.lastResults, helpers.mapLastResults, callback);
}

export function subscribeToPlayersStats(callback) {
    return createSubscription(DB_PATHS.allPlayersStats, (data) => data, callback);
}

export function subscribeToMyStats(playerId, callback) {
    return createSubscription(DB_PATHS.playerStats(playerId), (data) => PlayerModel.playerStatsFromFirebase(data), callback);
}


export async function doStartGame() {
    const snapshot = await get(ref(db, DB_PATHS.players)); helpers.mapPlayersStats
    if (!snapshot.exists()) return;
    return update(ref(db), helpers.buildStartGameUpdates(snapshot.val()));
}

export async function doGameOver() {
    try {
        const snapshot = await get(ref(db, DB_PATHS.players));
        const statsSnap = await get(ref(db, DB_PATHS.allPlayersStats));

        return update(ref(db), helpers.buildGameOverUpdates(snapshot.val(), statsSnap.val()));
    } catch (e) { console.error(e); }
}

export function togglePause(currentPauseState) {
    return update(ref(db, DB_PATHS.gameState),
        { isPaused: !currentPauseState }
    );
}

export async function joinRoom(playerId, playerName) {
    const playerRef = ref(db, DB_PATHS.player(playerId));
    const statsRef = ref(db, DB_PATHS.playerStats(playerId));
    const snapshot = await get(playerRef);

    onDisconnect(playerRef).update(PlayerModel.getDisconnectPayload());
    onDisconnect(statsRef).remove();

    await remove(statsRef);

    if (snapshot.exists()) {
        return update(playerRef, PlayerModel.getReconnectPayload());
    } else {
        const newPlayer = PlayerModel.createPlayer(playerId, playerName);
        return update(playerRef, newPlayer);
    }
}

export function updatePlayerStats(playerId, stats) {
    update(ref(db, DB_PATHS.playerStats(playerId)), stats);
}

export async function sendAttackToOthers(myId, myName, lines, allPlayers) {
    if (!allPlayers || lines <= 0) return;
    const keyGen = () => push(ref(db)).key;
    const updates = helpers.buildAttackUpdates(allPlayers, myId, myName, lines, keyGen);
    return update(ref(db), updates);
}

export function subscribeToIncomingAttacks(myPlayerId, onAttackReceived) {
    const path = DB_PATHS.playerAttacks(myPlayerId);

    const unsub = onChildAdded(ref(db, path), (snapshot) => {
        const attackKey = snapshot.key;
        const attackData = helpers.mapIncomingAttack(snapshot.val());

        if (attackData && attackData.lines) {
            onAttackReceived(attackData.lines, attackData.sender);
            remove(ref(db, `${path}/${attackKey}`));
        }
    });

    return () => unsub();
}

export function clearGameResults() {
    set(ref(db, DB_PATHS.lastResults), null);
}