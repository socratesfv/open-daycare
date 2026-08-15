import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AppLayout from "@/app/components/AppLayout";
import ChildProfile from "@/app/components/ChildProfile";
import { getCurrentDaycareId, getChild, getRooms } from "@/utils/supabase/children";

interface KidProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function KidProfilePage({ params }: KidProfilePageProps) {
  const { id } = await params;

  const daycareId = await getCurrentDaycareId();
  if (!daycareId) redirect("/login");

  const [child, rooms] = await Promise.all([getChild(id), getRooms(daycareId)]);
  if (!child) notFound();

  return (
    <AppLayout activeItem="Niños">
      <main className="h-screen min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[820px] px-10 pb-20 pt-[84px] md:pt-[34px]">
          <Link
            href="/ninos"
            className="mb-5 flex items-center gap-[7px] text-sm font-bold text-[#94887B]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Volver a Niños
          </Link>
          <ChildProfile child={child} rooms={rooms} />
        </div>
      </main>
    </AppLayout>
  );
}
