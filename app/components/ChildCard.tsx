import Link from "next/link";
import type { Child } from "@/data/mock/children";

interface ChildCardProps {
  child: Child;
}

function parentCountLabel(parents: Child["parents"]): string {
  if (parents.length === 0) return "sin padres vinculados";
  if (parents.length === 1) return "1 padre vinculado";
  return `${parents.length} padres vinculados`;
}

function allergyBadge(child: Child): string | null {
  if (!child.allergies) return null;
  return child.allergies.split(" ")[0].replace(/[:;.,!]/g, "").toUpperCase();
}

export default function ChildCard({ child }: ChildCardProps) {
  const hasActiveParent = child.parents.some((parent) => parent.status === "active");
  const badge = allergyBadge(child);

  return (
    <Link
      href={`/ninos/${child.id}`}
      className="kid flex items-center gap-[14px] rounded-[18px] border border-[#ECE0D0] bg-[#FFFDF9] px-4 py-4 shadow-[0_4px_14px_-12px_rgba(120,90,60,.5)]"
    >
      <div
        className="flex h-12 w-12 flex-none items-center justify-center rounded-full font-display text-[19px] font-semibold text-white"
        style={{ backgroundColor: `#${child.color}` }}
      >
        {child.initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-display text-base font-semibold text-[#3F362E]">{child.name}</div>
        <div className="truncate text-[13px] text-[#A89A8B]">
          {child.age} años · {parentCountLabel(child.parents)}
        </div>
      </div>
      {badge && !hasActiveParent ? (
        <span className="flex-none rounded-full bg-[#F9D2DE] px-[9px] py-[5px] text-[11px] font-extrabold text-[#C56486]">
          VINCULAR
        </span>
      ) : badge ? (
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
