const {sequelize} = require('../../core/db');
const {Sequelize, Model} = require('sequelize');

class BookComment extends Model{
    static async addComment(bookId, content){
        const bookComment = await BookComment.findOne({
            where:{
                book_id: bookId,
                content
            }
        });
        if (!bookComment){
            return await BookComment.create({
                book_id: bookId,
                content,
                nums:1
            })
        } else {
            return await bookComment.increment('nums',{
                by:1
            })
        }
    }

    static async getComments(bookId){
        return  await BookComment.findAll({
            where:{
                book_id: bookId
            }
        })
    }
}

BookComment.init({
    content: Sequelize.STRING(12),
    nums:{
        type:Sequelize.INTEGER,
        defaultValue:0
    },
    book_id: Sequelize.INTEGER
},{
    sequelize,
    tableName:'comment'
});

module.exports = {
    BookComment
};