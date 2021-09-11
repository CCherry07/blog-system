const connection = require("../app/database");
class AuthService {
  async permissionControl(tableName, momentId, userId) {
    const statement = `
    SELECT * FROM ${tableName} WHERE id = ? AND user_id =?;
    `;
    try {
      const [res] = await connection
        .promise()
        .execute(statement, [momentId, userId]);
      console.log("permissionControl");
      return res.length > 0 ? true : false;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = new AuthService();
