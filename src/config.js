require('dotenv').config();

const PORT = process.env.PORT || 5000;

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DB,
};

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error('no jwt secret found in .env');
console.log('dbConfig ===', dbConfig);

module.exports = {
  PORT,
  dbConfig,
  jwtSecret,
};
