var BookingRequest = require("../models/bookingRequest.js");

/*
Create a new booking from the incomming mqtt message.
mosquitto_pub -t 'request/availability/good' -m '{"email": "JO22msg@gmail.com","name": "Carl","clinicId": 1,"issuance": "1602406766314","date": "2020-12-14", "start": "0900", "end": "1000"}'
*/
const createBooking = async (reservation) => {
  try {
    const { email, name, clinicId, issuance, date, state, start, end } =
      reservation;
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
    });

    //console.log('bookingrequest: ' + reservation)
    reservation.save((err, res) => {
      if (err) return console.log(err);
      else return JSON.stringify(reservation);
      // console.log(JSON.stringify(reservation))
    });
  } catch (error) {
    console.log(error);
  }
};
/* 
Function changes the state field to 'approved', it finds it by id.
mosquitto_pub -t 'request/booking/approve' -m '{"_id": "637f992b4793782041e5648f"}'
*/
const approveBooking = async (request) => {
  try {
    const { _id } = request;
    const filter = { _id: _id };
    const update = { state: "approved" };

    const booking = await BookingRequest.findOneAndUpdate(filter, update);
    console.log(booking);

} catch (error) {
    console.log(error);
  }
};

/* 
Function changes the state field to 'denied', it finds it by id.
mosquitto_pub -t 'request/booking/denied' -m '{"_id": "637f992b4793782041e5648f"}'
*/

const denieBooking = async (request) => {
  try {
    const { _id } = request;
    const filter = { _id: _id };
    const update = { state: "denied" };

    const booking = await BookingRequest.findOneAndUpdate(filter, update);
    console.log(booking);

  } catch (error) {
    console.log(error);
  }
};

module.exports = createBooking;
module.exports = approveBooking;
module.exports = denieBooking;
