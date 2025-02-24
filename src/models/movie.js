const dynamoDB = require('../config/db');
const TABLE_NAME = process.env.DYNAMODB_TABLE;

class Movie {
    constructor(id, title, genre, duration, classification, desc, poster) {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.duration = duration;
        this.classification = classification;
        this.desc = desc;
        this.poster = poster;
    }

    static async create(movieData) {
        const params = {
            TableName: TABLE_NAME,
            Item: movieData
        };
        await dynamoDB.put(params).promise();
        return movieData;
    }

    static async getAll() {
        const params = {
            TableName: TABLE_NAME
        };
        const result = await dynamoDB.scan(params).promise();
        return result.Items;
    }
    static async deleteAll() {
        const params = { TableName: TABLE_NAME };
        const scanResult = await dynamoDB.scan(params).promise();
        
        const deleteRequests = scanResult.Items.map(movie => ({
            DeleteRequest: { Key: { id: movie.id } }
        }));

        if (deleteRequests.length > 0) {
            const batchParams = {
                RequestItems: { [TABLE_NAME]: deleteRequests }
            };
            await dynamoDB.batchWrite(batchParams).promise();
        }
    }
    static async delete(id) {
        const params = {
            TableName: TABLE_NAME,
            Key: { id }
        };

        const movie = await dynamoDB.get(params).promise();

        if (!movie.Item) {
            return null;
        }

        await dynamoDB.delete(params).promise();
        return movie.Item;
    }
}

module.exports = Movie;
