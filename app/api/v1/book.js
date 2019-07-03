const Router = require('koa-router');
const router = new Router({
    prefix:'/v1/book'
});
const {HttpException, ParameterException} = require('../../../core/http-exception');
const {PositiveIntegerValidator} =require('../../validators/validator');
const {Auth} = require('../../../middleware/auth');
const {HotBook} = require('../../models/hot_book');
const {Book} = require('../../models/book');

router.get('/hot_list', new Auth().m ,async (ctx, next) =>{
    ctx.body = await HotBook.getAll();
});

router.get('/:id/detail', new Auth().m, async (ctx, next) => {
   const v = await new PositiveIntegerValidator().validate(ctx);
   const book = await Book.getDetail(v.get('path.id'));
   ctx.body = book
});

module.exports = router;