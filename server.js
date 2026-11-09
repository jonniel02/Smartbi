const express = require('express');
const cors = require('cors');
const pool = require('./db');
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
  } catch (err) {
    console.error("WAITLIST ERROR:", err.message);
    // This line na the magic - e return error, e NO crash server
    res.status(500).json({success: false, error: err.message});
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Running on " + PORT));
