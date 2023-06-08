const mysql = require("mysql2")
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "staffMaster_db",
  password:""
})



module.exports = connection; 