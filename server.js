const express = require('express');
const app = express();
const db = require('./queries');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "secretkey23456";
const bcrypt = require('bcrypt');

//Run the app by serving the static files in the dist directory
app.use(express.static(__dirname + '/www'));

app.use(express.json());

app.post('/users/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    db.findUserByEmail(email, (err, results) => {
        if (err) return res.status(500).send('Server Error!');
        const user = JSON.parse(JSON.stringify(results.rows));
        if (user.length == 0) return res.status(404).send('Utente non trovato!');

        const result = (password == user[0].password);
        if (!result) return res.status(401).send('Password non valida!');

        const expiresIn = 24 * 60 * 60;
        const accessToken = jwt.sign({ id: user[0].id, tipo: user[0].tipo }, SECRET_KEY, { algorithm: 'HS256', expiresIn: expiresIn });
        return res.status(200).send({ "accessToken": accessToken });
    })
});

app.post('/register/cliente', (req, res) => {
    db.findUserByEmail(req.body.email, (err, results) => {
        if (err) return res.status(500).send('Server error!');

        const users = JSON.parse(JSON.stringify(results.rows));

        if (users.length == 0) {
            db.createCliente(req, res);
            return res.status(200).send({'esito': "1"});
        }
        else return res.status(400).send("L'email \'" + users[0].email + "\' è già stata usata!");
    });
});

app.post('/register/attivita', (req, res) => {
    db.findAttivitaByEmail(req.body.email, (err, results) => {
        if (err) return res.status(500).send('Server error!');

        const attivita = JSON.parse(JSON.stringify(results.rows));

        if (attivita.length == 0) {
            db.creaAttivita(req, res);
            return res.status(200).send({'esito': "1"});
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


app.get('/*', function (req, res) {
    res.sendFile('index.html', { root: __dirname + '/www' }
    );
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
