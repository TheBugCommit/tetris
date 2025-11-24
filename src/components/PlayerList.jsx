import { useUser } from '../contexts/UserProvider';
import { useRoom } from '../contexts/RoomProvider';
import styles from './PlayerList.module.css'

const PlayerList = () => {
    const { playerName } = useUser();
    const { players } = useRoom();
    
    return (
        <div className="panel">
            <h3 className={styles.header}>
                👥 Players Connected ({players.length})
            </h3>
            <ul className={styles.list}>
                {players.map((p) => {
                    const isMe = p.name === playerName;
                    return (
                        <li key={p.id} className={styles.listItem}>
                            <span className={isMe ? styles.currentUser : styles.otherUser}>
                                {p.name} {isMe && "(Tu)"}
                            </span>
                            {!p.isOnline && <span className={styles.offline}>(Disconnected)</span>}
                        </li>
                    );
                })}
                {players.length === 0 && <li className={styles.listItem}>Waiting connections...</li>}
            </ul>
        </div>
    );
};
export default PlayerList;