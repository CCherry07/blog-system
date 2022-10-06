const fs = require("fs");
const { stat } = require("fs").promises;
const fileService = require("../service/file.service");
const momentService = require("../service/moment.service");

class MomentController {
  async createMoment(ctx, next) {
    // 获取用户信息（userID ， content）
    const { id, name } = ctx.user;
    const content = ctx.request.body.content;
    const res = await momentService.releaseDynamics(id, content);
    ctx.body = res;
  }
  async getDynamic(ctx, next) {
    //获取momentID
    const momentId = ctx.params.momentId;
    //查询数据
    const res = await momentService.getDynamicById(momentId);
    ctx.body = res;
  }
  async getMultipleDynamics(ctx, next) {
    // 起始位置 偏移
    const { offset, size } = ctx.request.query;
    const res = await momentService.getMultipleDynamicsList(offset, size);
    ctx.body = res;
  }

  async updateDynamic(ctx, next) {
    const momentId = ctx.params.momentId;
    const content = ctx.request.body.content;
    const res = await momentService.setDynamic(content, momentId);
    ctx.body = res;
  }

  async deleteDynamic(ctx, next) {
    const momentId = ctx.params.momentId;
    const res = await momentService.deleteDynamicById(momentId);
    ctx.body = res;
  }

  async setLabels(ctx, next) {
    const { labels } = ctx;
    const { momentId } = ctx.params;
    //动态设置所有标签
    for (const label of labels) {
      const res = await momentService.hasLabel(momentId, label.id);
      if (!res[0]) {
        await momentService.setLabels(momentId, label.id);
      }
    }
    ctx.body = labels;
  }
  async getImage(ctx, next) {
    const { filename } = ctx.params;
    let { size } = ctx.query;
    const sizes = ["small", "middle", "large"];
    if (typeof size === "string") {
      size = sizes.find((item) => size === item);
    } else {
      size = "";
    }
    const imageType = ctx.imageType;
    const imageInfo = await fileService.getImageInfo(filename);
    ctx.response.set("content-type", imageInfo.mimetype);
    if (imageType) {
      ctx.body = fs.createReadStream(imageInfo.path + imageType);
    } else {
      ctx.body = fs.createReadStream(imageInfo.path + size);
    }
  }
  async getVideo(ctx, next) {
    const { filename } = ctx.params;
    const videoInfo = await fileService.getVideoInfo(filename);
    let { range } = ctx.request.header;
    if (range) {
      //获取文件信息
      let stats = await stat(videoInfo.path);
      //对请求头range解析
      let r = range.match(/=(\d+)+(\d+)?/);
      //开始位置
      let start = parseInt(r[1], 10);
      //结束位置
      let end = r[2] ? parseInt(r[2], 10) : start + 1024 * 1024;
      if (end > stats.size - 1) end = stats.size - 1;
      let head = {
        "access-control-allow-origin": "www",
        "content-type": videoInfo.mimetype,
        "content-range": `bytes ${start}-${end}/${stats.size}`,
        "content-length": end - start + 1,
        "accept-ranges": "bytes",
      };
      try {
        //设置响应头及状态码
        ctx.response.set(head);
        ctx.status = 206;
      } catch (error) {
        throw error;
      }
      ctx.body = fs.createReadStream(videoInfo.path, {
        start: start,
        end: end,
      });
    } else {
      ctx.response.set("content-type", videoInfo.mimetype);
      ctx.body = fs.createReadStream(videoInfo.path);
    }
  }
  async getMusic(ctx, next) {
    const { filename } = ctx.params;
    const musicInfo = await fileService.getMusicInfo(filename);
    console.log(musicInfo);
    let { range } = ctx.request.header;
    if (range) {
      //获取文件信息
      let stats = await stat(musicInfo.path);
      //对请求头range解析
      let r = range.match(/=(\d+)+(\d+)?/);
      //开始位置
      let start = parseInt(r[1], 10);
      //结束位置
      let end = r[2] ? parseInt(r[2], 10) : start + 1024 * 1024;
      if (end > stats.size - 1) end = stats.size - 1;
      let head = {
        "access-control-allow-origin": "cheery7",
        "content-type": musicInfo.mimetype,
        "content-range": `bytes ${start}-${end}/${stats.size}`,
        "content-length": end - start + 1,
        "accept-ranges": "bytes",
      };
      try {
        //设置响应头及状态ma
        ctx.response.set(head);
        ctx.status = 206;
      } catch (error) {
        throw error;
      }
      ctx.body = fs.createReadStream(musicInfo.path, {
        start: start,
        end: end,
      });
    } else {
      ctx.response.set("content-type", musicInfo.mimetype);
      ctx.body = fs.createReadStream(musicInfo.path);
    }
  }

  async updateMusic(ctx, next) {
    const { momentId } = ctx.params;
    const music = ctx.req.file;
    const musicInfo = [
      music.originalname,
      music.filename,
      music.mimetype,
      music.size,
      music.path,
      momentId,
    ];
    await fileService.updateMusic(musicInfo);
    ctx.body = "更新成功";
  }
  
  async momentLike(ctx, next) {
    const { id: userId } = ctx.user;å
    const { momentId } = ctx.params;
    const res = await momentService.createLikeAndCollect(
      momentId,
      userId,
      "Like"
    );
    ctx.body = res;
  }
  async momentCollect(ctx, next) {
    const { id: userId } = ctx.user;
    const { momentId } = ctx.params;
    const res = await momentService.createLikeAndCollect(
      momentId,
      userId,
      "Collect"
    );
    ctx.body = res;
  }
  async momentReward() {
    const { id: userId } = ctx.user;
    const { momentId } = ctx.params;
    ctx.body = userId + momentId;
  }
}

module.exports = new MomentController();
