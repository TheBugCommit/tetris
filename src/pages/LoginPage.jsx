import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { useUser } from "../contexts/UserProvider";
import styles from './LoginPage.module.css'
import RecentNames from "../components/RecentNames";

const LoginPage = () => {
  const inputRef = useRef("");

  const navigate = useNavigate();
  const { setPlayerInfo } = useUser();

  const loginUser = (name) => {
    const newPlayerId = uuidv4();
    setPlayerInfo(newPlayerId, name);
    navigate("/lobby");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputRef.current.value.trim()) return;
    loginUser(inputRef.current.value);
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
          <button type="submit" className={styles.button}>Start Game</button>
        </form>

        <RecentNames onSelectName={loginUser} />
      </div>
    </div>
  );
};

export default LoginPage;