import mysql from 'mysql2'

const con = mysql.createPool({

    host: "b2pqdoq8smtmtw5bk5ri-mysql.services.clever-cloud.com",
    user: "uc3ptdsxjgb5sujv",
    password: "Uuh9X5Q36ynumLSeUSCu",
    database: "b2pqdoq8smtmtw5bk5ri",
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