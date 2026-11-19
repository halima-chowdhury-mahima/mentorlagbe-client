
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Bookmark,
  MapPin,
  Wallet,
  BookOpen,
  Trash2,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

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
}

export default function SavedTuitionsPage() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchSavedTuitions = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookmarks`,
        { credentials: "include" }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load saved tuitions");
      }

      setTuitions(result.data || []);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
  let isActive = true;

  const loadSavedTuitions = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookmarks`,
        { credentials: "include" }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load saved tuitions"
        );
      }

      if (isActive) {
        setTuitions(result.data || []);
      }
    } catch (error) {
      if (isActive) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      }
    } finally {
      if (isActive) {
        setLoading(false);
      }
    }
  };

  void loadSavedTuitions();

  return () => {
    isActive = false;
  };
}, []);

  const removeBookmark = async (tuitionId: string) => {
    try {
      setRemovingId(tuitionId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookmarks/${tuitionId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to remove bookmark");
      }

      setTuitions((previous) =>
        previous.filter((tuition) => tuition._id !== tuitionId)
      );

      toast.success("Tuition removed from saved list");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard/student"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#18A999]"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#18A999]">
              Student Portal
            </p>

            <h1 className="text-3xl font-extrabold text-[#101B35]">
              Saved Tuitions
            </h1>

            <p className="mt-2 text-gray-500">
              Keep your favorite tuition opportunities in one place.
            </p>
          </div>

          <button
            onClick={() => void fetchSavedTuitions()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#101B35] transition hover:border-[#18A999] disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <LoaderCircle
              size={32}
              className="animate-spin text-[#18A999]"
            />
          </div>
        ) : tuitions.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#18A999]/10 text-[#18A999]">
              <Bookmark size={32} />
            </div>

            <h2 className="text-xl font-bold text-[#101B35]">
              No Saved Tuitions
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              You have not saved any tuition opportunities yet.
              Browse available tuitions and bookmark the ones you like.
            </p>

            <Link
              href="/tuitions"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#18A999] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#138d80]"
            >
              <BookOpen size={17} />
              Browse Tuitions
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm font-medium text-gray-500">
              {tuitions.length} saved{" "}
              {tuitions.length === 1 ? "tuition" : "tuitions"}
            </p>

            <section className="grid gap-5 md:grid-cols-2">
              {tuitions.map((tuition) => (
                <article
                  key={tuition._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"
                >
                  {tuition.image && (
                    <div className="h-48 overflow-hidden bg-gray-100">
                      <img
                        src={tuition.image}
                        alt={tuition.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-5 sm:p-6">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <span className="rounded-full bg-[#18A999]/10 px-3 py-1 text-xs font-bold text-[#138d80]">
                        {tuition.subject}
                      </span>

                      <button
                        onClick={() => void removeBookmark(tuition._id)}
                        disabled={removingId === tuition._id}
                        aria-label="Remove saved tuition"
                        title="Remove bookmark"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        {removingId === tuition._id ? (
                          <LoaderCircle
                            size={17}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={17} />
                        )}
                      </button>
                    </div>

                    <h2 className="text-xl font-bold text-[#101B35]">
                      {tuition.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                      {tuition.description}
                    </p>

                    <div className="mt-5 space-y-3 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <BookOpen size={16} className="text-[#18A999]" />
                        {tuition.classLevel} · {tuition.medium}
                      </p>

                      <p className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#18A999]" />
                        {tuition.location}
                      </p>

                      <p className="flex items-center gap-2">
                        <Wallet size={16} className="text-[#18A999]" />
                        ৳{tuition.salary?.toLocaleString() || 0} / month
                      </p>
                    </div>

                    <div className="mt-6 border-t border-gray-100 pt-5">
                      <Link
                        href={`/tuitions/${tuition._id}`}
                        className="inline-flex w-full items-center justify-center rounded-xl bg-[#101B35] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1b2d52]"
                      >
                        View Tuition Details
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
