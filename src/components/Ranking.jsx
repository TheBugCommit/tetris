import { useRanking } from "../hooks/useRanking";

const getRankClass = (index) => {
    if (index === 0) return 'rank-gold';
    if (index === 1) return 'rank-silver';
    if (index === 2) return 'rank-bronze';
    return "";
};

const getRankIcon = (index) => {
    if (index === 0) return <i className="fa-solid fa-trophy"></i>;
    if (index === 1) return <i className="fa-solid fa-medal"></i>;
    if (index === 2) return <i className="fa-solid fa-medal"></i>;
    return <span>{index + 1}.</span>;
};

const Ranking = () => {
    const { ranking, loading, error } = useRanking();

    const Header = () => (
        <h3 className="g-list-header" style={{ color: 'var(--secondary)' }}>
            <i className="fa-solid fa-chart-simple"></i> GLOBAL RANKING
        </h3>
    );

    if (error) {
        return (
            <div className="g-list-wrapper">
                <Header />
                <p className="g-list-empty danger" style={{ color: 'var(--danger)' }}><i className="fa-solid fa-triangle-exclamation"></i> {error}</p>
            </div>
        )
    }
    if (loading) {
        return (
            <div className="g-list-wrapper">
                <Header />
                <p className="g-list-empty"><i className="fa-solid fa-spinner fa-spin"></i> Loading...</p>
            </div>
        )
    }
    return (
        <div className="g-list-wrapper">
            <Header />
            <ul className="g-list">
                {ranking.length > 0 ? (
                    ranking.map((record, index) => (
                        <li key={`${record.playerName}-${index}`}
                            className={`g-list-item ${getRankClass(index)}`}>
                            <div className="g-item-left">
                                <span className="g-rank-num">{getRankIcon(index)}</span>
                                <span className="g-name">{record.playerName}</span>
                            </div>

                            <div className="g-item-right">
                                <span className="g-pill">
                                    <i className="fa-solid fa-layer-group"></i> {record.totalLines}
                                </span>
                                <span className="g-pill">
                                    <i className="fa-solid fa-angles-up"></i> {record.level}
                                </span>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="g-list-empty">No records yet</li>
                )}
            </ul>
        </div>
    );
}
export default Ranking;