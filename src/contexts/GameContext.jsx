import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { doStartGame, doTogglePause, subscribeToGameState, joinRoom, subscribeToPlayers, doGameOver, doInLobby, clearGameResults, saveGameResults, subscribeToLastResults } from "../services/firebase/rtdb"

const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [players, setPlayers] = useState([]);
    const [gameState, setGameState] = useState({ status: "WAITING", isPaused: false, players: [] });
    const [playerName, setPlayerName] = useState(() => sessionStorage.getItem("activePlayerName") || "");
    const [countDown, setCountDown] = useState(null);
    const [lastResults, setLastResults] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const detachResults = subscribeToLastResults((data) => setLastResults(data));
        return () => detachResults();
    }, []);

    useEffect(() => {
        if (gameState.status === "GAME_OVER") {

            let timeLeft = 3;
            setCountDown(timeLeft);

            const timer = setInterval(() => {
                timeLeft--;
                setCountDown(timeLeft);

                if (timeLeft <= 0) {
                    clearInterval(timer);
                    setCountDown(null);
                    doInLobby();
                    navigate('/lobby');
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [gameState, navigate]);

    useEffect(() => {
        const onDataUpdate = (data) => setGameState(data)
        const detachListener = subscribeToGameState(onDataUpdate);
        return () => detachListener();
    }, []);

    useEffect(() => {
        if (playerName) {
            sessionStorage.setItem("activePlayerName", playerName);
        } else {
            sessionStorage.removeItem("activePlayerName");
        }

        if (!playerName) return;

        joinRoom(playerName);

        const detachPlayers = subscribeToPlayers((updatedPlayers) => setPlayers(updatedPlayers));

        return () => detachPlayers();

    }, [playerName]);

    const value = {
        status: gameState.status,
        isPaused: gameState.isPaused,
        lastResults,
        countDown,
        players,
        gameOver: () => { saveGameResults(players); doGameOver(); },
        startGame: async () => { clearGameResults(); await doStartGame(); },
        togglePause: doTogglePause,
        setPlayerName,
        playerName,
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
    return useContext(GameContext);
};