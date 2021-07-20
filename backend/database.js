// const Pool = require('pg').Pool
// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false
//     }
// })

ERRORE_DATI_QUERY = "Errore nei dati!";

const Pool = require('pg').Pool
const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "postgres123",
  database: "C3-PAWM-DB"
})

module.exports = {
  ERRORE_DATI_QUERY,
  pool
}