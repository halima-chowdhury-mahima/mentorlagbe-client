
"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, RefreshCw, Users, ShieldCheck } from "lucide-react";
import { adminRequest } from "@/lib/admin-api";

interface AdminUser {
  id?: string;
  _id?: string;
  name?: string;
  email: string;
  role?: string;
  plan?: string;
  image?: string | null;
  createdAt?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await adminRequest<AdminUser[]>("users");
      setUsers(result.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  
useEffect(() => {
  let active = true;

  adminRequest<AdminUser[]>("users")
    .then((result) => {
      if (active) {
        setUsers(result.data);
      }
    })
    .catch((err: unknown) => {
      if (active) {
        setError(
          err instanceof Error ? err.message : "Failed to load users."
        );
      }
    })
    .finally(() => {
      if (active) {
        setLoading(false);
      }
    });

  return () => {
    active = false;
  };
}, []);


  const filteredUsers = users.filter((user) =>
    `${user.name ?? ""} ${user.email} ${user.role ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-[#18A999]">
            ADMINISTRATION
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#101B35]">
            Manage Users
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            View and monitor all registered MentorLagbe users.
          </p>
        </div>

        <button
          onClick={() => void loadUsers()}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#101B35] px-4 py-3 text-sm font-semibold text-white hover:bg-[#18A999] disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Users</p>
            <Users className="text-[#18A999]" />
          </div>
          <p className="mt-3 text-3xl font-bold text-[#101B35]">
            {users.length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Admin Accounts</p>
            <ShieldCheck className="text-[#18A999]" />
          </div>
          <p className="mt-3 text-3xl font-bold text-[#101B35]">
            {users.filter((user) => user.role === "admin").length}
          </p>
        </div>
      </div>

      <div className="relative">
        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, email or role..."
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#18A999]"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-[#101B35] text-white">
              <tr>
                <th className="px-5 py-4 font-semibold">User</th>
                <th className="px-5 py-4 font-semibold">Email</th>
                <th className="px-5 py-4 font-semibold">Role</th>
                <th className="px-5 py-4 font-semibold">Plan</th>
                <th className="px-5 py-4 font-semibold">Joined</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id ?? user._id ?? user.email} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-semibold text-[#101B35]">
                      {user.name || "Unnamed User"}
                    </td>
                    <td className="px-5 py-4 text-gray-600">{user.email}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[#18A999]/10 px-3 py-1 text-xs font-semibold capitalize text-[#087F70]">
                        {user.role || "student"}
                      </span>
                    </td>
                    <td className="px-5 py-4 capitalize text-gray-600">
                      {user.plan || "free"}
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-GB")
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Showing {filteredUsers.length} of {users.length} users.
      </p>
    </div>
  );
}
