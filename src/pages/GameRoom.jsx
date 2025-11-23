import TetrisBoard from '../components/TetrisBoard';
import PlayerList from '../components/PlayerList'
import { useGameplay } from '../contexts/GameplayProvider';
import { useRoom } from '../contexts/RoomProvider';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import NextPiecePreview from '../components/NextPiecePreview';

const GameRoom = () => {
    const navigate = useNavigate()
    const {
        lines,
        level,
        setLines,
        speed,
        garbagePending,
        consumeGarbage,
        notification
    } = useGameplay()
    const {
        isGameOver,
        isPaused,
        setGameOver,
        togglePause
    } = useRoom();

    const [countDown, setCountDown] = useState(null);
    const [visualGameOver, setVisualGameOver] = useState(false);
    const [nextPiecePrev, setNextPiecePrev] = useState(null)
    const [showToast, setShowToast] = useState(null);
    const hasNavigatedRef = useRef(false); 

    useEffect(() => {
        if (notification) {
            setShowToast(notification);
            const timer = setTimeout(() => setShowToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    useEffect(() => {
        if (isGameOver) {
            setVisualGameOver(true);
        }
    }, [isGameOver]);


    useEffect(() => {
        if (visualGameOver) {
            // Si el contador no ha empezado (es null) y no hemos navegado...
            if (countDown === null && !hasNavigatedRef.current) {
                setCountDown(3);
            }

            // Si ya estamos navegando, no hacemos nada más
            if (hasNavigatedRef.current) return;

            const timer = setInterval(() => {
                setCountDown((prevCount) => {
                    // Si el contador llega a 1 (el siguiente tick sería 0)
                    if (prevCount <= 1) {
                        clearInterval(timer);
                        
                        // 2. ACTIVAMOS EL CERROJO INMEDIATAMENTE
                        if (!hasNavigatedRef.current) {
                            hasNavigatedRef.current = true;
                            navigate('/lobby');
                        }
                        return 0;
                    }
                    return prevCount - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [visualGameOver, navigate]); // countDown ya no es dependencia directa del effect

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
                        incomingGarbage={garbagePending}
                        onGarbageConsumed={consumeGarbage}
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
            {showToast && (
                <div className="toast-container">
                    <div className="toast-attack">
                        💣 {showToast.message}
                    </div>
                </div>
            )}
        </>
    );
};

export default GameRoom;