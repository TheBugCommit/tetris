import { useState, useEffect } from "react";
import * as gameService from "../services/gameService";

export const useLastGameResults = () => {
    const [results, setResults] = useState([]);

    useEffect(() => {
        return gameService.subscribeToLastResults(setResults);
    }, []);

    return results;
};