import { cookies } from "next/headers";
import type { User } from "@/data/mock/posts";
import { createClient } from "@/utils/supabase/server";

const ROLE_LABELS: Record<string, string> = {
  staff: "Staff",
  parent: "Familia",
  admin: "Admin",
};

const DAYCARE_PREFIX = "Guardería ";

function getInitials(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function getRoomName(daycareName: string | null | undefined): string {
  if (!daycareName) return "";
  return daycareName.startsWith(DAYCARE_PREFIX)
    ? daycareName.slice(DAYCARE_PREFIX.length)
    : daycareName;
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  const email = data?.claims?.email;
  if (!userId) return null;

  const { data: profile, error } = await supabase
    .from("users")
    .select("id, full_name, role, daycares(name)")
    .eq("id", userId)
    .single();

  if (error || !profile) return null;

  const daycareRow = Array.isArray(profile.daycares) ? profile.daycares[0] : profile.daycares;
  const daycareName = (daycareRow as { name: string } | null | undefined)?.name;
  const name = profile.full_name || email?.split("@")[0] || "Usuario";

  return {
    id: profile.id,
    name,
    role: ROLE_LABELS[profile.role] ?? profile.role,
    room: getRoomName(daycareName),
    initials: getInitials(name),
  };
}
