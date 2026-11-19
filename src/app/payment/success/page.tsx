
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Loader2,
  XCircle,
  LayoutDashboard,
  Home,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface VerificationResponse {
  success: boolean;
  message?: string;
  plan?: string;
  subscriptionStatus?: string;
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState(
    "Verifying your subscription..."
  );

  useEffect(() => {
    const controller = new AbortController();

    const verifyPayment = async () => {
      if (!sessionId) {
        setMessage("Payment session ID was not found.");
        setLoading(false);
        return;
      }

      if (!API_URL) {
        setMessage("API URL is not configured.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/payments/verify-session`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionId }),
            signal: controller.signal,
          }
        );

        const result =
          (await response.json()) as VerificationResponse;

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Payment verification failed."
          );
        }

        setSuccess(true);
        setMessage(
          result.message ||
            "Your MentorLagbe Pro subscription is active!"
        );
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setSuccess(false);
        setMessage(
          error instanceof Error
            ? error.message
            : "Something went wrong while verifying payment."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    verifyPayment();

    return () => controller.abort();
  }, [sessionId]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F7F2] px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-xl sm:p-12">
        {loading ? (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#18A999]/10 text-[#18A999]">
              <Loader2 size={42} className="animate-spin" />
            </div>

            <h1 className="mt-7 text-3xl font-extrabold text-[#101B35]">
              Verifying Payment
            </h1>

            <p className="mt-4 text-sm leading-7 text-gray-600">
              Please wait while we verify your Stripe subscription.
              Do not close this page.
            </p>
          </>
        ) : success ? (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#18A999]/10 text-[#18A999]">
              <CheckCircle2 size={48} />
            </div>

            <span className="mt-7 inline-flex rounded-full bg-[#18A999]/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#128c80]">
              Payment Successful
            </span>

            <h1 className="mt-5 text-3xl font-extrabold text-[#101B35]">
              Welcome to MentorLagbe PRO!
            </h1>

            <p className="mt-4 text-sm leading-7 text-gray-600">
              {message}
            </p>

            <div className="mt-7 rounded-2xl border border-[#18A999]/20 bg-[#18A999]/5 p-5">
              <p className="text-sm font-bold text-[#101B35]">
                Your subscription is active
              </p>
              <p className="mt-2 text-xs text-gray-600">
                Enjoy your premium MentorLagbe features.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#18A999] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#128c80]"
            >
              <LayoutDashboard size={18} />
              Go to Dashboard
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
              <XCircle size={48} />
            </div>

            <h1 className="mt-7 text-3xl font-extrabold text-[#101B35]">
              Verification Failed
            </h1>

            <p className="mt-4 text-sm leading-7 text-gray-600">
              {message}
            </p>

            <Link
              href="/pricing"
              className="mt-8 flex w-full items-center justify-center rounded-xl bg-[#101B35] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#18A999]"
            >
              Return to Pricing
            </Link>
          </>
        )}

        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#18A999]"
        >
          <Home size={16} />
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#F8F7F2]">
          <Loader2
            size={40}
            className="animate-spin text-[#18A999]"
          />
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
