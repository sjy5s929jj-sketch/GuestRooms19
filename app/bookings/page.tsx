"use client";

import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

export default function BookingsPage() {

  const [bookings, setBookings] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("Check_in", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setBookings(data || []);

  }

  const filteredBookings = bookings.filter((booking) => {

    const text = search.toLowerCase();

    return (

      booking["Name of Guest"]?.toLowerCase().includes(text) ||
      booking["Unit (only number)"]?.toLowerCase().includes(text) ||
      booking["Room No"]?.toString().includes(text) ||
      booking["Mobile No"]?.includes(text)

    );

  });

  async function checkoutGuest(id: number, roomNo: string) {

    const { error: bookingError } = await supabase
      .from("bookings")
      .update({

        Status: "Checked Out",

      })
      .eq("ID", id);

    if (bookingError) {

      alert("Failed to update booking.");
      console.log(bookingError);
      return;

    }

    const { error: roomError } = await supabase
      .from("rooms")
      .update({

        is_occupied: false,

      })
      .eq("Room_Number", roomNo);

    if (roomError) {

      alert("Failed to update room.");
      console.log(roomError);
      return;

    }

    alert("Guest Checked Out Successfully");

    await loadBookings();

  }

  return (

    <AppLayout>

      <div className="flex justify-between items-center mb-6">

        <Link
            href="/new-booking"
            className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 whitespace-nowrap"
          >
            + New Booking
          </Link>

        </div>

      <input
        type="text"
        placeholder="Search Guest / Unit / Room / Mobile"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg p-3 w-full mb-5"
      />

      <div className="overflow-x-auto bg-white rounded-xl shadow">

        <table className="min-w-full">

          <thead className="bg-gray-200">

            <tr>

              <th className="p-3 text-left">Guest</th>
              <th className="p-3 text-left">Unit</th>
              <th className="p-3 text-left">Room</th>
              <th className="p-3 text-left">Check In</th>
              <th className="p-3 text-left">Check Out</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Reservation</th>
              <th className="p-3 text-left">Action</th>

            </tr>

          </thead>

          <tbody>

            {filteredBookings.map((booking) => (

              <tr
                key={booking.ID}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-3">

                  <Link
                    href={`/bookings/${booking.ID}`}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    {booking["Name of Guest"]}
                  </Link>

                </td>

                <td className="p-3">
                  {booking["Unit (only number)"]}
                </td>

                <td className="p-3">
                  {booking["Room No"]}
                </td>

                <td className="p-3">
                  {booking["Check_in"]}
                </td>

                <td className="p-3">
                  {booking["Check_out"]}
                </td>

                <td className="p-3">
                  {booking["Status"]}
                </td>

                <td className="p-3">

                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">

                    {booking["Reservation_Status"] || "Reserved"}

                  </span>

                </td>

                <td className="p-3">

                  {booking["Status"] === "Occupied" ? (

                    <button
                      onClick={() =>
                        checkoutGuest(
                          booking.ID,
                          booking["Room No"]
                        )
                      }
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Checkout
                    </button>

                  ) : (

                    <span className="text-green-600 font-semibold">
                      Completed
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