const express = require('express');
const dataRouter = require('../controller/dataRoutes.js'); // Import the data router from the data folder

const router = express.Router();

const app = express()

// Define your root routes here, if any
router.get('/', (req, res) => {
  res.send('<h1>Server is running</h1>');
});

// Mount the dataRouter under the '/data' path
app.use('/data', dataRouter);
module.exports = app;
