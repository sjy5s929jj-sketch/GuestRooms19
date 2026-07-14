"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "../../../components/layout/AppLayout";
import { supabase } from "../../../../lib/supabase";

export default function EditBookingPage() {

  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [guestName, setGuestName] = useState("");
  const [unit, setUnit] = useState("");
  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [purpose, setPurpose] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [remarks, setRemarks] = useState("");

  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    loadBooking();
    loadRooms();
  }, []);

  async function loadRooms() {

    const { data } = await supabase
      .from("rooms")
      .select("*")
      .order("Room_Number");

    setRooms(data || []);

  }

  async function loadBooking() {

    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("ID", id)
      .single();

    if (!data) return;

    setGuestName(data["Name of Guest"]);
    setUnit(data["Unit (only number)"]);
    setMobile(data["Mobile No"]);
    setWhatsapp(data["WhatsApp No"]);
    setRoomNo(data["Room No"]);
    setPurpose(data["Purpose"]);
    setCheckIn(data["Check_in"]);
    setCheckOut(data["Check_out"]);
    setAdults(data["Adults"]);
    setChildren(data["Children"]);
    setRemarks(data["Remarks"]);
  }

  async function updateBooking() {

    const { error } = await supabase
      .from("bookings")
      .update({

        "Name of Guest": guestName,
        "Unit (only number)": unit,
        "Mobile No": mobile,
        "WhatsApp No": whatsapp,
        "Room No": roomNo,
        "Purpose": purpose,
        "Check_in": checkIn,
        "Check_out": checkOut,
        "Adults": adults,
        "Children": children,
        "Remarks": remarks,

      })
      .eq("ID", id);

    if (error) {

      alert("Update failed.");
      console.log(error);
      return;

    }

    alert("Booking Updated Successfully");

    router.push(`/bookings/${id}`);

  }

  return (

    <AppLayout>

      <h1 className="text-3xl font-bold mb-6">

        Edit Booking

      </h1>

      <div className="bg-white rounded-xl shadow p-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            value={guestName}
            onChange={(e)=>setGuestName(e.target.value)}
            placeholder="Guest Name"
            className="border rounded-lg p-3"
          />

          <input
            value={unit}
            onChange={(e)=>setUnit(e.target.value)}
            placeholder="Unit"
            className="border rounded-lg p-3"
          />

          <input
            value={mobile}
            onChange={(e)=>setMobile(e.target.value)}
            placeholder="Mobile"
            className="border rounded-lg p-3"
          />

          <input
            value={whatsapp}
            onChange={(e)=>setWhatsapp(e.target.value)}
            placeholder="WhatsApp"
            className="border rounded-lg p-3"
          />

          <select
            value={roomNo}
            onChange={(e)=>setRoomNo(e.target.value)}
            className="border rounded-lg p-3"
          >

            {rooms.map(room=>(
              <option
                key={room.Room_Number}
                value={room.Room_Number}
              >
                {room.Room_Number} - {room.Room_Type}
              </option>
            ))}

          </select>

          <select
            value={purpose}
            onChange={(e)=>setPurpose(e.target.value)}
            className="border rounded-lg p-3"
          >
            <option>Official Duty</option>
            <option>Course</option>
            <option>Temporary Duty</option>
            <option>Family Visit</option>
            <option>Other</option>
          </select>

          <input
            type="date"
            value={checkIn}
            onChange={(e)=>setCheckIn(e.target.value)}
            className="border rounded-lg p-3"
          />

          <input
            type="date"
            value={checkOut}
            onChange={(e)=>setCheckOut(e.target.value)}
            className="border rounded-lg p-3"
          />

          <input
            type="number"
            value={adults}
            onChange={(e)=>setAdults(Number(e.target.value))}
            className="border rounded-lg p-3"
          />

          <input
            type="number"
            value={children}
            onChange={(e)=>setChildren(Number(e.target.value))}
            className="border rounded-lg p-3"
          />

        </div>

        <textarea
          value={remarks}
          onChange={(e)=>setRemarks(e.target.value)}
          rows={4}
          className="border rounded-lg p-3 w-full mt-4"
        />

        <button
          onClick={updateBooking}
          className="bg-blue-700 text-white px-8 py-3 rounded-lg mt-6 hover:bg-blue-800"
        >
          Update Booking
        </button>

      </div>

    </AppLayout>

  );

}