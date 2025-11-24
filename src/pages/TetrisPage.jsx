import { useState } from 'react';
import TetrisBoard from '../components/TetrisBoard';
import PlayerList from '../components/PlayerList';
import NextPiecePreview from '../components/NextPiecePreview';
import ToastManager from '../components/ToastManager';
import { useGameplay } from '../contexts/GameplayProvider';
import { useRoom } from '../contexts/RoomProvider';
import { useGameOverRedirect } from '../hooks/useGameOverRedirect';
import styles from './TetrisPage.module.css';

const TetrisPage = () => {
    const {
        lines, level, setLines, speed,
        garbagePending, consumeGarbage, notification
    } = useGameplay();
    const { isGameOver, isPaused, setGameOver, togglePause } = useRoom();
    const [nextPiecePrev, setNextPiecePrev] = useState(null);
    const { visualGameOver, countDown } = useGameOverRedirect(isGameOver);

    return (
        <div className={styles.layout}>
            <div className={styles.gameSection}>
                <h1 className={styles.title}>Tetris</h1>
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
            <div className={styles.panel}>
                {isPaused && !visualGameOver && <div className={`${styles.banner} ${styles.paused}`}>PAUSED</div>}
                {visualGameOver && 
                    <div className={`${styles.banner} ${styles.gameOver}`}>
                        GAME OVER
                        {countDown !== null && <span>({countDown})</span>}    
                    </div>}

                <NextPiecePreview piece={nextPiecePrev} />

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