import { useEffect } from 'react';
import { CONTROLS } from '../constants/tetrisConstants';

export const useKeyboardControls = (actions, isPlaying, isPaused) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            const keys = Object.values(CONTROLS).flat();
            if (keys.includes(e.key) || keys.includes(e.code)) e.preventDefault();

            if (CONTROLS.PAUSE.includes(e.code)) return actions.togglePause();

            if (!isPlaying || isPaused) return;

            if (CONTROLS.LEFT.includes(e.key)) actions.moveLeft();
            if (CONTROLS.RIGHT.includes(e.key)) actions.moveRight();
            if (CONTROLS.DOWN.includes(e.key)) actions.moveDown();
            if (CONTROLS.ROTATE.includes(e.key)) actions.rotate();
            if (CONTROLS.DROP.includes(e.code)) actions.hardDrop();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [actions, isPlaying, isPaused]);
};