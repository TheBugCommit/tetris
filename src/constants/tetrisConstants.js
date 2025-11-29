export const ROWS = 20;
export const COLS = 10;
export const SPEED = 300; // milisegundos por tick

export const SHAPES = {
    I: [
        [[1, 1, 1, 1]],
        [[1], [1], [1], [1]],
    ],
    O: [
        [
            [1, 1],
            [1, 1],
        ],
    ],
    T: [
        [
            [0, 1, 0],
            [1, 1, 1],
        ],
        [
            [1, 0],
            [1, 1],
            [1, 0],
        ],
        [
            [1, 1, 1],
            [0, 1, 0],
        ],
        [
            [0, 1],
            [1, 1],
            [0, 1],
        ],
    ],
    L: [
        [
            [1, 0],
            [1, 0],
            [1, 1],
        ],
        [
            [1, 1, 1],
            [1, 0, 0],
        ],
        [
            [1, 1],
            [0, 1],
            [0, 1],
        ],
        [
            [0, 0, 1],
            [1, 1, 1],
        ],
    ],
    J: [
        [
            [0, 1],
            [0, 1],
            [1, 1],
        ],
        [
            [1, 0, 0],
            [1, 1, 1],
        ],
        [
            [1, 1],
            [1, 0],
            [1, 0],
        ],
        [
            [1, 1, 1],
            [0, 0, 1],
        ],
    ],
    S: [
        [
            [0, 1, 1],
            [1, 1, 0],
        ],
        [
            [1, 0],
            [1, 1],
            [0, 1],
        ],
    ],
    Z: [
        [
            [1, 1, 0],
            [0, 1, 1],
        ],
        [
            [0, 1],
            [1, 1],
            [1, 0],
        ],
    ],
    G: [
        [1]
    ]
};

export const COLORS = {
    I: "cyan",
    O: "yellow",
    T: "purple",
    L: "orange",
    J: "blue",
    S: "green",
    Z: "red",
    G: "grey"
};


export const CONTROLS = {
    LEFT: ["ArrowLeft", "KeyA"],
    RIGHT: ["ArrowRight", "KeyD"],
    DOWN: ["ArrowDown", "KeyS"],
    ROTATE: ["ArrowUp", "KeyW"],
    DROP: ["Space"],
    PAUSE: ["KeyP"],
    ENTER: ["Enter"]
};

export const MIN_SPEED = 50;
export const SPEED_DECAY_FACTOR = 0.9;