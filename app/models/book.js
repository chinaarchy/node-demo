const {sequelize} = require('../../core/db');
const {Sequelize, Model, Op} = require('sequelize');
const axios = require('axios');
const util = require('util');

class Book extends Model{
    static async getDetail(id) {
        const url = util.format(global.config.yushu.detailUrl, id);
        const detail = await axios.get(url);
        return detail.data
    }
}

Book.init({
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    fav_nums:{
        type: Sequelize.INTEGER,
        default: 0
    }
},{
    sequelize,
    tableName:'book'
});

module.exports = {
    Book
};