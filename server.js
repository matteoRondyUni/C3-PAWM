const express = require('express');
const app = express();
const db = require('./queries');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "secretkey23456";

//Run the app by serving the static files in the dist directory
app.use(express.static(__dirname + '/www'));

app.use(express.json());

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', express.json(), db.createUser)
app.put('/users/:id', express.json(), db.updateUser)
app.delete('/users/:id', db.deleteUser)

app.post('/users/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    db.findUserByEmail(email, (err, results) => {
        if (err) return res.status(500).send('Server Error!');
        const user = JSON.parse(JSON.stringify(results.rows));
        if (user.length == 0) return res.status(404).send('Utente non trovato!');

        const result = password == user[0].password;
        if (!result) return res.status(401).send('Password non valida!');

        const expiresIn = 24 * 60 * 60;
        const accessToken = jwt.sign({ id: user[0].id }, SECRET_KEY, { expiresIn: expiresIn });
        res.status(200).send({ "access_token": accessToken, "expires_in": expiresIn });
    })
});

app.post('/users/register', (req, res) => {
    db.findUserByEmail(req.body.email, (err, results) => {
        if (err) return res.status(500).send('Server error!');

        const users = JSON.parse(JSON.stringify(results.rows));

        if (users.length == 0) {
            db.createUser(req, res);
            return res.status(200).send('Utente creato correttamente');
        }
        else return res.status(404).send("L'email \'" + users[0].email + "\' è già stata usata!");
    });
});


app.get('/*', function (req, res) {
    res.sendFile('index.html', { root: __dirname + '/www' }
    );
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
