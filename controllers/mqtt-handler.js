const mqtt = require('mqtt');
const createBooking = require('./bookingController');

class MqttHandler {
constructor() {
    this.mqttClient = null;
    this.host = 'http://localhost:1883';
    this.username = 'YOUR_USER'; // mqtt credentials if these are needed to connect
    this.password = 'YOUR_PASSWORD';
    this.bookingRequestTopic = 'request/availability/good';
    this.publishTopic = 'response/available/good';
}

connect() {
  // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
  try {
    this.mqttClient = mqtt.connect(this.host, { username: this.username, password: this.password });
  } catch (error) {
    console.log(error);
  }

  const localMqttClient = this.mqttClient;

  console.log('We are subscribed to incoming messages from: ' + this.bookingRequestTopic)
  console.log('We are publishing to messages from this topic:' + this.publishTopic)


  // Mqtt error calback
  this.mqttClient.on('error', (err) => {
    console.log(err);
    this.mqttClient.end();
  });

  // Connection callback
  this.mqttClient.on('connect', () => {
    console.log(`Mqtt Client connected, Subscribed to '${this.bookingRequestTopic}'`);
  });

  // Subscribe the 'request/login' to receive login requests from dentists
  this.mqttClient.subscribe(this.bookingRequestTopic, {qos: 1});

  // When a message arrives, console.log it
    this.mqttClient.on('message', async function (topic, message) {
      var message = JSON.parse(message.toString())
    const response = await createBooking(message)
    //localMqttClient.publish(this.publishTopic, response)
      console.log(response)
    });

  }

  // Sends a mqtt message to topic: mytopic
  sendMessage(message) {
    this.mqttClient.publish(this.publishTopic, message);
  }
}


module.exports = MqttHandler;