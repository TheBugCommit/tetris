import styles from './ToastNotification.module.css';

const ToastNotification = ({ notification }) => {
    if (!notification) return null;

    return (
        <div key={notification.id} className={styles.container}>
            <div className={styles.toast}>
                {notification.message}
            </div>
        </div>
    );
};
export default ToastNotification;