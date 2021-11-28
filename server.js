const express = require('express');
const fs = require('fs');
const path = require('path');
let db = require('./db/db.json')
let idCounter = db.at(-1).id;

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.json(db);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.post('/api/notes', (req, res) => {
    idCounter ++;
    req.body.id = idCounter.toString();
    const newNote = req.body;
    db.push(newNote);
    fs.writeFile(
        path.join(__dirname, './db/db.json'), 
        JSON.stringify(db, null, 4),
        (err) => {
            if (err) {
                throw err;
            }
        }
    );

    const response = {
        status: 'success',
        body: newNote,
    };

    res.json(response);
});

app.delete('/api/notes/:id', (req, res) => {
    db = db.filter(note => note.id !== req.params.id);
    fs.writeFile(
        path.join(__dirname, './db/db.json'), 
        JSON.stringify(db, null, 4),
        (err) => {
            if (err) {
                throw err;
            }
        }
    );
    res.json(db);
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});