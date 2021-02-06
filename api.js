const express = require('express');
const app = express();
var cors = require('cors')
const backend = require('./backend.js');


// app.get('/api/servers', async (req, res) => {
//     console.log('funcioneiii');
//     let resp = await backend.getServers();
//     res.send(resp);
// })

app.use(cors())

app.get('/api/servers/:teste', (async (req, res, next) => {
    try{
        console.log('funcioneii');
        console.log(req.params.teste)
        let resp = await backend.getRecords(req.params.teste);
        res.send(resp);
    }catch(e){
        next(e)
    }
}))

app.listen(process.env.PORT || 3000)