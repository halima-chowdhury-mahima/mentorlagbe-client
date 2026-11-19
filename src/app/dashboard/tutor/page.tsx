
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  useSession,
  type MentorLagbeUser,
} from "@/lib/auth-client";
import {
  BookOpen,
  PlusCircle,
  Users,
  LayoutDashboard,
  ArrowRight,
  GraduationCap,
  Loader2,
} from "lucide-react";

export default function TutorDashboard() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const currentUser = session?.user as MentorLagbeUser | undefined;

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/login");
      return;
    }

    if (currentUser?.role !== "tutor") {
      router.replace("/dashboard");
    }
  }, [session, isPending, currentUser, router]);

  if (isPending || !session || currentUser?.role !== "tutor") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F7F2]">
        <div className="text-center">
          <Loader2 className="mx-auto h-9 w-9 animate-spin text-[#18A999]" />
          <p className="mt-3 text-sm text-gray-500">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  const actions = [
    {
      title: "Post New Tuition",
      description: "Create a new tuition opportunity and reach students.",
      href: "/dashboard/tutor/post-tuition",
      icon: PlusCircle,
    },
    {
      title: "My Tuitions",
      description: "View, edit and manage your tuition posts.",
      href: "/dashboard/tutor/my-tuitions",
      icon: BookOpen,
    },
    {
      title: "View Applicants",
      description: "Check students who applied to your tuition posts.",
      href: "/dashboard/tutor/applicants",
      icon: Users,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 rounded-3xl bg-[#101B35] p-7 text-white sm:p-10">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#18A999]">
            <GraduationCap size={30} />
          </div>

          <p className="text-sm font-medium text-[#18A999]">
            TUTOR PORTAL
          </p>

          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Welcome back, {currentUser.name}!
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
            Manage your tuition posts, connect with students, and
            grow your teaching journey with MentorLagbe.
          </p>

          <Link
            href="/dashboard/tutor/post-tuition"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#18A999] px-5 py-3 font-bold text-white transition hover:bg-[#128c80]"
          >
            Post a Tuition
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <LayoutDashboard className="text-[#18A999]" />
          <h2 className="text-xl font-bold text-[#101B35]">
            Manage Your Teaching
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#18A999] hover:shadow-md"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#18A999]/10 text-[#18A999]">
                  <Icon size={24} />
                </div>

                <h3 className="text-lg font-bold text-[#101B35]">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {action.description}
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#18A999]">
                  Open section
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-bold text-[#101B35]">
            Account Information
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-gray-400">Name</p>
              <p className="mt-1 font-semibold text-[#101B35]">
                {currentUser.name}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Email</p>
              <p className="mt-1 break-all font-semibold text-[#101B35]">
                {currentUser.email}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Plan</p>
              <p className="mt-1 font-semibold capitalize text-[#101B35]">
                {currentUser.plan}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
