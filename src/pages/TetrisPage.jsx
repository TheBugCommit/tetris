import TetrisBoard from '../components/TetrisBoard';
import PlayerList from '../components/PlayerList';
import NextPiecePreview from '../components/NextPiecePreview';
import ToastNotification from '../components/ToastNotification';
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
    const showModal = isPaused || visualGameOver;

    return (
        <div className={styles.layout}>
            <div className={styles.overlay}></div>

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={`${styles.modalBox} ${visualGameOver ? styles.modalGameOver : styles.modalPaused}`}>
                        <h2 className={styles.modalTitle}>
                            {visualGameOver ? "GAME OVER" : "PAUSED"}
                        </h2>
                        {visualGameOver && (
                            <div className={styles.countDown}>{countDown}</div>
                        )}
                        {!visualGameOver && (
                            <p className={styles.modalSubtitle}>PRESS 'P' TO RESUME</p>
                        )}
                    </div>
                </div>
            )}

            <div className={styles.leftPanel}>
                <div className={styles.hudCard}>
                    <PlayerList />
                </div>
                <div className={`${styles.hudCard} ${styles.controlsCard}`}>
                    <div className={styles.controlsHelp}>
                        <p><span className={styles.key}><i class="fa-solid fa-arrows-left-right"></i></span> Move</p>
                        <p><span className={styles.key}><i class="fa-solid fa-arrow-up"></i></span> Rotate</p>
                        <p><span className={styles.key}><i class="fa-solid fa-arrow-down"></i></span> Drop</p>
                        <p>
                            <span className={styles.key}>
                                <i class="fa-solid fa-s"></i>
                                <i class="fa-solid fa-p"></i>
                                <i class="fa-solid fa-a"></i>
                                <i class="fa-solid fa-c"></i>
                                <i class="fa-solid fa-e"></i>
                            </span>
                            Hard Drop
                        </p>
                        <p><span className={styles.key}><i class="fa-solid fa-p"></i></span> Pause</p>
                    </div>
                </div>
            </div>

            <div className={styles.gameSection}>
                <h1 className={styles.title}>TETRIS</h1>

                <div className={styles.boardFrame}>
                    <TetrisBoard board={renderBoard} />
                    <div className={styles.boardGlow}></div>
                </div>
            </div>

            <div className={styles.rightPanel}>
                <div className={styles.hudCard}>
                    <NextPiecePreview piece={nextPiece} />
                </div>

                <div className={styles.statsGrid}>
                    <div className={styles.statBox}>
                        <div className={styles.statLabel}>LINES</div>
                        <div className={styles.statValue}>{lines}</div>
                    </div>
                    <div className={styles.statBox}>
                        <div className={styles.statLabel}>LEVEL</div>
                        <div className={styles.statValue}>{level}</div>
                    </div>
                </div>
            </div>
            <ToastNotification notification={notification} />
        </div>
    )
};

export default TetrisPage;