import styles from './Ranking.module.css'
import { useRanking } from "../hooks/useRanking";

const Ranking = () => {
    const { ranking, loading, error } = useRanking();

    const Header = () => (
        <h3 className="list-header" style={{ color: 'var(--secondary-color)' }}>
            <i className="fa-solid fa-chart-simple"></i> GLOBAL RANKING
        </h3>
    );

    const getRankClass = (index) => {
        if (index === 0) return styles.rankFirst;
        if (index === 1) return styles.rankSecond;
        if (index === 2) return styles.rankThird;
        return "";
    };

    const getRankIcon = (index) => {
        if (index === 0) return <i className="fa-solid fa-trophy"></i>;
        if (index === 1) return <i className="fa-solid fa-medal"></i>;
        if (index === 2) return <i className="fa-solid fa-medal"></i>;
        return <span>{index + 1}.</span>;
    };

    if (error) return <div className={styles.wrapper}><Header /><p className={styles.error}><i className="fa-solid fa-triangle-exclamation"></i> {error}</p></div>;
    if (loading) return <div className={styles.wrapper}><Header /><p className={styles.loading}><i className="fa-solid fa-spinner fa-spin"></i> Loading...</p></div>;

    return (
        <div className={styles.wrapper}>
            <Header />
            <ul className={styles.list}>
                {ranking.length > 0 ? (
                    ranking.map((record, index) => (
                        <li key={`${record.playerName}-${index}`} 
                        className={`${styles.listItem} ${getRankClass(index)}`}>
                            <div className={styles.left}>
                                <span className={styles.rankNum}>
                                    {getRankIcon(index)}
                                </span>
                                <span className={styles.name}>{record.playerName}</span>
                            </div>
                            
                            <div className={styles.right}>
                                <div className={styles.stats}>
                                    <span className={styles.pill}>
                                        <i className="fa-solid fa-layer-group"></i> {record.totalLines}
                                    </span>
                                    <span className={styles.pill}>
                                        <i className="fa-solid fa-angles-up"></i> {record.level}
                                    </span>
                                </div>
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