const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const attendanceController = require('../dataController/dataController');

const router = express.Router();
const upload = multer();

router.post('/upload', upload.single('file'), attendanceController.uploadAttendance);
router.get('/collectionNames', attendanceController.getCollectionNames);
router.get('/collectionData/:collectionName', attendanceController.getCollectionData);

module.exports = router;
