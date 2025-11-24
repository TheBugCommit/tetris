import { useEffect, useState } from "react";
import * as gameService from "../services/gameService";
import styles from './LastGame.module.css'


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
                    <h3 className={styles.header}>🏆 Last Game</h3>
                    <ul className={styles.list}>
                        {lastResults
                            .sort((a, b) => b.gameStats.lines - a.gameStats.lines)
                            .map((p, index) => (
                                <li key={p.id + "res"} className={styles.listItem}>
                                    <span>#{index + 1} {p.name}</span>
                                    <span>
                                        Lvl: <strong>{p.gameStats.level}</strong> |
                                        Lines: <strong>{p.gameStats.lines}</strong>
                                    </span>
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </>
    )
}

export default LastGame