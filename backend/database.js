const Pool = require('pg').Pool

/**
 * Per usare un database di Heroku commentare il 'pool' successivo e usare quello sottostante.
 */
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

/**
 * Per usare un database in locale commentare il 'pool' precedente e usare quello sottostante.
 */
// const pool = new Pool({
//   host: "localhost",
//   port: 5432,
//   user: "postgres",
//   password: "postgres123",
//   database: "C3-PAWM-DB"
// })

ERRORE_DATI_QUERY = "Errore nei dati!";

module.exports = {
  ERRORE_DATI_QUERY,
  pool
}