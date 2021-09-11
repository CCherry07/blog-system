const fs = require("fs");
const path = require("path");
let nods = function (dir) {
  fs.readdir(dir, function (err, files) {
    files.forEach(function (filename) {
      var src = path.join(dir, filename);
      stat(src, function (err, st) {
        if (err) {
          throw err;
        }
        // 判断是否为文件
        if (st.isFile()) {
          fs.unlink(src, (err) => {
            if (err) throw err;
            console.log("成功删除" + src);
          });
        } else {
          // 递归作为文件夹处理
          nods(src);
        }
      });
    });
  });
};
nods("uploads/pictures/2a323d3b056856defa76f69b4b2fa54fauto.text");
