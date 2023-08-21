const xlsx = require('xlsx');
const mongoose = require('mongoose');
const Attendance = require('../datamodel.js');

const uploadAttendance = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const originalFilename = req.file.originalname.split('.')[0];

    const existingCollections = await mongoose.connection.db.listCollections({ name: originalFilename }).toArray();

    if (existingCollections.length > 0) {
      return res.status(400).json({ error: 'File already exists as a collection' });
    }

    const fileBuffer = req.file.buffer;
    const workbook = xlsx.read(fileBuffer);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet, { defval: '' });

    const dynamicSchema = new mongoose.Schema({}, { strict: false });
    const DynamicAttendance = mongoose.model(originalFilename, dynamicSchema, originalFilename);

    const formattedData = jsonData.map(row => {
      const formattedRow = {
        'Att. Date': row['__EMPTY_1'] || '',
        InTime: row['__EMPTY_2'] || '',
        OutTime: row['__EMPTY_3'] || '',
        Shift: row['__EMPTY_4'] || '',
        '': '',
        'S. InTime': row['__EMPTY_6'] || '',
        'S. OutTime': row['__EMPTY_7'] || '',
        'Work Dur.': row['__EMPTY_9'] || '',
        OT: row['__EMPTY_10'] || '',
        'Tot. Dur.': row['__EMPTY_11'] || '',
        LateBy: row['__EMPTY_12'] || '',
        EarlyGoingBy: row['__EMPTY_13'] || '',
        Status: row['__EMPTY_14'] || '',
        'Punch Records': row['__EMPTY_15'] || '',
        // ... (formatting logic)
      };
      return formattedRow;
      // Formatting logic...
    });

    await DynamicAttendance.insertMany(formattedData);

    const collectionNames = await mongoose.connection.db.listCollections().toArray();
    const collectionNamesArray = collectionNames.map(collection => collection.name);

    res.status(200).json({ message: 'Data formatted and saved successfully', collectionNames: collectionNamesArray });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
const getCollectionNames = async (req, res) => {
  try {
    const collectionNames = await mongoose.connection.db.listCollections().toArray();
    const collectionNamesArray = collectionNames.map(collection => collection.name);

    res.status(200).json({ collectionNames: collectionNamesArray });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

const getCollectionData = async (req, res) => {
  try {
    const collectionName = req.params.collectionName;

    // Check if the model is already registered, and if not, create it
    if (!mongoose.models[collectionName]) {
      const dynamicSchema = new mongoose.Schema({}, { strict: false });
      mongoose.model(collectionName, dynamicSchema);
    }

    // Use the model to fetch collection data
    const DynamicAttendance = mongoose.model(collectionName);
    const collectionData = await DynamicAttendance.find({});

    res.status(200).json({ collectionData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

module.exports = {
  uploadAttendance,
  getCollectionNames,
  getCollectionData,
};
