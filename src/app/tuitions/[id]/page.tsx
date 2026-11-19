
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  GraduationCap,
  MapPin,
  Bookmark,
  Loader2,
  Send,
  UserRound,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  useSession,
  type MentorLagbeUser,
} from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Tuition {
  _id: string;
  tutorId: string;
  tutorName: string;
  title: string;
  subject: string;
  classLevel: string;
  medium: string;
  location: string;
  salary: number;
  schedule: string;
  description: string;
  image?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

function TuitionDetailsContent() {
  const params = useParams();
  const router = useRouter();

  const { data: session, isPending: sessionLoading } = useSession();

  const tuitionId = params.id as string;
  const currentUser = session?.user as MentorLagbeUser | undefined;
  const isStudent = currentUser?.role === "student";

  const [tuition, setTuition] = useState<Tuition | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [applied, setApplied] = useState(false);

  // Fetch tuition details
  useEffect(() => {
    let active = true;

    const loadTuition = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/api/tuitions/${tuitionId}`,
          { cache: "no-store" }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Tuition not found");
        }

        if (active) {
          setTuition(result.data);
        }
      } catch (error) {
        if (active) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load tuition"
          );
          setTuition(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (tuitionId) {
      void loadTuition();
    }

    return () => {
      active = false;
    };
  }, [tuitionId]);

  // Fetch student's saved and applied status
  useEffect(() => {
    if (sessionLoading || !isStudent) return;

    let active = true;

    const loadStudentData = async () => {
      try {
        const [bookmarkResponse, applicationResponse] =
          await Promise.all([
            fetch(`${API_URL}/api/bookmarks`, {
              credentials: "include",
            }),
            fetch(`${API_URL}/api/applications/my-applications`, {
              credentials: "include",
            }),
          ]);

        const bookmarkResult = await bookmarkResponse.json();
        const applicationResult = await applicationResponse.json();

        if (!active) return;

        if (bookmarkResponse.ok && bookmarkResult.success) {
          const savedItems = bookmarkResult.data || [];

          setSaved(
            savedItems.some(
              (item: Tuition) => item._id === tuitionId
            )
          );
        }

        if (applicationResponse.ok && applicationResult.success) {
          const applications = applicationResult.data || [];

          setApplied(
            applications.some(
              (item: { tuitionId: string }) =>
                item.tuitionId === tuitionId
            )
          );
        }
      } catch {
        // Student data can be refreshed when needed.
      }
    };

    void loadStudentData();

    return () => {
      active = false;
    };
  }, [sessionLoading, isStudent, tuitionId]);

  // Bookmark tuition
  const handleBookmark = async () => {
    if (!session) {
      toast.error("Please login to save this tuition.");
      router.push("/login");
      return;
    }

    if (!isStudent) {
      toast.error("Only students can save tuitions.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/bookmarks/${tuitionId}`,
        {
          method: saved ? "DELETE" : "POST",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to update bookmark"
        );
      }

      setSaved(!saved);

      toast.success(
        saved
          ? "Removed from saved tuitions"
          : "Tuition saved!"
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  // Apply for tuition
  const handleApply = async () => {
    if (!session) {
      toast.error("Please login as a student to apply.");
      router.push("/login");
      return;
    }

    if (!isStudent) {
      toast.error("Only students can apply for tuition.");
      return;
    }

    if (applied) {
      toast.error("You have already applied for this tuition.");
      return;
    }

    try {
      setApplying(true);

      const response = await fetch(
        `${API_URL}/api/applications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ tuitionId }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Application failed");
      }

      setApplied(true);
      toast.success("Application submitted successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to apply"
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading || sessionLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F7F2]">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#18A999]" />
          <p className="mt-4 text-sm font-medium text-[#101B35]">
            Loading tuition details...
          </p>
        </div>
      </main>
    );
  }

  if (!tuition) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#F8F7F2] px-5 text-center">
        <BookOpen className="mb-5 h-14 w-14 text-[#18A999]" />

        <h1 className="text-2xl font-bold text-[#101B35]">
          Tuition Not Found
        </h1>

        <p className="mt-2 text-gray-500">
          This tuition may have been removed or is no longer available.
        </p>

        <Link
          href="/tuitions"
          className="mt-6 rounded-xl bg-[#101B35] px-6 py-3 font-semibold text-white"
        >
          Browse Tuitions
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/tuitions"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#101B35] transition hover:text-[#18A999]"
        >
          <ArrowLeft size={18} />
          Back to Browse Tuitions
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          <section>
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              {tuition.image ? (
                <img
                  src={tuition.image}
                  alt={tuition.title}
                  className="h-64 w-full object-cover"
                />
              ) : (
                <div className="flex h-64 items-center justify-center bg-gradient-to-br from-[#101B35] to-[#1d4560]">
                  <GraduationCap className="h-24 w-24 text-white/80" />
                </div>
              )}

              <div className="p-6 sm:p-9">
                <div className="mb-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#18A999]/10 px-4 py-1.5 text-xs font-bold text-[#118779]">
                    {tuition.subject}
                  </span>

                  <span className="rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700">
                    {tuition.status}
                  </span>
                </div>

                <h1 className="text-3xl font-extrabold leading-tight text-[#101B35] sm:text-4xl">
                  {tuition.title}
                </h1>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <InfoItem
                    icon={<GraduationCap />}
                    label="Class / Level"
                    value={tuition.classLevel}
                  />

                  <InfoItem
                    icon={<BookOpen />}
                    label="Subject"
                    value={tuition.subject}
                  />

                  <InfoItem
                    icon={<UserRound />}
                    label="Medium"
                    value={tuition.medium}
                  />

                  <InfoItem
                    icon={<MapPin />}
                    label="Location"
                    value={tuition.location}
                  />

                  <InfoItem
                    icon={<CalendarDays />}
                    label="Schedule"
                    value={tuition.schedule}
                  />

                  <InfoItem
                    icon={<Wallet />}
                    label="Monthly Salary"
                    value={`৳${Number(tuition.salary).toLocaleString("en-BD")}`}
                  />
                </div>

                <div className="my-8 border-t border-gray-100" />

                <h2 className="text-xl font-bold text-[#101B35]">
                  Tuition Description
                </h2>

                <p className="mt-4 whitespace-pre-line text-sm leading-8 text-gray-600">
                  {tuition.description}
                </p>

                <div className="mt-8 rounded-2xl bg-[#F8F7F2] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#18A999]/10 text-[#18A999]">
                      <UserRound size={24} />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Posted by Tutor
                      </p>

                      <p className="font-bold text-[#101B35]">
                        {tuition.tutorName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside>
            <div className="sticky top-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Monthly Tuition Fee
              </p>

              <div className="mt-2 flex items-center gap-1 text-3xl font-extrabold text-[#101B35]">
                <span>৳</span>
                {Number(tuition.salary).toLocaleString("en-BD")}
              </div>

              <div className="my-6 border-t border-gray-100" />

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="h-5 w-5 text-[#18A999]" />
                  Flexible learning schedule
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="h-5 w-5 text-[#18A999]" />
                  {tuition.location}
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <CheckCircle2 className="h-5 w-5 text-[#18A999]" />
                  Verified tuition listing
                </div>
              </div>

              <button
                onClick={handleApply}
                disabled={applying || applied || !isStudent}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#18A999] px-5 py-4 font-bold text-white transition hover:bg-[#128c80] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {applying ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : applied ? (
                  <CheckCircle2 size={19} />
                ) : (
                  <Send size={18} />
                )}

                {applied
                  ? "Already Applied"
                  : applying
                    ? "Submitting..."
                    : !session
                      ? "Login to Apply"
                      : !isStudent
                        ? "Students Only"
                        : "Apply for Tuition"}
              </button>

              <button
                onClick={handleBookmark}
                disabled={saving || !isStudent}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#101B35]/15 px-5 py-3.5 font-bold text-[#101B35] transition hover:bg-[#F8F7F2] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Bookmark
                    size={18}
                    fill={saved ? "currentColor" : "none"}
                  />
                )}

                {saved ? "Saved Tuition" : "Save Tuition"}
              </button>

              <p className="mt-5 text-center text-xs leading-6 text-gray-400">
                Apply to connect with the tutor. Your application will be
                available in your student dashboard.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-[#18A999]">{icon}</div>

      <div>
        <p className="text-xs font-medium text-gray-400">
          {label}
        </p>

        <p className="mt-1 font-semibold text-[#101B35]">
          {value || "Not specified"}
        </p>
      </div>
    </div>
  );
}

// Suspense wrapper fixes Next.js 16 useParams prerendering error
export default function TuitionDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#F8F7F2]">
          <div className="text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#18A999]" />
            <p className="mt-4 text-sm font-medium text-[#101B35]">
              Loading tuition details...
            </p>
          </div>
        </main>
      }
    >
      <TuitionDetailsContent />
    </Suspense>
  );
}
