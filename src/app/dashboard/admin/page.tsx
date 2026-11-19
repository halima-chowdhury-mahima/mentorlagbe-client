
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Users,
  BookOpen,
  CreditCard,
  CheckCircle,
  XCircle,
  RefreshCw,
  Loader2,
  LayoutDashboard,
  AlertCircle,
  UserRound,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  useSession,
  type MentorLagbeUser,
} from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Row = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  title?: string;
  subject?: string;
  classLevel?: string;
  location?: string;
  salary?: number | string;
  status?: string;
  role?: string;
  plan?: string;
  amount?: number | string;
  currency?: string;
  createdAt?: string;
  tutorName?: string;
  studentName?: string;
};

type ApiResponse = {
  success?: boolean;
  data?: Row[] | Row;
  tuitions?: Row[];
  users?: Row[];
  payments?: Row[];
  message?: string;
};

const getRows = (
  result: ApiResponse,
  key: "tuitions" | "users" | "payments",
): Row[] => {
  if (Array.isArray(result.data)) return result.data;
  if (Array.isArray(result[key])) return result[key] as Row[];
  return [];
};

const formatDate = (date?: string) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-BD");
};

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const currentUser = session?.user as
    | MentorLagbeUser
    | undefined;

  const [tuitions, setTuitions] = useState<Row[]>([]);
  const [users, setUsers] = useState<Row[]>([]);
  const [payments, setPayments] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);

    try {
      const endpoints = [
        "/api/admin/tuitions",
        "/api/admin/users",
        "/api/admin/payments",
      ];

      const responses = await Promise.all(
        endpoints.map((endpoint) =>
          fetch(`${API_URL}${endpoint}`, {
            credentials: "include",
            cache: "no-store",
          }),
        ),
      );

      const results = await Promise.all(
        responses.map(async (response) => {
          if (!response.ok) {
            throw new Error(
              `Dashboard API error: ${response.status}`,
            );
          }
          return (await response.json()) as ApiResponse;
        }),
      );

      setTuitions(getRows(results[0], "tuitions"));
      setUsers(getRows(results[1], "users"));
      setPayments(getRows(results[2], "payments"));
    } catch (error) {
      console.error(error);
      toast.error("Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/login");
      return;
    }

    if (currentUser?.role !== "admin") {
      router.replace("/dashboard");
      return;
    }

    let active = true;

    const load = async () => {
      if (active) await loadDashboard();
    };

    void load();

    return () => {
      active = false;
    };
  }, [isPending, session, currentUser?.role, router, loadDashboard]);

  const updateStatus = async (
    tuitionId: string,
    status: "approved" | "rejected",
  ) => {
    setProcessing(tuitionId);

    try {
      const response = await fetch(
        `${API_URL}/api/admin/tuitions/${tuitionId}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Status update failed.");
      }

      toast.success(
        status === "approved"
          ? "Tuition approved successfully!"
          : "Tuition rejected successfully!",
      );

      await loadDashboard();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setProcessing(null);
    }
  };

  if (isPending || loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F8F7F2]">
        <Loader2 className="h-9 w-9 animate-spin text-[#18A999]" />
      </main>
    );
  }

  if (!session || currentUser?.role !== "admin") {
    return null;
  }

  const pendingTuitions = tuitions.filter(
    (item) => item.status === "pending",
  );

  const approvedTuitions = tuitions.filter(
    (item) => item.status === "approved",
  );

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
    },
    {
      label: "Total Tuitions",
      value: tuitions.length,
      icon: BookOpen,
    },
    {
      label: "Pending Approval",
      value: pendingTuitions.length,
      icon: AlertCircle,
    },
    {
      label: "Total Payments",
      value: payments.length,
      icon: CreditCard,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-8 text-[#101B35] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Dashboard Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#18A999]">
              <ShieldCheck size={18} />
              ADMIN CONTROL CENTER
            </div>

            <h1 className="text-3xl font-extrabold sm:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage users, tuition posts and platform payments.
            </p>
          </div>

          <button
            onClick={() => void loadDashboard()}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm transition hover:border-[#18A999]"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* My Profile */}
        <section className="mb-8">
          <Link
            href="/dashboard/admin/profile"
            className="group flex max-w-md items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#18A999] hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#18A999]/10 text-[#18A999]">
              <UserRound size={24} />
            </div>

            <div className="flex-1">
              <h2 className="font-bold text-[#101B35]">
                My Profile
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                View and update your personal information.
              </p>
            </div>

            <ArrowRight
              size={18}
              className="shrink-0 text-[#18A999] transition group-hover:translate-x-1"
            />
          </Link>
        </section>

        {/* Statistics */}
        <section className="mb-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>
                  <div className="rounded-xl bg-[#18A999]/10 p-3 text-[#18A999]">
                    <Icon size={21} />
                  </div>
                </div>

                <p className="text-3xl font-extrabold">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </section>

        {/* Tuition Management */}
        <section className="mb-9">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-[#18A999]/10 p-3 text-[#18A999]">
              <LayoutDashboard size={21} />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                Tuition Management
              </h2>
              <p className="text-sm text-slate-500">
                Review and manage submitted tuition posts.
              </p>
            </div>
          </div>

          {pendingTuitions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <CheckCircle
                className="mx-auto mb-3 text-[#18A999]"
                size={34}
              />
              <h3 className="font-bold">All caught up!</h3>
              <p className="mt-1 text-sm text-slate-500">
                There are no pending tuition posts.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {pendingTuitions.map((tuition) => {
                const id = tuition._id || tuition.id || "";

                return (
                  <article
                    key={id}
                    className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                        PENDING
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDate(tuition.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold">
                      {tuition.title || "Untitled Tuition"}
                    </h3>

                    <div className="mt-3 space-y-2 text-sm text-slate-600">
                      <p>Subject: {tuition.subject || "N/A"}</p>
                      <p>Class: {tuition.classLevel || "N/A"}</p>
                      <p>Location: {tuition.location || "N/A"}</p>
                      <p>
                        Salary: ৳
                        {Number(tuition.salary || 0).toLocaleString("en-BD")}
                      </p>
                    </div>

                    <div className="mt-5 flex gap-3">
                      <button
                        disabled={!id || processing === id}
                        onClick={() => void updateStatus(id, "approved")}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#18A999] px-3 py-3 text-sm font-bold text-white transition hover:bg-[#128b7e] disabled:opacity-50"
                      >
                        {processing === id ? (
                          <Loader2 className="animate-spin" size={17} />
                        ) : (
                          <CheckCircle size={17} />
                        )}
                        Approve
                      </button>

                      <button
                        disabled={!id || processing === id}
                        onClick={() => void updateStatus(id, "rejected")}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        <XCircle size={17} />
                        Reject
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Tuition Overview */}
        <section className="mb-9 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">
            Tuition Overview
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                All Tuitions
              </p>
              <p className="mt-1 text-2xl font-extrabold">
                {tuitions.length}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-sm text-slate-500">
                Approved
              </p>
              <p className="mt-1 text-2xl font-extrabold text-emerald-700">
                {approvedTuitions.length}
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-4">
              <p className="text-sm text-slate-500">
                Pending
              </p>
              <p className="mt-1 text-2xl font-extrabold text-amber-700">
                {pendingTuitions.length}
              </p>
            </div>
          </div>
        </section>

        {/* Recent Users */}
        <section className="mb-9 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <Users className="text-[#18A999]" />
            Recent Users
          </h2>

          {users.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              No user records returned by the API.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[550px] text-left text-sm">
                <thead>
                  <tr className="border-b text-slate-500">
                    <th className="px-3 py-3">Name</th>
                    <th className="px-3 py-3">Email</th>
                    <th className="px-3 py-3">Role</th>
                    <th className="px-3 py-3">Plan</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user._id || user.id || index}
                      className="border-b last:border-0"
                    >
                      <td className="px-3 py-4 font-semibold">
                        {user.name || "N/A"}
                      </td>
                      <td className="px-3 py-4 text-slate-500">
                        {user.email || "N/A"}
                      </td>
                      <td className="px-3 py-4 capitalize">
                        {user.role || "N/A"}
                      </td>
                      <td className="px-3 py-4 capitalize">
                        {user.plan || "free"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Recent Payments */}
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <CreditCard className="text-[#18A999]" />
            Recent Payments
          </h2>

          {payments.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              No payment records found yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-left text-sm">
                <thead>
                  <tr className="border-b text-slate-500">
                    <th className="px-3 py-3">User</th>
                    <th className="px-3 py-3">Amount</th>
                    <th className="px-3 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, index) => (
                    <tr
                      key={payment._id || payment.id || index}
                      className="border-b last:border-0"
                    >
                      <td className="px-3 py-4">
                        {payment.studentName ||
                          payment.tutorName ||
                          payment.email ||
                          "User"}
                      </td>
                      <td className="px-3 py-4 font-semibold">
                        {payment.currency || "USD"}{" "}
                        {payment.amount ?? "N/A"}
                      </td>
                      <td className="px-3 py-4 text-slate-500">
                        {formatDate(payment.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
