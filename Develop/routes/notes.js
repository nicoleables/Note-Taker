const noteRouter = require('express').Router();
const path = require('path');
const fs = require('fs');

noteRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

noteRouter.get('/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading data');
        } else {
            const notes = JSON.parse(data);
            res.setHeader('Content-Type', 'application/json');
            res.send(notes);
        }
    });
});

module.exports = { noteRouter };