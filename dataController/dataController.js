const DataModel = require("../datamodel.js")
const fs = require('fs');
const csvParser = require('csv-parser');
const cors = require('cors'); 

// UPLOAD DATA

exports.upload = async (req, res) => {
  const file = req.file;
  const filename = file.originalname; 
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
      fs.createReadStream(file.path)
        .pipe(csvParser({ skipLines: 8 })) 
        .on('data', (row) => {  
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
};

// GET DATA


exports.get =  async (req, res) => {
  try {
    const filename = req.query.filename;
    let query = {};

    if (filename) {
      query = { filename: { $regex: new RegExp(filename, 'i') } };
    }

    const allData = await DataModel.find(query);
    res.status(200).json(allData);
  } catch (err) {
    console.error('Error retrieving data from MongoDB:', err);
    res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
  }
};

// Check File


exports.check = async (req, res) => {
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
};

// DEMO

exports.demo = async (req,res)=>{
  console.log("proteced routed")
  res.send("protected Route")

}
