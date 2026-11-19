
"use client";

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  ImagePlus,
  Loader2,
  MapPin,
  Wallet,
  CalendarDays,
  GraduationCap,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useSession,
  type MentorLagbeUser,
} from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PostTuitionPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const currentUser = session?.user as MentorLagbeUser | undefined;

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    title: "",
    subject: "",
    classLevel: "",
    medium: "",
    location: "",
    salary: "",
    schedule: "",
    description: "",
  });

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/login");
      return;
    }

    if (currentUser?.role !== "tutor") {
      router.replace("/dashboard");
    }
  }, [session, isPending, currentUser, router]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image size must be less than 8MB.");
      return;
    }

    try {
      setUploading(true);

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          const result = reader.result;
          if (typeof result !== "string") {
            reject(new Error("Unable to read image."));
            return;
          }
          resolve(result);
        };

        reader.onerror = () => reject(new Error("Image reading failed."));
        reader.readAsDataURL(file);
      });

      const response = await fetch(`${API_URL}/api/uploads/image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ image: base64 }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Image upload failed.");
      }

      const imageUrl =
        result.data?.url || result.url || result.data?.display_url;

      if (!imageUrl) {
        throw new Error("Image URL was not returned by the server.");
      }

      setImage(imageUrl);
      setPreview(imageUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Image upload failed."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!session || currentUser?.role !== "tutor") {
      toast.error("Please login with a tutor account.");
      return;
    }

    if (Number(form.salary) <= 0) {
      toast.error("Please enter a valid monthly salary.");
      return;
    }

    if (form.description.trim().length < 20) {
      toast.error("Description must be at least 20 characters.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`${API_URL}/api/tuitions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          salary: Number(form.salary),
          image,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to post tuition.");
      }

      toast.success("Tuition submitted for admin approval!");
      router.push("/dashboard/tutor/my-tuitions");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending || !session || currentUser?.role !== "tutor") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F7F2]">
        <Loader2 className="h-9 w-9 animate-spin text-[#18A999]" />
      </main>
    );
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#101B35] outline-none transition focus:border-[#18A999] focus:ring-2 focus:ring-[#18A999]/10";

  const labelClass = "text-sm font-semibold text-[#101B35]";

  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard/tutor"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#101B35] hover:text-[#18A999]"
        >
          <ArrowLeft size={18} />
          Back to Tutor Dashboard
        </Link>

        <div className="mb-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#18A999]/10 text-[#18A999]">
            <BookOpen size={25} />
          </div>

          <p className="text-sm font-bold tracking-wider text-[#18A999]">
            TUTOR PORTAL
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-[#101B35]">
            Post a New Tuition
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Share your teaching opportunity and connect with students.
            Your post will be reviewed by an administrator.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-7 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-9"
        >
          <section>
            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-[#101B35]">
              <GraduationCap className="text-[#18A999]" />
              Tuition Information
            </h2>

            <div className="space-y-5">
              <div>
                <label htmlFor="title" className={labelClass}>
                  Tuition Title *
                </label>
                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Experienced tutor needed for Class 8"
                  className={inputClass}
                  required
                  minLength={5}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="subject" className={labelClass}>
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select Subject</option>
                    {[
                      "All Subjects",
                      "Mathematics",
                      "English",
                      "Physics",
                      "Chemistry",
                      "Biology",
                      "ICT",
                      "Accounting",
                      "Finance",
                      "Bangla",
                    ].map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="classLevel" className={labelClass}>
                    Class / Level *
                  </label>
                  <select
                    id="classLevel"
                    name="classLevel"
                    value={form.classLevel}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select Class</option>
                    {[
                      "Class 1",
                      "Class 2",
                      "Class 3",
                      "Class 4",
                      "Class 5",
                      "Class 6",
                      "Class 7",
                      "Class 8",
                      "Class 9",
                      "Class 10",
                      "HSC",
                      "University",
                    ].map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="medium" className={labelClass}>
                    Medium *
                  </label>
                  <select
                    id="medium"
                    name="medium"
                    value={form.medium}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select Medium</option>
                    <option value="Bangla Medium">Bangla Medium</option>
                    <option value="English Version">English Version</option>
                    <option value="English Medium">English Medium</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className={labelClass}>
                    Location *
                  </label>
                  <div className="relative">
                    <MapPin
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="location"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="e.g. Uttara, Dhaka"
                      className={`${inputClass} pl-10`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="salary" className={labelClass}>
                    Monthly Salary (BDT) *
                  </label>
                  <div className="relative">
                    <Wallet
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="salary"
                      name="salary"
                      type="number"
                      min="1"
                      value={form.salary}
                      onChange={handleChange}
                      placeholder="e.g. 5000"
                      className={`${inputClass} pl-10`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="schedule" className={labelClass}>
                    Class Schedule *
                  </label>
                  <div className="relative">
                    <CalendarDays
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="schedule"
                      name="schedule"
                      value={form.schedule}
                      onChange={handleChange}
                      placeholder="e.g. 5 days per week"
                      className={`${inputClass} pl-10`}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="description" className={labelClass}>
                  Tuition Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  minLength={20}
                  placeholder="Describe the tuition requirements, preferred tutor qualifications, timing, and other details..."
                  className={`${inputClass} resize-y`}
                  required
                />
                <p className="mt-2 text-xs text-gray-400">
                  Minimum 20 characters.
                </p>
              </div>
            </div>
          </section>

          <div className="border-t border-gray-100 pt-7">
            <h2 className="mb-4 text-lg font-bold text-[#101B35]">
              Tuition Image
            </h2>

            <label
              htmlFor="tuitionImage"
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-[#F8F7F2] p-7 text-center transition hover:border-[#18A999]"
            >
              {uploading ? (
                <Loader2 className="mb-3 h-9 w-9 animate-spin text-[#18A999]" />
              ) : (
                <ImagePlus className="mb-3 h-9 w-9 text-[#18A999]" />
              )}

              <span className="font-semibold text-[#101B35]">
                {uploading ? "Uploading image..." : "Upload a tuition image"}
              </span>

              <span className="mt-2 text-xs text-gray-400">
                JPG, PNG or WEBP · Maximum 8MB
              </span>

              <input
                id="tuitionImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="Tuition preview"
                  className="h-48 w-full rounded-xl object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage("");
                    setPreview("");
                  }}
                  className="mt-2 text-sm font-semibold text-red-500"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>

          <div className="rounded-xl bg-[#18A999]/5 p-4 text-sm leading-6 text-gray-600">
            Your tuition will be submitted with <strong>Pending</strong> status.
            It will appear in Browse Tuitions after administrator approval.
          </div>

          <button
            type="submit"
            disabled={submitting || uploading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#101B35] px-6 py-4 font-bold text-white transition hover:bg-[#18A999] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Submitting Tuition...
              </>
            ) : (
              "Submit Tuition for Approval"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
