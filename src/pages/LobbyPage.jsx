import { useRoom } from '../contexts/RoomProvider';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Ranking from '../components/Ranking';
import PlayerList from '../components/PlayerList';
import LastGame from '../components/LastGame';

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
    return <div className="lobby-container"><h1>La partida està en curs...</h1></div>;
  }

  return (
    <div className="lobby-container">
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>TETRIS MULTIPLAYER</h1>
        <h2 style={{ color: 'yellow', animation: 'blink 1s infinite' }}>
          PRESS ENTER TO START THE GAME
        </h2>
        <p>Estat actual: {isGameOver ? "Partida Finalitzada" : "Esperant Jugadors"}</p>
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>

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