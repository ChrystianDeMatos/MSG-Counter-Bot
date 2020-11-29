const Discord = require("discord.js")
const config = require('../config.json')
const prefix = config.prefix
const utils = require('../utils.js')

module.exports = {
    name: 'record',
    description: ':date: Mostra os recordes de mensagens do servidor.',
    execute(msg){
        utils.sendEmbedServerRecords(msg.channel, msg.guild)
    },
}
//sendEmbedServerRecords(msg.channel, msg.guild)