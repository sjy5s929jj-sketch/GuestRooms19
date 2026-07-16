"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../AuthProvider";

export default function Header() {

  const router = useRouter();
  const { user, role } = useAuth();

  async function logout() {

    await supabase.auth.signOut();

    router.push("/");

  }

  return (

    <header className="bg-white shadow px-8 py-5 flex justify-between items-center">

      <div>

        <h2 className="text-3xl font-bold">
          Guest Rooms @19
        </h2>

        <p className="text-gray-500">
          Guest Room Management System
        </p>

      </div>

      <div className="flex items-center gap-6">

        <div className="text-right">

          <p className="font-semibold">
            Welcome
          </p>

          <p className="text-gray-500">
            {role}
          </p>

          <p className="text-xs text-gray-400">
            {user?.email}
          </p>

        </div>

        <button
          onClick={logout}
          className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>

      </div>

    </header>

  );

}