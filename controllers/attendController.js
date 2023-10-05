const Attendance = require('../models/attendance');
const User = require('../models/user');

const markAttendance = (req, res) => {

    Attendance.findOne({ user: req.user._id })
        .then(record => {
            //const date = new Date().toLocaleString();
            record.timestamps.push(req.body.date);
            record.save();
            res.status(200).json({ message: "Attendance Marked successfully", record })
        })
        .catch(error => res.status(500).json({ error }))
}

const getAttendanceRecord = (req, res) => {

    Attendance.findOne({ user: req.user._id })
        .then(record => {
            if(record) res.status(200).json({timestamps: record.timestamps })
        })
        .catch(error => res.status(500).json({ error }))
}

const getUserImage = (req, res) => {
    User.findById(req.user._id)
        .then(user => {
            if(user) res.status(200).json({error: null, image: user.image })
        })
        .catch(error => res.status(500).json({ error }))
}

module.exports = {markAttendance, getAttendanceRecord, getUserImage};