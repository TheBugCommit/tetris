import { useState, useCallback, useEffect } from 'react';

export const useNotification = (duration = 3000) => {
    const [notification, setNotification] = useState(null);

    const showNotification = useCallback((message, type = 'info') => {
        setNotification({
            id: Date.now(),
            message,
            type 
        });
    }, []);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [notification, duration]);

    return { notification, showNotification };
};