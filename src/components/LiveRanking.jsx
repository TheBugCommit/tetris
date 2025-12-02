import React from 'react';
import { useRoom } from '../contexts/RoomProvider';
import { useAllPlayersStats } from '../hooks/useAllPlayersStats';
import RankingList from './RankingList';
import { useLiveRanking } from '../hooks/useLiveRanking';

const LiveRanking = () => {
    const { players } = useRoom();
    const allStats = useAllPlayersStats();
    const ranking = useLiveRanking(players, allStats);
    
    return (
        <RankingList 
            title="LIVE RANKING"
            icon={<i className="fa-solid fa-trophy"></i>}
            color="var(--warning)"
            data={ranking}
            emptyMessage="Waiting for players..."
        />
    );
};

export default React.memo(LiveRanking);