const fileService = require("../service/file.service");
const userService = require("../service/user.service");
const { APP_HOST, APP_PORT } = require("../app/config");
var progressStream = require("progress-stream");

class FileController {
  async saveAvatarInfo(ctx, next) {
    //获取图像信息
    const { filename, mimetype, size, path } = ctx.req.file;
    const { id: userId } = ctx.user;
    const plod = [filename, mimetype, size, path, userId];
    const res = await fileService.saveImageInformation(plod);
    const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${userId}/avatar`;
    const saveRes = await userService.updateAvatar(userId, avatarUrl);
    console.log(saveRes);
    ctx.body = res;
    //将图像信息保存数据库
  }

  async savePictureInfo(ctx, next) {
    const pictures = ctx.req.files;
    const { id: userId } = ctx.user;
    const { momentId } = ctx.query;
    for (const picture of pictures) {
      let plod = [
        picture.filename,
        picture.mimetype,
        picture.size,
        picture.path,
        userId,
        momentId,
      ];
      await fileService.uploadDynamicPictures(plod);
    }
    ctx.body = "配图上传成功";
  }

  async saveVideo(ctx, next) {
    const video = ctx.req.file;
    const { id: userId } = ctx.user;
    const { momentId } = ctx.query;
    const videoInfo = [
      video.filename,
      video.mimetype,
      video.size,
      video.path,
      userId,
      momentId,
    ];
    await fileService.saveVideoInformation(videoInfo);
    ctx.body = "视频上传成功";
  }
  async saveMusic(ctx, next) {
    const music = ctx.req.file;
    const originalname = ctx.req.body.originalname;
    const { id: userId } = ctx.user;
    const { momentId } = ctx.query;
    const musicInfo = [
      originalname,
      music.filename,
      music.mimetype,
      music.size,
      music.path,
      userId,
      momentId,
    ];

    try {
      const res = await fileService.saveMusicInformation(musicInfo);
      ctx.body = "音乐上传成功";
    } catch (error) {
      console.log(error);
    }
  }

  async schedule(ctx, next) {
    var progress = progressStream({ length: "0" }); // 注意这里 length 设置为 '0'
    ctx.request.pipe(progress);
    progress.headers = req.headers;
    progress.on("progress", function (obj) {
      console.log("progress: %s", obj.percentage);
    });
  }
}
module.exports = new FileController();
