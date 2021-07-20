const db = require('./database');
const controller = require('./controller');
const negozio = require('./negozio');
const attivita = require('./attivita');
const utente = require('./utente');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Cambia la Password dell'Attvità o dell'Utente.
 * @param {*} request 
 * @param {*} response 
 * @param {*} results 
 * @param {*} id ID dell'Attività o dell'Utente
 * @param {*} tipo Campo per specificare se il tipo è ATTIVITA o UTENTE
 */
function cambiaPassword(request, response, results, id, tipo) {
  var query, errorText;
  if (attivita.TIPO == tipo) {
    query = 'UPDATE public.attivita SET password = $1 WHERE id = $2';
    errorText = 'Attivita non trovata!';
  } else if (utente.TIPO == tipo) {
    query = 'UPDATE public.utenti SET password = $1 WHERE id = $2';
    errorText = 'Utente non trovato!';
  }

  const risultati = JSON.parse(JSON.stringify(results.rows));
  if (risultati.length == 0) return response.status(404).send(errorText);

  const data = risultati[0];
  const hash = bcrypt.hashSync(request.body.old_password + "secret", data.salt);

  if (hash == data.password) {
    const new_hash = bcrypt.hashSync(request.body.new_password + "secret", data.salt);

    db.pool.query(query, [new_hash, id], (error, results) => {
      if (error) return response.status(400).send(db.ERRORE_DATI_QUERY);
      return response.status(200).send({ 'esito': "1" });
    });
  } else return response.status(401).send('La vecchia password non è corretta');
}

/**
 * Crea un nuovo Cliente.
 * @param {*} request 
 * @param {*} response 
 */
const creaCliente = (request, response) => {
  controller.controllaDatiRegister(request, UTENTE);

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(request.body.password + "secret", salt);

  db.pool.query('INSERT INTO public.utenti (nome, cognome, email, password, salt, telefono, indirizzo, tipo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    [request.body.nome, request.body.cognome, request.body.email, hash, salt, request.body.telefono, request.body.indirizzo, "CLIENTE"], (error, results) => {
      if (error) return response.status(400).send(db.ERRORE_DATI_QUERY);
      return response.status(200).send({ 'esito': "1" });
    })
}

/**
 * Ricerca un Ordine tramite il suo ID.
 * @param {*} id_ordine Codice Identificativo dell'Ordine
 * @param {*} decoded_token JWT decodificato del richiedente
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const cercaOrdineById = (id_ordine, decoded_token, cb) => {
  var query, id_owner;

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

  db.pool.query(query, [id_ordine, id_owner], (error, results) => {
    cb(error, results);
  });
}

/**
 * Ricerca una Merce tramite il suo ID.
 * @param {*} id Codice Identificativo della Merce
 * @param {*} decoded_token JWT decodificato del Corriere
 * @param {*} cb Callback
 */
const cercaMerceById = (id, decoded_token, cb) => {
  db.pool.query('SELECT * FROM public.merci_ordine WHERE id = $1 AND id_corriere = $2', [id, decoded_token.id], (error, results) => {
    cb(error, results);
  });
}

/**
 * Calcola le statistiche degli ordini di un certo Negozio o Cliente.
 * @param {*} ordini
 */
function calcolaVendite(ordini) {
  var vendite_ultimo_mese = 0, vendite_totali = 0;

  ordini.forEach(ordine => {
    var tmp = new Date(ordine.data_ordine);
    vendite_totali += Number(ordine.totale);

    if (tmp.getMonth() == new Date().getMonth()) vendite_ultimo_mese += Number(ordine.totale);
  });
  return { 'vendite_totali': vendite_totali, 'vendite_ultimo_mese': vendite_ultimo_mese };
}

/**
 * Ritorna le statistiche delle vendite di un Negozio o di un Cliente.
 * @param {*} token JWT del Negozio, Commerciante o del Cliente
 * @param {*} response 
 * @param {*} cb Callback
 */
const getOrdiniStats = (token, response, cb) => {
  const decoded_token = jwt.decode(token);
  if (decoded_token.tipo == 'COMMERCIANTE' || decoded_token.tipo == 'NEGOZIO')
    negozio.getOrdiniNegozio(token, (err, results) => {
      if (err) return response.status(500).send('Server error!');
      cb(calcolaVendite(JSON.parse(JSON.stringify(results.rows))));
    });
  else if (decoded_token.tipo == 'CLIENTE') {
    getOrdiniCliente(token, (err, results) => {
      if (err) return response.status(500).send('Server error!');
      cb(calcolaVendite(JSON.parse(JSON.stringify(results.rows))));
    });
  }
}

/**
 * Ritorna la lista degli Ordini di un Cliente.
 * @param {*} token JWT del Cliente
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const getOrdiniCliente = (token, cb) => {
  const decoded_token = jwt.decode(token);

  return db.pool.query('select id, id_negozio, id_magazzino, id_ditta, stato, codice_ritiro, data_ordine, totale from public.ordini where id_cliente=$1 ORDER BY id DESC',
    [decoded_token.id], (error, results) => {
      cb(error, results)
    });
}

/**
 * Ritorna la lista delle Merci dell'Ordine.
 * @param {*} req Request con il parametro idOrdine e con il JWT nell'headers
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const getMerciOrdine = (req, cb) => {
  controller.controllaInt(req.params.idOrdine, "Il Codice dell'Ordine deve essere un numero!");
  const idOrdine = parseInt(req.params.idOrdine);
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

  return db.pool.query(query, [idOrdine, controlId], (error, results) => {
    cb(error, results)
  });
}

module.exports = {
  cambiaPassword,
  cercaMerceById,
  cercaOrdineById,
  creaCliente,
  getMerciOrdine,
  getOrdiniCliente,
  getOrdiniStats
}