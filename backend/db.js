// const { Pool } = require("pg");

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "my_ecommerce",
//   password: "MyNewDB26!",
//   port: 5432,
// });

// module.exports = pool;


require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

module.exports = pool;
