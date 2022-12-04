const mqtt = require("mqtt");
const ClinicBookingController = require("./bookingController");


const clinic = new ClinicBookingController();
class MqttHandler {
  constructor() {
    this.mqttClient = null;
    this.host = "http://localhost:1883";
    this.username = "YOUR_USER"; // mqtt credentials if these are needed to connect
    this.password = "YOUR_PASSWORD";

    this.bookingRequestTopic = 'request/createBooking';
    // sub topics for altering fields
    this.AlterApproveBooking = "request/booking/approve";
    this.AlterBookingDenied = "request/booking/denied";
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
      console.log(
        `Mqtt Client connected, Subscribed to '${this.bookingRequestTopic}'`
      );
      this.mqttClient.subscribe(this.bookingRequestTopic, { qos: 1 });
      this.mqttClient.subscribe(this.AlterApproveBooking, { qos: 1 });
      this.mqttClient.subscribe(this.AlterBookingDenied, { qos: 1 });
    });

    // When a message arrives, console.log it
    this.mqttClient.on('message', async function (topic, message) {
      switch (topic) {
        case 'request/createBooking':
          const confirmation = await clinic.createBooking(
            JSON.parse(message.toString())
          );
          localMqttClient.publish('response/avalibility', JSON.stringify(confirmation));
          console.log(JSON.parse(message.toString()));
          console.log("Sent to Client: " + confirmation);
          break;

        case "request/booking/approve":
          const response = await clinic.approveBooking(
            JSON.parse(message.toString())
          );
          localMqttClient.publish('response/booking/approve', JSON.stringify(response));
          console.log(response);
          break;

        case "request/booking/denied":
          const bookingResponse = await clinic.denieBooking(
            JSON.parse(message.toString())
          );
          localMqttClient.publish('response/booking/denied', JSON.stringify(bookingResponse));
          console.log(bookingResponse);
          break;
      }
    });
  }

}


module.exports = MqttHandler;
