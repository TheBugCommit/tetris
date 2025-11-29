import { useEffect } from 'react';
import { CONTROLS } from '../constants/tetrisConstants';

export const useLobbyControls = (startGame, isGamePlaying) => {
    useEffect(() => {
        const handleKeyDown = async (e) => {
            if (CONTROLS.ENTER.includes(e.key) && !isGamePlaying) {
                await startGame();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [startGame, isGamePlaying]);
};