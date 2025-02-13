import axios from "axios";
import { Booking } from "../types/booking";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

interface CreateBookingData {
  title: string;
  startTime: string;
  endTime: string;
  roomId: string;
  attendees: string[];
}

export const api = {
  baseURL: API_URL,
  bookings: {
    list: async (): Promise<Booking[]> => {
      try {
        const response = await axiosInstance.get("/bookings");
        if (!Array.isArray(response.data)) {
          console.error(
            "API Error: Expected array of bookings but got:",
            response.data
          );
          return [];
        }
        return response.data;
      } catch (error) {
        console.error("API Error:", error);
        return [];
      }
    },
    create: async (data: CreateBookingData): Promise<Booking> => {
      try {
        const response = await axiosInstance.post("/bookings", data);
        return response.data;
      } catch (error) {
        console.error("API Error:", error);
        throw error;
      }
    },
    delete: async (
      id: string
    ): Promise<{ success: boolean; message: string }> => {
      try {
        const response = await axiosInstance.delete(`/bookings/${id}`);
        return response.data;
      } catch (error) {
        console.error("API Error:", error);
        throw error;
      }
    },
  },
};
