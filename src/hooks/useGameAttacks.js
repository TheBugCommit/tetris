import { useState, useEffect, useCallback } from 'react';
import * as gameService from "../services/gameService";

export const useGameAttacks = (playerId, isJoined, isGamePlaying) => {
    const [garbagePending, setGarbagePending] = useState(0);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (!playerId || !isJoined || !isGamePlaying) return;

        const unsubscribe = gameService.subscribeToIncomingAttacks(playerId, (lines, senderName) => {
            setGarbagePending(prev => prev + lines);
            setNotification({
                id: Date.now(),
                message: `⚠️ Ataque de ${senderName}: +${lines} líneas!`
            });
        });

        return () => unsubscribe();
    }, [playerId, isJoined, isGamePlaying]);

    const consumeGarbage = useCallback(() => {
        setGarbagePending(0);
    }, []);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    return { garbagePending, notification, consumeGarbage };
};