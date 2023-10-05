const express = require('express');
const router = express.Router();

const {markAttendance, getAttendanceRecord, getUserImage} = require('../controllers/attendController');

router.get('/', getAttendanceRecord);
router.get('/image', getUserImage);
router.post('/add/', markAttendance);


module.exports = router;