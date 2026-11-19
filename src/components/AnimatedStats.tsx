
"use client";

import { useEffect, useRef, useState } from "react";
import { Users, GraduationCap, BookOpen } from "lucide-react";

const stats = [
  { value: 500, suffix: "+", label: "Active Tutors", icon: Users },
  { value: 1000, suffix: "+", label: "Learning Opportunities", icon: BookOpen },
  { value: 50, suffix: "+", label: "Subjects", icon: GraduationCap },
];

export default function AnimatedStats() {
  const [started, setStarted] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    const duration = 1800;
    const startTime = performance.now();
    let frameId: number;

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);

      setCounts(stats.map((stat) => Math.floor(stat.value * eased)));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [started]);

  return (
    <div
      ref={sectionRef}
      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="group rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-md transition duration-300 hover:-translate-y-2 hover:border-[#18A999]/50 hover:bg-white/[0.12]"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#18A999]/15 text-[#18A999]">
                <Icon size={21} />
              </div>
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#18A999]" />
            </div>

            <p className="mt-5 text-3xl font-extrabold tracking-tight text-white tabular-nums">
              {counts[index].toLocaleString("en-US")}
              <span className="text-[#18A999]">{stat.suffix}</span>
            </p>

            <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
