import { useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useUser } from "../contexts/UserProvider";
import styles from './LoginPage.module.css'
import RecentNames from "../components/RecentNames";
import { useRecentNames } from "../hooks/useRecentNames";

const LoginPage = () => {
  const inputRef = useRef("");

  const { setPlayerInfo } = useUser();
  const [_, addName] = useRecentNames();
  const [error, setError] = useState("");

  const loginUser = (name) => {
    if (!name) return;
    const newPlayerId = uuidv4();

    addName(name);
    setPlayerInfo(newPlayerId, name);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = inputRef.current.value.trim();
    setError(!val || val.length < 3 ? "Name must be at least 3 charaters" : "")
    loginUser(val);
  };

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
          <p>{error}</p>
          <button type="submit" className={styles.button}>Start Game</button>
        </form>

        <RecentNames onSelectName={loginUser} />
      </div>
    </div>
  );
};

export default LoginPage;