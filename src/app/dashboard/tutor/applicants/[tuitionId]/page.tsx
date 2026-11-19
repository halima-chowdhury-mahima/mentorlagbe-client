
"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Users,
  LoaderCircle,
  CalendarDays,
  Mail,
  FileText,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Applicant {
  _id: string;
  studentName?: string;
  studentEmail?: string;
  message?: string;
  status: string;
  createdAt: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function ApplicantsContent() {
  const params = useParams();
  const tuitionId = params.tuitionId as string;

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadApplicants = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/tutor/applicants/${tuitionId}`,
        { credentials: "include" }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load applicants");
      }

      setApplicants(result.data || []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, [tuitionId]);

  
useEffect(() => {
  let active = true;

  const fetchApplicants = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/tutor/applicants/${tuitionId}`,
        { credentials: "include" }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load applicants");
      }

      if (active) {
        setApplicants(result.data || []);
      }
    } catch (error) {
      if (active) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      }
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  };

  if (tuitionId) {
    void fetchApplicants();
  }

  return () => {
    active = false;
  };
}, [tuitionId]);

  const updateApplicationStatus = async (
    applicationId: string,
    status: "approved" | "rejected"
  ) => {
    const action = status === "approved" ? "approve" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this application?`
    );

    if (!confirmed) return;

    setUpdatingId(applicationId);

    try {
      const response = await fetch(
        `${API_URL}/api/tutor/applicants/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update application");
      }

      setApplicants((previous) =>
        previous.map((applicant) =>
          applicant._id === applicationId
            ? { ...applicant, status }
            : applicant
        )
      );

      toast.success(
        status === "approved"
          ? "Application approved successfully!"
          : "Application rejected successfully!"
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-emerald-100 text-emerald-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard/tutor/my-tuitions"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#18A999]"
        >
          <ArrowLeft size={17} />
          Back to My Tuitions
        </Link>

        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#18A999]">
            Tutor Portal
          </p>

          <h1 className="text-3xl font-extrabold text-[#101B35]">
            Tuition Applicants
          </h1>

          <p className="mt-2 text-gray-500">
            Review and manage students who applied for your tuition.
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <LoaderCircle
              size={32}
              className="animate-spin text-[#18A999]"
            />
          </div>
        ) : applicants.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center">
            <Users className="mx-auto mb-4 text-[#18A999]" size={42} />

            <h2 className="text-xl font-bold text-[#101B35]">
              No Applicants Yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Students who apply for this tuition will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applicants.map((applicant) => {
              const isUpdating = updatingId === applicant._id;
              const isPending =
                applicant.status.toLowerCase() === "pending";

              return (
                <div
                  key={applicant._id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <h2 className="text-lg font-bold text-[#101B35]">
                        {applicant.studentName || "Student"}
                      </h2>

                      <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                        <Mail size={15} className="text-[#18A999]" />
                        {applicant.studentEmail || "Email unavailable"}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-4 py-2 text-xs font-bold capitalize ${getStatusStyle(
                        applicant.status
                      )}`}
                    >
                      {applicant.status || "pending"}
                    </span>
                  </div>

                  {applicant.message && (
                    <div className="mt-5 rounded-xl bg-[#F8F7F2] p-4">
                      <p className="mb-2 flex items-center gap-2 text-sm font-bold text-[#101B35]">
                        <FileText size={16} />
                        Student Message
                      </p>

                      <p className="text-sm leading-6 text-gray-600">
                        {applicant.message}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                    <CalendarDays size={14} />
                    Applied on{" "}
                    {new Date(applicant.createdAt).toLocaleDateString(
                      "en-GB"
                    )}
                  </div>

                  {isPending && (
                    <div className="mt-5 flex flex-wrap gap-3 border-t border-gray-100 pt-5">
                      <button
                        type="button"
                        onClick={() =>
                          updateApplicationStatus(
                            applicant._id,
                            "approved"
                          )
                        }
                        disabled={isUpdating}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#18A999] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#128879] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isUpdating ? (
                          <LoaderCircle size={17} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={17} />
                        )}
                        Approve
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateApplicationStatus(
                            applicant._id,
                            "rejected"
                          )
                        }
                        disabled={isUpdating}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isUpdating ? (
                          <LoaderCircle size={17} className="animate-spin" />
                        ) : (
                          <XCircle size={17} />
                        )}
                        Reject
                      </button>
                    </div>
                  )}

                  {!isPending && (
                    <p className="mt-5 border-t border-gray-100 pt-4 text-xs font-medium text-gray-400">
                      This application has already been reviewed.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default function ApplicantsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8F7F2]">
          <LoaderCircle
            className="animate-spin text-[#18A999]"
            size={32}
          />
        </div>
      }
    >
      <ApplicantsContent />
    </Suspense>
  );
}
