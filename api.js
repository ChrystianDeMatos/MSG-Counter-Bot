const express = require('express');
const app = express();
var cors = require('cors')
const backend = require('./backend.js');
const imagesCreator = require('./imagesCreator.js')

const Discord = require("discord.js")
const bot = new Discord.Client();
const token = process.env.token
bot.login(token)

// function botGuild(id){
//     return bot.guilds.cache.get(id);
// }

//const { botGuild } = require('./main.js')

app.use(cors())

app.get('/', (async (req, res, next) => {
    try {
        res.send('ola');
    } catch (e) {
        next(e)
    }
}))

app.get('/api/servers/:serverId', (async (req, res, next) => {
    try {
        let resp = await backend.getRecords(req.params.serverId, false);
        res.send(resp);
    } catch (e) {
        next(e)
    }
}))

app.get('/api/servers/img/:serverId', (async (req, res, next) => {
    try {
        res.send(await imagesCreator.create(req.params.serverId));
    } catch (e) {
        next(e)
    }
}))

app.get('/api/serversList/', (async (req, res, next) => {
    try {
        let resp = await backend.getServers();
        resp.map((server, index) => { 
            let guild = bot.guilds.cache.get(server.server_id)
            resp[index].name = guild.name
            resp[index].img_url = guild.iconURL() 
        })
        res.send(resp);
    } catch (e) {
        next(e)
    }
}))

app.listen(process.env.PORT || 3000)