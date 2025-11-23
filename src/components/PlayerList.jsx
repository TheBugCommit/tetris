import { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserProvider';
import * as gameService from "../services/firebase/rtdb";

const PlayerList = () => {
    const { playerName } = useUser();
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const unsubPlayers = gameService.subscribeToPlayers(setPlayers);
        return () => unsubPlayers();
    })

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