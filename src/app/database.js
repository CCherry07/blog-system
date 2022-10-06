const mysql = require("mysql2");
const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
} = require("./config");
const connects = mysql.createPool({
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  database: MYSQL_DATABASE,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
});
//数据库链接成功？

connects.getConnection((err, conn) => {
  if (err instanceof Error) {
    throw err
  }else{
    conn.connect(err => {
    if (err) {
      console.log("数据库链接失败", err);
      throw err
    } else {
      console.log("数据库已链接成功");
    }
  });
  }
});
module.exports = connects;
