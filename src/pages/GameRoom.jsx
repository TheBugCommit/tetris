import TetrisBoard from '../components/TetrisBoard';
import { useGame } from '../contexts/GameContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayerList from '../components/PlayerList'

const GameRoom = () => {
    const navigate = useNavigate()
    const {
        isGameOver,
        isPaused,
        playerGameStats,
        setLines,
        setGameOver,
        togglePause
    } = useGame();

    const [countDown, setCountDown] = useState(null);

    useEffect(() => {
        if (isGameOver) {
            let timeLeft = 3;
            setCountDown(timeLeft);

            const timer = setInterval(() => {
                timeLeft--;
                setCountDown(timeLeft);

                if (timeLeft <= 0) {
                    clearInterval(timer);
                    setCountDown(null);
                    navigate('/lobby');
                }
            }, 1000);

            return () => clearInterval(timer);
        } else {
            setCountDown(null);
        }
    }, [isGameOver, navigate]);

   /* if (isGameOver) {
        return (
            <div className="game-over-overlay">
                <h1>GAME OVER</h1>
                <p>La partida ha finalitzat.</p>

                {countDown !== null && (
                    <div className="redirect-timer">
                        <h3>Tornant al Lobby en...</h3>
                        <div className="big-number">{countDown}</div>
                    </div>
                )}
            </div>
        );
    }*/

    return (
        <>
            <div className="layout">
                <div>
                    <h1 className="title">React Tetris</h1>
                    <TetrisBoard
                        paused={isPaused}
                        togglePause={togglePause}
                        gameOver={isGameOver}
                        setGameOver={setGameOver}
                        setLines={setLines}
                    />
                </div>

                <div className="panel">
                    {isPaused && <div className="banner pause">Paused</div>}
                    {isGameOver && <div className="banner over">Game Over</div>}
                    <div className="stat">Lines: {playerGameStats.lines}</div>
                    <div className="stat">Level: {playerGameStats.level}</div>
                    <div className="help">
                        <p>← → Move</p>
                        <p>↑ Rotate</p>
                        <p>↓ Drop</p>
                        <p>Space Hard drop</p>
                        <p>P Pause</p>
                    </div>
                    <PlayerList />
                </div>
            </div>
        </>
    );
};

export default GameRoom;