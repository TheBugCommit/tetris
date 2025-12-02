import { useState, useEffect } from 'react';
import * as gameService from "../services/gameService";

export const useRoomConnection = (user, showNotification) => {
    const [isJoined, setIsJoined] = useState(false);
    const [isLoading, setIsLoading] = useState(!!(user?.id && user?.name));

    useEffect(() => {
        if (!user.id || !user.name) {
            setIsLoading(false);
            return;
        }

        if (user.id && user.name) {
            let mounted = true;
            if (mounted) setIsLoading(true);

            const connect = async () => {
                try {
                    await gameService.joinRoom(user.id, user.name);
                    if (mounted) setIsJoined(true);
                } catch (error) {
                    showNotification("Connection to Lobby failed", "error")
                    console.error("Connection failed", error);
                } finally {
                    if (mounted) setIsLoading(false);
                }
            };
            connect();

            return () => { mounted = false; };
        }
    }, [user.id, user.name]);

    return { isJoined, isLoading };
};