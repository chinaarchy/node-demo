const {Movie, Music, Sentence} = require('./classic');
const {Op} = require('sequelize');
const {flatten} = require('lodash');

class Art {
    static async getData(art_id, type, useScope=true){
        const finder = {
            where: {
                id: art_id
            }
        };
        let result = null;
        const scope = useScope?'bh':null;
        switch (type) {
            case 100:result = await Movie.scope(scope).findOne(finder);break;
            case 200:result = await Music.scope(scope).findOne(finder);break;
            case 300:result = await Sentence.scope(scope).findOne(finder);break;
            case 400:break;
            default:break;
        }
        return result;
    }

    static async getArt(flow, uid){
        const art = await Art.getData(flow.artId, flow.type);
        const likePrev = await Favor.userLikeIt(flow.artId, flow.type, uid);
        art.setDataValue('index', flow.index);
        art.setDataValue('like_status', likePrev);
        return art
    }

    static async getList(artInfoList){
        const artInfoObj = {
            100: [],
            200: [],
            300: []
        };
        for (let artInfo of artInfoList){
            artInfoObj[artInfo.type].push(artInfo.art_id)
        }
        const arts = [];
        for (let key in artInfoObj){
            const ids = artInfoObj[key];
            if (ids.length === 0){
                continue
            }
            key = parseInt(key);
            arts.push(await Art._getListByType(ids, key))
        }
        return arts
    }

    static async _getListByType(ids, type){
        let result = []
        const finder = {
            where: {
                id: {
                    [Op.in]:ids
                }
            }
        };
        const scope = 'bh'
        switch (type) {
            case 100:result = await Movie.scope(scope).findOne(finder);break;
            case 200:result = await Music.scope(scope).findOne(finder);break;
            case 300:result = await Sentence.scope(scope).findOne(finder);break;
            case 400:break;
            default:break;
        }
        return flatten(result);
    }
}

module.exports = {
    Art
};