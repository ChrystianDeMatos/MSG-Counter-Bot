const con = require('../backend.js');

module.exports = {
    name: 'setdefault',
    description: ':eyes: Faz com que todos os canais observaveis seja observado pelo bot.',
    execute(msg){
        con.setNull(msg.guild.id, 'default_channel_id')
        msg.channel.send('Todos canais agora estão sendo observados.');
    },
}