require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRoute = require('./src/routes/authRoute');
const tokenRoute = require('./src/routes/tokenRoute');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Include authentication routes
app.use('/', authRoute);
app.use('/token', tokenRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
