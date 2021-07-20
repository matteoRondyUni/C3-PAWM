const db = require('./database');
const controller = require('./controller');
const general = require('./general');
const attivita = require('./attivita');

const jwt = require('jsonwebtoken');

/**
 * Aggiunge il Corriere ad una Merce di un Ordine.
 * @param {*} request 
 * @param {*} response
 * @param {*} decoded_token JWT decodificato della Ditta di Trasporti 
 * @returns il risultato della query
 */
const aggiungiCorriere = (request, response, decoded_token) => {
    controller.controllaInt(request.params.id, "L'ID della Merce deve essere un numero!");
    controller.controllaInt(request.body.id_ordine, "L'ID dell'Ordine deve essere un numero!");

    const id_merce_ordine = parseInt(request.params.id);
    const id_ordine = request.body.id_ordine;

    general.cercaOrdineById(id_ordine, decoded_token, (err, results) => {
        if (err) return response.status(500).send('Server Error!');
        if (controller.controllaRisultatoQuery(results)) return response.status(404).send('Ordine non trovato!');

        attivita.cercaDipendenteById(request.body.id_corriere, decoded_token, (err, results) => {
            if (err) return response.status(500).send('Server Error!');
            if (controller.controllaRisultatoQuery(results)) return response.status(404).send('Corriere non trovato!');

            db.pool.query('UPDATE public.merci_ordine SET id_corriere = $1 WHERE id = $2',
                [request.body.id_corriere, id_merce_ordine], (error, results) => {
                    return response.status(200).send({ 'esito': "1" });
                })
        });
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

    return db.pool.query('select id, id_negozio, id_magazzino, id_cliente, tipo, stato, data_ordine from public.ordini where id_ditta=$1 ORDER BY data_ordine DESC',
        [idDittaTrasporti], (error, results) => {
            cb(error, results)
        });
}

/**
 * Ritorna la lista delle Ditte di Trasporti.
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const getDitteTrasporti = (cb) => {
    return db.pool.query('select id, ragione_sociale, email, telefono, indirizzo from public.attivita where tipo=$1 ORDER BY ragione_sociale ASC',
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
    controller.controllaInt(idDitta, "Il Codice della Ditta di Trasporti deve essere un numero!");
    return db.pool.query('select id, ragione_sociale, email, telefono, indirizzo from public.attivita where id=$1',
        [idDitta], (error, results) => {
            cb(error, results)
        });
}

/**
 * Ritorna il numero delle Ditte di Trasporti.
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const getDitteTrasportiCount = (cb) => {
    return db.pool.query('SELECT COUNT(*) FROM public.attivita WHERE tipo = $1;', ['DITTA_TRASPORTI'],
        (error, results) => {
            cb(error, results)
        });
}

module.exports = {
    aggiungiCorriere,
    getDittaTrasporti,
    getDitteTrasporti,
    getDitteTrasportiCount,
    getOrdiniDittaTrasporti
}