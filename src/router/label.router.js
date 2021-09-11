const Router = require("koa-router");
const labelRouter = new Router({ prefix: "/label" });
const { verifyAuthorization } = require("../middleware/auth.middleware");
const { createLabel, getLabels } = require("../controller/label.controller");
labelRouter.post("/", verifyAuthorization, createLabel);
labelRouter.get("/", getLabels);
module.exports = labelRouter;
