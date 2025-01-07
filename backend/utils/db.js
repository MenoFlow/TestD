import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config(); // Charger les variables d'environnement

const con = mysql.createPool({

    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: "3306"
})

con.getConnection((err, conn) => {
    if(err) {
        console.log("connection error : "+err);
    } else {
        console.log("Connected");
        conn.release();
    }
})  


export default con;