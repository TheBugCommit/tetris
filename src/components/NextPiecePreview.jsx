import { SHAPES, COLORS } from "../utils/tetris/constants";

const NextPiecePreview = ({ piece }) => {
    const grid = Array.from({ length: 3 }, () => Array(4).fill(0));

    if (piece) {
        const shape = SHAPES[piece.type][0]; // Rotación 0

        // Calculamos el offset para centrar la pieza
        // La pieza 'I' (4 de ancho) necesita offset 0. La 'O' (2 de ancho) necesita offset 1.
        const offsetX = piece.type === 'O' ? 1 : (piece.type === 'I' ? 0 : 0.5);
        const startX = Math.floor(offsetX);

        // Offset Y: Bajamos la 'I' un poco para que no toque el techo si quieres
        const startY = piece.type === 'I' ? 0 : 0;

        shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    const ny = y + startY;
                    const nx = x + startX;
                    // Solo pintamos si está dentro de nuestra miniceldas (3x4)
                    if (grid[ny] && grid[ny][nx] !== undefined) {
                        grid[ny][nx] = piece.type;
                    }
                }
            });
        });
    }

    return (
        <div className="next-section">
            <h3 className="title" style={{ fontSize: '18px', margin: 0 }}>Next</h3>
            <div className="next-grid">
                {grid.map((row, r) =>
                    row.map((cellType, c) => (
                        <div
                            key={`${r}-${c}`}
                            className="next-cell"
                            style={{
                                backgroundColor: cellType ? COLORS[cellType] : "transparent",
                            }}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default NextPiecePreview