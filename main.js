const fs = require('fs');
const Discord = require("discord.js")
const config = require('./config.json')
require('dotenv').config()
const con = require('./backend.js');
const utils = require('./utils.js');
//const { timeStamp } = require('console');

// var CronJobManager = require('cron-job-manager'),
// manager = new CronJobManager();


const bot = new Discord.Client();
bot.commands = new Discord.Collection();
module.exports = { 
    bot,
    botGuild: (serverId) => { // provisirio
        return bot.guilds.cache.get(serverId)
    }
}

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Config
const token = process.env.token

const prefix = config.prefix

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

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

    utils.setupSchedules();

    console.log(bot.guilds.cache)

    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
});

bot.on('message', async msg => {
    if (msg.author.bot) return;
    
    if (msg.channel.type === 'dm') {
        return msg.reply('Não executo comandos em DM!')
    }

    if (msg.content.startsWith(prefix)) {

        const args = msg.content.slice(prefix.length).trim().split(/ +/)
        const commandName = args.shift().toLowerCase()

        const command = bot.commands.get(commandName)

        if (!command) return

        command.execute(msg, args)
        //console.log(command)

        return
    }
    
    let channelId = await con.get(msg.guild.id, "default_channel_id")
    if (channelId == null || msg.channel.id == channelId) {
        con.addMensageCount(msg.guild.id)
    }
})

// async function setupScheduledMessage(msg, region = defaultUTC) {
//     try {
//         manager.add(msg.guild.id, midNightTime, () => { registerServersDayRecords(msg.guild.id) }, {
//             start: true,
//             timeZone: region
//             //onComplete: () => {}
//         })
//         await con.set(msg.guild.id, "scheduled_region", region)
//     }
//     catch (e) {
//         if(manager.exists(msg.guild.id)){
//             manager.deleteJob(msg.guild.id)
//             manager.add(msg.guild.id, midNightTime, () => { registerServersDayRecords(msg.guild.id) }, {
//                 start: true,
//                 timeZone: regionToChange
//                 //onComplete: () => {}
//             })
//             await con.set(msg.guild.id, "scheduled_region", regionToChange)
//             msg.channel.send('Região invalida, utilize o comando `%help`')
//         }
//     }
// }

// async function changeServerTimeZone(msg, regionToChange) {

//     if(regionToChange == null){
//         regionToChange = defaultUTC
//     }

//     if(moment.tz.zone(regionToChange) == null){
//         msg.channel.send('Região invalida, utilize o comando `%help`')
//         return;
//     }

//     if(manager.exists(msg.guild.id)){
//         manager.deleteJob(msg.guild.id)
//         scheduleServer(msg.guild.id, regionToChange)

//         await con.set(msg.guild.id, "scheduled_region", regionToChange)
//         msg.channel.send('Região definida para '+regionToChange+' com sucesso.')
//     }else{
//         scheduleServer(msg.guild.id, regionToChange)

//         await con.set(msg.guild.id, "scheduled_region", regionToChange)
//         msg.channel.send('Região definida para '+regionToChange+' com sucesso.')
//     }
    
// }

// async function sendEmbedServerRecords(channel, guild) {
//     let daysMensageRecordArray = await con.getRecords(guild.id)
    
//     console.log(daysMensageRecordArray)

//     if (!daysMensageRecordArray || daysMensageRecordArray == undefined) {
//         channel.send('Ainda não há recordes.')
//         return
//     }

//     // organiza a array do maior pro menor
//     // ja vem organizada
//     // daysMensageRecordArray.sort((a, b) => {
//     //     return b - a
//     // })

//     for(i = 0; i < 5; i++){
//         if(daysMensageRecordArray[i] == undefined) daysMensageRecordArray[i] = 0;
//     }

//     const embed = new Discord.MessageEmbed()
//         .setTitle(`O recorde de mensagens diarias do servidor:\n:trophy:: **${daysMensageRecordArray[0].nr}** :first_place: `)
//         .setColor('#04bfbf')
//         .setDescription(`:two:: ${daysMensageRecordArray[1].nr} :second_place:\n` +
//         `:three:: ${daysMensageRecordArray[2].nr} :third_place:\n` +
//         `:four:: ${daysMensageRecordArray[3].nr}\n` +
//         `:five:: ${daysMensageRecordArray[4].nr}\n`)
//         .setThumbnail(guild.iconURL())

//     channel.send(embed);
// }

// async function setupSchedules(){
//     const servers = await con.getServers()
//     for(const server of servers){
//         if(server.scheduled_region != null){
//             scheduleServer(server.server_id, server.scheduled_region)

//             //const cronJob = new cron.CronJob(midNightTime, function() {testRegisterServersDayRecords(server.server_id)}, null, true, server.scheduled_region);
//             //cronJob.start();
//             //await new Promise(resolve => setTimeout(resolve, 5000));
//         }
//     }
// }  

// async function registerServersDayRecords(serverId){
//     let defaultChannel = "";
//     let guild = bot.guilds.cache.get(serverId)
//     if(con.get(serverId, 'default_channel_id'))
//     guild.channels.cache.forEach((channel) => {
//         if(channel.type == "text" && defaultChannel == "") {
//             if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
//                 defaultChannel = channel;
//             }
//         }
//     })
//     let numberOfMesages = await con.get(serverId, 'number_of_mensages')
//     await con.push(guild.id, 'days_mensage_record', numberOfMesages)
//     con.set(guild.id, 'number_of_mensages', 0)
//     defaultChannel.send("Foi salvo o numero de mensagens de hoje que foram: " + numberOfMesages)
//     sendEmbedServerRecords(defaultChannel, guild)
// }

// function scheduleServer(guildId, timeZone){
//     manager.add(guildId, midNightTime, () => { registerServersDayRecords(guildId) }, {
//         start: true,
//         timeZone: timeZone
//         //onComplete: () => {}
//     })
// }


bot.login(token)