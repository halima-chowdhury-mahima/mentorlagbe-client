
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Applications | MentorLagbe",
};

export default function AdminApplicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[#18A999]">Administration</p>
        <h1 className="mt-2 text-3xl font-bold text-[#101B35]">
          Manage Applications
        </h1>
        <p className="mt-2 text-gray-500">
          Monitor tutor applications and their statuses.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
        <h2 className="font-semibold text-[#101B35]">
          Application management
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Connect this page to the admin applications API.
        </p>
      </div>
    </div>
  );
}
