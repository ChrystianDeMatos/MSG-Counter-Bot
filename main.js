const Discord = require("discord.js")
const fs = require("fs")
const db = require('quick.db');
var cron = require("cron");


const bot = new Discord.Client();

const token =                                                                                                                       'NzY3MTE1NDkxNDUzMDQyNzI4.X4tN-Q.HGhIdVnTHdoSU6hJEvwgdbwSXRs'

const prefix = '%'

let defaultChannel

var totalDeMensagens = 0

bot.on("ready", () => {
    scheduledMessage.start()
    console.log(`Bot has started, with 
    ${bot.users.size} users, in 
    ${bot.channels.size} channels of 
    ${bot.guilds.size} guilds.`);
    bot.user.setActivity(`Serving 
    ${bot.guilds.size} servers`);
});

bot.on('message', msg => {
    if (msg.content.startsWith(prefix)) {

        let command = msg.content
        command = command.substring(1)

        if (command.startsWith('total')) {
            msg.channel.send('Total de mensagens: ' + totalDeMensagens)
        }

        if (command.startsWith('setchannel')) {
            defaultChannel = msg.channel.id
            console.log(defaultChannel)
            db.set(msg.guild.id + '.defaultChannelID', defaultChannel)
            // xpFile[msg.guild.id] = { numberOfMensages: xpFile.numberOfMensages, defaultChannelID: xpFile[msg.guild.id].defaultChannelID }
            // fs.writeFileSync(xpPath, JSON.stringify(xpFile, null, 2))
            msg.channel.send('New default channel: <#' + defaultChannel + '>');
        }
        if (command.startsWith('setdefault')) {
            defaultChannel = msg.channel.id
            console.log(defaultChannel)
            db.set(msg.guild.id + '.defaultChannelID', "")
            msg.channel.send('All channels are now being observed.');
        }

        if (command.startsWith('setup')) {
            if (db.get(msg.guild.id) === null) {

                db.set(msg.guild.id + '.numberOfMensages', 0)
                db.set(msg.guild.id + '.defaultChannelID', "")
                
                msg.channel.send('Server setupado com sucesso.');
            } else {
                msg.channel.send('O servidor ja esta setupado')
                return
            }
        }

        if (command.startsWith('count')) {
            // Send the user's avatar URL
            const embed = new Discord.MessageEmbed()
                .setTitle(`Hoje foi enviada ${db.get(msg.guild.id + '.numberOfMensages')} mensagens`)
                .setColor(msg.member.displayHexColor)
                .setDescription('Sim este servidor enviou tudo isso hoje')
                .setThumbnail(msg.guild.iconURL())
    
            msg.channel.send(embed);
        }

        if (command.startsWith('record')) {

            console.log(db.get(msg.guild.id + '.daysMensageRecord'))

            var daysMensageRecordArray = db.get(msg.guild.id + '.daysMensageRecord')

            if(daysMensageRecordArray == undefined) {
                msg.channel.send('Ainda não ha recordes.')
                return
            }
            if(daysMensageRecordArray.lenght < 0) return

            //organiza a array do maior pro menor
            daysMensageRecordArray.sort((a, b) => {
                return b-a
            })

            //msg.member.displayHexColor

            const embed = new Discord.MessageEmbed()
                .setTitle(`O recorde de mensagens diarias do servidor: **${daysMensageRecordArray[0]}**`)
                .setColor(msg.member.displayHexColor)
                .setDescription(`Seguindo:
                                 2-${daysMensageRecordArray[1]}
                                 3-${daysMensageRecordArray[2]}`)
                .setThumbnail(msg.guild.iconURL())
    
            msg.channel.send(embed);

        }

        if (command.startsWith('test1')) {
            // Send the user's avatar URL
            
        }

        if (command.startsWith('test2')) {
        }

        


        return
    }

    if (!msg.author.bot) {
        if(db.get(msg.guild.id + '.defaultChannelID') === "")
        {
            var put = db.get(msg.guild.id + '.numberOfMensages') + 1

            ChangeNumberOfMensages(put)
        }
        else if(msg.channel.id === db.get(msg.guild.id + '.defaultChannelID'))
        {
            var put = db.get(msg.guild.id + '.numberOfMensages') + 1

            ChangeNumberOfMensages(put)
        }
        function ChangeNumberOfMensages(numberToChange){
            db.set(msg.guild.id + '.numberOfMensages', numberToChange)
        }

    }
})

let scheduledMessage = new cron.CronJob('00 00 00 * * *', () => {
    // This runs every day at 00:00:00, you can do anything you want

    db.push(msg.guild.id + '.daysMensageRecord', db.get(msg.guild.id + '.numberOfMensages'))
    db.set(msg.guild.id + '.numberOfMensages', 0)

    console.log(db.get(msg.guild.id + '.daysMensageRecord'))

    var daysMensageRecordArray = db.get(msg.guild.id + '.daysMensageRecord')

    if(daysMensageRecordArray) return

    //organiza a array do maior pro menor
    daysMensageRecordArray.sort((a, b) => {
        return b-a
    })

    //msg.member.displayHexColor

    const embed = new Discord.MessageEmbed()
        .setTitle(`O recorde de mensagens diarias do servidor: **${daysMensageRecordArray[0]}**`)
        .setColor(msg.member.displayHexColor)
        .setDescription(`Seguindo:
                            2-${daysMensageRecordArray[1]}
                            3-${daysMensageRecordArray[2]}`)
        .setThumbnail(msg.guild.iconURL())

    msg.channel.send(embed);
    

});

bot.login(token)