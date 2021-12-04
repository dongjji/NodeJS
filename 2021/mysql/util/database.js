// const mysql = require("mysql2");
require("dotenv").config();

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "node-complete",
//   password: process.env.mysql,
// });

// module.exports = pool.promise();

const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", process.env.mysql, {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
