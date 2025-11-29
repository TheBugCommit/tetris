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
    <div className={styles.container}>
      <div className={styles.overlay}></div>
      
      <header className={styles.header}>
        <h1 className={styles.mainTitle}>TETRIS <span className={styles.highlight}>MULTIPLAYER</span></h1>
        
        <div className={styles.statusBox}>
           <div className={`${styles.pulseDot} ${isGameOver ? styles.red : styles.green}`}></div>
           <p>{isGameOver ? "GAME OVER" : "WAITING FOR PLAYERS..."}</p>
        </div>

        <h2 className={styles.blinkTitle}>
          PRESS <span className={styles.key}>ENTER</span> TO START
        </h2>
      </header>

      <div className={styles.panelsGrid}>
        <div className={styles.card}>
          <PlayerList />
        </div>
        
        <div className={`${styles.card} ${styles.centerCard}`}>
          <LastGame />
        </div>
        
        <div className={styles.card}>
          <Ranking />
        </div>
      </div>

    </div>
  );
};

export default LobbyPage;