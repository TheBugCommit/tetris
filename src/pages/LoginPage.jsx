import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { useUser } from "../contexts/UserProvider";
import styles from './LoginPage.module.css'
import RecentNames from "../components/RecentNames";
import { useRecentNames } from "../hooks/useRecentNames";

const LoginPage = () => {
  const inputRef = useRef("");
  const navigate = useNavigate();
  
  const { setPlayerInfo, isJoined } = useUser();
  const [_, addName] = useRecentNames();

  const loginUser = (name) => {
    if (!name) return;
    const newPlayerId = uuidv4();

    setPlayerInfo(newPlayerId, name);
    addName(name);
    navigate("/lobby", { replace: true });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = inputRef.current.value.trim();
    if (!val) return;
    loginUser(val);
  };

  useEffect(() => {
    if(isJoined)
      navigate('/lobby', { replace: true })
  }, [isJoined])

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Tetris Multiplayer</h1>
        <form onSubmit={handleSubmit}>
          <input
            className={styles.input}
            ref={inputRef}
            placeholder="Enter your name..."
          />
          <button type="submit" className={styles.button}>Start Game</button>
        </form>

        <RecentNames onSelectName={loginUser} />
      </div>
    </div>
  );
};

export default LoginPage;