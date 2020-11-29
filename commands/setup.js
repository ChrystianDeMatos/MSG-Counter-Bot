const con = require('../backend.js');

module.exports = {
    name: 'setup',
    description: ':first_place: Comando inicial para o bot funcionar.',
    async execute(msg, args){
        const verifyServer = await con.verify(msg.guild.id)
        if(!verifyServer){
            try{
                //con.get(msg.guild.id, 'server_id')
                await con.setup(msg.guild.id)
                await con.set(msg.guild.id, 'number_of_mensages', 0)
                //con.set(msg.guild.id, 'default_channel_id', msg.channel.id)
    
                if (command.length > 5) {
                    let region = command
                    region = region.substring(6)
                    await setupScheduledMessage(msg, region)
                    msg.channel.send('Server setupado com sucesso, e o horario esta definido para o fuso ' + region + '.')
                } else {
                    await setupScheduledMessage(msg)
                    msg.channel.send(
                        'Server setupado com sucesso, o horario esta definido para o fuso ' + defaultUTC + '.\
                        \nCaso queira mudar a região use `' + prefix + 'changetimezone <região>` \
                        \nRegiões: https://momentjs.com/timezone/');
                }
            }catch(e){
                console.log(e)
            }
        }else{
            msg.channel.send('O servidor ja esta setupado')
            return
        }
    },
}