module.exports = {
    environment: 'dev',
    database: {
        dbName: 'node_demo',
        host: 'localhost',
        port: 3306,
        user:'root',
        password: 'archy39323'
    },
    security:{
        secretKey:"abcdefg",
        expiresIn: 60*60
    },
    wx: {
        appId: 'wxc1faecaa0659a2ad',
        appSecret: 'c26ea85a7952698ee016480d01db8bed',
        loginUrl: `https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code`

    }
};