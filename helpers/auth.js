const db = require('../config/database');

const userTable = 'user';

module.exports = {
  async getUser(email, userType = null) {
    try {
      let sql;
      if (userType) {
        sql = `SELECT email, password, user_type_id FROM ${userTable} WHERE email = "${email}" AND user_type_id=${userType}`;
      } else {
        sql = `SELECT email, password, user_type_id FROM ${userTable} WHERE email = "${email}"`;
      }
      return await db.query(sql);
    } catch (e) {
      throw e;
    }
  },
};
