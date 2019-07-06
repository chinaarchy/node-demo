const koa = require('koa');
const InitManager = require('./core/init');
const bodyparser = require('koa-bodyparser');
const catchError = require('./middleware/exception');
const path = require('path');
const koa_static = require('koa-static');
require('module-alias/register');

const app = new koa();
app.use(catchError);
app.use(bodyparser());
app.use(koa_static(path.join(__dirname),'./static'));
// process.cwd();
InitManager.initCore(app);

app.listen(3000);