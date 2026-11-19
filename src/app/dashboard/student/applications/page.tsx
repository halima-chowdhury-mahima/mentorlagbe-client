
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  FileText,
  LoaderCircle,
  RefreshCw,
  CalendarDays,
  BookOpen,
  MapPin,
  Wallet,
} from "lucide-react";

interface Application {
  _id: string;
  tuitionId: string;
  tuitionTitle?: string;
  subject?: string;
  classLevel?: string;
  medium?: string;
  location?: string;
  salary?: number;
  schedule?: string;
  image?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  tuition?: {
    title?: string;
    subject?: string;
    classLevel?: string;
    medium?: string;
    location?: string;
    salary?: number;
    schedule?: string;
    image?: string;
  } | null;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/applications/my-applications`,
        { credentials: "include" }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load applications");
      }

      setApplications(result.data || []);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    const loadApplications = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/applications/my-applications`,
          { credentials: "include" }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load applications");
        }

        if (isActive) {
          setApplications(result.data || []);
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

    loadApplications();

    return () => {
      isActive = false;
    };
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-amber-100 text-amber-700";
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
              My Applications
            </h1>

            <p className="mt-2 text-gray-500">
              Track the status of your tuition applications.
            </p>
          </div>

          <button
            onClick={fetchApplications}
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
        ) : applications.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#18A999]/10 text-[#18A999]">
              <FileText size={32} />
            </div>

            <h2 className="text-xl font-bold text-[#101B35]">
              No Applications Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              You have not applied for any tuition opportunities yet.
              Explore available tuitions and submit your first application.
            </p>

            <Link
              href="/tuitions"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#18A999] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#138d80]"
            >
              Browse Tuitions
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {applications.map((application) => {
              const tuition = application.tuition;

              const imageUrl =
                tuition?.image || application.image || "";

              const title =
                tuition?.title ||
                application.tuitionTitle ||
                "Tuition Application";

              const subject =
                tuition?.subject ||
                application.subject ||
                "Subject not available";

              const location =
                tuition?.location || application.location;

              const salary =
                tuition?.salary ?? application.salary;

              return (
                <div
                  key={application._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative h-52 w-full shrink-0 bg-[#18A999]/10 sm:h-auto sm:min-h-56 sm:w-64">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={title}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, 256px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full min-h-48 items-center justify-center text-[#18A999]">
                          <BookOpen size={52} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 p-5 sm:p-6">
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                        <div>
                          <h2 className="text-lg font-bold text-[#101B35]">
                            {title}
                          </h2>

                          <p className="mt-1 text-sm font-semibold text-[#18A999]">
                            {subject}
                          </p>
                        </div>

                        <span
                          className={`w-fit shrink-0 rounded-full px-4 py-2 text-xs font-bold capitalize ${getStatusStyle(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-gray-500 sm:grid-cols-2">
                        {(tuition?.classLevel || application.classLevel) && (
                          <p>
                            <span className="font-semibold text-[#101B35]">
                              Class:
                            </span>{" "}
                            {tuition?.classLevel || application.classLevel}
                          </p>
                        )}

                        {(tuition?.medium || application.medium) && (
                          <p>
                            <span className="font-semibold text-[#101B35]">
                              Medium:
                            </span>{" "}
                            {tuition?.medium || application.medium}
                          </p>
                        )}

                        {location && (
                          <p className="flex items-center gap-2">
                            <MapPin
                              size={15}
                              className="text-[#18A999]"
                            />
                            {location}
                          </p>
                        )}

                        {typeof salary === "number" && (
                          <p className="flex items-center gap-2">
                            <Wallet
                              size={15}
                              className="text-[#18A999]"
                            />
                            BDT {salary.toLocaleString("en-BD")} / month
                          </p>
                        )}

                        {(tuition?.schedule || application.schedule) && (
                          <p>
                            <span className="font-semibold text-[#101B35]">
                              Schedule:
                            </span>{" "}
                            {tuition?.schedule || application.schedule}
                          </p>
                        )}
                      </div>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                        <span className="flex items-center gap-2 text-xs text-gray-400">
                          <CalendarDays size={14} />
                          Applied on{" "}
                          {new Date(application.createdAt).toLocaleDateString(
                            "en-GB"
                          )}
                        </span>

                        {application.tuitionId && (
                          <Link
                            href={`/tuitions/${application.tuitionId}`}
                            className="text-sm font-bold text-[#18A999] transition hover:text-[#138d80]"
                          >
                            View Tuition →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
