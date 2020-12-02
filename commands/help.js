const Discord = require("discord.js")
const config = require('../config.json')
const prefix = config.prefix
const { bot } = require('../main.js')

module.exports = {
    name: 'help',
    description: ':robot: Mostra os comandos.',
    execute(msg, args){
        console.log(bot.commands);
        if(args.length == 0){
            const embed = new Discord.MessageEmbed()
                .setTitle(`Help`)
                .setColor(msg.member.displayHexColor)
                .setDescription('Aki a lista de comandos para o servidor.')
            //     { name: '\u200B', value: '\u200B' },

            bot.commands.forEach(element => {
                embed.addField('`' + prefix + element.name + '`', element.description, true);
            });
        
            msg.channel.send(embed);
        }else if(args.length >= 1){
            console.log(args)
            const embed = new Discord.MessageEmbed()
                .setTitle(`Help`)
                .setColor(msg.member.displayHexColor)
                //.setDescription('Aki a lista de comandos para o servidor.')

            args.forEach(element => {
                embed.addField('`' + prefix + bot.commands.get(element).name + '`', bot.commands.get(element).description, true);
            })

            msg.channel.send(embed);
        }
        
    },
}