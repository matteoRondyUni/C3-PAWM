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
        const accessToken = jwt.sign({ id: user[0].id, tipo: user[0].tipo }, SECRET_KEY, { algorithm: 'HS256', expiresIn: expiresIn });
        return res.status(200).send({ "accessToken": accessToken });
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