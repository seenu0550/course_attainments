const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/courses', require('./routes/courses'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/data', require('./routes/data'));
app.use('/api/attainment', require('./routes/attainment'));
app.use('/api/report', require('./routes/report'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
