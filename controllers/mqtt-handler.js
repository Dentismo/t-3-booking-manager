const mqtt = require("mqtt");
const ClinicBookingController = require("./bookingController");

const clinic = new ClinicBookingController();
class MqttHandler {
  constructor() {
    this.mqttClient = null;
    this.host = "http://localhost:1883";
    this.username = "YOUR_USER"; // mqtt credentials if these are needed to connect
    this.password = "YOUR_PASSWORD";

    this.bookingRequestTopic = "request/create-booking/#";
    this.alterApproveBooking = "request/approve/#";
    this.alterDenyBooking = "request/denied/#";
    this.reqestBookingRequestsTopic = "request/booking-requests/#";
  }
  /*
mosquitto_sub -v -t 'response/booking/confirmed'
*/
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
      console.log("--- Subscribed topics ---");
      console.log(
        `Mqtt Client connected, Subscribed to '${this.bookingRequestTopic}'\n`
      );
      console.log(
        `Mqtt client connected, Subscribed to '${this.alterApproveBooking}'\n`
      );
      console.log(
        `Mqtt client connected, Subscribed to '${this.alterDenyBooking}'\n`
      );
      console.log(
        `Mqtt client connected, Subscribed to '${this.reqestBookingRequestsTopic}'\n`
      );

      this.mqttClient.subscribe(this.bookingRequestTopic, { qos: 1 });
      this.mqttClient.subscribe(this.alterApproveBooking, { qos: 1 });
      this.mqttClient.subscribe(this.alterDenyBooking, { qos: 1 });
      this.mqttClient.subscribe(this.reqestBookingRequestsTopic, { qos: 1 });
    });

    // When a message arrives, console.log it
    this.mqttClient.on("message", async function (topic, message) {
      console.log(topic, message.toString());
      //-------------------------------------------------------------------\\
      let incomingTopic = topic.split("/"); // array of topic fields
      const id = incomingTopic[2]; //   [request, creatBooking, id]
      incomingTopic.splice(2, 1); // removes id = [request, createBooking]
      const finalTopic = incomingTopic.join("/"); // finalTopic = request/creatBooking
      //--------------------------------------------------------------------\\

      switch (finalTopic) {
        // On incoming message create booking and send a response to client via MQTT.
        case "request/create-booking":
          console.log(" SFDSSSSSSSSSSSSSSSSSS");
          const confirmation = await clinic.createBooking(
            JSON.parse(message.toString())
          );
          localMqttClient.publish(
            "response/availability/" + id,
            JSON.stringify(confirmation)
          );
          break;
        // Patch booking state to "approved" and send response to client via MQTT
        case "request/approve":
          const response = await clinic.approveBooking(
            JSON.parse(message.toString())
          );
          localMqttClient.publish(
            "response/approve/" + id,
            JSON.stringify(response)
          );
          console.log(response);
          break;
        // Patch booking state to "denied" and send response to client via MQTT
        case "request/denied":
          const bookingResponse = await clinic.denyBooking(
            JSON.parse(message.toString())
          );
          localMqttClient.publish(
            "response/denied/" + id,
            JSON.stringify(bookingResponse)
          );
          break;
        // Get bookings and send list to client via MQTT
        case "request/booking-requests":
          const responseBookings = await clinic.getBookings(message.toString());
          localMqttClient.publish(
            "response/booking-requests/" + id,
            JSON.stringify(responseBookings)
          );
          break;

        case "request/delete":
          const deletionResponse = await clinic.deleteBooking(
            JSON.parse(message.toString())
          );
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

// mosquitto_pub -t 'request/booking-requests' -m '"1"'

module.exports = MqttHandler;
