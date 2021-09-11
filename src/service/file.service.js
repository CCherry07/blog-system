const connection = require("../app/database");
class FileService {
  async saveImageInformation(plod) {
    const statement = `
    INSERT INTO avatar(filename ,mimetype, size,path,user_id) VALUES(?,?,?,?,?);
    `;
    const [res] = await connection.promise().execute(statement, plod);
    return res;
  }
  async getAvatarInformationById(userId) {
    const statement = `
    SELECT * FROM avatar WHERE user_id = ?;
    `;
    const [res] = await connection.promise().execute(statement, [userId]);
    return res[0];
  }
  async uploadDynamicPictures(plod) {
    console.log(plod);
    const statement = `
    INSERT INTO dynamicPicture(filename ,mimetype, size,path,user_id,moment_id) VALUES(?,?,?,?,?,?);
    `;
    const [res] = await connection.promise().execute(statement, plod);
    return res;
  }
  async getImageInfo(filename) {
    const statement = `
    SELECT * FROM dynamicPicture WHERE filename = ?;
    `;
    const [res] = await connection.promise().execute(statement, [filename]);
    return res[0];
  }
  async getVideoInfo(filename) {
    const statement = `
    SELECT * FROM video WHERE filename = ?;
    `;
    const [res] = await connection.promise().execute(statement, [filename]);
    return res[0];
  }

  async saveVideoInformation(videoInfo) {
    const statement = `
    INSERT INTO video(filename ,mimetype, size,path,user_id,moment_id) VALUES(?,?,?,?,?,?);
    `;
    try {
      const [res] = await connection.promise().execute(statement, videoInfo);
      return res;
    } catch (error) {}
    throw error;
  }
  async saveMusicInformation(musicInfo) {
    const statement = `
    INSERT INTO music(originalname,filename ,mimetype, size,path,user_id,moment_id) VALUES(?,?,?,?,?,?,?);
    `;
    try {
      const [res] = await connection.promise().execute(statement, musicInfo);
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateMusic(musicInfo) {
    const statement = `
      UPDATE music SET originalname=?,filename=? ,mimetype=?, size=?,path=? WHERE moment_id = ?;
      `;
    try {
      const [res] = await connection.promise().execute(statement, musicInfo);
      return res;
    } catch (error) {
      throw error;
    }
  }
  async getMusicInfo(filename) {
    const statement = `
    SELECT * FROM music WHERE filename = ?;
    `;
    const [res] = await connection.promise().execute(statement, [filename]);
    return res[0];
  }
}
module.exports = new FileService();
