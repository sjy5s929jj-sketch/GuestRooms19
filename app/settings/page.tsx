"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "../components/layout/AppLayout";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../components/AuthProvider";

export default function SettingsPage() {

  const router = useRouter();
  const { role } = useAuth();

  const [guestHouseName, setGuestHouseName] = useState("");
  const [station, setStation] = useState("");
  const [receptionPhone, setReceptionPhone] = useState("");
  const [adminName, setAdminName] = useState("");

  useEffect(() => {

    if (role === "") return;

    if (role !== "Admin") {
      alert("Access Denied");
      router.push("/dashboard");
      return;
    }

    loadSettings();

  }, [role]);

  async function loadSettings() {

    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      console.log(error);
      return;
    }

    setGuestHouseName(data.guest_house_name || "");
    setStation(data.station || "");
    setReceptionPhone(data.reception_phone || "");
    setAdminName(data.admin_name || "");

  }

  async function saveSettings() {

    const { error } = await supabase
      .from("settings")
      .update({
        guest_house_name: guestHouseName,
        station,
        reception_phone: receptionPhone,
        admin_name: adminName,
      })
      .eq("id", 1);

    if (error) {
      alert("Failed to save settings.");
      return;
    }

    alert("Settings Saved Successfully.");

  }

  if (role === "") {

    return (
      <AppLayout>
        <p>Loading...</p>
      </AppLayout>
    );

  }

  if (role !== "Admin") {
    return null;
  }

  return (

    <AppLayout>

      <h1 className="text-3xl font-bold mb-6">
        Settings
      </h1>

      <div className="bg-white rounded-xl shadow p-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>

            <label className="block mb-2 font-semibold">
              Guest House Name
            </label>

            <input
              className="border rounded-lg p-3 w-full"
              value={guestHouseName}
              onChange={(e) => setGuestHouseName(e.target.value)}
            />

          </div>

          <div>

            <label className="block mb-2 font-semibold">
              Station
            </label>

            <input
              className="border rounded-lg p-3 w-full"
              value={station}
              onChange={(e) => setStation(e.target.value)}
            />

          </div>

          <div>

            <label className="block mb-2 font-semibold">
              Reception Phone
            </label>

            <input
              className="border rounded-lg p-3 w-full"
              value={receptionPhone}
              onChange={(e) => setReceptionPhone(e.target.value)}
            />

          </div>

          <div>

            <label className="block mb-2 font-semibold">
              Administrator
            </label>

            <input
              className="border rounded-lg p-3 w-full"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
            />

          </div>

        </div>

        <div className="mt-8">

          <button
            onClick={saveSettings}
            className="bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800"
          >
            Save Settings
          </button>

        </div>

      </div>

    </AppLayout>

  );

}