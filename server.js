const express = require('express');
const bodyParser = require('body-parser');
const authRoute = require('./src/routes/authRoute');

const app = express();
const port = 8080;

app.use(bodyParser.json());

// Include authentication routes
app.use('/', authRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
