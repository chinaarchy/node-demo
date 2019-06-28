const Router = require('koa-router');
const {Success} = require('../../../core/http-exception');
const {RegisterValidator} = require('../../validators/validator');
const { User } = require('../../models/user');
const router = new Router({
    prefix:'/v1/user'
});

router.post('/register', async (ctx) => {
    const v = await new RegisterValidator().validate(ctx);
    const user = {
        email: v.get('body.email'),
        password: v.get('body.password1'),
        nickname: v.get('body.nickname')
    };
    const r = await User.create(user);
    throw new Success()
});

module.exports = router;