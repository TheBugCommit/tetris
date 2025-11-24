import { useState, useEffect, useRef } from "react"; 
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid'; 
import { useUser } from "../contexts/UserProvider";

const LoginPage = () => {
  const inputRef = useRef(""); 
  const [recentNames, setRecentNames] = useState([]);

  const navigate = useNavigate();
  const { setPlayerInfo } = useUser();

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("recentNames")) || [];
      setRecentNames(stored);
    } catch (e) {
      console.error("Error llegint recentNames", e);
    }
  }, []);

  const loginUser = (name) => {

    const newPlayerId = uuidv4();
    setPlayerInfo(newPlayerId, name);

    const newRecents = [name, ...recentNames.filter((n) => n !== name)].slice(0, 5);
    localStorage.setItem("recentNames", JSON.stringify(newRecents));

    navigate("/lobby");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputRef.current.value.trim()) return;
    loginUser(inputRef.current.value);
  };

  return (
    <div className="panel banner">
      <h1 className="title">Tetris Multiplayer</h1>

      <form onSubmit={handleSubmit} className="panel">
        <input
          type="text"
          className="input-field"
          ref={inputRef}
          placeholder="Introdueix el teu nom"
          style={{ padding: "8px", borderRadius: "4px" }}
        />
        <button type="submit" className="btn">Entrar al Lobby</button>
      </form>

      {recentNames.length > 0 && (
        <div className="recent-names">
          <p className="stat" style={{ marginTop: "10px" }}>Noms anteriors:</p>
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
            {recentNames.map((n, i) => (
              <button
                key={i}
                className="btn"
                style={{ fontSize: "12px", padding: "4px 8px" }}
                onClick={() => loginUser(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;