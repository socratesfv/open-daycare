import type { ReactNode } from "react";
import MobileMenu from "./MobileMenu";
import { getCurrentUser } from "@/utils/supabase/user";
import { currentUser } from "@/data/mock/posts";

interface AppLayoutProps {
  activeItem?: string;
  children: ReactNode;
}

export default async function AppLayout({ activeItem, children }: AppLayoutProps) {
  const user = (await getCurrentUser()) ?? currentUser;

  return (
    <MobileMenu user={user} activeItem={activeItem}>
      {children}
    </MobileMenu>
  );
}
