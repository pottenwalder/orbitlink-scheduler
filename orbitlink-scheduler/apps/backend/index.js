const express = require("express");
const cors = require("cors");
const config = require("./src/config/config");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize bookings storage
const bookings = new Map();

// Middleware
app.use(cors());
app.use(express.json());

// Helper Functions
function generateBookingId() {
  return Math.random().toString(36).substring(2, 11);
}

function validateBookingTime(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();

  if (isNaN(start.getTime())) {
    return { isValid: false, error: "Invalid start time format" };
  }

  if (isNaN(end.getTime())) {
    return { isValid: false, error: "Invalid end time format" };
  }

  if (start >= end) {
    return { isValid: false, error: "Start time must be before end time" };
  }

  if (start < now) {
    return { isValid: false, error: "Start time cannot be in the past" };
  }

  return { isValid: true };
}

function checkRoomAvailability(
  roomId,
  startTime,
  endTime,
  excludeBookingId = null
) {
  const existingBookings = Array.from(bookings.values()).filter(
    (booking) =>
      booking.roomId === roomId &&
      (excludeBookingId === null || booking.id !== excludeBookingId) &&
      ((new Date(startTime) >= new Date(booking.startTime) &&
        new Date(startTime) < new Date(booking.endTime)) ||
        (new Date(endTime) > new Date(booking.startTime) &&
          new Date(endTime) <= new Date(booking.endTime)))
  );

  return existingBookings.length === 0;
}

// API Routes
app.post("/api/bookings", async (req, res) => {
  try {
    const { title, startTime, endTime, roomId, attendees = [] } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!startTime || !endTime) {
      return res
        .status(400)
        .json({ error: "Start time and end time are required" });
    }

    const timeValidation = validateBookingTime(startTime, endTime);
    if (!timeValidation.isValid) {
      return res.status(400).json({ error: timeValidation.error });
    }

    const validRooms = ["room-1", "room-2", "room-3"];
    if (!validRooms.includes(roomId)) {
      return res.status(400).json({ error: "Invalid room selected" });
    }

    if (!checkRoomAvailability(roomId, startTime, endTime)) {
      return res
        .status(400)
        .json({ error: "Room is already booked for this time slot" });
    }

    const newBooking = {
      id: generateBookingId(),
      title: title.trim(),
      startTime,
      endTime,
      roomId,
      attendees: Array.isArray(attendees)
        ? attendees.map((a) => a.trim()).filter(Boolean)
        : [],
    };

    bookings.set(newBooking.id, newBooking);
    return res.status(201).json(newBooking);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create booking",
      details: error.message,
    });
  }
});

app.get("/api/bookings", (req, res) => {
  const bookingsList = Array.from(bookings.values());
  res.json(bookingsList);
});

app.delete("/api/bookings/:id", (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Booking ID is required" });
    }

    const booking = bookings.get(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const bookingStart = new Date(booking.startTime);
    const now = new Date();
    const hoursDifference =
      (bookingStart.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDifference < 1) {
      return res.status(400).json({
        error:
          "Bookings can only be cancelled at least 1 hour before the start time",
      });
    }

    bookings.delete(id);
    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to cancel booking",
      details: error.message,
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  if (config.nodeEnv === "production") {
    process.exit(1);
  }
});
