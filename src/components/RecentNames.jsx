import styles from './RecentNames.module.css'
import { useRecentNames } from "../hooks/useRecentNames";

const RecentNames = ({ onSelectName }) => {
    const [names] = useRecentNames();

    if (names.length === 0) return null;

    return (
        <div className={styles.container}>
            <p className={styles.label}>Previous Names:</p>
            <div className={styles.list}>
                {names.map((n, i) => (
                    <button
                        key={i}
                        className={styles.tag}
                        type="button"
                        onClick={() => onSelectName(n)}
                    >
                        {n}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default RecentNames