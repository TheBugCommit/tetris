import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import * as gameService from "../services/gameService";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [playerName, setPlayerName] = useState(() => sessionStorage.getItem("activePlayerName") || "");
    const [playerId, setPlayerId] = useState(() => sessionStorage.getItem("activePlayerId") || "");
    const [isJoined, setIsJoined] = useState(false);

    const setPlayerInfo = useCallback((id, name) => {
        setPlayerName(name);
        setPlayerId(id);
        sessionStorage.setItem("activePlayerName", name);
        sessionStorage.setItem("activePlayerId", id);
    }, []);

    useEffect(() => {
        if (playerId && playerName) {
            let mounted = true;
            (async () => {
                try {
                    await gameService.joinRoom(playerId, playerName);
                    if (mounted) setIsJoined(true);
                } catch (error) {
                    console.error("Error joining room:", error);
                }
            })();
            return () => { mounted = false; };
        }
    }, [playerId, playerName]);

    const value = useMemo(() => ({
        playerId,
        playerName,
        isJoined,
        setPlayerInfo
    }), [playerId, playerName, isJoined, setPlayerInfo]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within UserProvider");
    return context;
};