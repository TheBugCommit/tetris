import TetrisBoard from '../components/TetrisBoard';
import PlayerList from '../components/PlayerList'
import { useGameplay } from '../contexts/GameplayProvider';
import { useRoom } from '../contexts/RoomProvider';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NextPiecePreview from '../components/NextPiecePreview';

const GameRoom = () => {
    const navigate = useNavigate()
    const { lines, level, setLines, speed } = useGameplay()
    const {
        isGameOver,
        isPaused,
        setGameOver,
        togglePause
    } = useRoom();

    const [countDown, setCountDown] = useState(null);
    const [visualGameOver, setVisualGameOver] = useState(false);
    const [nextPiecePrev, setNextPiecePrev] = useState(null)

    useEffect(() => {
        if (isGameOver) {
            setVisualGameOver(true);
        }
    }, [isGameOver]);

    useEffect(() => {
        if (visualGameOver) {
            if (countDown !== null && countDown !== 3) return;

            let timeLeft = 3;
            setCountDown(timeLeft);

            const timer = setInterval(() => {
                timeLeft--;
                setCountDown(timeLeft);

                if (timeLeft <= 0) {
                    clearInterval(timer);
                    navigate('/lobby');
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [visualGameOver, navigate]);

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
                        onNextPieceChange={setNextPiecePrev}
                        speed={speed}
                    />
                </div>

                <div className="panel">
                    {isPaused && !visualGameOver && <div className="banner pause">Paused</div>}
                    {visualGameOver && (
                        <div className="banner over">
                            Game Over
                            {countDown !== null && <span style={{ marginLeft: '10px' }}>({countDown})</span>}
                        </div>
                    )}
                    <NextPiecePreview piece={nextPiecePrev} />
                    <div className="stat">Lines: {lines}</div>
                    <div className="stat">Level: {level}</div>
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