export interface Room {
  id: string;
  name: string;
  capacity: number;
}

export interface Booking {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  roomId: string;
  attendees: string[];
}

export interface ApiError {
  error: string;
  message?: string;
}

export interface ApiSuccess {
  success: boolean;
  message: string;
}

// Add some sample rooms
export const ROOMS: Room[] = [
  { id: "room-1", name: "Conference Room A", capacity: 10 },
  { id: "room-2", name: "Meeting Room B", capacity: 6 },
  { id: "room-3", name: "Board Room", capacity: 15 },
];
