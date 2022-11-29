var BookingRequest = require("../models/bookingRequest.js");

/*
Create a new booking from the incomming mqtt message.
mosquitto_pub -t 'request/availability/good' -m '{"email": "Sa22m1B@gmail.com","name": "Carl Dahlqvist","clinicId": 1,"issuance": "1602406766314","date": "2020-12-14", "start": "0900", "end": "1000"}'
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

      reservation.save((err) => {
        if (err) return console.log(err);
        else
        return reservation
      });
      return '{message: ' + reservation ;
    } catch (error) {
      console.log(error);
    }
  };
  /*
Function changes the state field to 'approved', it finds it by id.
mosquitto_pub -t 'request/booking/approve' -m '{"_id": "638601e0ebc2434c8afb2f68"}'
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
      return '{message: "Booking request has been approved"}'

    } catch (error) {
      console.log(error);
    }
  };

  /* 
Function changes the state field to 'denied', it finds it by id.
mosquitto_pub -t 'request/booking/denied' -m '{"_id": "6386090bc204079856c8b479"}'
*/

  denieBooking = async (request) => {
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
      return '{message: "Booking request has been denied"}'

    } catch (error) {
      console.log(error);
    }
  };
}
module.exports = ClinicBookingController;
