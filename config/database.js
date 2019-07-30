
const util = require('util')
const mysql = require('mysql')

const conn = mysql.createConnection({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password:'password' ,
  database: 'mytestdb',
  port: 3306
})


console.log("Connection extabilished");
// Promisify for Node.js' async/await.
const query = util.promisify(conn.query).bind(conn);

module.exports = query;
