import { redirect } from "next/navigation";
import AppLayout from "@/app/components/AppLayout";
import KidsPageClient from "@/app/components/KidsPageClient";
import { getCurrentDaycareId, getChildren, getRooms } from "@/utils/supabase/children";

export default async function ChildrenList() {
  const daycareId = await getCurrentDaycareId();
  if (!daycareId) redirect("/login");

  const [children, rooms] = await Promise.all([
    getChildren(daycareId),
    getRooms(daycareId),
  ]);

  return (
    <AppLayout activeItem="Niños">
      <KidsPageClient kids={children} rooms={rooms} />
    </AppLayout>
  );
}
