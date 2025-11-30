import { useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useUser } from "../contexts/UserProvider";
import styles from './LoginPage.module.css'
import RecentNames from "../components/RecentNames";
import { useRecentNames } from "../hooks/useRecentNames";
import ToastNotification from "../components/ToastNotification";

const LoginPage = () => {
  const inputRef = useRef("");

  const { setPlayerInfo, notification } = useUser();
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
    <>
      <div className={`cyber-background ${styles.container}`}>
        <div className="cyber-overlay"></div>

        <div className={`glass-panel ${styles.card}`}>
          <div className={styles.iconHeader}>
            <i className="fa-solid fa-gamepad"></i>
          </div>
          <h1 className={styles.title}>
              TETRIS <br />
              <span className="text-highlight">MULTIPLAYER</span>
          </h1>

          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <i className={`fa-solid fa-user ${styles.inputIcon}`}></i>
              <input
                aria-label="Player Name"
                className="g-input" 
                ref={inputRef}
                placeholder="ENTER NICKNAME..."
                maxLength={12}
              />
            </div>

            <p className={styles.errorMessage}>
              {error && <><i className="fa-solid fa-triangle-exclamation"></i> {error}</>}
            </p>

            <button type="submit" className="g-btn">
              START GAME <i className="fa-solid fa-chevron-right"></i>
            </button>
          </form>

          <RecentNames onSelectName={loginUser} />
        </div>
      </div>
      <ToastNotification notification={notification} />
    </>
  );
};

export default LoginPage;