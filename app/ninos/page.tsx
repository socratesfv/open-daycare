import AppLayout from "@/app/components/AppLayout";
import KidsPageClient from "@/app/components/KidsPageClient";

export default function KidsPage() {
  return (
    <AppLayout activeItem="Niños">
      <KidsPageClient />
    </AppLayout>
  );
}
