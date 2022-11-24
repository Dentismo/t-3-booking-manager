var BookingRequest = require('../models/bookingRequest.js');


// mosquitto_pub -t 'request/availability/good' -m '{"email": "carl11@gmail.com","name": "Carl","clinicId": 1,"issuance": "1602406766314","date": "2020-12-14", "start": "0900", "end": "1000"}'

const createBooking = async (message) => {
    try{
        const {email, name, clinicId, issuance, date, state, start, end} = message;
        reservation = new BookingRequest({
            user: {
            email: email,
            name: name,
            },
            clinicId: clinicId,
            issuance: issuance,
            date: date,
            state: state,
            start: start,
            end: end,
        })

        //console.log('bookingrequest: ' + reservation)
        reservation.save((err, res) => {
            if (err) return console.log(err);
            else return console.log("Result: ", res)
        });
    } catch (error) {
        console.log(error);
    }
}



module.exports = createBooking;