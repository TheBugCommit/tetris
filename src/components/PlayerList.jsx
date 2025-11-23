import { useUser } from '../contexts/UserProvider';
import { useRoom } from '../contexts/RoomProvider';

const PlayerList = () => {
    const { playerName } = useUser();
    const { players } = useRoom();
    
    return (
        <div className="connected">
            <h3>👥 Jugadors Connectats ({players.length})</h3>
            <ul>
                {players.map((p) => (
                    <li key={p.id} style={{ color: p.name === playerName ? '#4ade80' : 'white' }}>
                        {p.name} {p.name === playerName && "(Tu)"}
                        {!p.isOnline && <span style={{ color: 'gray', fontSize: '0.8em' }}> (Desconnectat)</span>}
                    </li>
                ))}
                {players.length === 0 && <li>Esperant connexions...</li>}
            </ul>
        </div>
    );
};
export default PlayerList;