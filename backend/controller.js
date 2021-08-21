const attivita = require('./attivita');
const utente = require('./utente');
const xss = require("xss");

/**
 * Controlla che la password sia compresa tra 8 e 16 caratteri.
 * @param {String} password password da controllare
 */
exports.controllaPassword = function (password) {
    if (password == null || password.length < 8 || password.length > 16)
        throw "La password deve essere compresa tra 8 e 16 caratteri.";
}

/**
 * Controlla che il numero telefonico sia un formato corretto.
 * @param {String} telefono Numero telefonico da controllare
 * @returns La stringa sanificata (XSS sanitization)
 */
exports.controllaTelefono = function (telefono) {
    if (typeof telefono != "string" || isNaN(telefono)) throw "Il numero di telefono non è valido.";
    return xss(telefono);
}

/**
 * Controlla che il parametro passato sia un intero.
 * @param {*} toControl Dato da controllare
 * @param {String} errorText Errore da stampare
 */
exports.controllaInt = function (toControl, errorText) {
    if (toControl == null || isNaN(parseInt(toControl))) throw errorText;
}

/**
 * Controlla che il parametro passato sia un Float.
 * @param {*} toControl Dato da controllare
 * @param {String} errorText Errore da stampare
 */
exports.controllaFloat = function (toControl, errorText) {
    if (toControl == null || isNaN(parseFloat(toControl))) throw errorText;
}

/**
 * Controlla che il parametro passato sia diverso da null o dalla stringa vuota.
 * @param {String} toControl Dato da controllare
 * @param {String} errorText Errore da stampare
 * @returns La stringa sanificata (XSS sanitization)
 */
exports.controllaString = function (toControl, errorText) {
    if (toControl == null || toControl == "") throw errorText;
    return xss(toControl);
}

/** 
 * Controlla che il parametro passato sia diverso da null.
 * @param {*} toControl Dato da controllare
 * @param {String} errorText Errore da stampare
 */
exports.controllaNotNull = function (toControl, errorText) {
    if (toControl == null) throw errorText;
}

/**
 * Controlla che la Query abbia ritornato almeno un riga.
 * @param {*} results Risultato della query da controllare
 * @returns true se la query non ha ritornato nulla, false altrimenti
 */
exports.controllaRisultatoQuery = (results) => {
    const toControl = JSON.parse(JSON.stringify(results.rows));
    return (toControl.length == 0);
}

/**
 * Controlla che i dati per la Registrazione siano corretti.
 * @param {*} request Request con i dati da controllare
 * @param {*} tipo Campo per specificare se il tipo è ATTIVITA o UTENTE
 */
exports.controllaDatiRegister = function (request, tipo) {
    exports.controllaDatiAccount(request, tipo);
    exports.controllaPassword(request.body.password);
}

/**
 * Controlla che i dati per la Creazione o la Modifica di un Account (ATTIVITA o UTENTE) 
 * siano corretti.
 * @param {*} request Request con i dati da controllare
 * @param {*} tipo  Campo per specificare se il tipo è ATTIVITA o UTENTE
 */
exports.controllaDatiAccount = function (request, tipo) {
    if (attivita.TIPO == tipo)
        request.body.ragione_sociale = exports.controllaString(request.body.ragione_sociale, "Il campo Ragione Sociale non può essere vuoto!");
    else if (utente.TIPO == tipo) {
        request.body.nome = exports.controllaString(request.body.nome, "Il campo Nome non può essere vuoto!");
        request.body.cognome = exports.controllaString(request.body.cognome, "Il campo Cognome non può essere vuoto!");
    }
    request.body.email = exports.controllaString(request.body.email, "Il campo Email non può essere vuoto!");

    request.body.telefono = exports.controllaTelefono(request.body.telefono);
    request.body.indirizzo = exports.controllaString(request.body.indirizzo, "Il campo Indirizzo non può essere vuoto!");
}