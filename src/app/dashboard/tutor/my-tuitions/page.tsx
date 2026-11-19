
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Plus,
  MapPin,
  Wallet,
  Loader2,
  Trash2,
  CalendarDays,
  RefreshCw,
  AlertCircle,
  Users,
  Pencil,
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

export default function MyTuitionsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const currentUser = session?.user as MentorLagbeUser | undefined;

  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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

  useEffect(() => {
    if (isPending || !session || currentUser?.role !== "tutor") return;

    let active = true;

    const loadTuitions = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/tutor/my-tuitions`,
          { credentials: "include", cache: "no-store" }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load your tuitions.");
        }

        if (active) {
          setTuitions(result.data || []);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Something went wrong."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadTuitions();

    return () => {
      active = false;
    };
  }, [isPending, session, currentUser]);

  const refreshTuitions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/tutor/my-tuitions`, {
        credentials: "include",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to refresh tuitions.");
      }

      setTuitions(result.data || []);
      toast.success("Tuition list refreshed.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to refresh.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);

      const response = await fetch(
        `${API_URL}/api/tutor/my-tuitions/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to delete tuition.");
      }

      setTuitions((previous) =>
        previous.filter((tuition) => tuition._id !== id)
      );

      setConfirmDeleteId(null);
      toast.success("Tuition deleted successfully.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to delete tuition."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (isPending || !session || currentUser?.role !== "tutor") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F7F2]">
        <Loader2 className="h-9 w-9 animate-spin text-[#18A999]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard/tutor"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#101B35] hover:text-[#18A999]"
        >
          <ArrowLeft size={18} />
          Back to Tutor Dashboard
        </Link>

        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold tracking-wider text-[#18A999]">
              TUTOR PORTAL
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-[#101B35]">
              My Tuitions
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage your tuition posts and monitor their approval status.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={refreshTuitions}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#101B35] hover:border-[#18A999] disabled:opacity-50"
            >
              <RefreshCw size={17} />
              Refresh
            </button>

            <Link
              href="/dashboard/tutor/post-tuition"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#18A999] px-5 py-3 text-sm font-bold text-white hover:bg-[#128c80]"
            >
              <Plus size={18} />
              Post New Tuition
            </Link>
          </div>
        </div>

        <div className="mb-7 grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total Tuitions",
              value: tuitions.length,
              color: "text-[#101B35]",
            },
            {
              label: "Approved",
              value: tuitions.filter((item) => item.status === "approved").length,
              color: "text-green-600",
            },
            {
              label: "Pending Review",
              value: tuitions.filter((item) => item.status === "pending").length,
              color: "text-amber-600",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-gray-200 bg-white p-5"
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className={`mt-2 text-3xl font-extrabold ${item.color}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center">
            <Loader2 className="mx-auto h-9 w-9 animate-spin text-[#18A999]" />
            <p className="mt-4 text-sm text-gray-500">
              Loading your tuitions...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
            <p className="mt-4 font-semibold text-[#101B35]">
              Unable to load your tuitions
            </p>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <button
              onClick={refreshTuitions}
              className="mt-5 rounded-xl bg-[#101B35] px-5 py-3 text-sm font-bold text-white"
            >
              Try Again
            </button>
          </div>
        ) : tuitions.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-[#18A999]" />
            <h2 className="mt-5 text-xl font-bold text-[#101B35]">
              No Tuitions Yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              You have not posted any tuition opportunities yet. Create your
              first post to connect with students.
            </p>
            <Link
              href="/dashboard/tutor/post-tuition"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#18A999] px-6 py-3 font-bold text-white hover:bg-[#128c80]"
            >
              <Plus size={18} />
              Post Your First Tuition
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {tuitions.map((tuition) => (
              <article
                key={tuition._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="grid md:grid-cols-[220px_1fr]">
                  <div className="h-48 bg-[#101B35] md:h-full">
                    {tuition.image ? (
                      <img
                        src={tuition.image}
                        alt={tuition.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full min-h-48 items-center justify-center">
                        <BookOpen className="h-14 w-14 text-white/70" />
                      </div>
                    )}
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-full bg-[#18A999]/10 px-3 py-1 text-xs font-bold text-[#128c80]">
                        {tuition.subject}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                          tuition.status === "approved"
                            ? "bg-green-50 text-green-700"
                            : tuition.status === "rejected"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {tuition.status}
                      </span>
                    </div>

                    <h2 className="mt-4 text-xl font-bold text-[#101B35]">
                      {tuition.title}
                    </h2>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm text-gray-500">
                      <span className="flex items-center gap-2">
                        <BookOpen size={16} className="text-[#18A999]" />
                        {tuition.classLevel}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#18A999]" />
                        {tuition.location}
                      </span>
                      <span className="flex items-center gap-2">
                        <Wallet size={16} className="text-[#18A999]" />
                        ৳{Number(tuition.salary).toLocaleString("en-BD")}
                      </span>
                      <span className="flex items-center gap-2">
                        <CalendarDays size={16} className="text-[#18A999]" />
                        {tuition.schedule}
                      </span>
                    </div>

                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-500">
                      {tuition.description}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                      <span className="text-xs text-gray-400">
                        Posted:{" "}
                        {tuition.createdAt
                          ? new Date(tuition.createdAt).toLocaleDateString()
                          : "Recently"}
                      </span>

                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/dashboard/tutor/applicants/${tuition._id}`}
                          className="inline-flex items-center gap-2 rounded-lg bg-[#101B35] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#20345c]"
                        >
                          <Users size={16} />
                          View Applicants
                        </Link>
<Link
  href={`/dashboard/tutor/edit-tuition/${tuition._id}`}
  className="inline-flex items-center gap-2 rounded-lg border border-[#18A999]/30 bg-[#18A999]/10 px-4 py-2 text-sm font-semibold text-[#128c80] transition hover:bg-[#18A999]/20"
>
  <Pencil size={16} />
  Edit
</Link>
                        <button
                          onClick={() => setConfirmDeleteId(tuition._id)}
                          disabled={deletingId === tuition._id}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-100 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === tuition._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>

                    {confirmDeleteId === tuition._id && (
                      <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">
                        <p className="text-sm font-semibold text-red-800">
                          Are you sure you want to delete this tuition?
                        </p>
                        <p className="mt-1 text-xs text-red-600">
                          This action cannot be undone.
                        </p>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => handleDelete(tuition._id)}
                            disabled={deletingId === tuition._id}
                            className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
                          >
                            {deletingId === tuition._id
                              ? "Deleting..."
                              : "Yes, Delete"}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
