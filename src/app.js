const app = require("./app/index");
const config = require("./app/config");

app.listen(config.APP_PORT, () => {
  console.log("cherry7 serve启动成功");
});
