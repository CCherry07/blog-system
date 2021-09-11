const Koa = require("koa");
const app = new Koa();
const useRoutes = require("../router");
//对参数json解析
const bodyParser = require("koa-bodyparser");
require("../app/database");
//错误处理
const errorhandler = require("./error_handle");
app.use(bodyParser());
//注册中间件
app.useRoutes = useRoutes;
useRoutes(app);
//监听错误
app.on("error", errorhandler);
module.exports = app;
