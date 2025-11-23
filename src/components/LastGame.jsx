import { useEffect, useState } from "react";
import * as gameService from "../services/firebase/rtdb";


const LastGame = () => {
    const [lastResults, setLastResults] = useState([]);

    useEffect(() => {
        const unsubResults = gameService.subscribeToLastResults(setLastResults);
        return () => unsubResults(); 
    }, [])

    return (
        <>
            {lastResults && lastResults.length > 0 && (
                <div className="panel">
                    <h3>🏆 Última Partida</h3>
                    <ul>
                        {lastResults
                            .sort((a, b) => b.lines - a.lines)
                            .map((p, index) => (
                                <li key={p.id + "res"}>
                                    #{index + 1} {p.name}: 
                                    Level: <strong>{p.gameStats.level}</strong>, 
                                    Lines: <strong>{p.gameStats.lines}</strong>
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </>
    )
}

export default LastGame