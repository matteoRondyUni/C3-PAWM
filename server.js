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
        jwt.verify(token, SECRET_KEY);
        return true;
    } catch (error) {
        return false;
    }
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
 * REST - Elimina dipendente
 */
app.delete('/dipendenti/:id', (req, res) => {
    const token = req.headers.token;
    if (verificaAttivita(token)) {
        return db.eliminaDipendente(req, res, jwt.decode(token));
    } else {
        return res.status(401).send('JWT non valido!');
    }
});

/**
 * REST - Login User
 */
app.post('/users/login', (req, res) => {
    const password = req.body.password;
    db.findUserByEmail(req.body.email, (err, results) => {
        if (err) return res.status(500).send('Server Error!');
        const user = JSON.parse(JSON.stringify(results.rows));
        if (user.length == 0) return res.status(404).send('Utente non trovato!');

        const toControl = bcrypt.hashSync(password + "secret", user[0].salt);
        const result = (user[0].password == toControl);
        if (!result) return res.status(401).send('Password non valida!');

        const expiresIn = 24 * 60 * 60;
        //TODO fa finire lo switch
        switch (user[0].tipo) {
            case "CLIENTE":
                const accessToken = jwt.sign({ id: user[0].id, tipo: user[0].tipo }, SECRET_KEY, { algorithm: 'HS256', expiresIn: expiresIn });
                return res.status(200).send({ "accessToken": accessToken });
            case "COMMERCIANTE":
                db.getCommercianteById(user[0].id, (err, results) => {
                    const commerciante = JSON.parse(JSON.stringify(results.rows));
                    const accessToken = jwt.sign({ id: commerciante[0].id, idNegozio: commerciante[0].id_negozio, tipo: "COMMERCIANTE" }, SECRET_KEY, { algorithm: 'HS256', expiresIn: expiresIn });
                    return res.status(200).send({ "accessToken": accessToken });
                });
                break;
            case "CORRIERE":
                break;
            case "MAGAZZINIERE":
                break;
        }
    })
});

/**
 * REST - Login Attività
 */
app.post('/attivita/login', (req, res) => {
    const password = req.body.password;
    db.findAttivitaByEmail(req.body.email, (err, results) => {
        if (err) return res.status(500).send('Server Error!');
        const attivita = JSON.parse(JSON.stringify(results.rows));
        if (attivita.length == 0) return res.status(404).send('Attività non trovata!');

        const toControl = bcrypt.hashSync(password + "secret", attivita[0].salt);
        const result = (attivita[0].password == toControl);
        if (!result) return res.status(401).send('Password non valida!');

        const expiresIn = 24 * 60 * 60;
        const accessToken = jwt.sign({ id: attivita[0].id, tipo: attivita[0].tipo }, SECRET_KEY, { algorithm: 'HS256', expiresIn: expiresIn });
        return res.status(200).send({ "accessToken": accessToken });
    })
});

/**
 * REST - Registrazione Cliente
 */
app.post('/register/cliente', (req, res) => {
    db.findUserByEmail(req.body.email, (err, results) => {
        if (err) return res.status(500).send('Server error!');

        const users = JSON.parse(JSON.stringify(results.rows));

        if (users.length == 0) {
            db.creaCliente(req, res);
            return res.status(200).send({ 'esito': "1" });
        }
        else return res.status(400).send("L'email \'" + users[0].email + "\' è già stata usata!");
    });
});

/**
 * REST - Registrazione Dipendente
 */
app.post('/register/dipendente', (req, res) => {
    const token = req.body.token_value;

    if (verificaAttivita(token)) {
        db.findUserByEmail(req.body.email, (err, results) => {
            if (err) return res.status(500).send('Server error!');

            const dipendenti = JSON.parse(JSON.stringify(results.rows));

            if (dipendenti.length == 0) {
                db.creaDipendente(req, res);
            }
            else return res.status(400).send("L'email \'" + dipendenti[0].email + "\' è già stata usata!");
        });
    } else {
        return res.status(401).send('JWT non valido!');
    }
});

/**
 * REST - Registrazione Attivita'
 */
app.post('/register/attivita', (req, res) => {
    db.findAttivitaByEmail(req.body.email, (err, results) => {
        if (err) return res.status(500).send('Server error!');

        const attivita = JSON.parse(JSON.stringify(results.rows));

        if (attivita.length == 0) {
            db.creaAttivita(req, res);
            return res.status(200).send({ 'esito': "1" });
        }
        else return res.status(400).send("L'email \'" + attivita[0].email + "\' è già stata usata!");
    });
});

app.get('/dipendenti', (req, res) => {
    const token = req.headers.token;

    if (verificaAttivita(token)) {
        db.getDipendenti(token, (err, results) => {
            if (err) return res.status(500).send('Server error!');

            const dipendenti = JSON.parse(JSON.stringify(results.rows));
            const to_return = { 'results': dipendenti };

            return res.status(200).send(to_return);
        });
    } else {
        return res.status(401).send('JWT non valido!');
    }
});

app.get('/inventario', (req, res) => {
    const token = req.headers.token;

    if (verificaNegozio(token)) {
        db.getInventario(token, (err, results) => {
            if (err) return res.status(500).send('Server error!');

            const inventario = JSON.parse(JSON.stringify(results.rows));
            const to_return = { 'results': inventario };

            return res.status(200).send(to_return);
        });
    } else {
        return res.status(401).send('JWT non valido!');
    }
});

app.post('/prodotto', (req, res) => {
    if (verificaAttivita(req.body.token_value)) {
        db.creaProdotto(req, res);
    } else {
        return res.status(401).send('JWT non valido!');
    }
});

app.delete('/prodotto/:id', (req, res) => {
    const token = req.headers.token;
    if (verificaAttivita(token)) {
        return db.eliminaProdotto(req, res, jwt.decode(token));
    } else {
        return res.status(401).send('JWT non valido!');
    }
});

app.put('/prodotto/:id', (req, res) => {
    const token = req.body.token_value;
    if (verificaAttivita(token)) {
        return db.modificaProdotto(req, res, jwt.decode(token));
    } else {
        return res.status(401).send('JWT non valido!');
    }
});


app.post('/control/JWT', (req, res) => {
    const token = req.body.value;
    try {
        jwt.verify(token, SECRET_KEY);
        return res.status(200).send();
    } catch (err) {
        // err
        return res.status(400).send({ "error": err });
    }
})

app.post('/verifica', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.findUserByEmail(email, (err, results) => {
        if (err) return res.status(500).send('Server Error!');
        const user = JSON.parse(JSON.stringify(results.rows));
        if (user.length == 0) return res.status(404).send('Utente non trovato!');

        const salt = user[0].salt;
        const hash = user[0].password;
        const hash2 = bcrypt.hashSync(password + "secret", salt);
        bool = (hash == hash2);

        console.log("password in chiaro: ", password);
        console.log("\npassword hash: ", hash);
        console.log("\npassword hash2: ", hash2);
        console.log("\nbool: ", bool);

        return res.status(200).send({ "salt: ": salt });
    })
})

app.post('/ordini/crea', (req, res) => {
    console.log("ordini/crea");
    db.creaOrdine(req, res);
    return res.status(200).send({ 'esito': "1" });
})

app.get('/*', function (req, res) {
    res.sendFile('index.html', { root: __dirname + '/www' });
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);