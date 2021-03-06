const db = require('./database');
const general = require('./general');
const controller = require('./controller');

const jwt = require('jsonwebtoken');

/**
 * Ritorna l'ID del Magazzino.
 * @param {*} decoded_token JWT decodificato del Magazzino o del Magazziniere
 * @returns il Codice Identificativo del Magazzino
 */
function getIdMagazzino(decoded_token) {
    var idMagazzino;
    if (decoded_token.tipo == "MAGAZZINIERE") idMagazzino = decoded_token.idMagazzino
    if (decoded_token.tipo == "MAGAZZINO") idMagazzino = decoded_token.id;
    return idMagazzino;
}

/**
 * Ritorna la lista dei Magazzini.
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const getMagazzini = (cb) => {
    return db.pool.query('select id, ragione_sociale, email, telefono, indirizzo from public.attivita where tipo=$1 ORDER BY ragione_sociale ASC',
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
    controller.controllaInt(idMagazzino, "Il Codice del Magazzino deve essere un numero!");
    return db.pool.query('select id, ragione_sociale, email, telefono, indirizzo from public.attivita where id=$1',
        [idMagazzino], (error, results) => {
            cb(error, results)
        });
}

/**
 * Ritorna il numero dei Magazzini.
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const getMagazziniCount = (cb) => {
    return db.pool.query('SELECT COUNT(*) FROM public.attivita WHERE tipo = $1;', ['MAGAZZINO'],
        (error, results) => {
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
    var idMagazzino = getIdMagazzino(decoded_token);

    return db.pool.query('select id, id_negozio, id_cliente, id_ditta, tipo, stato, codice_ritiro, data_ordine from public.ordini where id_magazzino=$1 ORDER BY id DESC',
        [idMagazzino], (error, results) => {
            cb(error, results)
        });
}

/**
 * Imposta lo stato dell'Ordine a "RITIRATO".
 * @param {*} request Request con il parametro id
 * @param {*} response 
 * @param {*} decoded_token JWT del Magazzino o del Magazziniere
 */
const ritiraOrdine = (request, response, decoded_token) => {
    controller.controllaInt(request.params.id, "Il Codice dell'Ordine deve essere un numero!");
    const id = parseInt(request.params.id);

    general.cercaOrdineById(id, decoded_token, (err, results) => {
        if (err) return response.status(500).send('Server Error!');
        if (controller.controllaRisultatoQuery(results)) return response.status(404).send('Ordine non trovato!');

        db.pool.query('UPDATE public.ordini SET stato = $1 WHERE id = $2',
            ['RITIRATO', id], (error, results) => {
                return response.status(200).send({ 'esito': "1" });
            })
    });
}

module.exports = {
    getMagazzini,
    getMagazziniCount,
    getMagazzino,
    getOrdiniMagazzino,
    ritiraOrdine
}