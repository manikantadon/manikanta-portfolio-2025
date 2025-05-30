import { notFound } from "next/navigation";
import PortfolioNavigation from "./PortfolioNavigation";
import { getPortfolioData } from "../page";

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function SkillsPage({ params }: PageProps) {
  const { userId } = await params;
  const portfolioData = await getPortfolioData(userId);

  if (!portfolioData) {
    notFound();
  }

  const { profile, skills } = portfolioData;

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  // Sort categories alphabetically
  const sortedCategories = Object.keys(skillsByCategory).sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100 text-slate-800">
      {/* Navigation */}
      <PortfolioNavigation userId={userId} userName={profile.name} />

      <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl mb-12 p-8 md:p-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b-2 border-indigo-300 pb-3">
              Skills & Expertise
            </h2>

            {skills.length === 0 ? (
              <p className="text-slate-600 text-center py-8">
                No skills available.
              </p>
            ) : (
              <div className="space-y-12">
                {sortedCategories.map((category) => (
                  <div key={category} className="mb-10">
                    <h3 className="text-2xl font-semibold text-indigo-700 mb-6">
                      {category}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {skillsByCategory[category].map((skill) => (
                        <div
                          key={skill._id}
                          className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-lg text-sky-700">
                              {skill.name}
                            </h4>
                            {skill.level && (
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  skill.level === "Expert"
                                    ? "bg-green-100 text-green-800"
                                    : skill.level === "Advanced"
                                    ? "bg-blue-100 text-blue-800"
                                    : skill.level === "Intermediate"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {skill.level}
                              </span>
                            )}
                          </div>

                          {skill.description && (
                            <p className="text-slate-600 text-sm">
                              {skill.description}
                            </p>
                          )}

                          {skill.yearsOfExperience && (
                            <div className="mt-3 text-xs text-slate-500">
                              {skill.yearsOfExperience}{" "}
                              {skill.yearsOfExperience === 1 ? "year" : "years"}{" "}
                              of experience
                            </div>
                          )}

                          {/* Skill progress bar */}
                          {skill.proficiency && (
                            <div className="mt-3">
                              <div className="w-full bg-slate-200 rounded-full h-2.5">
                                <div
                                  className="bg-gradient-to-r from-sky-500 to-indigo-600 h-2.5 rounded-full"
                                  style={{ width: `${skill.proficiency}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>Beginner</span>
                                <span>Expert</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-slate-400 hover:text-slate-200 transition-colors">
              © {new Date().getFullYear()} {profile.name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
