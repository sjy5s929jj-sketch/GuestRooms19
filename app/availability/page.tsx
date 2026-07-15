"use client";

import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { supabase } from "../../lib/supabase";

export default function CalendarPage() {

  const [rooms, setRooms] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    const { data: roomData } = await supabase
      .from("rooms")
      .select("*")
      .order("Room_Number");

    setRooms(roomData || []);

    const { data: bookingData } = await supabase
      .from("bookings")
      .select("*");

    setBookings(bookingData || []);
  }

  function isOccupied(roomNo: string) {

    return bookings.some((booking) => {

      return (
        String(booking["Room No"]) === String(roomNo) &&
        booking["Status"] === "Occupied"
      );

    });

  }

  return (

    <AppLayout>

      <h1 className="text-3xl font-bold mb-6">

        Room Availability

      </h1>

      <div className="bg-white rounded-xl shadow">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">
                Room
              </th>

              <th className="p-4 text-left">
                Type
              </th>

              <th className="p-4 text-left">
                Availability
              </th>

            </tr>

          </thead>

          <tbody>

            {rooms.map((room) => (

              <tr
                key={room.Room_Number}
                className="border-t"
              >

                <td className="p-4">
                  {room.Room_Number}
                </td>

                <td className="p-4">
                  {room.Room_Type}
                </td>

                <td className="p-4">

                  {isOccupied(room.Room_Number) ? (

                    <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full">
                      Occupied
                    </span>

                  ) : (

                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full">
                      Available
                    </span>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </AppLayout>

  );

}