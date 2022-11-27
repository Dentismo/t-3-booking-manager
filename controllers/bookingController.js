var BookingRequest = require("../models/bookingRequest.js");

/*
Create a new booking from the incomming mqtt message.
mosquitto_pub -t 'request/availability/good' -m '{"email": "AM2Z@gmail.com","name": "Carl","clinicId": 1,"issuance": "1602406766314","date": "2020-12-14", "start": "0900", "end": "1000"}'
*/
class ClinicBookingController {
  createBooking = async (reservation) => {
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
      reservation.save((err) => {
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
mosquitto_pub -t 'request/booking/approve' -m '{"_id": "6383cc2c39a711d9cf6772bb"}'
*/
  approveBooking = async (request) => {
    try {
      const { _id } = request;

      BookingRequest.findById(_id, function (err, bookingRequest) {
        if (err) {
          return next(err);
        }
        if (!bookingRequest) {
          return (res = { message: "Booking request was not found" });
        }
        bookingRequest.state = "approved";
        bookingRequest.save();
      });
    } catch (error) {
      console.log(error);
    }
  };

  /* 
Function changes the state field to 'denied', it finds it by id.
mosquitto_pub -t 'request/booking/denied' -m '{"_id": "6383cb76f1578e5e752b1444"}'
*/

  denieBooking = async (request, res) => {
    try {
      const { _id } = request;

      BookingRequest.findById(_id, function (err, bookingRequest) {
        if (err) {
          return next(err);
        }
        if (!bookingRequest) {
          return (res = { message: "Booking request was not found" });
        }
        bookingRequest.state = "denied";
        bookingRequest.save();
      });
    } catch (error) {
      console.log(error);
    }
  };
}
module.exports = ClinicBookingController;
