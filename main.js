const Discord = require("discord.js")
const config = require('./config.json')
const db = require('quick.db');
var cron = require("cron");


const bot = new Discord.Client();

const token = process.env.token

const prefix = config.prefix
const defaultUTC = config.defaultUTC

var defaultChannel

bot.on("ready", () => {
    console.log(`Bot has started, with 
    ${bot.users.cache.size} users, in 
    ${bot.channels.cache.size} channels of 
    ${bot.guilds.cache.size} guilds.`);
    bot.user.setActivity(`Serving 
    ${bot.guilds.cache.size} servers`);
});

bot.on("guildCreate", guild => {

    let defaultChannel = "";
    guild.channels.cache.forEach((channel) => {
        if (channel.type == "text" && defaultChannel == "") {
            if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                defaultChannel = channel;
            }
        }
    })
    //defaultChannel will be the channel object that the bot first finds permissions for
    defaultChannel.send('Ola, eu sou seu novo Bot, use `%help` para mais informações.')


});

bot.on('message', msg => {
    if (msg.content.startsWith(prefix)) {

        let command = msg.content
        command = command.substring(1)

        if (command.startsWith('help')) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`Help`)
                .setColor(msg.member.displayHexColor)
                .setDescription('Aki a lista de comandos para o servidor.')
                .addFields(
                    { name: '`' + prefix + 'setchannel`', value: 'Esse comando come teu cu' },
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Inline field title', value: 'Some value here', inline: true },
                    { name: 'Inline field title', value: 'Some value here', inline: true },
                )

            msg.channel.send(embed);
        }



        if (command.startsWith('setchannel')) {
            defaultChannel = msg.channel.id
            console.log(defaultChannel)
            db.set(msg.guild.id + '.defaultChannelID', defaultChannel)
            // xpFile[msg.guild.id] = { numberOfMensages: xpFile.numberOfMensages, defaultChannelID: xpFile[msg.guild.id].defaultChannelID }
            // fs.writeFileSync(xpPath, JSON.stringify(xpFile, null, 2))
            msg.channel.send('O novo canal default é: <#' + defaultChannel + '>');
        }

        if (command.startsWith('setdefault')) {
            defaultChannel = msg.channel.id
            console.log(defaultChannel)
            db.set(msg.guild.id + '.defaultChannelID', "")
            msg.channel.send('Todos canais agora estão sendo observados.');
        }

        if (command.startsWith('setup')) {
            if (db.get(msg.guild.id) === null) {

                db.set(msg.guild.id + '.numberOfMensages', 0)
                db.set(msg.guild.id + '.defaultChannelID', "")

                if (command.length > 5) {
                    let region = command
                    region = region.substring(6)
                    setupScheduledMessage(msg, region)
                    msg.channel.send('Server setupado com sucesso.');
                } else {
                    setupScheduledMessage(msg)
                    msg.channel.send(
                        'Server setupado com sucesso, o horario esta definido para o fuso ' + defaultUTC + '.\
                        \nCaso queira mudar a região use `' + prefix + 'changetimezone <região>` \
                        \nRegiões: https://momentjs.com/timezone/');
                }
            } else {
                msg.channel.send('O servidor ja esta setupado')
                return
            }
        }

        if (command.startsWith('changetimezone')) {
            let zoneToChange = command
            zoneToChange = zoneToChange.substring(15)
            console.log(zoneToChange)
            changeBotTimeZone(msg, zoneToChange)

        }
        if (command.startsWith('currenttimezone')) {
            msg.channel.send(`O fuso horário atual está em ${db.get(msg.guild.id + '.scheduledRegion')}`)
        }

        if (command.startsWith('count')) {
            // Send the user's avatar URL
            let messageNumber = db.get(msg.guild.id + '.numberOfMensages');

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
        }

        if (command.startsWith('record')) {

            sendEmbedServerRecords(msg)

        }

        if (command.startsWith('test1')) {
            
        }
        if (command.startsWith('test2')) {
            registerDayRecord(msg)
        }

        return
    }

    if (!msg.author.bot) {
        if (db.get(msg.guild.id + '.defaultChannelID') == "" || msg.channel.id == db.get(msg.guild.id + '.defaultChannelID')) {
            var put = db.get(msg.guild.id + '.numberOfMensages') + 1
            db.set(msg.guild.id + '.numberOfMensages', put)
        }
    }
})

function setupScheduledMessage(msg, region = undefined) {
    try {
        let scheduledMessage = new cron.CronJob('00 00 00 * * *', function() {registerDayRecord(msg)}, null, true, region);
        console.log('vai toma no cu')
        db.set(msg.guild.id + '.scheduledRegion', region)
        scheduledMessage.start()
    }
    catch (e) {
        console.error(e);
        let scheduledMessage = new cron.CronJob('00 00 00 * * *', function() {registerDayRecord(msg)}, null, true, defaultUTC);
        console.log('vai toma no cu2')
        db.set(msg.guild.id + '.scheduledRegion', defaultUTC)
        scheduledMessage.start()
    }
}

function changeBotTimeZone(msg, regionToChange) {
    try { scheduledMessage.stop() }
    catch {}

    try {
        let scheduledMessage = new cron.CronJob('00 00 00 * * *', function() {registerDayRecord(msg)}, null, false, regionToChange);
        db.set(msg.guild.id + '.scheduledRegion', regionToChange)
        scheduledMessage.start()
        msg.channel.send('Região escolhida com sucesso.')
    }
    catch (e) {
        let scheduledMessage = new cron.CronJob('00 00 00 * * *', function() {registerDayRecord(msg)}, null, false, defaultUTC);
        db.set(msg.guild.id + '.scheduledRegion', defaultUTC)
        scheduledMessage.start()
        msg.channel.send('Região inexistente.')
    }
}

function registerDayRecord(msg) {
    db.push(msg.guild.id + '.daysMensageRecord', db.get(msg.guild.id + '.numberOfMensages'))
    db.set(msg.guild.id + '.numberOfMensages', 0)
    sendEmbedServerRecords(msg)
}

function sendEmbedServerRecords(msg) {
    let daysMensageRecordArray = db.get(msg.guild.id + '.daysMensageRecord')

    console.log(daysMensageRecordArray)

    if (!daysMensageRecordArray || daysMensageRecordArray == undefined) {
        msg.channel.send('Ainda não há recordes.')
        return
    }

    //organiza a array do maior pro menor
    daysMensageRecordArray.sort((a, b) => {
        return b - a
    })

    for(i = 0; i < 2; i++){
        if(daysMensageRecordArray[i] == undefined) daysMensageRecordArray[i] = 0;
    }

    const embed = new Discord.MessageEmbed()
        .setTitle(`O recorde de mensagens diarias do servidor: **${daysMensageRecordArray[0]}**`)
        .setColor(msg.member.displayHexColor)
        .setDescription(`Seguindo:
                            2-${daysMensageRecordArray[1]}
                            3-${daysMensageRecordArray[2]}`)
        .setThumbnail(msg.guild.iconURL())

    msg.channel.send(embed);
}

bot.login(token)