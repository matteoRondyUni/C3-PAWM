const Pool = require('pg').Pool
const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "postgres123",
  database: "C3-PAWM-DB"
})

const bcrypt = require('bcrypt');
const secret = "secret";
const salt = "salt";

const getUsers = (request, response) => {
  pool.query('SELECT * FROM public.utenti ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM public.utenti WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const creaCliente = (request, response) => {
  const nome = request.body.nome;
  const cognome = request.body.cognome;
  const email = request.body.email;
  const telefono = request.body.telefono;
  const indirizzo = request.body.indirizzo;
  const tipo = "CLIENTE";
  const password = request.body.password;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password + "secret", salt);

  console.log("\n\nsalt:", salt);
  console.log("hash:", hash);

  console.log("NUOVO UTENTE:\n", request.body);

  pool.query('INSERT INTO public.utenti ( nome, cognome, email, password, salt, telefono, indirizzo, tipo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    [nome, cognome, email, hash, salt, telefono, indirizzo, tipo], (error, results) => {
      if (error) {
        throw error
      }
    })
}

const creaAttivita = (request, response) => {
  const ragione_sociale = request.body.ragione_sociale;
  const tipo = request.body.tipo;
  const email = request.body.email;
  const telefono = request.body.telefono;
  const indirizzo = request.body.indirizzo;
  const password = request.body.password;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password + "secret", salt);

  console.log("\n\nsalt:", salt);
  console.log("hash:", hash);

  console.log("NUOVA ATTIVITA:\n", request.body);

  pool.query('INSERT INTO public.attivita ( ragione_sociale, tipo, email, password, salt, telefono, indirizzo ) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [ragione_sociale, tipo, email, hash, salt, telefono, indirizzo], (error, results) => {
      if (error) {
        throw error
      }
    })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { nome, cognome } = request.body

  pool.query(
    'UPDATE public.utenti SET nome = $1, cognome = $2 WHERE id = $3',
    [nome, cognome, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM public.utenti WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

const findUserByEmail = (email, cb) => {
  return pool.query('SELECT * FROM public.utenti WHERE email = $1', [email], (error, results) => {
    cb(error, results)
  });
}

const findAttivitaByEmail = (email, cb) => {
  return pool.query('SELECT * FROM public.attivita WHERE email = $1', [email], (error, results) => {
    cb(error, results)
  });
}

module.exports = {
  getUsers,
  getUserById,
  creaCliente,
  creaAttivita,
  updateUser,
  deleteUser,
  findUserByEmail,
  findAttivitaByEmail
}