"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "../components/layout/AppLayout";
import { supabase } from "../../lib/supabase";

export default function NewBookingPage() {

  const router = useRouter();

  const [rooms, setRooms] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  const [guestName, setGuestName] = useState("");
  const [unit, setUnit] = useState("");
  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [roomNo, setRoomNo] = useState("");

  const [purpose, setPurpose] = useState("Official Duty");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    loadRooms();
  }, [checkIn, checkOut]);

  async function loadRooms() {

    // Load all rooms
    const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .order("Room_Number");

    if (error) {
        console.log(error);
        return;
    }

    setRooms(data || []);

    // Load all bookings
    const { data: bookingData } = await supabase
        .from("bookings")
        .select("*");

    setBookings(bookingData || []);

    }

    async function saveBooking() {
      console.log("1. Save button pressed");

    if (
      !guestName ||
      !unit ||
      !mobile ||
      !roomNo ||
      !checkIn ||
      !checkOut
    ) {

      alert("Please fill all mandatory fields.");
      return;

    }
    console.log("2. Validation passed");
    console.log("3. Checking room availability");

    // Check latest bookings from database
    const { data: conflicts, error: conflictError } = await supabase
         .from("bookings")
         .select("*")
         .eq("Room No", roomNo)
         .neq("Status", "Checked Out");

    if (conflictError) {

      alert("Unable to verify room availability.");
      return;

    }

    console.log("3. Conflict Query");
    console.log(conflicts);
    console.log(conflictError);

    const roomAlreadyBooked = (conflicts || []).some((booking) => {

        return (
       checkIn <= booking["Check_out"] &&
        checkOut >= booking["Check_in"]
      );

    });

    if (roomAlreadyBooked) {

      console.log("3. Room is already booked for the selected dates.");
      alert("Selected room is already booked for the selected dates.");
     return;

    }

    console.log("4. About to insert");
    console.log("5. Inserting booking");

    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          "Name of Guest": "TEST",
        },
      ])
      .select();

    console.log("DATA:", data);
    console.log("ERROR:", error);
    
    console.log("5. Insert error");
    
    console.log(error);

    if (error) {
      console.log("ERROR CODE:", error.code);
      console.log("ERROR MESSAGE:", error.message);
      console.log("ERROR DETAILS:", error.details);
      console.log("ERROR HINT:", error.hint);

      alert(error.message);

      return;
    }

    await supabase
      .from("rooms")
      .update({
        is_occupied: true,
      })
      .eq("Room_Number", roomNo);

    alert("Booking Saved Successfully");

    router.push("/bookings");

  }

    function isRoomAvailable(roomNo: string) {

        if (!checkIn || !checkOut) return true;

        return !bookings.some((booking) => {

         if (booking["Room No"] !== roomNo)
            return false;

        if (booking["Status"] === "Checked Out")
            return false;

        return (
            checkIn <= booking["Check_out"] &&
            checkOut >= booking["Check_in"]
        );

     });

    }
    return (

    <AppLayout>

      <h1 className="text-3xl font-bold mb-6">
        New Booking
      </h1>

      <div className="bg-white rounded-xl shadow p-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            className="border rounded-lg p-3"
            placeholder="Guest Name *"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />

          <input
            className="border rounded-lg p-3"
            placeholder="Unit Number *"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />

          <input
            className="border rounded-lg p-3"
            placeholder="Mobile Number *"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

          <input
            className="border rounded-lg p-3"
            placeholder="WhatsApp Number"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />

          <select
            className="border rounded-lg p-3"
            value={roomNo}
            onChange={(e) => setRoomNo(e.target.value)}
          >

            <option value="">
              Select Room
            </option>

            {rooms
                .filter((room) => isRoomAvailable(room.Room_Number))
                .map((room) => (

              <option
                key={room.Room_Number}
                value={room.Room_Number}
              >

                {room.Room_Number} - {room.Room_Type}

              </option>

            ))}

          </select>

          <select
            className="border rounded-lg p-3"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          >

            <option>Official Duty</option>
            <option>Course</option>
            <option>Temporary Duty</option>
            <option>Family Visit</option>
            <option>Other</option>

          </select>

          <div>

            <label className="block mb-1 font-medium">
              Check In
            </label>

            <input
              type="date"
              className="border rounded-lg p-3 w-full"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />

          </div>

          <div>

            <label className="block mb-1 font-medium">
              Check Out
            </label>

            <input
              type="date"
              className="border rounded-lg p-3 w-full"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />

          </div>

          <input
            type="number"
            className="border rounded-lg p-3"
            placeholder="Adults"
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
          />

          <input
            type="number"
            className="border rounded-lg p-3"
            placeholder="Children"
            value={children}
            onChange={(e) => setChildren(Number(e.target.value))}
          />

        </div>

        <textarea
          rows={4}
          className="border rounded-lg p-3 w-full mt-4"
          placeholder="Remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />

        <div className="flex gap-4 mt-6">

          <button
            onClick={saveBooking}
            className="bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800"
          >
            Save Booking
          </button>

          <button
            onClick={() => router.push("/bookings")}
            className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>

        </div>

      </div>

    </AppLayout>

  );

}