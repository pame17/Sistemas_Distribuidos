const { Client } = require("pg")

const db = new Client({
    user: 'postgres',
    database: 'tarea1',
    password: 'postgres',
    port: '5432',
    host: 'postgres',
});

module.exports = db;
