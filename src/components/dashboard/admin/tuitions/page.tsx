
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Tuitions | MentorLagbe",
};

export default function AdminTuitionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[#18A999]">Administration</p>
        <h1 className="mt-2 text-3xl font-bold text-[#101B35]">
          Manage Tuitions
        </h1>
        <p className="mt-2 text-gray-500">
          Review and manage tuition posts across MentorLagbe.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
        <h2 className="font-semibold text-[#101B35]">
          Tuition management
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Connect this page to the admin tuition API to manage tuition posts.
        </p>
      </div>
    </div>
  );
}
