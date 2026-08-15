"use client";

import { useMemo, useState } from "react";
import SearchBar from "@/app/components/SearchBar";
import ChildCard from "@/app/components/ChildCard";
import ChildFormModal from "@/app/components/ChildFormModal";
import type { ChildRow, Room } from "@/utils/supabase/children";

interface KidsPageClientProps {
  kids: ChildRow[];
  rooms: Room[];
}

export default function KidsPageClient({ kids, rooms }: KidsPageClientProps) {
  const [query, setQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const normalizedQuery = query.trim().toLowerCase();

  const groups = useMemo(() => {
    const visible = kids.filter((child) =>
      child.full_name.toLowerCase().includes(normalizedQuery),
    );

    return rooms
      .map((room) => ({
        room,
        kids: visible.filter((child) => child.room_id === room.id),
      }))
      .filter((group) => group.kids.length > 0 || visible.length === 0);
  }, [kids, rooms, normalizedQuery]);

  const visibleCount = kids.filter((child) =>
    child.full_name.toLowerCase().includes(normalizedQuery),
  ).length;

  return (
    <>
      <main className="h-screen min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[880px] px-10 pb-20 pt-[84px] md:pt-[34px]">
          <div className="mb-[22px] flex items-end justify-between gap-4">
            <div>
              <div className="mb-1 text-[12.5px] font-extrabold uppercase tracking-[0.8px] text-[#D9583C]">Gestión</div>
              <h1 className="font-display text-[30px] font-semibold text-[#3F362E]">Niños</h1>
            </div>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] px-[18px] py-[11px] text-[14.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,.7)]"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Agregar niño
            </button>
          </div>

          <SearchBar value={query} onChange={setQuery} />

          {groups.map(({ room, kids }) => (
            <div key={room.id} className="mb-[22px]">
              <div className="mb-[14px] flex items-center gap-3">
                <span className="text-[12.5px] font-extrabold uppercase tracking-[0.8px] text-[#3F362E]">
                  Sala {room.name}
                </span>
                <span className="text-[13px] text-[#A89A8B]">
                  {kids.length} {kids.length === 1 ? "niño" : "niños"}
                </span>
                <span className="h-px flex-1 bg-[#E7DAC8]" />
              </div>

              <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
                {kids.map((child) => (
                  <ChildCard key={child.id} child={child} roomName={room.name} />
                ))}
              </div>
            </div>
          ))}

          {visibleCount === 0 && (
            <div className="mt-8 text-center text-sm font-semibold text-[#A89A8B]">
              No se encontraron niños con ese nombre.
            </div>
          )}
        </div>
      </main>

      {isAddModalOpen && <ChildFormModal onClose={() => setIsAddModalOpen(false)} rooms={rooms} />}
    </>
  );
}
