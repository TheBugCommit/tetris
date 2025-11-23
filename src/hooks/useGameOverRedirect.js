import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const useGameOverRedirect = (isGameOver) => {
    const navigate = useNavigate();
    const [countDown, setCountDown] = useState(null);
    const [visualGameOver, setVisualGameOver] = useState(false);
    const hasNavigatedRef = useRef(false);

    useEffect(() => {
        if (isGameOver) setVisualGameOver(true);
    }, [isGameOver]);

    useEffect(() => {
        if (visualGameOver && countDown === null && !hasNavigatedRef.current) {
            setCountDown(3);
        }
    }, [visualGameOver, countDown]);

    useEffect(() => {
        if (visualGameOver && countDown !== null && countDown > 0) {
            const timer = setInterval(() => {
                setCountDown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [visualGameOver, countDown]);

    useEffect(() => {
        if (countDown === 0 && !hasNavigatedRef.current) {
            hasNavigatedRef.current = true;
            navigate('/lobby');
        }
    }, [countDown, navigate]);

    return { visualGameOver, countDown };
};