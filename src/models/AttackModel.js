export const createAttack = (senderName, lines) => ({
    sender: senderName,
    lines: lines
});

export const attackFromFirebase = (data) => {
    if (!data) return null;
    return createAttack(data.sender, data.lines);
};