"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppLayout from "../components/layout/AppLayout";
import { supabase } from "../../lib/supabase";

export default function RoomsPage() {

  const [rooms, setRooms] = useState<any[]>([]);
  const [occupiedRooms, setOccupiedRooms] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadRooms();
  }, []);

  async function loadRooms() {

    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .order("Room_Number");

    if (error) {
      console.log(error);
      return;
    }

    setRooms(data || []);

    const { data: occupiedData } = await supabase
      .from("bookings")
      .select("*")
      .eq("Status", "Occupied");

    setOccupiedRooms(
      (occupiedData || []).map((b: any) => String(b["Room No"]))
    );


  }

  const filteredRooms = rooms.filter((room) => {

    const text = search.toLowerCase();

    return (
      room.Room_Number.toString().includes(text) ||
      room.Room_Type.toLowerCase().includes(text) ||
      room.Block.toLowerCase().includes(text)
    );

  });

  function isOccupied(roomNo: string | number) {
    return occupiedRooms.includes(String(roomNo));
}

return (

  <AppLayout>

      <h1 className="text-3xl font-bold mb-6">
        Rooms
      </h1>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        <div className="bg-white rounded-xl shadow p-6">

          <p className="text-gray-500">
            Total Rooms
          </p>

          <p className="text-4xl font-bold mt-2">
            {rooms.length}
          </p>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <p className="text-gray-500">
            Available
          </p>

          <p className="text-4xl font-bold text-green-600 mt-2">
            {rooms.filter(room => !isOccupied(room.Room_Number)).length}
          </p>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <p className="text-gray-500">
            Occupied
          </p>

          <p className="text-4xl font-bold text-red-600 mt-2">
            {rooms.filter(room => isOccupied(room.Room_Number)).length}
          </p>

        </div>

      </div>

      {/* Search */}

      <input
        type="text"
        placeholder="Search Room / Type / Block"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg p-3 w-full mb-6"
      />

      {/* Rooms Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="min-w-full">

          <thead className="bg-gray-200">

            <tr>

              <th className="p-4 text-left">Room</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Block</th>
              <th className="p-4 text-left">Floor</th>
              <th className="p-4 text-left">Status</th>

            </tr>

          </thead>

          <tbody>

            {filteredRooms.map((room) => (

              <tr
                key={room.Room_Number}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-4">

                  <Link
                    href={`/rooms/${room.Room_Number}`}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    {room.Room_Number}
                  </Link>

                </td>

                <td className="p-4">
                  {room.Room_Type}
                </td>

                <td className="p-4">
                  {room.Block}
                </td>

                <td className="p-4">
                  {room.Floor}
                </td>

                <td className="p-4">

                  {isOccupied(room.Room_Number) ? (

                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Occupied
                    </span>

                  ) : (

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
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