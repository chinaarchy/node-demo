const Router = require('koa-router');
const router = new Router({
    prefix:'/v1/book'
});
const {HttpException, ParameterException} = require('../../../core/http-exception');
const {PositiveIntegerValidator, SearchValidator,AddShortCommentValidator} =require('../../validators/validator');
const {Auth} = require('../../../middleware/auth');
const {HotBook} = require('../../models/hot_book');
const {Book} = require('../../models/book');
const {Favor} = require('../../models/favor');
const {BookComment} = require('../../models/book_comment');

router.get('/hot_list', new Auth().m ,async (ctx, next) =>{
    ctx.body = await HotBook.getAll();
});

router.get('/:id/detail', new Auth().m, async (ctx, next) => {
    const v = await new PositiveIntegerValidator().validate(ctx);
    ctx.body = await Book.getDetail(v.get('path.id'))
});

router.get('/search', new Auth().m , async (ctx,next) => {
    const v = await new SearchValidator().validate(ctx);
    ctx.body = await Book.searchFromYuShu(v.get('query.q'), v.get('query.start'), v.get('query.count'))
});

router.get('/favor/count', new Auth().m, async (ctx, next) => {
   ctx.body = await Book.getMyfavorBookCount(ctx.auth.uid)
});

router.get('/:book_id/favor', new Auth().m, async (ctx,next) => {
    const v = await new PositiveIntegerValidator().validate(ctx, {id: 'book_id'});
    ctx.body = await Favor.getBookFavors(ctx.auth.uid, v.get('path.book_id'))
});

router.post('/add/short_comment', new Auth().m, async (ctx, next) => {
    const v = await new AddShortCommentValidator().validate(ctx, {
        id: 'book_id'
    });
    await BookComment.addComment(v.get('body.book_id'), v.get('body.content'));
    throw new global.errs.Success()
});

router.get(':book_id/short_comment', new Auth().m, async (ctx, next) => {
    const v = await new PositiveIntegerValidator().validate(ctx,{id: 'book_id'});
    const book_id = v.get('path.book_id');
    const comments = await BookComment.getComments(book_id);
    ctx.body = {
        comments,
        book_id
    }

});

router.get('/hot_keyword', async ctx => {
    ctx.body = {
        'hot': ['Python','哈利波特','村上春树','东野圭吾','白夜行','韩寒','金庸','王小波']
    }
});

module.exports = router;