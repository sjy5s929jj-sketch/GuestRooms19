"use client";

import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { supabase } from "../../lib/supabase";

export default function ReportsPage() {

  const [totalBookings, setTotalBookings] = useState(0);
  const [occupiedRooms, setOccupiedRooms] = useState(0);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [todayCheckIn, setTodayCheckIn] = useState(0);
  const [todayCheckOut, setTodayCheckOut] = useState(0);

  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {

    const today = new Date().toISOString().split("T")[0];

    const { count: total } = await supabase
      .from("rooms")
      .select("*", { count: "exact", head: true });
    
      const { count: bookings } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true });

    const { count: occupied } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("Status", "Occupied");

    const available = (total || 0) - (occupied || 0);

    const { count: checkin } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("Check_in", today);

    const { count: checkout } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("Check_out", today);

    setTotalBookings(bookings || 0);
    setOccupiedRooms(occupied || 0);
    setAvailableRooms(available || 0);
    setTodayCheckIn(checkin || 0);
    setTodayCheckOut(checkout || 0);
  }

  return (

    <AppLayout>

      <h1 className="text-3xl font-bold mb-8">
        Reports
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Total Bookings</p>
          <p className="text-4xl font-bold mt-2">{totalBookings}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Occupied Rooms</p>
          <p className="text-4xl font-bold text-red-600 mt-2">
            {occupiedRooms}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Available Rooms</p>
          <p className="text-4xl font-bold text-green-600 mt-2">
            {availableRooms}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Today's Check In</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">
            {todayCheckIn}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Today's Check Out</p>
          <p className="text-4xl font-bold text-orange-600 mt-2">
            {todayCheckOut}
          </p>
        </div>

      </div>

    </AppLayout>

  );
}