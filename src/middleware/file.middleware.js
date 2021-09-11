const Multer = require("koa-multer");
const Jimp = require("jimp");
const fileService = require("../service/file.service");
const AVATAR_URL = "./uploads/avatar";
const PICTURE_URL = "./uploads/pictures";
const VIDEO_URL = "./uploads/video";
const MUSIC_URL = "./uploads/music";
const avatarUpload = Multer({
  dest: AVATAR_URL,
});
const pictureUpload = Multer({
  dest: PICTURE_URL,
});
const videoUpload = Multer({
  dest: VIDEO_URL,
  limits: {
    fileSize: 200 * 1024 * 1024,
  },
});
const musicUpload = Multer({
  dest: MUSIC_URL,
});

const avatarHandler = avatarUpload.single("avatar");
const pictureHandler = pictureUpload.array("picture", 9);
const videoHandler = videoUpload.single("video");
const musicHandler = musicUpload.single("music");
//图片自定义 大中小
const pictureResize = async (ctx, next) => {
  const pictures = ctx.req.files;
  for (const picture of pictures) {
    Jimp.read(picture.path).then((image) => {
      image.resize(1280, Jimp.AUTO).write(`${picture.path}large`);
      image.resize(640, Jimp.AUTO).write(`${picture.path}middle`);
      image.resize(320, Jimp.AUTO).write(`${picture.path}small`);
    });
  }
  await next();
};

//对图片size 自定义
const customizeImage = async (ctx, next) => {
  const { size } = ctx.query;
  const { filename } = ctx.params;
  const res = await fileService.getImageInfo(filename);
  const imagePath = res.path;
  let type = "";
  const sizeReg = new RegExp("x");
  const numReg = /^[0-9]*$/;
  if (sizeReg.test(size)) {
    const index = size.indexOf("x");
    const size1 = Number(size.slice(0, index).trim());
    const size2 = Number(size.slice(index + 1).trim());
    Jimp.read(imagePath).then((image) => {
      if (size1 && size2) {
        image.resize(size1, size2).write(`${imagePath}customize`);
      }
    });
    type = "customize";
    ctx.imageType = type;
    await next();
  } else if (numReg.test(size)) {
    const newSize = Number(size.trim());
    console.log(typeof newSize);
    Jimp.read(imagePath).then((image) => {
      if (typeof newSize === "number") {
        image.resize(newSize, Jimp.AUTO).write(`${imagePath}auto`);
      }
    });
    type = "auto";
    ctx.imageType = type;
    await next();
  } else {
    await next();
  }
};

module.exports = {
  avatarHandler,
  pictureHandler,
  pictureResize,
  customizeImage,
  videoHandler,
  musicHandler,
};
