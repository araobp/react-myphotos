require('dotenv').config()
const express = require('express');
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT;

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')))

app.listen(PORT, () => console.log(`Listening on ${PORT}`))