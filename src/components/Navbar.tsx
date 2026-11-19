
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  GraduationCap,
  ArrowRight,
  LogIn,
} from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Find Tutors", href: "/tuitions" },
  { label: "Find Tuition", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#101B35] text-[#18A999]">
            <GraduationCap size={27} />
          </div>
          <div>
            <span className="block text-xl font-extrabold tracking-tight text-[#101B35]">
              Mentor<span className="text-[#18A999]">Lagbe</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[2px] text-slate-400">
              Learn. Grow. Succeed.
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-slate-600 transition hover:text-[#18A999]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-[#101B35] transition hover:bg-slate-100"
          >
            <LogIn size={17} />
            Login
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-2 rounded-xl bg-[#101B35] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#18A999]"
          >
            Get Started
            <ArrowRight size={17} />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-[#101B35] lg:hidden"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-5 py-5 lg:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-semibold text-slate-700 hover:text-[#18A999]"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-3">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl border border-slate-200 py-3 text-center text-sm font-bold text-[#101B35]"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl bg-[#101B35] py-3 text-center text-sm font-bold text-white"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
