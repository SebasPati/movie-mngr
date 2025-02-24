const { v4: uuidv4 } = require('uuid');

class Room {
    static VALID_CAPACITIES = [8, 40, 60, 150];

    constructor(name, capacity) {
        if (!Room.VALID_CAPACITIES.includes(capacity)) {
            throw new Error(`Capacidad inválida. Solo se permiten valores: ${Room.VALID_CAPACITIES.join(', ')}`);
        }
        
        this.id = uuidv4();
        this.name = name;
        this.capacity = capacity;
    }
}

module.exports = Room;
