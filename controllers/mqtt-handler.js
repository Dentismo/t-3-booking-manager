const mqtt = require("mqtt");
const ClinicBookingController = require("./bookingController");

const clinic = new ClinicBookingController();
class MqttHandler {
  constructor() {
    this.mqttClient = null;
    this.host = "http://localhost:1883";
    this.username = "YOUR_USER"; // mqtt credentials if these are needed to connect
    this.password = "YOUR_PASSWORD";

    this.bookingRequestTopic = "request/createBooking";
    this.AlterApproveBooking = "request/booking/approve";
    this.AlterBookingDenied = "request/booking/denied";
    this.reqestBookingRequestsTopic = "clinicPortal/bookingRequests/request";
  }

  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    try {
      this.mqttClient = mqtt.connect(this.host, {
        username: this.username,
        password: this.password,
      });
    } catch (error) {
      console.log(error);
    }

    const localMqttClient = this.mqttClient;

    // Mqtt error calback
    this.mqttClient.on("error", (err) => {
      console.log(err);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on("connect", () => {
      console.log('--- Subscribed topics ---');
      console.log(`Mqtt Client connected, Subscribed to '${this.bookingRequestTopic}'\n`);
      console.log(`mqtt client connected, Subscribed to '${this.AlterApproveBooking}'\n`);
      console.log(`mqtt client connected, Subscribed to '${this.AlterBookingDenied}'\n`);
      console.log(`mqtt client connected, Subscribed to '${this.reqestBookingRequestsTopic}'\n`);

      this.mqttClient.subscribe(this.bookingRequestTopic, { qos: 1 });
      this.mqttClient.subscribe(this.AlterApproveBooking, { qos: 1 });
      this.mqttClient.subscribe(this.AlterBookingDenied, { qos: 1 });
      this.mqttClient.subscribe(this.reqestBookingRequestsTopic, { qos: 1 });
    });

    // When a message arrives, console.log it
    this.mqttClient.on("message", async function (topic, message) {
      switch (topic) {
        // On incoming message create booking and send a response to client via MQTT. 
        case "request/createBooking":
          const confirmation = await clinic.createBooking(
            JSON.parse(message.toString())
          );
          localMqttClient.publish(
            "response/availablity",
            JSON.stringify(confirmation)
          );
          console.log(JSON.parse(message.toString()));
          console.log("Sent to Client: " + confirmation);
          break;
        // Patch booking state to "approved" and send response to client via MQTT
        case "request/booking/approve":
          const response = await clinic.approveBooking(
            JSON.parse(message.toString())
          );
          localMqttClient.publish(
            "response/booking/approve",
            JSON.stringify(response)
          );
          console.log(response);
          break;
        // Patch booking state to "denied" and send response to client via MQTT
        case "request/booking/denied":
          const bookingResponse = await clinic.denieBooking(
            JSON.parse(message.toString())
          );
          localMqttClient.publish(
            "response/booking/denied",
            JSON.stringify(bookingResponse)
          );
          console.log(bookingResponse);
          break;
        // Get bookings and send list to client via MQTT
        case "clinicPortal/bookingRequests/request":
          const responseBookings = await clinic.getBookings(message.toString());
          localMqttClient.publish(
            "clinicPortal/bookingRequests/response",
            JSON.stringify(responseBookings)
          );
          console.log(responseBookings);
          break;

        case "request/delete":
          const deletionResponse = await clinic.deleteBooking(JSON.parse(message.toString()))
          localMqttClient.publish(
            "response/delete/" + id,
            JSON.stringify(deletionResponse)
          );
          console.log(deletionResponse);
          break;
      }
    });
  }
}

module.exports = MqttHandler;
