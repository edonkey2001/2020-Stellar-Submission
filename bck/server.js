const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const StellarSdk = require('stellar-sdk');
 
const app = express();
 
app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());
 
app.get('/', (req, res) => {
    res.json({
        message: 'Behold The MEVN Stack!'
    });
});
 
const port = process.env.PORT || 4000;
const host = '0.0.0.0';
app.listen(port, host);