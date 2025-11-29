import { useState, useEffect, useCallback } from 'react';
import * as gameService from "../services/gameService";

export const useGameAttacks = (playerId, isJoined, isGamePlaying, showNotification) => {
    const [garbagePending, setGarbagePending] = useState(0);

    useEffect(() => {
        if (!playerId || !isJoined || !isGamePlaying) return;

        const unsubscribe = gameService.subscribeToIncomingAttacks(playerId, (lines, senderName) => {
            setGarbagePending(prev => prev + lines);
            showNotification(`Attack from ${senderName}: +${lines} lines!`, 'warning');
        });

        return () => unsubscribe();
    }, [playerId, isJoined, isGamePlaying]);

    const consumeGarbage = useCallback(() => {
        setGarbagePending(0);
    }, []);

    return { garbagePending, consumeGarbage };
};