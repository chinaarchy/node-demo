const {Movie, Music, Sentence} = require('./classic');
const {HotBook} = require('./hot_book');
const {Op} = require('sequelize');
const {flatten} = require('lodash');

class Art {
    constructor(art_id, type){
        this.art_id = art_id
        this.type = type
    }

    async getDetail(uid){
        const {Favor} = require('./favor');
        const art = await Art.getData(this.art_id, this.type);
        if(!art){
            throw new global.errs.NotFound()
        }
        const like = await Favor.userLikeIt(this.art_id, this.type, uid);
        return {
            art,
            like_status: like
        }
    }

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
        return flatten(arts)
    }

    static async _getListByType(ids, type){
        let result = [];
        const finder = {
            where: {
                id: {
                    [Op.in]:ids
                }
            }
        };
        const scope = 'bh';
        switch (type) {
            case 100:result = await Movie.scope(scope).findOne(finder);break;
            case 200:result = await Music.scope(scope).findOne(finder);break;
            case 300:result = await Sentence.scope(scope).findOne(finder);break;
            case 400:break;
            default:break;
        }
        return result;
    }
}

module.exports = {
    Art
};