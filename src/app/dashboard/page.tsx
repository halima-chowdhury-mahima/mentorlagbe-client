
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { GraduationCap, LoaderCircle } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/login");
      return;
    }

    const role = session.user.role;

    if (role === "student") {
      router.replace("/dashboard/student");
    } else if (role === "tutor") {
      router.replace("/dashboard/tutor");
    } else if (role === "admin") {
      router.replace("/dashboard/admin");
    } else {
      router.replace("/");
    }
  }, [session, isPending, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F7F2] px-4">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#18A999] text-white">
          <GraduationCap size={34} />
        </div>

        <LoaderCircle
          size={28}
          className="mx-auto animate-spin text-[#18A999]"
        />

        <h1 className="mt-4 text-xl font-bold text-[#101B35]">
          Loading Dashboard
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Preparing your personalized dashboard...
        </p>
      </div>
    </main>
  );
}
