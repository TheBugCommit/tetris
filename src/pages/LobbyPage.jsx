import { useRoom } from '../contexts/RoomProvider';
import HistoryRanking from '../components/HistoryRanking';
import PlayerList from '../components/PlayerList';
import LastGame from '../components/LastGame';
import styles from './LobbyPage.module.css'
import { useLobbyControls } from '../hooks/useLobbyControls';

const LobbyPage = () => {
  const {
    isGamePlaying,
    startGame,
    isParticipating,
  } = useRoom();

  useLobbyControls(startGame, isGamePlaying)

  const getStatusText = () => {
    if (isGamePlaying && !isParticipating) return "GAME IN PROGRESS";
    return "WAITING FOR PLAYERS...";
  };

  return (
    <div className={`cyber-background ${styles.container}`}>
      <div className="cyber-overlay"></div>

      <header className={styles.header}>
        <h1 className={`neon-title ${styles.mainTitle}`}>
          TETRIS <span className="text-highlight">MULTIPLAYER</span>
        </h1>

        <div className={styles.statusBox}>
          <div className={`${styles.pulseDot} ${isGamePlaying ? styles.red : styles.green}`}></div>
          <p>{getStatusText()}</p>
        </div>

        {!isGamePlaying && (
          <h2 className="press-start-text">
            PRESS <span className="key-cap">ENTER</span> TO START
          </h2>
        )}
      </header>

      <div className={styles.panelsGrid}>
        <div className={`glass-panel ${styles.gridItem}`}>
          <PlayerList />
        </div>

        <div className={`glass-panel ${styles.gridItem} ${styles.centerCard}`}>
          <LastGame />
        </div>

        <div className={`glass-panel ${styles.gridItem}`}>
          <HistoryRanking />
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;