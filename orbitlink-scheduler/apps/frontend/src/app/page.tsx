"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Booking } from "../types/booking";
import { BookingForm } from "../components/BookingForm";
import BookingList from "../components/BookingList";
import { ThemeProvider } from "../context/ThemeContext";
import { api } from "../config/api";

export default function Home() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [apiError, setApiError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const data = await api.bookings.list();
      setBookings(data);
      setApiError(undefined);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      if (axios.isAxiosError(err) && err.message === "Network Error") {
        setApiError(
          "Cannot connect to server. Please check if the server is running on port 5000"
        );
      } else {
        setApiError("Failed to load bookings");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-8 transition-colors">
        {apiError && (
          <div className="max-w-7xl mx-auto mb-8">
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-500 text-red-700 dark:text-red-200 px-4 py-3 rounded">
              {apiError}
            </div>
          </div>
        )}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="w-full">
            <BookingForm onBookingAdded={fetchBookings} />
          </div>
          <div className="w-full">
            <BookingList
              bookings={bookings}
              onBookingCancelled={fetchBookings}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
