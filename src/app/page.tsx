
import AnimatedStats from "@/components/AnimatedStats";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Users,
  Star,
  CheckCircle2,
  Laptop,
  Calculator,
  Languages,
  FlaskConical,
  HeartHandshake,
  ShieldCheck,
  Clock3,
} from "lucide-react";

const categories = [
  { name: "Mathematics", detail: "Build strong foundations", icon: Calculator },
  { name: "English", detail: "Improve communication", icon: Languages },
  { name: "Science", detail: "Explore and discover", icon: FlaskConical },
  { name: "ICT & Technology", detail: "Learn digital skills", icon: Laptop },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Trusted Tutors",
    description: "Connect with tutors who match your learning needs.",
  },
  {
    icon: HeartHandshake,
    title: "Easy Connection",
    description: "Find tuition opportunities and connect with students.",
  },
  {
    icon: Clock3,
    title: "Flexible Learning",
    description: "Explore learning options that fit your schedule.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create an Account",
    description: "Sign up as a student or tutor to get started.",
  },
  {
    number: "02",
    title: "Find Your Match",
    description: "Explore tuition opportunities or discover tutors.",
  },
  {
    number: "03",
    title: "Start Learning",
    description: "Connect and take the next step in your journey.",
  },
];

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-[#F8F7F2]">
      {/* Hero */}
      <section className="relative bg-[#101B35]">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#18A999]/15 blur-3xl" />
        <div className="absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 md:py-28 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#18A999]/30 bg-[#18A999]/10 px-4 py-2 text-xs font-bold tracking-wide text-[#6DE0D1]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#18A999]" />
              YOUR LEARNING JOURNEY STARTS HERE
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              The Right Mentor.
              <br />
              <span className="text-[#18A999]">A Brighter Future.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-300 md:text-lg">
              Find the right tutor, discover tuition opportunities, and
              unlock your potential with MentorLagbe. Learning becomes
              easier when the right guidance is just one step away.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/tuitions"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#18A999] px-7 py-4 text-sm font-extrabold text-[#101B35] shadow-lg shadow-[#18A999]/20 transition hover:-translate-y-1 hover:bg-[#38C9B7]"
              >
                Explore Tuitions <ArrowRight size={19} />
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Become a Tutor
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-7 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-[#18A999]" size={18} />
                Easy to use
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-[#18A999]" size={18} />
                Flexible options
              </div>
            </div>

            {/* Animated Counter */}
            <div className="mt-12">
              <AnimatedStats />
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-5 rounded-[2rem] bg-[#18A999]/10 blur-2xl" />

            <div className="relative rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
              <div className="rounded-2xl bg-white p-6 text-[#101B35]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Learning made simple
                    </p>
                    <h2 className="mt-2 text-2xl font-extrabold">
                      Find your perfect match
                    </h2>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E6F7F3] text-[#18A999]">
                    <GraduationCap size={27} />
                  </div>
                </div>

                <div className="mt-7 space-y-3">
                  <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <BookOpen size={22} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">Find a Tuition</p>
                      <p className="text-xs text-slate-400">
                        Explore learning opportunities
                      </p>
                    </div>
                    <ArrowRight className="text-slate-400" size={18} />
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <Users size={22} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">Connect with Tutors</p>
                      <p className="text-xs text-slate-400">
                        Find guidance for your goals
                      </p>
                    </div>
                    <ArrowRight className="text-slate-400" size={18} />
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-[#101B35] p-5 text-white">
                  <div className="flex items-center gap-2 text-[#18A999]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} size={17} fill="currentColor" />
                    ))}
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-6">
                    “The right guidance can make all the difference.”
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    The MentorLagbe vision
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-7 -left-5 hidden items-center gap-3 rounded-2xl bg-white p-4 shadow-xl sm:flex">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E6F7F3] text-[#18A999]">
                <GraduationCap size={23} />
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#101B35]">
                  Learn & Grow
                </p>
                <p className="text-xs text-slate-400">One step at a time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[3px] text-[#18A999]">
              Explore Subjects
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#101B35] md:text-4xl">
              Learn What You Love
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
              Discover learning opportunities across different subjects
              and take your skills to the next level.
            </p>
          </div>

          <Link
            href="/tuitions"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#18A999] hover:text-[#101B35]"
          >
            Explore all <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href="/tuitions"
                className="group rounded-2xl border border-slate-200/80 bg-white p-7 transition duration-300 hover:-translate-y-2 hover:border-[#18A999]/40 hover:shadow-xl hover:shadow-slate-200/60"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6F7F3] text-[#18A999] transition group-hover:bg-[#18A999] group-hover:text-white">
                  <Icon size={27} />
                </div>

                <h3 className="mt-6 text-lg font-extrabold text-[#101B35]">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  {category.detail}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[#18A999]">
                  Explore <ArrowRight size={16} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why MentorLagbe */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-sm font-extrabold uppercase tracking-[3px] text-[#18A999]">
              Why MentorLagbe
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#101B35] md:text-4xl">
              More Than Just a Learning Platform
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              We make it easier for students and tutors to find each other
              and build meaningful learning connections.
            </p>
          </div>

          <div className="grid gap-7 md:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="rounded-2xl bg-[#F8F7F2] p-8 text-center"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#101B35] text-[#18A999]">
                    <Icon size={30} />
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold text-[#101B35]">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[3px] text-[#18A999]">
              Simple Process
            </p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[#101B35] md:text-4xl">
              Your Journey to Better Learning Starts Here
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-500">
              Whether you are looking for a tutor or searching for tuition,
              getting started with MentorLagbe is simple.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#101B35] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#18A999]"
            >
              Get Started <ArrowRight size={18} />
            </Link>
          </div>

          <div className="space-y-5">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#E6F7F3] text-lg font-extrabold text-[#18A999]">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#101B35]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#101B35] px-7 py-14 text-center sm:px-14">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#18A999]/20 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#18A999] text-[#101B35]">
              <GraduationCap size={30} />
            </div>

            <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-extrabold text-white md:text-4xl">
              Ready to Take the Next Step?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Join MentorLagbe today and discover new opportunities
              to teach, learn, and grow.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#18A999] px-7 py-4 text-sm font-extrabold text-[#101B35] transition hover:bg-[#38C9B7]"
              >
                Join MentorLagbe <ArrowRight size={18} />
              </Link>

              <Link
                href="/tuitions"
                className="rounded-xl border border-white/25 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Browse Tuitions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
