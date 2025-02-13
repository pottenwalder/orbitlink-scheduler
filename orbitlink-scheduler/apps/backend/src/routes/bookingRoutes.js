const express = require("express");
const router = express.Router();
const bookingService = require("../services/bookingService");

const bookings = [];

router.get("/", async (req, res, next) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, startTime, endTime, roomId, attendees = [] } = req.body;

    // ... validation code ...

    const newBooking = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      startTime,
      endTime,
      roomId,
      attendees: Array.isArray(attendees) ? attendees : [],
    };

    bookings.push(newBooking);
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: "Failed to create booking" });
  }
});

module.exports = router;
