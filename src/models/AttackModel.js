export class AttackModel {
    constructor(senderName, lines) {
        this.sender = senderName;
        this.lines = lines;
    }

    static fromFirebase(data) {
        if (!data) return null;
        return {
            sender: data.sender,
            lines: data.lines
        };
    }

    toFirebase() {
        return {
            sender: this.sender,
            lines: this.lines,
        };
    }
}