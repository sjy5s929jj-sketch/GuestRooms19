"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    checkUser();

  }, []);

  async function checkUser() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {

      router.replace("/");
      return;

    }

    setLoading(false);

  }

  if (loading) {

    return (

      <div className="flex items-center justify-center min-h-screen">

        <p className="text-lg font-semibold">
          Loading...
        </p>

      </div>

    );

  }

  return <>{children}</>;

}