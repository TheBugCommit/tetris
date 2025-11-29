import { useMemo } from "react";
import { SHAPES, COLORS } from "../constants/tetrisConstants";
import styles from './NextPiecePreview.module.css'

const NextPiecePreview = ({ piece }) => {
    const grid = useMemo(() => {
        const newGrid = Array.from({ length: 3 }, () => Array(4).fill(0));
        if (!piece) return newGrid;

        const shape = SHAPES[piece.type][0];

        const offsetX = piece.type === 'O' ? 1 : (piece.type === 'I' ? 0 : 0.5);
        const startX = Math.floor(offsetX);

        const startY = piece.type === 'I' ? 0 : 0;

        shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    const ny = y + startY;
                    const nx = x + startX;
                    if (newGrid[ny] && newGrid[ny][nx] !== undefined) {
                        newGrid[ny][nx] = piece.type;
                    }
                }
            });
        });

        return newGrid
    }, [piece])

    return (
        <div className={styles.section}>
            <h3 className={styles.title}>Next</h3>
            <div className={styles.grid}>
                {grid.map((row, r) =>
                    row.map((cellType, c) => (
                        <div
                            key={`${r}-${c}`}
                            className={styles.cell}
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