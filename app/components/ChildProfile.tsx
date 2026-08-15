"use client";

import { useState } from "react";
import type { ChildRow, Room } from "@/utils/supabase/children";
import { getInitials, getAvatarColor, calculateAge, formatDate, translateAllergy } from "@/utils/child-display";
import ChildFormModal from "./ChildFormModal";

interface ChildProfileProps {
  child: ChildRow;
  rooms: Room[];
}

export default function ChildProfile({ child, rooms }: ChildProfileProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const initials = getInitials(child.full_name);
  const color = getAvatarColor(child.full_name);
  const age = calculateAge(child.birth_date);
  const roomName = rooms.find((room) => room.id === child.room_id)?.name ?? "—";
  const allergyLabels = child.allergy_tags.map(translateAllergy).join(", ");

  return (
    <div className="flex flex-wrap items-start gap-[26px]">
      <div className="flex min-w-[300px] flex-1 flex-col gap-[18px]">
        <div className="flex items-center gap-[18px]">
          <div
            className="flex h-[84px] w-[84px] flex-none items-center justify-center rounded-full font-display text-[34px] font-semibold text-white"
            style={{ backgroundColor: `#${color}` }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[28px] font-semibold text-[#3F362E]">{child.full_name}</h1>
            <p className="mt-[3px] text-[15px] text-[#94887B]">
              {age} años · Sala {roomName}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="flex-none rounded-[12px] border-[1.5px] border-[#ECE0D0] bg-[#FFFDF9] px-4 py-[9px] text-sm font-bold text-[#6E6359]"
          >
            Editar
          </button>
        </div>

        {allergyLabels && (
          <div className="flex gap-[14px] rounded-[16px] bg-[#FBDAD6] px-[18px] py-4">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-[11px] bg-[#F4A8A0]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
                <path d="M12 9v4M12 17h.01" />
              </svg>
            </div>
            <div>
              <div className="mb-0.5 text-[15px] font-extrabold text-[#C5413A]">Alergias y notas</div>
              <div className="text-[14.5px] leading-[1.5] text-[#B25249]">
                {allergyLabels}
                {child.medical_notes ? ` · ${child.medical_notes}` : ""}
              </div>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-[16px] border border-[#ECE0D0] bg-[#FFFDF9]">
          <div className="flex justify-between border-b border-[#F0E6D8] px-[18px] py-[15px]">
            <span className="text-[14.5px] text-[#94887B]">Fecha de nacimiento</span>
            <span className="text-[14.5px] font-extrabold text-[#3F362E]">
              {formatDate(child.birth_date)}
            </span>
          </div>
          <div className="flex justify-between border-b border-[#F0E6D8] px-[18px] py-[15px]">
            <span className="text-[14.5px] text-[#94887B]">Sala</span>
            <span className="text-[14.5px] font-extrabold text-[#3F362E]">{roomName}</span>
          </div>
          <div className="flex justify-between border-b border-[#F0E6D8] px-[18px] py-[15px]">
            <span className="text-[14.5px] text-[#94887B]">Ingreso</span>
            <span className="text-[14.5px] font-extrabold text-[#3F362E]">
              {formatDate(child.enrolled_at)}
            </span>
          </div>
          <div className="flex justify-between px-[18px] py-[15px]">
            <span className="text-[14.5px] text-[#94887B]">Consentimiento de fotos</span>
            <span className="text-[14.5px] font-extrabold text-[#3F362E]">
              {child.photo_consent ? "Sí" : "No"}
            </span>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <ChildFormModal
          onClose={() => setIsEditModalOpen(false)}
          rooms={rooms}
          child={child}
        />
      )}
    </div>
  );
}
