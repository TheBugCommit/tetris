import styles from './LastGame.module.css'
import { useLastGameResults } from "../hooks/useLastGameResults";

const LastGame = () => {
    const lastResults = useLastGameResults();

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
                            <li key={`${p.id}_${index}`}
                                className={`${styles.listItem} ${getRankClass(index)}`}>
                                <div className={styles.left}>
                                    <span className={styles.rankNum}>
                                        {getRankIcon(index)}
                                    </span>
                                    <span className={styles.name}>{p.name}</span>
                                </div>

                                <div className={styles.right}>
                                    <div className={styles.stats}>
                                        <span className={styles.pill}>
                                            <i className="fa-solid fa-layer-group"></i> {p.gameStats.lines}
                                        </span>
                                        <span className={styles.pill}>
                                            <i className="fa-solid fa-angles-up"></i> {p.gameStats.level}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                </ul>
            )}
        </div>
    )
}
export default LastGame