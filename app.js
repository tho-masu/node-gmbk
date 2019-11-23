"use strict";

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const DAO = require("./DAO");
const app = express();
const port = 3000;

const pg = require("pg");

const config = {
    user: "postgres",
    password: "postgres",
    host: "localhost",
    database: "nodejs",
    port: "5432"
};

const client = new pg.Client(config);

client.connect(e => {
    if (e) { throw e; }
    console.log('Connected');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

/* app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))); */
app.get('/api', (request, response) => {
    DAO.selectData(request.query.block, request.query.branch, request.query.salesman)
        .then(res => {
            response.send(res.rows);
        })
        .catch(e => console.error(e.stack));
});
app.post('/api', (request, response) => {
    DAO.selectData(request.body.block, request.body.branch, request.body.salesman)
        .then(res => {
            response.send(res.rows);
        })
        .catch(e => console.error(e.stack));
});
app.get('/nest', (request, response) => {
    DAO.getNest()
        .then(nest => {
            response.send(nest);
        })
        .catch(e => console.error(e.stack));
});

/*
app.post('/', (req, res) => {
    console.log(req.body);
    res.redirect('/');
});
*/

app.listen(port, () => console.log(`Example app listening on port ${port}!`));