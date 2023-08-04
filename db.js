/** Database for pg-oo */

const { Client } = require('pg'); // Import the Client class from pg module

const db = new Client({
    user: 'postgres',
    password: 'padilla',
    host: 'localhost', // Change this to your PostgreSQL server's hostname or IP address
    port: 5432,        // Change this to your PostgreSQL server's port
    database: 'lunchly'
});

db.connect();

module.exports = db;