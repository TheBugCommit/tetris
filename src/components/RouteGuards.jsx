import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserProvider';
import { useRoom } from '../contexts/RoomProvider';

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
    const { isWaiting } = useRoom();

    if (isWaiting) {
        return <Navigate to="/lobby" replace />;
    }
    return <Outlet />;
};

export const LobbyGuard = () => {
    const { isGamePlaying } = useRoom();

    if (isGamePlaying) {
        return <Navigate to="/tetris" replace />;
    }
    return <Outlet />;
};