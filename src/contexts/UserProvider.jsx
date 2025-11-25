import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import * as gameService from "../services/gameService";
import StorageService from '../services/StorageService'

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = StorageService.getUser();
        return saved || { id: "", name: "" };
    });

    const [isJoined, setIsJoined] = useState(false);

    const setPlayerInfo = useCallback((id, name) => {
        setUser({ id, name });
        StorageService.setUser(id, name);
    }, []);

    useEffect(() => {
        if (user.id && user.name) {
            let mounted = true;
            (async () => {
                try {
                    await gameService.joinRoom(user.id, user.name);
                    if (mounted) setIsJoined(true);
                } catch (error) {
                    console.error("Error joining room:", error);
                }
            })();
            return () => { mounted = false; };
        }
    }, [user.id, user.name]);

    const value = useMemo(() => ({
        playerId: user.id,
        playerName: user.name,
        isJoined,
        setPlayerInfo
    }), [user, isJoined, setPlayerInfo]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within UserProvider");
    return context;
};