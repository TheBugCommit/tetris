import { useRoom } from '../contexts/RoomProvider';
import { useEffect } from 'react';
import Ranking from '../components/Ranking';
import PlayerList from '../components/PlayerList';
import LastGame from '../components/LastGame';
import styles from './LobbyPage.module.css'
import { useLobbyControls } from '../hooks/useLobbyControls';

const LobbyPage = () => {
  const {
    isGameOver,
    isGamePlaying,
    startGame,
    setWaitingState,
  } = useRoom();

  useEffect(() => {
    if (isGameOver) {
      setWaitingState();
    }
  }, [isGameOver]);

  useLobbyControls(startGame, isGamePlaying)

 return (
    <div className={`cyber-background ${styles.container}`}>
      <div className="cyber-overlay"></div>
      
      <header className={styles.header}>
        <h1 className={`neon-title ${styles.mainTitle}`}>
            TETRIS <span className={styles.highlight}>MULTIPLAYER</span>
        </h1>
        
        <div className={styles.statusBox}>
           <div className={`${styles.pulseDot} ${isGameOver ? styles.red : styles.green}`}></div>
           <p>{isGameOver ? "GAME OVER" : "WAITING FOR PLAYERS..."}</p>
        </div>

        <h2 className={styles.blinkTitle} style={{color: 'var(--text-muted)', fontSize: '1.2rem'}}>
          PRESS <span className="key-cap">ENTER</span> TO START
        </h2>
      </header>

      <div className={styles.panelsGrid}>
        <div className={`glass-panel ${styles.gridItem}`}>
          <PlayerList />
        </div>
        
        <div className={`glass-panel ${styles.gridItem} ${styles.centerCard}`}>
          <LastGame />
        </div>
        
        <div className={`glass-panel ${styles.gridItem}`}>
          <Ranking />
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;