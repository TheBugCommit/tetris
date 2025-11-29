import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import storageService from '../services/storageService'
import { useRoomConnection } from '../hooks/useRoomConnection';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = storageService.getUser();
        return saved || { id: "", name: "" };
    });

    const isJoined = useRoomConnection(user);

    const setPlayerInfo = useCallback((id, name) => {
        setUser({ id, name });
        storageService.setUser(id, name);
    }, []);

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