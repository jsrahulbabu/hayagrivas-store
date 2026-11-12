const pool = require("./db");
const bcrypt = require("bcrypt");
require("dotenv").config();

async function createAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error("Admin credentials missing in .env");
    }

    if (password.length < 12) {
      throw new Error("Admin password must contain at least 12 characters");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO customers
       (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'admin')
       ON CONFLICT (email)
       DO UPDATE SET
         password_hash = EXCLUDED.password_hash,
         role = 'admin'
       RETURNING id, name, email, role`,
      ["Store Admin", email.trim().toLowerCase(), hashedPassword]
    );

    console.log("Admin account created successfully:");
    console.log(result.rows[0]);

  } catch (error) {
    console.error("Admin creation error:", error.message);
  } finally {
    await pool.end();
  }
}

createAdmin();