import { Navigate, Outlet } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';

const RequireName = () => {
    const { playerName } = useGame();

    if (!playerName || playerName.trim() === "") {
        return <Navigate to="/" replace />
    }

    return <Outlet />;
};

export default RequireName;