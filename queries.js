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

/**
 * Crea un nuovo Cliente.
 * @param {*} request 
 * @param {*} response 
 */
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

/**
 * Crea un nuovo Dipendente.
 * @param {*} request 
 * @param {*} response 
 */
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

/**
 * Crea una nuova Attività.
 * @param {*} request 
 * @param {*} response 
 */
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

/**
 * Ricerca un Dipendente tramite il suo ID.
 * @param {*} id Codice Identificativo del Dipendente
 * @param {*} decoded_token JWT decodificato dell'Attività
 * @param {*} cb Callback
 * @returns il risultato della query
 */
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

/**
 * Ricerca un'attività tramite il suo ID.
 * @param {*} id Codice Identificativo dell'attività
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const cercaAttivitaById = (id, cb) => {
  return pool.query('SELECT * FROM public.attivita WHERE id = $1', [id], (error, results) => {
    cb(error, results)
  });
}

/**
 * Ricerca un utente tramite il suo ID.
 * @param {*} id Codice Identificativo dell'utente
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const cercaUtenteById = (id, cb) => {
  return pool.query('SELECT * FROM public.utenti WHERE id = $1', [id], (error, results) => {
    cb(error, results)
  });
}

/**
 * Ricerca un Prodotto tramite il suo ID.
 * @param {*} id Codice Identificativo del Prodotto
 * @param {*} decoded_token JWT decodificato del Negozio o del Commerciante
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const cercaProdottoById = (id, decoded_token, cb) => {
  var id_negozio;

  if (decoded_token.tipo == "COMMERCIANTE") id_negozio = decoded_token.idNegozio;
  if (decoded_token.tipo == "NEGOZIO") id_negozio = decoded_token.id;

  return pool.query('SELECT * FROM public.prodotti WHERE id = $1 AND id_negozio = $2', [id, id_negozio], (error, results) => {
    cb(error, results)
  });
}

/**
 * Ricerca un Ordine tramite il suo ID.
 * @param {*} id_ordine Codice Identificativo dell'Ordine
 * @param {*} decoded_token JWT decodificato del richiedente
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const cercaOrdineById = (id_ordine, decoded_token, cb) => {
  var query;
  var id_owner;

  switch (decoded_token.tipo) {
    case 'NEGOZIO':
      query = 'SELECT * FROM public.ordini WHERE id = $1 AND id_negozio = $2';
      id_owner = decoded_token.id;
      break;
    case 'COMMERCIANTE':
      query = 'SELECT * FROM public.ordini WHERE id = $1 AND id_negozio = $2';
      id_owner = decoded_token.idNegozio;
      break;
    case 'DITTA_TRASPORTI':
      query = 'SELECT * FROM public.ordini WHERE id = $1 AND id_ditta = $2';
      id_owner = decoded_token.id;
      break;
    case 'MAGAZZINO':
      query = 'SELECT * FROM public.ordini WHERE id = $1 AND id_magazzino = $2';
      id_owner = decoded_token.id;
      break;
    case 'MAGAZZINIERE':
      query = 'SELECT * FROM public.ordini WHERE id = $1 AND id_magazzino = $2';
      id_owner = decoded_token.idMagazzino;
      break;
  }

  pool.query(query, [id_ordine, id_owner], (error, results) => {
    cb(error, results);
  });
}

/**
 * //TODO commentare
 * @param {*} id 
 * @param {*} decoded_token JWT decodificato del Corriere
 * @param {*} cb 
 */
const cercaMerceById = (id, decoded_token, cb) => {
  pool.query('SELECT * FROM public.merci_ordine WHERE id = $1 AND id_corriere = $2', [id, decoded_token.id], (error, results) => {
    cb(error, results);
  });
}

/**
 * Elimina il Dipendente selezionato.
 * @param {*} request Request con il parametro "id" del Dipendente da eliminare
 * @param {*} response 
 * @param {*} decoded_token JWT decodificato dell'Attività
 */
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

/**
 * Ricerca un Utente tramite la sua email.
 * @param {*} email email dell'Utente
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const findUserByEmail = (email, cb) => {
  return pool.query('SELECT * FROM public.utenti WHERE email = $1', [email], (error, results) => {
    cb(error, results)
  });
}

/**
 * Ricerca un'Attività tramite la sua email.
 * @param {*} email email dell'Attività
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const findAttivitaByEmail = (email, cb) => {
  return pool.query('SELECT * FROM public.attivita WHERE email = $1', [email], (error, results) => {
    cb(error, results)
  });
}

/**
 * Ricerca un Ordine tramite il suo Codice di Ritiro.
 * @param {*} codice Codice di Ritiro
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const findOrdineByCodice = (codice, cb) => {
  return pool.query('SELECT * FROM public.ordini WHERE codice_ritiro = $1', [codice], (error, results) => {
    cb(error, results)
  });
}

//TODO da rivedere response
const vendiProdotto = (prodotto, id_ordine, response) => {
  pool.query('INSERT INTO public.merci_ordine (id_prodotto, id_ordine, quantita, prezzo_acquisto, stato) VALUES ($1, $2, $3, $4, $5)',
    [prodotto.id, id_ordine, prodotto.quantita, prodotto.prezzo, "PAGATO"], (error, results) => {
      if (error) throw error

      pool.query('UPDATE public.prodotti SET disponibilita = $1 WHERE id = $2',
        [(prodotto.disponibilita - prodotto.quantita), prodotto.id], (error, results) => {
          if (error) throw error
        });
    });
}

//TODO da finire
const creaOrdine = (request, response) => {
  const decoded_token = jwt.decode(request.body.token_value);
  const codiceRitiro = generateCodiceRitiro();
  var id_negozio, id_cliente, erroreDisponibilità = false;

  if (decoded_token.tipo == "COMMERCIANTE") id_negozio = decoded_token.idNegozio
  if (decoded_token.tipo == "NEGOZIO") id_negozio = decoded_token.id;

  getInventario(request.body.token_value, (err, results) => {
    if (err) return res.status(500).send('Server error!');

    const inventario = JSON.parse(JSON.stringify(results.rows));

    inventario.forEach(prodottoInventario => {
      request.body.prodotti.forEach(prodotto => {
        if (prodottoInventario.id == prodotto.id) {
          prodotto.disponibilita = prodottoInventario.disponibilita;
          if (prodotto.disponibilita < prodotto.quantita)
            erroreDisponibilità = true;
        }
      })
    });

    findUserByEmail(request.body.email_cliente, (err, results) => {
      if (erroreDisponibilità) return response.status(500).send("La Quantità supera la Disponibilità!")
      if (err) return response.status(500).send('Server error!');

      const cliente = JSON.parse(JSON.stringify(results.rows));

      if (cliente.length == 1) {
        id_cliente = cliente[0].id;

        pool.query('INSERT INTO public.ordini (id_negozio, id_magazzino, id_cliente, id_ditta, tipo, stato, codice_ritiro) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [id_negozio, request.body.id_magazzino, id_cliente, request.body.id_ditta, request.body.tipo, "PAGATO", codiceRitiro],
          (error, results) => {
            if (error) throw error

            findOrdineByCodice(codiceRitiro, (err, results) => {
              if (err) return response.status(500).send('Server error!');

              const ordine = JSON.parse(JSON.stringify(results.rows));

              if (ordine.length == 1) {
                request.body.prodotti.forEach(prodotto => { vendiProdotto(prodotto, ordine[0].id, response); });
                return response.status(200).send({ 'esito': "1" });
              }
              else return response.status(500).send("Server error!");
            });
          });
      }
      else return response.status(500).send("Server error!");
    });

  })
}

/**
 * Ritorna la lista dei Dipendenti.
 * @param {*} token JWT dell'Attività
 * @param {*} cb Callback
 * @returns il risultato della query
 */
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
const verificaDipendenteLogin = (id, tipo, cb) => {
  var query;

  switch (tipo) {
    case 'COMMERCIANTE':
      query = 'select * from public.commercianti inner join public.utenti on public.commercianti.id=public.utenti.id where public.utenti.id=$1';
      break;
    case 'CORRIERE':
      query = 'select * from public.corrieri inner join public.utenti on public.corrieri.id=public.utenti.id where public.utenti.id=$1';
      break;
    case 'MAGAZZINIERE':
      query = 'select * from public.magazzinieri inner join public.utenti on public.magazzinieri.id=public.utenti.id where public.utenti.id=$1';
      break;
  }

  return pool.query(query, [id], (error, results) => {
    cb(error, results)
  })
}

/**
 * Ritorna l'Inventario di un Negozio.
 * @param {*} token JWT del Negozio o del Commerciante
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const getInventario = (token, cb) => {
  const decoded_token = jwt.decode(token);
  var idNegozio;

  if (decoded_token.tipo == "COMMERCIANTE") idNegozio = decoded_token.idNegozio
  if (decoded_token.tipo == "NEGOZIO") idNegozio = decoded_token.id;

  return pool.query('select id, nome, disponibilita, prezzo from public.prodotti where id_negozio=$1 ORDER BY nome ASC',
    [idNegozio], (error, results) => {
      cb(error, results)
    });
}

/**
 * Ritorna la lista degli Ordini di un Negozio.
 * @param {*} token JWT del Negozio o del Commerciante
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const getOrdiniNegozio = (token, cb) => {
  const decoded_token = jwt.decode(token);
  var idNegozio;

  if (decoded_token.tipo == "COMMERCIANTE") idNegozio = decoded_token.idNegozio
  if (decoded_token.tipo == "NEGOZIO") idNegozio = decoded_token.id;

  return pool.query('select id, id_negozio, id_magazzino, id_cliente, id_ditta, tipo, stato, codice_ritiro, data_ordine from public.ordini where id_negozio=$1 ORDER BY id DESC',
    [idNegozio], (error, results) => {
      cb(error, results)
    });
}

/**
 * Ritorna la lista degli Ordini di una Ditta di Trasporto.
 * @param {*} token JWT della Ditta
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const getOrdiniDittaTrasporto = (token, cb) => {
  const decoded_token = jwt.decode(token);
  var idDittaTrasporto = decoded_token.id;

  return pool.query('select id, id_negozio, id_magazzino, id_cliente, tipo, stato, data_ordine from public.ordini where id_ditta=$1 ORDER BY data_ordine DESC',
    [idDittaTrasporto], (error, results) => {
      cb(error, results)
    });
}

/**
 * Ritorna la lista degli Ordini di un Magazzino.
 * @param {*} token JWT del Magazzino o del Magazziniere
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const getOrdiniMagazzino = (token, cb) => {
  const decoded_token = jwt.decode(token);
  var idMagazzino;

  if (decoded_token.tipo == "MAGAZZINIERE") idMagazzino = decoded_token.idMagazzino
  if (decoded_token.tipo == "MAGAZZINO") idMagazzino = decoded_token.id;

  return pool.query('select id, id_negozio, id_cliente, id_ditta, tipo, stato, codice_ritiro, data_ordine from public.ordini where id_magazzino=$1 ORDER BY id DESC',
    [idMagazzino], (error, results) => {
      cb(error, results)
    });
}

/**
 * Ritorna la lista degli Ordini di un Cliente.
 * @param {*} token JWT del Cliente
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const getOrdiniCliente = (token, cb) => {
  const decoded_token = jwt.decode(token);

  return pool.query('select id, id_negozio, id_magazzino, id_ditta, stato, codice_ritiro, data_ordine from public.ordini where id_cliente=$1 ORDER BY id DESC',
    [decoded_token.id], (error, results) => {
      cb(error, results)
    });
}

const modificaOrdine = (request, response, decoded_token) => {
  const id = parseInt(request.params.id);

  cercaOrdineById(id, decoded_token, (err, results) => {
    if (err) return response.status(500).send('Server Error!');

    const ordine = JSON.parse(JSON.stringify(results.rows));
    if (ordine.length == 0) return response.status(404).send('Ordine non trovato!');

    pool.query('UPDATE public.ordini SET stato = $1 WHERE id = $2',
      ['RITIRATO', id], (error, results) => {
        if (error) throw error
        return response.status(200).send({ 'esito': "1" });
      })
  });
}

//TODO fare commento
const getMerciOrdine = (idOrdine, req, cb) => {
  const decoded_token = jwt.decode(req.headers.token);
  var query;
  var controlId;

  switch (decoded_token.tipo) {
    case 'NEGOZIO':
      query = 'select public.merci_ordine.id, public.merci_ordine.id, public.prodotti.nome, quantita, prezzo_acquisto, stato from public.merci_ordine' +
        ' inner join public.prodotti on public.merci_ordine.id_prodotto = public.prodotti.id where id_ordine=$1 AND public.prodotti.id_negozio=$2 ORDER BY public.prodotti.nome';
      controlId = decoded_token.id;
      break;
    case 'COMMERCIANTE':
      query = 'select public.merci_ordine.id, public.merci_ordine.id, public.prodotti.nome, quantita, prezzo_acquisto, stato from public.merci_ordine' +
        ' inner join public.prodotti on public.merci_ordine.id_prodotto = public.prodotti.id where id_ordine=$1 AND public.prodotti.id_negozio=$2 ORDER BY public.prodotti.nome';
      controlId = decoded_token.idNegozio;
      break;
    case 'DITTA_TRASPORTI':
      query = 'select public.merci_ordine.id, public.merci_ordine.id_ordine, public.prodotti.nome, id_corriere, quantita, prezzo_acquisto, public.merci_ordine.stato from public.merci_ordine' +
        ' inner join public.prodotti on public.merci_ordine.id_prodotto = public.prodotti.id inner join public.ordini on public.merci_ordine.id_ordine = public.ordini.id' +
        ' where id_ordine=$1 AND public.ordini.id_ditta=$2 ORDER BY public.prodotti.nome';
      controlId = decoded_token.id;
      break;
    case 'MAGAZZINO':
      query = 'select public.merci_ordine.id, public.merci_ordine.id, public.prodotti.nome, id_corriere, quantita, prezzo_acquisto, public.merci_ordine.stato from public.merci_ordine' +
        ' inner join public.prodotti on public.merci_ordine.id_prodotto = public.prodotti.id inner join public.ordini on public.merci_ordine.id_ordine = public.ordini.id' +
        ' where id_ordine=$1 AND public.ordini.id_magazzino=$2 ORDER BY public.prodotti.nome';
      controlId = decoded_token.id;
      break;
    case 'MAGAZZINIERE':
      query = 'select public.merci_ordine.id, public.merci_ordine.id, public.prodotti.nome, id_corriere, quantita, prezzo_acquisto, public.merci_ordine.stato from public.merci_ordine' +
        ' inner join public.prodotti on public.merci_ordine.id_prodotto = public.prodotti.id inner join public.ordini on public.merci_ordine.id_ordine = public.ordini.id' +
        ' where id_ordine=$1 AND public.ordini.id_magazzino=$2 ORDER BY public.prodotti.nome';
      controlId = decoded_token.idMagazzino;
      break;
    case 'CLIENTE':
      query = 'select public.merci_ordine.id, public.merci_ordine.id, public.prodotti.nome, quantita, prezzo_acquisto, public.merci_ordine.stato from public.merci_ordine' +
        ' inner join public.prodotti on public.merci_ordine.id_prodotto = public.prodotti.id inner join public.ordini on public.merci_ordine.id_ordine = public.ordini.id' +
        ' where id_ordine=$1 AND public.ordini.id_cliente=$2 ORDER BY public.prodotti.nome';
      controlId = decoded_token.id;
      break;
  }
  // TODO da controllare
  // const idOrdine = parseInt(req.params.idOrdine);
  return pool.query(query, [idOrdine, controlId], (error, results) => {
    cb(error, results)
  });
}

//TODO commentare
const getMerciCorriere = (req, cb) => {
  const decoded_token = jwt.decode(req.headers.token);

  return pool.query('select public.merci_ordine.id, id_cliente, id_magazzino, quantita, public.merci_ordine.stato' +
    ' from public.merci_ordine inner join public.ordini on public.merci_ordine.id_ordine = public.ordini.id' +
    ' where id_corriere=$1 and public.merci_ordine.stato<>$2', [decoded_token.id, "CONSEGNATO"], (error, results) => {
      cb(error, results)
    });
}

//TODO commentare
const getIndirizzoCliente = (req, cb) => {
  var idMerce = req.params.idMerce;
  const decoded_token = jwt.decode(req.headers.token);

  return pool.query('select public.utenti.indirizzo from (public.merci_ordine' +
    ' inner join public.ordini on public.merci_ordine.id_ordine = public.ordini.id)' +
    ' inner join public.utenti on public.ordini.id_cliente = public.utenti.id' +
    ' where public.merci_ordine.id = $1 and public.ordini.id_magazzino IS null and public.merci_ordine.id_corriere = $2',
    [idMerce, decoded_token.id], (error, results) => {
      cb(error, results)
    });
}

/**
 * Ritorna la lista dei Magazzini.
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const getMagazzini = (cb) => {
  return pool.query('select id, ragione_sociale, email, telefono, indirizzo from public.attivita where tipo=$1 ORDER BY ragione_sociale ASC',
    ["MAGAZZINO"], (error, results) => {
      cb(error, results)
    });
}

/**
 * Ritorna le informazioni del Magazzino.
 * @param {*} idMagazzino ID del Magazzino
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const getMagazzino = (idMagazzino, cb) => {
  return pool.query('select id, ragione_sociale, email, telefono, indirizzo from public.attivita where id=$1',
    [idMagazzino], (error, results) => {
      cb(error, results)
    });
}

/**
 * Ritorna la lista delle Ditte di Trasporto.
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const getDitteTrasporti = (cb) => {
  return pool.query('select id, ragione_sociale, email, telefono, indirizzo from public.attivita where tipo=$1 ORDER BY ragione_sociale ASC',
    ["DITTA_TRASPORTI"], (error, results) => {
      cb(error, results)
    });
}

/**
 * Ritorna le informazioni della Ditta di Trasporti.
 * @param {*} idDitta ID della Ditta
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const getDittaTrasporti = (idDitta, cb) => {
  return pool.query('select id, ragione_sociale, email, telefono, indirizzo from public.attivita where id=$1',
    [idDitta], (error, results) => {
      cb(error, results)
    });
}

/**
 * Ritorna la lista dei Negozi.
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const getNegozi = (cb) => {
  return pool.query('select id, ragione_sociale, email, telefono, indirizzo from public.attivita where tipo=$1 ORDER BY ragione_sociale ASC',
    ["NEGOZIO"], (error, results) => {
      cb(error, results)
    });
}

/**
 * Ritorna le informazioni del Negozio.
 * @param {*} idNegozio ID del Negozio
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const getNegozio = (idNegozio, cb) => {
  return pool.query('select id, ragione_sociale, email, telefono, indirizzo from public.attivita where id=$1',
    [idNegozio], (error, results) => {
      cb(error, results)
    });
}

//TODO fare commento
//TODO rinomina quantita
const creaProdotto = (request, response) => {
  const decoded_token = jwt.decode(request.body.token_value);
  var id_negozio;

  if (decoded_token.tipo == "COMMERCIANTE") id_negozio = decoded_token.idNegozio
  if (decoded_token.tipo == "NEGOZIO") id_negozio = decoded_token.id;

  pool.query('INSERT INTO public.prodotti (id_negozio, nome, disponibilita, prezzo) VALUES ($1, $2, $3, $4)',
    [id_negozio, request.body.nome, request.body.quantita, request.body.prezzo], (error, results) => {
      if (error) throw error
      return response.status(200).send({ 'esito': "1" });
    })
}

/**
 * Elimina il prodotto dell'Inventario del Negozio.
 * @param {*} request 
 * @param {*} response
 * @param {*} decoded_token JWT decodificato del Negozio
 * @returns il risultato della query
 */
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

//TODO rinomina quantita
const modificaProdotto = (request, response, decoded_token) => {
  const id = parseInt(request.params.id);

  cercaProdottoById(id, decoded_token, (err, results) => {
    if (err) return response.status(500).send('Server Error!');

    const prodotto = JSON.parse(JSON.stringify(results.rows));
    if (prodotto.length == 0) return response.status(404).send('Prodotto non trovato!');

    pool.query('UPDATE public.prodotti SET nome = $1, disponibilita = $2, prezzo = $3 WHERE id = $4',
      [request.body.nome, request.body.quantita, request.body.prezzo, id], (error, results) => {
        if (error) throw error
        return response.status(200).send({ 'esito': "1" });
      })
  });
}

const modificaAttivita = (request, response) => {
  const id = parseInt(request.params.id);

  cercaAttivitaById(id, (err, results) => {
    if (err) return response.status(500).send('Server Error!');

    const attivita = JSON.parse(JSON.stringify(results.rows));
    if (attivita.length == 0) return response.status(404).send('Attivita non trovata!');

    pool.query('UPDATE public.attivita SET ragione_sociale = $1, email = $2, telefono = $3, indirizzo = $4 WHERE id = $5',
      [request.body.ragione_sociale, request.body.email, request.body.telefono, request.body.indirizzo, id], (error, results) => {
        if (error) throw error
        return response.status(200).send({ 'esito': "1" });
      })
  });
}

const modificaUtente = (request, response) => {
  const id = parseInt(request.params.id);

  cercaUtenteById(id, (err, results) => {
    if (err) return response.status(500).send('Server Error!');

    const attivita = JSON.parse(JSON.stringify(results.rows));
    if (attivita.length == 0) return response.status(404).send('Utente non trovato!');

    pool.query('UPDATE public.utenti SET nome = $1, cognome = $2, email = $3, telefono = $4, indirizzo = $5 WHERE id = $6',
      [request.body.nome, request.body.cognome, request.body.email, request.body.telefono, request.body.indirizzo, id], (error, results) => {
        if (error) throw error
        return response.status(200).send({ 'esito': "1" });
      })
  });
}

const modificaPassword = (request, response, decoded_token) => {
  const id = parseInt(request.params.id);
  var tipo;
  switch (decoded_token.tipo) {
    case 'DITTA_TRASPORTI':
    case 'MAGAZZINO':
    case 'NEGOZIO':
      tipo = 'ATTIVITA'; break;
    case 'CLIENTE':
    case 'COMMERCIANTE':
    case 'CORRIERE':
    case 'MAGAZZINIERE':
      tipo = 'UTENTE'; break;
    default:
      return response.status(400).send('Bad request!');
  }

  if (tipo === 'ATTIVITA') {
    cercaAttivitaById(id, (err, results) => {
      if (err) return response.status(500).send('Server Error!');

      const risultati = JSON.parse(JSON.stringify(results.rows));
      if (risultati.length == 0) return response.status(404).send('Attivita non trovata!');

      const attivita = risultati[0];
      const hash = bcrypt.hashSync(request.body.old_password + "secret", attivita.salt);

      if (hash == attivita.password) {
        const new_hash = bcrypt.hashSync(request.body.new_password + "secret", attivita.salt);

        pool.query('UPDATE public.attivita SET password = $1 WHERE id = $2',
          [new_hash, id], (error, results) => {
            if (error) throw error
            return response.status(200).send({ 'esito': "1" });
          });
      } else return response.status(401).send('La vecchia password non è corretta');
    });
  } else if (tipo == 'UTENTE') {
    cercaUtenteById(id, (err, results) => {
      if (err) return response.status(500).send('Server Error!');

      const risultati = JSON.parse(JSON.stringify(results.rows));
      if (risultati.length == 0) return response.status(404).send('Utente non trovato!');

      const utente = risultati[0];
      const hash = bcrypt.hashSync(request.body.old_password + "secret", utente.salt);

      if (hash == utente.password) {
        const new_hash = bcrypt.hashSync(request.body.new_password + "secret", utente.salt);

        pool.query('UPDATE public.utenti SET password = $1 WHERE id = $2',
          [new_hash, id], (error, results) => {
            if (error) throw error
            return response.status(200).send({ 'esito': "1" });
          });
      } else return response.status(401).send('La vecchia password non è corretta');
    });
  }
}

/**
 * Aggiunge il Corriere ad una Merce di un Ordine.
 * @param {*} request 
 * @param {*} response
 * @param {*} decoded_token JWT decodificato della Ditta di Trasporto 
 * @returns il risultato della query
 */
const aggiungiCorriere = (request, response, decoded_token) => {
  const id_merce_ordine = parseInt(request.params.id);
  const id_ordine = request.body.id_ordine;
  console.log('id_ordine:', id_ordine);


  cercaOrdineById(id_ordine, decoded_token, (err, results) => {
    if (err) return response.status(500).send('Server Error!');

    const ordine = JSON.parse(JSON.stringify(results.rows));
    if (ordine.length == 0) return response.status(404).send('Ordine non trovato!');

    cercaDipendenteById(request.body.id_corriere, decoded_token, (err, results) => {
      console.log('err:', err);
      if (err) return response.status(500).send('Server Error!');

      const corriere = JSON.parse(JSON.stringify(results.rows));
      if (corriere.length == 0) return response.status(404).send('Corriere non trovato!');

      pool.query('UPDATE public.merci_ordine SET id_corriere = $1 WHERE id = $2',
        [request.body.id_corriere, id_merce_ordine], (error, results) => {
          if (error) throw error
          return response.status(200).send({ 'esito': "1" });
        })
    });
  });
}

/**
 * //TODO commentare
 * @param {*} request 
 * @param {*} response 
 * @param {*} decoded_token 
 */
const cambiaStatoMerce = (request, response, decoded_token) => {
  const idMerce = parseInt(request.params.id);

  cercaMerceById(idMerce, decoded_token, (err, results) => {
    if (err) return response.status(500).send('Server Error!');

    const merce = JSON.parse(JSON.stringify(results.rows));
    if (merce.length == 0) return response.status(404).send('Merce non trovata!');

    var nuovoStato;

    switch (merce[0].stato) {
      case "PAGATO":
        nuovoStato = "IN_TRANSITO";
        break;
      case "IN_TRANSITO":
        nuovoStato = "CONSEGNATO";
        break;
      default:
        return response.status(500).send('Impossibile cambiare lo stato della Merce!');
    }

    pool.query('UPDATE public.merci_ordine SET stato = $1 WHERE id = $2',
      [nuovoStato, idMerce], (error, results) => {
        if (error) throw error
        return response.status(200).send({ 'esito': "1" });
      })
  })
}

/**
 * //TODO commentare
 * @param {*} cb 
 * @param {*} idUtente 
 * @returns 
 */
const getUserInfo = (idUtente, cb) => {
  return pool.query('select id, nome, cognome, email, telefono, indirizzo from public.utenti where id=$1',
    [idUtente], (error, results) => {
      cb(error, results)
    });
}

/**
 * //TODO commentare
 * @param {*} cb 
 * @param {*} idAttivita 
 * @returns 
 */
const getAttivitaInfo = (idAttivita, cb) => {
  return pool.query('select id, ragione_sociale, email, telefono, indirizzo from public.attivita where id=$1',
    [idAttivita], (error, results) => {
      cb(error, results)
    });
}

module.exports = {
  aggiungiCorriere,
  cambiaStatoMerce,
  creaAttivita,
  creaCliente,
  creaDipendente,
  creaOrdine,
  creaProdotto,
  eliminaDipendente,
  eliminaProdotto,
  findAttivitaByEmail,
  findUserByEmail,
  getAttivitaInfo,
  getDipendenti,
  getDittaTrasporti,
  getDitteTrasporti,
  getIndirizzoCliente,
  getInventario,
  getMagazzini,
  getMagazzino,
  getMerciCorriere,
  getMerciOrdine,
  getNegozi,
  getNegozio,
  getOrdiniCliente,
  getOrdiniDittaTrasporto,
  getOrdiniMagazzino,
  getOrdiniNegozio,
  getUserInfo,
  modificaAttivita,
  modificaOrdine,
  modificaPassword,
  modificaProdotto,
  modificaUtente,
  updateUser,
  verificaDipendenteLogin
}