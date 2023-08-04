const router = require("express").Router()

const multer = require('multer');

const dataindex = require("../dataController/dataController.js")



const upload = multer({ dest: 'tmp/csv/' });

router.post('/upload', upload.single('csvFile'),dataindex.upload)
router.post('/checkFile', upload.single('csvFile'),dataindex.check)
router.get('/data', dataindex.get)
router.get('/demo', dataindex.demo)


module.exports = router