const koa = require('koa');
const InitManager = require('./core/init');
const bodyparser = require('koa-bodyparser');
const catchError = require('./middleware/exception');
require('module-alias/register');

const app = new koa();
app.use(catchError);
app.use(bodyparser());
// process.cwd();
InitManager.initCore(app);

app.listen(3000);