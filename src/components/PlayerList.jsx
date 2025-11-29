import { useUser } from '../contexts/UserProvider';
import { useRoom } from '../contexts/RoomProvider';
import styles from './PlayerList.module.css'

const PlayerList = () => {
    const { playerId } = useUser();
    const { players } = useRoom();
    
    return (
        <div className={styles.wrapper}>
            <h3 className={styles.header}>
                <i className="fa-solid fa-users"></i> CONNECTED ({players.length})
            </h3>
            <ul className={styles.list}>
                {players.map((p) => {
                    const isMe = p.id === playerId;
                    return (
                        <li key={p.id} className={`${styles.listItem} ${isMe ? styles.meItem : ''}`}>
                            <div className={styles.nameGroup}>
                                <i className={`fa-solid ${isMe ? 'fa-user-astronaut' : 'fa-user'}`}></i>
                                <span>{p.name} {isMe && "(YOU)"}</span>
                            </div>
                            <div className={styles.status}>
                                {p.isOnline 
                                    ? <i className={`fa-solid fa-circle ${styles.statusOnline}`}></i>
                                    : <i className={`fa-regular fa-circle-xmark ${styles.statusOffline}`}></i>
                                }
                            </div>
                        </li>
                    );
                })}
                {players.length === 0 && <li className={styles.empty}>Waiting connections...</li>}
            </ul>
        </div>
    );
};
export default PlayerList;