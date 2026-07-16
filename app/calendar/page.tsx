"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "../components/layout/AppLayout";
import { supabase } from "../../lib/supabase";

interface Room {
  Room_Number: string;
  Room_Type: string;
  Block: string;
  Floor: number;
}

interface Booking {
  ID: number;
  "Name of Guest": string;
  "Room No": string;
  Check_in: string;
  Check_out: string;
  Status: string;
}

interface CalendarCell {
  room: Room;
  date: Date;
  booking?: Booking;
  state: "available" | "checkin" | "occupied" | "checkout";
}

export default function CalendarPage() {

  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [startDate, setStartDate] = useState(() => {

    const d = new Date();
    d.setHours(0,0,0,0);

    return d;

  });

  useEffect(() => {

    loadData();

  }, []);

  async function loadData() {

    const { data: roomData } = await supabase
      .from("rooms")
      .select("*")
      .order("Room_Number");

    const { data: bookingData } = await supabase
      .from("bookings")
      .select("*");

    setRooms(roomData || []);
    setBookings(bookingData || []);

  }

  const days = useMemo(() => {

    return Array.from({ length: 30 }, (_, index) => {

      const d = new Date(startDate);

      d.setDate(startDate.getDate() + index);

      return d;

    });

  }, [startDate]);

  function formatDate(date: Date) {

    return date.toISOString().split("T")[0];

  }

  function previous30Days() {

    const d = new Date(startDate);

    d.setDate(d.getDate() - 30);

    setStartDate(d);

  }

  function next30Days() {

    const d = new Date(startDate);

    d.setDate(d.getDate() + 30);

    setStartDate(d);

  }

  function today() {

    const d = new Date();

    d.setHours(0,0,0,0);

    setStartDate(d);

  }

  function getBookingForDate(
    roomNo: string,
    date: Date
  ): Booking | undefined {

    const current = formatDate(date);

    return bookings.find((booking) => {

      if (
          booking.Status !== "Booked" &&
          booking.Status !== "Occupied" &&
          booking.Status !== "Checked Out"
    )
  return false;

      if (String(booking["Room No"]) !== String(roomNo))
        return false;

      return (
        current >= booking.Check_in &&
        current <= booking.Check_out
      );

    });

  }

  function getCellState(
    booking: Booking | undefined,
    date: Date
  ): CalendarCell["state"] {

    if (!booking)
      return "available";

    const current = formatDate(date);

    if (current === booking.Check_in)
      return "checkin";

    if (current === booking.Check_out)
      return "checkout";

    return "occupied";

  }

  const calendar = useMemo(() => {

    return rooms.map((room) => {

      return {

        room,

        cells: days.map((date) => {

          const booking = getBookingForDate(
            String(room.Room_Number),
            date
          );

          return {

            room,
            date,
            booking,
            state: getCellState(booking, date),

          } as CalendarCell;

        }),

      };

    });

  }, [rooms, bookings, days]);

  function getInitials(name: string) {

    return name
      .split(" ")
      .map((x) => x[0])
      .join("")
      .substring(0,2)
      .toUpperCase();

  }

  function cellColor(state: CalendarCell["state"]) {

    switch(state){

      case "checkin":
        return "bg-yellow-300";

      case "occupied":
        return "bg-red-500 text-white";

      case "checkout":
        return "bg-blue-300";

      default:
        return "bg-green-100";

    }

  }

    return (
    <AppLayout>

      <div className="flex items-center justify-between mb-6">

        <h1 className="text-3xl font-bold">
          Booking Calendar
        </h1>

        <div className="flex gap-2">

          <button
            onClick={previous30Days}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            ◀ Previous 30 Days
          </button>

          <button
            onClick={today}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Today
          </button>

          <button
            onClick={next30Days}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Next 30 Days ▶
          </button>

        </div>

      </div>

      <div className="overflow-auto border rounded-xl shadow">

        <table className="min-w-max border-collapse">

          <thead>

            <tr>

              <th className="sticky left-0 z-20 bg-gray-200 border p-3 min-w-[100px]">
                Room
              </th>

              {days.map((day) => (

                <th
                  key={formatDate(day)}
                  className="bg-gray-100 border p-2 min-w-[75px] text-center"
                >

                  <div className="font-semibold">
                    {day.toLocaleDateString("en-IN", {
                      day: "2-digit",
                    })}
                  </div>

                  <div className="text-xs text-gray-500">
                    {day.toLocaleDateString("en-IN", {
                      month: "short",
                    })}
                  </div>

                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {calendar.map((row) => (

              <tr key={row.room.Room_Number}>

                <td className="sticky left-0 bg-white border font-semibold p-3">

                  {row.room.Room_Number}

                </td>
                                {row.cells.map((cell) => (

                  <td
                    key={`${row.room.Room_Number}-${formatDate(cell.date)}`}
                    className={`border p-1 text-center cursor-pointer ${cellColor(cell.state)}`}
                    onClick={() => {

                      if (cell.booking) {

                        router.push(`/bookings/${cell.booking.ID}`);

                      }

                    }}
                    title={
                      cell.booking
                        ? `${cell.booking["Name of Guest"]}\n${cell.booking.Check_in} - ${cell.booking.Check_out}`
                        : "Available"
                    }
                  >

                    {cell.booking ? (

                      <div className="flex flex-col items-center">

                        <span className="font-bold text-xs">

                          {getInitials(
                            cell.booking["Name of Guest"]
                          )}

                        </span>

                      </div>

                    ) : (

                      <span className="text-green-700 text-lg">
                        •
                      </span>

                    )}

                  </td>

                ))}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="flex gap-6 mt-6 text-sm">

  <div className="flex items-center gap-2">
    <div className="w-5 h-5 bg-green-100 border rounded"></div>
    <span>Available</span>
  </div>

  <div className="flex items-center gap-2">
    <div className="w-5 h-5 bg-yellow-300 border rounded"></div>
    <span>Check In</span>
  </div>

  <div className="flex items-center gap-2">
    <div className="w-5 h-5 bg-red-500 border rounded"></div>
    <span>Occupied</span>
  </div>

  <div className="flex items-center gap-2">
    <div className="w-5 h-5 bg-blue-300 border rounded"></div>
    <span>Check Out</span>
  </div>

</div>

    </AppLayout>
  );

}

