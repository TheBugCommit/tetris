import { useUser } from '../contexts/UserProvider';
import { useRoom } from '../contexts/RoomProvider';
import { PLAYER_STATUS } from '../models/PlayerModel';
import styles from './PlayerList.module.css'

const PlayerList = () => {
    const { playerId } = useUser();
    const { players } = useRoom();

    return (
        <div className="g-list-wrapper">
            <h3 className="g-list-header">
                <i className="fa-solid fa-users"></i> CONNECTED ({players.filter(p => p.isOnline).length})
            </h3>
            <ul className="g-list">
                {players.map((p) => {
                    const isMe = p.id === playerId;
                    const isPlaying = p.status === PLAYER_STATUS.PLAYING;

                    return (
                        <li key={p.id} className={`g-list-item ${isMe ? 'me' : ''}`}>
                            <div className="g-item-left">
                                <i className={`fa-solid ${isMe ? 'fa-user-astronaut' : 'fa-user'}`}></i>
                                <span>{p.name} {isMe && "(YOU)"}</span>
                            </div>
                            <div className={styles.status}>
                                <span style={{
                                    color: isPlaying ? 'var(--success)' : 'var(--text-muted)',
                                    borderColor: `${isPlaying ? 'var(--success)' : 'var(--text-muted)'}`,
                                }}>
                                    {isPlaying ? 'PLAYING' : 'WAITING'}
                                </span>

                                {p.isOnline
                                    ? <i className={`fa-solid fa-circle ${styles.statusOnline}`}></i>
                                    : <i className={`fa-regular fa-circle-xmark ${styles.statusOffline}`}></i>
                                }
                            </div>
                        </li>
                    );
                })}
                {players.length === 0 && <li className="g-list-empty">Waiting connections...</li>}
            </ul>
        </div>
    );
};
export default PlayerList;