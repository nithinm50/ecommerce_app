const { Pool, Client } = require('pg')
require('dotenv').config()
const user = process.env.username || 'postgres'
const host = process.env.hostname || 'database.server.com'
const database = process.env.dbname || 'mydb'
const password = process.env.password || 'secretpassword'
const port = process.env.dbport || 5432
// const connectionString = 'postgresql://dbuser:secretpassword@database.server.com:3211/mydb'
// const pool = new Pool({
//     connectionString,
// })
// pool.query('SELECT NOW()', (err, res) => {
//     console.log(err, res)
//     pool.end()
// })
const client = new Client({
    user,
    host,
    database,
    password,
    port
})
client.connect()

module.exports = client;