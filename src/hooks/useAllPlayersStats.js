import { useState, useEffect } from "react";
import * as gameService from "../services/gameService";

export const useAllPlayersStats = () => {
    const [allStats, setAllStats] = useState({});

    useEffect(() => {
        const unsubscribe = gameService.subscribeToPlayersStats((data) => setAllStats(data));
        return () => unsubscribe();
    }, []);

    return allStats;
};