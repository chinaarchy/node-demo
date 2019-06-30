const {Movie, Music, Sentence} = require('./classic');

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
}

module.exports = {
    Art
};