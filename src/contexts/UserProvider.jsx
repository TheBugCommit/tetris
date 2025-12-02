import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import storageService from '../services/storageService'
import { useRoomConnection } from '../hooks/useRoomConnection';
import * as PlayerModel from "../models/PlayerModel";
import { useNotification } from '../hooks/useNotification';
import { v4 as uuidv4 } from 'uuid';
import { useRecentNames } from '../hooks/useRecentNames';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = storageService.getUser();
        return saved || PlayerModel.createPlayer("", "", false);
    });

    const { notification, showNotification } = useNotification();
    const { isJoined, isLoading } = useRoomConnection(user, showNotification);
    const { addName } = useRecentNames();

    const setPlayerInfo = useCallback((name) => {
        const newPlayerId = uuidv4();
        const newPlayerLocal = PlayerModel.createPlayer(newPlayerId, name, true);
        setUser(newPlayerLocal);
        storageService.setUser(newPlayerLocal);
        addName(name)
    }, []);

    const value = useMemo(() => ({
        playerId: user.id,
        playerName: user.name,
        isJoined,
        isLoading,
        setPlayerInfo,
        notification
    }), [user, isJoined, isLoading, setPlayerInfo]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within UserProvider");
    return context;
};