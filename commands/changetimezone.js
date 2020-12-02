const utils = require('../utils.js')

module.exports = {
    name: 'changetimezone',
    description: ':clock10:  Muda o horário regional do bot.',
    additionalHelp: '\nCaso queira mudar a região use `' + utils.config.prefix + 'changetimezone <região>` \
                            \nRegiões: https://momentjs.com/timezone/',
    execute(msg, args){
        let zoneToChange = ''
        zoneToChange = args[0]
        //zoneToChange = zoneToChange.substring(15)
        //console.log(zoneToChange)
        utils.changeServerTimeZone(msg, zoneToChange)
    },
}