import { useState } from 'react';
import TetrisBoard from '../components/TetrisBoard';
import PlayerList from '../components/PlayerList';
import NextPiecePreview from '../components/NextPiecePreview';
import ToastManager from '../components/ToastManager'; // Nuevo
import { useGameplay } from '../contexts/GameplayProvider';
import { useRoom } from '../contexts/RoomProvider';
import { useGameOverRedirect } from '../hooks/useGameOverRedirect'; // Nuevo hook

const GameRoom = () => {
    const { 
        lines, level, setLines, speed, 
        garbagePending, consumeGarbage, notification 
    } = useGameplay();
    const { isGameOver, isPaused, setGameOver, togglePause } = useRoom();
    const [nextPiecePrev, setNextPiecePrev] = useState(null);
    const { visualGameOver, countDown } = useGameOverRedirect(isGameOver);

    return (
        <>
            <div className="layout">
                {/* SECCIÓN PRINCIPAL: TABLERO */}
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

                {/* SECCIÓN LATERAL: PANEL */}
                <div className="panel">
                    {/* Banners de estado */}
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

                    {/* Al usar React.memo dentro de PlayerList, esto ya no es pesado */}
                    <PlayerList />
                </div>
            </div>

            {/* COMPONENTE DE TOAST AISLADO */}
            <ToastManager notification={notification} />
        </>
    );
};

export default GameRoom;