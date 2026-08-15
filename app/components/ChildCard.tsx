import Link from "next/link";
import type { ChildRow } from "@/utils/supabase/children";
import { getInitials, getAvatarColor, calculateAge, translateAllergy } from "@/utils/child-display";

interface ChildCardProps {
  child: ChildRow;
  roomName: string;
}

function allergyBadge(child: ChildRow): string | null {
  if (!child.allergy_tags || child.allergy_tags.length === 0) return null;
  return translateAllergy(child.allergy_tags[0]).toUpperCase();
}

export default function ChildCard({ child, roomName }: ChildCardProps) {
  const badge = allergyBadge(child);
  const initials = getInitials(child.full_name);
  const color = getAvatarColor(child.full_name);
  const age = calculateAge(child.birth_date);

  return (
    <Link
      href={`/ninos/${child.id}`}
      className="kid flex items-center gap-[14px] rounded-[18px] border border-[#ECE0D0] bg-[#FFFDF9] px-4 py-4 shadow-[0_4px_14px_-12px_rgba(120,90,60,.5)]"
    >
      <div
        className="flex h-12 w-12 flex-none items-center justify-center rounded-full font-display text-[19px] font-semibold text-white"
        style={{ backgroundColor: `#${color}` }}
      >
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-display text-base font-semibold text-[#3F362E]">{child.full_name}</div>
        <div className="truncate text-[13px] text-[#A89A8B]">
          {age} años · {roomName}
        </div>
      </div>
      {badge ? (
        <span className="flex-none rounded-full bg-[#FBD8CC] px-[9px] py-[5px] text-[11px] font-extrabold text-[#D9684A]">
          {badge}
        </span>
      ) : (
        <svg
          className="flex-none"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#CBB89F"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      )}
    </Link>
  );
}
