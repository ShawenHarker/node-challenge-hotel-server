const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", (req, res) => res.send("Hotel booking server.  Ask for /bookings, etc."));

app.get("/bookings", (req, res) => res.json(bookings));

app.get("/bookings/:id", (req, res) => {
  const found = bookings.some(booking => booking.id === parseInt(req.params.id));

  found ? res.json(bookings.filter(booking => booking.id === parseInt(req.params.id))) : 
  res.status(404).json({ mgs: `No id of ${req.params.id} is found` });
});

app.post("/bookings", (req, res) => {
  const newBooking = {
    id: bookings.length + 1,
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: bookings.length + 10,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate
  };

  !newBooking.title ||
  !newBooking.firstName ||
  !newBooking.surname || 
  !newBooking.email ||
  !newBooking.checkInDate ||
  !newBooking.checkOutDate ?
  res.status(400).json({ mgs: `Please fill in all required details for a booking.`}) : 
  bookings.push(newBooking);
  res.json(bookings);
});

app.delete("/bookings/delete/:id?", (req, res) => {
  const found = bookings.some(booking => booking.id === parseInt(req.params.id));

  found
    ? res.json({ msg: `ID of ${req.params.id} has been deleted.`,
      bookings: bookings.filter(booking => booking.id !== parseInt(req.params.id)) })
    : res.status(404).json({ mgs: `No id of ${req.params.id} was found.` });
});

// TODO add your routes and helper functions here
const PORT = process.env.PORT || 3001;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});