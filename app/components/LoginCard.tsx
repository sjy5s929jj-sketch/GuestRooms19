"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginCard() {

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {

    const { error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    });

    if (error) {
      alert(error.message);
      console.error(error);
      return;
    }

    router.push("/dashboard");

  }

  return (

    <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">

      <div className="flex justify-center mb-8">

        <div className="w-24 h-24 rounded-full bg-blue-700 flex items-center justify-center text-white text-5xl">
          🏨
        </div>

      </div>

      <h1 className="text-4xl font-bold text-center">
        Guest Room @19
      </h1>

      <p className="text-center text-gray-500 mt-2">
        Military Guest Room Management System
      </p>

      <div className="mt-8 space-y-4">

        <input
          type="email"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border rounded-xl p-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-xl p-3"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Login
        </button>

      </div>

    </div>

  );

}