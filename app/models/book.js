const {sequelize} = require('../../core/db');
const {Sequelize, Model, Op} = require('sequelize');
const axios = require('axios');
const util = require('util');
const {Favor} = require('./favor');

class Book extends Model{
    static async getDetail(id) {
        const url = util.format(global.config.yushu.detailUrl, id);
        const detail = await axios.get(url);
        return detail.data
    }

    static async searchFromYuShu(q, start, count, summary=1) {
        const url = util.format(global.config.yushu.keywordUrl, encodeURI(q), count, start, summary)
        const reault = await axios.get(url);
        return reault.data
    }

    static async getMyfavorBookCount(uid){
        return await Favor.count({
            where:{
                uid,
                type:400
            }
        })
    }
}

Book.init({
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    fav_nums:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
},{
    sequelize,
    tableName:'book'
});

module.exports = {
    Book
};