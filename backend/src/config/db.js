const mysql = require("mysql2")
const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database: "stoke_management"
})

db.connect((err) => {
    if (err) throw err;
    console.log("Database is connected successful 🧢")
})

module.exports = db