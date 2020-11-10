
module.exports = {
    name: 'help',
    description: 'Help you with commands',
    execute(msg, args){
        const embed = new Discord.MessageEmbed()
            .setTitle(`Help`)
            .setColor(msg.member.displayHexColor)
            .setDescription('Aki a lista de comandos para o servidor.')
            .addFields(
                { name: '`' + prefix + 'setchannel`', value: 'Esse comando faz tatanana' },
                { name: '\u200B', value: '\u200B' },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
            )

        msg.channel.send(embed);
    },
}