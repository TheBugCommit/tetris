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
      <header className={styles.header}>
        <h1>TETRIS MULTIPLAYER</h1>
        <h2 className={styles.blinkTitle}>
          PRESS ENTER TO START THE GAME
        </h2>
        <p>Actual State: {isGameOver ? "Game Over" : "Waiting Players..."}</p>
      </header>

      <div className={styles.panelsGrid}>
        <div className="panel">
          <LastGame />
          <PlayerList />
          <Ranking />
        </div>
      </div>

    </div>
  );
};

export default LobbyPage;