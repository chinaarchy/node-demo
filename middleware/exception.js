const {HttpException} = require('../core/http-exception')
const catchError = async (ctx, next) => {
    try{
        await next()
    } catch (e) {

        const isHttpException = e instanceof HttpException
        const isDev = global.config.environment === 'dev'
        if (isDev && !isHttpException) {
            throw e
        }
        if (isHttpException) {
            ctx.body = {
                msg: e.msg,
                errorCode: e.errorCode,
                request: `${ctx.method} ${ctx.path}`
            }
            ctx.status = e.code
        } else {
            ctx.body = {
                msg: '未知异常',
                errorCode: 999,
                request: `${ctx.method} ${ctx.path}`
            }
            ctx.status = 500
        }
    }
}

module.exports = catchError