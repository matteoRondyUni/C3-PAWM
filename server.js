const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./queries');

// Run the app by serving the static files in the dist directory
//app.use(express.static(__dirname + '/www'));

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)


//app.get('/*', function (req, res) {
//    res.sendFile('index.html', { root: __dirname + '/www' }
//    );
//});

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
