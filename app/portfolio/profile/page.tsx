"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../../../components/Navigation";
import {
  getProfile,
  createOrUpdateProfile,
} from "../../../lib/portfolioActions";
import { PortfolioProfileFormData } from "../../../lib/types";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<PortfolioProfileFormData>({
    name: "",
    title: "",
    bio: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    twitter: "",
    profileImage: "",
    resumeUrl: "",
    isPublic: true,
    theme: "modern",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const result = await getProfile();
      if (result.success && result.data) {
        setFormData({
          name: result.data.name || "",
          title: result.data.title || "",
          bio: result.data.bio || "",
          email: result.data.email || "",
          phone: result.data.phone || "",
          location: result.data.location || "",
          website: result.data.website || "",
          linkedin: result.data.linkedin || "",
          github: result.data.github || "",
          twitter: result.data.twitter || "",
          profileImage: result.data.profileImage || "",
          resumeUrl: result.data.resumeUrl || "",
          isPublic: result.data.isPublic ?? true,
          theme: result.data.theme || "modern",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const toastId = toast.loading("Saving profile...");
    try {
      const result = await createOrUpdateProfile(formData);

      if (result.success) {
        toast.success("Profile updated successfully!", { id: toastId });
        setSuccess("Profile updated successfully!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        toast.error(result.message || "Failed to update profile", {
          id: toastId,
        });
        setError(result.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An unexpected error occurred", { id: toastId });
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
      <Navigation user={null} />

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Portfolio Profile
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Set up your basic information and portfolio settings.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-xl leading-6 font-medium text-gray-900 dark:text-white mb-6 text-center">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 sm:text-sm dark:bg-gray-700 dark:text-white p-3"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Professional Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      placeholder="e.g., Full Stack Developer"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 sm:text-sm dark:bg-gray-700 dark:text-white p-3"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Bio *
                    </label>
                    <textarea
                      name="bio"
                      id="bio"
                      rows={5}
                      required
                      placeholder="Tell visitors about yourself..."
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 sm:text-sm dark:bg-gray-700 dark:text-white p-3"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 sm:text-sm dark:bg-gray-700 dark:text-white p-3"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 sm:text-sm dark:bg-gray-700 dark:text-white p-3"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      placeholder="e.g., San Francisco, CA"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 sm:text-sm dark:bg-gray-700 dark:text-white p-3"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-xl leading-6 font-medium text-gray-900 dark:text-white mb-6 text-center">
                  Social Links
                </h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="website"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Website
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 sm:text-sm">
                        https://
                      </span>
                      <input
                        type="text"
                        name="website"
                        id="website"
                        placeholder="yourwebsite.com"
                        value={formData.website?.replace("https://", "")}
                        onChange={(e) =>
                          handleInputChange({
                            target: {
                              name: "website",
                              value: `https://${e.target.value}`,
                            },
                          } as React.ChangeEvent<HTMLInputElement>)
                        }
                        className="flex-1 block w-full rounded-none rounded-r-md border-2 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 sm:text-sm dark:bg-gray-700 dark:text-white p-3"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="linkedin"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      LinkedIn
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 sm:text-sm">
                        linkedin.com/in/
                      </span>
                      <input
                        type="text"
                        name="linkedin"
                        id="linkedin"
                        placeholder="username"
                        value={formData.linkedin?.replace(
                          "https://linkedin.com/in/",
                          ""
                        )}
                        onChange={(e) =>
                          handleInputChange({
                            target: {
                              name: "linkedin",
                              value: `https://linkedin.com/in/${e.target.value}`,
                            },
                          } as React.ChangeEvent<HTMLInputElement>)
                        }
                        className="flex-1 block w-full rounded-none rounded-r-md border-2 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 sm:text-sm dark:bg-gray-700 dark:text-white p-3"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="github"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      GitHub
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 sm:text-sm">
                        github.com/
                      </span>
                      <input
                        type="text"
                        name="github"
                        id="github"
                        placeholder="username"
                        value={formData.github?.replace(
                          "https://github.com/",
                          ""
                        )}
                        onChange={(e) =>
                          handleInputChange({
                            target: {
                              name: "github",
                              value: `https://github.com/${e.target.value}`,
                            },
                          } as React.ChangeEvent<HTMLInputElement>)
                        }
                        className="flex-1 block w-full rounded-none rounded-r-md border-2 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 sm:text-sm dark:bg-gray-700 dark:text-white p-3"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="twitter"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Twitter
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 sm:text-sm">
                        twitter.com/
                      </span>
                      <input
                        type="text"
                        name="twitter"
                        id="twitter"
                        placeholder="username"
                        value={formData.twitter?.replace(
                          "https://twitter.com/",
                          ""
                        )}
                        onChange={(e) =>
                          handleInputChange({
                            target: {
                              name: "twitter",
                              value: `https://twitter.com/${e.target.value}`,
                            },
                          } as React.ChangeEvent<HTMLInputElement>)
                        }
                        className="flex-1 block w-full rounded-none rounded-r-md border-2 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 sm:text-sm dark:bg-gray-700 dark:text-white p-3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-xl leading-6 font-medium text-gray-900 dark:text-white mb-6 text-center">
                  Portfolio Settings
                </h3>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="theme"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Theme
                    </label>
                    <select
                      name="theme"
                      id="theme"
                      value={formData.theme}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 sm:text-sm dark:bg-gray-700 dark:text-white p-3"
                    >
                      <option value="modern">Modern</option>
                      <option value="classic">Classic</option>
                      <option value="minimal">Minimal</option>
                      <option value="creative">Creative</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      name="isPublic"
                      id="isPublic"
                      checked={formData.isPublic}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                    />
                    <label
                      htmlFor="isPublic"
                      className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                    >
                      Make portfolio public
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-900 rounded-md p-4">
                <div className="text-red-800 dark:text-red-200 text-center">
                  {error}
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-900 rounded-md p-4">
                <div className="text-green-800 dark:text-green-200 text-center">
                  {success}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center space-x-6">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold py-3 px-6 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
