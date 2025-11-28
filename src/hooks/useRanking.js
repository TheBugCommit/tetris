import { useState, useEffect } from 'react';
import rankingService from "../services/rankingService";

export const useRanking = () => {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        rankingService.getRanking()
            .then(data => setRanking(data))
            .finally(() => setLoading(false));
    }, []);

    return { ranking, loading };
};