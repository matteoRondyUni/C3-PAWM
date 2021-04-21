const express = require('express');
const app = express();
const db = require('./queries');
const bodyParser = require('body-parser')
// create application/json parser
const jsonParser = bodyParser.json()

//Run the app by serving the static files in the dist directory
app.use(express.static(__dirname + '/www'));

//app.get('/users', (request, response) => {
//   response.json({ info: 'Node.js, Express, and Postgres API' })
//})

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', jsonParser, db.createUser)
app.put('/users/:id', jsonParser, db.updateUser)
app.delete('/users/:id', db.deleteUser)

app.use(bodyParser());

app.get('/*', function (req, res) {
    res.sendFile('index.html', { root: __dirname + '/www' }
    );
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
