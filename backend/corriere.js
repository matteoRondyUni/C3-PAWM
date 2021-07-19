const Pool = require('pg').Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

const jwt = require('jsonwebtoken');

const controller = require('./controller');
const general = require('./general');

/**
 * Cambia lo stato della Merce.
 * @param {*} request Request con il parametro "id" del Merce
 * @param {*} response 
 * @param {*} decoded_token JWT decodificato del Corriere
 */
const cambiaStatoMerce = (request, response, decoded_token) => {
    controller.controllaInt(request.params.id, "L'ID della Merce deve essere un numero!");
    const idMerce = parseInt(request.params.id);

    general.cercaMerceById(idMerce, decoded_token, (err, results) => {
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
 * Ritorna la lista delle Merci del Corriere.
 * @param {*} req Request con il JWT del Corriere nell'headers
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const getMerciCorriere = (req, cb) => {
    const decoded_token = jwt.decode(req.headers.token);

    return pool.query('select public.merci_ordine.id, id_cliente, id_magazzino, quantita, public.merci_ordine.stato' +
        ' from public.merci_ordine inner join public.ordini on public.merci_ordine.id_ordine = public.ordini.id' +
        ' where id_corriere=$1 and public.merci_ordine.stato<>$2', [decoded_token.id, "CONSEGNATO"], (error, results) => {
            cb(error, results)
        });
}

/**
 * Ritorna l'Indirizzo del Cliente collegato ad una Merce.
 * @param {*} req 
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const getIndirizzoCliente = (req, cb) => {
    controller.controllaInt(req.params.idMerce, "Il Codice della Merce deve essere un numero!");
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

module.exports = {
    cambiaStatoMerce,
    getIndirizzoCliente,
    getMerciCorriere
}