const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const csvParser = require('csv-parser');
const fs = require('fs');
const multer = require('multer');
const DataModel = require('./datamodel'); // Import your Mongoose model

const app = express();
const port = 5000;

mongoose.connect('mongodb://localhost:27017/datas', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const upload = multer({ dest: 'tmp/csv/' });

app.use(cors());

app.post('/upload', upload.single('csvFile'), async (req, res) => {
  const file = req.file;
  const filename = file.originalname; // Get the original name of the uploaded file

  try {
    // Check if the file with the same name exists in the collection
    const existingFile = await DataModel.findOne({ filename });
    if (existingFile) {
      // File already exists, send a response indicating that the file exists
      console.log('File already exists:', filename);
      res.status(200).json({ exists: true });

    } else {
      // File doesn't exist, proceed with saving the data to MongoDB
      const results = [];
      let skipRows = 12; // Skip the first two rows of the CSV file
      fs.createReadStream(file.path)
        .pipe(csvParser({ skipLines: 8 })) // Set the separator to tab (assuming tab is the delimiter)
        .on('data', (row) => {
          if (skipRows > 0) {
            skipRows--;
            return;
          }
          console.log('Row data:', row);
          results.push(row);
        })
        .on('end', async () => {
          try {
            // Save the data to MongoDB with the filename
            const savedData = await DataModel.insertMany(results.map(row => ({ ...row, filename })));
            console.log('Data saved successfully');
            res.status(200).json({ message: 'Data saved successfully', savedData });
          } catch (err) {
            console.error('Error saving data to MongoDB:', err);
            res.status(500).json({ error: 'Failed to save data to MongoDB' });
          }
        })
        .on('error', (err) => {
          console.error('Error parsing CSV:', err);
          res.status(500).json({ error: 'Failed to parse CSV file' });
        });
    }
  } catch (err) {
    console.error('Error checking file existence in MongoDB:', err);
    res.status(500).json({ error: 'Failed to check file existence in MongoDB' });
  }
});

app.get('/data', async (req, res) => {
  try {
    const allData = await DataModel.find({});
    res.status(200).json(allData);
  } catch (err) {
    console.error('Error retrieving data from MongoDB:', err);
    res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
  }
});
app.post('/checkFile', upload.single('csvFile'), async (req, res) => {
  const file = req.file;
  const filename = file.originalname;

  try {
    // Check if the file with the same name exists in the collection
    const existingFile = await DataModel.findOne({ filename });

    if (existingFile) {
      // File already exists, send a response indicating that the file exists
      res.status(200).json({ exists: true });
    } else {
      // File does not exist, send a response indicating that the file does not exist
      res.status(200).json({ exists: false });
    }
  } catch (err) {
    console.error('Error checking file existence:', err);
    res.status(500).json({ error: 'Failed to check file existence' });
  }
});


app.get('/', (req, res) => {
  res.send('<h1>Server is running</h1>');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
