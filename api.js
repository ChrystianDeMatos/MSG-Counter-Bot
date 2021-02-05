const express = require('express');
const app = express();
const backend = require('./backend.js');

app.get('/', async (req, res) => {
    let resp = await backend.getServers();
    res.send(resp);
})

app.listen(process.env.PORT || 3000)