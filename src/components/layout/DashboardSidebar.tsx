
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserRound,
  BookOpen,
  Bookmark,
  FileText,
  Users,
  CreditCard,
  PlusCircle,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navigation = {
  student: [
    { label: "Overview", href: "/dashboard/student", icon: LayoutDashboard },
    { label: "Applications", href: "/dashboard/student/applications", icon: FileText },
    { label: "Saved Tuitions", href: "/dashboard/student/saved", icon: Bookmark },
    { label: "Profile", href: "/dashboard/student/profile", icon: UserRound },
  ],
  tutor: [
    { label: "Overview", href: "/dashboard/tutor", icon: LayoutDashboard },
    { label: "Post Tuition", href: "/dashboard/tutor/post-tuition", icon: PlusCircle },
    { label: "My Tuitions", href: "/dashboard/tutor/my-tuitions", icon: BookOpen },
    { label: "Profile", href: "/dashboard/tutor/profile", icon: UserRound },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Manage Tuitions", href: "/dashboard/admin/tuitions", icon: GraduationCap },
    { label: "Applications", href: "/dashboard/admin/applications", icon: FileText },
    { label: "Payments", href: "/dashboard/admin/payments", icon: CreditCard },
    { label: "Profile", href: "/dashboard/admin/profile", icon: UserRound },
  ],
};

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { role, isLoading } = useAuth();

  if (isLoading || !role) return null;

  const links = navigation[role as keyof typeof navigation] ?? [];

  return (
    <aside className="w-full rounded-2xl border border-[#101B35]/10 bg-white p-4 shadow-sm lg:sticky lg:top-24 lg:w-64 lg:self-start">
      <h2 className="mb-4 px-3 text-lg font-bold text-[#101B35]">
        Dashboard
      </h2>

      <nav className="space-y-1">
        {links.map(({ label, href, icon: Icon }) => {
          const active =
            pathname === href || (href !== "/dashboard/admin" && pathname.startsWith(`${href}/`));

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                active
                  ? "bg-[#101B35] text-white"
                  : "text-gray-600 hover:bg-[#18A999]/10 hover:text-[#101B35]"
              }`}
            >
              <Icon size={19} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
