import { useRanking } from "../hooks/useRanking";
import RankingList from "./RankingList";

const HistoryRanking = () => {
    const { ranking, loading, error } = useRanking();

    const formattedData = ranking.map((r, i) => ({
        id: `history-${i}`,
        name: r.playerName,
        lines: r.totalLines,
        level: r.level
    }));

    return (
        <RankingList
            title="HISTORY RANKING"
            icon={<i className="fa-solid fa-chart-simple"></i>}
            color="var(--secondary)"
            data={formattedData}
            loading={loading}
            error={error}
            emptyMessage="No global records yet"
        />
    );
}
export default HistoryRanking;