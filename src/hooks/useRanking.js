import { useState, useEffect } from 'react';
import rankingService from "../services/rankingService";

export const useRanking = () => {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        rankingService.getRanking()
            .then(data => setRanking(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return { ranking, loading, error };
};