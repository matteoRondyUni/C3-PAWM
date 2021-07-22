const db = require('./database');
const controller = require('./controller');
const general = require('./general');
const utente = require('./utente');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Tipologia che indica un'Attività
 */
const TIPO = "ATTIVITA";

/**
 * Ricerca un'attività tramite il suo ID.
 * @param {*} id Codice Identificativo dell'attività
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const cercaAttivitaById = (id, cb) => {
    return db.pool.query('SELECT * FROM public.attivita WHERE id = $1', [id], (error, results) => {
        cb(error, results)
    });
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
    return db.pool.query(query, [id, decoded_token.id], (error, results) => {
        cb(error, results)
    });
}

/**
 * Crea una nuova Attività.
 * @param {*} request 
 * @param {*} response 
 */
const creaAttivita = (request, response) => {
    controller.controllaDatiRegister(request, TIPO);

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(request.body.password + process.env.SECRET_PWD, salt);

    db.pool.query('INSERT INTO public.attivita ( ragione_sociale, tipo, email, password, salt, telefono, indirizzo ) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [request.body.ragione_sociale, request.body.tipo, request.body.email, hash, salt, request.body.telefono, request.body.indirizzo], (error, results) => {
            if (error) return response.status(400).send(db.ERRORE_DATI_QUERY);
            return response.status(200).send({ 'esito': "1" });
        })
}

/**
 * Ricerca un'Attività tramite la sua email.
 * @param {*} email email dell'Attività
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const findAttivitaByEmail = (email, cb) => {
    controller.controllaNotNull(email, "L'email non deve essere null!");
    return db.pool.query('SELECT * FROM public.attivita WHERE email = $1', [email], (error, results) => {
        cb(error, results)
    });
}

/**
 * Ritorna le Informazioni dell'Attività.
 * @param {*} idAttivita ID dell'Attività
 * @param {*} cb Callback
 * @returns le info dell'Attività
 */
const getAttivitaInfo = (idAttivita, cb) => {
    controller.controllaInt(idAttivita, "Il Codice dell'Attività deve essere un numero!");
    return db.pool.query('select id, ragione_sociale, email, telefono, indirizzo from public.attivita where id=$1',
        [idAttivita], (error, results) => {
            cb(error, results)
        });
}

/**
 * Crea un nuovo Dipendente.
 * @param {*} request 
 * @param {*} response 
 */
const creaDipendente = (request, response) => {
    controller.controllaDatiRegister(request, utente.TIPO);

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(request.body.password + process.env.SECRET_PWD, salt);
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

    db.pool.query('INSERT INTO public.utenti ( nome, cognome, email, password, salt, telefono, indirizzo, tipo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [request.body.nome, request.body.cognome, request.body.email, hash, salt, request.body.telefono, request.body.indirizzo, tipo], (error, results) => {
            if (error) return response.status(400).send(db.ERRORE_DATI_QUERY);

            utente.findUserByEmail(request.body.email, (err, results) => {
                if (err) return response.status(500).send('Server error!');

                const dipendente = JSON.parse(JSON.stringify(results.rows));

                if (dipendente.length == 1) {
                    db.pool.query(query, [dipendente[0].id, decoded_token.id], (error, results) => {
                        if (error) return response.status(400).send(db.ERRORE_DATI_QUERY);
                        return response.status(200).send({ 'esito': "1" });
                    })
                }
                else return response.status(500).send("Server error!");
            });
        })
}

/**
 * Elimina il Dipendente selezionato.
 * @param {*} request Request con il parametro "id" del Dipendente da eliminare
 * @param {*} response 
 * @param {*} decoded_token JWT decodificato dell'Attività
 */
const eliminaDipendente = (request, response, decoded_token) => {
    controller.controllaInt(request.params.id, "Il Codice del Dipendente deve essere un numero!");
    const id = parseInt(request.params.id);

    cercaDipendenteById(id, decoded_token, (err, results) => {
        if (err) return response.status(500).send('Server Error!');
        if (controller.controllaRisultatoQuery(results)) return response.status(404).send('Dipendente non trovato!');

        db.pool.query('DELETE FROM public.utenti WHERE id = $1', [id], (error, results) => {
            return response.status(200).send({ 'esito': "1" });
        })
    });
}

/**
 * Ritorna le Informazioni di un Dipendente.
 * @param {*} id ID del Dipendente
 * @param {*} tipo Tipologia del Dipendente
 * @param {*} cb Callback
 * @returns il risultato della query
 */
const getDipendenteInfo = (id, tipo, cb) => {
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

    return db.pool.query(query, [id], (error, results) => {
        cb(error, results)
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

    return db.pool.query(query, [decoded_token.id], (error, results) => {
        cb(error, results)
    });
}

/**
 * Ritorna il numero dei Dipendenti dell'Attività.
 * @param {*} token JWT dell'Attività
 * @param {*} cb Callback
 * @returns il risultato della query
 */
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

    return db.pool.query(query, [idAttivita], (error, results) => { cb(error, results) });
}

/**
 * Modifica le informazioni dell'Attività.
 * @param {*} request 
 * @param {*} response 
 */
const modificaAttivita = (request, response) => {
    controller.controllaInt(request.params.id, "Il Codice dell'Attività deve essere un numero!");
    controller.controllaDatiAccount(request, TIPO);

    const id = parseInt(request.params.id);

    cercaAttivitaById(id, (err, results) => {
        if (err) return response.status(500).send('Server Error!');
        if (controller.controllaRisultatoQuery(results)) return response.status(404).send('Attivita non trovata!');

        db.pool.query('UPDATE public.attivita SET ragione_sociale = $1, email = $2, telefono = $3, indirizzo = $4 WHERE id = $5',
            [request.body.ragione_sociale, request.body.email, request.body.telefono, request.body.indirizzo, id], (error, results) => {
                if (error) return response.status(400).send(db.ERRORE_DATI_QUERY);
                return response.status(200).send({ 'esito': "1" });
            })
    });
}

/**
 * Modifica la Password di un'Attvità.
 * @param {*} request 
 * @param {*} response 
 * @param {*} decoded_token JWT decodificato dell'Attività
 */
const modificaPassword = (request, response, decoded_token) => {
    controller.controllaInt(request.params.id, "L'ID deve essere un numero!");
    controller.controllaPassword(request.body.old_password);
    controller.controllaPassword(request.body.new_password);

    const id = parseInt(request.params.id);

    if (decoded_token.tipo != 'DITTA_TRASPORTI' && decoded_token.tipo != 'MAGAZZINO' && decoded_token.tipo != 'NEGOZIO')
        return response.status(400).send('Bad request!');

    cercaAttivitaById(id, (err, results) => {
        if (err) return response.status(500).send('Server Error!');
        general.cambiaPassword(request, response, results, id, TIPO);
    });
}

module.exports = {
    TIPO,
    cercaDipendenteById,
    creaAttivita,
    creaDipendente,
    eliminaDipendente,
    findAttivitaByEmail,
    getAttivitaInfo,
    getDipendenteInfo,
    getDipendenti,
    getDipendentiCount,
    modificaAttivita,
    modificaPassword
}