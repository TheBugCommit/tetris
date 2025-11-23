import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../contexts/UserProvider';

const RequireName = () => {
    const { playerName } = useUser();

    if (!playerName || playerName.trim() === "") {
        return <Navigate to="/" replace />
    }

    return <Outlet />;
};

export default RequireName;