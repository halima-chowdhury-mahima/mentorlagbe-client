import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Payments | MentorLagbe",
};

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[#18A999]">Administration</p>
        <h1 className="mt-2 text-3xl font-bold text-[#101B35]">Manage Payments</h1>
        <p className="mt-2 text-gray-500">Review payment records and transaction statuses.</p>
      </div>
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
        <h2 className="font-semibold text-[#101B35]">Payment management</h2>
        <p className="mt-2 text-sm text-gray-500">Admin payment management API integration is pending.</p>
      </div>
    </div>
  );
}
