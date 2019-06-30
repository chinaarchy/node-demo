const Sequelize = require('sequelize')
const {
    dbName,
    host,
    port,
    user,
    password
} = require('../config/config').database

const sequelize = new Sequelize(dbName, user, password,{
    dialect:'mysql',
    host,
    port,
    logging: true,
    timezone: '+08:00',
    define:{
        underscored: true,
        freezeTableName:true,
        scopes:{
            bh:{
                attributes:{
                   exclude:['updated_at','deleted_at','created_at']
                }
            }
        }
    }
})

sequelize.sync()

module.exports = {
    sequelize
}