const con = require('../backend.js');
const utils = require('../utils.js')
const { bot } = require('../main.js')
const api = require('../api')
const imagesCreator = require('../imagesCreator.js')

const Discord = require("discord.js")

module.exports = {
    name: 'testt',
    description: 'Comando de teste.',
    additionalHelp: '\nMe executa :D',
    async execute(msg) {
        const base64Image = await imagesCreator.create(msg.guild.id);
        //console.log(testeeeee)
        const sfbuff = new Buffer.from(base64Image.split(",")[1], "base64");
        const sfattach = new Discord.MessageAttachment(sfbuff, "output.png");
        msg.channel.send(sfattach)
        //msg.reply('não faço nada :stuck_out_tongue_closed_eyes:')
        //console.log(bot.users.cache.size)
        //utils.registerServersDayRecords(msg.guild.id)

        // let defaultChannel = "";
        // let guild = bot.guilds.cache.get('707350525787504751')
        // guild.channels.cache.forEach((channel) => {
        //     if(channel.type == "text" && defaultChannel == "") {
        //         if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
        //             defaultChannel = channel;
        //         }
        //     }
        // })
        // defaultChannel.send('Ola, eu sou seu novo Bot, use `%help` para mais informações.')

    },
}