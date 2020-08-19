require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/usuario', function(req, res) {
    res.json('Hello World');
});

app.post('/usuario', function(req, res) {

    let body = req.body;
    res.json(body);
});

app.put('/usuario', function(req, res) {
    res.json('Hello World');
});
app.delete('/usuario', function(req, res) {
    res.json('Hello World');
});


app.listen(process.env.PORT, () => {
    console.log(`escuchando puerto ${process.env.PORT}`);
});