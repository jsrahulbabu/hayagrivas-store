const express = require("express");
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");
require("dotenv").config();

const jwt = require("jsonwebtoken");

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

// app.use(express.json());

app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY id"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Products fetch error:", error.message);

    res.status(500).json({
      message: "Failed to fetch products"
    });
  }
});

app.use(express.json());


// ADMIN: Get all products
app.get("/api/admin/products", authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY id DESC"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Admin get products error:", error);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
});


 // ADMIN: Add new product
app.post("/api/admin/products", authenticateAdmin, async (req, res) => {
  try {
    const { name, price, description, image_url, category } = req.body || {};

    const allowedCategories = [
      "Rice",
      "Dal",
      "Oil",
      "Snacks",
      "Beverages",
      "Household",
    ];

    if (
      typeof name !== "string" ||
      !name.trim() ||
      price === undefined ||
      price === null ||
      price === "" ||
      !Number.isFinite(Number(price)) ||
      Number(price) <= 0 ||
      typeof category !== "string" ||
      !allowedCategories.includes(category)
    ) {
      return res.status(400).json({
        message: "Valid name, positive price and category are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO products
       (name, price, description, image_url, category)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        name.trim(),
        Number(price),
        description || null,
        image_url || null,
        category,
      ]
    );

    res.status(201).json({
      message: "Product added successfully",
      product: result.rows[0],
    });

  } catch (error) {
    console.error("Admin add product error:", error);

    res.status(500).json({
      message: "Failed to add product",
    });
  }
});


// ADMIN: Update product
app.put("/api/admin/products/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, image_url, category } = req.body || {};

    const allowedCategories = [
      "Rice",
      "Dal",
      "Oil",
      "Snacks",
      "Beverages",
      "Household",
    ];

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    if (
      typeof name !== "string" ||
      !name.trim() ||
      price === undefined ||
      price === null ||
      price === "" ||
      !Number.isFinite(Number(price)) ||
      Number(price) <= 0 ||
      typeof category !== "string" ||
      !allowedCategories.includes(category)
    ) {
      return res.status(400).json({
        message: "Valid name, positive price and category are required",
      });
    }

    const result = await pool.query(
      `UPDATE products
       SET name = $1,
           price = $2,
           description = $3,
           image_url = $4,
           category = $5
       WHERE id = $6
       RETURNING *`,
      [
        name.trim(),
        Number(price),
        description || null,
        image_url || null,
        category,
        Number(id),
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: result.rows[0],
    });

  } catch (error) {
    console.error("Admin update product error:", error);

    res.status(500).json({
      message: "Failed to update product",
    });
  }
});


 // ADMIN: Delete product
app.delete("/api/admin/products/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [Number(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product: result.rows[0],
    });

  } catch (error) {
    console.error("Admin delete product error:", error);

    res.status(500).json({
      message: "Failed to delete product",
    });
  }
});


app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // 1. Check all required fields
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof mobile !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !mobile.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Please fill in all fields",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanMobile = mobile.trim();

    // 2. Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    // 3. Validate mobile number
    if (!/^\+?[0-9]{10,15}$/.test(cleanMobile)) {
      return res.status(400).json({
        message: "Please enter a valid mobile number",
      });
    }

    // 4. Validate password
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    // 5. Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // 6. Save customer in PostgreSQL
    const result = await pool.query(
      `INSERT INTO customers
       (name, email, mobile, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, mobile, created_at`,
      [cleanName, cleanEmail, cleanMobile, passwordHash]
    );

    // 7. Send successful response
    res.status(201).json({
      message: "Registration successful",
      customer: result.rows[0],
    });

  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Email or mobile number is already registered",
      });
    }

    console.error("Registration error:", error.message);

    res.status(500).json({
      message: "Registration failed",
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const result = await pool.query(
      `SELECT id, name, email, mobile, password_hash
       FROM customers
       WHERE email = $1`,
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const customer = result.rows[0];

    const isPasswordValid = await bcrypt.compare(
      password,
      customer.password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Authentication configuration error",
      });
    }

    const token = jwt.sign(
      { customerId: customer.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        mobile: customer.mobile,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Login failed",
    });
  }
});

// Admin Login API
app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find admin account
    const result = await pool.query(
      `SELECT id, name, email, password_hash, role
       FROM customers
       WHERE email = $1 AND role = 'admin'`,
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid admin email or password",
      });
    }

    const admin = result.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      admin.password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid admin email or password",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Authentication configuration error",
      });
    }

    // Generate admin token
    const token = jwt.sign(
      {
        customerId: admin.id,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });

  } catch (error) {
    console.error("Admin login error:", error.message);

    return res.status(500).json({
      message: "Admin login failed",
    });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Please log in to place an order.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.customerId = decoded.customerId;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token. Please log in again.",
    });
  }
}

async function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Admin login required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Admin access only",
      });
    }

    const result = await pool.query(
      "SELECT id FROM customers WHERE id = $1 AND role = 'admin'",
      [decoded.customerId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        message: "Admin account not authorized",
      });
    }

    req.adminId = decoded.customerId;
    next();

  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        message: "Invalid or expired admin token",
      });
    }

    console.error("Admin authentication error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

app.post("/api/orders", authenticateToken, async (req, res) => {
  const { customer_name, phone, address, items } = req.body;

  if (
    !customer_name ||
    !phone ||
    !address ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({
      message: "Please provide customer details and products",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const result = await client.query(
        "SELECT id, name, price FROM products WHERE id = $1",
        [item.id]
      );

      if (result.rows.length === 0) {
        throw new Error(`Product ${item.id} not found`);
      }

      const product = result.rows[0];
      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error("Invalid product quantity");
      }

      const price = Number(product.price);
      const subtotal = price * quantity;
      total += subtotal;

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        price,
        quantity,
        subtotal,
      });
    }

    
const orderResult = await client.query(
  `INSERT INTO orders
   (customer_id, customer_name, phone, address, total_amount, payment_method)
   VALUES ($1, $2, $3, $4, $5, $6)
   RETURNING id`,
  [
    req.customerId,
    customer_name,
    phone,
    address,
    total,
    "Cash on Delivery",
  ]
);


    const orderId = orderResult.rows[0].id;

    for (const item of orderItems) {
      await client.query(
        `INSERT INTO order_items
         (order_id, product_id, product_name, price, quantity, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          orderId,
          item.product_id,
          item.product_name,
          item.price,
          item.quantity,
          item.subtotal,
        ]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Order placed successfully",
      orderId,
      total,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Order error:", error.message);

    res.status(500).json({
      message: "Failed to place order",
    });
  } finally {
    client.release();
  }
});


app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, mobile
       FROM customers
       WHERE id = $1`,
      [req.customerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json({
      customer: result.rows[0],
    });
  } catch (error) {
    console.error("My Account error:", error.message);

    res.status(500).json({
      message: "Failed to fetch customer details",
    });
  }
});


app.put("/api/auth/update-profile", authenticateToken, async (req, res) => {
  const { name, email, mobile } = req.body;

  if (!name || !email || !mobile) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const existingCustomer = await pool.query(
      "SELECT id FROM customers WHERE email = $1 AND id != $2",
      [email.trim(), req.customerId]
    );

    if (existingCustomer.rows.length > 0) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const result = await pool.query(
      `UPDATE customers
       SET name = $1, email = $2, mobile = $3
       WHERE id = $4
       RETURNING id, name, email, mobile`,
      [name.trim(), email.trim(), mobile.trim(), req.customerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json({
      message: "Profile updated successfully",
      customer: result.rows[0],
    });
  } catch (error) {
    console.error("Profile update error:", error);

    res.status(500).json({
      message: "Unable to update profile",
    });
  }
});


// app.get("/api/my-orders", authenticateToken, async (req, res) => {
//   try {

//     const result = await pool.query(
//   `SELECT id, customer_name, phone, address,
//           total_amount, payment_method
//    FROM orders
//    WHERE customer_id = $1
//    ORDER BY id DESC`,
//   [req.customerId]
// );

//     res.json({
//       orders: result.rows,
//     });
//   } catch (error) {
//     console.error("My Orders error:", error.message);

//     res.status(500).json({
//       message: "Failed to fetch orders",
//     });
//   }
// });

// ---


app.get("/api/my-orders", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         o.id,
         o.customer_name,
         o.phone,
         o.address,
         o.total_amount,
         o.payment_method,
         o.status,
         COALESCE(
           json_agg(
             json_build_object(
               'product_name', oi.product_name,
               'price', oi.price,
               'quantity', oi.quantity,
               'subtotal', oi.subtotal
             )
           ) FILTER (WHERE oi.id IS NOT NULL),
           '[]'::json
         ) AS items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.customer_id = $1
       GROUP BY o.id
       ORDER BY o.id DESC`,
      [req.customerId]
    );

    console.log("My Orders API result:", JSON.stringify(result.rows, null, 2));

    res.json({
      orders: result.rows,
    });
  } catch (error) {
    console.error("My Orders error:", error.message);

    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
});

// Get Individual Order Details
app.get(
  "/api/my-orders/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const orderId = Number(req.params.id);

      if (!Number.isInteger(orderId) || orderId < 1) {
        return res.status(400).json({
          message: "Invalid Order ID",
        });
      }

      // 1. Get order details for the logged-in customer
      const orderResult = await pool.query(
        `SELECT
           id,
           customer_name,
           phone,
           address,
           total_amount,
           payment_method,
           status,
           created_at
         FROM orders
         WHERE id = $1 AND customer_id = $2`,
        [orderId, req.customerId]
      );

      if (orderResult.rows.length === 0) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      // 2. Get products belonging to this order
      const itemsResult = await pool.query(
        `SELECT
           product_name,
           price,
           quantity,
           subtotal
         FROM order_items
         WHERE order_id = $1`,
        [orderId]
      );

      // 3. Send complete order details
      res.json({
        order: {
          ...orderResult.rows[0],
          items: itemsResult.rows,
        },
      });

    } catch (error) {
      console.error("Order Details error:", error.message);

      res.status(500).json({
        message: "Failed to fetch order details",
      });
    }
  }
);

app.put(
  "/api/auth/change-password",
  authenticateToken,
  async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must contain at least 8 characters",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }

    try {
      const result = await pool.query(
        "SELECT password_hash FROM customers WHERE id = $1",
        [req.customerId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Customer not found",
        });
      }

      const isMatch = await bcrypt.compare(
        currentPassword,
        result.rows[0].password_hash
      );

      if (!isMatch) {
        return res.status(400).json({
          message: "Current password is incorrect",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await pool.query(
        "UPDATE customers SET password_hash = $1 WHERE id = $2",
        [hashedPassword, req.customerId]
      );

      return res.json({
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Change password error:", error);

      return res.status(500).json({
        message: "Unable to change password",
      });
    }
  }
);

// ADMIN: Get all customers
app.get("/api/admin/customers", authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         c.id,
         c.name,
         c.email,
         c.mobile,
         c.created_at,
         COUNT(o.id)::int AS total_orders,
         COALESCE(SUM(o.total_amount), 0) AS total_purchase
       FROM customers c
       LEFT JOIN orders o
         ON o.customer_id = c.id
       WHERE c.role = 'customer'
       GROUP BY c.id
       ORDER BY c.id DESC`
    );

    res.status(200).json(result.rows);

  } catch (error) {
    console.error("Admin Customers error:", error);

    res.status(500).json({
      message: "Failed to fetch customers",
    });
  }
});

// ADMIN: Get all customer orders
app.get("/api/admin/orders", authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
  `SELECT
     o.id,
     o.customer_id,
     o.customer_name,
     o.phone,
     o.address,
     o.total_amount,
     o.payment_method,
     o.status,
     o.created_at,
     COALESCE(
       json_agg(
         json_build_object(
           'product_name', oi.product_name,
           'price', oi.price,
           'quantity', oi.quantity,
           'subtotal', oi.subtotal
         )
       ) FILTER (WHERE oi.order_id IS NOT NULL),
       '[]'::json
     ) AS items
   FROM orders o
   LEFT JOIN order_items oi
     ON oi.order_id = o.id
   GROUP BY o.id
   ORDER BY o.id DESC`
);

    res.status(200).json(result.rows);

  } catch (error) {
    console.error("Admin Orders error:", error);

    res.status(500).json({
      message: "Failed to fetch all orders",
    });
  }
});

// ADMIN: Update Order Status
app.put("/api/admin/orders/:id/status", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = [
      "Pending",
      "Confirmed",
      "Packed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const result = await pool.query(
      `UPDATE orders
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order: result.rows[0],
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({
      message: "Failed to update order status",
    });
  }
});

app.get("/api/admin/test", authenticateAdmin, (req, res) => {
  res.status(200).json({
    message: "Admin access granted",
    adminId: req.adminId,
  });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});