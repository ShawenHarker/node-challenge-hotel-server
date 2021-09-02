const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DATA,
  port: process.env.PORTHOST,
  password: process.env.PASSWORD,
});

//Use this array as your (in-memory) data store.
app.get("/hotels", (req, res) => {
  pool.query("SELECT * FROM hotels ORDER BY name", (error, result) => {
    console.log(error);
    res.json(result.rows);
  });
});

app.get("/customers", (req, res) => {
  pool.query("SELECT * FROM customers ORDER BY name", (error, result) => {
    console.log(error);
    res.json(result.rows);
  });
});

app.get("/hotels/:hotelId", function (req, res) {
  const hotelId = req.params.hotelId;

  pool
    .query("SELECT * FROM hotels WHERE id=$1", [hotelId])
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

app.get("/customers/:customerId", (req, res) => {
  const customerId = req.params.customerId;
console.log(customerId);
  pool
    .query("SELECT * FROM customers WHERE id=$1", [customerId])
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

app.get("/hotels/name", function (req, res) {
  const hotelNameQuery = req.query.name;
  let query = `SELECT * FROM hotels ORDER BY name`;

  if (hotelNameQuery) {
    query = `SELECT * FROM hotels WHERE name LIKE '%${hotelNameQuery}%' ORDER BY name`;
  }

  pool
    .query(query)
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

app.post("/hotels", (req, res) => {
  console.log(req.body);
  const newHotelName = req.body.name;
  const newHotelRooms = req.body.rooms;
  const newHotelPostcode = req.body.postcode;

  if (!Number.isInteger(newHotelRooms) || newHotelRooms <= 0) {
    return res
      .status(400)
      .send("The number of rooms should be a positive integer.");
  }

  pool
    .query("SELECT * FROM hotels WHERE name=$1", [newHotelName])
    .then((result) => {
      if (result.rows.length > 0) {
        return res
          .status(400)
          .send("An hotel with the same name already exists!");
      } else {
        const query =
          "INSERT INTO hotels (name, rooms, postcode) VALUES ($1, $2, $3)";
        pool
          .query(query, [newHotelName, newHotelRooms, newHotelPostcode])
          .then(() => res.send("Hotel created!"))
          .catch((e) => console.error(e));
      }
    });
});

// app.post("/customers", (req, res) => {
// });
// const 

// app.get("/bookings/:id", (req, res) => {
//   const found = bookings.some(
//     (booking) => booking.id === parseInt(req.params.id)
//   );

//   found
//     ? res.json(
//         bookings.filter((booking) => booking.id === parseInt(req.params.id))
//       )
//     : res.status(404).json({ mgs: `No id of ${req.params.id} is found` });
// });

// app.post("/bookings", (req, res) => {
//   const newBooking = {
//     id: bookings.length + 1,
//     title: req.body.title,
//     firstName: req.body.firstName,
//     surname: req.body.surname,
//     email: req.body.email,
//     roomId: bookings.length + 10,
//     checkInDate: req.body.checkInDate,
//     checkOutDate: req.body.checkOutDate,
//   };

//   !newBooking.title ||
//   !newBooking.firstName ||
//   !newBooking.surname ||
//   !newBooking.email ||
//   !newBooking.checkInDate ||
//   !newBooking.checkOutDate
//     ? res
//         .status(400)
//         .json({ mgs: `Please fill in all required details for a booking.` })
//     : bookings.push(newBooking);
//   res.json(bookings);
// });

// app.delete("/bookings/delete/:id?", (req, res) => {
//   const found = bookings.some(
//     (booking) => booking.id === parseInt(req.params.id)
//   );

//   found
//     ? res.json({
//         msg: `ID of ${req.params.id} has been deleted.`,
//         bookings: bookings.filter(
//           (booking) => booking.id !== parseInt(req.params.id)
//         ),
//       })
//     : res.status(404).json({ mgs: `No id of ${req.params.id} was found.` });
// });

// TODO add your routes and helper functions here
const PORT = process.env.PORT || 3001;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
