import { useLastGameResults } from "../hooks/useLastGameResults";

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

const LastGame = () => {
    const lastResults = useLastGameResults();

    return (
        <div className="g-list-wrapper">
            <h3 className="g-list-header" style={{ color: 'var(--warning)' }}>
                <i className="fa-solid fa-trophy"></i> LAST MATCH RESULTS
            </h3>

            {!lastResults || lastResults.length === 0 ? (
                <div className="g-list-empty">No recent games played</div>
            ) : (
                <ul className="g-list">
                    {lastResults.map((p, index) => (
                            <li key={`${p.id}_${index}`}
                                className={`g-list-item ${getRankClass(index)}`}>
                                <div className="g-item-left">
                                    <span className="g-rank-num">{getRankIcon(index)}</span>
                                    <span className="g-name">{p.name}</span>
                                </div>

                                <div className="g-item-right">
                                    <span className="g-pill">
                                        <i className="fa-solid fa-layer-group"></i> {p.gameStats.lines}
                                    </span>
                                    <span className="g-pill">
                                        <i className="fa-solid fa-angles-up"></i> {p.gameStats.level}
                                    </span>
                                </div>
                            </li>
                        ))}
                </ul>
            )}
        </div>
    )
}
export default LastGame