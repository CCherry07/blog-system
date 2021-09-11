const connection = require("../app/database");
class LabelService {
  async createLabel(label) {
    const statement = `
    INSERT INTO label(name) VALUES(?);
    `;
    const [res] = await connection.promise().execute(statement, [label]);
    return res;
  }

  async getLabelByName(label) {
    const statement = `
    SELECT * FROM label WHERE name = ?;
    `;
    const [res] = await connection.promise().execute(statement, [label]);
    return res;
  }
  async getLabels(limit, offset) {
    const statement = `     
      SELECT * FROM label LIMIT ? , ?;
    `;
    const [res] = await connection
      .promise()
      .execute(statement, [offset, limit]);
    return res;
  }
}
module.exports = new LabelService();
