const pool = require("./db");

async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("PostgreSQL Connected Successfully!");
    console.log("Database Time:", result.rows[0].now);
  } catch (error) {
    console.error("Database Connection Failed:", error.message);
  } finally {
    await pool.end();
  }
}

testConnection();