const con = require('./backend.js');
const config = require('./config.json')
const Discord = require("discord.js")
const moment = require("moment-timezone");

var CronJobManager = require('cron-job-manager'),
manager = new CronJobManager();

const defaultUTC = config.defaultUTC
const midNightTime = config.midNightTime

module.exports.setupScheduledMessage = setupScheduledMessage;
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
        if (manager.exists(msg.guild.id)) {
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

module.exports.changeServerTimeZone = changeServerTimeZone;
async function changeServerTimeZone(msg, regionToChange) {

    if (regionToChange == null) {
        regionToChange = defaultUTC
    }

    if (moment.tz.zone(regionToChange) == null) {
        msg.channel.send('Região invalida, utilize o comando `%help`')
        return
    }

    if (manager.exists(msg.guild.id)) {
        manager.deleteJob(msg.guild.id)
        scheduleServer(msg.guild.id, regionToChange)

        await con.set(msg.guild.id, "scheduled_region", regionToChange)
        msg.channel.send('Região definida para ' + regionToChange + ' com sucesso.')
    } else {
        scheduleServer(msg.guild.id, regionToChange)

        await con.set(msg.guild.id, "scheduled_region", regionToChange)
        msg.channel.send('Região definida para ' + regionToChange + ' com sucesso.')
    }

}

module.exports.sendEmbedServerRecords = sendEmbedServerRecords;
async function sendEmbedServerRecords(channel, guild) {
    let daysMensageRecordArray = await con.getRecords(guild.id)

    //console.log(daysMensageRecordArray)

    if (!daysMensageRecordArray || daysMensageRecordArray == undefined) {
        channel.send('Ainda não há recordes.')
        return
    }

    // organiza a array do maior pro menor
    // ja vem organizada
    // daysMensageRecordArray.sort((a, b) => {
    //     return b - a
    // })
    for (i = 0; i < 5; i++) {
        if (daysMensageRecordArray[i] == undefined)
            daysMensageRecordArray[i] = 0
    }

    const embed = new Discord.MessageEmbed()
        .setTitle(`O recorde de mensagens diarias do servidor:\n:trophy:: **${daysMensageRecordArray[0].nr}** :first_place: `)
        .setColor('#04bfbf')
        .setDescription(`:two:: ${daysMensageRecordArray[1].nr} :second_place:\n` +
            `:three:: ${daysMensageRecordArray[2].nr} :third_place:\n` +
            `:four:: ${daysMensageRecordArray[3].nr}\n` +
            `:five:: ${daysMensageRecordArray[4].nr}\n`)
        .setThumbnail(guild.iconURL())

    channel.send(embed)
}

module.exports.setupSchedules = setupSchedules;
async function setupSchedules() {
    const servers = await con.getServers()
    for (const server of servers) {
        if (server.scheduled_region != null) {
            scheduleServer(server.server_id, server.scheduled_region)

            //const cronJob = new cron.CronJob(midNightTime, function() {testRegisterServersDayRecords(server.server_id)}, null, true, server.scheduled_region);
            //cronJob.start();
            //await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

module.exports.registerServersDayRecords = registerServersDayRecords;
async function registerServersDayRecords(serverId) {
    let defaultChannel = ''
    let channelSetted = await con.get(serverId, 'default_channel_id')
    let guild;

    if (channelSetted == null){
        //fix provisorio
        guild = require('./main.js').botGuild(serverId)
        guild.channels.cache.forEach((channel) => {
            if (channel.type == "text" && defaultChannel == '') {
                if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                    defaultChannel = channel
                }
            }
        })
    }else{
        defaultChannel = channelSetted
    }
    
    let numberOfMesages = await con.get(serverId, 'number_of_mensages')
    await con.push(guild.id, 'days_mensage_record', numberOfMesages)
    con.set(guild.id, 'number_of_mensages', 0)
    defaultChannel.send("Foi salvo o numero de mensagens de hoje que foram: " + numberOfMesages)
    sendEmbedServerRecords(defaultChannel, guild)
}

module.exports.scheduleServer = scheduleServer;
function scheduleServer(guildId, timeZone) {
    manager.add(guildId, midNightTime, () => { registerServersDayRecords(guildId) }, {
        start: true,
        timeZone: timeZone
        //onComplete: () => {}
    })
}