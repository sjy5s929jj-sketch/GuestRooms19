"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AppLayout from "../../components/layout/AppLayout";
import { supabase } from "../../../lib/supabase";

export default function RoomDetailsPage() {

  const params = useParams();
  const roomNo = params.roomNo as string;

  const [room, setRoom] = useState<any>(null);
  const [guest, setGuest] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (roomNo) {
      loadRoom();
    }
  }, [roomNo]);

  async function loadRoom() {

    // Load Room Details
    const { data: roomData, error: roomError } = await supabase
      .from("rooms")
      .select("*")
      .eq("Room_Number", roomNo)
      .single();

    if (roomError) {
      console.log(roomError);
      return;
    }

    setRoom(roomData);

    // Load Current Guest
    const { data: guestData } = await supabase
      .from("bookings")
      .select("*")
      .eq("Room No", roomNo)
      .eq("Status", "Occupied")
      .maybeSingle();

    setGuest(guestData);

    // Load Booking History
    const { data: historyData } = await supabase
      .from("bookings")
      .select("*")
      .eq("Room No", roomNo)
      .order("Check_in", { ascending: false });

    setHistory(historyData || []);
  }

  return (

    <AppLayout>

      <h1 className="text-3xl font-bold mb-6">
        Room {roomNo}
      </h1>

      {room && (

        <div className="bg-white rounded-xl shadow p-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Room Information */}

            <div>

              <h2 className="text-xl font-bold mb-4">
                Room Information
              </h2>

              <p><b>Room Number:</b> {room.Room_Number}</p>
              <p><b>Room Type:</b> {room.Room_Type}</p>
              <p><b>Block:</b> {room.Block}</p>
              <p><b>Floor:</b> {room.Floor}</p>

              <p className="mt-3">
                <b>Status:</b>{" "}
                {room.is_occupied ? (
                  <span className="text-red-600 font-semibold">
                    Occupied
                  </span>
                ) : (
                  <span className="text-green-600 font-semibold">
                    Available
                  </span>
                )}
              </p>

            </div>

            {/* Current Guest */}

            <div>

              <h2 className="text-xl font-bold mb-4">
                Current Guest
              </h2>

              {guest ? (

                <div className="space-y-2">

                  <p><b>Name:</b> {guest["Name of Guest"]}</p>

                  <p><b>Unit:</b> {guest["Unit (only number)"]}</p>

                  <p><b>Mobile:</b> {guest["Mobile No"]}</p>

                  <p><b>WhatsApp:</b> {guest["WhatsApp No"]}</p>

                  <p><b>Purpose:</b> {guest["Purpose"]}</p>

                  <p><b>Check In:</b> {guest["Check_in"]}</p>

                  <p><b>Check Out:</b> {guest["Check_out"]}</p>

                  <p><b>Adults:</b> {guest["Adults"]}</p>

                  <p><b>Children:</b> {guest["Children"]}</p>

                  <p><b>Remarks:</b> {guest["Remarks"]}</p>

                </div>

              ) : (

                <p className="text-green-600 font-semibold">
                  Room is currently available.
                </p>

              )}

            </div>

          </div>

        </div>

      )}

      {history.length > 0 && (

        <div className="bg-white rounded-xl shadow p-8 mt-8">

          <h2 className="text-2xl font-bold mb-6">
            Booking History
          </h2>

          <table className="min-w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-3 text-left">Guest</th>
                <th className="p-3 text-left">Check In</th>
                <th className="p-3 text-left">Check Out</th>
                <th className="p-3 text-left">Status</th>

              </tr>

            </thead>

            <tbody>

              {history.map((booking) => (

                <tr
                  key={booking.ID}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-3">
                    {booking["Name of Guest"]}
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

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </AppLayout>

  );

}