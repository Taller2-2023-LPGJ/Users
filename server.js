'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/users', (req, res) => {
    //const { name, email } = req.body;
    res.send('AAAAAAA');
    //res.send('registrado: '+ name);
});

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});
