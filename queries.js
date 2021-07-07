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

const ERRORE_DATI_QUERY = "Errore nei dati!";

/**
 * Genera il Codice di Ritiro per l'Ordine.
 * @returns il Codice di Ririto
 */
function generateCodiceRitiro() {
  const toReturn = crypto.randomBytes(4).toString('hex');
  return toReturn;
}
/**
 * Controlla che la password sia compresa tra 8 e 16 caratteri.
 * @param {String} password password da controllare
 */
function controllaPassword(password) {
  if (password == null || password.length < 8 || password.length > 16)
    throw "La password deve essere compresa tra 8 e 16 caratteri.";
}

/**
 * Controlla che il numero telefonico sia un formato corretto.
 * @param {String} telefono Numero telefonico da controllare
 */
function controllaTelefono(telefono) {
  if (typeof telefono != "string" || isNaN(telefono)) throw "Il numero di telefono non è corretto.";
}

/**
 * Controlla che il parametro passato sia un intero.
 * @param {*} toControl Dato da controllare
 * @param {String} errorText Errore da stampare
 */
function controllaInt(toControl, errorText) {
  if (toControl == null || isNaN(parseInt(toControl))) throw errorText;
}

/**
 * Controlla che il parametro passato sia un Float.
 * @param {*} toControl Dato da controllare
 * @param {String} errorText Errore da stampare
 */
function controllaFloat(toControl, errorText) {
  if (toControl == null || isNaN(parseFloat(toControl))) throw errorText;
}

/** 
 * Controlla che il parametro passato sia diverso da null.
 * @param {*} toControl Dato da controllare
 * @param {String} errorText Errore da stampare
 */
function controllaNotNull(toControl, errorText) {
  if (toControl == null) throw errorText;
}

//TODO da commentare
function controllaProdottiDaVendere(inventario, prodottiDaVendere, totale) {
  inventario.forEach(prodottoInventario => {
    prodottiDaVendere.forEach(prodotto => {
      if (prodottoInventario.id == prodotto.id) {
        prodotto.disponibilita = prodottoInventario.disponibilita;
        prodotto.prezzo = prodottoInventario.prezzo;
        totale += (prodotto.prezzo * prodotto.quantita);
        if (prodotto.disponibilita < prodotto.quantita)
          return true;
      }
    })
  });
  return false;
}

//TODO da commentare
function controllaRisultatoQuery(results) {
  const toControl = JSON.parse(JSON.stringify(results.rows));
  return (toControl.length == 0);
}

/**
 * Crea un nuovo Cliente.
 * @param {*} request 
 * @param {*} response 
 */
const creaCliente = (request, response) => {
  controllaPassword(request.body.password);
  controllaTelefono(request.body.telefono);

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(request.body.password + "secret", salt);

  pool.query('INSERT INTO public.utenti (nome, cognome, email, password, salt, telefono, indirizzo, tipo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    [request.body.nome, request.body.cognome, request.body.email, hash, salt, request.body.telefono, request.body.indirizzo, "CLIENTE"], (error, results) => {
      if (error) return response.status(400).send(ERRORE_DATI_QUERY);
      return response.status(200).send({ 'esito': "1" });
    })
}

/**
 * Crea un nuovo Dipendente.
 * @param {*} request 
 * @param {*} response 
 */
const creaDipendente = (request, response) => {
  controllaPassword(request.body.password);
  controllaTelefono(request.body.telefono);

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
      if (error) return response.status(400).send(ERRORE_DATI_QUERY);

      findUserByEmail(request.body.email, (err, results) => {
        if (err) return response.status(500).send('Server error!');

        const dipendente = JSON.parse(JSON.stringify(results.rows));

        if (dipendente.length == 1) {
          pool.query(query, [dipendente[0].id, decoded_token.id], (error, results) => {
            if (error) return response.status(400).send(ERRORE_DATI_QUERY);
            return response.status(200).send({ 'esito': "1" });
          })
        }
        else return response.status(500).send("Server error!");
      });
    })
}

/**
 * Crea una nuova Attività.
 * @param {*} request 
 * @param {*} response 
 */
const creaAttivita = (request, response) => {
  controllaPassword(request.body.password);
  controllaTelefono(request.body.telefono);

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(request.body.password + "secret", salt);

  pool.query('INSERT INTO public.attivita ( ragione_sociale, tipo, email, password, salt, telefono, indirizzo ) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [request.body.ragione_sociale, request.body.tipo, request.body.email, hash, salt, request.body.telefono, request.body.indirizzo], (error, results) => {
      if (error) return response.status(400).send(ERRORE_DATI_QUERY);
      return response.status(200).send({ 'esito': "1" });
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
  controllaInt(request.params.id, "Il Codice del Dipendente deve essere un numero!");
  const id = parseInt(request.params.id);

  cercaDipendenteById(id, decoded_token, (err, results) => {
    if (err) return response.status(500).send('Server Error!');

    if (controllaRisultatoQuery(results)) return response.status(404).send('Dipendente non trovato!');

    pool.query('DELETE FROM public.utenti WHERE id = $1', [id], (error, results) => {
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
  controllaNotNull(email, "L'email non deve essere null!");
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
  controllaNotNull(email, "L'email non deve essere null!");
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
      if (error) return response.status(400).send(ERRORE_DATI_QUERY);

      pool.query('UPDATE public.prodotti SET disponibilita = $1 WHERE id = $2',
        [(prodotto.disponibilita - prodotto.quantita), prodotto.id], (error, results) => {
          if (error) return response.status(400).send(ERRORE_DATI_QUERY);
        });
    });
}

//TODO da finire
const creaOrdine = (request, response) => {
  const decoded_token = jwt.decode(request.body.token_value);
  const codiceRitiro = generateCodiceRitiro();
  var totale = 0, id_negozio, id_cliente, erroreDisponibilita = false;

  if (decoded_token.tipo == "COMMERCIANTE") id_negozio = decoded_token.idNegozio
  if (decoded_token.tipo == "NEGOZIO") id_negozio = decoded_token.id;

  getInventario(request.body.token_value, (err, results) => {
    if (err) return res.status(500).send('Server error!');

    const inventario = JSON.parse(JSON.stringify(results.rows));
    var totale;

    var erroreDisponibilita = controllaProdottiDaVendere(inventario, request.body.prodotti, totale);

    findUserByEmail(request.body.email_cliente, (err, results) => {
      if (erroreDisponibilita) return response.status(500).send("La Quantità supera la Disponibilità!")
      if (err) return response.status(500).send('Server error!');

      const cliente = JSON.parse(JSON.stringify(results.rows));

      if (cliente.length == 1) {
        id_cliente = cliente[0].id;

        pool.query('INSERT INTO public.ordini (id_negozio, id_magazzino, id_cliente, id_ditta, tipo, stato, codice_ritiro, totale) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
          [id_negozio, request.body.id_magazzino, id_cliente, request.body.id_ditta, request.body.tipo, "PAGATO", codiceRitiro, totale],
          (error, results) => {
            if (error) return response.status(400).send(ERRORE_DATI_QUERY);

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

const getOrdiniStats = (token, response, cb) => {
  getOrdiniNegozio(token, (err, results) => {
    if (err) return response.status(500).send('Server error!');

    const ordini = JSON.parse(JSON.stringify(results.rows));
    var vendite_ultimo_mese = 0, vendite_totali = 0;

    ordini.forEach(ordine => {
      var tmp = new Date(ordine.data_ordine);
      vendite_totali += Number(ordine.totale);

      if (tmp.getMonth() == new Date().getMonth()) vendite_ultimo_mese += Number(ordine.totale);
    });

    const to_return = { 'vendite_totali': vendite_totali, 'vendite_ultimo_mese': vendite_ultimo_mese };
    cb(to_return);
  });
}

const getInventarioCount = (token, cb) => {
  const decoded_token = jwt.decode(token);
  var idNegozio;

  if (decoded_token.tipo == "COMMERCIANTE") idNegozio = decoded_token.idNegozio
  if (decoded_token.tipo == "NEGOZIO") idNegozio = decoded_token.id;

  return pool.query('SELECT COUNT(*) FROM public.prodotti WHERE id_negozio = $1;',
    [idNegozio], (error, results) => {
      cb(error, results)
    });
}

const getDipendentiCount = (token, cb) => {
  const decoded_token = jwt.decode(token);
  var idAttivita = decoded_token.id;
  var query;

  switch (decoded_token.tipo) {
    case 'NEGOZIO':
      query = 'SELECT COUNT(*) FROM public.commercianti WHERE id_negozio = $1;';
      break;
    case 'DITTA_TRASPORTI':
      query = 'SELECT COUNT(*) FROM public.corrieri WHERE id_ditta = $1;';
      break;
    case 'MAGAZZINO':
      query = 'SELECT COUNT(*) FROM public.magazzinieri WHERE id_magazzino = $1;';
      break;
  }

  return pool.query(query, [idAttivita], (error, results) => { cb(error, results) });
}

const getMagazziniCount = (cb) => {
  return pool.query('SELECT COUNT(*) FROM public.attivita WHERE tipo = $1;', ['MAGAZZINO'],
    (error, results) => {
      cb(error, results)
    });
}

const getDitteTrasportiCount = (cb) => {
  return pool.query('SELECT COUNT(*) FROM public.attivita WHERE tipo = $1;', ['DITTA_TRASPORTI'],
    (error, results) => {
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

  return pool.query('select id, id_negozio, id_magazzino, id_cliente, id_ditta, tipo, stato, codice_ritiro, data_ordine, totale from public.ordini where id_negozio=$1 ORDER BY id DESC',
    [idNegozio], (error, results) => {
      cb(error, results)
    });
}

/**
 * Ritorna la lista degli Ordini di una Ditta di Trasporti.
 * @param {*} token JWT della Ditta
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const getOrdiniDittaTrasporti = (token, cb) => {
  const decoded_token = jwt.decode(token);
  var idDittaTrasporti = decoded_token.id;

  return pool.query('select id, id_negozio, id_magazzino, id_cliente, tipo, stato, data_ordine from public.ordini where id_ditta=$1 ORDER BY data_ordine DESC',
    [idDittaTrasporti], (error, results) => {
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
  controllaInt(request.params.id, "Il Codice dell'Ordine deve essere un numero!");
  const id = parseInt(request.params.id);

  cercaOrdineById(id, decoded_token, (err, results) => {
    if (err) return response.status(500).send('Server Error!');

    if (controllaRisultatoQuery(results)) return response.status(404).send('Ordine non trovato!');

    pool.query('UPDATE public.ordini SET stato = $1 WHERE id = $2',
      ['RITIRATO', id], (error, results) => {
        if (error) throw error
        return response.status(200).send({ 'esito': "1" });
      })
  });
}

//TODO fare commento
const getMerciOrdine = (req, cb) => {
  controllaInt(request.params.idOrdine, "Il Codice dell'Ordine deve essere un numero!");
  const idOrdine = parseInt(request.params.idOrdine);
  const decoded_token = jwt.decode(req.headers.token);
  var query, controlId;

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
  controllaInt(req.params.idMerce, "Il Codice della Merce deve essere un numero!");
  const idMerce = req.params.idMerce;
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
 * Ritorna la lista delle Ditte di Trasporti.
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
const creaProdotto = (request, response) => {
  const decoded_token = jwt.decode(request.body.token_value);
  var id_negozio;

  controllaInt(request.body.disponibilita, "La Disponibilità deve essere un numero!");
  controllaFloat(request.body.prezzo, "Il Prezzo deve essere un numero!");

  if (decoded_token.tipo == "COMMERCIANTE") id_negozio = decoded_token.idNegozio
  if (decoded_token.tipo == "NEGOZIO") id_negozio = decoded_token.id;

  pool.query('INSERT INTO public.prodotti (id_negozio, nome, disponibilita, prezzo) VALUES ($1, $2, $3, $4)',
    [id_negozio, request.body.nome, request.body.disponibilita, request.body.prezzo], (error, results) => {
      if (error) return response.status(400).send(ERRORE_DATI_QUERY);
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
  controllaInt(request.params.id, "Il Codice del Prodotto deve essere un numero!");
  const id = parseInt(request.params.id);

  cercaProdottoById(id, decoded_token, (err, results) => {
    if (err) return response.status(500).send('Server Error!');

    if (controllaRisultatoQuery(results)) return response.status(404).send('Prodotto non trovato!');

    pool.query('DELETE FROM public.prodotti WHERE id = $1', [id], (error, results) => {
      return response.status(200).send({ 'esito': "1" });
    })
  });
}

const modificaProdotto = (request, response, decoded_token) => {
  controllaInt(request.params.id, "Il Codice del Prodotto deve essere un numero!");
  controllaInt(request.body.disponibilita, "La Disponibilità deve essere un numero!");
  controllaFloat(request.body.prezzo, "Il Prezzo deve essere un numero!");

  const id = parseInt(request.params.id);

  cercaProdottoById(id, decoded_token, (err, results) => {
    if (err) return response.status(500).send('Server Error!');

    if (controllaRisultatoQuery(results)) return response.status(404).send('Prodotto non trovato!');

    pool.query('UPDATE public.prodotti SET nome = $1, disponibilita = $2, prezzo = $3 WHERE id = $4',
      [request.body.nome, request.body.disponibilita, request.body.prezzo, id], (error, results) => {
        if (error) return response.status(400).send(ERRORE_DATI_QUERY);
        return response.status(200).send({ 'esito': "1" });
      })
  });
}

const modificaAttivita = (request, response) => {
  controllaInt(request.params.id, "Il Codice dell'Attività deve essere un numero!");
  controllaTelefono(request.body.telefono);

  const id = parseInt(request.params.id);

  cercaAttivitaById(id, (err, results) => {
    if (err) return response.status(500).send('Server Error!');

    if (controllaRisultatoQuery(results)) return response.status(404).send('Attivita non trovata!');

    pool.query('UPDATE public.attivita SET ragione_sociale = $1, email = $2, telefono = $3, indirizzo = $4 WHERE id = $5',
      [request.body.ragione_sociale, request.body.email, request.body.telefono, request.body.indirizzo, id], (error, results) => {
        if (error) return response.status(400).send(ERRORE_DATI_QUERY);
        return response.status(200).send({ 'esito': "1" });
      })
  });
}

const modificaUtente = (request, response) => {
  controllaInt(request.params.id, "Il Codice dell'Utente deve essere un numero!");
  controllaTelefono(request.body.telefono);

  const id = parseInt(request.params.id);

  cercaUtenteById(id, (err, results) => {
    if (err) return response.status(500).send('Server Error!');

    if (controllaRisultatoQuery(results)) return response.status(404).send('Utente non trovato!');

    pool.query('UPDATE public.utenti SET nome = $1, cognome = $2, email = $3, telefono = $4, indirizzo = $5 WHERE id = $6',
      [request.body.nome, request.body.cognome, request.body.email, request.body.telefono, request.body.indirizzo, id], (error, results) => {
        if (error) return response.status(400).send(ERRORE_DATI_QUERY);
        return response.status(200).send({ 'esito': "1" });
      })
  });
}

const modificaPassword = (request, response, decoded_token) => {
  controllaInt(request.params.id, "L'ID deve essere un numero!");
  controllaPassword(request.body.old_password);
  controllaPassword(request.body.new_password);

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
  //TODO Refactor
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
            if (error) return response.status(400).send(ERRORE_DATI_QUERY);
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
            if (error) return response.status(400).send(ERRORE_DATI_QUERY);
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
 * @param {*} decoded_token JWT decodificato della Ditta di Trasporti 
 * @returns il risultato della query
 */
const aggiungiCorriere = (request, response, decoded_token) => {
  controllaInt(request.params.id, "L'ID della Merce deve essere un numero!");
  controllaInt(request.params.id_ordine, "L'ID dell'Ordine deve essere un numero!");

  const id_merce_ordine = parseInt(request.params.id);
  const id_ordine = request.body.id_ordine;

  cercaOrdineById(id_ordine, decoded_token, (err, results) => {
    if (err) return response.status(500).send('Server Error!');

    if (controllaRisultatoQuery(results)) return response.status(404).send('Ordine non trovato!');

    cercaDipendenteById(request.body.id_corriere, decoded_token, (err, results) => {
      if (err) return response.status(500).send('Server Error!');

      if (controllaRisultatoQuery(results)) return response.status(404).send('Corriere non trovato!');

      pool.query('UPDATE public.merci_ordine SET id_corriere = $1 WHERE id = $2',
        [request.body.id_corriere, id_merce_ordine], (error, results) => {
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
  controllaInt(request.params.id, "L'ID della Merce deve essere un numero!");
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
  getDipendentiCount,
  getDittaTrasporti,
  getDitteTrasporti,
  getDitteTrasportiCount,
  getIndirizzoCliente,
  getInventario,
  getInventarioCount,
  getMagazzini,
  getMagazziniCount,
  getMagazzino,
  getMerciCorriere,
  getMerciOrdine,
  getNegozi,
  getNegozio,
  getOrdiniCliente,
  getOrdiniDittaTrasporti,
  getOrdiniMagazzino,
  getOrdiniNegozio,
  getOrdiniStats,
  getUserInfo,
  modificaAttivita,
  modificaOrdine,
  modificaPassword,
  modificaProdotto,
  modificaUtente,
  updateUser,
  verificaDipendenteLogin
}