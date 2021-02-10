const express = require('express');
const app = express();
var cors = require('cors')
const backend = require('./backend.js');
const imagesCreator = require('./imagesCreator.js')





// app.get('/api/servers', async (req, res) => {
//     console.log('funcioneiii');
//     let resp = await backend.getServers();
//     res.send(resp);
// })

app.use(cors())

app.get('/', (async (req, res, next) => {
    try {
        res.send('ola');
    } catch (e) {
        next(e)
    }
}))

app.get('/api/servers/:teste', (async (req, res, next) => {
    try {
        console.log('funcioneii');
        console.log(req.params.teste)
        let resp = await backend.getRecords(req.params.teste);
        res.send(resp);
    } catch (e) {
        next(e)
    }
}))

app.get('/api/servers/img/:teste', (async (req, res, next) => {
    try {
        //console.log(req.params.teste)
        //let resp = await backend.getRecords(req.params.teste);
        res.send(await imagesCreator.testt(req.params.teste));
        //res.send(image);
    } catch (e) {
        next(e)
    }
}))



app.listen(process.env.PORT || 3000)