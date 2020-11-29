const con = require('../backend.js');
const Discord = require("discord.js")

module.exports = {
    name: 'count',
    description: ':speech_balloon: Mostra o total de mensagens enviada no dia.',
    async execute(msg){
        let messageNumber = await con.get(msg.guild.id, 'number_of_mensages')

        console.log(messageNumber)

        // colocar undefined qualquer coisa || messageNumber == undefined
        if(!messageNumber || messageNumber == 0){
            msg.channel.send('O servidor precisa estar setupado ou ainda não foram enviadas mensagens.')
            return
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(`Hoje foi enviada ${messageNumber} mensagens`)
            .setColor(msg.member.displayHexColor)
            .setDescription('Sim este servidor enviou tudo isso hoje')
            .setThumbnail(msg.guild.iconURL())

        msg.channel.send(embed);
    },
}