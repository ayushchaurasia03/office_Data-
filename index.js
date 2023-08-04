const express = require('express');
const cors = require('cors'); // Import your Mongoose model
const connectDB = require("./database/database.js")
const dataRouter = require("./router/index.js")
require('dotenv').config();


const app = express();
const port = process.env.PORT;

connectDB()

app.use(cors());

app.use("/",dataRouter)

app.get('/', (req, res) => {
  res.send('<h1>Server is running</h1>');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
