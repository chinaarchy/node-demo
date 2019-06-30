const Router = require('koa-router');
const router = new Router({
    prefix:'/v1/classic'
});
const {Auth} = require('../../../middleware/auth');
const {PositiveIntegerValidator} = require('../../validators/validator');
const {Flow} = require('../../models/flow');
const {Art} = require('../../models/art');
const {Favor} = require('../../models/favor');

router.get('/latest', new Auth().m ,async (ctx, next) =>{
    const flow = await Flow.findOne({
        order:[
            ['index','DESC']
        ]
    });
    const art = await Art.getData(flow.artId, flow.type);
    const likeLatest = await Favor.userLikeIt(flow.artId, flow.type, ctx.auth.uid);
    art.setDataValue('index', flow.index);
    art.setDataValue('like_status', likeLatest);
    ctx.body = art;
});
router.get('/:index/next', new Auth().m, async (ctx, next) =>{
    const v = await new PositiveIntegerValidator().validate(ctx, {
        id: 'index'
    })
    // const index1 = ctx.params;
    // console.log(index1.index);
    const index = v.get('path.index');
    const flow = await Flow.findOne({
        where: {
            index: index + 1
        }
    });
    if (!flow){
        throw new global.errs.NotFound()
    }
    const art = await Art.getData(flow.artId, flow.type);
    const likeNext = await Favor.userLikeIt(flow.artId, flow.type, ctx.auth.uid);
    art.setDataValue('index', flow.index);
    art.setDataValue('like_status', likeNext);
    ctx.body = art;
});
router.get('/:index/prev', new Auth().m, async (ctx, next) =>{
    const v = await new PositiveIntegerValidator().validate(ctx, {
        id: 'index'
    })
    // const index1 = ctx.params;
    // console.log(index1.index);
    const index = v.get('path.index');
    const flow = await Flow.findOne({
        where: {
            index: index - 1
        }
    });
    if (!flow){
        throw new global.errs.NotFound()
    }
    const art = await Art.getData(flow.artId, flow.type);
    const likePrev = await Favor.userLikeIt(flow.artId, flow.type, ctx.auth.uid);
    art.setDataValue('index', flow.index);
    art.setDataValue('like_status', likePrev);
    ctx.body = art;
});
module.exports = router;