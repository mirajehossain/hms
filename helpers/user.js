const db = require('../config/database');

const userTable = 'users';

module.exports = {
  async getUser(email, userType = null) {
    try {
      let sql;
      if (userType) {
        sql = `SELECT email, password, userType FROM ${userTable} WHERE email = ${email} AND userType=${userType}`;
      } else {
        sql = `SELECT email, password, userType FROM ${userTable} WHERE email = ${email}`;
      }
      return await db.query(sql);
    } catch (e) {
      throw e;
    }
  },

  async createUser(user) {
    try {
      console.log('user: ', user);
      // eslint-disable-next-line camelcase
      const { email, password, user_type_id, ...profile } = user;
      // const sql = `-- INSERT INTO ${userTable} ( ${columns.join(', ')} ) VALUES (?,?,?,?,?)`;
      // const sql = `-- INSERT INTO ${userTable} SET ? ${{ user_type_id, email, password }}`;
      let d = { user_type_id, email, password };
      const sql = "INSERT INTO user SET ?"+ d;
      return await db.query(sql);
    } catch (e) {
      throw e;
    }
  },
};
