const express = require('express');
const app = express();

// Run the app by serving the static files in the dist directory
app.use(express.static(__dirname + '/www'));

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);

// ---- SERVE STATIC FILES ---- //
//app.server.get('*.*', express.static(APPPATH, {maxAge: '1y'}));

// ---- SERVE APLICATION PATHS ---- //
app.all('*', function (req, res) {
    res.status(200).sendFile(`/`, {root: APPPATH});
});