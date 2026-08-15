"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { insertChild, updateChild, type ChildFormData } from "@/utils/supabase/children";

export async function signOut() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  await supabase.auth.signOut();

  redirect("/login");
}

export async function saveChild(data: ChildFormData) {
  const { error } = await insertChild(data);
  if (error) return { error };
  revalidatePath("/ninos");
  return { error: null };
}

export async function editChild(childId: string, data: ChildFormData) {
  const { error } = await updateChild(childId, data);
  if (error) return { error };
  revalidatePath("/ninos");
  return { error: null };
}
