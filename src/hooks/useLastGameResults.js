import { useState, useEffect } from "react";
import * as gameService from "../services/gameService";

export const useLastGameResults = () => {
    const [results, setResults] = useState([]);

    useEffect(() => {
        return gameService.subscribeToLastResults((results) => {
            if(!results) return;

            results.sort((a, b) => b.gameStats.lines - a.gameStats.lines)  
            setResults(results);
        });
    }, []);

    return results;
};