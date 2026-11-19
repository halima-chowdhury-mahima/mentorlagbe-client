
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Search,
  Bookmark,
  MapPin,
  Wallet,
  BookOpen,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  GraduationCap,
} from "lucide-react";

import {
  useSession,
  type MentorLagbeUser,
} from "@/lib/auth-client";

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
  status: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data: Tuition[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function BrowseTuitionsPage() {
  const { data: session, isPending: sessionLoading } = useSession();

  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [medium, setMedium] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const currentUser = session?.user as MentorLagbeUser | undefined;

const isStudent = currentUser?.role === "student";

  const fetchTuitions = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: "9",
      });

      if (search.trim()) params.set("search", search.trim());
      if (subject) params.set("subject", subject);
      if (classLevel) params.set("classLevel", classLevel);
      if (medium) params.set("medium", medium);

      const response = await fetch(
        `${API_URL}/api/tuitions?${params.toString()}`
      );

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load tuitions");
      }

      setTuitions(result.data || []);
      setTotal(result.pagination?.total || 0);
      setTotalPages(result.pagination?.totalPages || 1);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load tuitions"
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, subject, classLevel, medium]);

  const fetchSavedIds = useCallback(async () => {
    if (!isStudent) {
      setSavedIds([]);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/bookmarks`, {
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load bookmarks");
      }

      setSavedIds(
        (result.data || []).map((tuition: Tuition) => tuition._id)
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not load saved tuitions"
      );
    }
  }, [isStudent]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchTuitions();
    }, 300);

    return () => window.clearTimeout(timer);
  }, [fetchTuitions]);

 useEffect(() => {
  if (sessionLoading) return;

  let isActive = true;

  const loadSavedIds = async () => {
    if (!isStudent) return;

    try {
      const response = await fetch(`${API_URL}/api/bookmarks`, {
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load bookmarks");
      }

      if (isActive) {
        setSavedIds(
          (result.data || []).map((tuition: Tuition) => tuition._id)
        );
      }
    } catch (error) {
      if (isActive) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not load saved tuitions"
        );
      }
    }
  };

  void loadSavedIds();

  return () => {
    isActive = false;
  };
}, [sessionLoading, isStudent]);

  const toggleBookmark = async (tuitionId: string) => {
    if (!session) {
      toast.error("Please login to save a tuition");
      return;
    }

    if (!isStudent) {
      toast.error("Only students can save tuitions");
      return;
    }

    const isSaved = savedIds.includes(tuitionId);

    try {
      setSavingId(tuitionId);

      const response = await fetch(
        `${API_URL}/api/bookmarks/${tuitionId}`,
        {
          method: isSaved ? "DELETE" : "POST",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Bookmark action failed");
      }

      setSavedIds((previous) =>
        isSaved
          ? previous.filter((id) => id !== tuitionId)
          : [...previous, tuitionId]
      );

      toast.success(
        isSaved
          ? "Removed from saved tuitions"
          : "Tuition saved successfully"
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSavingId(null);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setSubject("");
    setClassLevel("");
    setMedium("");
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-[#F8F7F2]">
      <section className="bg-[#101B35] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#18A999]">
            <GraduationCap size={20} />
            MENTORLAGBE TUITION BOARD
          </div>

          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">
            Find the Perfect Tuition Opportunity
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">
            Explore tuition opportunities, connect with students,
            and discover the right learning match for your journey.
          </p>

          <div className="mt-8 flex max-w-2xl items-center gap-3 rounded-2xl bg-white p-2">
            <Search className="ml-3 shrink-0 text-gray-400" size={22} />

            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search by title, subject or location..."
              className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-[#101B35] outline-none placeholder:text-gray-400"
            />

            <button
              onClick={() => void fetchTuitions()}
              className="rounded-xl bg-[#18A999] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#138d80]"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-[#101B35]">
                Available Tuitions
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {total} tuition opportunities found
              </p>
            </div>

            <Link
              href="/dashboard/student/saved"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#18A999] hover:underline"
            >
              <Bookmark size={17} />
              My Saved Tuitions
            </Link>
          </div>

          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2 font-bold text-[#101B35]">
              <SlidersHorizontal size={19} className="text-[#18A999]" />
              Filter Tuitions
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <select
                value={subject}
                onChange={(event) => {
                  setSubject(event.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#18A999]"
              >
                <option value="">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="English">English</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="ICT">ICT</option>
                <option value="Accounting">Accounting</option>
              </select>

              <select
                value={classLevel}
                onChange={(event) => {
                  setClassLevel(event.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#18A999]"
              >
                <option value="">All Classes</option>
                <option value="Class 1">Class 1</option>
                <option value="Class 2">Class 2</option>
                <option value="Class 3">Class 3</option>
                <option value="Class 4">Class 4</option>
                <option value="Class 5">Class 5</option>
                <option value="Class 6">Class 6</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 8">Class 8</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="HSC">HSC</option>
                <option value="University">University</option>
              </select>

              <select
                value={medium}
                onChange={(event) => {
                  setMedium(event.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#18A999]"
              >
                <option value="">All Mediums</option>
                <option value="Bangla Medium">Bangla Medium</option>
                <option value="English Version">English Version</option>
                <option value="English Medium">English Medium</option>
              </select>

              <button
                onClick={resetFilters}
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:border-[#18A999] hover:text-[#18A999]"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <LoaderCircle
                size={36}
                className="animate-spin text-[#18A999]"
              />
            </div>
          ) : tuitions.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center">
              <BookOpen
                size={42}
                className="mx-auto mb-4 text-[#18A999]"
              />

              <h3 className="text-xl font-bold text-[#101B35]">
                No Tuitions Found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Try changing your search or filters.
              </p>

              <button
                onClick={resetFilters}
                className="mt-5 rounded-xl bg-[#18A999] px-5 py-3 text-sm font-bold text-white"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tuitions.map((tuition) => {
                const isSaved = savedIds.includes(tuition._id);
                const isSaving = savingId === tuition._id;

                return (
                  <article
                    key={tuition._id}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    {tuition.image ? (
                      <div className="h-48 overflow-hidden bg-gray-100">
                        <img
                          src={tuition.image}
                          alt={tuition.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="flex h-40 items-center justify-center bg-[#101B35]">
                        <GraduationCap
                          size={55}
                          className="text-[#18A999]"
                        />
                      </div>
                    )}

                    <div className="p-5">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <span className="rounded-full bg-[#18A999]/10 px-3 py-1 text-xs font-bold text-[#138d80]">
                          {tuition.subject}
                        </span>

                        {isStudent && (
                          <button
                            onClick={() => void toggleBookmark(tuition._id)}
                            disabled={isSaving}
                            aria-label={
                              isSaved
                                ? "Remove bookmark"
                                : "Save tuition"
                            }
                            title={
                              isSaved
                                ? "Remove bookmark"
                                : "Save tuition"
                            }
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition disabled:opacity-50 ${
                              isSaved
                                ? "bg-[#18A999] text-white"
                                : "bg-gray-100 text-gray-500 hover:bg-[#18A999]/10 hover:text-[#18A999]"
                            }`}
                          >
                            {isSaving ? (
                              <LoaderCircle
                                size={19}
                                className="animate-spin"
                              />
                            ) : (
                              <Bookmark
                                size={19}
                                fill={isSaved ? "currentColor" : "none"}
                              />
                            )}
                          </button>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-[#101B35]">
                        {tuition.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                        {tuition.description}
                      </p>

                      <div className="mt-5 space-y-3 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <BookOpen
                            size={16}
                            className="text-[#18A999]"
                          />
                          {tuition.classLevel} · {tuition.medium}
                        </p>

                        <p className="flex items-center gap-2">
                          <MapPin
                            size={16}
                            className="text-[#18A999]"
                          />
                          {tuition.location}
                        </p>

                        <p className="flex items-center gap-2">
                          <Wallet
                            size={16}
                            className="text-[#18A999]"
                          />
                          ৳{tuition.salary?.toLocaleString() || 0} / month
                        </p>
                      </div>

                      <div className="mt-6 border-t border-gray-100 pt-5">
                        <Link
                          href={`/tuitions/${tuition._id}`}
                          className="flex w-full items-center justify-center rounded-xl bg-[#101B35] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1b2d52]"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                disabled={page === 1}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#101B35] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={17} />
                Previous
              </button>

              <span className="rounded-xl bg-[#101B35] px-5 py-3 text-sm font-bold text-white">
                {page} / {totalPages}
              </span>

              <button
                onClick={() =>
                  setPage((previous) => Math.min(totalPages, previous + 1))
                }
                disabled={page === totalPages}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#101B35] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={17} />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
