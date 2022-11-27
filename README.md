## Booking Manager

## **#Start**
1. `npm install`
2. `npm start`

### **General**

Port: 3001
MQTT Client port: 1883

### **Technologies**
- Express
- Mongoose
- Mqtt
- Node js
## **Purpose **
The booking manager main purpose is to handel booking relevent behaviour. There are three cases where the behaviour of the booking manager is inisiated.

## **Case 1.**
When a incoming message with the topic `request/availability/good` is sent to the component. On this topic the manager creates a booking of the payload and stores it in our database.
_Exemple mqtt message_
`mosquitto_pub -t 'request/availability/good' -m '{"email": "Emailg@gmail.com","name": "Björn","clinicId": 1,"issuance": "1602406766314","date": "2020-12-14", "start": "0900", "end": "1000"}'`

## **Case 2.**
When a incoming message with the topic `request/booking/approve'` is sent to the component. On this topic the manager alters the `state` field of a pending booking request to `approved`. The payload message is the _id of a booking request.
_Exemple mqtt message_
`mosquitto_pub -t 'request/booking/approve' -m '{"_id": "637f992b4793782041e5648f"}'`

## **Case 3.**
When a incoming message with the topic `request/booking/denied` is sent to the component. On this topic the manager alters the `state` field of a pending booking request to `denied`. The payload message is the _id of a booking request.
_Exemple mqtt message_
`mosquitto_pub -t 'request/booking/denied' -m '{"_id": "637f992b4793782041e5648f"}'`

[Diagram](Images/diagram.png)
