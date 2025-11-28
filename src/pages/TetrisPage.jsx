import { useEffect, useState } from 'react';
import TetrisBoard from '../components/TetrisBoard';
import PlayerList from '../components/PlayerList';
import NextPiecePreview from '../components/NextPiecePreview';
import ToastManager from '../components/ToastManager';
import { useGameplay } from '../contexts/GameplayProvider';
import { useRoom } from '../contexts/RoomProvider';
import { useGameOverRedirect } from '../hooks/useGameOverRedirect';
import styles from './TetrisPage.module.css';
import { useTetris } from '../hooks/useTetris';
import { useKeyboardControls } from '../hooks/useKeyboardControls';

const TetrisPage = () => {
    const {
        lines, level, setLines, speed,
        garbagePending, consumeGarbage, notification
    } = useGameplay();
    const { isGameOver, isPaused, setGameOver, togglePause } = useRoom();
    const { visualGameOver, countDown } = useGameOverRedirect(isGameOver);

    const { nextPiece, actions, getRenderBoard } = useTetris({
        speed,
        gameOver: isGameOver,
        paused: isPaused,
        setGameOver,
        setLines,
        incomingGarbage: garbagePending,
        onGarbageConsumed: consumeGarbage
    });

    useKeyboardControls(
        { ...actions, togglePause },
        !isGameOver, 
        isPaused
    );

    const renderBoard = getRenderBoard(); 

    return (
        <div className={styles.layout}>
            <div className={styles.gameSection}>
                <h1 className={styles.title}>Tetris</h1>
                <TetrisBoard board={renderBoard} />
            </div>
            <div className={styles.panel}>
                {isPaused && !visualGameOver && <div className={`${styles.banner} ${styles.paused}`}>PAUSED</div>}
                {visualGameOver && 
                    <div className={`${styles.banner} ${styles.gameOver}`}>
                        GAME OVER
                        {countDown !== null && <span>({countDown})</span>}    
                    </div>}

                <NextPiecePreview piece={nextPiece} />

                <div className={styles.statBox}>
                    <div className={styles.statLabel}>Lines</div>
                    <div className={styles.statValue}>{lines}</div>
                </div>
                <div className={styles.statBox}>
                    <div className={styles.statLabel}>Level</div>
                    <div className={styles.statValue}>{level}</div>
                </div>

                <div className={styles.controlsHelp}>
                    <p><span className={styles.key}>← →</span> Move</p>
                    <p><span className={styles.key}>↑</span> Rotate</p>
                    <p><span className={styles.key}>↓</span> Drop</p>
                    <p><span className={styles.key}>Space</span> Hard drop</p>
                    <p><span className={styles.key}>P</span> Pause</p>
                </div>

                <PlayerList />
            </div>
            <ToastManager notification={notification} />
        </div>
    )
};

export default TetrisPage;