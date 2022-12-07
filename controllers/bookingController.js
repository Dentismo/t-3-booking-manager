const { default: mongoose } = require("mongoose");
const { parse } = require("path");
const BookingRequest = require("../models/bookingRequest.js");

// Create a new booking from the incomming mqtt message.
class ClinicBookingController {
  createBooking = async (bookingRequest) => {
    try {
      const {
        user: { email, name },
        clinicId,
        issuance,
        date,
        state,
        start,
        end,
        details,
      } = bookingRequest.booking;
      const newBooking = new BookingRequest({
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
        details: details,
      });

      newBooking.save((err) => {
        if (err) return console.log(err);
        else return newBooking;
      });
      return newBooking;
    } catch (error) {
      console.log(error);
    }
  };

  // Function changes the state field to 'approved', it finds it by id.

  approveBooking = async (request) => {
    try {
      const { _id } = request;

      BookingRequest.findById(_id, function (err, bookingRequest) {
        if (err) {
          return { message: "Error finding booking request" };
        }
        if (!bookingRequest) {
          return { message: "Booking request was not found" };
        }
        bookingRequest.state = "approved";
        bookingRequest.save();
      });
      return { message: "Booking request has been approved" };
    } catch (error) {
      console.log(error);
    }
  };

  // Function changes the state field to 'denied', it finds it by id.
  denyBooking = async (request) => {
    try {
      const { _id } = request;

      BookingRequest.findById(_id, function (err, bookingRequest) {
        if (err) {
          return { message: "Error finding booking request" };
        }
        if (!bookingRequest) {
          return { message: "Booking request was not found" };
        }
        bookingRequest.state = "denied";
        bookingRequest.save();
      });
      return { message: "Booking request has been denied" };
    } catch (error) {
      console.log(error);
    }
  };

  // Returns the list of bookings for the specific clinic
  async getBookings(clinic_id) {
    try {
      //   if (!mongoose.Types.ObjectId.isValid(clinic_id) || clinic_id === null)
      //     return { message: "ID is not valid for given request" };

      const dentistsBookings = await BookingRequest.find({
        clinicId: clinic_id,
      });

      //   if (!dentistsBookings) return { message: "Bookings could not be found" };

      //   return dentistsBookings.toString();
      return dentistsBookings;
    } catch (error) {
      console.log(error);
      return { message: "Bookings could not be found" };
    }
  }
  // mosquitto_pub -t 'request/create-booking' -m '{"email": "carl11@gmail.com","name": "Carl","clinicId": "1","issuance": "1602406766314", "date": "2020-12-14", "start": "09:00", "end": "10:00", "details": "Ajaj"}'
  //delete booking with id in request body
  deleteBooking = async (request) => {
    try {
      const { _id } = request;

      const result = await BookingRequest.deleteOne({ _id: _id });

      if (!result) return { message: `Cannot delete booking with id ${_id}` };

      return { message: `Booking with id ${_id} deleted` };
    } catch (err) {
      console.log(err);
    }
  };
}
module.exports = ClinicBookingController;
