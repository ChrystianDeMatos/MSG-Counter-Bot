const Discord = require("discord.js")
const fs = require("fs")
var cron = require("cron");
const db = require('quick.db');

const bot = new Discord.Client();

const token = process.env.token

const prefix = '%'

let defaultChannel

var totalDeMensagens = 0

var xpPath = './information.json'
var xpRead = fs.readFileSync(xpPath)
var xpFile = JSON.parse(xpRead)

bot.on("ready", () => {
    db.set('teste', { testee: 'oi'})
    console.log(db.get('teste.testee'))
    scheduledMessage.start()
    console.log(`Bot has started, with 
    ${bot.users.size} users, in 
    ${bot.channels.size} channels of 
    ${bot.guilds.size} guilds.`);
    bot.user.setActivity(`Serving 
    ${bot.guilds.size} servers`);
});

bot.on('message', msg => {
    xpRead = fs.readFileSync(xpPath)
    xpFile = JSON.parse(xpRead)

    if (msg.content.startsWith(prefix)) {

        let command = msg.content
        command = command.substring(1)

        if (command === 'total') {
            msg.channel.send('Total de mensagens: ' + totalDeMensagens)
        }

        if (command.startsWith('setchannel')) {
            defaultChannel = msg.channel.id
            console.log(defaultChannel)
            xpFile[msg.guild.id] = { numberOfMensages: xpFile.numberOfMensages, defaultChannelID: xpFile[msg.guild.id].defaultChannelID }
            fs.writeFileSync(xpPath, JSON.stringify(xpFile, null, 2))
            msg.channel.send('New default channel: <#' + defaultChannel + '>');
        }

        if (command.startsWith('setup')) {
            if (!xpFile[msg.guild.id]) {
                xpFile[msg.guild.id] = { numberOfMensages: 0, defaultChannelID: "" }
                fs.writeFileSync(xpPath, JSON.stringify(xpFile, null, 2))
                msg.channel.send('Server setupado com sucesso.');
            } else {
                msg.channel.send('O servidor ja esta setupado')
                return
            }
        }

    }
    xpRead = fs.readFileSync(xpPath)
    xpFile = JSON.parse(xpRead)

    if (!msg.author.bot) {
        if(xpFile[msg.guild.id].defaultChannelID === "")
        {
            xpFile = JSON.parse(xpRead)

            var put = Number(xpFile[msg.guild.id].numberOfMensages) + 1

            console.log(put)

            ChangeNumberOfMensages(put)

        }
        else if(msg.channel.id === xpFile[msg.guild.id].defaultChannelID)
        {
            xpFile = JSON.parse(xpRead)

            var put = Number(xpFile[msg.guild.id].numberOfMensages) + 1

            ChangeNumberOfMensages(put)

        }
        function ChangeNumberOfMensages(numberToChange){
            xpFile[msg.guild.id] = { numberOfMensages: numberToChange, defaultChannelID: xpFile[msg.guild.id].defaultChannelID }
            fs.writeFileSync(xpPath, JSON.stringify(xpFile, null, 2))
        }

    }

    if (msg.content === 'what is my avatar') {
        // Send the user's avatar URL
        const embed = new Discord.MessageEmbed()
            .setTitle(`Hoje foi enviada ${xpFile[msg.guild.id].numberOfMensages} mensagens`)
            .setColor(0xff0000)
            .setDescription('CU')
            .setThumbnail(msg.guild.iconURL())

        msg.channel.send(embed);
    }
})

let scheduledMessage = new cron.CronJob('00 00 00 * * *', () => {
    // This runs every day at 00:00:00, you can do anything you want
    let channel = yourGuild.channels.get('id');
    channel.send('You message');
  });

bot.login(token)