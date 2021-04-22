const express = require('express');
const app = express();
const db = require('./queries');

//Run the app by serving the static files in the dist directory
app.use(express.static(__dirname + '/www'));

app.use(express.json());

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', express.json(), db.createUser)
app.put('/users/:id', express.json(), db.updateUser)
app.delete('/users/:id', db.deleteUser)

app.get('/*', function (req, res) {
    res.sendFile('index.html', { root: __dirname + '/www' }
    );
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
