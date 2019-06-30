const Router = require('koa-router');
const router = new Router({
    prefix:'/v1/book'
});
const {HttpException, ParameterException} = require('../../../core/http-exception');
const {PositiveIntegerValidator} =require('../../validators/validator')
const {Auth} = require('../../../middleware/auth');

router.get('/latest', new Auth().m ,async (ctx, next) =>{
    // const path = ctx.params;
    // const query = ctx.request.query;
    // const headers = ctx.request.header;
    // const body = ctx.request.body;
    // const v = await new PositiveIntegerValidator().validate(ctx)
    // ctx.body = 'success'
    ctx.body = ctx.auth.uid
});

module.exports = router;