import { useEffect } from 'react';
import rankingService from "../services/rankingService";
import storageService from "../services/storageService";

export const useScoreSubmission = (isGameOver, isGamePlaying, playerGameStats, playerName, showNotification) => {
    
    useEffect(() => {
        const alreadySubmitted = storageService.getScoreSubmitted();

        if (isGamePlaying) {
            storageService.clearScoreSubmitted();
            return;
        }

        if (isGameOver && !alreadySubmitted) {
            const submitScore = async () => {
                try {
                    storageService.setScoreSubmitted();
                    await rankingService.postRanking({
                        playerName: playerName,
                        level: playerGameStats.level,
                        lines: playerGameStats.lines
                    });
                } catch (error) {
                    showNotification("Error saving score. Check internet.", "error");
                    storageService.clearScoreSubmitted();
                }
            };

            submitScore();
        }
    }, [isGameOver, isGamePlaying, playerGameStats, playerName]);
};