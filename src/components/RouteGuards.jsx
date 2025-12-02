import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserProvider';
import { useRoom } from '../contexts/RoomProvider';
import { PLAYER_STATUS } from '../models/PlayerModel';

export const RequireAuth = () => {
    const { isJoined } = useUser();
    const location = useLocation();

    if (!isJoined) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }
    return <Outlet />;
};

export const PublicOnlyRoute = () => {
    const { isJoined } = useUser();
    const { isGamePlaying } = useRoom();

    if (isJoined) {
        if (isGamePlaying) {
            return <Navigate to="/tetris" replace />;
        }
        return <Navigate to="/lobby" replace />;
    }
    return <Outlet />;
};

export const GameGuard = () => {
    const { players, isGameOver, isGamePlaying } = useRoom();
    const { playerId } = useUser();
    
    if (isGameOver) {
        return <Outlet />;
    }

    if (isGamePlaying && players.length === 0) {
        return <LoadingScreen />;
    }

    const me = players.find(p => p.id === playerId);
    const amIPlaying = me?.status === PLAYER_STATUS.PLAYING;

    if (!amIPlaying) {
        return <Navigate to="/lobby" replace />;
    }

    return <Outlet />;
};

export const LobbyGuard = () => {
    const { isGamePlaying, players } = useRoom();
    const { playerId } = useUser();

    if (isGamePlaying && players.length === 0) {
        return <LoadingScreen />;
    }

    const me = players.find(p => p.id === playerId);
    const amIPlaying = me?.status === PLAYER_STATUS.PLAYING;

    if (isGamePlaying && amIPlaying) {
        return <Navigate to="/tetris" replace />;
    }
    return <Outlet />;
};