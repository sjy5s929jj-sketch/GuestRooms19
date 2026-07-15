import { supabase } from "./supabase";

export async function getOccupiedRooms() {

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("Status", "Occupied");

  if (error) {
    console.log(error);
    return [];
  }

  return (data || []).map((b: any) => String(b["Room No"]));
}