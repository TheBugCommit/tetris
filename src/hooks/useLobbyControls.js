import { useEffect } from 'react';

export const useLobbyControls = (startGame, isGamePlaying) => {
    useEffect(() => {
        const handleKeyDown = async (e) => {
            if (e.key === "Enter" && !isGamePlaying) {
                await startGame();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [startGame, isGamePlaying]);
};