const connection = require("../app/database");
class UserService {
  async create(user) {
    const { name, password } = user;
    const statement = `INSERT INTO users (name , password) VALUES(?,?);`;
    const result = await connection
      .promise()
      .execute(statement, [name, password]);
    return result[0];
  }
  async getUserByName(name) {
    const statement = `SELECT * FROM users WHERE name = ?;`;
    const result = await connection.promise().execute(statement, [name]);
    return result[0];
  }
  async updateAvatar(userId, url) {
    const statement = `
    UPDATE users SET avatar_url = ? WHERE id = ?;
    `;
    try {
      const [res] = await connection
        .promise()
        .execute(statement, [url, userId]);
      return res;
    } catch (error) {}
    throw error;
  }
}

module.exports = new UserService();
