const con = require('../backend.js');

module.exports = {
    name: 'currenttimezone',
    description: ':map: Mostra a região que o bot está definido.',
    async execute(msg, args){
        const region = await con.get(msg.guild.id, 'scheduled_region')
        msg.channel.send(`O fuso horário atual está em ${region}`)
    },
}