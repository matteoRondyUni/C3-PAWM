const db = require('./database');
const controller = require('./controller');
const utente = require('./utente');

const crypto = require("crypto");
const jwt = require('jsonwebtoken');

/**
 * Genera il Codice di Ritiro per l'Ordine.
 * @returns il Codice di Ririto
 */
function generateCodiceRitiro() {
    const toReturn = crypto.randomBytes(4).toString('hex');
    return toReturn;
}

/**
 * Ritorna l'ID del Negozio.
 * @param {*} decoded_token JWT decodificato del Negozio o del Commerciante
 * @returns il Codice Identificativo del Negozio
 */
function getIdNegozio(decoded_token) {
    var id_negozio;
    if (decoded_token.tipo == "COMMERCIANTE") id_negozio = decoded_token.idNegozio;
    if (decoded_token.tipo == "NEGOZIO") id_negozio = decoded_token.id;
    return id_negozio;
}

/**
 * Controlla che la quantità dei prodotti da vendere non superi la disponibilità nell'inventario.
 * @param {*} inventario 
 * @param {*} prodottiDaVendere 
 * @returns true se la quantità da vendere supera la disponibilità, false altrimenti
 */
function controllaProdottiDaVendere(inventario, prodottiDaVendere) {
    var to_return = false;
    inventario.forEach(prodottoInventario => {
        prodottiDaVendere.forEach(prodotto => {
            if (prodottoInventario.id == prodotto.id) {
                prodotto.disponibilita = prodottoInventario.disponibilita;
                if (prodotto.disponibilita < prodotto.quantita)
                    to_return = true;
            }
        })
    });
    return to_return;
}

/**
 * Calcola il Totale dell'Ordine.
 * @param {*} inventario 
 * @param {*} prodottiDaVendere 
 * @returns il Prezzo Totale
 */
function calcolaTotaleOrdine(inventario, prodottiDaVendere) {
    var totale = 0;
    inventario.forEach(prodottoInventario => {
        prodottiDaVendere.forEach(prodotto => {
            if (prodottoInventario.id == prodotto.id) {
                prodotto.prezzo = prodottoInventario.prezzo;
                totale += (prodotto.prezzo * prodotto.quantita);
            }
        })
    });
    return totale;
}

/**
 * Controlla che i dati per la Creazione di un Ordine siano corretti.
 * @param {*} request Request con i dati da controllare
 */
function controllaDatiCreazioneOrdine(request) {
    controller.controllaString(request.body.tipo, "La Tipologia dell'Ordine non può essere vuota!");
    controller.controllaString(request.body.email_cliente, "Il campo Email non può essere vuoto!");
    if (request.body.tipo == "MAGAZZINO")
        controller.controllaInt(request.body.id_magazzino, "Deve essere selezionato un Magazzino!");
    controller.controllaInt(request.body.id_ditta, "Deve essere selezionata una Ditta di Trasporti!");
    if (request.body.prodotti.length == 0 || request.body.prodotti == null)
        throw "L'Ordine deve avere almeno una merce!";
}

/**
 * Controlla che i dati per la Creazione o la Modifica di un Prodotto siano corretti.
 * @param {*} request Request con i dati da controllare
 */
function controllaDatiProdotto(request) {
    controller.controllaString(request.body.nome, "Il campo Nome non può essere vuoto!");
    controller.controllaInt(request.body.disponibilita, "La Disponibilità deve essere un numero!");
    controller.controllaFloat(request.body.prezzo, "Il Prezzo deve essere un numero!");
}

/**
 * Ricerca un Prodotto tramite il suo ID.
 * @param {*} id Codice Identificativo del Prodotto
 * @param {*} decoded_token JWT decodificato del Negozio o del Commerciante
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const cercaProdottoById = (id, decoded_token, cb) => {
    var id_negozio = getIdNegozio(decoded_token);

    return db.pool.query('SELECT * FROM public.prodotti WHERE id = $1 AND id_negozio = $2', [id, id_negozio], (error, results) => {
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
    var idNegozio = getIdNegozio(decoded_token);

    return db.pool.query('select id, id_negozio, id_magazzino, id_cliente, id_ditta, tipo, stato, codice_ritiro, data_ordine, totale from public.ordini where id_negozio=$1 ORDER BY id DESC',
        [idNegozio], (error, results) => {
            cb(error, results)
        });
}

/**
 * Crea un Prodotto da inserire nell'Inventario di un Negozio.
 * @param {*} request Request con il JWT del Negozio ed i dati del Prodotto da inserire
 * @param {*} response 
 */
const creaProdotto = (request, response) => {
    const decoded_token = jwt.decode(request.body.token_value);
    var id_negozio = getIdNegozio(decoded_token);
    controllaDatiProdotto(request);

    db.pool.query('INSERT INTO public.prodotti (id_negozio, nome, disponibilita, prezzo, stato) VALUES ($1, $2, $3, $4, $5)',
        [id_negozio, request.body.nome, request.body.disponibilita, request.body.prezzo, "IN_CATALOGO"], (error, results) => {
            if (error) return response.status(400).send(db.ERRORE_DATI_QUERY);
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
    controller.controllaInt(request.params.id, "Il Codice del Prodotto deve essere un numero!");
    const id = parseInt(request.params.id);

    cercaProdottoById(id, decoded_token, (err, results) => {
        if (err) return response.status(500).send('Server Error!');
        if (controller.controllaRisultatoQuery(results)) return response.status(404).send('Prodotto non trovato!');

        db.pool.query('DELETE FROM public.prodotti WHERE id = $1', [id], (error, results) => {
            return response.status(200).send({ 'esito': "1" });
        })
    });
}

//TODO commentare
const cambiaStatoProdotto = (request, response, decoded_token) => {
    controller.controllaInt(request.params.id, "Il Codice del Prodotto deve essere un numero!");
    const id = parseInt(request.params.id);

    cercaProdottoById(id, decoded_token, (err, results) => {
        if (err) return response.status(500).send('Server Error!');
        if (controller.controllaRisultatoQuery(results)) return response.status(404).send('Prodotto non trovato!');

        db.pool.query('UPDATE public.prodotti SET stato = $1, disponibilita = $2 WHERE id = $3', ["NON_IN_CATALOGO", 0, id], (error, results) => {
            return response.status(200).send({ 'esito': "1" });
        })
    });
}

/**
 * Ritorna l'Inventario di un Negozio.
 * @param {*} token JWT del Negozio o del Commerciante
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const getInventario = (token, cb) => {
    const decoded_token = jwt.decode(token);
    var idNegozio = getIdNegozio(decoded_token);

    return db.pool.query('select id, nome, disponibilita, prezzo, stato from public.prodotti where id_negozio=$1 ORDER BY nome ASC',
        [idNegozio], (error, results) => {
            cb(error, results)
        });
}

/**
 * Ritorna il numero dei Prodotti all'interno dell'Inventario del Negozio.
 * @param {*} token JWT del Negozio o del Commerciante
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const getInventarioCount = (token, cb) => {
    const decoded_token = jwt.decode(token);
    var idNegozio = getIdNegozio(decoded_token);

    return db.pool.query('SELECT COUNT(*) FROM public.prodotti WHERE id_negozio = $1;',
        [idNegozio], (error, results) => {
            cb(error, results)
        });
}

/**
 * Crea un nuovo Ordine.
 * @param {*} request Request con i Dati dell'Ordine da creare.
 * @param {*} response 
 */
const creaOrdine = (request, response) => {
    const decoded_token = jwt.decode(request.body.token_value);
    const codiceRitiro = generateCodiceRitiro();
    var id_cliente, id_negozio = getIdNegozio(decoded_token);
    controllaDatiCreazioneOrdine(request);

    getInventario(request.body.token_value, (err, results) => {
        if (err) return res.status(500).send('Server error!');

        const inventario = JSON.parse(JSON.stringify(results.rows));

        var erroreDisponibilita = controllaProdottiDaVendere(inventario, request.body.prodotti);
        var totale = calcolaTotaleOrdine(inventario, request.body.prodotti);

        utente.findUserByEmail(request.body.email_cliente, (err, results) => {
            if (err) return response.status(500).send('Server error!');
            if (erroreDisponibilita) return response.status(400).send("La Quantità supera la Disponibilità!");
            if (controller.controllaRisultatoQuery(results)) return response.status(404).send("L'email inserita non è associata a nessun Cliente!");

            const cliente = JSON.parse(JSON.stringify(results.rows));

            if (cliente.length == 1) {
                id_cliente = cliente[0].id;

                db.pool.query('INSERT INTO public.ordini (id_negozio, id_magazzino, id_cliente, id_ditta, tipo, stato, codice_ritiro, totale) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                    [id_negozio, request.body.id_magazzino, id_cliente, request.body.id_ditta, request.body.tipo, "PAGATO", codiceRitiro, totale],
                    (error, results) => {
                        if (error) return response.status(400).send(db.ERRORE_DATI_QUERY);

                        findOrdineByCodice(codiceRitiro, (err, results) => {
                            if (err) return response.status(500).send('Server error!');

                            const ordine = JSON.parse(JSON.stringify(results.rows));

                            if (ordine.length == 1) {
                                request.body.prodotti.forEach(prodotto => { vendiProdotto(prodotto, ordine[0].id, response); });
                                return response.status(200).send({ 'esito': "1" });
                            } else return response.status(500).send("Server error!");
                        });
                    });
            } else return response.status(500).send("Server error!");
        });
    })
}

/**
 * Vende il Prodotto selezionato e modifica la disponibilità all'interno dell'Inventario del Negozio.
 * @param {*} prodotto Prodotto da vendere
 * @param {*} id_ordine ID dell'Ordine
 * @param {*} response 
 */
const vendiProdotto = (prodotto, id_ordine, response) => {
    db.pool.query('INSERT INTO public.merci_ordine (id_prodotto, id_ordine, quantita, prezzo_acquisto, stato) VALUES ($1, $2, $3, $4, $5)',
        [prodotto.id, id_ordine, prodotto.quantita, prodotto.prezzo, "PAGATO"], (error, results) => {
            if (error) return response.status(400).send(db.ERRORE_DATI_QUERY);

            db.pool.query('UPDATE public.prodotti SET disponibilita = $1 WHERE id = $2',
                [(prodotto.disponibilita - prodotto.quantita), prodotto.id], (error, results) => {
                    if (error) return response.status(400).send(db.ERRORE_DATI_QUERY);
                });
        });
}

/**
 * Ricerca un Ordine tramite il suo Codice di Ritiro.
 * @param {*} codice Codice di Ritiro
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const findOrdineByCodice = (codice, cb) => {
    controller.controllaNotNull(codice, "Il Codice di Ritiro non deve essere null!");
    return db.pool.query('SELECT * FROM public.ordini WHERE codice_ritiro = $1', [codice], (error, results) => {
        cb(error, results)
    });
}

/**
 * Modifica le Informazioni di un Prodotto.
 * @param {*} request 
 * @param {*} response 
 * @param {*} decoded_token JWT decodificato del Negozio
 */
const modificaProdotto = (request, response, decoded_token) => {
    controller.controllaInt(request.params.id, "Il Codice del Prodotto deve essere un numero!");
    controllaDatiProdotto(request);

    const id = parseInt(request.params.id);

    cercaProdottoById(id, decoded_token, (err, results) => {
        if (err) return response.status(500).send('Server Error!');
        if (controller.controllaRisultatoQuery(results)) return response.status(404).send('Prodotto non trovato!');

        const tmp = JSON.parse(JSON.stringify(results.rows));
        if (tmp[0].stato == "NON_IN_CATALOGO")
            return response.status(403).send('Non si può modificare un Prodotto che non è in Catalogo!');

        db.pool.query('UPDATE public.prodotti SET nome = $1, disponibilita = $2, prezzo = $3 WHERE id = $4',
            [request.body.nome, request.body.disponibilita, request.body.prezzo, id], (error, results) => {
                if (error) return response.status(400).send(db.ERRORE_DATI_QUERY);
                return response.status(200).send({ 'esito': "1" });
            })
    });
}

/**
 * Ritorna la lista dei Negozi.
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const getNegozi = (cb) => {
    return db.pool.query('select id, ragione_sociale, email, telefono, indirizzo from public.attivita where tipo=$1 ORDER BY ragione_sociale ASC',
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
    controller.controllaInt(idNegozio, "Il Codice del Negozio deve essere un numero!");
    return db.pool.query('select id, ragione_sociale, email, telefono, indirizzo from public.attivita where id=$1',
        [idNegozio], (error, results) => {
            cb(error, results)
        });
}

/**
 * Ritorna il numero dei Negozio.
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const getNegoziCount = (cb) => {
    return db.pool.query('SELECT COUNT(*) FROM public.attivita WHERE tipo = $1;', ['NEGOZIO'],
        (error, results) => {
            cb(error, results)
        });
}

module.exports = {
    cambiaStatoProdotto,
    creaOrdine,
    creaProdotto,
    eliminaProdotto,
    getInventario,
    getInventarioCount,
    getNegozi,
    getNegoziCount,
    getNegozio,
    getOrdiniNegozio,
    modificaProdotto
}