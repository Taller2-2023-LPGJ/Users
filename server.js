require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const authRoute = require('./src/routes/authRoute');
const tokenRoute = require('./src/routes/tokenRoute');
const adminRoute = require('./src/routes/adminRoute');
const userRoute = require('./src/routes/userRoute');

const app = express();
const port = 3000;
app.use(cors());

app.use(bodyParser.json());

// Include authentication routes
app.use('/', authRoute);
app.use('/token', tokenRoute);
app.use('/admins', adminRoute);
app.use('/users', userRoute);

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

module.exports = app;
