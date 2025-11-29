import styles from './LastGame.module.css'
import { useLastGameResults } from "../hooks/useLastGameResults";

const LastGame = () => {
    const lastResults = useLastGameResults();

    return (
        <>
            {lastResults && lastResults.length > 0 && (
                <div className="panel">
                    <h3 className={styles.header}>🏆 Last Game</h3>
                    <ul className={styles.list}>
                        {lastResults
                            .sort((a, b) => b.gameStats.lines - a.gameStats.lines)
                            .map((p, index) => (
                                <li key={`${p.id}_${index}`} className={styles.listItem}>
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