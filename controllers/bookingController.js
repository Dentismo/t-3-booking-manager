const { default: mongoose } = require("mongoose");
const { parse } = require("path");
var BookingRequest = require("../models/bookingRequest.js");

// Create a new booking from the incomming mqtt message.
class ClinicBookingController {
  createBooking = async (booking) => {
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
      } = booking;
      booking = new BookingRequest({
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

      booking.save((err) => {
        if (err) return console.log(err);
        else return booking;
      });
      return booking;
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
          return { message: 'Error finding booking request'};
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
          return { message: 'Error finding booking request'};
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

  deleteBooking = async (request) => {
    try {
      const { _id } = request

      const result = await BookingRequest.deleteOne({_id: _id})

      if(!result) return {message: `Cannot delete booking with id ${_id}`}

      return {message: `Booking with id ${_id} deleted`}
    } catch(err) { console.log(err) }
  }

  // Returns the list of bookings for the specific clinic
  async getBookings(clinic_id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(clinic_id) || clinic_id === null)
        return {message: "ID is not valid for given request"};

      const dentistsBookings = await Booking.find({ clinicId: clinic_id });

      if (!dentistsBookings) return {message: "Bookings could not be found"};

      return dentistsBookings.toString();
    } catch (error) {
      console.log(error);
      return {message: "Bookings could not be found"};
    }
  }
}
module.exports = ClinicBookingController;
