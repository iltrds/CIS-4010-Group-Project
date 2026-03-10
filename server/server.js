const express = require('express');
const cors = require('cors');
const app = express();

// Allow all origins temporarily to test
app.use(cors());
app.use(express.json());

app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

app.listen(8080, () => console.log('Server running on port 8080'));