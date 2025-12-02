import { useUser } from "../contexts/UserProvider";
import LoadingScreen from "./LoadingScreen";

const GameLoader = ({ children }) => {
    const { isLoading } = useUser();

    if (isLoading) {
        return <LoadingScreen />;
    }

    return children;
};

export default GameLoader;