const express = require('express');
const app = express();
const db = require('./queries');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "secretkey23456";
const bcrypt = require('bcrypt');

//Run the app by serving the static files in the dist directory
app.use(express.static(__dirname + '/www'));

app.use(express.json());

/**
 * Controlla la correttezza del JWT.
 * @param {JSON} token JWT da controllare
 */
function verificaJWT(token) {
    try {
        if (token == null || token == '' || token == undefined) return false;
        jwt.verify(token, SECRET_KEY);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Controlla che il JWT corrisponda ad una Attività.
 * @param {JSON} token JWT da controllare
 */
function verificaAttivita(token) {
    if (verificaJWT(token)) {
        tipo = (jwt.decode(token)).tipo;
        return (tipo == "NEGOZIO" || tipo == "DITTA_TRASPORTI" || tipo == "MAGAZZINO");
    } else return false;
}

/**
 * Controlla che il JWT corrisponda ad un Negozio o ad un Commerciante.
 * @param {JSON} token JWT da controllare
 */
function verificaNegozio(token) {
    if (verificaJWT(token)) {
        tipo = (jwt.decode(token)).tipo;
        return (tipo == "NEGOZIO" || tipo == "COMMERCIANTE");
    } else return false;
}

/**
 * Controlla che il JWT corrisponda ad un Magazzino o ad un Magazziniere.
 * @param {JSON} token JWT da controllare
 */
function verificaMagazzino(token) {
    if (verificaJWT(token)) {
        tipo = (jwt.decode(token)).tipo;
        return (tipo == "MAGAZZINO" || tipo == "MAGAZZINIERE");
    } else return false;
}

/**
 * Controlla che il JWT corrisponda ad una Ditta di trasporti.
 * @param {JSON} token JWT da controllare
 */
function verificaDittaTrasporti(token) {
    if (verificaJWT(token)) {
        tipo = (jwt.decode(token)).tipo;
        return (tipo == "DITTA_TRASPORTI");
    } else return false;
}

/**
 * Controlla che il JWT corrisponda ad un Corriere.
 * @param {JSON} token JWT da controllare
 */
function verificaCorriere(token) {
    if (verificaJWT(token)) {
        tipo = (jwt.decode(token)).tipo;
        return (tipo == "CORRIERE");
    } else return false;
}

/**
 * Controlla che il JWT corrisponda ad un Cliente.
 * @param {JSON} token JWT da controllare
 */
function verificaCliente(token) {
    if (verificaJWT(token)) {
        tipo = (jwt.decode(token)).tipo;
        return (tipo == "CLIENTE");
    } else return false;
}

/**
 * Controlla che il JWT corrisponda ad un Utente.
 * @param {JSON} token JWT da controllare
 */
function verificaUtente(token) {
    if (verificaJWT(token)) {
        tipo = (jwt.decode(token)).tipo;
        return (tipo == "CLIENTE" || tipo == "CORRIERE" || tipo == "MAGAZZINIERE" || tipo == "COMMERCIANTE");
    } else return false;
}

/**
 * Imposta il formato della Data degli Ordini.
 * @param {*} ordini
 */
function formatDataOrdine(ordini) {
    ordini.forEach(ordine => {
        var tmp = new Date(ordine.data_ordine);
        var data = tmp.getDate() + '/' + (tmp.getMonth() + 1) + '/' + tmp.getFullYear();
        ordine.data_ordine = data;
    })
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
 * Ritorna il risultato di una query in formato JSON.
 * @param {*} response 
 * @param {*} results Risultato della query da ritornare
 */
function returnDataJSON(response, results) {
    const data = JSON.parse(JSON.stringify(results.rows));
    const to_return = { 'results': data };

    response.status(200).send(to_return);
}

/**
 * Ritorna gli Ordini in formato JSON.
 * @param {*} response 
 * @param {*} results Risultato della query con gli Ordini da ritornare
 */
function returnOrdiniJSON(response, results) {
    const ordini = JSON.parse(JSON.stringify(results.rows));
    formatDataOrdine(ordini);
    const to_return = { 'results': ordini };

    response.status(200).send(to_return);
}

/**
 * REST - GET
 */

/**
 * REST - Ritorna la lista dei Dipendenti
 */
app.get('/dipendenti', (req, res) => {
    const token = req.headers.token;

    if (verificaAttivita(token)) {
        db.getDipendenti(token, (err, results) => {
            if (err) return res.status(500).send('Server error!');
            returnDataJSON(res, results);
        });
    } else return res.status(401).send('JWT non valido!');
});

/**
 * REST - Ritorna la lista dell'Inventario
 */
app.get('/inventario', (req, res) => {
    const token = req.headers.token;

    if (verificaNegozio(token)) {
        db.getInventario(token, (err, results) => {
            if (err) return res.status(500).send('Server error!');
            returnDataJSON(res, results);
        });
    } else return res.status(401).send('JWT non valido!');
});

/**
 * REST - Ritorna il numero dei Prodotti all'interno dell'Inventario
 */
app.get('/inventario/count', (req, res) => {
    const token = req.headers.token;

    if (verificaNegozio(token)) {
        db.getInventarioCount(token, (err, results) => {
            if (err) return res.status(500).send('Server error!');

            const count = JSON.parse(JSON.stringify(results.rows));
            const to_return = count[0];

            return res.status(200).send(to_return);
        });
    } else return res.status(401).send('JWT non valido!');
});

/**
 * REST - Ritorna il numero dei Dipendenti dell'Attività
 */
app.get('/dipendenti/count', (req, res) => {
    const token = req.headers.token;

    if (verificaAttivita(token)) {
        db.getDipendentiCount(token, (err, results) => {
            if (err) return res.status(500).send('Server error!');

            const count = JSON.parse(JSON.stringify(results.rows));
            const to_return = count[0];

            return res.status(200).send(to_return);
        });
    } else return res.status(401).send('JWT non valido!');
});

/**
 * REST - Ritorna il numero dei Magazzini 
 */
app.get('/magazzini/count', (req, res) => {
    if (verificaJWT(req.headers.token)) {
        db.getMagazziniCount((err, results) => {
            if (err) return res.status(500).send('Server error!');

            const count = JSON.parse(JSON.stringify(results.rows));
            const to_return = count[0];

            return res.status(200).send(to_return);
        });
    } else return res.status(401).send('JWT non valido!');
});

/**
 * REST - Ritorna il numero dei Negozio
 */
app.get('/negozi/count', (req, res) => {
    if (verificaJWT(req.headers.token)) {
        db.getNegoziCount((err, results) => {
            if (err) return res.status(500).send('Server error!');

            const count = JSON.parse(JSON.stringify(results.rows));
            const to_return = count[0];

            return res.status(200).send(to_return);
        });
    } else return res.status(401).send('JWT non valido!');
});

/**
 * REST - Ritorna il numero delle Ditte di Trasporti
 */
app.get('/ditte/count', (req, res) => {
    if (verificaJWT(req.headers.token)) {
        db.getDitteTrasportiCount((err, results) => {
            if (err) return res.status(500).send('Server error!');

            const count = JSON.parse(JSON.stringify(results.rows));
            const to_return = count[0];

            return res.status(200).send(to_return);
        });
    } else return res.status(401).send('JWT non valido!');
});

/**
 * REST - Ritorna le statistiche delle vendite di un Negozio o di un Cliente
 */
app.get('/ordini/stats', (req, res) => {
    const token = req.headers.token;

    if (verificaNegozio(token) || verificaCliente(token)) {
        db.getOrdiniStats(token, res, (tmp) => {
            const stats = JSON.parse(JSON.stringify(tmp));
            const to_return = { 'results': stats };
            return res.status(200).send(to_return);
        });
    } else return res.status(401).send('JWT non valido!');
});

/**
 * REST - Ritorna la lista deglio Ordini
 */
app.get('/ordini', (req, res) => {
    const token = req.headers.token;

    if (verificaNegozio(token)) {
        db.getOrdiniNegozio(token, (err, results) => {
            if (err) return res.status(500).send('Server error!');
            returnOrdiniJSON(res, results);
        });
    } else if (verificaMagazzino(token)) {
        db.getOrdiniMagazzino(token, (err, results) => {
            if (err) return res.status(500).send('Server error!');
            returnOrdiniJSON(res, results);
        });
    } else if (verificaDittaTrasporti(token)) {
        db.getOrdiniDittaTrasporti(token, (err, results) => {
            if (err) return res.status(500).send('Server error!');
            returnOrdiniJSON(res, results);
        });
    } else if (verificaCliente(token)) {
        db.getOrdiniCliente(token, (err, results) => {
            if (err) return res.status(500).send('Server error!');
            returnOrdiniJSON(res, results);
        });
    } else {
        return res.status(401).send('JWT non valido!');
    }
})

/**
 * REST - Ritorna la lista delle Merci collegate all'Ordine
 */
app.get('/merci/:idOrdine', (req, res) => {
    if (verificaJWT(req.headers.token)) {
        try {
            db.getMerciOrdine(req, (err, results) => {
                if (err) return res.status(500).send('Server error!');
                if (controllaRisultatoQuery(results)) return res.status(400).send("L'Ordine non ha merci collegate!");
                returnDataJSON(res, results);
            });
        } catch (error) {
            return res.status(400).send(error);
        }
    } else return res.status(401).send('JWT non valido!');
});

/**
 * REST - Ritorna la lista delle Merci che un Corriere deve consegnare
 */
app.get('/corriere/consegna/merci', (req, res) => {
    if (verificaCorriere(req.headers.token)) {
        db.getMerciCorriere(req, (err, results) => {
            if (err) return res.status(500).send('Server error!');
            returnDataJSON(res, results);
        });
    } else return res.status(401).send('JWT non valido!');
});

/**
 * REST - Ritorna l'Indirizzo del Cliente a cui consegnare la Merce
 */
app.get('/corriere/merce/:idMerce/indirizzo/cliente', (req, res) => {
    if (verificaCorriere(req.headers.token)) {
        try {
            db.getIndirizzoCliente(req, (err, results) => {
                if (err) return res.status(500).send('Server error!');
                returnDataJSON(res, results);
            });
        } catch (error) {
            return res.status(400).send(error);
        }
    } else return res.status(401).send('JWT non valido!');
});

/**
 * REST - Ritorna la lista dei Magazzini
 */
app.get('/magazzini', (req, res) => {
    db.getMagazzini((err, results) => {
        if (err) return res.status(500).send('Server error!');
        returnDataJSON(res, results);
    })
});

/**
 * REST - Ritorna le Informazioni del Magazzino
 */
app.get('/magazzini/:id', (req, res) => {
    db.getMagazzino(req.params.id, (err, results) => {
        if (err) return res.status(500).send('Server error!');
        if (controllaRisultatoQuery(results)) return res.status(404).send('Magazzino non trovato!');
        returnDataJSON(res, results);
    })
});

/**
 * REST - Ritorna la lista delle Ditte di Trasporti
 */
app.get('/ditte-trasporti', (req, res) => {
    db.getDitteTrasporti((err, results) => {
        if (err) return res.status(500).send('Server error!');
        returnDataJSON(res, results);
    })
});

/**
 * REST - Ritorna le Informazioni della Ditta di Trasporti
 */
app.get('/ditte-trasporti/:id', (req, res) => {
    db.getDittaTrasporti(req.params.id, (err, results) => {
        if (err) return res.status(500).send('Server error!');
        if (controllaRisultatoQuery(results)) return res.status(404).send('Ditta di Trasporti non trovata!');
        returnDataJSON(res, results);
    })
});

/**
 * REST - Ritorna la lista dei Negozi
 */
app.get('/negozi', (req, res) => {
    db.getNegozi((err, results) => {
        if (err) return res.status(500).send('Server error!');
        returnDataJSON(res, results);
    })
});

/**
 * REST - Ritorna le Informazioni del Negozio
 */
app.get('/negozi/:id', (req, res) => {
    db.getNegozio(req.params.id, (err, results) => {
        if (err) return res.status(500).send('Server error!');
        if (controllaRisultatoQuery(results)) return res.status(404).send('Negozio non trovato!');
        returnDataJSON(res, results);
    })
});

/**
 * REST - Ritorna le Informazioni dell'Utente
 */
app.get('/info/utente', (req, res) => {
    const token = req.headers.token;
    if (verificaUtente(token)) {
        db.getUserInfo(jwt.decode(token).id, (err, results) => {
            if (err) return res.status(500).send('Server error!');
            returnDataJSON(res, results);
        })
    } else return res.status(401).send('JWT non valido!');
});

/**
 * REST - Ritorna le Informazioni dell'Attività
 */
app.get('/info/attivita', (req, res) => {
    const token = req.headers.token;
    if (verificaAttivita(token)) {
        db.getAttivitaInfo(jwt.decode(token).id, (err, results) => {
            if (err) return res.status(500).send('Server error!');
            returnDataJSON(res, results);
        })
    } else return res.status(401).send('JWT non valido!');
});

/**
 * REST - POST
 */

/**
 * REST - Login Utente
 */
app.post('/login/utente', (req, res) => {
    const password = req.body.password;

    try {
        db.findUserByEmail(req.body.email, (err, results) => {
            if (err) return res.status(500).send('Server Error!');
            if (controllaRisultatoQuery(results)) return res.status(404).send('Utente non trovato!');

            const user = JSON.parse(JSON.stringify(results.rows));

            const toControl = bcrypt.hashSync(password + "secret", user[0].salt);
            const result = (user[0].password == toControl);
            if (!result) return res.status(401).send('Password non valida!');

            const expiresIn = 24 * 60 * 60;

            switch (user[0].tipo) {
                case "CLIENTE":
                    const accessToken = jwt.sign({ id: user[0].id, tipo: user[0].tipo }, SECRET_KEY, { algorithm: 'HS256', expiresIn: expiresIn });
                    return res.status(200).send({ "accessToken": accessToken });
                case "COMMERCIANTE":
                    db.getDipendenteInfo(user[0].id, user[0].tipo, (err, results) => {
                        const commerciante = JSON.parse(JSON.stringify(results.rows));
                        const accessToken = jwt.sign({ id: commerciante[0].id, idNegozio: commerciante[0].id_negozio, tipo: user[0].tipo }, SECRET_KEY, { algorithm: 'HS256', expiresIn: expiresIn });
                        return res.status(200).send({ "accessToken": accessToken });
                    });
                    break;
                case "CORRIERE":
                    db.getDipendenteInfo(user[0].id, user[0].tipo, (err, results) => {
                        const corriere = JSON.parse(JSON.stringify(results.rows));
                        const accessToken = jwt.sign({ id: corriere[0].id, idDitta: corriere[0].id_ditta, tipo: user[0].tipo }, SECRET_KEY, { algorithm: 'HS256', expiresIn: expiresIn });
                        return res.status(200).send({ "accessToken": accessToken });
                    });
                    break;
                case "MAGAZZINIERE":
                    db.getDipendenteInfo(user[0].id, user[0].tipo, (err, results) => {
                        const magazziniere = JSON.parse(JSON.stringify(results.rows));
                        const accessToken = jwt.sign({ id: magazziniere[0].id, idMagazzino: magazziniere[0].id_magazzino, tipo: user[0].tipo }, SECRET_KEY, { algorithm: 'HS256', expiresIn: expiresIn });
                        return res.status(200).send({ "accessToken": accessToken });
                    });
                    break;
            }
        })
    } catch (error) {
        return res.status(400).send(error);
    }
});

/**
 * REST - Login Attività
 */
app.post('/login/attivita', (req, res) => {
    const password = req.body.password;
    try {
        db.findAttivitaByEmail(req.body.email, (err, results) => {
            if (err) return res.status(500).send('Server Error!');
            if (controllaRisultatoQuery(results)) return res.status(404).send('Attività non trovata!');

            const attivita = JSON.parse(JSON.stringify(results.rows));

            const toControl = bcrypt.hashSync(password + "secret", attivita[0].salt);
            const result = (attivita[0].password == toControl);
            if (!result) return res.status(401).send('Password non valida!');

            const expiresIn = 24 * 60 * 60;
            const accessToken = jwt.sign({ id: attivita[0].id, tipo: attivita[0].tipo }, SECRET_KEY, { algorithm: 'HS256', expiresIn: expiresIn });
            return res.status(200).send({ "accessToken": accessToken });
        })
    } catch (error) {
        return res.status(400).send(error);
    }
});

/**
 * REST - Registrazione Cliente
 */
app.post('/register/cliente', (req, res) => {
    try {
        db.findUserByEmail(req.body.email, (err, results) => {
            try {
                if (err) return res.status(500).send('Server error!');
                const users = JSON.parse(JSON.stringify(results.rows));

                if (users.length == 0)
                    db.creaCliente(req, res);
                else return res.status(400).send("L'email \'" + users[0].email + "\' è già stata usata!");
            } catch (error) {
                return res.status(400).send(error);
            }
        });
    } catch (error) {
        return res.status(400).send(error);
    }
});

/**
 * REST - Registrazione Dipendente
 */
app.post('/register/dipendente', (req, res) => {
    if (verificaAttivita(req.body.token_value)) {
        try {
            db.findUserByEmail(req.body.email, (err, results) => {
                try {
                    if (err) return res.status(500).send('Server error!');

                    const dipendenti = JSON.parse(JSON.stringify(results.rows));

                    if (dipendenti.length == 0)
                        db.creaDipendente(req, res);
                    else return res.status(400).send("L'email \'" + dipendenti[0].email + "\' è già stata usata!");
                } catch (error) {
                    return res.status(400).send(error);
                }
            });
        } catch (error) {
            return res.status(400).send(error);
        }
    } else return res.status(401).send('JWT non valido!');
});

/**
 * REST - Registrazione Attività
 */
app.post('/register/attivita', (req, res) => {
    try {
        db.findAttivitaByEmail(req.body.email, (err, results) => {
            try {
                if (err) return res.status(500).send('Server error!');

                const attivita = JSON.parse(JSON.stringify(results.rows));

                if (attivita.length == 0)
                    db.creaAttivita(req, res);
                else return res.status(400).send("L'email \'" + attivita[0].email + "\' è già stata usata!");
            } catch (error) {
                return res.status(400).send(error);
            }
        });
    } catch (error) {
        return res.status(400).send(error);
    }
});

/**
 * REST - Creazione Prodotto
 */
app.post('/prodotto', (req, res) => {
    if (verificaNegozio(req.body.token_value)) {
        try {
            db.creaProdotto(req, res);
        } catch (error) {
            return res.status(400).send(error);
        }
    } else return res.status(401).send('JWT non valido!');
});

/**
 * REST - Creazione Ordine
 */
app.post('/ordine', (req, res) => {
    if (verificaNegozio(req.body.token_value)) {
        try {
            db.creaOrdine(req, res);
        } catch (error) {
            return res.status(400).send(error);
        }
    } else return res.status(401).send('JWT non valido!');
})

/**
 * REST - PUT
 */

/**
 * REST - Imposta lo stato dell'Ordine a "RITIRATO"
 */
app.put('/ordine/:id', (req, res) => {
    const token = req.body.token_value;
    if (verificaMagazzino(token)) {
        try {
            db.ritiraOrdine(req, res, jwt.decode(token));
        } catch (error) {
            return res.status(400).send(error);
        }
    } else return res.status(401).send('JWT non valido!');
});

/**
 * REST - Modifica le Informazione dell'Attività
 */
app.put('/attivita/:id', (req, res) => {
    const token = req.body.token_value;
    if (verificaAttivita(token)) {
        try {
            db.modificaAttivita(req, res);
        } catch (error) {
            return res.status(400).send(error);
        }
    } else return res.status(401).send('JWT non valido!');
});

/**
 * REST - Modifica le Informazione dell'Utente
 */
app.put('/utente/:id', (req, res) => {
    const token = req.body.token_value;
    if (verificaUtente(token)) {
        try {
            db.modificaUtente(req, res);
        } catch (error) {
            return res.status(400).send(error);
        }
    } else return res.status(401).send('JWT non valido!');
});

/**
 * REST - Modifica la Password 
 */
app.put('/modifica/password/:id', (req, res) => {
    const token = req.body.token_value;
    if (verificaJWT(token)) {
        try {
            db.modificaPassword(req, res, jwt.decode(token));
        } catch (error) {
            return res.status(400).send(error);
        }
    } else return res.status(401).send('JWT non valido!');
});

/**
 * REST - Modifica le Informazioni di un Prodotto
 */
app.put('/prodotto/:id', (req, res) => {
    const token = req.body.token_value;
    if (verificaNegozio(token)) {
        try {
            db.modificaProdotto(req, res, jwt.decode(token));
        } catch (error) {
            return res.status(400).send(error);
        }
    } else return res.status(401).send('JWT non valido!');
});

/**
 * REST - Aggiunge un Corriere alla Merce
 */
app.put('/ditta-trasporti/ordine/merce/:id', (req, res) => {
    const token = req.body.token_value;
    if (verificaDittaTrasporti(token)) {
        try {
            db.aggiungiCorriere(req, res, jwt.decode(token));
        } catch (error) {
            return res.status(400).send(error);
        }
    } else return res.status(401).send('JWT non valido!');
});

/**
 * REST - Modifica lo stato della Merce
 *  PAGATO => IN_TRANSITO, IN_TRANSITO => CONSEGNATO
 */
app.put('/merci/:id', (req, res) => {
    const token = req.body.token_value;
    if (verificaCorriere(token)) {
        try {
            db.cambiaStatoMerce(req, res, jwt.decode(token));
        } catch (error) {
            return res.status(400).send(error);
        }
    } else return res.status(401).send('JWT non valido!');
})

/**
 * REST - DELETE
 */

/**
 * REST - Elimina dipendente
 */
app.delete('/dipendenti/:id', (req, res) => {
    const token = req.headers.token;
    if (verificaAttivita(token)) {
        try {
            db.eliminaDipendente(req, res, jwt.decode(token));
        } catch (error) {
            return res.status(400).send(error);
        }
    } else return res.status(401).send('JWT non valido!');
});

/**
 * REST - Elimina prodotto
 */
app.delete('/prodotto/:id', (req, res) => {
    const token = req.headers.token;
    if (verificaNegozio(token)) {
        try {
            db.eliminaProdotto(req, res, jwt.decode(token));
        } catch (error) {
            return res.status(400).send(error);
        }
    } else return res.status(401).send('JWT non valido!');
});

app.get('/*', function (req, res) {
    res.sendFile('index.html', { root: __dirname + '/www' });
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);