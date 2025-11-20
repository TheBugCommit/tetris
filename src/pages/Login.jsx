import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { useGame } from "../contexts/GameContext"; 

const Login = () => {
  const [inputValue, setInputValue] = useState(""); 
  const [recentNames, setRecentNames] = useState([]);

  const navigate = useNavigate();

  const { setPlayerName } = useGame();

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("recentNames")) || [];
      setRecentNames(stored);
    } catch (e) {
      console.error("Error llegint recentNames", e);
    }
  }, []);

  const loginUser = (nameToUse) => {
    setPlayerName(nameToUse);

    const newRecents = [nameToUse, ...recentNames.filter((n) => n !== nameToUse)].slice(0, 5);
    localStorage.setItem("recentNames", JSON.stringify(newRecents));

    navigate("/lobby");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    loginUser(inputValue);
  };

  return (
    <div className="panel banner">
      <h1 className="title">Tetris Multiplayer</h1>

      <form onSubmit={handleSubmit} className="panel">
        <input
          type="text"
          className="input-field"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
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

export default Login;