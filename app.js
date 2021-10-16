"use strict";

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const DAO = require(__dirname+"/DAO");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

/* app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))); */
app.get('/ngmbk/api', (request, response) => {
    DAO.selectData(request.query.block, request.query.branch, request.query.salesman)
        .then(res => {
            response.send(res.rows);
        })
        .catch(e => console.error(e.stack));
});
/* app.post('/api', (request, response) => {
    DAO.selectData(request.body.block, request.body.branch, request.body.salesman)
        .then(res => {
            response.send(res.rows);
        })
        .catch(e => console.error(e.stack));
}); */
app.get('/ngmbk/nest', (request, response) => {
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