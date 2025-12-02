import { useMemo } from "react";
import { PLAYER_STATUS } from "../models/PlayerModel";

export const useLiveRanking = (players, allStats) => {
    return useMemo(() => {
        return players
            .filter(p => p.isOnline && p.status === PLAYER_STATUS.PLAYING)
            .map(p => ({
                id: p.id,
                name: p.name,
                lines: allStats[p.id]?.lines || 0,
                level: allStats[p.id]?.level || 1
            }))
            .sort((a, b) => b.lines - a.lines)
            .slice(0, 10);
    }, [players, allStats])
}