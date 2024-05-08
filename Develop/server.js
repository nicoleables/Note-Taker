const express = require('express');
const path = require('path');
const fs = require('fs'); 

const { pageRouter } = require('./routes/pages');
const { noteRouter } = require('./routes/notes');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', pageRouter);
app.use('/notes', noteRouter);

app.get('/api/notes', (req, res) => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf8');
        const notes = JSON.parse(data);
        res.json(notes);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error reading data');
    }
});

app.post('/api/notes', (req, res) => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf8');
        const notes = JSON.parse(data);

        const newNote = {
            id: notes.length + 1,
            title: req.body.title,
            text: req.body.text
        };

        notes.push(newNote);

        fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes));

        res.json(newNote);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving note');
    }
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    try {
        const data = fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf8');
        let notes = JSON.parse(data);

        const noteIndex = notes.findIndex(note => note.id === parseInt(noteId));

        if (noteIndex !== -1) {
            notes.splice(noteIndex, 1);

            fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes));

            res.json({ message: 'Note deleted successfully' });
        } else {
            res.status(404).send('Note not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting note');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

