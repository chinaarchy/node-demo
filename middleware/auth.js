const jwt = require('jsonwebtoken');
const basicAuth = require('basic-auth');

class Auth {
    constructor(level){
        this.level = level || 1;
        Auth.USER = 8;
        Auth.ADMIN = 16;
    }

    get m() {
        return async (ctx, next)=>{
            // token检测
            const userToken = basicAuth(ctx.req);
            let errMsg = 'Token不合法';
            if(!userToken || !userToken.name){
                throw new global.errs.Forbbiden()
            }
            try{
                var decode = jwt.verify(userToken.name, global.config.security.secretKey)
            }catch (error) {
                // Token过期
                // Token不合法
                if (error.name === 'TokenExpiredError'){
                    errMsg = 'Token已过期';
                }
                throw new global.errs.Forbbiden(errMsg)
            }
            if (decode.scope < this.level) {
                errMsg = '没有权限访问';
                throw new global.errs.Forbbiden(errMsg)
            }
            ctx.auth = {
                uid: decode.uid,
                scope: decode.scope
            };

            await next()
        }
    }

    static verifyToken(token){
        try {
            jwt.verify(token, global.config.security.secretKey);
            return true
        }catch (e) {
            return false
        }
    }
}

module.exports = {
    Auth
};