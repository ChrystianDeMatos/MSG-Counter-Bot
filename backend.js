const { Pool, Client } = require('pg')
const fs = require('fs')
const sqlurl = process.env.sqlurl

const pool = new Pool({
    connectionString: sqlurl,
    ssl: {
      rejectUnauthorized: false
    }
});

try{
    pool.connect()
    console.log('Banco de dados conectado');
}catch(e){
    console.log(e)
}



module.exports = {
    set: async (guildId, column, info) => {
        try{
            pool.query(`UPDATE servers SET ${column} = '${info}' WHERE server_id=${guildId}`)
        }catch(e){
            console.log(e)
        }
    },
    setNull: async (guildId, column) => {
        try{
            pool.query(`UPDATE servers SET ${column} = NULL WHERE server_id=${guildId}`)
        }catch(e){
            console.log(e)
        }
    },
    get: async (guildId, column) => {
        try{
            let objectQuery = (await pool.query(`SELECT ${column} FROM servers WHERE server_id = ${guildId}`)).rows
            switch(objectQuery.length){
                case 0:
                    console.log('1 ')
                    return null
                case 1:
                    console.log('2 ' + objectQuery[0][column])
                    return objectQuery[0][column]
                default:
                    let arrayReturn = []
                    objectQuery.forEach((_a, b) => { arrayReturn.push(objectQuery[b][column]) })
                    return arrayReturn
            }
        }catch(e){
            console.log(e)
        }
    },
    getServers: async () => {
        try{
            let query = `SELECT server_id, scheduled_region FROM servers`
            return (await pool.query(query)).rows
        }catch(e){
            console.log(e)
        }
    },
    push: async (guildId, column, info) => {
        try{
            await pool.query(`UPDATE servers SET ${column} = array_append(${column}, ${info}) WHERE server_id=${guildId}`)
        }catch(e){
            console.log(e)
        }
    },
    setup: async (guildId) => {
        try{
            pool.query(`INSERT INTO servers VALUES(${guildId})`)
        }catch(e){
            console.log(e)
        }
    },
    verify: async (guildId) => {
        try{
            let exists = (await pool.query(`SELECT EXISTS(SELECT 1 FROM servers WHERE server_id=${guildId})`)).rows
            return exists[0].exists
        }catch(e){
            console.log(e)
        }
    },
    addMensageCount: (guildId) => {
        try{
            pool.query(`UPDATE servers SET number_of_mensages = number_of_mensages+1 WHERE server_id=${guildId}`)
        }catch(e){
            console.log(e)
        }
    }
}