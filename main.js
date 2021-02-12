const fs = require('fs');
const Discord = require("discord.js")
const config = require('./config.json')
require('dotenv').config()
const con = require('./backend.js');
const utils = require('./utils.js');
//require('./api.js')
//const { timeStamp } = require('console');

// var CronJobManager = require('cron-job-manager'),
// manager = new CronJobManager();

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
module.exports = { 
    bot,
    botGuild: (serverId) => {
        return bot.guilds.cache.get(serverId)
    },
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

    //console.log(bot.guilds.cache)

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

bot.login(token)

