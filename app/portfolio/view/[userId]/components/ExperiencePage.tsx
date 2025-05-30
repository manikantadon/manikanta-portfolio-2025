import { notFound } from "next/navigation";
import PortfolioNavigation from "./PortfolioNavigation";
import { getPortfolioData } from "../page";

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

// Helper function to format dates
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default async function ExperiencePage({ params }: PageProps) {
  const { userId } = await params;
  const portfolioData = await getPortfolioData(userId);

  if (!portfolioData) {
    notFound();
  }

  const { profile, experiences } = portfolioData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100 text-slate-800">
      {/* Navigation */}
      <PortfolioNavigation userId={userId} userName={profile.name} />

      <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl mb-12 p-8 md:p-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b-2 border-indigo-300 pb-3">
              Professional Experience
            </h2>

            {experiences.length === 0 ? (
              <p className="text-slate-600 text-center py-8">
                No experience entries available.
              </p>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-0 md:left-1/2 h-full w-0.5 bg-indigo-200 transform -translate-x-1/2"></div>

                <div className="space-y-12">
                  {experiences.map((experience, index) => (
                    <div key={experience._id} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-indigo-500 rounded-full transform -translate-x-1/2 border-4 border-indigo-100"></div>

                      <div
                        className={`md:flex items-start ${
                          index % 2 === 0 ? "md:flex-row-reverse" : ""
                        }`}
                      >
                        {/* Date column */}
                        <div className="md:w-1/2 pb-8 md:pb-0 md:px-8 text-center">
                          <div className="inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg font-semibold mb-2">
                            {formatDate(experience.startDate)} -{" "}
                            {experience.endDate
                              ? formatDate(experience.endDate)
                              : "Present"}
                          </div>
                          {experience.location && (
                            <div className="text-slate-500 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-4 h-4 mr-1"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {experience.location}
                            </div>
                          )}
                        </div>

                        {/* Content column */}
                        <div
                          className={`md:w-1/2 md:px-8 ${
                            index % 2 === 0 ? "text-right" : "text-left"
                          }`}
                        >
                          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                            <h3 className="font-bold text-xl text-sky-700 mb-1">
                              {experience.title}
                            </h3>
                            <h4 className="font-medium text-indigo-600 mb-4">
                              {experience.company}
                            </h4>

                            {experience.description && (
                              <p className="text-slate-600 mb-4 whitespace-pre-line">
                                {experience.description}
                              </p>
                            )}

                            {experience.achievements &&
                              experience.achievements.length > 0 && (
                                <div className="mt-4">
                                  <h5 className="font-semibold text-slate-700 mb-2">
                                    Key Achievements:
                                  </h5>
                                  <ul
                                    className={`space-y-2 ${
                                      index % 2 === 0
                                        ? "text-right"
                                        : "text-left"
                                    }`}
                                  >
                                    {experience.achievements.map(
                                      (achievement, i) => (
                                        <li
                                          key={i}
                                          className="flex items-start"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            className={`w-5 h-5 text-green-500 ${
                                              index % 2 === 0
                                                ? "ml-auto order-2 ml-2"
                                                : "mr-2"
                                            }`}
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                          <span className="text-slate-600">
                                            {achievement}
                                          </span>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}

                            {experience.technologies &&
                              experience.technologies.length > 0 && (
                                <div className="mt-4">
                                  <h5 className="font-semibold text-slate-700 mb-2">
                                    Technologies Used:
                                  </h5>
                                  <div
                                    className={`flex flex-wrap gap-2 ${
                                      index % 2 === 0
                                        ? "justify-end"
                                        : "justify-start"
                                    }`}
                                  >
                                    {experience.technologies.map((tech, i) => (
                                      <span
                                        key={i}
                                        className="bg-sky-50 text-sky-700 text-xs px-3 py-1 rounded-full font-medium"
                                      >
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
