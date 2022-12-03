# Booking Component for the Dentismo Web Application

## Description
This repository is required for creating, altering booking requests coming from the client. The component takes requests from the user via an MQTT protocol and either creates or alters existing booking requests in the database.

## Badges - TODO
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
### Sequence Diagram
This sequence diagram reflects the use case of a user trying to login to their account via the Login Page in the Client.
![sequencediagram.png](./sequenceDiagram.png)

## Installation
1. Clone Repository
2. Via the terminal navigate to the cloned repository
3. Run ```npm i``` to download all required packages for running the app
4. Run ```npm start``` to run the component
5. Try sending the example case messages below.

## Usage

#### **Case 1.**
When a incoming message with the topic `request/createBooking` is sent to this component from the availibilty component. On this topic the manager creates a booking of the payload and stores it in our database. Where it continues to publish a responde message which the client component intercepts.

**_Example MQTT message_**

```ruby
{
    "email": "Emailg@gmail.com",
    "name": "Björn","clinicId": 1,
    "issuance": "1602406766314",
    "date": "2020-12-14",
    "start": "0900",
    "end": "1000",
    "details": "My tooth hurts
    }
```

#### **Case 2.**
When a incoming message with the topic `request/booking/approve'` is sent to this component from the client. On this topic the booking component alters the `state` field of a pending booking request to `approved` in the database. The payload message is the _id of a booking request. Where it continues to publish a response message which the client intercepts.

**_Example MQTT message_**
```ruby
{
    "_id": "637f992b4793782041e5648f"
    }
```
#### **Case 3.**
When a incoming message with the topic `request/booking/denied` is sent to this component from the client. On this topic the manager alters the `state` field of a pending booking request to `denied` in the database. The payload message is the _id of a booking request.Where it continues to publish a response message which the client intercepts.

**_Example MQTT message_**

```ruby
{
    "_id": "637f992b4793782041e5648f"
    }
```

## Support
Developer of the component: [@carlthur](https://git.chalmers.se/carlthur) <br>

## Roadmap
None for the forseeable future

## Contributing
I am open to contributions, however, they must be requested via a merge request and a subsequent email explaining:
- What does this fix
- Why its beneficial for the component
- If the person is willing to continue to support this fix/features

## Authors and acknowledgment
Lead Developer for the Component: @carlthur

## License - TODO
For open source projects, say how it is licensed.

## Project status
Development has ceased until further notice or a bug fix has appeared
