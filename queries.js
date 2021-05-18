const Pool = require('pg').Pool
const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "postgres123",
  database: "C3-PAWM-DB"
})
const crypto = require("crypto");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Genera il Codice di Ritiro per l'Ordine.
 * @returns il Codice di Ririto
 */
function generateCodiceRitiro() {
  const toReturn = crypto.randomBytes(4).toString('hex');
  return toReturn;
}

//TODO Vecchio
const getUsers = (request, response) => {
  pool.query('SELECT * FROM public.utenti ORDER BY id ASC', (error, results) => {
    if (error) throw error
    response.status(200).json(results.rows)
  })
}

//TODO Vecchio
const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM public.utenti WHERE id = $1', [id], (error, results) => {
    if (error) throw error
    response.status(200).json(results.rows)
  })
}

const creaCliente = (request, response) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(request.body.password + "secret", salt);

  pool.query('INSERT INTO public.utenti ( nome, cognome, email, password, salt, telefono, indirizzo, tipo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    [request.body.nome, request.body.cognome, request.body.email, hash, salt, request.body.telefono, request.body.indirizzo, "CLIENTE"], (error, results) => {
      if (error) {
        throw error
      }
    })
}

const creaDipendente = (request, response) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(request.body.password + "secret", salt);
  const decoded_token = jwt.decode(request.body.token_value);
  var query, tipo;

  switch (decoded_token.tipo) {
    case "NEGOZIO":
      tipo = "COMMERCIANTE";
      query = 'INSERT INTO public.commercianti ( id, id_negozio ) VALUES ($1, $2)';
      break;
    case "MAGAZZINO":
      tipo = "MAGAZZINIERE";
      query = 'INSERT INTO public.magazzinieri ( id, id_magazzino ) VALUES ($1, $2)';
      break;
    case "DITTA_TRASPORTI":
      tipo = "CORRIERE";
      query = 'INSERT INTO public.corrieri ( id, id_ditta ) VALUES ($1, $2)';
      break;
  }

  pool.query('INSERT INTO public.utenti ( nome, cognome, email, password, salt, telefono, indirizzo, tipo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    [request.body.nome, request.body.cognome, request.body.email, hash, salt, request.body.telefono, request.body.indirizzo, tipo], (error, results) => {
      if (error) throw error
    })

  findUserByEmail(request.body.email, (err, results) => {
    if (err) return response.status(500).send('Server error!');

    const dipendente = JSON.parse(JSON.stringify(results.rows));

    if (dipendente.length == 1) {
      pool.query(query, [dipendente[0].id, decoded_token.id], (error, results) => {
        if (error) throw error
      })
      return response.status(200).send({ 'esito': "1" });
    }
    else return response.status(500).send("Server error!");
  });
}

const creaAttivita = (request, response) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(request.body.password + "secret", salt);

  pool.query('INSERT INTO public.attivita ( ragione_sociale, tipo, email, password, salt, telefono, indirizzo ) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [request.body.ragione_sociale, request.body.tipo, request.body.email, hash, salt, request.body.telefono, request.body.indirizzo], (error, results) => {
      if (error) {
        throw error
      }
    })
}

//VECCHIO
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

const cercaDipendenteById = (id, decoded_token, cb) => {
  var query;
  switch (decoded_token.tipo) {
    case 'NEGOZIO':
      query = 'SELECT * FROM public.commercianti WHERE id = $1 AND id_negozio = $2';
      break;
    case 'DITTA_TRASPORTI':
      query = 'SELECT * FROM public.corrieri WHERE id = $1 AND id_ditta = $2';
      break;
    case 'MAGAZZINO':
      query = 'SELECT * FROM public.magazzinieri WHERE id = $1 AND id_magazzino = $2';
      break;
  }
  return pool.query(query, [id, decoded_token.id], (error, results) => {
    cb(error, results)
  });
}

const cercaProdottoById = (id, decoded_token, cb) => {
  var id_negozio;

  if (decoded_token.tipo == "COMMERCIANTE") id_negozio = decoded_token.idNegozio;
  if (decoded_token.tipo == "NEGOZIO") id_negozio = decoded_token.id;

  return pool.query('SELECT * FROM public.prodotti WHERE id = $1 AND id_negozio = $2', [id, id_negozio], (error, results) => {
    cb(error, results)
  });
}

const eliminaDipendente = (request, response, decoded_token) => {
  const id = parseInt(request.params.id);

  cercaDipendenteById(id, decoded_token, (err, results) => {
    if (err) return response.status(500).send('Server Error!');

    const dipendente = JSON.parse(JSON.stringify(results.rows));
    if (dipendente.length == 0) return response.status(404).send('Dipendente non trovato!');

    pool.query('DELETE FROM public.utenti WHERE id = $1', [id], (error, results) => {
      if (error) throw error
      return response.status(200).send({ 'esito': "1" });
    })
  });
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

//TODO da finire
const creaOrdine = (request, response) => {
  const idMagazzino = request.body.idMagazzino;
  const idCliente = request.body.idCliente;
  const codiceRitiro = generateCodiceRitiro();

  pool.query('INSERT INTO public.ordini (id_magazzino, id_cliente, stato, codice_ritiro) VALUES ($1, $2, $3, $4)',
    [idMagazzino, idCliente, "PAGATO", codiceRitiro], (error, results) => {
      if (error) {
        throw error
      }
    })
}

const getDipendenti = (token, cb) => {
  const decoded_token = jwt.decode(token);
  var query;

  switch (decoded_token.tipo) {
    case 'NEGOZIO':
      query = 'select public.utenti.id, nome, cognome, email, telefono, indirizzo from public.commercianti inner join public.utenti on public.commercianti.id=public.utenti.id where public.commercianti.id_negozio=$1 ORDER BY cognome, nome ASC';
      break;
    case 'DITTA_TRASPORTI':
      query = 'select public.utenti.id, nome, cognome, email, telefono, indirizzo from public.corrieri inner join public.utenti on public.corrieri.id=public.utenti.id where public.corrieri.id_ditta=$1 ORDER BY cognome, nome ASC';
      break;
    case 'MAGAZZINO':
      query = 'select public.utenti.id, nome, cognome, email, telefono, indirizzo from public.magazzinieri inner join public.utenti on public.magazzinieri.id=public.utenti.id where public.magazzinieri.id_magazzino=$1 ORDER BY cognome, nome ASC';
      break;
  }

  return pool.query(query, [decoded_token.id], (error, results) => {
    cb(error, results)
  });
}
//TODO fare commento e riguardare l'inner join
getCommercianteById = (id, cb) => {
  return pool.query('select * from public.commercianti inner join public.utenti on public.commercianti.id=public.utenti.id where public.utenti.id=$1',
    [id], (error, results) => {
      cb(error, results)
    })
}

//TODO fare commento
getInventario = (token, cb) => {
  const decoded_token = jwt.decode(token);
  var idNegozio;

  if (decoded_token.tipo == "COMMERCIANTE") idNegozio = decoded_token.idNegozio
  if (decoded_token.tipo == "NEGOZIO") idNegozio = decoded_token.id;

  return pool.query('select id, nome, quantita, prezzo from public.prodotti where id_negozio=$1 ORDER BY nome ASC',
    [idNegozio], (error, results) => {
      cb(error, results)
    });
}

//TODO fare commento
const creaProdotto = (request, response) => {
  const decoded_token = jwt.decode(request.body.token_value);
  var id_negozio;

  if (decoded_token.tipo == "COMMERCIANTE") id_negozio = decoded_token.idNegozio
  if (decoded_token.tipo == "NEGOZIO") id_negozio = decoded_token.id;

  pool.query('INSERT INTO public.prodotti (id_negozio, nome, quantita, prezzo) VALUES ($1, $2, $3, $4)',
    [id_negozio, request.body.nome, request.body.quantita, request.body.prezzo], (error, results) => {
      if (error) throw error
      return response.status(200).send({ 'esito': "1" });
    })
}

//TODO fare commento
const eliminaProdotto = (request, response, decoded_token) => {
  const id = parseInt(request.params.id);

  cercaProdottoById(id, decoded_token, (err, results) => {
    if (err) return response.status(500).send('Server Error!');

    const prodotto = JSON.parse(JSON.stringify(results.rows));
    if (prodotto.length == 0) return response.status(404).send('Prodotto non trovato!');

    pool.query('DELETE FROM public.prodotti WHERE id = $1', [id], (error, results) => {
      if (error) throw error
      return response.status(200).send({ 'esito': "1" });
    })
  });
}

const modificaProdotto = (request, response, decoded_token) => {
  const id = parseInt(request.params.id);

  cercaProdottoById(id, decoded_token, (err, results) => {
    if (err) return response.status(500).send('Server Error!');

    const prodotto = JSON.parse(JSON.stringify(results.rows));
    if (prodotto.length == 0) return response.status(404).send('Prodotto non trovato!');

    pool.query('UPDATE public.prodotti SET nome = $1, quantita = $2, prezzo = $3 WHERE id = $4',
      [request.body.nome, request.body.quantita, request.body.prezzo, id], (error, results) => {
        if (error) throw error
        return response.status(200).send({ 'esito': "1" });
      })
  });
}

module.exports = {
  creaCliente,
  creaDipendente,
  creaAttivita,
  updateUser,
  eliminaDipendente,
  findUserByEmail,
  findAttivitaByEmail,
  creaOrdine,
  getDipendenti,
  creaProdotto,
  eliminaProdotto,
  modificaProdotto,
  getCommercianteById,
  getInventario
}