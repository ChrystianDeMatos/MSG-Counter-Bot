const con = require('../backend.js');

module.exports = {
    name: 'setchannel',
    description: ':wrench: Define como padrão o canal atual. Isso faz com que esse canal seja observado, além da mensagem dos recordes diários aparecer nesse canal.',
    async execute(msg){
        defaultChannel = msg.channel.id
        con.set(msg.guild.id, 'default_channel_id', defaultChannel)
        await msg.channel.send('O novo canal default é: <#' + defaultChannel + '>');
    },
}