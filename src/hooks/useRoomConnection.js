import { useState, useEffect } from 'react';
import * as gameService from "../services/gameService";

export const useRoomConnection = (user, showNotification) => {
    const [isJoined, setIsJoined] = useState(false);

    useEffect(() => {
        if (user.id && user.name) {
            let mounted = true;
            
            const connect = async () => {
                try {
                    await gameService.joinRoom(user.id, user.name);
                    if (mounted) setIsJoined(true);
                } catch (error) {
                    showNotification("Connection to Lobby failed", "error")
                    console.error("Connection failed", error);
                }
            };
            connect();

            return () => { mounted = false; };
        }
    }, [user.id, user.name]);

    return isJoined;
};