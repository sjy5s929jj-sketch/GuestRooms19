"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AppLayout from "../../components/layout/AppLayout";
import { supabase } from "../../../lib/supabase";

export default function BookingDetailsPage() {

  const params = useParams();
  const id = params.id as string;

  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    loadBooking();
  }, [id]);

  async function loadBooking() {

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("ID", id)
      .single();

    if (error) {
      console.log(error);
      return;
    }

    setBooking(data);
  }

  async function checkoutGuest() {

    if (!confirm("Are you sure you want to check out this guest?")) {
      return;
    }

    const { error: bookingError } = await supabase
      .from("bookings")
      .update({
        Status: "Checked Out",
        Reservation_Status: "Checked Out",
      })
      .eq("ID", booking.ID);

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
      .eq("Room_Number", booking["Room No"]);

    if (roomError) {
      alert("Failed to update room.");
      console.log(roomError);
      return;
    }

    alert("Guest Checked Out Successfully");

    await loadBooking();

  }

  if (!booking) {
    return (
      <AppLayout>
        <p>Loading...</p>
      </AppLayout>
    );
  }

  return (

    <AppLayout>

      <h1 className="text-3xl font-bold mb-6">
        Booking Details
      </h1>

      <div className="bg-white rounded-xl shadow p-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <p><b>Guest Name:</b> {booking["Name of Guest"]}</p>
          <p><b>Unit:</b> {booking["Unit (only number)"]}</p>
          <p><b>Mobile:</b> {booking["Mobile No"]}</p>
          <p><b>WhatsApp:</b> {booking["WhatsApp No"]}</p>
          <p><b>Room:</b> {booking["Room No"]}</p>
          <p><b>Purpose:</b> {booking["Purpose"]}</p>
          <p><b>Check In:</b> {booking["Check_in"]}</p>
          <p><b>Check Out:</b> {booking["Check_out"]}</p>
          <p><b>Adults:</b> {booking["Adults"]}</p>
          <p><b>Children:</b> {booking["Children"]}</p>
          <p><b>Status:</b> {booking["Status"]}</p>

        </div>

        <div className="mt-6">

          <h2 className="font-bold mb-2">
            Remarks
          </h2>

          <div className="border rounded-lg p-4 bg-gray-50">
            {booking["Remarks"] || "No Remarks"}
          </div>

        </div>

        <div className="mt-8 flex flex-wrap gap-4">

          <Link
            href={`/bookings/${booking.ID}/edit`}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            ✏️ Edit Booking
          </Link>

          {booking["Status"] !== "Checked Out" && (

            <button
              onClick={checkoutGuest}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
            >
              🚪 Checkout Guest
            </button>

          )}

          <Link
            href="/bookings"
            className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          >
            ← Back to Bookings
          </Link>

        </div>

      </div>

    </AppLayout>

  );

}