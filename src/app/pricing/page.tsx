
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Check,
  Crown,
  GraduationCap,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Loader2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const starterFeatures = [
  "Up to 2 tuition posts (Tutor)",
  "Up to 5 tuition bookmarks (Student)",
  "Direct tuition applications",
  "Basic profile & search filters",
];

const proFeatures = [
  "Unlimited tuition posts & bookmarks",
  "Golden PRO verification badge",
  "Priority listing in search & category filters",
  "Priority applicant notifications & reviews",
];

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface CheckoutResponse {
  success: boolean;
  message?: string;
  url?: string | null;
}

interface UserWithRole {
  role?: string;
}

export default function PricingPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (loading) return;

    if (isPending) {
      toast.loading("Checking your account...");
      return;
    }

    if (!session?.user) {
      toast.error("Please login to upgrade your plan.");
      router.push("/login");
      return;
    }

    const user = session.user as typeof session.user & UserWithRole;

    if (user.role !== "student" && user.role !== "tutor") {
      toast.error("Only students and tutors can purchase Pro.");
      return;
    }

    if (!API_URL) {
      toast.error("API URL is not configured.");
      return;
    }

    const endpoint =
      user.role === "tutor"
        ? "/api/payments/create-tutor-checkout"
        : "/api/payments/create-student-checkout";

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result =
        (await response.json()) as CheckoutResponse;

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to create checkout session."
        );
      }

      if (!result.url) {
        throw new Error("Stripe checkout URL was not returned.");
      }

      toast.success("Redirecting to secure Stripe Checkout...");

      window.location.assign(result.url);
    } catch (error) {
      console.error("Stripe checkout error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-16 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#18A999]/20 bg-[#18A999]/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#128c80]">
            <Sparkles size={14} />
            Simple & Transparent Pricing
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-[#101B35] sm:text-5xl">
            Choose the Right Plan
            <span className="mt-2 block text-[#18A999]">
              Grow with MentorLagbe
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-gray-600">
            Start for free and upgrade whenever you are ready.
            Find better opportunities and make meaningful
            connections with the right plan.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-5xl items-stretch gap-8 lg:grid-cols-2">
          {/* Starter Plan */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-9"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#101B35]/5 text-[#101B35]">
              <GraduationCap size={28} />
            </div>

            <div className="mt-7">
              <span className="text-xs font-extrabold uppercase tracking-widest text-gray-500">
                Free Forever
              </span>

              <h2 className="mt-2 text-3xl font-extrabold text-[#101B35]">
                Starter Plan
              </h2>

              <p className="mt-3 min-h-12 text-sm leading-6 text-gray-600">
                Perfect for students and tutors looking to test
                the platform.
              </p>
            </div>

            <div className="mt-7 flex items-end gap-2">
              <span className="text-5xl font-extrabold tracking-tight text-[#101B35]">
                $0
              </span>
              <span className="mb-2 text-sm font-medium text-gray-500">
                /month
              </span>
            </div>

            <div className="my-8 h-px bg-gray-100" />

            <p className="mb-5 text-sm font-bold text-[#101B35]">
              What&apos;s included
            </p>

            <ul className="flex-1 space-y-5">
              {starterFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm leading-6 text-gray-700"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#18A999]/10 text-[#128c80]">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/register"
              className="mt-9 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#101B35] px-6 py-4 text-sm font-extrabold text-[#101B35] transition hover:bg-[#101B35] hover:text-white"
            >
              Get Started Free
              <ArrowRight size={17} />
            </Link>

            <p className="mt-4 text-center text-xs text-gray-500">
              No credit card required.
            </p>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-[#18A999] bg-[#101B35] p-7 shadow-xl shadow-[#101B35]/10 sm:p-9"
          >
            {/* Recommended badge */}
            <div className="absolute right-0 top-0 rounded-bl-2xl bg-[#18A999] px-5 py-2 text-[10px] font-extrabold uppercase tracking-widest text-white">
              Recommended
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#18A999]/15 text-[#55D8C7]">
              <Crown size={28} />
            </div>

            <div className="mt-7">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#55D8C7]">
                <Sparkles size={13} className="mr-1 inline" />
                PRO Badge
              </span>

              <h2 className="mt-2 text-3xl font-extrabold text-white">
                MentorLagbe PRO
              </h2>

              <p className="mt-3 min-h-12 text-sm leading-6 text-gray-300">
                Unlimited reach, verified credential badges,
                and priority matching.
              </p>
            </div>

            {/* Role-based prices */}
            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold text-gray-400">
                  For Tutors
                </p>

                <div className="mt-2 flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-[#55D8C7]">
                    $15
                  </span>
                </div>

                <p className="mt-1 text-xs text-gray-400">
                  /month
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold text-gray-400">
                  For Students
                </p>

                <div className="mt-2 flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-[#55D8C7]">
                    $10
                  </span>
                </div>

                <p className="mt-1 text-xs text-gray-400">
                  /month
                </p>
              </div>
            </div>

            <div className="my-8 h-px bg-white/10" />

            <p className="mb-5 text-sm font-bold text-white">
              Everything in Starter, plus
            </p>

            <ul className="flex-1 space-y-5">
              {proFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm leading-6 text-gray-200"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#18A999]/20 text-[#55D8C7]">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={handleUpgrade}
              disabled={loading || isPending}
              className="mt-9 flex w-full items-center justify-center gap-2 rounded-xl bg-[#18A999] px-6 py-4 text-sm font-extrabold text-white transition hover:bg-[#128c80] hover:shadow-lg hover:shadow-[#18A999]/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Creating Checkout...
                </>
              ) : (
                <>
                  Upgrade to Pro
                  <Zap size={17} />
                </>
              )}
            </button>

            <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-gray-400">
              <ShieldCheck size={14} />
              Secure payment powered by Stripe.
            </p>
          </motion.div>
        </div>

        {/* Bottom note */}
        <div className="mt-14 text-center">
          <p className="text-sm text-gray-500">
            Need help choosing a plan?
            <Link
              href="/contact"
              className="ml-1 font-bold text-[#128c80] hover:underline"
            >
              Contact our team
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
