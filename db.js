import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

connection.connect(err => {
    if (err) {
        return console.error('error: ' + err.stack)
    }
    console.log('connected as id ' + connection.threadId)
});

export default connection