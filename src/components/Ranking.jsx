import styles from './Ranking.module.css'
import { useRanking } from "../hooks/useRanking";

const Ranking = () => {
    const { ranking, loading, error } = useRanking();

    if (error) {
        return (
            <div className="panel">
                <h3 className={styles.header}>Ranking</h3>
                <ul className={styles.list}>
                    <li className={styles.error}>{error}</li>
                </ul>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="panel">
                <h3 className={styles.header}>Ranking</h3>
                <ul className={styles.list}>
                    <li className={styles.empty}>Loading data...</li>
                </ul>
            </div>
        );
    }

    return (
        <div className="panel">
            <h3 className={styles.header}>Ranking</h3>
            <ul className={styles.list}>
                {ranking.length > 0 ? (
                    ranking.map((record, index) => (
                        <li key={`${record.playerName}-${index}`} className={styles.listItem}>
                            <span>#{index + 1} {record.playerName}</span>
                            <span>Lvl {record.level} - {record.totalLines} lines</span>
                        </li>
                    ))
                ) : (
                    <li className={styles.empty}>No Data</li>
                )}
            </ul>
        </div>
    );
}

export default Ranking;
