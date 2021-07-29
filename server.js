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
  const found = bookings.some(
    (booking) => booking.id === parseInt(req.params.id)
  );

  if (found) {
    res.json(
      bookings.filter((booking) => booking.id === parseInt(req.params.id))
    );
  } else {
    res.status(404).json({ mgs: `No id of ${req.params.id} is found` });
  }
})

app.post("/bookings", (req, res) => {
  const newBooking = {
    id: bookings.length + 1,
    roomId: bookings.length + 10,
    title: req.body.title,
  };
});

// TODO add your routes and helper functions here
const PORT = process.env.PORT || 3001;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
