const con = require('../backend.js');
const utils = require('../utils.js')
const { bot } = require('../main.js')

module.exports = {
    name: 'testt',
    description: 'Comando de teste.',
    async execute(msg) {

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