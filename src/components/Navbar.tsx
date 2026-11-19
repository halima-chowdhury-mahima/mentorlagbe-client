
"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { useSession, signOut } from "@/lib/auth-client";
import {
  Menu,
  X,
  GraduationCap,
  ArrowRight,
  LogIn,
  Sun,
  Moon,
  UserRound,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Find Tutors", href: "/tuitions" },
  { label: "Find Tuition", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
];

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

function ThemeButton({ mobile = false }: { mobile?: boolean }) {
  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const { theme, setTheme } = useTheme();
  const isDark = mounted && theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      disabled={!mounted}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] font-semibold text-[var(--foreground)] transition hover:border-[#18A999] hover:text-[#18A999] ${
        mobile ? "h-11 w-full" : "h-11 w-11"
      }`}
    >
      {isDark ? <Sun size={19} /> : <Moon size={19} />}
      {mobile && <span>{isDark ? "Light Mode" : "Dark Mode"}</span>}
    </button>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const user = session?.user;
  const role = user?.role;

  const dashboardHref =
    role === "admin"
      ? "/dashboard/admin"
      : role === "tutor"
        ? "/dashboard/tutor"
        : "/dashboard/student";

  const handleLogout = async () => {
    await signOut();
    setMenuOpen(false);
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#101B35] text-[#18A999]">
            <GraduationCap size={27} />
          </div>
          <div>
            <span className="block text-xl font-extrabold tracking-tight text-[var(--foreground)]">
              Mentor<span className="text-[#18A999]">Lagbe</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[2px] text-[var(--muted)]">
              Learn. Grow. Succeed.
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="text-sm font-semibold text-[var(--muted)] transition hover:text-[#18A999]">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeButton />

          {!isPending && user ? (
            <>
              <Link href={dashboardHref} className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-[var(--foreground)] hover:bg-[var(--surface-secondary)]">
                <LayoutDashboard size={17} />
                Dashboard
              </Link>
              <span className="max-w-36 truncate text-sm font-semibold text-[var(--foreground)]">
                {user.name}
              </span>
              <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl bg-[#101B35] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#18A999]">
                <LogOut size={17} />
                Logout
              </button>
            </>
          ) : !isPending ? (
            <>
              <Link href="/login" className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-[var(--foreground)] hover:bg-[var(--surface-secondary)]">
                <LogIn size={17} />
                Login
              </Link>
              <Link href="/register" className="flex items-center gap-2 rounded-xl bg-[#101B35] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#18A999]">
                Get Started <ArrowRight size={17} />
              </Link>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeButton />
          <button type="button" onClick={() => setMenuOpen((previous) => !previous)} className="rounded-lg p-2 text-[var(--foreground)]" aria-label="Toggle navigation menu" aria-expanded={menuOpen}>
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--surface)] px-5 py-5 lg:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)} className="font-semibold text-[var(--foreground)] hover:text-[#18A999]">
                {link.label}
              </Link>
            ))}

            {!isPending && user ? (
              <>
                <Link href={dashboardHref} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 font-bold text-[#18A999]">
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                  <UserRound size={17} /> {user.name} ({role})
                </div>
                <button onClick={handleLogout} className="rounded-xl bg-[#101B35] py-3 text-center text-sm font-bold text-white">
                  Logout
                </button>
              </>
            ) : !isPending ? (
              <div className="mt-2 grid grid-cols-2 gap-3">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-xl border border-[var(--border)] py-3 text-center text-sm font-bold text-[var(--foreground)]">
                  Login
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="rounded-xl bg-[#101B35] py-3 text-center text-sm font-bold text-white">
                  Register
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
