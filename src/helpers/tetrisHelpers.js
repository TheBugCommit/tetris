import { ROWS, COLS, SHAPES } from "../constants/tetrisConstants";

export const randomPiece = () => {
    const keys = Object.keys(SHAPES).filter(key => key !== 'G');
    const type = keys[Math.floor(Math.random() * keys.length)];
    return { type, rotation: 0, x: 3, y: 0 };
}

export const rotatePieceMath = (piece, dir = 1) => {
    const total = SHAPES[piece.type].length;
    return { ...piece, rotation: (piece.rotation + dir + total) % total };
}

export const getMatrix = (piece) => {
    return SHAPES[piece.type][piece.rotation];
}

export const checkCollision = (b, p, offX = 0, offY = 0) => {
    const m = getMatrix(p);
    for (let y = 0; y < m.length; y++) {
        for (let x = 0; x < m[y].length; x++) {
            if (!m[y][x]) continue;
            const nx = p.x + x + offX;
            const ny = p.y + y + offY;
            if (ny < 0) continue;
            if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
            if (b[ny][nx]) return true;
        }
    }
    return false;
}

export const createGarbageLine = () => {
    const line = Array(COLS).fill("G");
    const hole1 = Math.floor(Math.random() * COLS);
    let hole2 = Math.floor(Math.random() * COLS);
    while (hole1 === hole2) hole2 = Math.floor(Math.random() * COLS);

    line[hole1] = null;
    line[hole2] = null;
    return line;
}