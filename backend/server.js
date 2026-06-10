const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const employeeRoutes = require('./routes/employeeRoutes');
const eodRoutes = require('./routes/eodRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', employeeRoutes);
app.use('/api', eodRoutes);

app.get('/', (req, res) => {
    res.send('EOD Backend Server Running');
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});