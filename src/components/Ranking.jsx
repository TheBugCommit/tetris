import { useEffect, useState } from "react";
import rankingService from "../services/rankingService";
import styles from './Ranking.module.css'

const Ranking = () => {
    const [ranking, setRanking] = useState([]);

    useEffect(() => {
        (async () => {
            const ranking = await rankingService.getRanking()
            setRanking(ranking)
        })()
    }, [])

    return (
        <div className="panel">
            <h3 className={styles.header}>Ranking</h3>
            <ul className={styles.list}>
                {ranking.length > 0 ? (
                    ranking.map((record, index) => (
                        <li key={index} className={styles.listItem}>
                            <span>#{index + 1} {record.playerName}</span>
                            <span>Lvl {record.level} - {record.totalLines} lines</span>
                        </li>
                    ))
                ) : (
                    <li className={styles.empty}>Loading data...</li>
                )}
            </ul>
        </div>
    )
}

export default Ranking