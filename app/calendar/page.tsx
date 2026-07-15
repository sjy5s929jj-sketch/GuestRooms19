"use client";

import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { supabase } from "../../lib/supabase";

export default function CalendarPage() {

  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {

    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("Check_in");

    setBookings(data || []);

  }

  return (

    <AppLayout>

      <h1 className="text-3xl font-bold mb-6">
        Booking Calendar
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">Guest</th>
              <th className="p-4 text-left">Room</th>
              <th className="p-4 text-left">Check In</th>
              <th className="p-4 text-left">Check Out</th>
              <th className="p-4 text-left">Status</th>

            </tr>

          </thead>

          <tbody>

            {bookings.map((booking) => (

              <tr
                key={booking.ID}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-4">
                  {booking["Name of Guest"]}
                </td>

                <td className="p-4">
                  {booking["Room No"]}
                </td>

                <td className="p-4">
                  {booking["Check_in"]}
                </td>

                <td className="p-4">
                  {booking["Check_out"]}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      booking["Status"] === "Occupied"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {booking["Status"]}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </AppLayout>

  );

}