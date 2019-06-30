const Router = require('koa-router');
const router = new Router({
    prefix:'/v1/like'
});
const {LikeValidator} = require('../../validators/validator');
const {Auth} = require('../../../middleware/auth');
const {Favor} = require('../../models/favor')

router.post('/', new Auth().m, async (ctx, next) => {
    const v= await new LikeValidator().validate(ctx, {
        id: 'art_id'
    });
    await Favor.like(v.get('body.art_id'), v.get('body.type'), ctx.auth.uid);
    throw new global.errs.Success()
});

router.post('/cancel', new Auth().m, async (ctx, next) => {
    const v= await new LikeValidator().validate(ctx, {
        id: 'art_id'
    });
    await Favor.dislike(v.get('body.art_id'), v.get('body.type'), ctx.auth.uid);
    throw new global.errs.Success()
});

module.exports = router;