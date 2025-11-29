import { useEffect } from 'react';
import rankingService from "../services/rankingService";
import StorageService from "../services/StorageService";

export const useScoreSubmission = (isGameOver, isGamePlaying, playerGameStats, playerName) => {
    
    useEffect(() => {
        const alreadySubmitted = StorageService.getScoreSubmitted();

        if (isGamePlaying) {
            StorageService.clearScoreSubmitted();
            return;
        }

        if (isGameOver && playerGameStats.lines > 0 && !alreadySubmitted) {
            const submitScore = async () => {
                try {
                    StorageService.setScoreSubmitted();
                    await rankingService.postRanking({
                        playerName: playerName,
                        level: playerGameStats.level,
                        lines: playerGameStats.lines
                    });
                } catch (error) {
                    StorageService.clearScoreSubmitted();
                }
            };

            submitScore();
        }
    }, [isGameOver, isGamePlaying, playerGameStats, playerName]);
};