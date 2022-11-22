var mongoose = require("mongoose")
var Schema = mongoose.Schema

var bookingRequestSchema = new Schema({
    user: {
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^\w+(\.-?\w+)*@\w+(\.-?\w+)*(\.\w{2,3})+$/
        },
        name: {
            type: String,
            required: true
        }
    },
    clinicId: {
        type: String,
        minLength: 1,
        required: true,
        match: [/^[0-9]*$/, 'Field may only contain numbers.']
    },
    issuance: {
        type: String,
        minLength: 1,
        maxLength: 13,
        required: true,
        match: [/^[0-9]*$/, 'Field may only contain numbers.']
    },
    date: {
        type: Date,
        required: true
    },
    state: {
        type: String,
        required: true,
        default: 'pending',
        enum: ['approved', 'pending', 'denied']
    }
});

module.exports = mongoose.model('BookingRequests', bookingRequestSchema)