const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Auto-create database + table on startup
(async () => {
  try {
    await pool.query(`CREATE DATABASE IF NOT EXISTS smartbi`);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS smartbi.waitlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Database smartbi + waitlist table ready");
  } catch (err) {
    console.log("Setup error:", err.message, "| CODE:", err.code);
  }
})();

app.get('/', (req, res) => {
  res.json({message: "SmartBI Backend is running!"});
});

app.post('/api/waitlist', async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name || !phone) {
      return res.status(400).json({success: false, error: "name and phone required"});
    }
    await pool.query("INSERT INTO smartbi.waitlist (name, phone) VALUES (?, ?)", [name, phone]);
    res.json({success: true, message: "Added to waitlist"});
  } catch (err) {
    console.log("WAITLIST ERROR:", err.message, "| CODE:", err.code);
    res.status(500).json({success: false, error: err.message});
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Running on " + PORT));
