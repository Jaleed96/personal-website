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

app.get('/getRepositories', (req, res) => {
    github.fetchRepositories().then((response) => {
        res.json(response);
    }).catch((error) => {
        console.log(error);
        res.status(403).send(error);
    });
})