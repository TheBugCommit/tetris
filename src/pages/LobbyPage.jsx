import { useRoom } from '../contexts/RoomProvider';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Ranking from '../components/Ranking';
import PlayerList from '../components/PlayerList';
import LastGame from '../components/LastGame';
import styles from './LobbyPage.module.css'

const LobbyPage = () => {
  const navigate = useNavigate()
  const {
    isGameOver,
    isGamePlaying,
    isWaiting,
    startGame,
    setWaitingState,
  } = useRoom();

  useEffect(() => {
    setWaitingState(); 
  }, []);

  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (e.key === "Enter") {
        if (!isGamePlaying) {
          await startGame();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGameOver, startGame]);

  useEffect(() => {
    if (isGamePlaying) {
      navigate('/tetris');
    }
  }, [isGamePlaying, navigate]);


  if (isGamePlaying) {
    return <div className={styles.container}><h1>The game is in progress...</h1></div>;
  }

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