"use client";

import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

export default function Dashboard() {

  const [totalRooms, setTotalRooms] = useState(0);
  const [occupiedRooms, setOccupiedRooms] = useState(0);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [todayCheckIn, setTodayCheckIn] = useState(0);
  const [todayCheckOut, setTodayCheckOut] = useState(0);
  

  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {

    const today = new Date().toISOString().split("T")[0];

    const { count: total } = await supabase
      .from("rooms")
      .select("*", { count: "exact", head: true });

    const { count: occupied } = await supabase
      .from("rooms")
      .select("*", { count: "exact", head: true })
      .eq("is_occupied", true);

    const { count: available } = await supabase
      .from("rooms")
      .select("*", { count: "exact", head: true })
      .eq("is_occupied", false);

    const { count: checkin } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("Check_in", today);

    const { count: checkout } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("Check_out", today);

    const { data: recent } = await supabase
      .from("bookings")
      .select("*")
      .order("Check_in", { ascending: false })
      .limit(5);

    setTotalRooms(total || 0);
    setOccupiedRooms(occupied || 0);
    setAvailableRooms(available || 0);
    setTodayCheckIn(checkin || 0);
    setTodayCheckOut(checkout || 0);
    setRecentBookings(recent || []);
  }

  return (

    <AppLayout>

      <h1 className="text-3xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">

        <DashboardCard title="Total Rooms" value={totalRooms} />

        <DashboardCard
          title="Occupied"
          value={occupiedRooms}
          color="text-red-600"
        />

        <DashboardCard
          title="Available"
          value={availableRooms}
          color="text-green-600"
        />

        <DashboardCard
          title="Today's Check In"
          value={todayCheckIn}
          color="text-blue-600"
        />

        <DashboardCard
          title="Today's Check Out"
          value={todayCheckOut}
          color="text-orange-600"
        />

      </div>

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-bold mb-4">
          Recent Bookings
        </h2>

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3 text-left">
                Guest
              </th>

              <th className="p-3 text-left">
                Room
              </th>

              <th className="p-3 text-left">
                Check In
              </th>

              <th className="p-3 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {recentBookings.map((booking) => (

              <tr
                key={booking.ID}
                className="border-t"
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
                  {booking["Room No"]}
                </td>

                <td className="p-3">
                  {booking["Check_in"]}
                </td>

                <td className="p-3">

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

function DashboardCard({
  title,
  value,
  color = "",
}: {
  title: string;
  value: number;
  color?: string;
}) {

  return (

    <div className="bg-white rounded-xl shadow p-6">

      <p className="text-gray-500">
        {title}
      </p>

      <p className={`text-4xl font-bold mt-2 ${color}`}>
        {value}
      </p>

    </div>

  );

}