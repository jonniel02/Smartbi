const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => res.json({ message: 'SmartBI Backend is running!' }));
app.post('/api/waitlist', async (req, res) => {
  const { name, phone } = req.body;
  await db.query('INSERT INTO waitlist (name, phone) VALUES (?, ?)', [name, phone]);
  res.json({ success: true });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on ${PORT}`));
