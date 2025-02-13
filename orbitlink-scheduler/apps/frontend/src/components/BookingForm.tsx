"use client";

import { useState } from "react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { ROOMS } from "../types/booking";
import { api } from "../config/api";
import { FormField } from "./FormField";

interface BookingFormProps {
  onBookingAdded: () => void;
}

interface FormData {
  title: string;
  startTime: string;
  endTime: string;
  roomId: string;
  attendees: string[];
  attendeesInput: string;
}

export function BookingForm({ onBookingAdded }: BookingFormProps) {
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    startTime: "",
    endTime: "",
    roomId: ROOMS[0].id,
    attendees: [],
    attendeesInput: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "attendees") {
      setFormData((prev) => ({
        ...prev,
        attendeesInput: value,
        attendees: value
          .split(",")
          .map((name) => name.trim())
          .filter(Boolean),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.bookings.create(formData);
      setFormData({
        title: "",
        startTime: "",
        endTime: "",
        roomId: ROOMS[0].id,
        attendees: [],
        attendeesInput: "",
      });
      onBookingAdded();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Failed to create booking");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const inputClassName = `w-full rounded-lg p-3 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    theme === "light"
      ? "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
      : "bg-slate-800/50 border-slate-700/50 text-gray-200 placeholder-gray-400"
  }`;

  return (
    <div
      className={`backdrop-blur-sm shadow-xl rounded-xl p-8 w-full border transition-colors ${
        theme === "light"
          ? "bg-gray-100/50 border-gray-200"
          : "bg-slate-900/50 border-slate-800"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2
          className={`text-2xl font-bold ${
            theme === "light" ? "text-gray-900" : "text-white"
          }`}
        >
          Conference Room Scheduler
        </h2>
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-colors ${
            theme === "light"
              ? "bg-gray-200 hover:bg-gray-300"
              : "bg-slate-800 hover:bg-slate-700"
          }`}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField label="Meeting Title" id="title" error={error}>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter meeting title"
            className={inputClassName}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Start Time" id="startTime" error={error}>
            <input
              type="datetime-local"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              className={inputClassName}
            />
          </FormField>

          <FormField label="End Time" id="endTime" error={error}>
            <input
              type="datetime-local"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              className={inputClassName}
            />
          </FormField>
        </div>

        <FormField label="Room" id="roomId" error={error}>
          <select
            id="roomId"
            name="roomId"
            value={formData.roomId}
            onChange={handleInputChange}
            className={inputClassName}
          >
            {ROOMS.map((room) => (
              <option
                key={room.id}
                value={room.id}
                className={
                  theme === "light"
                    ? "bg-white text-gray-900"
                    : "bg-slate-800 text-gray-200"
                }
              >
                {room.name} (Capacity: {room.capacity})
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Attendees" id="attendees" error={error}>
          <input
            type="text"
            id="attendees"
            name="attendees"
            value={formData.attendeesInput}
            onChange={handleInputChange}
            placeholder="Enter names separated by commas"
            className={inputClassName}
          />
        </FormField>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Book Room
        </button>
      </form>
    </div>
  );
}
