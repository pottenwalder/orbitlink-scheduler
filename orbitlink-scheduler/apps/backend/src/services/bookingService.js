const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class BookingService {
  async getAllBookings() {
    return await prisma.booking.findMany({
      orderBy: {
        startTime: "asc",
      },
    });
  }

  async createBooking(bookingData) {
    const { name, startTime, endTime } = bookingData;

    // Validate time range
    if (new Date(startTime) >= new Date(endTime)) {
      throw {
        type: "ValidationError",
        message: "End time must be after start time",
      };
    }

    // Check for overlapping bookings
    const conflicts = await prisma.booking.findMany({
      where: {
        OR: [
          {
            startTime: { lt: new Date(endTime) },
            endTime: { gt: new Date(startTime) },
          },
        ],
      },
    });

    if (conflicts.length > 0) {
      throw {
        type: "ValidationError",
        message: "Booking time conflicts with an existing booking",
      };
    }

    return await prisma.booking.create({
      data: {
        name,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });
  }
}

module.exports = new BookingService();
