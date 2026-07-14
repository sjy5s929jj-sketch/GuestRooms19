"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../../lib/supabase";

const AuthContext = createContext<any>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>("");

  useEffect(() => {

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {

      getUser();

    });

    return () => subscription.unsubscribe();

  }, []);

  async function getUser() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    if (!user) {

      setRole("");
      return;

    }

    const { data } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    setRole(data?.role || "");

  }

  return (

    <AuthContext.Provider
      value={{
        user,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>

  );

}

export function useAuth() {

  return useContext(AuthContext);

}