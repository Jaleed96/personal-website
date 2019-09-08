const express = require('express');
const app = express();
const cors = require('cors');
const github = require('./controllers/github');

const PORT = process.env.PORT || 8080;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello world!');
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})

app.get('/getAllRepos', (req, res) => {
    github.getAllRepos().then((response) => {
        res.json(JSON.parse(response));
    }).catch((error) => {
        res.send(error);
    });
})