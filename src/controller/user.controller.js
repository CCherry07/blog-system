const fs = require("fs");
const UserService = require("../service/user.service");
const fileService = require("../service/file.service");

class UserController {
  async create(ctx, next) {
    // 获取用户请求传递的数据
    const user = ctx.request.body;
    //查询数据
    const res = await UserService.create(user);
    //返回数据
    ctx.body = res;
  }
  async getAvatarInformation(ctx, next) {
    const { userId } = ctx.params;
    const userInfo = await fileService.getAvatarInformationById(userId);
    ctx.response.set("content-type", userInfo.mimetype);
    // const avatarPath = userInfo.path.replaceAll("\\", "/");
    ctx.body = fs.createReadStream(userInfo.path);
  }
}
module.exports = new UserController();
