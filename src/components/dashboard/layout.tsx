
import type { ReactNode } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <DashboardSidebar />

        <section className="min-w-0 rounded-2xl border border-[#101B35]/10 bg-white p-5 shadow-sm sm:p-8">
          {children}
        </section>
      </div>
    </main>
  );
}
