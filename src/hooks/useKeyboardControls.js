import { useEffect } from 'react';

export const useKeyboardControls = (actions, isPlaying, isPaused) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"];
            if (keys.includes(e.key) || keys.includes(e.code)) e.preventDefault();

            if (e.code === "KeyP") return actions.togglePause();

            if (!isPlaying || isPaused) return;

            if (e.key === "ArrowLeft") actions.moveLeft();
            if (e.key === "ArrowRight") actions.moveRight();
            if (e.key === "ArrowDown") actions.moveDown();
            if (e.key === "ArrowUp") actions.rotate();
            if (e.code === "Space") actions.hardDrop();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [actions, isPlaying, isPaused]);
};