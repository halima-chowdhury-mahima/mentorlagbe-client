
"use client";

import { Suspense, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  LoaderCircle,
  Save,
  ImagePlus,
  X,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface TuitionForm {
  title: string;
  subject: string;
  classLevel: string;
  medium: string;
  location: string;
  salary: string;
  schedule: string;
  description: string;
  image: string;
}

const initialForm: TuitionForm = {
  title: "",
  subject: "",
  classLevel: "",
  medium: "",
  location: "",
  salary: "",
  schedule: "",
  description: "",
  image: "",
};

const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-[#101B35] placeholder:text-gray-400 outline-none transition focus:border-[#18A999] focus:ring-2 focus:ring-[#18A999]/15";

const labelClass =
  "mb-2 block text-sm font-bold text-[#101B35]";

function EditTuitionContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [form, setForm] = useState<TuitionForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let active = true;

    const loadTuition = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/tutor/my-tuitions`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to load tuition."
          );
        }

        const tuition = (result.data || []).find(
          (item: { _id: string }) => item._id === id
        );

        if (!tuition) {
          throw new Error(
            "Tuition not found or access denied."
          );
        }

        if (active) {
          setForm({
            title: tuition.title || "",
            subject: tuition.subject || "",
            classLevel: tuition.classLevel || "",
            medium: tuition.medium || "",
            location: tuition.location || "",
            salary: String(tuition.salary ?? ""),
            schedule: tuition.schedule || "",
            description: tuition.description || "",
            image: tuition.image || "",
          });
        }
      } catch (error) {
        if (active) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to load tuition."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    if (id) {
      void loadTuition();
    }

    return () => {
      active = false;
    };
  }, [id]);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image size must be less than 8MB.");
      event.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const base64 = await new Promise<string>(
        (resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => {
            if (typeof reader.result === "string") {
              resolve(reader.result);
            } else {
              reject(new Error("Unable to read image."));
            }
          };

          reader.onerror = () =>
            reject(new Error("Image reading failed."));

          reader.readAsDataURL(file);
        }
      );

      const response = await fetch(
        `${API_URL}/api/uploads/image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ image: base64 }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success || !result.data?.url) {
        throw new Error(
          result.message || "Image upload failed."
        );
      }

      setForm((previous) => ({
        ...previous,
        image: result.data.url,
      }));

      toast.success("Image uploaded successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Image upload failed."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.subject.trim() ||
      !form.classLevel.trim() ||
      !form.medium ||
      !form.location.trim() ||
      !form.schedule.trim() ||
      !form.description.trim()
    ) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (!form.salary || Number(form.salary) <= 0) {
      toast.error("Please enter a valid monthly salary.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/tutor/my-tuitions/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...form,
            salary: Number(form.salary),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to update tuition."
        );
      }

      toast.success("Tuition updated successfully!");
      router.push("/dashboard/tutor/my-tuitions");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F7F2]">
        <LoaderCircle className="h-9 w-9 animate-spin text-[#18A999]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard/tutor/my-tuitions"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-[#18A999]"
        >
          <ArrowLeft size={18} />
          Back to My Tuitions
        </Link>

        <div className="mb-8">
          <p className="text-sm font-extrabold tracking-widest text-[#128c80]">
            TUTOR PORTAL
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-[#101B35]">
            Edit Tuition
          </h1>

          <p className="mt-2 text-sm font-medium text-gray-600">
            Update your tuition information and save your changes.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass}>
                Tuition Title *
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. Need an English tutor for Class 8"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Subject *
              </label>

              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                placeholder="e.g. Mathematics"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Class / Grade *
              </label>

              <input
                name="classLevel"
                value={form.classLevel}
                onChange={handleChange}
                required
                placeholder="e.g. Class 8"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Medium *
              </label>

              <select
                name="medium"
                value={form.medium}
                onChange={handleChange}
                required
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">Select medium</option>
                <option value="Bangla Medium">
                  Bangla Medium
                </option>
                <option value="English Version">
                  English Version
                </option>
                <option value="English Medium">
                  English Medium
                </option>
                <option value="Madrasa">Madrasa</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Monthly Salary (৳) *
              </label>

              <input
                name="salary"
                type="number"
                min="1"
                value={form.salary}
                onChange={handleChange}
                required
                placeholder="e.g. 8000"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Location *
              </label>

              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                placeholder="e.g. Uttara, Dhaka"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Schedule *
              </label>

              <input
                name="schedule"
                value={form.schedule}
                onChange={handleChange}
                required
                placeholder="e.g. 5 days per week"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>
                Description *
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Describe the tuition requirements..."
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-bold text-[#101B35]">
              Tuition Image
            </label>

            {form.image ? (
              <div className="relative overflow-hidden rounded-2xl border border-gray-200">
                <img
                  src={form.image}
                  alt="Tuition preview"
                  className="h-56 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() =>
                    setForm((previous) => ({
                      ...previous,
                      image: "",
                    }))
                  }
                  className="absolute right-3 top-3 rounded-full bg-red-600 p-2 text-white transition hover:bg-red-700"
                  aria-label="Remove image"
                >
                  <X size={17} />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-[#F8F7F2] px-5 py-10 text-center transition hover:border-[#18A999]">
                {uploading ? (
                  <LoaderCircle
                    className="mb-3 animate-spin text-[#18A999]"
                    size={30}
                  />
                ) : (
                  <ImagePlus
                    className="mb-3 text-[#18A999]"
                    size={32}
                  />
                )}

                <span className="text-sm font-bold text-[#101B35]">
                  {uploading
                    ? "Uploading image..."
                    : "Upload an image"}
                </span>

                <span className="mt-1 text-xs font-medium text-gray-600">
                  JPG, PNG or WEBP (maximum 8MB)
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/dashboard/tutor/my-tuitions"
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-6 py-3 text-sm font-bold text-[#101B35] transition hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#18A999] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#128c80] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Save size={18} />
              )}

              {saving
                ? "Saving Changes..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function EditTuitionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8F7F2]">
          <LoaderCircle
            className="animate-spin text-[#18A999]"
            size={32}
          />
        </div>
      }
    >
      <EditTuitionContent />
    </Suspense>
  );
}
