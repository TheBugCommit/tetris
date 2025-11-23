import { useEffect, useState } from 'react';

const ToastManager = ({ notification }) => {
    const [showToast, setShowToast] = useState(null);

    useEffect(() => {
        if (notification) {
            setShowToast(notification);
            const timer = setTimeout(() => setShowToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    if (!showToast) return null;

    return (
        <div className="toast-container">
            <div className="toast-attack">
                💣 {showToast.message}
            </div>
        </div>
    );
};
export default ToastManager;