import { useState } from "react";
import { Booking } from "../types/booking";
import { ROOMS } from "../types/booking";
import axios from "axios";
import { api } from "../config/api";

interface BookingListProps {
  bookings: Booking[];
  onBookingCancelled: () => void;
}

interface ConfirmDialogProps {
  isOpen: boolean;
  booking: Booking | null;
  onConfirm: () => void;
  onCancel: () => void;
  error?: string;
}

function ConfirmDialog({
  isOpen,
  booking,
  onConfirm,
  onCancel,
  error,
}: ConfirmDialogProps) {
  if (!isOpen || !booking) return null;

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onConfirm();
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className="relative bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Cancel Booking
            </h3>
            <p className="text-gray-600 dark:text-slate-300 mb-4">
              Are you sure you want to cancel the booking for &ldquo;
              {booking.title}&rdquo;?
            </p>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add Skeleton Loading Component
function BookingSkeleton() {
  return (
    <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-lg transition-colors animate-pulse">
      <div className="flex justify-between items-start">
        <div className="h-6 w-1/3 bg-gray-200 dark:bg-slate-700 rounded mb-3"></div>
        <div className="h-4 w-16 bg-gray-200 dark:bg-slate-700 rounded"></div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 bg-gray-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 w-1/4 bg-gray-200 dark:bg-slate-700 rounded"></div>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 bg-gray-200 dark:bg-slate-700 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 w-48 bg-gray-200 dark:bg-slate-700 rounded"></div>
            <div className="h-4 w-48 bg-gray-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 bg-gray-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default function BookingList({
  bookings,
  onBookingCancelled,
  isLoading = false,
}: BookingListProps & { isLoading?: boolean }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string>();

  const getRoomName = (roomId: string) => {
    const room = ROOMS.find((r) => r.id === roomId);
    return room ? room.name : "Unknown Room";
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const handleCancelClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
    setError(undefined);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;

    try {
      await api.bookings.delete(selectedBooking.id);

      setDialogOpen(false);
      setSelectedBooking(null);
      onBookingCancelled();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError("Booking not found - it may have been already deleted");
        } else if (err.response?.status === 400) {
          setError(err.response?.data?.error || "Cannot cancel this booking");
        } else {
          setError("Failed to cancel booking. Please try again.");
        }
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedBooking(null);
    setError(undefined);
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Current Bookings
        </h2>
        <div className="space-y-4">
          <BookingSkeleton />
          <BookingSkeleton />
          <BookingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Current Bookings
      </h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-lg transition-colors"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {booking.title}
              </h3>
              <button
                onClick={() => handleCancelClick(booking)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600 dark:text-slate-300">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                {getRoomName(booking.roomId)}
              </div>
              <div className="flex items-center text-gray-600 dark:text-slate-300">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <div>From: {formatDateTime(booking.startTime)}</div>
                  <div>To: {formatDateTime(booking.endTime)}</div>
                </div>
              </div>
              <div className="flex items-center text-gray-600 dark:text-slate-300">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                {booking.attendees?.join(", ") || "No attendees"}
              </div>
            </div>
          </div>
        ))}
        {bookings.length === 0 && (
          <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-xl p-12 shadow-lg transition-colors">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 dark:text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                No bookings available
              </h3>
              <p className="mt-2 text-gray-500 dark:text-slate-400">
                Get started by booking a conference room for your next meeting.
              </p>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={dialogOpen}
        booking={selectedBooking}
        onConfirm={handleConfirmCancel}
        onCancel={handleCloseDialog}
        error={error}
      />
    </div>
  );
}
