import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserProvider";
import styles from './RecentNames.module.css'

const RecentNames = ({ onSelectName }) => {
    const [recentNames, setRecentNames] = useState([]);
    const { playerName } = useUser()

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem("recentNames")) || [];
            setRecentNames(stored);
        } catch (e) {
            console.error("Error llegint recentNames", e);
        }
    }, []);


    useEffect(() => {
        if (!playerName) return;
        const newRecents = [playerName, ...recentNames.filter((n) => n !== playerName)].slice(0, 5);
        localStorage.setItem("recentNames", JSON.stringify(newRecents));
        setRecentNames(newRecents); 
    }, [playerName]); 

    if (recentNames.length === 0) return null;

    return (
        <div className={styles.container}>
            <p className={styles.label}>Previous Names:</p>
            <div className={styles.list}>
                {recentNames.map((n, i) => (
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