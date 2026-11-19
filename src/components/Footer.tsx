
import Link from "next/link";
import {
  GraduationCap,
  Mail,
  MapPin,
  ArrowRight,
  Globe,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#101B35] text-white">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#18A999] text-[#101B35]">
                <GraduationCap size={29} />
              </div>
              <span className="text-2xl font-extrabold">
                Mentor<span className="text-[#18A999]">Lagbe</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-slate-300">
              Connecting passionate learners with dedicated tutors.
              Find the right guidance and make your learning journey meaningful.
            </p>

            <div className="mt-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-[#18A999]">
              <Globe size={19} />
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-[#18A999]">
              Explore
            </h3>
            <ul className="space-y-4 text-sm text-slate-300">
              <li><Link className="hover:text-[#18A999]" href="/">Home</Link></li>
              <li><Link className="hover:text-[#18A999]" href="/tuitions">Find Tutors</Link></li>
              <li><Link className="hover:text-[#18A999]" href="/tuitions">Browse Tuitions</Link></li>
              <li><Link className="hover:text-[#18A999]" href="/pricing">Pricing Plans</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-[#18A999]">
              Account
            </h3>
            <ul className="space-y-4 text-sm text-slate-300">
              <li><Link className="hover:text-[#18A999]" href="/login">Login</Link></li>
              <li><Link className="hover:text-[#18A999]" href="/register">Create Account</Link></li>
              <li><Link className="hover:text-[#18A999]" href="/dashboard">Dashboard</Link></li>
              <li><Link className="hover:text-[#18A999]" href="/pricing">Become a Member</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-[#18A999]">
              Get in Touch
            </h3>
            <ul className="space-y-5 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 shrink-0 text-[#18A999]" size={18} />
                <span>Contact MentorLagbe</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 shrink-0 text-[#18A999]" size={18} />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>

            <Link
              href="/register"
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#18A999] hover:text-white"
            >
              Join our community <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-4 border-t border-white/10 pt-7 text-xs text-slate-400 md:flex-row">
          <p>© 2026 MentorLagbe. All rights reserved.</p>
          <p>Made with care for learners in Bangladesh.</p>
        </div>
      </div>
    </footer>
  );
}
