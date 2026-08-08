"use client";

import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import type { User } from "@/data/mock/posts";

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

interface MobileMenuProps {
  user: User;
  children: ReactNode;
}

export default function MobileMenu({ user, children }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F6ECDF]">
      <button
        type="button"
        aria-label="Abrir menú"
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#FFFDF9] text-[#3F362E] shadow-[0_4px_14px_-10px_rgba(120,90,60,.4)] md:hidden"
      >
        <MenuIcon />
      </button>
      <Sidebar user={user} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      {children}
    </div>
  );
}
