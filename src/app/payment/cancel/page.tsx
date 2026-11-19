
import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F7F2] px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-xl sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-500">
          <XCircle size={48} />
        </div>

        <span className="mt-7 inline-flex rounded-full bg-amber-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-amber-600">
          Payment Cancelled
        </span>

        <h1 className="mt-5 text-3xl font-extrabold text-[#101B35]">
          No Payment Was Completed
        </h1>

        <p className="mt-4 text-sm leading-7 text-gray-600">
          Your checkout was cancelled. No successful subscription
          activation was recorded through this checkout.
          You can return to pricing and try again whenever you are ready.
        </p>

        <Link
          href="/pricing"
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#18A999] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#128c80]"
        >
          <RefreshCw size={17} />
          Try Again
        </Link>

        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#18A999]"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </main>
  );
}
