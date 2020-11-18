const Discord = require("discord.js")
const config = require('./config.json')
require('dotenv').config()
const con = require('./backend.js');
const moment = require("moment-timezone");

var CronJobManager = require('cron-job-manager'),
manager = new CronJobManager();


const bot = new Discord.Client();

// Config
const token = process.env.token

const prefix = config.prefix
const defaultUTC = config.defaultUTC
const midNightTime = config.midNightTime

var defaultChannel



bot.on("guildCreate", guild => {

    let defaultChannel = "";
    guild.channels.cache.forEach((channel) => {
        if (channel.type == "text" && defaultChannel == "") {
            if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                defaultChannel = channel;
            }
        }
    })
    defaultChannel.send('Ola, eu sou seu novo Bot, use `%help` para mais informações.')


});

bot.on("ready", () => {
    console.log(`Bot has started, with 
    ${bot.users.cache.size} users, in 
    ${bot.channels.cache.size} channels of 
    ${bot.guilds.cache.size} guilds.`);
    bot.user.setActivity(`Serving 
    ${bot.guilds.cache.size} servers :robot:`);

    setupSchedules();

    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
});

bot.on('message', async msg => {
    if (msg.content.startsWith(prefix)) {

        let command = msg.content
        command = command.substring(1)

        if (command.startsWith('help')) {
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
        }

        // if (command.startsWith('teste')) {
        //     let testtttt = await con.get(msg.guild.id, 'number_of_mensages');
        //     console.log(testtttt)
        // }
        // if (command.startsWith('teste1')) {
        //     await con.set(msg.guild.id, 'number_of_mensages', 24);
        // }
        // if (command.startsWith('teste2')) {
        //     msg.channel.send(msg.guild.region)
        // }

        if (command.startsWith('teste3')) {
            console.log(manager.listCrons());
        }

        if (command.startsWith('setchannel')) {
            defaultChannel = msg.channel.id
            con.set(msg.guild.id, 'default_channel_id', defaultChannel)
            await msg.channel.send('O novo canal default é: <#' + defaultChannel + '>');
        }

        if (command.startsWith('setdefault')) {
            con.setNull(msg.guild.id, 'default_channel_id')
            msg.channel.send('Todos canais agora estão sendo observados.');
        }

        if (command.startsWith('setup')) {
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
        }

        if (command.startsWith('changetimezone')) {
            let zoneToChange = command
            zoneToChange = zoneToChange.substring(15)
            //console.log(zoneToChange)
            changeServerTimeZone(msg, zoneToChange)

        }
        if (command.startsWith('currenttimezone')) {
            const region = await con.get(msg.guild.id, 'scheduled_region')
            msg.channel.send(`O fuso horário atual está em ${region}`)
        }

        if (command.startsWith('count')) {
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
        }

        if (command.startsWith('record')) {
            sendEmbedServerRecords(msg.channel, msg.guild)
        }

        return
    }

    if (!msg.author.bot) {
        let channelId = await con.get(msg.guild.id, "default_channel_id")
        if (channelId == null || msg.channel.id == channelId) {
            con.addMensageCount(msg.guild.id)
        }
    }
})

async function setupScheduledMessage(msg, region = defaultUTC) {
    try {
        manager.add(msg.guild.id, midNightTime, () => { registerServersDayRecords(msg.guild.id) }, {
            start: true,
            timeZone: region
            //onComplete: () => {}
        })
        await con.set(msg.guild.id, "scheduled_region", region)
    }
    catch (e) {
        if(manager.exists(msg.guild.id)){
            manager.deleteJob(msg.guild.id)
            manager.add(msg.guild.id, midNightTime, () => { registerServersDayRecords(msg.guild.id) }, {
                start: true,
                timeZone: regionToChange
                //onComplete: () => {}
            })
            await con.set(msg.guild.id, "scheduled_region", regionToChange)
            msg.channel.send('Região invalida, utilize o comando `%help`')
        }
    }
}

async function changeServerTimeZone(msg, regionToChange) {

    if(regionToChange == null){
        regionToChange = defaultUTC
    }

    if(moment.tz.zone(regionToChange) != null){
        msg.channel.send('Região invalida, utilize o comando `%help`')
        return;
    }

    if(manager.exists(msg.guild.id)){
        manager.deleteJob(msg.guild.id)
        scheduleServer(msg.guild.id, regionToChange)

        await con.set(msg.guild.id, "scheduled_region", regionToChange)
        msg.channel.send('Região definida para '+regionToChange+' com sucesso.')
    }else{
        scheduleServer(msg.guild.id, regionToChange)

        await con.set(msg.guild.id, "scheduled_region", regionToChange)
        msg.channel.send('Região definida para '+regionToChange+' com sucesso.')
    }
    
}

async function sendEmbedServerRecords(channel, guild) {
    let daysMensageRecordArray = await con.getRecords(guild.id, 'days_mensage_record')
    
    console.log(daysMensageRecordArray)

    if (!daysMensageRecordArray || daysMensageRecordArray == undefined) {
        channel.send('Ainda não há recordes.')
        return
    }

    // organiza a array do maior pro menor
    // ja vem organizada
    // daysMensageRecordArray.sort((a, b) => {
    //     return b - a
    // })

    for(i = 0; i < 5; i++){
        if(daysMensageRecordArray[i] == undefined) daysMensageRecordArray[i] = 0;
    }

    const embed = new Discord.MessageEmbed()
        .setTitle(`O recorde de mensagens diarias do servidor:\n:trophy:: **${daysMensageRecordArray[0]}** :first_place: `)
        .setColor('#04bfbf')
        .setDescription(`:two:: ${daysMensageRecordArray[1]} :second_place:\n` +
        `:three:: ${daysMensageRecordArray[2]} :third_place:\n` +
        `:four:: ${daysMensageRecordArray[3]}\n` +
        `:five:: ${daysMensageRecordArray[4]}\n`)
        .setThumbnail(guild.iconURL())

    channel.send(embed);
}

async function setupSchedules(){
    const servers = await con.getServers()
    for(const server of servers){
        if(server.scheduled_region != null){
            scheduleServer(server.server_id, server.scheduled_region)

            //const cronJob = new cron.CronJob(midNightTime, function() {testRegisterServersDayRecords(server.server_id)}, null, true, server.scheduled_region);
            //cronJob.start();
            //await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}  

async function registerServersDayRecords(serverId){
    let defaultChannel = "";
    let guild = bot.guilds.cache.get(serverId)
    guild.channels.cache.forEach((channel) => {
        if(channel.type == "text" && defaultChannel == "") {
            if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                defaultChannel = channel;
            }
        }
    })
    let numberOfMesages = await con.get(serverId, 'number_of_mensages')
    await con.push(guild.id, 'days_mensage_record', numberOfMesages)
    con.set(guild.id, 'number_of_mensages', 0)
    defaultChannel.send("Foi salvo o numero de mensagens de hoje que foram: " + numberOfMesages)
    sendEmbedServerRecords(defaultChannel, guild)
}

function scheduleServer(guildId, timeZone){
    manager.add(guildId, midNightTime, () => { registerServersDayRecords(guildId) }, {
        start: true,
        timeZone: timeZone
        //onComplete: () => {}
    })
}


bot.login(token)