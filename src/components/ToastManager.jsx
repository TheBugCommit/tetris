import { useEffect, useState } from 'react';
import styles from './ToastManager.module.css';

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
        <div className={styles.container}>
            <div className={styles.toast}>
                💣 {showToast.message}
            </div>
        </div>
    );
};
export default ToastManager;