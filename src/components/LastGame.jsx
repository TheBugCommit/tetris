import styles from './LastGame.module.css'
import { useLastGameResults } from "../hooks/useLastGameResults";

const LastGame = () => {
    const lastResults = useLastGameResults();

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.header}>
                <i className="fa-solid fa-trophy"></i> LAST MATCH RESULTS
            </h3>
            
            {!lastResults || lastResults.length === 0 ? (
                 <div className={styles.empty}>No recent games played</div>
            ) : (
                <ul className={styles.list}>
                    {lastResults
                        .sort((a, b) => b.gameStats.lines - a.gameStats.lines)
                        .map((p, index) => (
                            <li key={`${p.id}_${index}`} className={styles.listItem}>
                                <div className={styles.rankInfo}>
                                    {index === 0 
                                        ? <i className="fa-solid fa-crown" style={{color: 'gold'}}></i>
                                        : <span className={styles.rankNum}>#{index + 1}</span>
                                    }
                                    <span className={index === 0 ? styles.winnerName : ''}>{p.name}</span>
                                </div>
                                <div className={styles.stats}>
                                    <span className={styles.pill}><i className="fa-solid fa-layer-group"></i> {p.gameStats.lines}</span>
                                    <span className={styles.pill}><i className="fa-solid fa-angles-up"></i> {p.gameStats.level}</span>
                                </div>
                            </li>
                        ))}
                </ul>
            )}
        </div>
    )
}
export default LastGame