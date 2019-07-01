const Router = require('koa-router');
const router = new Router({
    prefix:'/v1/classic'
});
const {Auth} = require('../../../middleware/auth');
const {PositiveIntegerValidator, ClassicValidator} = require('../../validators/validator');
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
    });
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
    const likeLatest = await Favor.userLikeIt(flow.artId, flow.type, ctx.auth.uid);
    art.setDataValue('index', flow.index);
    art.setDataValue('like_status', likeLatest);
    ctx.body = art;
});
router.get('/:index/prev', new Auth().m, async (ctx, next) =>{
    const v = await new PositiveIntegerValidator().validate(ctx, {
        id: 'index'
    });
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
    const likeLatest = await Favor.userLikeIt(flow.artId, flow.type, ctx.auth.uid);
    art.setDataValue('index', flow.index);
    art.setDataValue('like_status', likeLatest);
    ctx.body = art;
});
router.get('/:type/:id/favor', new Auth().m, async (ctx, next) =>{
    const v = await new ClassicValidator().validate(ctx);
    const id = v.get('path.id');
    const type = parseInt(v.get('path.type'));
    const art = await Art.getData(id, type);
    if(!art){
        throw new global.errs.NotFound()
    }
    const like = await Favor.userLikeIt(id, type, ctx.auth.uid);
    ctx.body = {
        fav_nums: art.fav_nums,
        like_status: like
    }
});
router.get('/favor', new Auth().m, async (ctx, next)=> {
    const uid = ctx.auth.uid;
    ctx.body = await Favor.getMyClassicFavors(uid)
});
router.get('/:type/:id', new Auth().m, async (ctx,next)=>{
    const v = await new ClassicValidator().validate(ctx);
    const id = v.get('path.id');
    const type = parseInt(v.get('path.type'));
    const artDetail = await new Art(id, type).getDetail(ctx.auth.uid);
    artDetail.art.setDataValue('like_status', artDetail.like_status);
    ctx.body = artDetail.art;
});
module.exports = router;