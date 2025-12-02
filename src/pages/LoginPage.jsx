import { useRef, useState } from "react";
import { useUser } from "../contexts/UserProvider";
import styles from './LoginPage.module.css'
import RecentNames from "../components/RecentNames";
import ToastNotification from "../components/ToastNotification";

const LoginPage = () => {
  const inputRef = useRef("");

  const { setPlayerInfo, notification } = useUser();
  const [error, setError] = useState("");

  const loginUser = (name) => {
    if (!name || name.length < 3)
      setError("Name must be at least 3 charaters")
    else
      setPlayerInfo(name)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(inputRef.current.value.trim());
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