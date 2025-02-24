const pgp = require('pg-promise')();

const db = pgp({
    host: 'database-1.ctcg0o2y63b2.us-east-1.rds.amazonaws.com',
    port: 5432,
    database: 'Movies',
    user: 'postgres',
    password: '6W2I8kkxhIcPASi'
});

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS movies (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        genre VARCHAR(100) NOT NULL,
        duration INT NOT NULL,
        classification VARCHAR(10) NOT NULL
    );
`;

db.none(createTableQuery)
    .then(() => {
        console.log("Tabla 'movies' creada con éxito");
        process.exit();
    })
    .catch(error => {
        console.error("Error creando la tabla:", error);
        process.exit(1);
    });
