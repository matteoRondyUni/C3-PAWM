// // import * as controller from './controller.js';
// module.import={
//     ()* from './controller.js'
// }

// var controller = import('./controller.js');

const db = require('./database');
const controller = require('./controller');
const general = require('./general');

/**
 * Tipologia che indica un Utente
 */
const TIPO = "UTENTE";

/**
 * Ricerca un utente tramite il suo ID.
 * @param {*} id Codice Identificativo dell'utente
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const cercaUtenteById = (id, cb) => {
    return db.pool.query('SELECT * FROM public.utenti WHERE id = $1', [id], (error, results) => {
        cb(error, results)
    });
}

/**
 * Ricerca un Utente tramite la sua email.
 * @param {*} email email dell'Utente
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const findUserByEmail = (email, cb) => {
    controller.controllaNotNull(email, "L'email non deve essere null!");
    return db.pool.query('SELECT * FROM public.utenti WHERE email = $1', [email], (error, results) => {
        cb(error, results)
    });
}

/**
 * Modifica le informazioni dell'Utente.
 * @param {*} request 
 * @param {*} response 
 */
const modificaUtente = (request, response) => {
    controller.controllaInt(request.params.id, "Il Codice dell'Utente deve essere un numero!");
    controller.controllaDatiAccount(request, controller.UTENTE);

    const id = parseInt(request.params.id);

    cercaUtenteById(id, (err, results) => {
        if (err) return response.status(500).send('Server Error!');
        if (controller.controllaRisultatoQuery(results)) return response.status(404).send('Utente non trovato!');

        db.pool.query('UPDATE public.utenti SET nome = $1, cognome = $2, email = $3, telefono = $4, indirizzo = $5 WHERE id = $6',
            [request.body.nome, request.body.cognome, request.body.email, request.body.telefono, request.body.indirizzo, id], (error, results) => {
                if (error) return response.status(400).send(db.ERRORE_DATI_QUERY);
                return response.status(200).send({ 'esito': "1" });
            })
    });
}

/**
 * Modifica la Password di un Utente.
 * @param {*} request 
 * @param {*} response 
 * @param {*} decoded_token JWT decodificato dell'Utente
 */
const modificaPassword = (request, response, decoded_token) => {
    controller.controllaInt(request.params.id, "L'ID deve essere un numero!");
    controller.controllaPassword(request.body.old_password);
    controller.controllaPassword(request.body.new_password);

    const id = parseInt(request.params.id);

    if (decoded_token.tipo != 'CLIENTE' && decoded_token.tipo != 'COMMERCIANTE' && decoded_token.tipo != 'CORRIERE' && decoded_token.tipo != 'MAGAZZINIERE')
        return response.status(400).send('Bad request!');

    cercaUtenteById(id, (err, results) => {
        if (err) return response.status(500).send('Server Error!');
        general.cambiaPassword(request, response, results, id, tipo);
    });
}

/**
 * Ritorna le Informazioni dell'Utente.
 * @param {*} idUtente ID dell'Utente
 * @param {*} cb Callback
 * @returns le info dell'Utente
 */
const getUserInfo = (idUtente, cb) => {
    controller.controllaInt(idUtente, "Il Codice dell'Utente deve essere un numero!");
    return db.pool.query('select id, nome, cognome, email, telefono, indirizzo from public.utenti where id=$1',
        [idUtente], (error, results) => {
            cb(error, results)
        });
}

module.exports = {
    TIPO,
    findUserByEmail,
    getUserInfo,
    modificaPassword,
    modificaUtente
}