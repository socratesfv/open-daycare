import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export interface Room {
  id: string;
  name: string;
}

export type ChildStatus = "active" | "archived";

export interface ChildRow {
  id: string;
  room_id: string | null;
  full_name: string;
  birth_date: string;
  enrolled_at: string;
  medical_notes: string;
  allergy_tags: string[];
  photo_consent: boolean;
  status: ChildStatus;
  created_at: string;
  updated_at: string;
  rooms?: { name: string } | { name: string }[] | null;
}

export interface ChildFormData {
  full_name: string;
  birth_date: string;
  enrolled_at: string;
  room_id: string;
  allergy_tags: string[];
  medical_notes: string;
  photo_consent: boolean;
}

export function getRoomName(child: ChildRow): string {
  const row = child.rooms;
  if (Array.isArray(row)) return row[0]?.name ?? "";
  return row?.name ?? "";
}

export async function getCurrentDaycareId(): Promise<string | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("daycare_id")
    .eq("id", userId)
    .single();

  return profile?.daycare_id ?? null;
}

export async function getChildren(daycareId: string): Promise<ChildRow[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: daycareRooms } = await supabase
    .from("rooms")
    .select("id")
    .eq("daycare_id", daycareId);
  const roomIds = (daycareRooms ?? []).map((room) => room.id);

  const { data, error } = await supabase
    .from("children")
    .select("*, rooms(name)")
    .eq("status", "active")
    .in("room_id", roomIds)
    .order("full_name");

  if (error || !data) return [];
  return data as ChildRow[];
}

export async function getChild(childId: string): Promise<ChildRow | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("children")
    .select("*, rooms(name)")
    .eq("id", childId)
    .single();

  if (error || !data) return null;
  return data as ChildRow;
}

export async function getRooms(daycareId: string): Promise<Room[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("rooms")
    .select("id, name")
    .eq("daycare_id", daycareId)
    .order("name");

  if (error || !data) return [];
  return data as Room[];
}

export async function insertChild(data: ChildFormData): Promise<{ error: string | null }> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from("children").insert({
    ...data,
    status: "active",
  });

  return { error: error?.message ?? null };
}

export async function updateChild(
  childId: string,
  data: ChildFormData,
): Promise<{ error: string | null }> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from("children").update(data).eq("id", childId);

  return { error: error?.message ?? null };
}
