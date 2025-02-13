import { NextResponse } from "next/server";
import type { Booking } from "@/types/booking";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

async function fetchFromBackend(path: string, options?: RequestInit) {
  const response = await fetch(`${BACKEND_URL}/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Backend responded with status ${response.status}`);
  }

  return response;
}

export async function GET(request: Request) {
  try {
    const response = await fetchFromBackend("/bookings");
    const bookings = await response.json();
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const response = await fetchFromBackend("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const newBooking = await response.json();
    return NextResponse.json(newBooking);
  } catch (error) {
    console.error("Failed to create booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    const response = await fetchFromBackend(`/bookings/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to delete booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 400 }
    );
  }
}
