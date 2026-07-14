"use client";

import Link from "next/link";
import { useAuth } from "../AuthProvider";

export default function Sidebar() {

  const { role } = useAuth();

  return (

    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6">

      <h1 className="text-2xl font-bold mb-10">
        Guest Rooms @19
      </h1>

      <nav className="space-y-3">

        <Link
          href="/dashboard"
          className="block p-3 rounded-lg hover:bg-slate-700"
        >
          📊 Dashboard
        </Link>

        <Link
          href="/rooms"
          className="block p-3 rounded-lg hover:bg-slate-700"
        >
          🛏 Rooms
        </Link>

        <Link
          href="/bookings"
          className="block p-3 rounded-lg hover:bg-slate-700"
        >
          📋 Bookings
        </Link>

        <Link
          href="/availability"
          className="block p-3 rounded-lg hover:bg-slate-700"
        >
          🟢 Availability
        </Link>

        <Link
          href="/calendar"
          className="block p-3 rounded-lg hover:bg-slate-700"
        >
          📅 Calendar
        </Link>

        <Link
          href="/reports"
          className="block p-3 rounded-lg hover:bg-slate-700"
        >
          📈 Reports
        </Link>

        {role === "Admin" && (

          <Link
            href="/settings"
            className="block p-3 rounded-lg hover:bg-slate-700"
          >
            ⚙️ Settings
          </Link>

        )}

      </nav>

    </aside>

  );

}