import { useEffect, useState } from "react";
import rankingService from "../services/ranking/rankingService";

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
            <h3>Ranking</h3>
            <ul>
                {ranking.length > 0 ? (
                    ranking.map((record, index) => (
                        <li key={index} style={{ color: 'gold' }}>
                            {record.playerName}: Level: {record.level}, Lines: {record.totalLines}
                        </li>
                    ))
                ) : (
                    <li>Carregant dades...</li>
                )}
            </ul>
        </div>
    )
}

export default Ranking