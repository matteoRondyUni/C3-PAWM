const Pool = require('pg').Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

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
    controllaInt(idMagazzino, "Il Codice del Magazzino deve essere un numero!");
    return pool.query('select id, ragione_sociale, email, telefono, indirizzo from public.attivita where id=$1',
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
    return pool.query('SELECT COUNT(*) FROM public.attivita WHERE tipo = $1;', ['MAGAZZINO'],
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

    return pool.query('select id, id_negozio, id_cliente, id_ditta, tipo, stato, codice_ritiro, data_ordine from public.ordini where id_magazzino=$1 ORDER BY id DESC',
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
    controllaInt(request.params.id, "Il Codice dell'Ordine deve essere un numero!");
    const id = parseInt(request.params.id);

    cercaOrdineById(id, decoded_token, (err, results) => {
        if (err) return response.status(500).send('Server Error!');
        if (controllaRisultatoQuery(results)) return response.status(404).send('Ordine non trovato!');

        pool.query('UPDATE public.ordini SET stato = $1 WHERE id = $2',
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