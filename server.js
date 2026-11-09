const express = require('express');
const cors = require('cors');
const pool = require('./db');
// Auto-create database + table on startup
(async () => {
  try {
    await pool.query(`CREATE DATABASE IF NOT EXISTS smartbi`);
    await pool.query(`USE smartbi`);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS waitlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Database smartbi + waitlist table ready ✅");
  } catch (e) {
    console.log("Setup error:", e.message);
  }
})();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({message: "SmartBI Backend is running!"});
});

app.post('/api/waitlist', async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name || !phone) {
      return res.status(400).json({success: false, error: "name and phone required"});
    }
    await pool.query("INSERT INTO waitlist (name, phone) VALUES (?, ?)", [name, phone]);
    res.json({success: true, message: "Added to waitlist"});
    ‎    } catch (err) {
    console.log("Setup error FULL:", err.message, "| CODE:", err.code, "| ERRNO:", err.errno)
    // This line na the magic - e return error, e NO crash server
    res.status(500).json({success: false, error: err.message});
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Running on " + PORT));
