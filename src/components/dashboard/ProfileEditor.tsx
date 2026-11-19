"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import {
  Camera,
  LoaderCircle,
  Save,
  UserRound,
  Mail,
  MapPin,
  BookOpen,
  GraduationCap,
  BriefcaseBusiness,
} from "lucide-react";

type ProfileData = {
  name: string;
  email: string;
  role: string;
  plan: string;
  image: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  city: string;
  bio: string;
  education: string;
  institution: string;
  subjects: string;
  classLevels: string;
  medium: string;
  experience: string;
  qualification: string;
  hourlyRate: string;
  availability: string;
  preferredLocation: string;
};

const initialProfile: ProfileData = {
  name: "",
  email: "",
  role: "",
  plan: "free",
  image: "",
  phone: "",
  gender: "",
  dateOfBirth: "",
  address: "",
  city: "",
  bio: "",
  education: "",
  institution: "",
  subjects: "",
  classLevels: "",
  medium: "",
  experience: "",
  qualification: "",
  hourlyRate: "",
  availability: "",
  preferredLocation: "",
};

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[#18A999] focus:ring-2 focus:ring-[#18A999]/10";

const labelClass =
  "mb-2 block text-sm font-semibold text-[var(--foreground)]";

export default function ProfileEditor({
  expectedRole,
}: {
  expectedRole: "admin" | "tutor" | "student";
}) {
  const { data: session, isPending } = useSession();

  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const getToken = async () => {
    const result = await authClient.token();
    const token = result.data?.token;

    if (!token) {
      throw new Error("Authentication token পাওয়া যায়নি। আবার login করো।");
    }

    return token;
  };

  useEffect(() => {
    if (isPending) return;

    let active = true;

    const loadProfile = async () => {
      try {
        const token = await getToken();

        const response = await fetch(`${apiUrl}/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Profile load করা যায়নি।");
        }

        if (!active) return;

        const data = result.data || {};

        setProfile({
          ...initialProfile,
          ...data,
          name: data.name || session?.user?.name || "",
          email: data.email || session?.user?.email || "",
          role: data.role || session?.user?.role || "",
          image: data.image || session?.user?.image || "",
          plan: data.plan || session?.user?.plan || "free",
        });
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Profile load failed."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [isPending, session?.user?.id, apiUrl]);

  const updateField = (field: keyof ProfileData, value: string) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("শুধু image file upload করা যাবে।");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("ছবির size 8 MB-এর কম হতে হবে।");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const token = await getToken();

      const reader = new FileReader();

      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Image read failed."));
        reader.readAsDataURL(file);
      });

      const response = await fetch(`${apiUrl}/api/uploads/image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ image: base64 }),
      });

      const result = await response.json();

      if (!response.ok || !result.data?.url) {
        throw new Error(result.message || "Image upload failed.");
      }

      setProfile((previous) => ({
        ...previous,
        image: result.data.url,
      }));

      setMessage("ছবি upload হয়েছে। Profile save করতে হবে।");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Image upload failed."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const token = await getToken();

      const response = await fetch(`${apiUrl}/api/profile/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Profile update failed.");
      }

      setMessage("Profile সফলভাবে update হয়েছে!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Profile update failed."
      );
    } finally {
      setSaving(false);
    }
  };

  if (isPending || loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle className="animate-spin text-[#18A999]" size={34} />
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Please login to view your profile.
        </h1>
      </main>
    );
  }

  if (profile.role !== expectedRole) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Access Denied
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          এই Profile তোমার account-এর জন্য নয়।
        </p>
      </main>
    );
  }

  const isTutor = expectedRole === "tutor";
  const isStudent = expectedRole === "student";

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[3px] text-[#18A999]">
            {expectedRole} portal
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-[var(--foreground)] sm:text-4xl">
            My Profile
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Manage your personal information and account details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          <section className="theme-surface rounded-3xl border p-6 shadow-sm sm:p-8">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              <div className="relative">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-[#18A999]/20 bg-[var(--surface-secondary)]">
                  {profile.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.image}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound size={48} className="text-[var(--muted)]" />
                  )}
                </div>

                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#18A999] text-white shadow-lg"
                >
                  {uploading ? (
                    <LoaderCircle size={17} className="animate-spin" />
                  ) : (
                    <Camera size={17} />
                  )}
                </label>

                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-[var(--foreground)]">
                  {profile.name || "Your Name"}
                </h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {profile.email}
                </p>
                <span className="mt-3 inline-block rounded-full bg-[#18A999]/10 px-4 py-1.5 text-xs font-bold capitalize text-[#18A999]">
                  {expectedRole}
                </span>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  JPG, PNG or WebP · Maximum 8 MB
                </p>
              </div>
            </div>
          </section>

          <section className="theme-surface rounded-3xl border p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <UserRound className="text-[#18A999]" size={23} />
              <h2 className="text-xl font-bold text-[var(--foreground)]">
                Personal Information
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  className={inputClass}
                  value={profile.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                  maxLength={100}
                />
              </div>

              <div>
                <label className={labelClass}>Email Address</label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />
                  <input
                    className={`${inputClass} pl-11 opacity-70`}
                    value={profile.email}
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  className={inputClass}
                  value={profile.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+8801XXXXXXXXX"
                />
              </div>

              <div>
                <label className={labelClass}>Gender</label>
                <select
                  className={inputClass}
                  value={profile.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Date of Birth</label>
                <input
                  type="date"
                  className={inputClass}
                  value={profile.dateOfBirth}
                  onChange={(e) => updateField("dateOfBirth", e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>City</label>
                <input
                  className={inputClass}
                  value={profile.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="Your city"
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Address</label>
                <input
                  className={inputClass}
                  value={profile.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="Your address"
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>About Me</label>
                <textarea
                  className={inputClass}
                  rows={4}
                  maxLength={500}
                  value={profile.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                  placeholder="Write a short introduction..."
                />
                <p className="mt-1 text-right text-xs text-[var(--muted)]">
                  {profile.bio.length}/500
                </p>
              </div>
            </div>
          </section>

          {(isTutor || isStudent) && (
            <section className="theme-surface rounded-3xl border p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                {isTutor ? (
                  <BriefcaseBusiness className="text-[#18A999]" size={23} />
                ) : (
                  <GraduationCap className="text-[#18A999]" size={23} />
                )}
                <h2 className="text-xl font-bold text-[var(--foreground)]">
                  {isTutor ? "Tutor Information" : "Academic Information"}
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    {isTutor ? "Highest Qualification" : "Education Level"}
                  </label>
                  <input
                    className={inputClass}
                    value={isTutor ? profile.qualification : profile.education}
                    onChange={(e) =>
                      updateField(
                        isTutor ? "qualification" : "education",
                        e.target.value
                      )
                    }
                    placeholder={isTutor ? "BSc / MSc / BBA..." : "Class / HSC / University..."}
                  />
                </div>

                <div>
                  <label className={labelClass}>Institution</label>
                  <input
                    className={inputClass}
                    value={profile.institution}
                    onChange={(e) => updateField("institution", e.target.value)}
                    placeholder="Institution name"
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    {isTutor ? "Teaching Subjects" : "Preferred Subjects"}
                  </label>
                  <input
                    className={inputClass}
                    value={profile.subjects}
                    onChange={(e) => updateField("subjects", e.target.value)}
                    placeholder="Math, English, Physics..."
                  />
                </div>

                <div>
                  <label className={labelClass}>Class Levels</label>
                  <input
                    className={inputClass}
                    value={profile.classLevels}
                    onChange={(e) => updateField("classLevels", e.target.value)}
                    placeholder="Class 6-10, HSC..."
                  />
                </div>

                <div>
                  <label className={labelClass}>Medium</label>
                  <select
                    className={inputClass}
                    value={profile.medium}
                    onChange={(e) => updateField("medium", e.target.value)}
                  >
                    <option value="">Select medium</option>
                    <option value="Bangla">Bangla</option>
                    <option value="English">English</option>
                    <option value="English Version">English Version</option>
                    <option value="Both">Both</option>
                  </select>
                </div>

                {isTutor && (
                  <>
                    <div>
                      <label className={labelClass}>Teaching Experience</label>
                      <input
                        className={inputClass}
                        value={profile.experience}
                        onChange={(e) => updateField("experience", e.target.value)}
                        placeholder="e.g. 3 years"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Hourly Rate (৳)</label>
                      <input
                        type="number"
                        min="0"
                        className={inputClass}
                        value={profile.hourlyRate}
                        onChange={(e) => updateField("hourlyRate", e.target.value)}
                        placeholder="Expected hourly rate"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Availability</label>
                      <input
                        className={inputClass}
                        value={profile.availability}
                        onChange={(e) => updateField("availability", e.target.value)}
                        placeholder="e.g. Evening, 5 days/week"
                      />
                    </div>
                  </>
                )}

                {isStudent && (
                  <div>
                    <label className={labelClass}>Preferred Location</label>
                    <div className="relative">
                      <MapPin
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                      />
                      <input
                        className={`${inputClass} pl-11`}
                        value={profile.preferredLocation}
                        onChange={(e) =>
                          updateField("preferredLocation", e.target.value)
                        }
                        placeholder="Preferred tuition location"
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {message && (
            <p className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm font-semibold text-green-600">
              {message}
            </p>
          )}

          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-500">
              {error}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#101B35] px-7 py-3.5 font-bold text-white transition hover:bg-[#18A999] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <LoaderCircle className="animate-spin" size={19} />
              ) : (
                <Save size={19} />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}