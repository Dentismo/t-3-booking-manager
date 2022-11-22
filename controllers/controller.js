var express = require('express');
var router = express.Router({ mergeParams: true });
var BookingRequest = require('../models/bookingRequest.js');


//Get BookingRequest by id
router.get('/:id', function(req, res, next) {
    var id = req.params.id
    BookingRequest.findById(id, function(err, bookingRequest) {
        if (err) { return next(err); }
        if (!bookingRequest) {
            return res.status(404).json({ 'message': 'Booking request was not found!' });
        }
        res.status(200).json(bookingRequest);
    });
});

//Update entire booking request
router.put('/:id', function(req, res, next) {
    var id = req.params.id;
    BookingRequest.findById(id, function(err, bookingRequest) {
        if (err) { return next(err); }
        if (!bookingRequest) {
            return res.status(404).json({ "message": "Booking request not found" });
        }
        var date = req.body.date
        var user_ID = req.body.user_ID
        var issuance = req.body.issuance
        var clinicId = req.body.clinicId
        if (!(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/.test(date))){
            return res.json({"message": "Date must be in DD-MM-YYYY format"});
        } else if (date === null) {
            return res.json({ "message": "Date is required" });
        } else {
        bookingRequest.user_ID = user_ID
        bookingRequest.clinicId = clinicId
        bookingRequest.issuance = issuance
        bookingRequest.date = date
        bookingRequest.state = state
        bookingRequest.save();
        res.status(200).json(bookingRequest);
        }
    });
});

//Update all/part of a booking request
router.patch('/:id', function(req, res, next) {
    var id = req.params.id;
    BookingRequest.findById(id, function(err, bookingRequest) {
        if (err) { return next(err); }
        if (!bookingRequest) {
            return res.status(404).json({ "message": "Booking request was not found" });
        }
        bookingRequest.user_ID = (req.body.user_ID || bookingRequest.user_ID)
        bookingRequest.clinicId = (req.body.clinicId || bookingRequest.clinicId)
        bookingRequest.issuance = (req.body.issuance || bookingRequest.issuance)
        bookingRequest.date = (req.body.date || bookingRequest.date)
        bookingRequest.state = (req.body.state || bookingRequest.state)
        bookingRequest.save();
        res.status(200).json(bookingRequest);
    });
});

//Create a booking request
router.post('/', function(req, res, next){
    var bookingRequest = new BookingRequest(req.body);
    bookingRequest.save(function(err) {
        if (err) { return next(err); }
        res.status(201).json(bookingRequest);
    })
});

// Get all appointements
router.get("/", async(req, res) => {
    BookingRequest.find().exec(function(err, results) {
        if (err) { return next(err); }
        if (!results) { return res.status(404).json({ 'message': 'No booking requests found!' }); }
        res.status(200).json(results);
    })
});

// Delete a specific booking
router.delete("/:id", async(req, res) => {
    const id = req.params.id;

    BookingRequest.findOneAndDelete({ _id: id }, function(err, bookingRequest) {
        if (err) {
            return next(err);
        }
        if (bookingRequest === null) {
            return res.status(404).json({ "message": "Booking request doesn't exist" });
        }
        res.status().json({'message': 'Booking request deleted successfully!'})
    });
});

module.exports = router;