import { getSession } from "../../lib/auth";
import { redirect } from "next/navigation";
import Navigation from "../../components/Navigation";
import Link from "next/link";
import {
  getProfile,
  getProjects,
  getSkills,
  getExperiences,
} from "../../lib/portfolioActions";

export default async function DashboardPage() {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  // Get portfolio data
  const profileResult = await getProfile();
  const projectsResult = await getProjects();
  const skillsResult = await getSkills();
  const experiencesResult = await getExperiences();

  const profile = profileResult.data;
  const projects = projectsResult.data || [];
  const skills = skillsResult.data || [];
  const experiences = experiencesResult.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Portfolio Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your portfolio content and view your public portfolio.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link href="/portfolio/profile" className="group">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-8 w-8 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                      Profile
                    </h3>
                    <p className="text-sm text-gray-500">
                      Edit your basic info
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/portfolio/projects" className="group">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-600">
                      Projects
                    </h3>
                    <p className="text-sm text-gray-500">
                      {projects.length} projects
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/portfolio/skills" className="group">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-8 w-8 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-purple-600">
                      Skills
                    </h3>
                    <p className="text-sm text-gray-500">
                      {skills.length} skills
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/portfolio/experience" className="group">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-8 w-8 text-orange-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-orange-600">
                      Experience
                    </h3>
                    <p className="text-sm text-gray-500">Work history</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Portfolio Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Portfolio Overview */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Portfolio Overview
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Profile Complete
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        profile
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {profile ? "Complete" : "Incomplete"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Projects</span>
                    <span className="text-sm font-medium text-gray-900">
                      {projects.length}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Skills</span>
                    <span className="text-sm font-medium text-gray-900">
                      {skills.length}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Experience</span>
                    <span className="text-sm font-medium text-gray-900">
                      {experiences.length}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Portfolio Status
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        profile?.isPublic
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {profile?.isPublic ? "Public" : "Private"}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  {profile ? (
                    <Link
                      href={`/portfolio/view/${user._id}`}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded text-center block"
                    >
                      View Public Portfolio
                    </Link>
                  ) : (
                    <Link
                      href="/portfolio/profile"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center block"
                    >
                      Complete Profile Setup
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Quick Start Guide
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-4 h-4 rounded-full mt-1 ${
                          profile ? "bg-green-400" : "bg-gray-300"
                        }`}
                      ></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-900">
                        Set up your profile information
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-4 h-4 rounded-full mt-1 ${
                          projects.length > 0 ? "bg-green-400" : "bg-gray-300"
                        }`}
                      ></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-900">Add your projects</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-4 h-4 rounded-full mt-1 ${
                          skills.length > 0 ? "bg-green-400" : "bg-gray-300"
                        }`}
                      ></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-900">List your skills</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-4 h-4 rounded-full mt-1 ${
                          experiences.length > 0
                            ? "bg-green-400"
                            : "bg-gray-300"
                        }`}
                      ></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-900">
                        Add work experience
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
