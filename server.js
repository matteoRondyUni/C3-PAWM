const express = require('express');
const app = express();
const db = require('./queries');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "secretkey23456";
const bcrypt = require('bcrypt');

//Run the app by serving the static files in the dist directory
app.use(express.static(__dirname + '/www'));

app.use(express.json());

//TODO
function verificaJWT(token) {
    try {
        if (token == null || token == '' || token == undefined) return false;
        jwt.verify(token, SECRET_KEY);
        return true;
    } catch (error) {
        return false;
    }
}

//TODO
function formatDataOrdine(ordini) {
    ordini.forEach(ordine => {
        var tmp = new Date(ordine.data_ordine);
        var data = tmp.getDate() + '/' + (tmp.getMonth() + 1) + '/' + tmp.getFullYear();
        ordine.data_ordine = data;
    })
}

/**
 * Controlla che il JWT corrisponda ad una attività
 */
function verificaAttivita(token) {
    if (verificaJWT(token)) {
        tipo = (jwt.decode(token)).tipo;
        return (tipo == "NEGOZIO" || tipo == "DITTA_TRASPORTI" || tipo == "MAGAZZINO");
    } else {
        return false;
    }
}

/**
 * Controlla che il JWT corrisponda ad un negozio o ad un commerciante
 */
function verificaNegozio(token) {
    if (verificaJWT(token)) {
        tipo = (jwt.decode(token)).tipo;
        return (tipo == "NEGOZIO" || tipo == "COMMERCIANTE");
    } else {
        return false;
    }
}

/**
 * Controlla che il JWT corrisponda ad un magazzino o ad un magazziniere
 */
function verificaMagazzino(token) {
    if (verificaJWT(token)) {
        tipo = (jwt.decode(token)).tipo;
        return (tipo == "MAGAZZINO" || tipo == "MAGAZZINIERE");
    } else {
        return false;
    }
}

/**
 * Controlla che il JWT corrisponda ad una ditta di trasporti
 */
function verificaDittaTrasporti(token) {
    if (verificaJWT(token)) {
        tipo = (jwt.decode(token)).tipo;
        return (tipo == "DITTA_TRASPORTI");
    } else {
        return false;
    }
}

/**
 * Controlla che il JWT corrisponda ad un corriere
 */
function verificaCorriere(token) {
    if (verificaJWT(token)) {
        tipo = (jwt.decode(token)).tipo;
        return (tipo == "CORRIERE");
    } else {
        return false;
    }
}

/**
 * Controlla che il JWT corrisponda ad un cliente
 */
function verificaCliente(token) {
    if (verificaJWT(token)) {
        tipo = (jwt.decode(token)).tipo;
        return (tipo == "CLIENTE");
    } else {
        return false;
    }
}

/**
 * Controlla che il JWT corrisponda ad un utente
 */
function verificaUtente(token) {
    if (verificaJWT(token)) {
        tipo = (jwt.decode(token)).tipo;
        return (tipo == "CLIENTE" || tipo == "CORRIERE" || tipo == "MAGAZZINIERE" || tipo == "COMMERCIANTE");
    } else {
        return false;
    }
}

//TODO da commentare
function controllaRisultatoQuery(results, errorText) {
    const toControl = JSON.parse(JSON.stringify(results.rows));
    return (toControl.length == 0);
}

//TODO da commentare
function returnDataJSON(response, results) {
    const data = JSON.parse(JSON.stringify(results.rows));
    const to_return = { 'results': data };

    return response.status(200).send(to_return);
}

//TODO commentare
function returnOrdiniJSON(response, results) {
    const ordini = JSON.parse(JSON.stringify(results.rows));
    formatDataOrdine(ordini);
    const to_return = { 'results': ordini };

    return response.status(200).send(to_return);
}

function returnPippo()

/**
 * REST - GET
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

app.get('/inventario', (req, res) => {
    const token = req.headers.token;

    if (verificaNegozio(token)) {
        db.getInventario(token, (err, results) => {
            if (err) return res.status(500).send('Server error!');
            returnDataJSON(res, results);
        });
    } else return res.status(401).send('JWT non valido!');
});

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

app.get('/ordini/stats', (req, res) => {
    const token = req.headers.token;

    if (verificaNegozio(token)) {
        db.getOrdiniStats(token, res, (tmp) => {
            const stats = JSON.parse(JSON.stringify(tmp));
            const to_return = { 'results': stats };

            return res.status(200).send(to_return);
        });
    } else return res.status(401).send('JWT non valido!');
});

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

//TODO controllare che l'id dell'Ordine passato sia collegato all'id del token
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

//TODO commentare
app.get('/corriere/consegna/merci', (req, res) => {
    if (verificaCorriere(req.headers.token)) {
        db.getMerciCorriere(req, (err, results) => {
            if (err) return res.status(500).send('Server error!');
            returnDataJSON(res, results);
        });
    } else return res.status(401).send('JWT non valido!');
});

//TODO commentare
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

//TODO controllare errori
app.get('/magazzini', (req, res) => {
    db.getMagazzini((err, results) => {
        if (err) return res.status(500).send('Server error!');
        returnDataJSON(res, results);
    })
});

//TODO controllare errori
app.get('/magazzini/:id', (req, res) => {
    db.getMagazzino(req.params.id, (err, results) => {
        if (err) return res.status(500).send('Server error!');
        if (controllaRisultatoQuery(results)) return res.status(404).send('Magazzino non trovato!');
        returnDataJSON(res, results);
    })
});

//TODO controllare errori
app.get('/ditte-trasporti', (req, res) => {
    db.getDitteTrasporti((err, results) => {
        if (err) return res.status(500).send('Server error!');
        returnDataJSON(res, results);
    })
});

//TODO controllare errori
app.get('/ditte-trasporti/:id', (req, res) => {
    db.getDittaTrasporti(req.params.id, (err, results) => {
        if (err) return res.status(500).send('Server error!');
        if (controllaRisultatoQuery(results)) return res.status(404).send('Ditta di Trasporti non trovata!');
        returnDataJSON(res, results);
    })
});

//TODO controllare errori
app.get('/negozi', (req, res) => {
    db.getNegozi((err, results) => {
        if (err) return res.status(500).send('Server error!');
        returnDataJSON(res, results);
    })
});

//TODO controllare errori
app.get('/negozi/:id', (req, res) => {
    db.getNegozio(req.params.id, (err, results) => {
        if (err) return res.status(500).send('Server error!');
        if (controllaRisultatoQuery(results)) return res.status(404).send('Negozio non trovato!');
        returnDataJSON(res, results);
    })
});

//TODO commentare
app.get('/info/utente', (req, res) => {
    const token = req.headers.token;
    if (verificaUtente(token)) {
        db.getUserInfo(jwt.decode(token).id, (err, results) => {
            if (err) return res.status(500).send('Server error!');
            returnDataJSON(res, results);
        })
    } else return res.status(401).send('JWT non valido!');
});

//TODO commentare
app.get('/info/attivita', (req, res) => {
    const token = req.headers.token;
    if (verificaAttivita(token)) {
        db.getAttivitaInfo(jwt.decode(token).id, (err, results) => {
            //TODO fare refactor con /info/utente
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
                    db.verificaDipendenteLogin(user[0].id, user[0].tipo, (err, results) => {
                        const commerciante = JSON.parse(JSON.stringify(results.rows));
                        const accessToken = jwt.sign({ id: commerciante[0].id, idNegozio: commerciante[0].id_negozio, tipo: user[0].tipo }, SECRET_KEY, { algorithm: 'HS256', expiresIn: expiresIn });
                        return res.status(200).send({ "accessToken": accessToken });
                    });
                    break;
                case "CORRIERE":
                    db.verificaDipendenteLogin(user[0].id, user[0].tipo, (err, results) => {
                        const corriere = JSON.parse(JSON.stringify(results.rows));
                        const accessToken = jwt.sign({ id: corriere[0].id, idDitta: corriere[0].id_ditta, tipo: user[0].tipo }, SECRET_KEY, { algorithm: 'HS256', expiresIn: expiresIn });
                        return res.status(200).send({ "accessToken": accessToken });
                    });
                    break;
                case "MAGAZZINIERE":
                    db.verificaDipendenteLogin(user[0].id, user[0].tipo, (err, results) => {
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
 * REST - Registrazione Attivita'
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

app.put('/ordine/:id', (req, res) => {
    const token = req.body.token_value;
    if (verificaMagazzino(token)) {
        try {
            db.modificaOrdine(req, res, jwt.decode(token));
        } catch (error) {
            return res.status(400).send(error);
        }
    } else return res.status(401).send('JWT non valido!');
});

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