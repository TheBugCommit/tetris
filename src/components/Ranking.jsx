import styles from './Ranking.module.css'
import { useRanking } from "../hooks/useRanking";

const Ranking = () => {
    const { ranking, loading, error } = useRanking();

    const Header = () => (
        <h3 className={styles.header}>
            <i className="fa-solid fa-chart-simple"></i> GLOBAL RANKING
        </h3>
    );

    if (error) return <div className={styles.wrapper}><Header/><p className={styles.error}><i className="fa-solid fa-triangle-exclamation"></i> {error}</p></div>;
    if (loading) return <div className={styles.wrapper}><Header/><p className={styles.loading}><i className="fa-solid fa-spinner fa-spin"></i> Loading...</p></div>;

    return (
        <div className={styles.wrapper}>
            <Header/>
            <ul className={styles.list}>
                {ranking.length > 0 ? (
                    ranking.map((record, index) => (
                        <li key={`${record.playerName}-${index}`} className={styles.listItem}>
                            <div className={styles.left}>
                                <span className={styles.rankNum}>{index + 1}.</span>
                                <span className={styles.name}>{record.playerName}</span>
                            </div>
                            <div className={styles.right}>
                                {record.totalLines} <span className={styles.label}>LINES</span>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className={styles.empty}>No records yet</li>
                )}
            </ul>
        </div>
    );
}
export default Ranking;