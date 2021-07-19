const attivita = require('./attivita');
const utente = require('./utente');
const ERRORE_DATI_QUERY = "Errore nei dati!";

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
 * Controlla che il parametro passato sia diverso da null o dalla stringa vuota.
 * @param {String} toControl Dato da controllare
 * @param {String} errorText Errore da stampare
 */
function controllaString(toControl, errorText) {
    if (toControl == null || toControl == "") throw errorText;
}

/** 
 * Controlla che il parametro passato sia diverso da null.
 * @param {*} toControl Dato da controllare
 * @param {String} errorText Errore da stampare
 */
function controllaNotNull(toControl, errorText) {
    if (toControl == null) throw errorText;
}

/**
 * Controlla che la Query abbia ritornato almeno un riga.
 * @param {*} results Risultato della query da controllare
 * @returns true se la query non ha ritornato nulla, false altrimenti
 */
function controllaRisultatoQuery(results) {
    const toControl = JSON.parse(JSON.stringify(results.rows));
    return (toControl.length == 0);
}

/**
 * Controlla che i dati per la Registrazione siano corretti.
 * @param {*} request Request con i dati da controllare
 * @param {*} tipo Campo per specificare se il tipo è ATTIVITA o UTENTE
 */
function controllaDatiRegister(request, tipo) {
    controllaDatiAccount(request, tipo);
    controllaPassword(request.body.password);
}

/**
 * Controlla che i dati per la Creazione o la Modifica di un Account (ATTIVITA o UTENTE) 
 * siano corretti.
 * @param {*} request Request con i dati da controllare
 * @param {*} tipo  Campo per specificare se il tipo è ATTIVITA o UTENTE
 */
function controllaDatiAccount(request, tipo) {
    if (attivita.TIPO == tipo)
        controllaString(request.body.ragione_sociale, "Il campo Ragione Sociale non può essere vuoto!");
    else if (utente.TIPO == tipo) {
        controllaString(request.body.nome, "Il campo Nome non può essere vuoto!");
        controllaString(request.body.cognome, "Il campo Cognome non può essere vuoto!");
    }
    controllaString(request.body.email, "Il campo Email non può essere vuoto!");

    controllaTelefono(request.body.telefono);
    controllaString(request.body.indirizzo, "Il campo Indirizzo non può essere vuoto!");
}

module.exports = {
    ERRORE_DATI_QUERY,
    controllaDatiAccount,
    controllaDatiRegister,
    controllaFloat,
    controllaInt,
    controllaNotNull,
    controllaPassword,
    controllaRisultatoQuery,
    controllaString,
    controllaTelefono
}