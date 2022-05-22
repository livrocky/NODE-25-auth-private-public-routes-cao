const mysql = require('mysql2/promise');
const { dbConfig } = require('../config');

async function addUserToDb(email, password) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const sql = `
      INSERT INTO users(email, password)
      VALUES (?, ?)
      `;
    const [result] = await connection.execute(sql, [email, password]);
    return result;
  } catch (error) {
    console.log('error addUserToDb', error);
    return false;
  } finally {
    connection?.end();
  }
}

async function findUserByEmail(email) {
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    const sql = `
      SELECT * FROM users WHERE email = ? 
      `;
    const [result] = await conn.execute(sql, [email]);
    return result[0];
  } catch (error) {
    console.log('error findUserByEmail', error);
    return false;
  } finally {
    conn?.end();
  }
}

async function countUsers(email) {
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    const sql = `
    SELECT COUNT(id) AS Users FROM users
        `;
    const [result] = await conn.execute(sql, [email]);
    return result[0];
  } catch (error) {
    console.log('countUsers===', error);
    return false;
  } finally {
    conn?.end();
  }
}

module.exports = {
  addUserToDb,
  findUserByEmail,
  countUsers,
};
