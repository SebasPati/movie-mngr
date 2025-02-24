const dynamoDB = require('../config/db');
const TABLE_NAME = "Reservations";

class Reservation {
    constructor(id, movieId, roomId, schedule, seats) {
        this.id = id;
        this.movieId = movieId;
        this.roomId = roomId;
        this.schedule = schedule;
        this.seats = seats;
    }

    static async create(reservationData) {
        const params = {
            TableName: TABLE_NAME,
            Item: reservationData
        };
        await dynamoDB.put(params).promise();
        return reservationData;
    }

    static async getAll() {
        const params = {
            TableName: TABLE_NAME
        };
        const result = await dynamoDB.scan(params).promise();
        return result.Items;
    }
}

module.exports = Reservation;
