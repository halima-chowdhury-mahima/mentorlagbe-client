
"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
  GraduationCap,
  FileText,
  Bookmark,
  Search,
  ArrowRight,
  LoaderCircle,
  UserRound,
} from "lucide-react";

const dashboardItems = [
  {
    title: "My Applications",
    description: "Track your tuition applications and their status.",
    href: "/dashboard/student/applications",
    icon: FileText,
  },
  {
    title: "Saved Tuitions",
    description: "View the tuition opportunities you have bookmarked.",
    href: "/dashboard/student/saved",
    icon: Bookmark,
  },
  {
  title: "My Profile",
  description: "View and update your personal and academic information.",
  href: "/dashboard/student/profile",
  icon: UserRound,
},
  {
    title: "Browse Tuitions",
    description: "Discover tuition opportunities that match your needs.",
    href: "/tuitions",
    icon: Search,
  },
];

export default function StudentDashboardPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F7F2]">
        <LoaderCircle className="animate-spin text-[#18A999]" size={32} />
      </main>
    );
  }

  const user = session?.user;

  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#18A999]">
            Student Portal
          </p>

          <h1 className="text-3xl font-extrabold text-[#101B35] sm:text-4xl">
            Welcome back, {user?.name || "Student"}!
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Manage your tuition applications, explore new opportunities,
            and take the next step in your learning journey.
          </p>
        </div>

        <section className="mb-8 overflow-hidden rounded-3xl bg-[#101B35] p-7 text-white sm:p-10">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <GraduationCap size={27} className="text-[#18A999]" />
              </div>

              <h2 className="text-2xl font-bold sm:text-3xl">
                Find the right tutor for you
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-gray-300">
                Explore verified tuition opportunities and connect with
                qualified tutors.
              </p>

              <Link
                href="/tuitions"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#18A999] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#138d80]"
              >
                Explore Tuitions
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="hidden h-32 w-32 items-center justify-center rounded-full border border-white/15 bg-white/5 sm:flex">
              <GraduationCap size={65} className="text-[#18A999]" />
            </div>
          </div>
        </section>

        <div className="mb-5">
          <h2 className="text-xl font-bold text-[#101B35]">
            Your Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Everything you need to manage your learning journey.
          </p>
        </div>

        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {dashboardItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#18A999]/50 hover:shadow-lg"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#18A999]/10 text-[#18A999]">
                  <Icon size={25} />
                </div>

                <h3 className="text-lg font-bold text-[#101B35]">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {item.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#18A999]">
                  Open section
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </Link>
            );
          })}
        </section>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <UserRound className="text-[#18A999]" size={22} />
            <h2 className="font-bold text-[#101B35]">Account Information</h2>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Full Name
              </p>
              <p className="mt-1 font-semibold text-[#101B35]">
                {user?.name || "Not available"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Email Address
              </p>
              <p className="mt-1 break-all font-semibold text-[#101B35]">
                {user?.email || "Not available"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Account Role
              </p>
              <p className="mt-1 font-semibold capitalize text-[#101B35]">
                {user?.role || "Student"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Membership Plan
              </p>
              <p className="mt-1 font-semibold capitalize text-[#101B35]">
                {user?.plan || "Free"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
